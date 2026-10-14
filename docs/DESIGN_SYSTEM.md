# Design System: Material You (Material Design 3)

This document outlines the visual system, color scales, typography, and component styling rules for the single-branch clinic platform.

---

## 1. Core Seed & Color Palette

- **Seed Color**: `#6750A4` (Material 3 Key Purple)
- **Design Language**: Material You (Material Design 3) with healthcare enhancements for trust and clarity.

### Light Theme Tokens
- **Primary**: `#6750A4` (Used for primary CTA buttons, active tabs, brand accents)
- **On Primary**: `#FFFFFF`
- **Primary Container**: `#EADDFF` (Pill badges, highlighted card surfaces)
- **On Primary Container**: `#21005D`
- **Secondary**: `#625B71`
- **On Secondary**: `#FFFFFF`
- **Secondary Container**: `#E8DEF8`
- **On Secondary Container**: `#1D192B`
- **Tertiary**: `#7D5260` (Warm accent for notices and badges)
- **On Tertiary**: `#FFFFFF`
- **Surface**: `#FEF7FF` (Main page background)
- **On Surface**: `#1D1B20` (Main text)
- **Surface Variant**: `#E7E0EC`
- **On Surface Variant**: `#49454F` (Secondary text / labels)
- **Outline**: `#79747E` (Borders, input outlines)
- **Outline Variant**: `#CAC4D0` (Dividers, card borders)
- **Surface Container Levels**:
  - `lowest`: `#FFFFFF`
  - `low`: `#F7F2FA`
  - `default`: `#F3EDF7`
  - `high`: `#ECE6F0`
  - `highest`: `#E6E0E9`

### Healthcare / Indian Clinic Accents
- **WhatsApp Green**: `#25D366`
- **Call Direct**: `#0284C7`
- **Success / Verified**: `#15803D`

---

## 2. Typography

- **Primary Latin Font**: **Roboto** (Weights: `400` Regular, `500` Medium, `700` Bold) loaded via `next/font/google`.
- **Indian Regional Script**: **Noto Sans Devanagari** (Weights: `400` Regular, `500` Medium, `700` Bold) loaded via `next/font/google`.
- **CSS Variables**: `--font-roboto`, `--font-noto-devanagari`.
- **Fallback Font Stack**: `system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`.

---

## 3. Shapes & Radiuses (MD3 Scale)

- **Extra Small**: `4px` (`rounded-xs`) - Small badges, tag chips
- **Small**: `8px` (`rounded-sm`) - Form helper popups
- **Medium**: `12px` (`rounded-md` / `rounded-xl`) - Inputs, textareas, select inputs
- **Large**: `16px` (`rounded-2xl`) - Cards, modals, dialog surfaces
- **Extra Large**: `28px` (`rounded-3xl`) - FABs, hero panels, promo banners
- **Full**: `9999px` (`rounded-full`) - Action buttons, status pills, floating badges

---

## 4. Elevation & Shadows

- **Elevation 1**: Subtly raised cards (`0px 1px 2px rgba(0,0,0,0.3)`)
- **Elevation 2**: Hovered cards, sticky headers
- **Elevation 3**: Dropdowns, dialogs, modals
- **Elevation 4**: Floating Action Buttons (FABs)
- **Elevation 5**: Urgent notifications, bottom sheets

---

## 5. Component Guidelines

- **Buttons**:
  - Filled (`bg-primary text-on-primary`): Primary actions (Book Appointment, Submit).
  - Outlined (`border border-outline text-primary`): Secondary actions (Learn More, Directions).
  - Tonal / Elevated: Filter chips, utility actions.
- **Form Inputs**:
  - Must include explicit visible labels or accessible `aria-label`.
  - Focused inputs display high-contrast focus rings (`focus:ring-2 focus:ring-primary`).
  - Error messages render in `#BA1A1A` with clear remedial text.
- **Mobile Action Bar**:
  - Sticky bottom navigation on screens `< 768px` for quick Phone, WhatsApp, and Booking access.
