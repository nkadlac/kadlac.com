# kadlac.com

Personal website for Nate Kadlac - migrated from Framer to Astro.

## Tech Stack

- **Framework:** Astro (static site generator)
- **Styling:** Tailwind CSS
- **Hosting:** Cloudflare Pages (free, unlimited bandwidth)
- **Forms:** Kit.com embeds (newsletter signup)
- **Payments:** External Stripe links (no embedded checkout)
- **CMS:** None - markdown files in Git

## Design System

### Colors
```css
--color-background: #ffe180;    /* Warm yellow/gold */
--color-text: #1c1706;          /* Dark brown */
```

### Typography
- **Display/Headlines:** General Sans
- **Headings/UI:** Space Grotesk (weights: 400, 500, 600, 700)
- **Body:** Inter
- **Serif accent:** EB Garamond

### Spacing & Radii
- Border radius: 16-24px (rounded corners throughout)
- Generous whitespace

## URL Structure (must match existing Framer site exactly)

```
/                               → Homepage
/articles                       → Articles listing
/articles/[slug]                → Individual article
/notes/[slug]                   → Book notes
/my/toolkit                     → Toolkit page (75+ items with category filter)
/newsletter                     → Newsletter signup
/hire                           → Services/work with me
/projects                       → Projects listing
/projects/[slug]                → Individual project
/about                          → About page
/now                            → Now page
```

## Content Collections

### Articles (~20+)
Categories: Design/Branding/Creativity, Personal Writing, Visual Communication/Drawing, Book Notes

Frontmatter:
```yaml
title: string
date: date
category: "design" | "personal" | "visual" | "books"
description: string (optional)
```

### Book Notes
Frontmatter:
```yaml
title: string
author: string
rating: number (out of 10)
amazonUrl: string
coverImage: string
```

Sections: Summary, chapter breakdowns, favorite quotes, detailed notes

### Toolkit Items
Stored as JSON/YAML with:
```yaml
name: string
category: "books" | "health" | "design" | "drawing" | "writing" | "tech"
description: string
url: string (affiliate link)
image: string
reviewUrl: string (optional - links to a review article)
```

### Projects
Frontmatter:
```yaml
title: string
client: string
description: string
coverImage: string
```

## Integrations

### Kit.com (Newsletter)
Embed Kit's form script on newsletter page and homepage:
```html
<script async data-uid="FORM_ID" src="https://SUBDOMAIN.kit.com/FORM.js"></script>
```

### Stripe
Link to external Stripe Payment Links for services. No embedded checkout.

## Page Layouts (11 distinct templates)

### 1. Homepage (`/`)
- Hero section with headline + newsletter CTA
- "What I'm building" section with project cards
- Social proof / featured work
- Footer with newsletter signup

### 2. About (`/about`)
- Hero: "It's about time we met" + image carousel on right
- Social links (X, LinkedIn, YouTube)
- Guest appearances grid (podcast/media logos + episode titles)
- Biography section (full-width text)
- Footer

### 3. Articles Listing (`/articles`)
- Categorized list layout (NOT grid)
- 4 category sections: Design/Branding, Personal Writing, Visual Communication, Book Notes
- Article titles as links, minimal metadata (only latest shows date)

### 4. Article Detail (`/articles/[slug]`)
- Centered single-column layout (~75% width, max 1200px)
- Hero image (full-width)
- Large headline (Space Grotesk, 120px desktop → 50px mobile)
- Body text: 20-22px, 1.5em line height
- Pull quotes / blockquotes with distinct styling
- Embedded images break up text
- Related articles in footer area

### 5. Book Notes (`/notes/[slug]`)
- Book cover image + rating (X/10)
- "Read more on Amazon" CTA
- Structured sections:
  - Summary overview
  - Chapter/section breakdowns
  - "Favorite Quotes" section
  - Detailed notes with excerpts
- Related reading recommendations

### 6. Toolkit (`/my/toolkit`)
- Category filter tabs (All/Books/Health/Design/Drawing/Writing/Tech)
- Responsive grid (4 columns desktop, adapts mobile)
- Product cards: image, category tag, description
- Dual CTAs: "VIEW" (affiliate link) + "REVIEW" (optional, links to article)
- No gating - fully accessible

### 7. Projects Listing (`/projects`)
- Horizontal carousel/slider with navigation arrows
- 2-3 cards visible per view (desktop)
- Card: thumbnail, project name, service tags
- 40px gap between cards

### 8. Project Detail (`/projects/[slug]`)
- Project hero: title, description, service tags (e.g., "Branding • Website Design")
- Project images grid (2-column desktop, single mobile)
- About section

### 9. Hire (`/hire`)
- Metaphorical hero (branding = homebuilding)
- Client logos (Target, Best Buy, MPR, etc.)
- 3 service tiers as cards:
  - Brand Teardown ($750)
  - Design Partnership ($5,000/mo)
  - Custom Projects ($15k-50k)
- Portfolio highlights
- External Stripe payment links

### 10. Newsletter (`/newsletter`)
- "Design smarter, Not harder" headline
- Value proposition for solopreneurs
- Single email input form (Kit.com embed)
- Testimonials/social proof
- "2-3x every week. NO SPAM" trust signal

### 11. Now (`/now`)
- Simple list page
- "What I'm doing now" headline
- Last updated date (e.g., "DEC 2024")
- Bullet list of current focus areas
- Brief bio section

## Key Implementation Notes

- **Zero redirects needed** - URL structure matches Framer exactly
- **Minimal JS** - Static HTML/CSS, JS only for toolkit category filter + projects carousel
- **Pixel-perfect goal** - Recreate Framer design as closely as possible
- **Mobile responsive** - Breakpoints at 810px and 1200px

## Build & Deploy

```bash
npm run dev      # Local development
npm run build    # Build static site to dist/
npm run preview  # Preview production build
```

Deploy: Push to GitHub → Cloudflare Pages auto-builds from `main` branch
