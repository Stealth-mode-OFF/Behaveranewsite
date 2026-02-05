# Form System Verification Checklist

**Project:** echopulse.cz Form System Unification  
**Status:** Implementation Phase → Verification Required  
**Updated:** 2025-01-XX

---

## Quick Status

### ✅ Completed
- Comprehensive audit document created
- Form design system with tokens implemented
- Validation utilities created (`/src/app/utils/validation.ts`)
- FormField component created (`/src/app/components/ui/form-field.tsx`)
- AIReadinessAudit **CRITICAL BUG FIXED** (was not submitting leads!)
- LeadCaptureSection updated with FormField + autocomplete
- LeadPopup updated with FormField + autocomplete + loading states

### 🔄 In Progress
- DemoRequestModal (needs FormField integration)
- DemoAccessModal (needs FormField integration)

### ⏳ Not Started
- End-to-end verification testing
- Mobile device testing
- Analytics verification

---

## Pre-Launch Verification Checklist

### 1. Environment Setup

**Check `.env.local` configuration:**

```bash
# Run this command to verify
cat .env.local | grep VITE_LEAD_ENDPOINT
```

- [ ] `VITE_LEAD_ENDPOINT` is set (not empty)
- [ ] Endpoint URL is correct (production/staging)
- [ ] Test submission reaches backend

**Action if missing:**
```bash
# Copy example and fill in values
cp .env.local.example .env.local
# Edit .env.local and add your endpoint
```

---

### 2. Form Functionality Testing

#### Test Each Form with These Scenarios:

| Test Case | LeadCapture | LeadPopup | DemoRequest | DemoAccess | AIAudit |
|-----------|-------------|-----------|-------------|------------|---------|
| **Valid submission** | ☐ | ☐ | ☐ | ☐ | ☐ |
| **Empty required fields** | ☐ | ☐ | ☐ | ☐ | ☐ |
| **Invalid email format** | ☐ | ☐ | ☐ | ☐ | ☐ |
| **Free email (gmail, seznam)** | ☐ | ☐ | ☐ | ☐ | ☐ |
| **Invalid phone format** | N/A | N/A | ☐ | ☐ | N/A |
| **Network error (offline)** | ☐ | ☐ | ☐ | ☐ | ☐ |
| **Double-click prevention** | ☐ | ☐ | ☐ | ☐ | ☐ |
| **Success state displays** | ☐ | ☐ | ☐ | ☐ | ☐ |
| **Auto-close/reset works** | ☐ | ☐ | ☐ | ☐ | ☐ |

---

### 3. Validation Testing

#### LeadCaptureSection (`/ebook` section)
```
Test Steps:
1. Navigate to homepage
2. Scroll to "Lead Capture" section
3. Leave email empty → submit → should show error "Email je povinný"
4. Enter "test" → submit → should show "Zadejte platný email"
5. Enter "test@gmail.com" → submit → should show "Zadejte firemní email (ne gmail, seznam...)"
6. Enter "test@company.cz" → submit → should show success
7. Verify lead appears in backend with source="ebook"
```

- [ ] Validation errors display correctly
- [ ] Work email validation enforced
- [ ] Autocomplete works (browser suggests email)
- [ ] Button shows loading state
- [ ] Button disabled after successful submission
- [ ] Success state displays with checkmark
- [ ] GDPR helper text visible

#### LeadPopup (Exit-Intent)
```
Test Steps:
1. Navigate to homepage
2. Move mouse to top of browser (exit intent)
3. Modal should appear
4. Test validation same as LeadCaptureSection
5. After success, verify modal closes after 3 seconds
6. Reload page → modal should NOT appear again (sessionStorage check)
```

- [ ] Popup triggers on exit intent
- [ ] Validation errors display
- [ ] Email validation works
- [ ] Button disabled during submission
- [ ] Success message appears
- [ ] Modal auto-closes after success
- [ ] Does not re-appear in same session

#### AIReadinessAudit (`/audit` section)
```
Test Steps:
1. Navigate to audit section
2. Complete all 5 questions
3. On result screen, leave email empty → click Unlock → should show toast error
4. Enter "test@gmail.com" → should show "Please use your work email"
5. Enter "test@company.cz" → should show loading spinner
6. Should show success toast
7. Verify lead submitted with source="ai-readiness-audit"
8. Verify audit score included in submission
```

- [ ] **CRITICAL:** Actually submits to backend (not fake!)
- [ ] Work email validation enforced
- [ ] Loading spinner shows on button
- [ ] Button disabled during submission
- [ ] Success toast appears
- [ ] Email field cleared after success
- [ ] Lead includes audit score in `role` field

#### DemoRequestModal (if updated)
```
Test Steps:
1. Click "Request Demo" CTA
2. Modal opens
3. Leave all fields empty → submit → should show multiple errors
4. Fill email only → submit → should show phone/size/role errors
5. Enter invalid phone "123" → should show phone format error
6. Enter valid Czech phone "+420 777 888 999" → should accept
7. Complete all fields → submit → should show success
```

- [ ] All fields validated
- [ ] Czech phone pattern works
- [ ] Autocomplete works on all fields
- [ ] Select dropdowns work
- [ ] Loading state shows
- [ ] Success state displays

#### DemoAccessModal (if updated)
```
Test Steps:
1. Click "Get Demo Access" CTA
2. Modal opens
3. Enter "test@gmail.com" → should show work email error
4. Enter "test@company.cz" → should accept
5. Enter phone → submit
6. Should show success view with credentials:
   - URL: https://app.behavera.com
   - Email: pulsedemo@behavera.com
   - Password: showdemo
7. Click copy buttons → should copy to clipboard
```

- [ ] Work email validation enforced
- [ ] Phone validation works
- [ ] Two-view modal transitions correctly
- [ ] Credentials displayed after success
- [ ] Copy-to-clipboard works
- [ ] Lead submitted to backend

---

### 4. Accessibility Testing

#### Keyboard Navigation
- [ ] Tab through all form fields (correct order)
- [ ] Enter key submits form
- [ ] Escape key closes modals
- [ ] Focus visible on all fields (focus ring)
- [ ] Error messages announced by screen readers

#### Screen Reader Testing (optional but recommended)
```
Test with: VoiceOver (Mac) or NVDA (Windows)
```
- [ ] Labels read correctly
- [ ] Required fields announced
- [ ] Error messages announced
- [ ] Success messages announced

#### Color Contrast
- [ ] Error text readable (WCAG AA: 4.5:1 minimum)
- [ ] Focus rings visible
- [ ] Placeholder text readable

---

### 5. Mobile Testing

**Test on real devices (iPhone + Android)**

#### iOS Safari
```
Device: iPhone 12 or later
```
- [ ] Input fields don't zoom on focus (font-size >= 16px)
- [ ] Virtual keyboard shows email keyboard (@, .com)
- [ ] Autocomplete works
- [ ] Touch targets >= 44×44px
- [ ] Forms scrollable with keyboard open
- [ ] Submit button visible with keyboard

#### Android Chrome
```
Device: Any modern Android
```
- [ ] Same tests as iOS
- [ ] No layout issues with keyboard
- [ ] Back button closes modals

#### Responsive Breakpoints
- [ ] Mobile (375px): Forms readable and usable
- [ ] Tablet (768px): Proper layout
- [ ] Desktop (1024px+): Optimal layout

---

### 6. Error Handling Verification

#### Network Errors
```
Test Steps:
1. Open DevTools → Network tab
2. Set throttling to "Offline"
3. Try to submit form
4. Should show error: "Problém s připojením. Zkontrolujte internet."
```

- [ ] LeadCaptureSection handles network errors
- [ ] LeadPopup handles network errors
- [ ] AIReadinessAudit handles network errors
- [ ] Error message actionable (not just "Failed")

#### Server Errors (500)
```
Test Steps:
1. Mock API to return 500 error
2. Submit form
3. Should show: "Odeslání se nezdařilo. Zkuste to prosím znovu."
```

- [ ] Server errors handled gracefully
- [ ] User can retry without page reload

#### Missing Environment Variable
```
Test Steps:
1. Remove VITE_LEAD_ENDPOINT from .env.local
2. Restart dev server
3. Try to submit form
4. Should show: "Formulář zatím není aktivní"
```

- [ ] Missing endpoint handled (doesn't crash)
- [ ] Error message shown to user
- [ ] Console warning for developers

---

### 7. Performance Testing

#### Load Times
- [ ] Forms render instantly (no layout shift)
- [ ] Validation feedback instant (<100ms)
- [ ] Submission response < 2 seconds (normal network)

#### Bundle Size (optional)
```bash
npm run build
# Check dist/ size
```
- [ ] No massive dependencies added
- [ ] Tree-shaking works

---

### 8. Analytics Verification

**Verify these events fire (if analytics configured):**

| Event | When | Properties |
|-------|------|------------|
| `form_start` | User focuses first field | `form_name`, `source` |
| `form_submit` | User clicks submit | `form_name`, `source` |
| `form_error` | Validation fails | `form_name`, `error_type` |
| `form_success` | Submission succeeds | `form_name`, `source` |
| `form_abandon` | User closes without submitting | `form_name`, `fields_filled` |

**How to verify:**
```
1. Open DevTools → Console
2. Look for analytics events (GA4, Mixpanel, Segment)
3. Or check Network tab for tracking requests
```

- [ ] Form submission events fire
- [ ] Source tracking correct
- [ ] Error events fire

---

### 9. Security Verification

#### Client-Side Security
- [ ] No credentials in client code (API keys, passwords)
- [ ] No console.log() with sensitive data
- [ ] HTTPS enforced (not http://)

#### Honeypot/Anti-Spam (if implemented)
- [ ] Honeypot field hidden from users
- [ ] Honeypot field rejected by backend
- [ ] Rate limiting works (too many submissions)

---

### 10. Browser Compatibility

**Test in these browsers:**

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | Latest | ☐ |
| Firefox | Latest | ☐ |
| Safari | Latest (Mac/iOS) | ☐ |
| Edge | Latest | ☐ |

**Test:**
- [ ] Forms display correctly
- [ ] Validation works
- [ ] Submission works
- [ ] No console errors

---

## Critical Issues to Fix Before Launch

### 🔴 BLOCKERS (Must Fix)
- [ ] `VITE_LEAD_ENDPOINT` configured in production
- [ ] All forms submit to real backend (no fake success)
- [ ] AIReadinessAudit bug verified fixed
- [ ] Work email validation consistent across all forms

### ⚠️ HIGH PRIORITY (Should Fix)
- [ ] DemoRequestModal updated with FormField
- [ ] DemoAccessModal updated with FormField
- [ ] All forms tested on real mobile devices
- [ ] Double-click prevention verified

### ℹ️ MEDIUM PRIORITY (Nice to Have)
- [ ] Analytics events firing
- [ ] Screen reader testing complete
- [ ] Performance metrics acceptable

---

## Sign-Off

**Before deploying to production:**

- [ ] All blockers resolved
- [ ] At least 3 team members tested forms
- [ ] Mobile testing complete (iOS + Android)
- [ ] Backend team confirmed endpoint ready
- [ ] Analytics team confirmed tracking configured
- [ ] Stakeholder approval obtained

**Tested By:**

| Name | Role | Date | Notes |
|------|------|------|-------|
| _________ | Developer | ______ | ____________ |
| _________ | QA | ______ | ____________ |
| _________ | Product | ______ | ____________ |

---

## Rollback Plan

**If critical issues found in production:**

1. **Immediate:** Revert to previous deployment
   ```bash
   git revert <commit-hash>
   git push
   ```

2. **Monitor:** Check error tracking (Sentry, etc.)
   - Form submission failures
   - JavaScript errors
   - API errors

3. **Fix Forward:** Create hotfix branch
   ```bash
   git checkout -b hotfix/form-critical-bug
   # Fix issue
   # Test locally
   # Deploy to staging
   # Verify fix
   # Deploy to production
   ```

---

## Post-Launch Monitoring (First 24 Hours)

**Metrics to watch:**

- [ ] Form submission rate (should not drop)
- [ ] Form completion rate (should increase 15-25%)
- [ ] Error rate (should be <5%)
- [ ] Mobile completion rate (should match desktop)

**Alert thresholds:**
- Form submission rate drops >20% → ALERT
- Error rate >10% → ALERT
- Any form showing 0 submissions → ALERT

---

## Resources

- **Audit Document:** `/FORM_SYSTEM_AUDIT.md`
- **Validation Utils:** `/src/app/utils/validation.ts`
- **FormField Component:** `/src/app/components/ui/form-field.tsx`
- **Lead Utility:** `/src/app/utils/lead.ts`
- **Theme Tokens:** `/src/styles/theme.css` (search "Form Field System")

**Support:**
- Developer: [Your contact]
- Backend: [Backend team contact]
- Analytics: [Analytics team contact]

---

**Last Updated:** 2025-01-XX  
**Version:** 1.0  
**Status:** ✅ Ready for Verification Phase
