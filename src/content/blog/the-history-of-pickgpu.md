---
title: "The History of pickGPU"
description: "The journey of pickGPU from a simple Google Sheet to a modern GPU recommendation engine."
pubDate: 2026-04-29
heroImage: "../../assets/history-of-pickgpu/pickgpu.com_(1080p).png"
---

The journey of building [pickGPU](https://pickgpu.com) started with a problem: I just wanted to know which graphics card to buy.

## Phase 0: The Google Sheet

Before there was a website, there was a spreadsheet. I was trying to figure out which GPU offered the best value, so I started pulling benchmark data from Tom's Hardware and comparing it against live prices to calculate a simple $/fps metric.

![The original Google Sheet that started it all](../../assets/history-of-pickgpu/Screenshot_2026-04-29_at_1.08.30_PM.png)

A coworker noticed what I was doing and suggested it might be useful to others. That was the spark. I was excited to dive into my first real personal project.

## The MVP: May - August 2023

Coming from a backend background, building a full web application was daunting. I reached out to my friend and coworker, Kuba, who was also looking for a project to sink his teeth into. We decided to team up: I would handle the backend while Kuba worked on the frontend.

The first commit was made on May 4, 2023. From there, we spent the next few months turning the spreadsheet idea into something people could actually use in a browser.

By August 4, 2023, we had our first prototype—a Flask and React application. It was basic but functional: Tom's Hardware benchmark data, Amazon and eBay price data, and a sortable table.

![Our first homepage](../../assets/history-of-pickgpu/localhost_5175_(1080p).png)

At this stage, the "Help me pick a GPU" feature wasn't working yet, but the core table and filter drawer were live. We were even starting to pull in specific listings and deal data.

![The early table and filter drawer](../../assets/history-of-pickgpu/localhost_5175_(1080p)_(1).png)

![GPU listings in the early table](../../assets/history-of-pickgpu/localhost_5175_analyze(1080p).png)

## Refinements: August - October 2023

By late 2023, pickGPU started evolving from a "sortable table" into a "guided recommendation engine." We added a suggestions survey flow, improved our routing, and started building out historical price tracking.

The UI received a significant refresh, adding dedicated routes for specific GPUs, plots for price-to-performance visualization, and a more polished navigation experience.

![The refreshed homepage](../../assets/history-of-pickgpu/localhost_5175_(1080p)_(2).png)

![A better interface for the GPU table](../../assets/history-of-pickgpu/localhost_5175_(1080p)_(3)_1.png)

We introduced "Top Picks" and a survey to help users find GPUs that matched their specific needs.

![Top Picks and Survey features](../../assets/history-of-pickgpu/localhost_5175_(1080p)_(4).png)
![The recommendation survey](../../assets/history-of-pickgpu/localhost_5175_(1080p)_(6).png)

We also added a plot view to help visualize the value of different cards.

![The GPU value plot view](../../assets/history-of-pickgpu/localhost_5175_(1080p)_(5).png)

## The Reddit Launch

On November 11, 2023, we finally felt ready to share pickGPU with the world. We posted to the [r/webdev](https://www.reddit.com/r/webdev/comments/17t55mk/roast_my_website_built_to_help_you_pick_your_next/) subreddit.

It did not go exactly as expected. The feedback was "honest," to say the least, but it gave us a mountain of improvements to work on. We realized that while our desktop experience was getting there, our mobile view still had major gaps.

![Early mobile improvements](../../assets/history-of-pickgpu/localhost_5175_(iPhone_12_Pro)_(2).png)
![Mobile view challenges](../../assets/history-of-pickgpu/localhost_5175_(iPhone_12_Pro)_(1).png)

We struggled with the table view on mobile, eventually deciding to hide it on phones until we could find a better layout.

![Table view mobile issues](../../assets/history-of-pickgpu/localhost_5175_(iPhone_12_Pro)_(4).png)
![Plot view mobile issues](../../assets/history-of-pickgpu/localhost_5175_(iPhone_12_Pro)_(3).png)

## The Hiatus

After the intensity of the launch and the subsequent feedback, the project entered a period of quiet. Life got busy, and for a while, pickGPU sat as it was—a useful tool, but one that needed a deeper architectural shift to truly scale and provide the experience we wanted. This break allowed for a fresh perspective when it was finally time to return.

## The 2026 Revival

In early 2026, the revival began. This wasn't just a few tweaks; it was a massive architectural rebuild. We moved the backend from Flask to FastAPI, transitioned to a more robust SQLite/CSV data pipeline, and completely modernized the frontend with React Query and TanStack Router.

This technical foundation was crucial for creating a more resilient and faster application.

![The modern pickGPU homepage](../../assets/history-of-pickgpu/localhost_5175_(1080p)_(7).png)

## Final Polish and the Modern Experience

With the new architecture in place, we turned our focus to the final polish. This era brought the modern pickGPU experience you see today: a clearer homepage, top picks, table and compare views, custom benchmark support, pricing across multiple retailers, and—finally—a responsive design where mobile is no longer an afterthought.

![The current pickGPU homepage](../../assets/history-of-pickgpu/pickgpu.com_(1080p).png)

The table view finally became what we had envisioned years ago—dense, informative, and easy to filter, with listing previews built directly into the workflow.

![The current Top Picks view](../../assets/history-of-pickgpu/pickgpu.com_(1080p)_(5).png)

![The current table view](../../assets/history-of-pickgpu/pickgpu.com_(1080p)_(1).png)

The latest version also includes workflows that did not exist in the original project, including side-by-side GPU comparisons and custom benchmark uploads that let users bring their own performance data.

![The current compare view](../../assets/history-of-pickgpu/pickgpu.com_(1080p)_(2).png)

![The current custom benchmark view](../../assets/history-of-pickgpu/pickgpu.com_(1080p)_(3).png)

The about page also became part of the product, explaining how prices, benchmarks, and pickGPU Score work instead of leaving users to infer the logic from the table.

![The current about page](../../assets/history-of-pickgpu/pickgpu.com_(1080p)_(4).png)

![The current mobile homepage](../../assets/history-of-pickgpu/pickgpu.com_(iPhone_12_Pro).png)

pickGPU has come a long way from that first Google Sheet, and it's been an incredible learning experience every step of the way.
