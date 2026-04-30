# [jasonecaserta-com](https://jasoncaserta.github.io/jasonecaserta-com/)


Personal website and blog built with [Astro](https://astro.build).

## Stack

- **Framework:** Astro (static output)
- **Content:** Markdown blog posts in `src/content/blog/`
- **Hosting:** GitHub Pages
- **URL:** [https://jasoncaserta.github.io/jasonecaserta-com/](https://jasoncaserta.github.io/jasonecaserta-com/)

## Local Development

```sh
npm install
npm run dev       # dev server at localhost:4321
npm run build     # production build to ./dist/
npm run preview   # preview production build locally
```

## Project Structure

```
src/
├── components/   # Astro components (Header, Footer, etc.)
├── content/
│   └── blog/     # Markdown blog posts
├── layouts/      # Page layouts
├── pages/        # Routes
└── styles/       # Global CSS
```

## Adding a Blog Post

Create a new `.md` file in `src/content/blog/` with this frontmatter:

```markdown
---
title: "Post Title"
description: "Short description"
pubDate: YYYY-MM-DD
heroImage: "../../assets/blog-placeholder-1.jpg"
---
```

<!-- Trigger redeploy -->
