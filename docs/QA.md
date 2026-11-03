# Portfolio refinement verification

Verified against the Vite production build on 3 November 2026. The original portfolio and the four owner-supplied screenshots remain the design/content reference. The initial migration inspected all six original Git commits; original commit `a3d519c` remains the asset/content baseline.

## Current revision

- Leadership descriptions are rewritten around the recorded responsibilities: council/student coordination, event planning and budgets, external partner communication; TEDx speaker hospitality, stage logistics, production schedules and coordination with media/marketing/design; GDG CyberStorm logistics, mentor connections, outreach and campus developer sessions. No sponsor contracts, attendance figures, awards or other new achievements are claimed. The glass cards, photographs and whole-card expansion behavior are preserved.
- The gold name now has a measured typographic band above the portrait. The portrait keeps its foreground stacking layer without obscuring the letters. Existing columns, palette, hero content and interactive portrait remain.
- Hero character/word reveals use React-rendered masks and the existing GSAP entrance timeline. This is an original compatible implementation, with no SplitText plugin or extra library dependency. Screen-reader text order and the accessible H1 name remain intact.
- Technology, Products and People share one Motion `layoutId` underline. Hover, native keyboard focus, click and touch select the same state. The associated heading and short description use coordinated masked transitions; the old independently rotating timer is removed so the selection and copy cannot drift apart.
- About retains its two-column desktop/tablet layout. The original main heading and both biography paragraphs remain on the left. The photo-specific title and refined short description now change on the left, alongside the photograph on the right. The bottom captions and thumbnail strip are removed; arrows, keyboard Home/End/left/right, touch swipes and numbered progress remain.
- One reusable GSAP timeline coordinates outgoing/incoming photo layers, clip masks, scale, rotation, fanning back cards and caption motion. Target responsive images decode before a transition starts. Rapid input coalesces to the latest requested destination. The timeline is cleared/reused, and its context, observer and pending image requests are cleaned up when motion preferences change or the component unmounts. Reduced motion uses immediate state changes rather than zero-duration completion callbacks.
- Visible cursor, interest-choice, replay and scrolling instructions are removed. Animation control is retained as an accessible icon without the visible “Motion on” label. The redundant project-selection instruction is removed; project actions and all actual navigation remain.
- The navigation observer now derives its active section from the current reading position, preventing a stale highlight after returning to the hero.

## Results

| Check | Result |
| --- | --- |
| Production build | Pass |
| ESLint, including Hooks rules | Pass, no warnings |
| Original asset SHA-256 and content/functionality checks | Pass |
| Chromium 1440 × 900 | 7 applicable tests passed; touch-only case skipped |
| Chromium 1280 × 900 | 7 applicable tests passed; touch-only case skipped |
| Chromium 768 × 1024 | 7 applicable tests passed; touch-only case skipped |
| Chromium 390 × 844 | 8 tests passed, including real touch input |
| axe WCAG 2 A/AA and 2.1 AA, page and project dialog, all four sizes | No violations detected |

The 29 applicable browser tests (32 configured, three deliberate non-mobile touch skips) cover original content/assets and links, hero name readability and face clearance, character/word masks, one active interest indicator, hover/focus/click and rapid focus changes, interest touch selection, all three About titles/descriptions and photographs, forward/backward wraparound, rapid repeated carousel clicks, Home/End, fixed section geometry, reduced-motion interruption mid-transition, further navigation after interruption, native vertical scrolling during touch gestures, leadership whole-card toggling and photographs, project dialogs, demo wiring, Escape/focus restoration, mobile navigation, browser console errors, and native contact-form validation. The contact form is not submitted; tests send no email.

Two issues discovered during verification were fixed before completion: stale navigation highlighting after returning to the hero, and a reduced-motion carousel lock caused by reusing a zero-duration timeline callback.

## Visual evidence

All three photo/text pairs were reviewed at every requested width. Early, middle and late frames of the GSAP transition were captured and reviewed on desktop and mobile. Element screenshots hide fixed navigation, the skip link and the reading-progress bar only during capture, so fixed browser chrome cannot obscure the component being reviewed.

| Width | Hero | About: portrait / TEDx / podium |
| --- | --- | --- |
| 1440 | [Hero](qa/refined-1440-hero.png) | [1](qa/refined-1440-about-1.png) / [2](qa/refined-1440-about-2.png) / [3](qa/refined-1440-about-3.png) |
| 1280 | [Hero](qa/refined-1280-hero.png) | [1](qa/refined-1280-about-1.png) / [2](qa/refined-1280-about-2.png) / [3](qa/refined-1280-about-3.png) |
| 768 | [Hero](qa/refined-768-hero.png) | [1](qa/refined-768-about-1.png) / [2](qa/refined-768-about-2.png) / [3](qa/refined-768-about-3.png) |
| 390 | [Hero](qa/refined-390-hero.png) | [1](qa/refined-390-about-1.png) / [2](qa/refined-390-about-2.png) / [3](qa/refined-390-about-3.png) |

- Desktop transition: [early](qa/refined-1440-transition-early.png), [middle](qa/refined-1440-transition-middle.png), [late](qa/refined-1440-transition-late.png)
- Mobile transition: [early](qa/refined-390-transition-early.png), [middle](qa/refined-390-transition-middle.png), [late](qa/refined-390-transition-late.png)
- Leadership: [General Secretary](qa/refined-1440-secretary.png), [TEDx](qa/refined-1440-tedx.png), [GDG](qa/refined-1440-gdg.png); matching 390px captures are also in `docs/qa`.

Photographs retain natural proportions. The landscape TEDx photograph uses contain sizing over a dimmed/blurred duplicate of the same image; original faces and files are unchanged. All original assets remain available. Earlier screenshots are retained as historical evidence, not the current design.

## Reference and limits

The supplied Pinterest reference points to pin 1027031890040601748 and the public Behance project [Professional 3D Music Interface Showcase for Artists](https://www.behance.net/gallery/244188651/Professional-3D-Music-Interface-Showcase-for-Artists). Its embedded seven-second animation was inspected through the public player in the preceding revision: cards emerge and fan with depth/tilt before settling. The current GSAP timeline adapts that layering to personal photographs and synchronized editorial text. It does not reproduce the music artwork. The earlier Ashutosh Mujumdar portfolio reference was also inspected during the migration.

Automated browser coverage is Chromium; Firefox and Safari have not been run. axe scans supplement human assistive-technology testing. The earlier dependency audit found no production vulnerabilities and six moderate development-only ESLint/minimatch findings; no dependencies were changed in this revision. The professional hero cutout's provenance is documented in [portrait-edit.md](portrait-edit.md).

No merge, production deployment or Pages-settings changes are performed. The existing workflow runs PR checks and permits deployment only from main after owner approval and the documented Pages configuration change.
