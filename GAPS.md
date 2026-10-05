# ABIHANI — GAPS & STATUS REGISTER

All open, closed, and deferred items across the product lifecycle.

---

## 1. Closed Decisions (Locked & Implemented in Frontend Mock)
- **Identity & Styling**: Background `#0B0B0F`, text `#F5F0E6`, Crimson `#C41E3A`, Gold `#E7C27A`.
- **Express Rule**: Strip "Express" from all user-facing UI except 3 legal footers.
- **Settlement Mode**: Manual mode active (`settlement_method = 'manual'`).
- **7-Status Order State Machine**: Paid (Unconfirmed) -> Paid (Receipt Uploaded) -> Paid (Confirmed) -> Shipped -> Done (or Cancelled/Disputed).
- **Seller Flow**: "Ask for receipt", "Ship anyway", "Cancel order".
- **Bottom Nav**: Solid crimson capsule, bone white text, gold center plus, 5px dot active indicator.
- **Wordmark**: Bone white 19px, weight 800, tracking -0.6px, blinking 6px crimson dot.
- **Splash Screen**: Pure white backdrop, angular crimson AH mark, "from Abihani Isa", auto-dismisses under 1s.
- **Pre-Order Negotiations**: "Ask about this first" creates a post-linked discussion thread with private offer capacity.
- **Mock Architecture**: `VITE_USE_MOCK=true`, local reactive stores, console OTP logger.

## 2. Deferred to Production Backend Stage
- **Automated Escrow**: CAC registration required. When ready, switch `settlement_method` from `'manual'` to `'escrow'` with auto-release timers and Paystack/Flutterwave split webhooks.
- **Cloudflare R2 Media Storage**: Currently using object URLs and high-fidelity mock image sets.
- **Supabase PostgreSQL & Row Level Security (RLS)**: Schema contracts designed (`src/types/`).
- **Resend Production Email Deliverability**: Free tier 100/day. Admin notification email toggles built in dashboard.
- **Upstash Redis Rate Limiting**: Frontend simulated rate limits.
- **Multi-region CDNs**: Production DNS setup at QServers / Cloudflare Pages.
