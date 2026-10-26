# FoodRescue — frontend

A React + Tailwind CSS frontend for **FoodRescue**, which connects surplus food
from local kitchens, bakeries and grocers with community organizations that
can put it to good use.

This is a **frontend prototype** built with sample data. The FastAPI +
PostgreSQL backend integration comes in a later phase.

## Status

| Phase | Scope | Status |
| --- | --- | --- |
| 1 | Landing, food discovery, donor dashboard, organization dashboard | ✅ Built |
| 2 | Food details, reservation tracking, impact dashboard | ✅ Built |
| 3 | Authentication + organization verification screens | ⏳ Next |
| 4 | Listing API integration | ⏳ |

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:5173.

- `/` — landing page
- `/discover` — food discovery
- `/food/:listingId` — food details (photo, quantity, preparation time, allergens, pickup instructions, deadline)
- `/tracking/:requestId` — reservation tracking (status timeline + pickup verification placeholder)
- `/impact` — impact dashboard (completed collections, portions redistributed, estimated waste diverted)
- `/donor` — donor workspace demo
- `/organization` — organization workspace demo

## Prototype behaviour

- Everything is **sample data**. Impact figures, match scores and collection
  history are labelled in the UI — nothing is presented as live numbers.
- Match scores are backend-owned: the UI only displays a score it receives
  (`docs/data-contract.md`). No ranking or scoring happens in the browser.
- Dashboard actions (publish a listing, approve a request, cancel a pickup)
  update the current page only and say so. They route through the service
  layer (`src/services/`), so swapping in the real API later touches services,
  not components.

### Developer state previews

On `/discover` (dev builds only) you can preview the loading, error and empty
states:

```
http://localhost:5173/discover?preview=loading
http://localhost:5173/discover?preview=error
http://localhost:5173/discover?preview=empty
```

Empty and error states are also reachable naturally (search gibberish, or stop
the API once integration lands).

## Connecting the backend

Copy `.env.example` to `.env.local`:

```
VITE_API_BASE_URL=http://localhost:8000/api/v1
VITE_USE_SAMPLE_DATA=true
```

Set `VITE_USE_SAMPLE_DATA=false` once the listing APIs exist. The shared API
client is configured for `http://localhost:8000/api/v1` by default.

## Structure

```
src/
  components/          reusable UI, layout, food and dashboard components
  constants/           categories, dietary tags, allergens, status values
  data/                sample data (kept separate from UI code)
  features/landing/    landing page sections
  hooks/               shared data-fetching hook
  pages/               route-level pages
  services/            API client + service layer (sample adapters today)
  utils/               formatting and class helpers
docs/data-contract.md  shared field names and status values
```

## Data contract

Field names and status values used across the UI are documented in
[`docs/data-contract.md`](docs/data-contract.md). The contract is provisional
until the FastAPI schemas are agreed.

## Photography

Sample photos come from Unsplash (via `images.unsplash.com`) and are used for
prototype purposes only — replace before production.
