# Migration verification

Verified on 2 November 2026 against the Vite production build. Source of truth: original portfolio commit `a3d519c`; all six original commits were inspected before implementation.

## Results

| Check | Result |
| --- | --- |
| Production build | Pass |
| ESLint, including React Hooks rules | Pass, no warnings |
| Original content / original asset SHA-256 checks | Pass |
| Chromium 1440 × 900 | 3 tests passed |
| Chromium 768 × 1024 | 3 tests passed |
| Chromium 390 × 844 | 3 tests passed |
| Chromium 320 × 740 | 3 tests passed |
| axe WCAG 2 A/AA and 2.1 AA scans, page and project dialog, all sizes | No violations detected |
| Production dependency audit | No vulnerabilities reported |

The 12 browser tests cover original visible text fragments, role copy, original links, asset loading, horizontal overflow and image containment, project details and demo-video wiring, repository link, Escape handling, modal focus and restoration, whole-card leadership interaction by photo/text/keyboard, mobile navigation, native form validation, reduced motion, scroll animation, and resizing. The FormSubmit form was not submitted; tests do not send email. Browser tests run against the production server, not the Vite development server.

Visual review included desktop/mobile hero composition, numbered section flow, About photo alignment, mobile experience cards, and the expanded TEDx card. The original event JPEG is sideways; display derivatives rotate it correctly without altering the original file. Original files remain available at their original public URLs.

## Motion and performance

- Masked hero name, coordinated portrait entrance, layered cards and scroll-linked parallax; no pinned empty scroll interval.
- Word-mask typography, changing chapter atmosphere, photo crop/rotation choreography, project image wipes and spring-driven pointer tilt.
- Project dialog grows from the clicked card rectangle; detail text and media enter in sequence. Native dialog semantics plus keyboard controls are retained.
- Experience cards reveal across the timeline with a growing accent rail.
- Glass leadership cards animate measured content height and photograph scale. The entire visible surface toggles expansion.
- Motion preference changes revert GSAP contexts. OS reduced motion and the visible pause control suppress scripted and CSS motion. Touch devices do not receive pointer tilt.
- Responsive WebP images, reserved image geometry, lazy-loaded below-fold photos, and on-demand video. The hero's 640px WebP is approximately 98 KB versus the original 2.2 MB embedded PNG.

## References and limits

The Ashutosh Mujumdar Framer portfolio linked from Wall of Portfolios was inspected directly. Both supplied Pinterest links resolved to their clip pages; Pinterest's sign-up overlay prevented detailed frame-by-frame inspection. The implementation uses comparable layering, masked typography, spatial card motion and paced section transitions while retaining this portfolio's content and palette.

Automated browser coverage is Chromium. Safari and Firefox have not been run. Automated accessibility scans supplement, and do not replace, human assistive-technology testing. The npm audit reports six moderate findings in development-only ESLint/minimatch dependencies; production dependencies have none. No incompatible major dependency overrides were applied to hide those findings.

## Review screenshots

![Desktop hero](qa/desktop-hero.png)

![Desktop About](qa/desktop-about.png)

![Mobile hero](qa/mobile-hero.png)

![Mobile leadership](qa/mobile-leadership.png)

## Publication

No merge or deployment was performed. The feature branch has a PR validation workflow and a main-only Pages deployment job. Before an approved merge, set the repository's Pages source to **GitHub Actions** as described in the README. The existing production settings have not been changed.
