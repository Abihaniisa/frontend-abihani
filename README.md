# ABIHANI — The Social Marketplace

Abihani is a social marketplace for Nigeria. The feed is entertainment first, commerce second. Never let commerce feel bolted on. Payments are direct between buyer and seller. Escrow comes later.

- One account for everyone. No buyer mode. No seller mode.
- Anyone can post. Anyone can buy. Anyone can sell.
- The Feed is the center. Full-screen vertical scroll-snap. One post per viewport.
- Posts without a price are social posts. Posts with a price are shoppable.
- Hashtags do all classification. No global categories.
- Comments are the reviews. One thread per post.
- No wallet. No cart. No general DM.
- Conversations live inside order threads and pre-order negotiations only.

---

## Brand & Visual Identity

- **Name**: Abihani
- **Tagline**: The social marketplace
- **Market**: Nigeria only at launch
- **Currency**: Nigerian Naira (`₦`), formatted as `₦38,500` (commas, no decimals)
- **Public Contact Email**: `abihaniexpress@gmail.com`
- **Founder**: Abihani Isa
- **Founder Location**: Damaturu, Yobe State, Nigeria
- **Legal Footer**: "Abihani. Damaturu, Yobe State, Nigeria." (used in three places only — About sheet, Terms sheet, Privacy sheet)

### Colors

- **Background**: `#0B0B0F`
- **Primary Text (Bone)**: `#F5F0E6`
- **Secondary Text**: `#B8B2A6`
- **Crimson**: `#C41E3A` (Reserved for the single most important action on each screen)
- **Gold**: `#E7C27A` (Reserved for prices and verified signals)
- **Success**: `#4ADE80`
- **Danger**: `#FF3B3B`

---

## File Dictionary & Architecture

src/
  config/         Values that could change (app, timing, limits, features)
  labels/         All user-facing copy hardcoded (zero empty states, zero missing labels)
  theme/          Design tokens and CSS constants
  constants/      Banks, Nigerian states, seed data
  engine/         Pure business logic (ranking engine, score calculations)
  services/       Network layer (all mocks with switch VITE_USE_MOCK=true)
  hooks/          Reusable React hooks (useAuth, usePWAInstall, useOrderTimer)
  components/     Modular UI components (FeedItem, BottomNav, TopChrome, InfoCard, Skeletons)
  screens/        Full screens (Feed, Discover, Create, Orders, Thread, Profile, Settings, Admin)
  store/          Zustand stores (auth, feed, orders, settings, admin, ui)
  types/          Strict TypeScript definitions (no any)
  utils/          Helpers (formatPrice, normalizePhone, formatDate)

---

## Running Locally

npm install
npm run dev
npm run lint