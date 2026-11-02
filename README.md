# Tiesha Tripathi — In good curiosity.

The original portfolio migrated to React + Vite, GSAP ScrollTrigger, and Motion for React. Original copy, project records, photographs, demo video, social links, FormSubmit contact form, and the session-only photo picker are retained.

## Local development

Requires Node.js 22 and npm.

```sh
npm ci
npm run dev
```

## Production preview and checks

```sh
npm run lint
npm run test:content
npm run build
npm run preview
```

Browser tests start a production preview automatically on port 5175 when one is not already running:

```sh
npx playwright install chromium
npm test
```

Tests cover four viewports, animated scrolling and resizing, image overflow, preserved content and links, modal focus, keyboard controls, whole-card leadership expansion, form validation, reduced motion, and axe WCAG A/AA checks. Reports and screenshots are written to `playwright-report/` and `test-results/`.

## Implementation

- `src/Content.jsx` keeps the original sections and copy from `a3d519c`.
- `src/data.js` holds the exact project descriptions and role metadata. The original third project record remains archived in this module; the original page displayed only two selected projects.
- `src/components.jsx` owns the hero, project cards and native dialog, leadership accordions, and experience cards.
- `src/Heading.jsx` supplies word masks without changing text order.
- `src/main.jsx` coordinates responsive scroll timelines, navigation and motion preference.
- `public/` retains byte-identical original assets and responsive WebP variants. The extracted embedded hero portrait is also retained. `scripts/optimize-images.mjs` regenerates variants and corrects the sideways event photo in display copies only.
- `scripts/content-baseline.json` records original text, links and SHA-256 hashes for migration checks.

Native scrolling is retained. There is no artificial pinned spacer after the hero. Large movements and pointer tilt are disabled when the OS requests reduced motion; the visible motion toggle also pauses scripted and CSS animations. GSAP contexts clean up on preference and breakpoint changes. The video loads only when requested and never autoplays.

## GitHub Pages — approval before publication

`.github/workflows/pages.yml` checks pull requests and builds the static site. Only a successful run on `main` can reach the deployment job; feature branches and PRs cannot publish. No production settings were changed as part of this migration.

When the migration is approved, select **Settings → Pages → Build and deployment → Source: GitHub Actions** before merging. This is required because the old site served the repository root directly, while Vite must publish `dist/`. Then merge the PR; the workflow will lint, verify content, build, run browser tests, upload reports, and deploy the built artifact automatically. Keep any existing domain configuration. Do not dispatch a workflow on `main` until publication is approved.

The contact form still uses the original FormSubmit destination and service behavior. Automated tests validate it without sending a real message. No reference-site content or personal claims were copied into this portfolio.
