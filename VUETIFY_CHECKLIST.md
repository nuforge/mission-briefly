# Vuetify Component Audit Checklist

## 🛡️ Pre-Tree-Shaking Checklist

Before making any changes to Vuetify component imports in `src/vuetify.ts`, complete this checklist to prevent icon and component display issues.

### 1. Component Usage Audit

Run these commands to find all Vuetify components in use:

```bash
# Search for all v- components in templates
grep -r "v-[a-z-]*" src/components/ src/views/ --include="*.vue"

# Search for specific component patterns
grep -r "<v-" src/components/ src/views/ --include="*.vue"

# Search for directive usage
grep -r "v-[a-z-]*=" src/components/ src/views/ --include="*.vue"
```

### 2. Icon System Verification

Check these critical icon-related components:

- [ ] `DepartmentIcon.vue` - Uses `VIcon`, `VLabel`, `VTooltip`
- [ ] `ATag.vue` - Uses `VChip`, `VIcon`
- [ ] `CharacterTag.vue` - Uses `VChip`, `VTooltip`, `VSheet`
- [ ] `RankPips.vue` - Check for any icon usage
- [ ] All card components - Verify chip groups and icons

### 3. Required Components List

Ensure these components are imported in `vuetify.ts`:

#### Core Layout

- [ ] `VApp`
- [ ] `VMain`
- [ ] `VContainer`
- [ ] `VRow`
- [ ] `VCol`

#### Cards & Content

- [ ] `VCard`
- [ ] `VCardTitle`
- [ ] `VCardText`
- [ ] `VCardActions`
- [ ] `VSheet`

#### Interactive Elements

- [ ] `VBtn`
- [ ] `VIcon`
- [ ] `VChip`
- [ ] `VChipGroup`

#### Navigation

- [ ] `VNavigationDrawer`
- [ ] `VAppBar`
- [ ] `VToolbar`
- [ ] `VToolbarTitle`
- [ ] `VSpacer`

#### Lists & Data

- [ ] `VList`
- [ ] `VListItem`
- [ ] `VListItemTitle`

#### Feedback & Overlay

- [ ] `VAlert`
- [ ] `VDialog`
- [ ] `VDivider`
- [ ] `VLabel`
- [ ] `VTooltip`
- [ ] `VProgressLinear`

#### Directives

- [ ] `Ripple`

### 4. Icon System Configuration

Verify icon configuration includes:

- [ ] MDI icon set imported and configured
- [ ] Material Design icon set imported and configured
- [ ] CSS imports for both icon fonts
- [ ] Default icon set specified
- [ ] Icon aliases properly configured

Required imports:

```typescript
import '@mdi/font/css/materialdesignicons.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import { aliases as aliases_md, md } from 'vuetify/iconsets/md'
```

### 5. Testing Protocol

After any Vuetify changes, test these critical paths:

- [ ] Visit home page - check navigation icons
- [ ] Visit crew member page (e.g., `/crew/Jean-Luc%20Picard`) - check department icons
- [ ] Visit ship page - check all chip icons
- [ ] Visit mission page - check mission status icons
- [ ] Check all tag components display correctly
- [ ] Verify tooltips work on hover
- [ ] Test responsive behavior

### 6. Browser Console Check

- [ ] No console errors related to missing components
- [ ] No 404 errors for icon fonts
- [ ] No warnings about unregistered components

### 7. Performance Verification

- [ ] Bundle size hasn't increased unexpectedly
- [ ] Build time remains reasonable
- [ ] No duplicate imports

## 🚨 Critical Component Pairs

These components often work together and missing one breaks the other:

- `VIcon` + `VTooltip` (for department icons)
- `VChip` + `VChipGroup` (for tag displays)
- `VCard` + `VCardTitle` + `VCardText` + `VCardActions`
- `VList` + `VListItem` + `VListItemTitle`

## 📝 Common Issues

### Icons Not Displaying

- Check if `VIcon` is imported
- Verify icon font CSS imports
- Check for conflicting icon properties in components

### Tooltips Not Working

- Ensure `VTooltip` is imported
- Check tooltip syntax in templates

### Chips Not Rendering

- Verify `VChip` and `VChipGroup` are both imported
- Check for proper chip group usage

### Layout Breaks

- Ensure all layout components (`VContainer`, `VRow`, `VCol`) are imported
- Check responsive grid usage

---

**Last Updated:** August 18, 2025  
**Next Review:** Before any Vuetify configuration changes  
**Owner:** Development Team
