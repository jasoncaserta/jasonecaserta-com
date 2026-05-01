---
title: "Building PickGPU: 2,300 Commits of War Stories"
description: "What I learned shipping a GPU price aggregator across six retailers, two years, and one very persistent Cloudflare wall."
pubDate: 2026-04-25
---

[PickGPU](https://pickgpu.com) is a GPU shopping assistant that aggregates benchmark data from Tom's Hardware and live pricing from Amazon, eBay, Best Buy, Newegg, and Micro Center. You set a budget, pick your resolution, and it ranks every card by FPS-per-dollar. Simple enough idea. What followed was 2,300 commits and counting.

Here are the war stories.

---

## Day 1: 53 Commits and a CORS Crisis

The first deploy to EC2 on June 22, 2023 generated 53 commits in a single day. The React frontend couldn't talk to the FastAPI backend. What followed was a frenzy of confusion between public and private IPs, CORS configuration, gunicorn bindings, and nginx — all at once, all for the first time.

Commits that day read like a debugging stream of consciousness:

- `adjust cors`
- `change ui so that it accesses the backend instead of localhost`
- `use private ip for gunicorn`
- `use public ip`
- `change gunicorn to public ip`
- `revert to private ip`

The root issue: the frontend was pointing at `localhost`, gunicorn was bound to the wrong interface, and the CORS config was rejecting the EC2 public IP. Each fix revealed a different layer of the same problem.

We'd initially tried putting the React app on Vercel (there's a `vercel.json` in the history and then a "remove ui from vercel" commit the next day). In the end everything went behind nginx on a single EC2 box, which is what it still runs on today.

---

## `PERFECT FILTERS`

One commit in the early history is just: `PERFECT FILTERS`. All caps. No other description.

Before it: eight commits in a row about broken budget sliders, filter state not propagating, wrong sort directions, and null values crashing the table. After it: silence. The relief is palpable even from the git log.

The filter architecture went through three rewrites. The first pass stored filter state in component state that didn't survive route changes. The second used URL query params but the budget slider kept resetting to zero. The third version — which is what shipped — synced everything through URL params with proper default handling. That's the one that got the all-caps commit.

---

## Tom's Hardware vs. Cloudflare

The entire benchmark side of the site depends on Tom's Hardware's GPU hierarchy pages. For the first year, a simple `requests.get()` worked fine. Then Tom's Hardware moved behind Cloudflare's bot protection, and the scraper started returning challenge pages instead of HTML.

The fix was to replace `requests` with Playwright — a headless Chromium browser that actually renders the page and waits for JavaScript:

```python
with sync_playwright() as playwright:
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context(
        user_agent='Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) ...',
        locale='en-US',
    )
    page = context.new_page()
    page.goto(url, wait_until='domcontentloaded')
```

This added Chromium to the Docker image (adding ~300MB to the image size) and made scrapes meaningfully slower. But it worked. The commit message, written in the middle of the night: `use playwrite to combat cloudflare blocking toms from scraping`. The typo is still there.

The irony: PickGPU itself runs behind Cloudflare. A headless browser trying to screenshot pickgpu.com today gets the exact same challenge page.

---

## The Micro Center Saga

Micro Center was added as a merchant in April 2026. It lasted about six hours before getting blocked. The timeline in the git log:

```
add best buy, newegg, and micro center merchants
update scrapers to not get blocked        ← added Playwright fallback
disable microcenter for the time being    ← blocked anyway
bound microcenter playwright fallback     ← made the fallback more aggressive
fix startup microcenter run validation    ← edge case in startup path
```

Five commits in one day about a single retailer. Micro Center's anti-bot detection is more aggressive than the others — it returns a 200 with empty results rather than an error, which means you have to validate the response shape to know you've been blocked. The Playwright fallback is now the primary path.

---

## Amazon: Enable, Disable, Repeat

Amazon was the most volatile source. The git log is full of:

```
temporarily enable Amazon scrape
add partial scrape and disable amazon
disable amazon
increase timeout to 60s for amazon and enable scraping for live server
```

Amazon's bot detection is session-based and rate-limited in ways that are hard to predict. The scraper would work for a few days and then silently start returning empty results. The eventual fix was switching from a custom scraper to `amzpy`, a purpose-built library for this. Even then, Amazon stays disabled more often than it's on.

---

## The CSV-First Architecture

An early decision that paid off repeatedly: data from every scrape goes into CSVs before anything else touches it. SQLite is rebuilt from those CSVs on each run. The commit that formalized this was titled `Make CSVs the source of freshness determination`.

This came out of a debugging session where the database had drifted from what the scrapers were actually producing. Because CSVs are files, you can `open any day's output in a spreadsheet, spot outliers immediately, and debug without touching the database. git diff on a CSV also gives you a clean view of what changed between runs.

The tradeoff: startup is slower because SQLite gets rebuilt. For a daily scrape that's irrelevant.

---

## The ThreadPool Contention Bug

FastAPI on top of AnyIO has a thread pool for running sync code in async contexts. The default limit is 40 threads. When visitor activity tracking got added — a synchronous database write on every request — it was wrapped in a call to `wait_for_api()` that blocked one thread per request until the API was ready.

Under any real load this deadlocked. The scheduler's background jobs also ran on the thread pool. The symptom: the server would boot, handle a few requests, then stop responding while everything waited for a thread that was waiting for everything else.

The fix was two lines:

```python
anyio.to_thread.current_default_thread_limiter().total_tokens = 100
# and remove wait_for_api() from the hot path
```

The commit: `fix threadpool contention`. One of those bugs that's obvious once you know where to look and completely invisible until then.

---

## Listing Scoring and the Fake GPU Problem

eBay and Amazon listings are not reliable. People list GPU mining rigs, incomplete bundles, "for parts" cards, and occasionally just random things with "RTX 4090" in the title. The listing scoring system grew over time to handle all of this.

The `suspicious terms` list in the codebase expanded commit by commit: mining rigs, part numbers that appear in broken listings, price-to-performance ratios that are physically impossible, seller feedback thresholds. Sellers with under 50 feedback score or below 50% positive rating get filtered out. Zero-dollar listings get filtered. Anything priced above 2× the typical retail gets flagged.

Each entry in that filter list represents a specific listing that made it through and looked wrong.

---

## What I'd Do Differently

**Separate the scrape job from the API process.** Right now both run in the same Docker container, which means a broken scrape can affect API availability. They should be separate services with the API reading from shared storage.

**Start with rate limiting.** It was added in PR #129 after the site got some traffic. It should have been there from day one.

**Playwright from the start for any site with bot protection.** Starting with `requests` and switching later means rewriting the scraper twice. If a site has Cloudflare, just start with Playwright.

---

PickGPU is at [pickgpu.com](https://pickgpu.com). The GPU market makes it worth keeping alive — prices still move enough week to week that having a ranked, aggregated view of all the options is genuinely useful.
