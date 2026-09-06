## 5. DESIGN SYSTEM REFERENCE

### 5.1 Brand Tokens

**Primary palette** (prefer gradient combinations of these over solid fills wherever possible, applied consistently across all three products and the website):

| Token | Hex | Usage |
|---|---|---|
| Primary | `#074FF8` | Primary CTAs, active states, progress fills, headers, sidebar background (Product 2/3) |
| Secondary | `#4171F0` | Secondary actions, gradient pairing with Primary, supporting accents |
| Accent | `#DFFFFF` | Light accent panels, highlight fills, gradient endpoints |
| Background | `#F7F8EF` | Page/dashboard background (canvas) |

**Neutrals** (independent of brand palette):

| Token | Hex | Usage |
|---|---|---|
| Neutral Dark | `#1F2937` | Primary body text, high-contrast headings |
| Neutral Muted | `#6B7280` | Secondary text, placeholders, captions |
| White | `#FFFFFF` | Cards, inputs, modals |

**Status colors** (semantic, non-alarming palette — deliberately independent of brand color to avoid confusing status chips with clickable brand actions):

| State | Background | Text | Notes |
|---|---|---|---|
| Success/Arrived | `#DCFCE7` | `#166534` | WCAG AA verified |
| Waiting/In Progress | `#EDE4FE` | `#6D28D9` | Purple — deliberately distinct from Primary blue to avoid visual confusion with brand CTAs (5.79:1 contrast) |
| Delayed/Attention | `#FEF3C7` | `#92400E` | Soft amber, never harsh red |
| Cancelled/Inactive | `#F3F4F6` | `#4B5563` | Neutral gray |
| Error (rare — reserved for critical failures only) | `#FEE2E2` | `#991B1B` | No longer used for payment failure (cash-only, no payment failures possible) |

**Dark-mode logo:** `#9BB2F7` — verified 6.90:1 contrast against dark navy (`#1F2937`) backgrounds (e.g., footer).

**Typography:**
- Headings/Titles: Playfair Display Bold (formal serif), applied consistently across all three products and the website
- Body/Labels/Buttons/Forms: Inter (Regular/Medium/SemiBold/Bold)
- Scale: Display 36px | H1 28px | H2 22px | H3 18px | Body Large 16px | Body Default 14px | Caption 12px | Micro 10px

### 5.2 Spacing, Radius & Component States

- Spacing scale (4px base): 4 · 8 · 12 · 16 · 20 · 24 · 32 · 40 · 48 · 64px
- Radius: Small 6px (badges/tags) · Medium 8px (cards/containers, buttons on Product 2/3) · Large 12px (modals/sheets) · Pill 999px (buttons/inputs/chips on Product 1 and website)
- Touch targets: 44×44px minimum on mobile (Product 1) and tablet-width Product 2 views; 40×40px acceptable on desktop-only Product 2/3 views
- Component states — every interactive element defines: Default → Hover (desktop) / Pressed (mobile) → Disabled → Loading
- Inputs additionally define: Focus, Error (with inline message), Filled

### 5.3 Accessibility & Localization

- Contrast: All text/background pairs verified WCAG AA (≥4.5:1)
- Font scaling: Layouts must not break or truncate at 120% system font scale
- Screen reader labels: Required on every icon-only control (back, bell, profile, filter) — never rely on icon shape alone
- Localization: English/Tamil toggle (Product 1, patient-facing — primary; OpenQue AIR, staff-facing — secondary/optional for MVP)
- Tamil font fallback: Noto Sans Tamil (Inter/Playfair Display don't cover Tamil glyphs) — text containers must be flexible-width to accommodate ~20-30% longer Tamil text

---

## 6. PRODUCT 1 — PATIENT APP

### 6.1 Information Architecture

Structure: 5-tab bottom navigation, entered after a linear onboarding flow.

**Auth Flow (pre-tab, linear, one-time):** Splash → Welcome (3 slides) → Login/Signup → OTP Verify → Location/Notification permissions → Profile Setup → Home

*(ABHA Linking step removed from this flow — ABDM/ABHA integration is temporarily out of scope. Profile Setup routes directly to Home upon completion.)*

- Tab 1 — Home: Discovery, search, hospital/doctor browsing, booking entry point
- Tab 2 — Bookings: Upcoming/past appointment management, reschedule, cancel
- Tab 3 — Queue: Live, passive queue tracking — the product's core differentiator
- Tab 4 — Booking flow: (accessed contextually from Home, not a persistent tab)
- Tab 5 — Profile: Account, settings, privacy, support

Notification bell and profile icon live on the Home header, not as separate tabs.

### 6.2 Full Screen-by-Screen Content Specification

Design principles most active in this product: Passive Experience (3.1) governs every Queue screen. Jakob's Law (4.3) governs the entire Onboarding section. Peak-End Rule (4.5) governs Booking Confirmation and Consultation Complete specifically.

#### SECTION: Onboarding

- **Screen: Splash Screen** — OpenQue logo centered on Primary gradient full-bleed background, logo rendered in white/light for contrast. No text, no CTA. Auto-advances after 2 seconds. Checks for existing session — logged-in users skip directly to Home.
- **Screen: Welcome Carousel (Slide 1 of 3)** — Illustration (find hospitals/doctors theme). Heading: "Find the right doctor, fast." Body text: one-line supporting copy. "Skip" link (top-right). Pagination dots at bottom. Swipe gesture to advance.
- **Screen: Welcome Carousel (Slide 2 of 3)** — Illustration (booking/calendar theme). Heading: "Book appointments in seconds."
- **Screen: Welcome Carousel (Slide 3 of 3)** — Illustration (live queue theme). Heading: "Track your queue, live." Primary CTA button: "Continue" — replaces "Skip" on final slide, routes to Login/Signup choice.
- **Screen: Login** — Back icon (top-left, only if arrived via carousel). Heading: "Login." Body label: "Enter your registered mobile number." Input field: phone number, numeric keypad auto-trigger, Primary focus-state border. Primary CTA: "Send OTP." Secondary link: "New here? Sign up."
- **Screen: Signup** — Back icon → returns to Welcome Carousel. Heading: "Signup." Label: "Enter your mobile number." CTA: "Send OTP." Link: "Already have an account? Login."
- **Screen: OTP Verification** — Back icon → returns to Login/Signup, clears entered number. Heading: "OTP Verification." Body: "Enter the 6-digit code sent to +91-XXXXXXXXXX." Six-box OTP input, auto-read/autofill supported. 30-second resend timer countdown with "Resend OTP" link activating after timer expires. CTA: "Verify OTP."
- **Screen: OTP Verification — Error State** — Same layout, input boxes bordered in muted amber (Delayed/Attention token), inline message: "Incorrect OTP. Please try again."
- **Screen: OTP Verified Successfully** — Centered checkmark icon. Heading: "OTP Verified Successfully." No CTA — auto-advances after ~1.5 seconds.
- **Screen: Location Access** — No back icon (permission screens block backward exit). Centered location-pin icon. Heading: "Enable location access." Body: "Discover nearby hospitals around you." Primary CTA: "Allow access." Secondary link: "Enter location manually."
- **Screen: Enter Location Manually** — Back icon → returns to Location Access. Search bar: "Search area, locality, or pincode" with live autocomplete dropdown. Optional "Use current location" link. CTA: "Confirm location" (disabled until a selection is made).
- **Screen: Notification Access** — No back icon. Centered bell icon. Heading: "Stay updated." Body: "Enable notifications to be kept updated on your queue and appointments." Primary CTA: "Allow Notification." Secondary link: "Maybe Later."
- **Screen: Notification Access — Previously Denied Re-Prompt** — Shown if patient later tries a notification-dependent action having denied access earlier. Heading: "Notifications are off." CTA: "Open Settings." Secondary link: "Not now."
- **Screen: Profile Details** — Back icon → returns to Notification Access. Heading: "Tell us about you." Form fields: First name, Last name, Date of Birth (date picker), Gender (segmented control). All fields required — CTA "Continue" stays disabled until filled. Inline validation on blur. **CTA "Continue" routes directly to Home, completing onboarding.**

#### SECTION: Home / Discovery

- **Screen: Home Feed — Default (Returning User)** — Header row: location pin + area name (tappable) on left, notification bell + profile icon (top-right). Search bar: "Search hospitals, doctors, specialties." Horizontal scroll of specialty chips. "Your Upcoming Appointment" card (if exists): doctor name, hospital, date/time, tap → Appointment Detail. "Nearby Hospitals" section: horizontal card scroll — hospital name, distance, rating, "Book now" button per card.
- **Screen: Home Feed — New User / No Appointment Yet** — Banner: illustration, heading: "Book your first appointment." CTA: "Browse hospitals."
- **Screen: Home Feed — No Appointments (Existing User)** — Appointment-card area shows: calendar icon, "You have no appointments." CTA: "Book now." Secondary link: "View past appointments."
- **Screen: Home Feed — Service Not Available in Area** — Illustration: map pin, calm/coming-soon tone. Heading: "OpenQue isn't in your area yet." Body: "We're expanding fast — we'll notify you the moment we launch near you." CTA: "Notify me when available." Secondary link: "Search a different area." *(Decided v6 — see Section 17.3 item 21: this stores `user_id`, `target_area`, `created_at`, `status`, `notification_token`/`phone_number` and fires an event-driven push/WhatsApp/SMS notification once OpenQue launches in that area — same mechanism as the slot-availability notify below.)*
- **Screen: Search Results — List View** — Back icon → Home. Persistent editable search bar. Toggle (top-right): List/Map. Filter icon → Filters Panel. Sort dropdown: Distance / Rating / Fee. Result cards: photo thumbnail, name, specialty, distance, fee, next available slot badge.
- **Screen: Search Results — Empty State** — Illustration + heading: "No results found for '[search term]'." CTA: "Clear filters."
- **Screen: Search Results — Map View** — Full-screen map, Primary-colored pins. Tap pin → mini preview card slides up. Drag-up converts to full List View.
- **Screen: Filters Panel** — Bottom sheet overlay. Sections: Specialty (multi-select chips), Distance (slider, km), Fee range (dual slider), Availability (segmented: Today / This week). Primary CTA: "Apply filters." Secondary: "Reset all."
- **Screen: Hospital Profile Page** — Back icon. Hero image/banner of hospital. Heading: hospital name. Body: address, rating, distance. "Call" and "Directions" quick actions. Specialty chips (read-only). "Doctors" section: list of doctor cards. "About" section: expandable description.
- **Screen: Doctor Profile Page** — Back icon. Doctor photo (circular), heading: doctor name, body: qualifications, specialty, years of experience. Fee displayed prominently. Hospital name/location (tappable). "Available slots" preview: next 2-3 days. Sticky bottom CTA: "Book Appointment."
- **Screen: Slot Selection — Calendar View** — Back icon. Doctor + hospital name recap header. Horizontal scrollable date strip (next 14 days). CTA: "Continue" (disabled until date selected).
- **Screen: Slot Selection — No Slots Available** — Illustration + heading: "No slots available for the next 14 days." CTA: "Notify me when slots open." Secondary link: "Choose a different doctor." *(Decided v6 — see Section 17.3 item 21: same store/dispatch mechanism as the Home Feed's area-notify above, scoped to `doctor_id`/`clinic_id`/`target_date`/`time_preference` instead of area. Feeds Module K's waitlist below when the slot in question later frees up.)*
- **Screen: Slot Selection — Time Grid** — Back icon → returns to Calendar View. Time slots grouped: Morning / Afternoon / Evening. Grid of time chips. CTA: "Continue to booking" (disabled until time selected).

#### SECTION: Booking

- **Screen: Booking Summary** — Back icon → returns to Time Grid. Heading: "Booking Summary." Recap card: doctor name, specialty, hospital name, date, time. Fee note (Inter, muted text): "Consultation fee: ₹[amount], payable at the hospital." Cancellation policy note: "Free cancellation any time before your appointment." Primary CTA: **"Confirm Booking."**
- **Screen: Booking Confirmation** — Success checkmark animation. Heading: "Booking Confirmed!" Recap: booking ID, doctor, hospital, date, time. Body note: "Pay at the hospital — no online payment required." Secondary CTA: "Add to calendar." Primary CTA: "View booking" → Appointment Detail.
- **Screen: Slot No Longer Available** — Illustration + heading: "This slot was just booked by someone else." CTA: "Choose another slot" → Time Grid (refreshed availability).
- **Screen: Cancel Booking** — Heading: "Cancel appointment?" Body: "Your slot will be released. Since payment is collected at the hospital, no refund transaction is needed." CTA: "Confirm cancellation."

*(Removed: Payment Screen, Payment Processing, Payment Failure, Payment Timeout, Refund Amount Preview — all were online-payment-specific and are out of scope for cash-only Scale 1.)*

#### SECTION: Queue

- **Screen: Queue Tab — No Active Queue (Default)** — Illustration, calm/neutral tone. Heading: "No active queue right now." Body: "Your queue status will appear here on the day of your appointment." CTA: "View upcoming appointments."
- **Screen: Active Queue Tracker — Live** — Header: doctor name, hospital name, appointment time. Dynamic progress bar — stages appear only once generated: Arrived → Consultation → [Test/Scan if referred] → Consultation → Completed. Below bar: bucketed position status text: "2 people ahead of you" with contextual disclaimer: "This may shift slightly if a returning patient is added in between." No action buttons anywhere on this screen — fully passive.
- **Screen: Queue Position Card (Compact, also shown on Home)** — Condensed card: doctor name, position status text only. Tap anywhere → expands to full Active Queue Tracker.
- **Screen: Arrival Chip Notification** — Toast/chip overlay: "You've arrived ✓" — triggered by receptionist action, auto-dismisses after a few seconds.
- **Screen: Queue Updated Chip (Position Shift)** — Toast/chip: "Queue updated — 3 people ahead of you now" — triggered when a returning patient is inserted ahead.
- **Screen: Called-In Full-Screen Alert** — Full-screen takeover, Primary gradient background, white text. Large heading: "It's your turn!" Body: "Please proceed to Dr. [Name]'s room now." Room/counter number if available. CTA: "Got it" → dismisses to Active Queue Tracker, now showing "In Consultation" stage.
- **Screen: Referred Out (Test/Scan Stage)** — Chip: "Please proceed to Radiology for your scan." Progress bar updates. Subtext: "You'll be called again once ready — no need to check in twice."
- **Screen: Rejoined Queue (Auto)** — Chip: "You're back with Dr. [Name] — estimated wait ~10 min." Progress bar advances to next Consultation stage.
- **Screen: Consultation Complete** — Heading: "Your consultation is complete." Optional rating prompt: 5-star selector. CTA: "Submit" or "Skip." Auto-returns to Queue Tab default state after submission.
- **Screen: Connection Lost (Non-Blocking Banner)** — Thin banner: "Reconnecting..." — auto-retries, does not block the rest of the screen.
- **Screen: Doctor Running Behind** — Same Active Queue Tracker layout, subtext updates: "Running slightly behind schedule — updated estimate: 15-20 min." Reassuring tone maintained.
- **Screen: Reschedule Required** — Triggered via push notification (or WhatsApp/SMS fallback — see below). Non-alarming icon. Heading: "Dr. [Name] is unavailable on [original date]." Body: "Please choose a new time that works for you." 3-5 alternative slot cards, each with "Select this slot" CTA. Secondary link: "None of these work for me" → Waitlist screen. *(Decided v6 — see Section 17.3 item 38: alternative slots are same doctor/clinic only, never auto-cross-assigned. Offered in order — next same-day slot if the doctor is only delayed (not fully unavailable); earliest slots on the next 2 operating days in the same time-of-day window as the original booking; then the first available weekend/next-week slot. If nothing is available within 7 days, the CTA becomes "View full calendar" / "Choose an alternative doctor in the same department." Delivery channel — see item 39: push is checked for a valid token before dispatch; an absent/invalid/`Unregistered` token falls back immediately to WhatsApp Business API [interactive quick-reply: "Claim Slot"/"Decline"], then SMS with an expirable claim-token link (`openque.in/c/{token}`) as a second fallback.)*
- **Screen: Reschedule Confirmed** — Checkmark icon. Heading: "You're rescheduled to [new date/time]." CTA: "Done" → returns to Booking tab.
- **Screen: Waitlist** — Heading: "We'll notify you the moment an earlier slot opens." Body: shows the 15-minute claim window once notified, with an active countdown timer at that point *(decided v6 — see Section 17.3 item 22, per Module K/9.12)*. Toggle option: "Or would you like us to call you?" *(Decided v6 — see Section 17.3 item 37: this is an automated IVR call — e.g. Exotel/Twilio — fired immediately on slot release ["A slot has opened for Dr. [Name]. Press 1 to confirm, Press 2 to pass."], not a manual staff callback, which can't reliably happen inside a 15-minute window. If automated IVR isn't in MVP scope, this toggle should be removed rather than shipped as an unfulfillable promise.)* CTA: "Join waitlist."

#### SECTION: Bookings Tab

- **Screen: Bookings — Upcoming/Past Toggle** — Top segmented toggle: "Upcoming | Past." Defaults to Upcoming. List of appointment cards: doctor name, hospital, date/time, status tag (Confirmed / Rescheduled / Completed / No-show).
- **Screen: Bookings — Empty State (No Bookings Ever)** — Illustration + heading: "You haven't booked an appointment yet." CTA: "Book your first appointment."
- **Screen: Upcoming — Empty State** — Heading: "No upcoming appointments." CTA: "Book now."
- **Screen: Appointment Detail** — Back icon. Doctor, hospital, date/time, fee, note: "Pay at hospital — Cash." Cancellation policy reminder. Two CTAs (side by side): "Reschedule" and "Cancel" — hidden/disabled once appointment status is `ARRIVED`/`IN_QUEUE`/`IN_CONSULTATION`/`COMPLETED`, not only once `COMPLETED`. *(Decided v6 — see Section 17.3 item 40: while status is `CONFIRMED`/`BOOKED`, both actions stay enabled up to the facility's policy cutoff, e.g. 1-2 hours before the slot. Once the patient is checked into the active queue, self-serve cancel/reschedule is disabled — allowing it there would corrupt queue position calculations for other waiting patients. From that point, only clinic staff can act, via the desk dashboard, recorded as `LEFT_WITHOUT_BEING_SEEN` or `CANCELLED_BY_DESK`.)*
- **Screen: Reschedule Screen (Patient-Initiated)** — Back icon → returns to Appointment Detail. Reuses Slot Selection UI. Note: "Rescheduling is free, any time before your appointment." CTA: "Confirm new slot."
- **Screen: Cancel Confirmation** — "Your slot will be released. Since payment is collected at the hospital, no refund transaction is needed." CTA: "Confirm cancellation."
- **Screen: Past Appointments — List** — Same card format as Upcoming, statuses limited to Completed / Cancelled / No-show. Tap → read-only Appointment Detail with "Book again" shortcut.
- **Screen: No-Show Marked Appointment (Past)** — Status tag: "No-show."

*(Removed: Refund Processing, Refund Complete, Refund Failed — online-payment-specific.)*

#### SECTION: Profile

- **Screen: Profile — Main** — Accessed via profile icon on Home header. Profile photo/initials circle, name, phone number. Menu list: Edit Profile, Notification Preferences, Language, Help & FAQ, Privacy Settings, Grievance, Delete Account, Logout.

*(Removed: ABHA Management, Saved Payment Methods — out of scope.)*

- **Screen: Edit Profile** — Back icon. Editable fields: First name, Last name, DOB, Gender. Phone number shown read-only (requires OTP re-verify to change). CTA: "Save changes."
- **Screen: Notification Preferences** — Back icon. Per-channel toggles: Push notifications, SMS, WhatsApp updates. *(Note — v6: time-critical alerts, e.g. a freed waitlist slot, always fall back to WhatsApp/SMS if push is unavailable regardless of this toggle's state for push specifically — see the Reschedule Required entry above and Section 17.3 item 39.)*
- **Screen: Language Toggle** — Back icon. Radio selection: English / Tamil. CTA: "Apply." *(Decided v6 — see Section 17.3 item 23: hybrid scope — stored locally for immediate UI/guest state, and synced to the `user_profile` table server-side so transactional notifications and multi-device sessions honor the chosen language.)*
- **Screen: Help & FAQ** — Back icon. Searchable FAQ list, expandable accordion items. Bottom CTA: "Still need help? Contact support."
- **Screen: Contact Support** — Back icon. Issue category dropdown (Booking / Technical / Other). Description text field. CTA: "Submit" → confirmation toast: "We'll respond within 24 hours."
- **Screen: Privacy Settings** — Back icon. Data-sharing consent toggles (DPDP-aligned). Link: "View our privacy policy."
- **Screen: Grievance Submission** — Back icon. Formal grievance form: nature of complaint dropdown, description field. Displays Grievance Officer contact info. CTA: "Submit grievance." *(Decided v6 — see Section 17.3 item 25: two distinct contacts shown, clearly labeled — a platform-wide Grievance Officer for software/data-privacy/account/payment-process issues [DPDP/IT Rules requirement], and the specific hospital's Nodal Officer for clinical conduct, billing disputes, doctor delays, or treatment quality. OpenQue is the intermediary for the former, not the latter.)*
- **Screen: Delete Account** — Back icon. Warning text (muted amber, not harsh red): "This will permanently delete your account and data, including booking history." Requires OTP re-verify. CTA: "Delete my account." *(Decided v6 — see Section 17.3 item 24: OTP re-verify chosen over typed confirmation — identity verification matters more than reducing friction here. Followed by a 15-30 day soft-delete grace period before hard deletion, to stay compliant with medical-record-retention expectations.)*
- **Screen: Delete Account Confirmation** — "Your account has been deleted." Auto-logs out, returns to Splash Screen.
- **Screen: Logout Confirmation** — Modal overlay: "Are you sure you want to log out?" CTA: "Log out" / "Cancel."

---

