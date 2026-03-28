# Component Specification Document
**Luxe Store Design System**
**Three-Layer Token Architecture: Primitive → Semantic → Component**

---

## OVERVIEW

This document defines the component token layer — the third and final layer of the design system that translates semantic tokens into component-ready values.

### Design System Layers

```
┌─────────────────────────────────────────────┐
│ COMPONENT LAYER (this document)            │
│ Specific component states & variants       │
├─────────────────────────────────────────────┤
│ SEMANTIC LAYER (design intent)             │
│ --color-primary, --ease-reveal, etc       │
├─────────────────────────────────────────────┤
│ PRIMITIVE LAYER (raw values)               │
│ #1a1a1a, 0.72s, 4px, etc                 │
└─────────────────────────────────────────────┘
```

---

## COMPONENT TOKENS

All tokens are defined in `assets/theme.css` `:root`. Use via `var(--token-name)`.

### BUTTON COMPONENT

| Token | Value | Usage |
|-------|-------|-------|
| `--button-height-base` | 44px | Default button height (WCAG AAA touch target) |
| `--button-height-sm` | 32px | Compact button (icon-only, inline buttons) |
| `--button-padding-base` | 0.875rem 2rem | Standard button padding |
| `--button-padding-sm` | 0.5rem 1.25rem | Compact button padding |
| `--button-border-radius` | 9999px | Full pill shape |
| `--button-transition` | 0.15s cubic-bezier(0.4,0,0.2,1) | Micro-motion on state change |
| `--button-shadow-base` | none | No shadow at rest |
| `--button-shadow-hover` | 0 8px 24px rgba(0,0,0,0.12) | Magnetic lift on hover |
| `--button-primary-bg` | #1a1a1a | Primary button background |
| `--button-primary-bg-hover` | #2e2e2e | Hover state (--color-primary-hover) |
| `--button-primary-text` | #ffffff | Text on primary button |
| `--button-outline-text` | #1a1a1a | Outline button text |
| `--button-disabled-bg` | #ebebeb | Disabled button background |
| `--button-disabled-text` | #666666 | Disabled button text |

**Usage:**
```css
.btn {
  height: var(--button-height-base);
  padding: var(--button-padding-base);
  border-radius: var(--button-border-radius);
  transition: all var(--button-transition);
  background: var(--button-primary-bg);
  color: var(--button-primary-text);
}

.btn:hover {
  background: var(--button-primary-bg-hover);
  box-shadow: var(--button-shadow-hover);
  transform: translateY(-2px);
}
```

---

### FORM INPUT COMPONENT

| Token | Value | Usage |
|-------|-------|-------|
| `--form-input-height` | 44px | Input height (matches button for alignment) |
| `--form-input-padding` | 0.75rem 1rem | Internal spacing |
| `--form-input-border` | 1px solid #e8e8e8 | Default border |
| `--form-input-border-radius` | 8px | Slight rounding (matches cards) |
| `--form-input-bg` | #ffffff | Input background |
| `--form-input-text` | #1a1a1a | Input text color |
| `--form-input-focus-ring` | 2px solid #c9a96e | Gold focus outline |
| `--form-input-shadow-focus` | 0 0 0 3px rgba(201,169,110,0.1) | Glow on focus |
| `--form-error-border` | #b91c1c | Red error state |
| `--form-error-text` | #b91c1c | Error text color |
| `--form-error-bg` | #fdf0f0 | Light red background |
| `--form-success-border` | #1f6b44 | Green success state |
| `--form-success-text` | #1f6b44 | Success text color |
| `--form-success-bg` | #e7f5ec | Light green background |

**State Matrix:**

| State | Border | Background | Text | Shadow |
|-------|--------|-----------|------|--------|
| Default | --color-border | #fff | --color-text | none |
| Focus | --color-accent | #fff | --color-text | --form-input-shadow-focus |
| Error | --form-error-border | --form-error-bg | --form-error-text | red glow |
| Success | --form-success-border | --form-success-bg | --form-success-text | green glow |
| Disabled | --color-border | --color-bg-muted | --color-text-muted | none |

**Usage:**
```html
<input type="email" placeholder="your@email.com">
<div class="form__error" id="email-error" role="alert">
  Invalid email address
</div>
```

```css
input:focus {
  outline: var(--form-input-focus-ring);
  border-color: var(--color-accent);
  box-shadow: var(--form-input-shadow-focus);
}

input[aria-invalid="true"] {
  border-color: var(--form-error-border);
  background: var(--form-error-bg);
  color: var(--form-error-text);
}
```

---

### CARD COMPONENT

| Token | Value | Usage |
|-------|-------|-------|
| `--card-padding` | 1.5rem | Internal card spacing |
| `--card-gap` | 1rem | Gap between card items |
| `--card-border-radius` | 8px | Slight rounding |
| `--card-border` | 1px solid #e8e8e8 | Subtle border |
| `--card-bg` | #ffffff | Card background |
| `--card-shadow` | 0 1px 3px rgba(0,0,0,0.06) | Subtle shadow at rest |
| `--card-shadow-hover` | 0 4px 16px rgba(0,0,0,0.08) | Enhanced shadow on hover |
| `--card-transform-hover` | translateY(-4px) | Magnetic lift |

**Usage:**
```css
.card {
  padding: var(--card-padding);
  gap: var(--card-gap);
  border-radius: var(--card-border-radius);
  border: var(--card-border);
  background: var(--card-bg);
  box-shadow: var(--card-shadow);
  transition: all var(--ease-component);
}

.card:hover {
  box-shadow: var(--card-shadow-hover);
  transform: var(--card-transform-hover);
}
```

---

### BADGE COMPONENT

| Token | Value | Usage |
|-------|-------|-------|
| `--badge-height` | 24px | Compact height |
| `--badge-padding` | 0.25rem 0.75rem | Tight spacing |
| `--badge-border-radius` | 9999px | Full pill |
| `--badge-font-size` | 0.75rem (12px) | Small text |
| `--badge-font-weight` | 600 | Semibold emphasis |
| `--badge-bg` | #f6f6f4 | Neutral background |
| `--badge-text` | #1a1a1a | Dark text |
| `--badge-bg-accent` | rgba(201,169,110,0.15) | Light gold background for accent variant |
| `--badge-text-accent` | #c9a96e | Gold text for accent variant |

**Variants:**

```html
<!-- Neutral badge -->
<span class="badge">Sale</span>

<!-- Accent badge -->
<span class="badge badge--accent">New</span>

<!-- Status badges -->
<span class="badge" style="--badge-bg: var(--form-success-bg); --badge-text: var(--form-success-text);">In Stock</span>
```

---

### MODAL/DIALOG COMPONENT

| Token | Value | Usage |
|-------|-------|-------|
| `--modal-border-radius` | 16px | Larger rounding for modals |
| `--modal-shadow` | 0 8px 32px rgba(0,0,0,0.14), 0 2px 8px rgba(0,0,0,0.08) | Premium floating shadow |
| `--modal-padding` | 2rem | Generous internal spacing |
| `--modal-overlay-bg` | rgba(0,0,0,0.5) | Semi-transparent overlay |

**Requirements:**
- `role="dialog"` on modal container
- `aria-labelledby="modal-title"` linking to heading
- `aria-modal="true"`
- Focus trap (focus cannot escape modal)
- Close button or ESC key handling

---

### ACCORDION/DISCLOSURE COMPONENT

| Token | Value | Usage |
|-------|-------|-------|
| `--accordion-border` | 1px solid #e8e8e8 | Divider between items |
| `--accordion-item-padding` | 1.25rem | Vertical item spacing |
| `--accordion-toggle-height` | 44px | Button height (keyboard accessible) |
| `--accordion-icon-rotate-open` | 45deg | Plus rotates to × on open |

**Semantic HTML:**
```html
<div class="accordion">
  <button
    class="accordion__toggle"
    aria-expanded="false"
    aria-controls="accordion-panel-1"
    id="accordion-button-1">
    Question
    <span class="accordion__icon" aria-hidden="true">+</span>
  </button>
  <div
    class="accordion__panel"
    id="accordion-panel-1"
    role="region"
    aria-labelledby="accordion-button-1">
    Answer
  </div>
</div>
```

---

### LINK COMPONENT

| Token | Value | Usage |
|-------|-------|-------|
| `--link-color` | #c9a96e | Default link color (accent gold) |
| `--link-color-hover` | #b8924f | Darker on hover |
| `--link-transition` | 0.15s cubic-bezier(0.4,0,0.2,1) | Micro-motion |

**Usage:**
```css
a {
  color: var(--link-color);
  transition: color var(--link-transition);
}

a:hover,
a:focus {
  color: var(--link-color-hover);
}
```

---

## RESPONSIVE BEHAVIOR

### Breakpoints (Unified)

| Size | Width | When to Use |
|------|-------|------------|
| **Mobile** | ≤479px | Phones (portrait) |
| **Tablet** | 480–1023px | Tablets (portrait), small phones (landscape) |
| **Desktop** | ≥1024px | Full-size browsers |

**CSS:**
```css
/* Mobile-first approach */
.component { /* mobile styles */ }

@media (min-width: 480px) {
  .component { /* tablet styles */ }
}

@media (min-width: 1024px) {
  .component { /* desktop styles */ }
}
```

**Component Scaling:**
- Button: 44px height maintained across all breakpoints
- Form input: 44px height maintained
- Card padding: Reduce on mobile (1rem on mobile, 1.5rem on desktop)
- Touch targets: Minimum 44px × 44px always

---

## ANIMATION & MOTION

### Motion Tokens

| Tier | Token | Duration | Easing | Use Case |
|------|-------|----------|--------|----------|
| **Micro** | `--ease-micro` | 0.15s | cubic-bezier(0.4,0,0.2,1) | Button press, icon spin |
| **Component** | `--ease-component` | 0.35s | cubic-bezier(0.4,0,0.2,1) | Card lift, drawer slide |
| **Reveal** | `--ease-reveal` | 0.72s | cubic-bezier(0.16,1,0.3,1) | Scroll entrance (Power4.out) |
| **Spring** | `--ease-spring` | 0.5s | cubic-bezier(0.34,1.56,0.64,1) | Bounce entrance |

**`prefers-reduced-motion`:**
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## ACCESSIBILITY CHECKLIST

Use this when building components:

- [ ] Touch targets ≥44px × 44px
- [ ] Color contrast ≥4.5:1 for normal text (WCAG AA)
- [ ] Focus visible outline (2px solid gold)
- [ ] Semantic HTML (`<button>`, `<label>`, `<main>`)
- [ ] ARIA labels on icon-only buttons
- [ ] Form inputs have `<label>` with `for` attribute
- [ ] Error messages have `role="alert"`
- [ ] Modal has `role="dialog"` + `aria-modal="true"`
- [ ] Keyboard navigation (Tab, Shift+Tab, Enter, Escape)
- [ ] No color-only information (icons + text)

---

## IMPLEMENTATION EXAMPLES

### Button Variants

```css
/* Primary button (default) */
.btn--primary {
  background: var(--button-primary-bg);
  color: var(--button-primary-text);
}

.btn--primary:hover {
  background: var(--button-primary-bg-hover);
}

/* Outline button */
.btn--outline {
  background: transparent;
  color: var(--button-outline-text);
  border-color: var(--button-outline-text);
}

.btn--outline:hover {
  background: var(--button-primary-bg);
  color: var(--button-primary-text);
}

/* Disabled button */
.btn:disabled {
  background: var(--button-disabled-bg);
  color: var(--button-disabled-text);
  cursor: not-allowed;
}
```

### Card Variants

```css
/* Product card */
.product-card {
  padding: var(--card-padding);
  border-radius: var(--card-border-radius);
  background: var(--card-bg);
  box-shadow: var(--card-shadow);
  transition: all var(--ease-component);
}

.product-card:hover {
  box-shadow: var(--card-shadow-hover);
  transform: var(--card-transform-hover);
}

/* Elevated card (for featured content) */
.card--elevated {
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.14);
  border: none;
}
```

---

## FUTURE EXTENSIONS

Tokens can be extended with theme variants:

```css
/* Dark mode (future) */
@media (prefers-color-scheme: dark) {
  :root {
    --color-primary: #ffffff;
    --color-bg: #1a1a1a;
    --button-primary-bg: #ffffff;
    --button-primary-text: #1a1a1a;
    /* ... */
  }
}

/* High contrast mode (accessibility) */
@media (prefers-contrast: more) {
  :root {
    --form-input-border: 2px solid var(--color-text);
    --button-shadow-hover: 0 0 0 4px var(--color-accent);
  }
}
```

---

## TOOLING

| Tool | Purpose | Usage |
|------|---------|-------|
| Token Generator | Auto-generate CSS from JSON | `node skills/design-system/scripts/generate-tokens.cjs` |
| Token Validator | Check for hardcoded values | `node skills/design-system/scripts/validate-tokens.cjs --dir src/` |
| Contrast Checker | Verify WCAG compliance | https://webaim.org/resources/contrastchecker/ |
| Accessibility Audit | Lighthouse + axe DevTools | Browser DevTools → Lighthouse |

---

## SUMMARY

This component token layer provides:
- ✓ Consistent sizing (44px minimum touch targets)
- ✓ Cohesive color system (primary, accent, status)
- ✓ Professional motion (Power4.out, magnetic hover)
- ✓ WCAG AA accessibility built-in
- ✓ Responsive scaling (480px / 1024px breakpoints)
- ✓ Dark mode ready (use CSS custom properties)

**Next steps:** Update Liquid components to use component tokens via `var(--token-name)`.
