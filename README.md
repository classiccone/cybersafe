# 🛡️ CyberSafe: Can You Outsmart the Scam?

An interactive cybersecurity awareness website built as a university
Human-Computer Interaction (HCI) class project. It teaches college students
practical online-safety habits through **ten short lessons**, each paired with
a realistic scenario and a one-question quiz.

## Project purpose

College students are heavily targeted by phishing emails, fake job offers,
marketplace scams, and account-takeover attacks. CyberSafe turns those
situations into a short, game-like experience: read a scenario that could
land in your own inbox, decide what to do, and get instant feedback explaining
*why* the right answer is right.

The project also demonstrates core HCI principles: clear navigation, constant
visibility of progress and score, immediate feedback, accessible keyboard
interaction, and a responsive layout that works on phones and laptops.

## Features

- **Game-style home screen** with avatar picker, Play / Continue button,
  points, levels completed, accuracy, and a **level map** of 10 nodes showing
  status (not started · up next · ⭐ correct · ✗ missed).
- **Ten levels**, each with a one-line explanation, three tip chips, a
  realistic **app mock-up scenario** (inbox, text thread, Instagram DM, phone
  call screen, Wi-Fi list, push notifications, social post, marketplace chat)
  with **tappable 🔍 clues** that reveal hints, one quiz question (Kahoot-style
  coloured answer tiles, or true/false), instant feedback with a short "why",
  and Back / Next buttons.
- **Game juice**: confetti and a chime on correct answers, a shake and buzz on
  wrong ones, floating "+10" score pop, a 🔥 streak counter, and a sound toggle
  (sounds are generated with the Web Audio API, so there are no audio files).
- **Scoring**: 10 points per correct answer, score and progress always visible
  in the sticky header, final score out of 100.
- **Ranks** on the results screen:
  - 90–100 · Cyber Defender
  - 70–89 · Security Savvy
  - 50–69 · Cyber Apprentice
  - Below 50 · Time for More Training
- **Results screen** with an animated score ring, rank, earned badges
  (💯 Flawless, 🔥 5-streak, 🔍 Detective, 🎣 Phish Slayer, 🏁 Finisher), a
  10-level recap grid, and a **Copy my score** button that puts a shareable
  🟩🟥 result on the clipboard.
- **Restart Challenge** button at the end and a **Reset Progress** button on
  the dashboard (with a confirmation dialog so it cannot happen by accident).
- **localStorage persistence**: answers, score, streak, found clues, avatar and
  sound preference survive a page refresh or closing the tab.
- **How to Play / About modal** (shown automatically on first visit).
- **Accessibility**: semantic HTML, skip link, keyboard-operable buttons,
  visible focus rings, `aria-live` feedback, a native `<dialog>` for the modal,
  reduced-motion support, and high-contrast colours.
- **No external assets**: icons are emoji plus one inline SVG logo. The fonts
  (Outfit for headings, Plus Jakarta Sans for body) are bundled in `fonts/`
  under the SIL Open Font License, so the site works fully offline.

## Lesson topics

| # | Lesson | Scenario |
|---|--------|----------|
| 1 | What Is Phishing? | Fake university password-reset email |
| 2 | Spot the Fake Email | Suspicious remote internship with a fake check |
| 3 | Strong vs. Weak Passwords | Password reuse after a forum breach |
| 4 | Social Engineering | Phone call from a fake "Financial Aid Office" |
| 5 | Safe Social Media | "Is this you in this video?" Instagram DM |
| 6 | Public Wi-Fi Dangers | Look-alike café hotspots while checking a bank balance |
| 7 | Two-Factor Authentication | Late-night MFA push notification attack |
| 8 | Recognizing Online Scams | Fake Zelle "business upgrade fee" marketplace scam |
| 9 | Protecting Personal Information | Oversharing a student ID and dorm room on Instagram |
| 10 | Final Cybersecurity Challenge | Fake bank fraud text + spoofed caller asking for a code |

## How to run it

No build tools, server, or installation required.

**Option 1 – open the file**

1. Download or clone this folder.
2. Double-click `index.html` to open it in any modern browser
   (Chrome, Firefox, Safari, Edge).

**Option 2 – GitHub Pages**

1. Push the folder to a GitHub repository.
2. In the repository go to *Settings → Pages*, choose the branch and the
   folder containing `index.html`, and save.
3. Open the published URL.

**Option 3 – local web server (optional)**

```bash
python3 -m http.server 8080
```

Then visit `http://localhost:8080/`.

To reset everything during a demo, use the *Reset Progress* button, or run
`CyberSafe.reset()` in the browser console.

## Technologies used

- **Web fonts** – Outfit and Plus Jakarta Sans, open-source variable fonts
  loaded with `@font-face` from the local `fonts/` folder.
- **HTML5** – semantic structure (`header`, `main`, `section`, `article`,
  `nav`, `dialog`).
- **CSS3** – custom properties (variables), Flexbox, CSS Grid, media queries,
  `:focus-visible`, `prefers-reduced-motion`.
- **Vanilla JavaScript (ES2015+)** – a single `LESSONS` array drives all
  content; small render functions update the three views; `localStorage`
  saves progress. No frameworks or libraries.

## Project structure

```
cybersafe/
├── index.html   # Page skeleton: header, three views (home / level / results), modal
├── styles.css   # Fonts, theme variables, layout, components, responsive rules
├── script.js    # Level content, state + localStorage, effects, rendering, events
├── logo.svg     # Shield logo used in the header, hero and favicon
├── fonts/       # Outfit + Plus Jakarta Sans (variable .woff2) and their OFL licenses
└── README.md    # This file
```

### How the code works (quick tour for presenters)

1. `script.js` starts with the `LEVELS` array. Each entry holds a title,
   icon, one-line explanation, tip chips, a scenario (HTML mock-up built with
   the `clue()` helper for tappable hints), question, choices, the index of
   the correct answer, and a short "why".
2. `state` stores the user's answers (`{ levelIndex: { choice, correct } }`),
   the current level, streak, clues found, avatar and sound setting. `saveState()` / `loadState()` read and
   write it to `localStorage`. The score is **calculated** from the answers,
   so it can never drift out of sync.
3. Three `<section>` elements in `index.html` are the "views". `showView()`
   toggles the `hidden` attribute so exactly one is visible at a time.
4. `renderHome()`, `renderLevel()`, and `renderResults()` fill those views
   from the data. `renderHeader()` updates the score, streak and progress bar
   after every change.
5. `answerQuestion()` records the choice, locks the answer tiles, shows the
   feedback, fires confetti/sound, and enables Next. After level 10, Next
   shows the results screen with the rank, badges and a Play again button.
6. The "effects" section (`confetti()`, `beep()`, `scorePop()`) is purely
   cosmetic and can be removed without affecting the game logic.

## Licence

Created for educational use. All scenarios are fictional; company and
university names are used only as realistic examples.
