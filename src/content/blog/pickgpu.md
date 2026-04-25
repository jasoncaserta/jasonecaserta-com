---
title: "Building PickGPU: A GPU Shopping Assistant"
description: "GPU shopping is painful. Too many SKUs, volatile prices, no single source of truth. Here's how I built a tool to fix that."
pubDate: 2025-04-25
heroImage: "../../assets/blog-placeholder-1.jpg"
---

Buying a GPU is harder than it should be. You're juggling benchmark sites, six different retailer tabs, fluctuating prices, and the eternal "used vs. new" debate — all at once. I built [PickGPU](https://pickgpu.com) to collapse that into one page.

## What It Does

PickGPU aggregates GPU benchmark data from Tom's Hardware and live pricing from Amazon, eBay, Best Buy, Newegg, and Micro Center. You filter by budget, VRAM, performance tier, and whether you want new or used cards. The app ranks every result by a value score: **FPS per dollar**, so the best bang-for-your-buck options rise to the top automatically.

## How It Works

The backend is a **FastAPI** service that runs daily scrape jobs across all six sources. Benchmark data and pricing land in CSVs first (easy to inspect, version, and diff), then get merged into a **SQLite** working cache that the API queries at request time.

The frontend is **React + TypeScript** built with Vite — a single-page app with filter controls that hits the API and renders a ranked, sortable results table.

The whole thing runs in **Docker Compose** on an **AWS EC2** instance, with **Cloudflare** sitting in front for CDN and DDoS protection.

```
┌──────────────┐    daily scrape    ┌────────────────────┐
│  Tom's HW    │ ─────────────────► │                    │
│  Amazon      │                    │  FastAPI backend   │
│  eBay        │ ─────────────────► │  SQLite cache      │
│  Best Buy    │                    │  Docker Compose    │
│  Newegg      │ ─────────────────► │  AWS EC2           │
│  Micro Center│                    │                    │
└──────────────┘                    └────────────┬───────┘
                                                 │ JSON API
                                    ┌────────────▼───────┐
                                    │  React + Vite SPA  │
                                    │  Filter + rank UI  │
                                    └────────────────────┘
```

## What I Learned

Scraping at scale is mostly about resilience. Retailers change their markup constantly, rate-limit aggressively, and occasionally just go down. I ended up building per-scraper retry logic and a simple staleness tracker so the UI can surface when a retailer's data is fresh vs. hours old.

The CSV-first data model was a deliberate choice — it means I can open any day's prices in a spreadsheet, spot outliers, and debug without touching the database. SQLite gets rebuilt from CSVs on each run, which keeps the schema simple and the data auditable.

## Try It

[pickgpu.com](https://pickgpu.com) — find your next GPU without the tab sprawl.
