# FoodRescue data contract (provisional)

> This contract captures the field names and status values used by the Phase 1
> UI. It is intentionally provisional until the FastAPI schemas are agreed.
> Once the backend contract is published, this file is the single place to
> update the frontend's shared vocabulary.

All timestamps are ISO 8601 strings. JSON keys use `snake_case` to match the
FastAPI/PostgreSQL backend convention.

## Listing

| Field | Type | Notes |
| --- | --- | --- |
| `id` | string | e.g. `lst_1001` |
| `donor_id` | string | |
| `donor_name` | string | Display name |
| `donor_type` | enum | `bakery`, `restaurant`, `grocery`, `cafe`, `caterer`, `household`, `other` |
| `title` | string | |
| `description` | string | |
| `category` | enum | `produce`, `bakery`, `prepared_meals`, `dairy`, `pantry`, `beverages` |
| `dietary_tags` | string[] | `vegetarian`, `vegan`, `halal`, `gluten_free`, `nut_free`, `dairy_free` |
| `allergens` | string[] | `gluten`, `milk`, `eggs`, `peanuts`, `tree_nuts`, `soy`, `fish`, `shellfish`, `sesame` |
| `portions` | integer | Total portions offered |
| `portions_reserved` | integer | Portions allocated to requests |
| `prepared_at` | timestamp | |
| `pickup_window_start` | timestamp | |
| `pickup_window_end` | timestamp | Also used as the pickup deadline |
| `pickup_address` | string | |
| `pickup_instructions` | string | |
| `distance_km` | number | Calculated by the backend for the requesting organization |
| `photo_url` | string | Relative path or absolute URL |
| `status` | enum | `available`, `reserved`, `collected`, `expired`, `cancelled` |
| `created_at` | timestamp | |
| `updated_at` | timestamp | |
| `collected_at` | timestamp? | Present once collected |

### Listing status values

- `available` — visible to organizations and open to requests
- `reserved` — fully allocated to an approved reservation
- `collected` — handover confirmed
- `expired` — pickup window passed without collection
- `cancelled` — withdrawn by the donor

## Reservation request

| Field | Type | Notes |
| --- | --- | --- |
| `id` | string | e.g. `req_4101` |
| `listing_id` | string | |
| `listing_title` | string | Denormalized for display |
| `organization_id` | string | |
| `organization_name` | string | |
| `contact_name` | string | |
| `portions_requested` | integer | |
| `status` | enum | `pending`, `approved`, `declined`, `cancelled`, `collected`, `expired` |
| `requested_at` | timestamp | |
| `pickup_window_start` | timestamp | |
| `pickup_window_end` | timestamp | |
| `message` | string | Optional note from the requesting organization |
| `decided_at` | timestamp? | When the donor approved or declined |
| `collected_at` | timestamp? | When the pickup was verified |
| `verification_code` | string? | Future pickup verification placeholder |

### Reservation status values

- `pending` — waiting for the donor
- `approved` — donor confirmed; listed as an upcoming pickup
- `declined` — donor could not fulfil the request
- `cancelled` — withdrawn by either party before collection
- `collected` — pickup verified
- `expired` — pickup window passed before collection

## Organization verification

Status values: `unverified`, `pending`, `verified`, `rejected`.

## Recommendation (backend-owned)

The frontend **never calculates match scores**. A recommendation is returned by
the backend and rendered as-is.

```json
{
  "match_id": "mat_9001",
  "match_score": 96,
  "match_reasons": [
    "Fits tonight's dinner service",
    "Handover window after your prep shift"
  ],
  "generated_at": "2026-10-25T14:00:00Z",
  "listing": { "...": "Listing object" }
}
```

`match_score` is an integer from 0–100. It is always shown as backend-supplied
output; sample values in this prototype are labelled as such.

## Collection record (prototype shape)

| Field | Type | Notes |
| --- | --- | --- |
| `id` | string | |
| `reservation_id` | string | |
| `listing_id` | string | |
| `listing_title` | string | |
| `donor_name` | string | |
| `portions` | integer | Portions collected |
| `collected_at` | timestamp | |
| `status` | string | `collected` |
| `estimated_waste_diverted_kg` | number | A backend estimate; never calculated client-side |

## Endpoint assumptions (to confirm with the backend)

These are placeholders for the integration phase, not final API documentation.

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/listings` | Discovery listings |
| `GET` | `/listings/{id}` | Listing details |
| `POST` | `/listings` | Create a donation |
| `GET` | `/donors/me/workspace` | Donor dashboard data |
| `GET` | `/organizations/me/workspace` | Organization dashboard data |
| `POST` | `/reservations` | Request a listing |
| `PATCH` | `/reservations/{id}` | Approve, decline or cancel a request |
| `GET` | `/impact/summary` | Impact dashboard totals |

All requests send `Accept: application/json` and use the base URL
`http://localhost:8000/api/v1` by default.
