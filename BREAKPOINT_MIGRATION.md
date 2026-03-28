# Breakpoint Migration Guide
**From Inconsistent to Unified Media Query System**

---

## CURRENT STATE

**13 different breakpoint values** scattered throughout `assets/theme.css`:
- 480px (appears 7 times)
- 600px (1 time)
- 640px (2 times)
- 768px (5 times)
- 900px (5 times)
- 1023px (1 time)
- 1024px (1 time)
- 1100px (1 time)

**Result:** Inconsistent responsive behavior; hard to maintain.

---

## PROPOSED SYSTEM

**Three-tier responsive design:**

```css
/* Mobile (< 480px) — DEFAULT */
/* Styles apply to all screen sizes by default */

/* Tablet (480px – 1023px) */
@media (min-width: 480px) {
  /* Override for tablets and larger */
}

/* Desktop (≥ 1024px) */
@media (min-width: 1024px) {
  /* Override for full-size browsers */
}
```

### Rationale

- **480px:** Most common tablet breakpoint (iPad mini = 480px width)
- **1024px:** Desktop threshold (1024px is where full-page layouts become practical)
- **Mobile-first:** Base styles apply to phones, then enhance upward

### Device Mappings

| Screen | Width | Breakpoint |
|--------|-------|-----------|
| iPhone SE (portrait) | 375px | Mobile |
| iPhone 14 (portrait) | 390px | Mobile |
| iPad (portrait) | 768px | Tablet (between 480-1024) |
| iPad Pro (portrait) | 1024px | Desktop |
| Desktop | 1440px+ | Desktop |
| 4K | 2560px+ | Desktop (no specific handling needed) |

---

## MIGRATION PLAN

### Phase 1: Audit (Done ✓)
Identified all 13 unique breakpoints and their usage.

### Phase 2: Consolidation (TO DO)
Gradually replace:
- 640px → use 480px or 1024px depending on intent
- 768px → split between 480px and 1024px
- 900px → replace with 1024px
- 1023px → replace with 1024px
- 1100px → replace with 1024px
- 600px → replace with 480px or 1024px

### Phase 3: Refactor (TO DO)
1. Update `assets/theme.css` media queries (28 instances)
2. Update section Liquid files (if any have inline styles)
3. Test responsiveness at each breakpoint
4. Update theme documentation

---

## DETAILED MAPPING

### 480px Breakpoints (7 instances)
**Current usage:** Mobile → Tablet transition
**Action:** Keep as-is ✓

**Locations:**
- Line 1374, 1787, 2138, 3315, 3411, 3792, 4397

### 600px Breakpoint (1 instance)
**Current usage:** Cookie consent banner mobile layout
**Action:** Change to 480px

**Before:**
```css
@media (max-width: 600px) {
  .ck-banner__inner { flex-direction: column; }
}
```

**After:**
```css
@media (max-width: 479px) {
  .ck-banner__inner { flex-direction: column; }
}
```

### 640px Breakpoints (2 instances)
**Current usage:** Hero slider, Instagram feed mobile
**Action:** Determine intent, consolidate

**Locations:**
- Line 3285, 4191

**Before:**
```css
@media (max-width: 640px) {
  .hero-slider__content { padding: 1.5rem; }
}
```

**After (mobile-first):**
```css
.hero-slider__content { padding: 1.5rem; }

@media (min-width: 480px) {
  .hero-slider__content { padding: 2rem 1.5rem; }
}
```

### 768px Breakpoints (5 instances)
**Current usage:** Desktop → Tablet, Section padding reduction
**Action:** Split between 480px and 1024px based on intent

**Locations:**
- Line 1784, 2046, 2896, 4383, 4697

**Examples:**

**Before:**
```css
@media (max-width: 768px) {
  .product-showcase__body { grid-template-columns: 1fr; }
}
```

**After:**
```css
@media (max-width: 1023px) {
  .product-showcase__body { grid-template-columns: 1fr; }
}
```

**Before:**
```css
@media (max-width: 768px) {
  :root { --section-pad: 3.5rem; }
}
```

**After:**
```css
@media (max-width: 1023px) {
  :root { --section-pad: 3.5rem; }
}
```

### 900px Breakpoints (5 instances)
**Current usage:** Product showcase, testimonials, footer, etc.
**Action:** Replace with 1024px

**Locations:**
- Line 1371, 3267, 3408, 3609, 4187

**Before:**
```css
@media (max-width: 900px) {
  .product-showcase__body { grid-template-columns: 1fr; }
}
```

**After:**
```css
@media (max-width: 1023px) {
  .product-showcase__body { grid-template-columns: 1fr; }
}
```

### 1023px Breakpoint (1 instance)
**Current usage:** Footer layout
**Action:** Keep as-is (effectively == 1024px range) ✓

**Location:** Line 1781

### 1024px Breakpoint (1 instance)
**Current usage:** Product showcase responsive
**Action:** Keep as-is ✓

**Location:** Line 3257 (note: this is `max-width: 1024px`, should change to `max-width: 1023px` for consistency)

### 1100px Breakpoint (1 instance)
**Current usage:** Product showcase layout
**Action:** Replace with 1024px

**Location:** Line 3257

**Before:**
```css
@media (max-width: 1100px) {
  .product-showcase__body { gap: 2rem; }
}
```

**After:**
```css
@media (max-width: 1023px) {
  .product-showcase__body { gap: 2rem; }
}
```

---

## IMPLEMENTATION STEPS

### Step 1: Create Backup
```bash
git checkout -b refactor/unified-breakpoints
```

### Step 2: Find-Replace Patterns

| Pattern | Replace | Notes |
|---------|---------|-------|
| `@media (max-width: 1100px)` | `@media (max-width: 1023px)` | Large tablet → tablet range |
| `@media (max-width: 900px)` | `@media (max-width: 1023px)` | Most desktop queries |
| `@media (max-width: 768px)` | **Manual** | Context-dependent |
| `@media (max-width: 640px)` | **Manual** | Context-dependent |
| `@media (max-width: 600px)` | `@media (max-width: 479px)` | Mobile-only layouts |

### Step 3: Testing Checklist
- [ ] Test at 375px (iPhone SE)
- [ ] Test at 480px (tablet portrait)
- [ ] Test at 768px (iPad)
- [ ] Test at 1024px (iPad Pro, small laptop)
- [ ] Test at 1440px (desktop)
- [ ] Test at 2560px (4K)
- [ ] Verify product grid responsiveness
- [ ] Verify hero slider stack behavior
- [ ] Verify footer alignment
- [ ] Verify form input width and height

### Step 4: Update Theme Documentation
Add to `COMPONENT_SPECS.md`:

```markdown
## Responsive Breakpoints

Use only these breakpoints in new code:

```css
/* Mobile (< 480px) — default styles */
.component { /* mobile styles */ }

/* Tablet (480px – 1023px) */
@media (min-width: 480px) {
  .component { /* tablet styles */ }
}

/* Desktop (≥ 1024px) */
@media (min-width: 1024px) {
  .component { /* desktop styles */ }
}
```

**Never use:** 640px, 768px, 900px, 1100px
```

---

## ESTIMATED EFFORT

| Phase | Task | Effort | Notes |
|-------|------|--------|-------|
| 1 | Audit breakpoints | ✓ Done | Identified 13 unique values |
| 2 | Find-replace large screens | 15 min | 900px, 1100px → 1024px |
| 2 | Manual consolidation | 30 min | 768px, 640px context-dependent |
| 3 | QA at all breakpoints | 45 min | 6 device sizes |
| 3 | Git cleanup | 10 min | Commit, document |
| **Total** | | **2 hours** | |

---

## RATIONALE FOR RECOMMENDED BREAKPOINTS

### Why 480px?
- Smallest tablet width (iPad mini in portrait)
- Natural inflection point where 2-column layouts become viable
- Matches most CSS frameworks (Bootstrap, Tailwind)

### Why 1024px?
- iPad Pro (landscape) = 1024px
- Natural threshold for full-width desktop layouts
- Matches most CSS frameworks

### Why Mobile-First?
- Simpler CSS (only one media query layer, not multiple)
- Better performance (no media query parsing on phones)
- Progressive enhancement (base styles work everywhere, enhancements layer on top)

---

## FUTURE: CSS CUSTOM PROPERTIES FOR BREAKPOINTS

Once unified, consider:

```css
:root {
  --breakpoint-tablet: 480px;
  --breakpoint-desktop: 1024px;
}

@media (min-width: var(--breakpoint-tablet)) {
  /* Tablet styles */
}
```

This enables:
- Centralized breakpoint management
- Easy theme switching
- Preprocessor compatibility (SCSS, PostCSS)

---

## CONCLUSION

**Current:** 13 inconsistent breakpoints → confusing maintenance, unpredictable behavior
**Target:** 3 unified breakpoints (480px, 1024px, mobile-first) → consistent, scalable, maintainable

**Effort:** ~2 hours
**Impact:** Medium (improves maintainability, no user-facing changes)
**Priority:** P3 (low; works today, improves tomorrow)

Next sprint: Implement consolidation as part of CSS modularization.
