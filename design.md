# Moira's portfolio — About and Work

## Latest consolidation

Motion refinement (Apple-design component review): retain the existing visual tokens and grid; the portfolio's imagery remains the signature. Cards reveal once on entering the viewport, rising 32px with opacity 0→1 over 620ms using cubic-bezier(.22,.75,.2,1), with up to 110ms sibling staggering. The easing moves briskly then settles without bounce. Navigation uses one shared selected-state pill, sliding horizontally over 320ms before normal page navigation; links, modified clicks, browser history, and direct URLs remain intact. Keyboard focus reveals content immediately. Reduced Motion removes both effects, including when enabled mid-session. No animation is needed for revisiting an already revealed card. Guidance: `motion.md › Best practices`: “Make motion optional”; `motion.md › Providing feedback`: “Aim for brevity and precision in feedback animations.” Durations and distances are implementation judgment, not Apple-specified values.

Work layout update: use two equal-width cards per row above 620px, one on phones. Keep varied card heights and top-aligned rows. Project artwork fills the entire remaining area below the title/description with object-fit: cover, zero image inset, and no inner image rounding; the outer card clips the artwork to its existing corner radius. About layout, card surfaces, and navigation remain unchanged.

Height rhythm update: visually checked the reference post's video preview. Mix short landscape and near-square cards rather than uniform heights. About media uses 16:9, 3:2, 4:3, 6:5, and 1:1 ratios selected per content; the playlist stays square to match album artwork. Intro and biography cards fit their copy naturally, without a shared minimum height. Work cards alternate 1:1, 6:5, and 4:3. Preserve equal-width columns, top-aligned rows sized by their tallest item, existing responsive breakpoints, spacing, typography, borders, shadows, and navigation. No randomization or masonry reordering. This supersedes the uniform landscape sizing below. Apple-design guidance: `layout.md › Visual hierarchy` supports aligned components; `typography.md › Supporting Dynamic Type` supports letting text containers grow. Ratio choices are visual judgment based on this portfolio's imagery.

Surface preference restored: use the earlier #EEEFEC bento stroke and very light two-layer shadow, including the earlier hover shadow. Navigation returns to the white floating pill with a light-grey selected tab, medium-weight label, and no selected-tab shadow. Typography, content removals, grid, and accessibility improvements remain. Music retains its explicitly requested borderless treatment.

## Apple design skill refinement

Context: a responsive static-web portfolio for people evaluating Moira's design work. Its signature is the combination of real project imagery, personal photography, and the playable music card—not decorative slogans. Apply Apple foundations rather than native app-only navigation conventions.

Plan: retain the existing three-column, top-aligned landscape grid, with two and one-column responsive layouts. Regular: [intro][portrait][music] / [project][biography][project]. Compact: [intro] / [portrait] / [music] / remaining cards in source order. Remove the two slogan-only cards and the decorative curiosity tile. Preserve informative biography text.

Tokens: white surface #FFFFFF, primary #1D1D1F, secondary #515158, quiet control fill #F5F5F7, focus accent #0066CC, border #E8E8ED. Dark counterparts reserved for a future requested appearance: #1C1C1E, #F5F5F7, #AEAEB2, #2C2C2E, #64A8FF, #38383A. The requested white appearance remains active. Type: system sans throughout, 22px semibold intro, 20px project title, 15px/1.5 body, 13px utility. Relative units support browser text scaling. Cards use a 24px radius and 24px text inset; 40px desktop gaps stay unchanged. Only existing hover/tilt motion remains, with reduced-motion support.

Review: the meaningful image collection is already the strongest element. Remove filler rather than inventing new decorative UI. Improve the functional layer with 44px navigation hit areas, visible focus for every keyboard-operable card, and reduced-transparency/high-contrast fallbacks. Content is allowed to grow when text is enlarged rather than being clipped to a fixed ratio. Do not add serif typography, extra labels, or a new hero.

Computed WCAG contrast on white: primary 16.83:1, secondary 7.87:1, focus accent 5.57:1. Reserved dark pairings on #1C1C1E: primary 15.63:1, secondary 7.69:1, accent 6.96:1. Tested desktop About and Work with no clipped cards, and About at 320px with no horizontal overflow or clipped copy. Biography cards keep the same grid but use content-driven height (14.5rem minimum on desktop, natural on phones); readability takes precedence over enforcing a landscape ratio for long copy. Keyboard opening, Escape dismissal, and focus restoration were verified.

Guidance used: `typography.md › Conveying hierarchy` ("Minimize the number of typefaces"); `collections.md › Best practices` ("Use the standard row or grid layout whenever possible"); `buttons.md › Best practices` ("Always include a press state"); `materials.md › Liquid Glass` ("Don’t use Liquid Glass in the content layer"); `accessibility.md › Vision` ("Support larger text sizes"); `motion.md › Best practices` ("Make motion optional").

Landscape spacing update: cap the canvas at 940px, with 40px desktop gaps, 32px tablet gaps, and 28px phone gaps. All main-grid cards use landscape 6:5 proportions, with selected image cards at 3:2. Switch to two columns below 1000px and one below 620px to preserve readable text. Remove the five biography section subtitles. Split the introduction's supporting paragraphs into a separate text card, preserving all copy while keeping the intro short. Text cards use 20px padding and 14px descriptions with no extra paragraph margins. This supersedes previous square/portrait sizing.

Typography correction: replace the editorial serif accents with the native Apple/system sans-serif stack. Intro titles are 22px semibold; section headings 15px semibold; descriptions 15px regular with 1.47 line-height and no added margin between paragraphs. Short statement cards use 20px medium. Neutral iOS-like primary/secondary greys replace the warm editorial palette. This supersedes the earlier serif refinement.

Editorial typography refinement: inspired by the reference's serif quick-note and quiet sans-serif widget labels, use regular-weight Georgia for the introduction and short standalone statements, paired with 14px system-sans body copy at 1.7 line-height. Biography labels are sentence case, 13px medium weight rather than uppercase tracking. Warm grey text, balanced headline wrapping, and 26px desktop / 22px mobile padding keep the text cards understated. Content and card layout are unchanged.

Music card: square to match the album cover, with no card or transport-bar stroke. The cover fills the entire card. Transport icons rest at 60% opacity and become fully opaque on hover, keyboard focus, or press; the translucent bar and card shadow remain.

Player visual refinement: hide the bottom playback-status caption visually while keeping its live announcements available to screen readers. The three-button bar is centered at 72% width with a translucent white fill, subtle border, backdrop blur, and white icons. Song title and artist remain visible above it.

Transport update: the bottom bar now contains only previous, play/pause, and next. Previous/next cycle through all 13 publicly exposed playlist previews in playlist-tracks.json, updating the title, artist, and artwork and starting the selected preview. Ended previews advance automatically; the sequence wraps at either end. The Spotify badge remains the full-playlist link. This is a saved playlist snapshot rather than live synchronization; unavailable media shows an error rather than pretending to play.

Playlist player refinement: replace the decorative record with the full-bleed first-track cover, verified from Spotify's public playlist and track embeds on September 16, 2026: 飛機場的10:30 by David Tao (track 0v2hRgvRSMnHsTSWyaoKbH). A translucent pill transport bar provides playlist link, restart preview, play/pause, continue on Spotify, and mute. Only the provided Spotify audio preview plays locally; full playback remains on Spotify. No autoplay. Playback failures show an explicit fallback message. This interactive card is excluded from the cloned focus modal. The cover/preview are a verified snapshot, not a live playlist integration.

Local preview: run `python3 -m http.server 8000 --bind 127.0.0.1` from the repository. A connection-refused error means this development server is not running; it must remain active while using the local preview.

Height refinement after visually inspecting the reference video at 0:03: cards are approximately 296px wide, with short widgets around 200px high, square media around 295px, and the tallest around 328px. Use a stable mix of 3:2, 1:1, and 10:11 rather than the earlier elongated 3:4 / 2:3 shapes. Work keeps square/slightly tall cards to accommodate its copy. Text remains content-sized with 24px padding and tighter paragraph spacing; do not truncate it to force a ratio. These rules supersede the older proportion list below.

The former Desk at index.html is now named About. All ten personal/biography cards from the old About page are interspersed with the existing project and intro cards. There is one page heading and a two-item navigation: About / Work. The old about/index.html redirects to ../index.html, preserving existing inbound links. Earlier references below to separate Desk and About layouts describe the pre-merge structure.

The main canvas is capped at 960px. Desktop grid gaps are 32px, with 24px gaps on smaller screens. Cards remain equal-width and top-aligned within tallest-card rows. Image-only project cards have no padding or inner radius; images fill the full card with object-fit: cover, accepting cropping to preserve the selected card proportions. Work cards retain their title/description and inset image treatment. Focused cards inherit the same edge-to-edge image styling.

## Current direction

The latest references are [Marco's home](https://www.marco.fyi/), [Work](https://www.marco.fyi/work), and [About](https://www.marco.fyi/about). They supersede the earlier X-video widget layout wherever the user requested a change.

The latest surface refinement returns to the [original video reference](https://x.com/MSchwaibold/status/2096059496812716307): pure-white page and bento fills, thin light-grey strokes, soft shadows, and rounded corners. The current Desk / Work / About layouts remain in place. The hierarchy is restrained and content differs deliberately between the three pages.

## Shared system

- Body: #FFFFFF.
- Bento fill: #FFFFFF.
- Bento border: 1px solid #EEEFEC.
- Shadow: 0 2px 4px rgb(20 20 30 / 1%), 0 8px 20px rgb(20 20 30 / 2%).
- Radius: 25px desktop, 21px phone.
- Main text: #252525; secondary text: #737373.
- Canvas: maximum 1020px with at least 64px side margins on desktop, 40px on tablet, 24px on small tablets, and 16px on phones. Smaller cards leave more white space around the page; the equal-width, top-aligned row layout stays unchanged.
- Typography: system sans; 24px intro/story headings, 20px project headings, and 14px body copy with 1.6–1.7 line-height. About section labels are 12px. Page contact/footer actions are 14px medium-weight with 44px minimum hit areas; the footer location line is 13px. These sizes remain readable on phones rather than shrinking the footer to microtext. Existing Caveat remains for the footer signature.
- Header: centered fixed pill navigation ordered Desk / Work / About. No name or portrait. Say hello sits just above the top-right card; the compact header reduces the gap before the grid.
- Every page marks its own navigation item with aria-current.
- Footer: signature, LinkedIn, and copy-email with accessible success/fallback feedback.
- No external typography, JavaScript dependencies, backend, or build step.

## Desk — index.html

An image-led overview. The introduction is a tall text card on the left; linked project images occupy the remaining grid. Project tiles contain only images: no titles, descriptions, badges, arrows, category labels, or numbered headings. Accessible names still identify every project link.

The content-sized intro sits beside square image cards, occupying one column and one row. A square final card links to Work. Spotify, portrait, and personal note widgets live on About.

## Standard proportions

- Desk and Work projects mix 3:4, 2:3, and 1:1 proportions in a fixed, varied sequence (not randomized on reload).
- About portrait: 3:4. Photography: 2:3. Spotify: 1:1.
- Text-only cards and the personal note are content-sized, with no bottom call-to-action links. Header and footer contact links remain available.
- Intro and biography cards remain content-sized so long text is never cropped.
- Focused cards preserve their source aspect ratio and scale to the available viewport. Borders, light shadows, and cursor tilt remain unchanged.

## Work — work/index.html

Three equal columns on desktop, two on smaller screens, and one on phones. Each whole project card links to the existing case study and contains exactly:

1. Project title.
2. One-sentence description.
3. Image below the text.

No category tags or extra metadata. The images retain their aspect ratio using object-fit: contain.

Projects: MMStudio, Wavely, Nomi, Google I/O Connect, Huawei Connect, Oovo, IMA Logo, and Letters I Couldn't Say. Existing case-study URLs remain unchanged.

## About — about/index.html

Desktop layout: three equal-width cards per row. Each biography paragraph is its own text card, interspersed with personal media in the same grid. The introductory card retains the page heading; subsequent text cards have a section label and a single paragraph.

The biography uses the subject-led structure of the reference but only Moira's own information from the previous About page:

- What I do: AI product design, research, interaction, and front-end development.
- Where I've been: MiniMax, Publicis Groupe, iQIYI; no invented dates or present employment claim.
- What I've learned: NYU Interactive Media Arts, Web Programming and Applications minor, class of 2026.
- How I work: research, prototyping, testing, and motion design.
- Beyond the screen: photography, bedroom DJing, bento UI, and personal connections.

Right-side cards:

- Existing portrait (about/photo.jpeg).
- Spotify playlist card linking to the real playlist already on the original About page.
- Creative-practice image linking to the existing photography Instagram profile.
- Existing flower with a short personal note.
- LinkedIn contact card.

Spotify artwork is a decorative CSS record, not fabricated album art or live playback metadata. It opens the playlist; no autoplay or fake playback controls. The creative-practice image is identified as such, not represented as a new photograph.

## Images and destinations

- MMStudio: images/mmstudio2.png → mmstudio/index.html.
- Wavely: images/wavely1-static.png → wavely/index.html.
- Nomi: images/nomi1.png → nomi/index.html.
- Google I/O Connect: images/google1.png → googleIO/index.html.
- Huawei Connect: huawei/1.png → huawei/index.html.
- Oovo: images/oovo1.png → oovo/index.html.
- IMA Logo: images/ima1.png → imaLogo/index.html.
- Letters: images/letters1.jpeg → letters/index.html.
- Spotify: https://open.spotify.com/playlist/2O2a0EjOAMLzZirBV7KEEo.
- Photography: https://www.instagram.com/mmfi1ms/.

## Responsive behavior and accessibility

Desk, Work, and About use three equal-width columns above 700px, two at 700px and below, and one at 440px and below. All cards, including text cards, occupy exactly one column and one row. Each row takes the height of its tallest card; shorter cards retain their own height and align to the row's top. This is a row-based grid, not masonry: the next row starts below the tallest card plus the gap.

Project cards keep descriptive accessible names even when their visible content is image-only. Each page has one h1, semantic landmarks, a skip link, visible focus, alt text, and native cursor behavior. Below-the-fold images lazy-load. Hover motion is subtle and disabled for reduced-motion preferences.

## Implementation

## Card focus interaction

Clicking a bento opens a modal white canvas with the selected card centered, retaining its thin border and light shadow. All other page elements are hidden and inert. On a fine-pointer device the focused card gently tilts up to five degrees with cursor movement, using 1100px perspective, and returns to level on pointer exit. Touch and reduced-motion users get a stable card. Escape or clicking the surrounding white space closes the view and restores keyboard focus to the original card. Long text cards can scroll. Clicking a linked card again inside the focused view opens its original destination; explicit links within text cards continue to work normally. Modified clicks retain normal browser link behavior. The focus view adds no visible controls or labels.

index.html, work/index.html, and about/index.html share landing.css and landing.js. The redesign is local; publishing and GitHub changes require a separate request.
