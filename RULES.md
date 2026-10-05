# ABIHANI — LOCKED RULES

The complete record of locked decisions for Abihani.

---

## 1. Identity & Naming
- Product name is always **Abihani**. Never anything else.
- Tagline: "The social marketplace."
- The string "Express" is forbidden in user-facing UI, headings, titles, meta tags, and notices. Permitted only in the 3 legal footers:
  1. About screen footer: "Abihani is a product of Abihani Express, registered in Nigeria."
  2. Terms sheet footer
  3. Privacy Policy sheet footer
- Wordmark: Bone white (#F5F0E6), 19px, weight 800, tracking -0.6px, followed by a 6px crimson blinking dot. No 'A' badge in the top-left feed.
- Parent mark: Angular crimson AH mark (used only on Splash screen, App icon, About sheet, Download page).

## 2. Colors & Typography
- Background: `#0B0B0F`
- Primary text (bone): `#F5F0E6`
- Secondary text: `#B8B2A6`
- Crimson: `#C41E3A` (Reserved for the single most important action on each screen)
- Gold: `#E7C27A` (Reserved for prices and verified signals)
- Success: `#4ADE80`
- Danger: `#FF3B3B`
- System font stack, tight tracking on headings, weights 500/700/800.

## 3. Account Model
- One profile for everyone. No buyer mode. No seller mode.
- Signup is email-only at launch (placeholder `you@example.com`, label `Email`, button `Continue`).
- Age gate: "By continuing, you confirm you are 18 or older."
- Terms acceptance: "By continuing, you agree to our Terms and Privacy Policy." Tapping Continue is logged consent.
- Email OTP mock prints the 6-digit code to the browser console.
- Recovery code: 8 digits, generated once.
- Phone is contact, not identity. Stored as `contact_phone`. Never used for login. Only collected inside order threads or payout setup.

## 4. Feed & Gestures
- Full-screen vertical scroll-snap. One post per viewport.
- Swipe up/down: next/previous post.
- Double-tap: like with heart burst animation.
- Swipe left on last image or single image: open seller profile.
- Swipe from left edge (20px): go back (never on feed media).
- Feed scroll position is preserved across tab switches. Tapping the Home tab again scrolls to top.
- Right rail: Avatar + plus, Follow, Like, Comment, Share, Save, More.
- Bottom info card: Collapsed + expanded. Price (`₦XX,XXX`) and Buy button together.

## 5. Ranking Engine Formula
- Score: `(likes * 1) + (comments * 3) + (shares * 5) + (saves * 4) + (views * 0.05) + (full watch time * 0.5) + (followers * 0.1) + (verified ? 5 : 0)`
- Freshness multiplier: last 24h * 1.5, last 7d * 1.2, older * 1.0.
- Posts with open reports are suppressed from For You.

## 6. Orders & Manual Settlement Mode
- Launch is in **Manual Mode** (`settlement_method = 'manual'`). Escrow is deferred.
- The 7 statuses:
  1. `Paid (Unconfirmed)` — buyer clicked "I have paid". No receipt yet.
  2. `Paid (Receipt Uploaded)` — buyer uploaded receipt.
  3. `Paid (Confirmed)` — seller confirmed payment received.
  4. `Shipped` — seller marked shipped.
  5. `Done` — buyer confirmed delivery.
  6. `Cancelled` — either side cancelled.
  7. `Disputed` — dispute opened.
- Honest copy: "Pay the seller directly. Abihani does not hold your money yet. Pay only after you trust this seller."
- Seller buttons: "Ask for receipt", "Ship anyway" (locked label), "Cancel order".
- Dispute copy: "We cannot refund your money yet. But we can ban this seller if they are wrong. Tell us what happened."

## 7. Pre-Order Offers / Negotiation
- Buyer taps "Ask about this first" -> private thread tied to post.
- Seller sends private offer price.
- Offer banner appears on the post for that buyer only.
- Accepting opens Buy sheet at the offer price.

## 8. Bottom Nav Bar
- Solid crimson capsule (`#C41E3A`), fully opaque, no glass, no blur, no white border.
- 5 items: Home, Discover, Plus, Orders, You.
- Center Plus button: Gold background (`#E7C27A`), crimson plus sign (`#C41E3A`), slightly raised.
- Active item indicator: 5px bone-white dot under the active label.
- Orders unread dot: Bone white, slow 2s pulse.

## 9. Mock Architecture
- Switch: `VITE_USE_MOCK=true`.
- Mock services: `auth.mock.ts`, `api.mock.ts`, `media.mock.ts`, `post.mock.ts`, `order.mock.ts`.
- Mocks are kept forever. Everything runs client-side in the browser.

## 10. Nigerian Legal & Cultural Rules
- NDPA 2023 compliance: Privacy policy sheet, 18+ age confirmation.
- FCCPA 2019 compliance: Truth in advertising, dispute path.
- Phone normalization: Nigerian formats normalized to `+234XXXXXXXXXX`.
- Currency format: `₦38,500` (commas, no decimals).
