# Vibe Store Completion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver a polished, responsive E-book demo store that satisfies the worksheet, passes security/build checks, deploys to a working Vercel URL, opens from MIT App Inventor, and includes submission evidence.

**Architecture:** Keep the existing Next.js App Router and local demo order engine because the assignment forbids real payment and accepts simulated email. Protect order pages with high-entropy access tokens, keep order lookup generic, and clearly document that production persistence/private storage require Supabase credentials. Redesign presentation with a warm editorial palette, restrained motion, strong hierarchy, and accessible native controls.

**Tech Stack:** Next.js 16, React 18, TypeScript, Tailwind CSS, Node test runner, MIT App Inventor WebViewer, Vercel.

---

### Task 1: Restore a clean secure build

**Files:**
- Modify: `next.config.mjs`
- Modify: `package.json`
- Modify: `package-lock.json`
- Test: `test_e2e_flow.js`
- Test: `test_order_security.mjs`

- [ ] **Step 1: Reproduce build failure**

Run `node node_modules/next/dist/bin/next build` and preserve the exact `/_not-found` failure.

- [ ] **Step 2: Confirm root cause**

Verify no dev server owns port 3000, move stale `.next` output aside, configure `turbopack.root` to the repository directory, then rebuild once.

- [ ] **Step 3: Verify security baseline**

Run `node test_e2e_flow.js`, `node --test test_order_security.mjs`, production build, and `npm audit --omit=dev`. Expected: 30 tests pass, build exit 0, 0 vulnerabilities.

- [ ] **Step 4: Commit**

Commit message: `fix: harden order access and upgrade secure runtime`.

### Task 2: Replace generic cyber UI with editorial storefront

**Files:**
- Modify: `src/app/globals.css`
- Modify: `src/app/page.tsx`
- Modify: `src/components/Navbar.tsx`
- Modify: `src/components/Footer.tsx`
- Modify: `src/components/DemoBanner.tsx`
- Modify: `src/components/CartDrawer.tsx`
- Modify: `src/app/product/[id]/page.tsx`

- [ ] **Step 1: Add failing UI contract checks**

Extend `test_e2e_flow.js` to require skip navigation, semantic search labels, visible DEMO ONLY copy, and reduced-motion support. Run test; expected FAIL on missing contracts.

- [ ] **Step 2: Implement design system**

Use cream paper surfaces, ink/navy text, burnt-orange actions, moss status accents, 4/8/12px radius hierarchy, focus-visible rings, and `prefers-reduced-motion`. Remove excessive purple gradients and glow shadows.

- [ ] **Step 3: Rebuild storefront interactions**

Keep 3 products, search/filter, cart, details, and buy flow. Add subtle CSS-only hover lift, animated underline, toast, and progress cues without layout shift.

- [ ] **Step 4: Verify responsive UI**

Browser-test 320, 768, 1024, and 1440 widths; keyboard-tab primary controls; check console errors. Expected: no horizontal overflow, clipped Thai text, or unnamed controls.

- [ ] **Step 5: Commit**

Commit message: `feat: redesign ebook storefront experience`.

### Task 3: Polish checkout, payment, delivery, and tracking

**Files:**
- Modify: `src/app/checkout/page.tsx`
- Modify: `src/app/payment/[orderId]/page.tsx`
- Modify: `src/app/order-success/[orderId]/page.tsx`
- Modify: `src/app/track-order/page.tsx`
- Modify: `src/components/SimulatedInboxModal.tsx`
- Test: `test_e2e_flow.js`

- [ ] **Step 1: Add failing flow UI checks**

Require associated labels, keyboard-selectable payment options, accessible status regions, generic lookup errors, and token-aware links. Run tests; expected FAIL only for newly required missing contracts.

- [ ] **Step 2: Implement cohesive flow UI**

Use a two-step progress header, clear order summary, explicit PENDING/PAID states, persistent DEMO ONLY warning, restrained success animation, and mobile-first actions.

- [ ] **Step 3: Browser-test complete flow**

Create order with test data, confirm PENDING, reject wrong token, simulate PAID, inspect simulated email, reject wrong email, accept matching email, and verify expired-link state.

- [ ] **Step 4: Commit**

Commit message: `feat: polish secure purchase and delivery flow`.

### Task 4: Deploy and bind mobile wrapper

**Files:**
- Modify: `mobile_app/generate_aia.py`
- Regenerate: `mobile_app/VibeEBookShop_Wrapper.aia`
- Modify: `mobile_app/BLOCKS_GUIDE.md`
- Modify: `README.md`

- [ ] **Step 1: Push verified commits**

Push current branch to `origin` only after secret scan and clean tests.

- [ ] **Step 2: Obtain working Vercel URL**

Use existing project integration if available; otherwise stop at account-auth boundary and give the user exact import steps. Verify production URL returns HTTP 200.

- [ ] **Step 3: Regenerate AIA**

Set WebViewer `HomeUrl` to verified HTTPS production URL, `FollowLinks=true`, `IgnoreSslErrors=false`, `UsesLocation=false`, and retain `CanGoBack -> GoBack` block. Run `python test_aia_format.py`.

- [ ] **Step 4: APK boundary**

If MIT App Inventor authenticated build access is available, build APK. Otherwise provide the `.aia` plus exact 4-click APK build steps because account login/build signing must be completed by the user.

- [ ] **Step 5: Commit**

Commit message: `chore: bind mobile wrapper to production`.

### Task 5: Produce submission report and evidence

**Files:**
- Modify: `../รายงานส่งงาน_Vibe_Coding_Ebook_Shop.md`
- Modify: `../รายงานส่งงาน_Vibe_Coding_Ebook_Shop.docx`
- Create: `docs/evidence/*.png`

- [ ] **Step 1: Capture evidence**

Capture storefront, checkout PENDING, DEMO ONLY payment, PAID delivery, tracking verification, simulated email, mobile viewport, test output, and production URL.

- [ ] **Step 2: Update checklist honestly**

Mark only verified items complete. State mock-payment, local demo storage, temporary-link limitations, and App Inventor WebViewer constraints.

- [ ] **Step 3: Render and inspect report**

Render DOCX to PNG pages, inspect Thai text, margins, tables, URLs, captions, and page breaks; revise until clean.

- [ ] **Step 4: Final verification**

Run full tests, build, audit, AIA validation, secret scan, Git status, and production smoke test. Report remaining user actions only.
