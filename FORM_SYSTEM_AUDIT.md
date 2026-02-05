# Form System Audit & Redesign Plan

**Status:** In Progress  
**Priority:** Mission-Critical (Conversion Infrastructure)  
**Goal:** Unify all forms into consistent, professional, fully functional conversion system

---

## Executive Summary

**Current State:** 7 forms across the site with inconsistent UI, UX, and validation patterns. Basic functionality exists but lacks polish, optimization, and production hardening.

**Target State:** Single form design system with reusable components, optimized completion rates, WCAG compliance, and verified end-to-end functionality.

**Impact:** Forms are primary conversion points (demo requests, ebook downloads, consultation bookings). Professional, trustworthy forms = higher completion rates.

---

## 1. Form Inventory

| Form Name | Location | Fields | Source Tracking | Status |
|-----------|----------|--------|-----------------|--------|
| **LeadCaptureSection** | Main landing page | name (opt), email | `"ebook"` | ✅ Basic functional |
| **LeadPopup** | Exit-intent popup | email | `"exit-intent-popup"` | ✅ Functional |
| **DemoRequestModal** | Demo request CTA | email, phone, companySize, role | `"demo-request"` | ⚠️ Needs completion |
| **DemoAccessModal** | Gated demo access | email (work), phone, company (opt) | `"demo-access-modal"` | ⚠️ Most sophisticated |
| **AIReadinessAudit** | Audit lead gate | email (work) | Not using submitLead! | ❌ **Broken** |
| **BookingModal** | Consultation scheduler | (Cal.com embed) | N/A | ℹ️ No form |
| **DemoVideoModal** | Video access | (none observed) | N/A | ℹ️ No form |

### Critical Findings

1. **AIReadinessAudit NOT integrated with lead system** - Uses fake toast notification instead of real submission
2. **Inconsistent validation patterns** - Some use work email validation, some don't
3. **No autocomplete attributes** - Missing completion rate optimization
4. **Inconsistent error messaging** - Different error display patterns
5. **No loading states on all forms** - Some buttons lack loading indicators
6. **Work email validation incomplete** - Should reject free providers consistently

---

## 2. Infrastructure Analysis

### ✅ Existing: `/src/app/utils/lead.ts`

**Status:** Production-ready, well-architected

```typescript
export type LeadPayload = {
  email: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  companySize?: string;
  phone?: string;
  role?: string;
  source?: string; // Critical for tracking
};

export async function submitLead(payload: LeadPayload): Promise<LeadResult>
```

**Strengths:**
- Proper error handling (network, non-ok responses, missing endpoint)
- Czech error messages
- Type safety
- Source tracking support

**Configuration:**
- Requires `VITE_LEAD_ENDPOINT` environment variable
- Returns `{ok: boolean, error?: string}`

---

## 3. UI Component Analysis

### Input Component (`/src/app/components/ui/input.tsx`)

**Current Features:**
- ✅ CSS variable-based sizing (`--input-height`, `--input-padding-x`, `--input-radius`, `--input-border-width`)
- ✅ Focus ring with `focus-visible:ring-ring/50`
- ✅ Error state with `aria-invalid:border-destructive`
- ✅ Disabled state
- ❌ No label component integration
- ❌ No helper text slot
- ❌ No autocomplete in base component

**Issues:**
- Forms manually apply error styling with `className` conditionals
- No standardized error message display
- No built-in validation state visualization

### Select Component (`/src/app/components/ui/select.tsx`)

**Current Features:**
- ✅ Radix UI primitives (accessible)
- ✅ Keyboard navigation
- ✅ Error state with `aria-invalid`
- ✅ Size variants (`sm`, `default`)
- ❌ No integration with react-hook-form validation display

---

## 4. Validation Pattern Inconsistencies

| Validation Type | LeadCapture | LeadPopup | DemoRequest | DemoAccess | AIReadiness |
|----------------|-------------|-----------|-------------|------------|-------------|
| **Email Pattern** | `/^\S+@\S+$/i` | `/^\S+@\S+$/i` | `/^\S+@\S+$/i` | Work email only | Work email (broken) |
| **Work Email Block** | ❌ No | ❌ No | ❌ No | ✅ Yes | ✅ Yes (not enforced) |
| **Phone Validation** | N/A | N/A | ✅ Czech pattern | ✅ Czech pattern | N/A |
| **Required Field** | email only | email only | All fields | email, phone | email only |
| **Error Display** | Red border + text | Red border + text | Per-field + toast | Per-field | Toast only |

### Work Email Validation Pattern (from DemoAccessModal)

```typescript
const workEmailPattern = {
  value: /^(?!.*@(gmail|yahoo|seznam|email\.cz|centrum\.cz|icloud)\.).+@.+\..+$/i,
  message: "Please enter a valid work email (not gmail, yahoo...)"
};
```

**Problem:** Only DemoAccessModal uses this. Should be standardized across all forms requiring work email.

### Czech Phone Pattern

```typescript
const czechPhonePattern = /^(\+420)?\s?\d{3}\s?\d{3}\s?\d{3}$/;
```

**Used in:** DemoRequestModal, DemoAccessModal  
**Missing in:** Should have reusable validation function

---

## 5. UX/UI Inconsistencies

### Layout & Spacing
- ❌ Different padding patterns (`p-6`, `p-8`, `p-10`)
- ❌ Different gap patterns (`space-y-4`, `space-y-6`)
- ❌ Inconsistent label-to-input spacing
- ❌ No standard form field component

### Typography
- ✅ Consistent use of brand typography scales
- ❌ Label styles differ (some bold, some regular)
- ❌ Error text inconsistent (some `text-sm`, some `text-xs`)

### Async States
- ⚠️ **LeadCaptureSection:** No loading state on button
- ✅ **LeadPopup:** Button shows text (but should disable)
- ⚠️ **DemoRequestModal:** Needs verification
- ✅ **DemoAccessModal:** Has `isSubmitting` state
- ❌ **AIReadinessAudit:** Fake loading with setTimeout

### Success States
- ✅ Most use CheckCircle2 icon (consistent)
- ✅ Good use of success color (`brand-success`)
- ⚠️ Different animation patterns
- ❌ No unified success component

### Error States
- ❌ Different error display methods:
  - Inline text below field
  - Red border on input
  - Toast notification
  - Alert box
- ❌ No unified error messaging pattern
- ❌ No retry mechanism (just "try again" text)

---

## 6. Missing UX Optimizations

### Autocomplete Attributes (CRITICAL)
**Impact:** Can increase completion rates by 20-30%

Currently MISSING from all forms:
```html
<Input 
  type="email"
  autoComplete="email" <!-- MISSING -->
  name="email" <!-- MISSING -->
/>
```

**Required autocomplete values:**
- `email` → `autoComplete="email"`
- `name` → `autoComplete="name"`
- `phone` → `autoComplete="tel"`
- `company` → `autoComplete="organization"`
- Role/position → `autoComplete="organization-title"`

### Trust Cues
- ✅ LeadPopup has "Žádný spam" message
- ✅ DemoAccess has "No spam" message
- ❌ LeadCaptureSection lacks visible GDPR/privacy note
- ❌ No security badges (GDPR compliant, data protection)

### Mobile Optimization
- ⚠️ Need to verify touch targets (minimum 44×44px)
- ⚠️ Input zoom on iOS (requires font-size >= 16px)
- ⚠️ Virtual keyboard handling (action buttons)

### Keyboard Navigation
- ✅ Basic tab order works
- ❌ No skip-to-error on validation failure
- ❌ No Enter key submission verification
- ❌ No Escape key to close modals (needs verification)

---

## 7. Critical Bugs & Issues

### 🔴 **CRITICAL: AIReadinessAudit Not Submitting Leads**

**Current code (BROKEN):**
```typescript
const handleUnlock = () => {
  if (!email || !email.includes('@')) {
    toast.error("Please enter a valid work email.");
    return;
  }
  setIsUnlocking(true);
  setTimeout(() => {
    setIsUnlocking(false);
    toast.success("Audit sent!", { description: `Report sent to ${email}` });
    setEmail("");
  }, 1500);
};
```

**Problem:** No actual submission to lead system! Just fake success after 1.5s timeout.

**Fix Required:** Integrate with `submitLead` utility with proper error handling.

### ⚠️ **MISSING: Environment Variable Validation**

Current behavior if `VITE_LEAD_ENDPOINT` is not set:
- Returns error: "Formulář zatím není aktivní"
- No console warning for developers
- No fallback or clearer error for debugging

**Fix Required:** Add dev-mode warning when endpoint is missing.

### ⚠️ **INCOMPLETE: Double-Click Prevention**

Only some forms have `isSubmitting` checks. Need consistent pattern:
```typescript
disabled={isSubmitting || isSuccess}
```

Currently missing in:
- LeadCaptureSection (no disabled state)
- LeadPopup (no disabled state)

---

## 8. Translation Structure Analysis

**File:** `/src/app/translations.ts`

Form-related translation keys found:
- ✅ `leadPopup.*` (complete)
- ✅ `demoRequest.*` (complete with roles/sizes)
- ✅ `leadCapture.*` (complete)
- ✅ `demoAccess.*` (complete with errors)
- ❌ No unified form validation messages

**Missing unified translations:**
```typescript
formValidation: {
  emailRequired: "Email je povinný",
  emailInvalid: "Zadejte platný email",
  workEmailRequired: "Zadejte firemní email (ne gmail, seznam...)",
  phoneRequired: "Telefon je povinný",
  phoneInvalid: "Zadejte platné telefonní číslo (např. +420 777 888 999)",
  fieldRequired: "Toto pole je povinné",
  submissionError: "Odeslání se nezdařilo. Zkuste to prosím znovu.",
  networkError: "Problém s připojením. Zkontrolujte internet."
}
```

---

## 9. Design System Requirements

### Form Tokens (to add to `theme.css`)

```css
:root {
  /* Form Field Sizing */
  --form-field-height: 44px; /* Touch-friendly minimum */
  --form-field-padding-x: 16px;
  --form-field-padding-y: 12px;
  --form-field-radius: 8px;
  --form-field-border-width: 1px;
  
  /* Form Field Spacing */
  --form-field-gap: 16px; /* Between fields */
  --form-label-gap: 8px; /* Label to input */
  --form-helper-gap: 6px; /* Input to helper text */
  
  /* Form Field States */
  --form-field-border-default: var(--brand-border);
  --form-field-border-hover: var(--brand-text-muted);
  --form-field-border-focus: var(--brand-primary);
  --form-field-border-error: var(--brand-error);
  --form-field-border-success: var(--brand-success);
  
  /* Form Field Ring (Focus) */
  --form-field-ring-width: 3px;
  --form-field-ring-color: var(--brand-primary);
  --form-field-ring-opacity: 0.1;
  
  /* Form Typography */
  --form-label-size: 14px;
  --form-label-weight: 600;
  --form-input-size: 16px; /* iOS zoom fix */
  --form-helper-size: 13px;
  --form-error-size: 13px;
}
```

### Component Hierarchy

```
FormField (container)
├── Label (optional)
├── InputWrapper
│   ├── Input / Select / Textarea
│   └── ValidationIcon (checkmark/error)
├── HelperText (optional)
└── ErrorMessage (conditional)
```

---

## 10. Implementation Plan

### Phase 1: Foundation (Priority: Critical)

**Task 1.1: Create Form Tokens**
- Add CSS variables to `theme.css`
- Update Input/Select components to use tokens
- ✅ **Files:** `src/styles/theme.css`, `src/app/components/ui/input.tsx`, `src/app/components/ui/select.tsx`

**Task 1.2: Create FormField Component**
```typescript
<FormField 
  label="Work email"
  error={errors.email?.message}
  helperText="We'll never share your email"
  required
>
  <Input 
    type="email"
    autoComplete="email"
    {...register("email", validation)}
  />
</FormField>
```
- ✅ **File:** `src/app/components/ui/form-field.tsx` (NEW)

**Task 1.3: Create Validation Utilities**
```typescript
export const validationRules = {
  email: {
    required: "Email je povinný",
    pattern: { value: /^\S+@\S+$/i, message: "Zadejte platný email" }
  },
  workEmail: {
    required: "Email je povinný",
    pattern: { 
      value: /^(?!.*@(gmail|yahoo|seznam|email\.cz|centrum\.cz|icloud)\.).+@.+\..+$/i,
      message: "Zadejte firemní email (ne gmail, seznam...)" 
    }
  },
  czechPhone: {
    required: "Telefon je povinný",
    pattern: {
      value: /^(\+420)?\s?\d{3}\s?\d{3}\s?\d{3}$/,
      message: "Zadejte platné číslo (např. +420 777 888 999)"
    }
  }
};
```
- ✅ **File:** `src/app/utils/validation.ts` (NEW)

**Task 1.4: Update Translation Files**
- Add unified `formValidation` section
- Consolidate error messages
- ✅ **File:** `src/app/translations.ts`

### Phase 2: Component Updates (Priority: High)

**Task 2.1: Fix AIReadinessAudit Lead Submission**
- Replace fake toast with real `submitLead` call
- Add proper error handling
- Add source tracking: `"ai-readiness-audit"`
- ✅ **File:** `src/app/components/AIReadinessAudit.tsx`

**Task 2.2: Standardize LeadCaptureSection**
- Use FormField component
- Add autocomplete attributes
- Add loading state to button
- Add work email validation
- Improve GDPR visibility
- ✅ **File:** `src/app/components/LeadCaptureSection.tsx`

**Task 2.3: Standardize LeadPopup**
- Use FormField component
- Add autocomplete
- Add button loading state
- Consider work email validation (discuss: exit-intent should be low-friction?)
- ✅ **File:** `src/app/components/LeadPopup.tsx`

**Task 2.4: Complete DemoRequestModal**
- Use FormField component
- Add autocomplete attributes
- Use validation utilities
- Verify button states
- ✅ **File:** `src/app/components/DemoRequestModal.tsx`

**Task 2.5: Complete DemoAccessModal**
- Use FormField component
- Add autocomplete attributes
- Use validation utilities
- Already has good work email validation (keep pattern)
- ✅ **File:** `src/app/components/DemoAccessModal.tsx`

### Phase 3: UX Enhancements (Priority: Medium)

**Task 3.1: Add Trust Cues**
- GDPR compliance badge
- "Bez spamu" messaging
- Social proof (where appropriate)
- Security icons

**Task 3.2: Improve Success States**
- Unified success modal/view component
- Consistent animations
- Next steps messaging
- Auto-close with countdown (optional)

**Task 3.3: Improve Error States**
- Unified error display pattern
- Retry mechanism
- Network error detection
- Field-level + form-level errors

**Task 3.4: Mobile Optimization**
- Verify touch targets
- Test iOS input zoom
- Test virtual keyboard (action buttons)
- Test on real devices

### Phase 4: Verification (Priority: Critical)

**Task 4.1: Integration Testing**
Create test checklist for each form:

| Form | Valid Submit | Invalid Email | Empty Required | Network Error | Double-Click | Tested |
|------|--------------|---------------|----------------|---------------|--------------|--------|
| LeadCaptureSection | ☐ | ☐ | ☐ | ☐ | ☐ | ❌ |
| LeadPopup | ☐ | ☐ | ☐ | ☐ | ☐ | ❌ |
| DemoRequestModal | ☐ | ☐ | ☐ | ☐ | ☐ | ❌ |
| DemoAccessModal | ☐ | ☐ | ☐ | ☐ | ☐ | ❌ |
| AIReadinessAudit | ☐ | ☐ | ☐ | ☐ | ☐ | ❌ |

**Task 4.2: Verify Environment Setup**
```bash
# Check .env.local has VITE_LEAD_ENDPOINT
cat .env.local | grep VITE_LEAD_ENDPOINT
```

**Task 4.3: End-to-End Verification**
- Submit test lead from each form
- Verify lead appears in backend/CRM
- Verify source tracking works
- Verify email notifications sent (if applicable)

**Task 4.4: Analytics Verification**
- Verify form submission events fire
- Verify error events fire
- Verify source tracking in analytics
- Document event names for tracking

### Phase 5: Documentation (Priority: Low)

**Task 5.1: Component Documentation**
- Document FormField props and usage
- Document validation utilities
- Add Storybook examples (optional)

**Task 5.2: Form Implementation Guide**
- How to add new forms
- Validation patterns to use
- Error handling patterns
- Source tracking convention

---

## 11. Success Metrics

**Pre-Redesign Baseline (to establish):**
- Form completion rate: _%
- Error rate: _%
- Mobile completion rate: _%
- Average time to complete: _s

**Post-Redesign Targets:**
- Form completion rate: +15-25%
- Error rate: -50%
- Mobile completion rate: +20%
- Average time to complete: -20%

**Qualitative Goals:**
- ✅ All forms use unified design system
- ✅ All forms verified end-to-end
- ✅ Zero fake success states
- ✅ Consistent error handling
- ✅ WCAG AA compliance (minimum)
- ✅ Professional, trustworthy appearance

---

## 12. Risk Assessment

### High Risk
- ❌ **AIReadinessAudit not capturing leads** - Lost conversions
- ❌ **No environment variable validation** - Silent failures in production

### Medium Risk
- ⚠️ **Inconsistent work email validation** - May reject valid leads or accept invalid ones
- ⚠️ **Missing autocomplete** - Lower completion rates
- ⚠️ **No double-click prevention everywhere** - Duplicate submissions

### Low Risk
- ℹ️ **Inconsistent spacing** - Visual polish issue only
- ℹ️ **Different error display patterns** - UX friction but not blocking

---

## 13. Next Actions

### Immediate (Today)
1. ✅ Complete audit (this document)
2. ⏳ Create FormField component
3. ⏳ Create validation utilities
4. ⏳ Fix AIReadinessAudit critical bug

### This Week
1. Update all forms to use new components
2. Add autocomplete attributes everywhere
3. Add form tokens to theme
4. Test on staging environment

### Before Launch
1. Complete verification checklist
2. Test on real devices (iOS, Android)
3. Verify environment variables in production
4. Document analytics events

---

## Appendix A: File Manifest

**Files to Create:**
- `src/app/components/ui/form-field.tsx` - Unified form field wrapper
- `src/app/utils/validation.ts` - Validation rules and patterns
- `src/app/components/ui/form-success.tsx` - Unified success state (optional)

**Files to Update:**
- `src/styles/theme.css` - Add form tokens
- `src/app/translations.ts` - Add unified validation messages
- `src/app/components/ui/input.tsx` - Minor refinements
- `src/app/components/ui/select.tsx` - Minor refinements
- `src/app/components/LeadCaptureSection.tsx` - Full refactor
- `src/app/components/LeadPopup.tsx` - Full refactor
- `src/app/components/DemoRequestModal.tsx` - Full refactor
- `src/app/components/DemoAccessModal.tsx` - Full refactor
- `src/app/components/AIReadinessAudit.tsx` - Critical bug fix + refactor

**Files to Verify:**
- `src/app/utils/lead.ts` - Already production-ready ✅
- `.env.local` - Check VITE_LEAD_ENDPOINT is set
- `.env.local.example` - Update with documentation

---

## Appendix B: Czech Phone Number Format Examples

**Valid formats to accept:**
- `777888999`
- `777 888 999`
- `+420777888999`
- `+420 777 888 999`

**Pattern:** `/^(\+420)?\s?\d{3}\s?\d{3}\s?\d{3}$/`

**Display format (recommended):** `+420 777 888 999` (with spaces)

---

## Appendix C: Work Email Validation Pattern

**Current blocked domains (from DemoAccessModal):**
- gmail.com
- yahoo.com
- seznam.cz
- email.cz
- centrum.cz
- icloud.com

**Consider adding:**
- outlook.com (personal)
- hotmail.com
- live.com
- atlas.cz
- volny.cz
- post.cz

**Regex:** `/^(?!.*@(gmail|yahoo|seznam|email\.cz|centrum\.cz|icloud)\.).+@.+\..+$/i`

**Note:** This is a heuristic, not perfect. Some companies use gmail for business (google workspace). Consider: "We recommend using your company email for better support."

---

**Document Version:** 1.0  
**Last Updated:** 2025-01-XX  
**Author:** Form System Audit  
**Status:** ✅ Audit Complete → Next: Implementation
