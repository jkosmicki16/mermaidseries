# Mermaid Race Portal — Setup Documentation

## What Was Built

### Account Audit Results

| Capability | Status | Notes |
|---|---|---|
| CMS Hub | ✅ Available | Full CMS with page builder |
| CMS Memberships / Private Content | ✅ Available | Runner login portal enabled |
| HubDB | ✅ Available | Used for race data |
| Custom Objects | ⚠️ Not available | Requires Enterprise upgrade |
| HubSpot Payments / Commerce | ⚠️ Read-only via API | Cart/Quote/Invoice objects exist but write-blocked |
| Serverless Functions | ❌ Not available | Requires CMS Hub Professional+ |
| Existing contacts | ✅ 57,037 | Active CRM |

---

## What Was Built

### HubDB Tables
- **Table: `races`** (ID: 2230512366)
  - 3 sample races loaded (2 Open, 1 Upcoming)
  - Fields: name, slug, date, location, distances (CSV), reg_open, reg_close, capacity, price, status, description, image, waiver_text, featured, race_type, state
  - Manage at: https://app-na2.hubspot.com/hubdb/244551932

### CRM Data Model
- **Deal Pipeline: Race Registration Pipeline** (ID: 2270725848)
  - Stages: Registration Started → Awaiting Payment → Payment Received → Registration Confirmed → Race Completed → Cancelled/Refunded
- **Custom Contact Properties Created:**
  - `runner_emergency_contact_name`
  - `runner_emergency_contact_phone`
  - `runner_waiver_accepted`
  - `runner_marketing_optin`
  - `runner_tshirt_size`
- **Custom Deal Properties Created:**
  - `registration_race_id` — HubDB row ID of the race
  - `registration_race_name` — Race name
  - `registration_distance` — Selected distance
  - `registration_date` — When they registered
  - `registration_payment_status` — pending/paid/failed/refunded
  - `registration_confirmation_number` — e.g. MRM-ABC123
  - `registration_bib_number` — Assigned bib
  - `registration_tshirt_size`
  - `registration_waiver_accepted`

### HubSpot Forms
- **Race Registration Form** (GUID: `bca40816-3fb0-453b-b84f-0f497ddf30da`)
  - Fields: First/Last name, Email, Phone, DOB, Gender, Emergency contact, T-shirt size, Waiver acceptance, Marketing opt-in
  - Redirects to: `/registration-confirmation`

### CMS Theme: `mermaid-race-portal`
Uploaded to Design Manager at: https://app-na2.hubspot.com/design-manager/244551932

**Templates (20 files):**
| Template | Path | Purpose |
|---|---|---|
| Base Layout | `templates/layouts/base.html` | Shared HTML shell |
| Header | `templates/partials/header.html` | Navigation header |
| Footer | `templates/partials/footer.html` | Footer with links |
| Homepage | `templates/home.html` | Featured races, hero, CTA |
| Race Listing | `templates/race-listing.html` | Search + filter races |
| Race Detail | `templates/race-detail.html` | Individual race page (HubDB-powered) |
| Race Registration | `templates/race-registration.html` | Multi-step form page |
| Confirmation | `templates/registration-confirmation.html` | Post-registration success |
| Runner Dashboard | `templates/runner-dashboard.html` | Logged-in runner portal |
| About | `templates/about.html` | About us page |
| FAQ | `templates/faq.html` | Accordion FAQ page |
| Contact | `templates/contact.html` | Contact form page |
| Login | `templates/system/membership-login.html` | Runner login |
| Register | `templates/system/membership-register.html` | Account creation |
| Reset Password | `templates/system/membership-reset-password.html` | Password reset |
| Reset Request | `templates/system/membership-reset-password-request.html` | Forgot password |
| 404 | `templates/system/404.html` | Not found page |

**Modules (7 modules):**
| Module | Purpose |
|---|---|
| `race-card.module` | Reusable race card for any page |
| `featured-races.module` | HubDB-powered featured races grid |
| `race-search.module` | HubDB-powered searchable race listing |
| `race-registration-form.module` | Full multi-step registration form |
| `runner-dashboard.module` | Logged-in runner registrations display |
| `race-hero.module` | (scaffold, ready to build) |
| `race-countdown.module` | (scaffold, ready to build) |

### CMS Pages Created (Draft — Needs Publishing)
All pages are in DRAFT state. Go to Pages → Site Pages to publish.

| Page | URL slug | Template |
|---|---|---|
| Homepage | `/` | `home.html` |
| Find a Race | `/races` | `race-listing.html` |
| Race Registration | `/register` | `race-registration.html` |
| Registration Confirmed | `/registration-confirmation` | `registration-confirmation.html` |
| Runner Dashboard | `/dashboard` | `runner-dashboard.html` |
| Log In | `/login` | `system/membership-login.html` |
| Create Account | `/register-account` | `system/membership-register.html` |
| About Us | `/about` | `about.html` |
| FAQ | `/faq` | `faq.html` |
| Contact Us | `/contact` | `contact.html` |

---

## Required Manual Steps

### 1. Publish All Pages
1. Go to **Content → Website Pages** in HubSpot
2. Select all Mermaid Race Portal pages
3. Click **Publish**

### 2. Set Login / Register Page as Membership Pages
1. Go to **Settings → Website → Private Content**
2. Set Login page to `/login`
3. Set Registration page to `/register-account`
4. Set the Runner Dashboard (`/dashboard`) as a **members-only** page

### 3. Add a Real Race Image in HubDB
1. Go to **HubDB → races** table
2. Upload a race image for each row in the `image` column

### 4. Wire Up the Contact Form
1. Go to **Marketing → Forms**
2. Find "Contact Us Form" (you need to create this one — the Race Registration Form is already created)
3. Get the Form GUID
4. Add it to the `contact_form` module in the Contact page editor

### 5. Connect the Registration Form to the Module
1. Go to **Marketing → Forms**
2. Copy the GUID: `bca40816-3fb0-453b-b84f-0f497ddf30da`
3. Edit the Race Registration page in the Page Editor
4. In the Registration Form module settings, paste the Form ID

### 6. Set Up the Deal Registration Workflow
1. Go to **Automation → Workflows → Create Workflow**
2. Trigger: Form submission on "Race Registration Form"
3. Actions:
   - Create a Deal in the "Race Registration Pipeline"
   - Set deal name: `{{ firstname }} {{ lastname }} — {{ registration_race_name }}`
   - Set `dealstage` to "Registration Started" (ID: 3658496734)
   - Set `registration_payment_status` to "pending"
   - Set `registration_confirmation_number` to a unique token
   - Send confirmation email to submitter
   - Notify internal team

### 7. Set Up Automated Emails
Create these email workflows in HubSpot:
- **Registration Confirmation** — Trigger: Workflow from step 6
- **Payment Confirmation** — Trigger: Deal stage moves to "Payment Received"
- **Race Day Reminder** — Trigger: 7 days and 1 day before race date (date-based)
- **Post-Race Follow-Up** — Trigger: 3 days after race date

### 8. Payment Integration
Currently the checkout flow has a payment placeholder. To connect a payment provider:

**Option A — HubSpot Payments (if available on your plan):**
1. Go to **Commerce → Payments** in HubSpot
2. Enable HubSpot Payments
3. Create a Payment Link per race distance
4. Embed the payment link in the registration flow

**Option B — Stripe:**
1. Install the Stripe HubSpot integration from the App Marketplace
2. Create Stripe Payment Links for each race/distance
3. Add Stripe's embed script to the registration template
4. Use Stripe webhooks to update the Deal's `registration_payment_status` property

---

## Adding New Races (Admin Guide)

1. Go to **HubDB → races** table in HubSpot
2. Click **+ Add row**
3. Fill in all fields:
   - `name` — Full race name
   - `slug` — URL-safe slug (e.g. `boston-mermaid-sprint-2025`)
   - `date` — Race date
   - `location` — City, State
   - `distances` — Comma-separated (e.g. `Sprint Triathlon, 5K Run`)
   - `reg_open` / `reg_close` — Registration window
   - `capacity` — Max participants
   - `price` — Starting price in USD
   - `status` — upcoming / open / closed / completed
   - `description` — HTML description
   - `image` — Upload race image
   - `waiver_text` — Race-specific waiver (or leave blank to use default)
   - `featured` — Check to show on homepage
4. Click **Publish changes**

The race will automatically appear on `/races` and `/` (if featured).
To create an individual race page, create a new Site Page using the `race-detail.html` template and set the URL slug to match the HubDB row's `slug` field.

---

## Data Architecture Summary

```
Contact (Runner)
  ├── firstname, lastname, email, phone
  ├── date_of_birth, gender
  ├── runner_emergency_contact_name
  ├── runner_emergency_contact_phone
  ├── runner_waiver_accepted
  ├── runner_marketing_optin
  └── runner_tshirt_size
  │
  └── Associated Deals (via HubSpot Associations)
        └── Deal (Registration)
              ├── dealname = "Runner Name — Race Name"
              ├── pipeline = Race Registration Pipeline
              ├── dealstage = Current stage
              ├── amount = Registration fee
              ├── registration_race_id (HubDB row ID)
              ├── registration_race_name
              ├── registration_distance
              ├── registration_date
              ├── registration_payment_status
              ├── registration_confirmation_number
              ├── registration_bib_number
              ├── registration_waiver_accepted
              └── registration_tshirt_size

HubDB: races (public race calendar)
  ├── Row per event
  ├── Used by: race-listing, race-detail, featured-races, registration form
  └── Managed by: HubDB editor (non-technical-friendly)

Products (Catalog)
  └── Optional: Create one Product per race/distance for line items in Deals
```

---

## What Requires an Upgrade or Third-Party Integration

| Feature | Current Status | What's Needed |
|---|---|---|
| Payment processing | Placeholder only | HubSpot Payments (paid tier) OR Stripe integration |
| Serverless functions | ❌ Not available | CMS Hub Professional or Enterprise |
| Custom Objects | ❌ Not available | HubSpot Enterprise tier |
| Live dashboard data | Static placeholder | Serverless function OR custom Contact properties written by Workflow |
| Registration capacity enforcement | Not automated | Workflow to check HubDB capacity and reject/notify when full |
| Team/fundraising groups | Not built | Would require Custom Objects or a third-party tool |
| Results / timing integration | Not built | Third-party timing software API integration |

---

## Future Stripe Integration Steps

1. Create a Stripe account and get API keys
2. Install the Stripe HubSpot integration at marketplace.hubspot.com
3. OR build a custom integration:
   - Create Stripe Checkout Sessions via Stripe API when registration is submitted
   - Use Stripe webhooks to POST to a HubSpot serverless function
   - Serverless function updates the Deal's `registration_payment_status` to "paid"
   - Trigger the confirmation workflow
4. Alternatively: Use HubSpot's native Payments if activated on the account

---

*Generated by: Mermaid Series Race Portal build — May 2026*
