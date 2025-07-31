# 🔍 **HolmesGPT Accessibility Checklist**

## 🚨 **Critical Checks (Before Every Release)**

### **✅ Color & Contrast**

- [ ] All text is visible in both light and dark themes
- [ ] Contrast ratios meet WCAG AA standards (4.5:1 for normal text)
- [ ] Interactive elements have sufficient contrast
- [ ] Error states are clearly distinguishable

### **✅ Keyboard Navigation**

- [ ] All interactive elements are keyboard accessible
- [ ] Tab order is logical and intuitive
- [ ] Focus indicators are visible and clear
- [ ] Enter/Space keys work for buttons and toggles

### **✅ Screen Reader Support**

- [ ] All form inputs have proper labels (`aria-label` or `<label>`)
- [ ] Images have alt text or are decorative
- [ ] Headings follow proper hierarchy (h1 → h2 → h3)
- [ ] Interactive elements have descriptive names

### **✅ Mobile Accessibility**

- [ ] Touch targets are at least 44px × 44px
- [ ] Text can be zoomed to 200% without horizontal scrolling
- [ ] Gestures work as expected
- [ ] No horizontal scrolling required

---

## 🔧 **Development Guidelines**

### **When Adding New Components**

#### **Form Elements**

```html
<!-- ✅ Good -->
<textarea aria-label="Enter your message" placeholder="Type here..."></textarea>

<!-- ❌ Bad -->
<textarea placeholder="Type here..."></textarea>
```

#### **Interactive Elements**

```html
<!-- ✅ Good -->
<button aria-label="Toggle theme" aria-pressed="false">Theme</button>

<!-- ❌ Bad -->
<div onclick="toggleTheme()">Theme</div>
```

#### **Images**

```html
<!-- ✅ Good -->
<img src="logo.png" alt="HolmesGPT Logo" />

<!-- ✅ Good (Decorative) -->
<img src="decoration.png" alt="" role="presentation" />

<!-- ❌ Bad -->
<img src="logo.png" />
```

### **CSS Best Practices**

#### **Color & Contrast**

```css
/* ✅ Use CSS variables for theming */
color: var(--text-primary);
background: var(--glass-bg);

/* ✅ Ensure focus indicators */
:focus {
  outline: 2px solid var(--text-accent);
  outline-offset: 2px;
}

/* ✅ High contrast for important text */
.error-message {
  color: #ef4444;
  font-weight: 600;
}
```

#### **Responsive Design**

```css
/* ✅ Ensure touch targets are large enough */
button,
a,
input,
select {
  min-height: 44px;
  min-width: 44px;
}

/* ✅ Support text zoom */
body {
  font-size: 16px; /* Minimum readable size */
}
```

---

## 🧪 **Testing Checklist**

### **Manual Testing**

- [ ] **Keyboard Test**: Navigate entire app with Tab key
- [ ] **Screen Reader Test**: Use NVDA/JAWS/VoiceOver
- [ ] **Color Test**: Switch between light/dark themes
- [ ] **Zoom Test**: Zoom to 200% and verify layout
- [ ] **Mobile Test**: Test on actual mobile devices

### **Automated Testing**

- [ ] **Lighthouse**: Accessibility score >90
- [ ] **axe-core**: No critical violations
- [ ] **HTML Validator**: Semantic markup
- [ ] **CSS Validator**: Proper syntax

---

## 🚀 **Quick Fixes for Common Issues**

### **Text Not Visible**

```css
/* Add this to fix white text on light background */
input,
textarea,
select {
  color: var(--text-primary) !important;
}
```

### **Missing Focus Indicator**

```css
/* Add visible focus indicator */
button:focus,
input:focus,
textarea:focus {
  outline: 2px solid var(--text-accent);
  outline-offset: 2px;
}
```

### **Small Touch Targets**

```css
/* Ensure minimum touch target size */
button,
a,
input,
select {
  min-height: 44px;
  min-width: 44px;
  padding: 12px;
}
```

---

## 📊 **Accessibility Metrics to Track**

### **WCAG 2.1 AA Compliance**

- [ ] **1.4.3 Contrast (Minimum)**: ✅
- [ ] **2.1.1 Keyboard**: ✅
- [ ] **2.4.6 Headings and Labels**: ✅
- [ ] **3.2.1 On Focus**: ✅
- [ ] **4.1.2 Name, Role, Value**: ✅

### **Performance Metrics**

- [ ] **Lighthouse Accessibility Score**: >90
- [ ] **axe-core Violations**: 0 critical
- [ ] **Manual Test Coverage**: 100%

---

## 🎯 **Priority Levels**

### **🔴 Critical (Block Release)**

- Text not visible in any theme
- Keyboard navigation broken
- Screen reader cannot access functionality
- Touch targets too small

### **🟡 High (Fix Before Release)**

- Missing ARIA labels
- Poor contrast ratios
- Focus indicators not visible
- Semantic HTML issues

### **🟢 Medium (Fix Soon)**

- Missing alt text for images
- Inconsistent error handling
- Loading states not announced
- Motion preferences not respected

### **🔵 Low (Nice to Have)**

- Advanced ARIA patterns
- Performance optimizations
- Enhanced keyboard shortcuts
- Custom focus management

---

## 📝 **Reporting Issues**

When reporting accessibility issues, include:

1. **Issue Description**: What's not working
2. **Impact**: Who is affected and how
3. **Steps to Reproduce**: How to trigger the issue
4. **Expected Behavior**: What should happen
5. **Assistive Technology**: What was used for testing
6. **Screenshots**: Visual evidence if applicable

---

## 🔄 **Review Schedule**

- **Weekly**: Quick accessibility scan during development
- **Monthly**: Full accessibility audit
- **Before Release**: Complete checklist review
- **Quarterly**: Comprehensive accessibility assessment

---

_This checklist should be reviewed and updated regularly as accessibility standards evolve._
