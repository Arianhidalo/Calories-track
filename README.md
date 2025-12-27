# CalorieTrack AI

A mobile-responsive AI-assisted calorie tracking web app built with React, Vite, Tailwind CSS, and shadcn-inspired components.

The experience includes a guided onboarding flow, real-time dashboard, and AI photo meal logging simulation that keeps
data entirely in React state (no local storage).

## Getting started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Run the development server:
   ```bash
   npm run dev
   ```
3. Build for production:
   ```bash
   npm run build
   ```
4. Preview the production build:
   ```bash
   npm run preview
   ```

## Features
- **Onboarding:** Guided setup to capture goals, body metrics, activity level, and personalized calorie/macro targets using Mifflin-St Jeor plus goal and activity adjustments.
- **Dashboard:** Daily calorie circle and macro progress bars with color-coded status, daily targets summary, and meal history with edit/delete controls.
- **AI Meal Logging:** Upload or "capture" a meal photo to simulate AI analysis with random realistic macros, editable before saving. Meals update dashboard totals immediately.
- **Design:** Mobile-first, modern health aesthetic using primary green (#10b981), smooth hover/transition states, and shadcn-inspired UI primitives.

## Tech stack
- React with Vite
- TypeScript
- Tailwind CSS
- shadcn/ui-style components
- Lucide React icons
- Local React state via context (no persistent storage)
