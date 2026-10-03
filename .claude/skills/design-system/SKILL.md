---
name: design-system
description: UI and UX rules for the web app (HeroUI v3, Tailwind v4, brand tokens, typography, links, forms, motion, loading states, accessibility). Use when building or changing any page, component, layout, form, table, dialog, or style in apps/web.
---

# Design system

Build every screen from the shared pieces below. Never hand pick font sizes, colors, or spacing that the system already covers.

## Tokens and theme
- Brand palette, fonts and motion live in `apps/web/src/styles/theme.css` (`@theme`). Rebrand there only.
- Use semantic HeroUI tokens in classes: `bg-background`, `bg-surface`, `text-foreground`, `text-muted`, `text-accent`, `bg-accent`, `bg-accent-soft`, `border-separator`, `text-danger`, `text-success`. Use `brand-50…950` only for illustration or charts.
- Every color must work in light and dark. Never write a hex value in a component.

## Typography
- Use `<Typography variant color font as>` from `components/ui/typography.tsx`.
- Scale: `j1 j2` display, `h1…h6` headings, `s1…s4` subtitles, `b1…b3` body, `l1…l3` light, `c1 c2` captions, `p1` tiny.
- Page title: `as="h1" variant="j2" font="secondary"`. Section title: `variant="h2"`. Helper text: `variant="b3" color="secondary"`.
- One `h1` per page. Keep running text near 65 characters wide.

## Links and buttons
- Navigation is a link, an action is a button. Never put `onClick` navigation on a `div`.
- Links from `components/links`: `PrimaryLink`, `UnderlineLink`, `ArrowLink` (back or forward), `ButtonLink` (looks like a button, navigates), `IconLink` (needs `aria-label`).
- Actions use HeroUI `Button` with `isPending` while work runs. Destructive actions use `variant="danger"` and a confirm step.
- Programmatic navigation uses `useProgressRouter()` so the progress bar shows.

## Forms
- Always `useAppForm` + `<form.AppForm><form.Form>` + `form.AppField` + `form.SubmitButton`.
- Field components: `TextInput` (also `multiline`), `NumberInput`, `SelectInput`, `RadioInput`, `CheckboxInput`, `SwitchInput`, `DateInput`.
- Schemas come from `@repo/validators` so the API and the form validate the same way.
- Every field has a visible label. Errors appear under the field after it is touched, in plain words that say how to fix it.
- Set `autoComplete` on identity fields (`email`, `current-password`, `new-password`).

## Loading, empty and error states
- Every route group has `loading.tsx` using `TableSkeleton`, `FormSkeleton` or `FullPageSpinner` from `components/ui/skeleton.tsx`. Skeletons match the real layout so nothing jumps.
- Keep previous data visible while refetching (`placeholderData: keepPreviousData`) and dim it instead of blanking the screen.
- Empty states say what will appear and how to add the first item.
- Errors explain what happened and offer a retry. Never show raw error objects.

## Error pages and illustrations
- 404 is `app/not-found.tsx`, 500 is `app/error.tsx` (and `(dashboard)/error.tsx` to keep the shell), root crashes use `app/global-error.tsx`, 403 is `Forbidden` from `withAuth`. All render through `ErrorView`.
- Illustrations are unDraw SVGs converted to components in `components/illustrations/`. Accent uses `currentColor`; neutrals use `--ill-ink`, `--ill-muted`, `--ill-surface`, `--ill-paper` set by the `.illustration` class. Wrap new ones the same way and replace hard coded greys with those variables.
- Error copy says what happened and gives one clear next step. Show the error digest on 500 so users can quote it.

## Motion
- Pages ease in through each group's `template.tsx` (`animate-enter`, 360ms). Lists may stagger by 60ms per row.
- Hover and press feedback stays under 200ms. Buttons press to `scale-[0.97]`.
- One motion per moment. No bouncing, spinning, or parallax.
- All motion is disabled by `prefers-reduced-motion` in `theme.css`. Do not bypass it.

## Accessibility (WCAG 2.2 AA)
- Text contrast at least 4.5:1, large text and UI parts at least 3:1.
- Visible focus on every interactive element; focus must not be hidden behind sticky headers.
- Targets at least 24 by 24 px.
- Layout works at 320 px wide without sideways scrolling.
- Never rely on color alone; pair it with text or an icon.
- Icons that carry meaning get `aria-label`; decorative icons get `aria-hidden`.

## Layout
- Use flex or grid with `gap`, not margins between siblings.
- Content max width `max-w-6xl`, page padding `p-6`, section gap `gap-10`, field gap `gap-5`.
- Cards (`rounded-3xl border border-separator bg-surface`) only for grouped content, not for every block.

## Before you finish
- Check the page in light and dark, at desktop and 400 px wide.
- Keyboard through it once: tab order, focus ring, Escape closes dialogs.
- Look at `/ui` for a live reference of every piece.

## Sources
- https://www.w3.org/WAI/WCAG22/quickref/
- https://heroui.com/docs/react
- https://tailwindcss.com/docs/theme
