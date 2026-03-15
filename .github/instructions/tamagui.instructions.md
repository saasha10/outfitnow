---
description: "Use when writing or debugging Tamagui components, styling, theming, or encountering TypeScript errors with Tamagui props like 'Property does not exist on type'. Covers Tamagui v2 RC shorthand props, available themes, Card/Button/ScrollView API, and common pitfalls."
applyTo: '**/*.tsx'
---

# Tamagui v2 RC — Project Configuration & Troubleshooting Guide

## Project Setup

- **Version**: `2.0.0-rc.26` (all `@tamagui/*` packages)
- **Config**: `@tamagui/config/v5` with `defaultConfig`
- **Critical setting**: `onlyAllowShorthands: true` is enabled in `defaultConfig`

This means **longhand style props are NOT allowed** as component props. You MUST use the shorthand equivalents below.

---

## Dependency Management Rules

**NEVER** change these rules in `package.json` — they prevent the recurring "Can't find Tamagui configuration" runtime error.

### Pinned versions (no caret `^`)

All Tamagui packages MUST use **exact versions** (no `^` or `~` prefix). Pre-release versions with carets can resolve to different RC versions across transitive dependencies, causing duplicate module instances.

```json
"tamagui": "2.0.0-rc.26",
"@tamagui/config": "2.0.0-rc.26",
"@tamagui/core": "2.0.0-rc.26",
"@tamagui/web": "2.0.0-rc.26",
"@tamagui/native": "2.0.0-rc.26",
"@tamagui/font-inter": "2.0.0-rc.26",
"@tamagui/babel-plugin": "2.0.0-rc.26"
```

### Required direct dependencies

`@tamagui/web` and `@tamagui/core` MUST be listed as **direct dependencies** in `package.json`, even though you never import them directly. This forces npm to hoist them to the top level so all Tamagui packages share a single copy. Without this, npm creates dozens of nested duplicates, each with isolated module state.

### Required overrides

The `overrides` section in `package.json` MUST exist:

```json
"overrides": {
  "@tamagui/web": "2.0.0-rc.26",
  "@tamagui/core": "2.0.0-rc.26",
  "@tamagui/native": "2.0.0-rc.26"
}
```

This tells npm to use the exact specified version for ALL transitive dependencies, preventing version fragmentation.

### When upgrading Tamagui

Update the version in ALL of these places simultaneously:

1. Every `@tamagui/*` and `tamagui` entry in `dependencies`
2. Every `@tamagui/*` entry in `devDependencies`
3. Every entry in `overrides`
4. Then: `rm -rf node_modules package-lock.json && npm install`
5. Verify: `find node_modules -path "*/node_modules/@tamagui/web/package.json" | wc -l` should output `0`

---

## Shorthand Prop Reference

The config uses `@tamagui/shorthands/v4`. When `onlyAllowShorthands: true`, only these are valid:

| Shorthand | Longhand (DO NOT USE) |
| --------- | --------------------- |
| `p`       | `padding`             |
| `pt`      | `paddingTop`          |
| `pb`      | `paddingBottom`       |
| `pl`      | `paddingLeft`         |
| `pr`      | `paddingRight`        |
| `px`      | `paddingHorizontal`   |
| `py`      | `paddingVertical`     |
| `m`       | `margin`              |
| `mt`      | `marginTop`           |
| `mb`      | `marginBottom`        |
| `ml`      | `marginLeft`          |
| `mr`      | `marginRight`         |
| `mx`      | `marginHorizontal`    |
| `my`      | `marginVertical`      |
| `bg`      | `backgroundColor`     |
| `justify` | `justifyContent`      |
| `items`   | `alignItems`          |
| `content` | `alignContent`        |
| `self`    | `alignSelf`           |
| `grow`    | `flexGrow`            |
| `shrink`  | `flexShrink`          |
| `maxW`    | `maxWidth`            |
| `maxH`    | `maxHeight`           |
| `minW`    | `minWidth`            |
| `minH`    | `minHeight`           |
| `rounded` | `borderRadius`        |
| `text`    | `textAlign`           |
| `t`       | `top`                 |
| `b`       | `bottom`              |
| `l`       | `left`                |
| `r`       | `right`               |
| `z`       | `zIndex`              |
| `select`  | `userSelect`          |

### Props that are NOT shorthands (use directly)

These are not remapped and work as-is: `flex`, `width`, `height`, `gap`, `overflow`, `display`, `position`, `opacity`, `borderWidth`, `borderColor`, `flexWrap`, `flexDirection`.

---

## Available Themes

Valid theme names for `theme=` prop on components:

- Base: `light`, `dark`
- Color themes: `accent`, `black`, `white`, `gray`, `blue`, `red`, `yellow`, `green`, `orange`, `pink`, `purple`, `teal`, `neutral`
- Surface themes: `surface1`, `surface2`
- Combined: e.g. `light_red`, `dark_blue`, `light_accent`, `dark_gray_surface1`

**DO NOT** use `theme="active"` — it does not exist. Use `theme="accent"` instead.

---

## Component-Specific Notes

### Card

- No `elevate` prop in v2 RC. Use `elevation="$1"` (or `$2`, `$3`, etc.)
- No `bordered` prop. Use `borderWidth={1} borderColor="$borderColor"`
- No `pressTheme` prop in v2 RC

### Button

- No `textTransform` prop. Capitalize text content in JS instead: `{text.charAt(0).toUpperCase() + text.slice(1)}`
- Valid `variant` values: `"outlined"` or omit for default

### ScrollView (Tamagui)

- `contentContainerStyle` must use **shorthand props** too (e.g. `{ p: 20, pt: 16 }` NOT `{ padding: 20, paddingTop: 16 }`)

### Text

- Use `text="center"` NOT `textAlign="center"`
- `textTransform` works on Text (it's a valid CSS/RN text style)

### YStack / XStack

- Use shorthand props: `justify`, `items`, `p`, `m`, `bg`, `rounded`, etc.
- `gap` is used directly (not a shorthand)

---

## Debugging Checklist

When you see TypeScript errors like `Property 'X' does not exist on type`:

1. **Check if it's a longhand prop** → Replace with shorthand from the table above
2. **Check if the prop exists in v2 RC** → Props like `elevate`, `bordered`, `pressTheme` were removed
3. **Check if it's a valid component prop** → e.g. `textTransform` is not valid on `Button` (it's a Stack, not Text)
4. **Check `contentContainerStyle`** → Must use shorthands, not longhand CSS names
5. **Check theme name** → Must be a valid `ThemeName` from generated themes (see list above)

### How to investigate further

If a prop error is unclear, run these in terminal:

```sh
# Check what shorthands are defined
cat node_modules/@tamagui/shorthands/types/v4.d.ts

# Check if onlyAllowShorthands is enabled
grep -A2 "onlyAllowShorthands" node_modules/@tamagui/config/types/v5-base.d.ts

# Check available theme names
grep "type ThemeNames" node_modules/@tamagui/themes/types/generated-v5.d.ts

# Check a specific component's type definition (e.g. Card)
cat node_modules/@tamagui/card/types/Card.d.ts

# Check StackStyleBase (what style props are available)
grep -A5 "interface StackStyleBase" node_modules/@tamagui/web/types/types.d.ts

# Find nested @tamagui/web duplicates (should be 0 — if not, overrides are broken)
find node_modules -path "*/node_modules/@tamagui/web/package.json" | wc -l
```

### "Can't find Tamagui configuration" error

This error means multiple copies of `@tamagui/web` exist in `node_modules`. `TamaguiProvider` sets the config on one copy, but components loaded from a different copy can't find it.

**DO NOT** fix this with `npm dedupe` — it's a temporary band-aid that breaks on the next `npm install`.

**Permanent fix checklist:**

1. All Tamagui versions are pinned (no `^`) — see Dependency Management Rules above
2. `@tamagui/web` and `@tamagui/core` are listed as direct dependencies
3. `overrides` section exists in `package.json`
4. Run `rm -rf node_modules package-lock.json && npm install`
5. Verify: `find node_modules -path "*/node_modules/@tamagui/web/package.json" | wc -l` outputs `0`

### Common error patterns

| Error                                                 | Cause                               | Fix                               |
| ----------------------------------------------------- | ----------------------------------- | --------------------------------- |
| `Property 'padding' does not exist`                   | Longhand when shorthands-only is on | Use `p`                           |
| `Property 'justifyContent' does not exist`            | Same                                | Use `justify`                     |
| `Property 'backgroundColor' does not exist`           | Same                                | Use `bg`                          |
| `Property 'textAlign' does not exist`                 | Same                                | Use `text`                        |
| `Property 'maxWidth' does not exist`                  | Same                                | Use `maxW`                        |
| `Property 'elevate' does not exist`                   | Removed in v2 RC                    | Use `elevation="$1"`              |
| `Type '"active"' is not assignable to ThemeName`      | Not a valid theme                   | Use `"accent"`                    |
| `Property 'bordered' does not exist`                  | Removed in v2 RC                    | Use `borderWidth` + `borderColor` |
| `Property 'textTransform' does not exist` (on Button) | Button is a Stack, not Text         | Capitalize in JS                  |
