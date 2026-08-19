# Quran Companion

A motivational tracker and journal for your Qur'an listening journey.

**Live demo:** https://quran-companion-virid-chi.vercel.app

---

## Overview

Quran Companion is a full-stack web application that pairs practical progress tracking with a contemplative space for reflection. Users can set a personal goal to finish listening to the whole Qur'an by a date that matters to them, track their progress through all 114 surahs, and keep a private journal of their reflections along the way.

## Screenshots

![Auth page](screenshots/1-auth.png)
*The login and signup page - the app's illuminated-manuscript aesthetic sets the tone from the first screen.*

![Tracker page](screenshots/2-tracker.png)
*The tracker: a statement goal card, a visual grid of all 114 surahs that fills in as you listen, and the full surah list with filters and search.*

![Journal writing](screenshots/3-journal-write.png)
*The journal writing view: a two-page book spread with prompt on the left and lined writing paper on the right.*

![Journal entry](screenshots/4-journal-entry.png)
*A saved reflection displayed as a book page, with a contents strip above for navigating between entries by date.*

## Features

**Tracker** - Set a listening goal with a target date, mark surahs as listened one by one, and watch your progress fill in through a visual grid of all 114 surahs. Filter the list by all, listened, or remaining, and search by name or number.

**Reflection Journal** - After marking a surah as listened, you're gently invited to reflect on what stayed with you. Your reflections are saved as pages in a private book, browsable by date, with a book-spread writing view designed to feel like an actual journal.

**Profile** - Customize your display name and pick from nine Islamic-themed avatar icons and six on-palette colors.

**About Guide** - A first-time welcome modal introduces new users to the app, and an About link in the navbar keeps it accessible anytime.

## Why I Built This

Existing Qur'an apps focus primarily on tracking progress, how many surahs memorized, or how many pages read. But, they miss the *reflection* side: the personal, contemplative relationship with the text itself. As a Software Engineering student specializing in UX, I wanted to build something that combined both: practical tracking with a thoughtful, private space for meaning.

The design direction was deliberate. Most Islamic apps default to bright greens and generic modern styling. I wanted this one to feel like an illuminated manuscript: warm, calm, personal, a companion to keep with the Qur'an rather than a productivity tool for it.

## Tech Stack

- **Frontend:** React, JavaScript, CSS
- **Backend:** Python, Django, Django REST Framework
- **Database:** SQLite (development), PostgreSQL (production)
- **Authentication:** Token-based auth via DRF
- **External API:** [Al Quran Cloud API](https://alquran.cloud/api) for verified surah data
- **Deployment:** Vercel (frontend), Render (backend)

## Key Design Decisions

**Correctness of Qur'anic text was non-negotiable.** All surah names, translations, and metadata are pulled from the Al Quran Cloud API — a verified, established source — rather than generated or manually typed. The sacred text is treated with the responsibility it deserves.

**The journal is designed as a book, not a feed.** Most journaling apps stack entries as scrollable posts. This one uses a book-spread metaphor: two pages when writing, single pages when reading, and a date-grouped contents strip for navigation. The result feels more personal and less like social media.

**Accessibility informed the visual choices.** Colors were chosen for high contrast (dark ink on parchment) to be readable for users with low vision or color blindness. Typography uses generously spaced serifs for comfortable reading. All interactive elements have proper labels and keyboard support. These decisions were guided by the WCAG accessibility principles I studied through Microsoft's Accessibility Fundamentals certification.

**Code is organized by feature, not by file type.** The frontend uses colocated components — `Journal.js` lives next to `Journal.css` in a `journal/` folder — following modern React conventions for maintainability.

## Future Roadmap

Features planned but not yet built:

- Memorization and recitation tracking (not just listening)
- Mood-based verse suggestions with translation and meaning
- Reminders and daily notifications
- Password reset via email
- Anatomical heart visualization for progress (inspired by the physical Qur'an trackers people print and color)
- Mobile app version
- Multi-language interface support

## Running Locally

You'll need Python 3.11+, Node.js, and Git installed.

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate            # Windows
# source venv/bin/activate       # Mac/Linux
pip install -r requirements.txt
python manage.py migrate
python manage.py load_surahs
python manage.py runserver
```

The backend runs at `http://127.0.0.1:8000`.

### Frontend

In a separate terminal:

```bash
cd frontend
npm install
npm start
```

The frontend runs at `http://localhost:3000`.

## Author

Built by Hafsa Ahmed as a personal project during the summer between first and second year of Software Engineering at the University of Guelph.

