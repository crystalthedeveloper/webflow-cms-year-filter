# webflow-cms-year-filter

Tiny, attribute-based filtering for **Webflow CMS** lists by year.  
Add `data-filter-year` to your buttons and `data-year` to each CMS item; the script shows/hides items, highlights the active button, supports multiple independent sections, deep-links (`?year=2024`), and a custom “No items found” message.

---

## Features
- 🔘 Filter by year with simple data attributes (no jQuery, no libraries)
- 🧭 Deep links: `?year=2025` or `#year=2025`
- 🧩 Multiple sections on one page via `data-year-scope`
- ✅ Active button state (`aria-pressed` set for a11y)
- 🕳️ Custom empty state (`[data-empty]`) or auto-create one
- ⚡ Works great on Webflow; also fine in any static site

---

## Markup

Wrap each section (buttons + list + empty message) with a **scope**.  
Inside that scope:

- Each **button** gets `data-filter-year="2025"` (or `2024`, `all`, etc.)
- Each **CMS item wrapper** (the repeating card) gets `data-year="YYYY"`  
  *(Bind your Date field and format as **Year** in Webflow, or use a Number/Text field.)*
- Optional **empty message** element gets `data-empty`.

```html
<div data-year-scope>
  <div class="buttons">
    <button data-filter-year="2025">2025</button>
    <button data-filter-year="2024">2024</button>
    <button data-filter-year="2023">2023</button>
    <button data-filter-year="all">All</button>
  </div>

  <div class="cards">
    <!-- Repeating CMS item wrapper -->
    <article class="card" data-year="2025">…</article>
    <article class="card" data-year="2024">…</article>
    <!-- etc -->
  </div>

  <!-- Optional custom empty message (JS will toggle visibility) -->
  <p data-empty>No items found.</p>
</div>
```

> ✅ Put `data-year` on the **Collection Item wrapper** (the element that repeats), not on an inner text element.

---

## Usage

### 1) Include the single JS file
```html
<script src="https://cdn.jsdelivr.net/gh/crystalthedeveloper/webflow-cms-year-filter@v1.0.0/year-filter.js" defer></script>
```

The script **auto-initializes** on page load with sensible defaults.

### 2) (Optional) Configure
If you need to tweak behavior, call `init` after the script:

```html
<script>
  // All options are optional—shown here for reference
  WebflowCMSYearFilter.init({
    scopeSelector: "[data-year-scope]",
    buttonSelector: "[data-filter-year]",
    itemSelector: "[data-year]",
    emptySelector: "[data-empty]",
    readURL: true,             // enable ?year=2024 or #year=2024
    defaultToMaxYear: true,    // pick largest year if no URL
    activeStyles: {            // inline styles when a button is active
      backgroundColor: "#e63946",
      color: "#fff"
    },
    createEmptyIfMissing: false, // auto-create <p data-empty> if none exists
    emptyText: "No items found."
  });
</script>
```

---

## Deep Linking

The filter respects:
- Query param: `?year=2024`
- Hash: `#year=2024`

Share links with a preselected year out of the box.

---

## Multiple Sections

You can place **many** independent groups on a page—just wrap each group in its own container with `data-year-scope`. The script scopes clicks and empty states to the nearest wrapper.

---

## Webflow Notes

- **Pagination:** turn it **off** for the filtered list, or use a “load all” strategy (e.g., Finsweet CMS Load) so all items exist in the DOM before filtering.
- **Binding the Year:** If using a Date field, set the attribute value format to **Year (YYYY)** in the Designer.
- **Placement:** Put the script **Before </body>** in the page settings or Site-wide Custom Code.

---

## Accessibility

- The active filter button gets `aria-pressed="true"`.
- Provide an informative `[data-empty]` message; screen readers will announce changes as it toggles.

---

## Minimal Example

```html
<div data-year-scope>
  <div>
    <button data-filter-year="2025">2025</button>
    <button data-filter-year="2024">2024</button>
    <button data-filter-year="all">All</button>
  </div>

  <div>
    <article data-year="2025">Item A (2025)</article>
    <article data-year="2024">Item B (2024)</article>
  </div>

  <p data-empty>No items found.</p>
</div>

<script src="webflow-cms-year-filter.js" defer></script>
```

---

## Options

| Option | Type | Default | Description |
|-------|------|---------|-------------|
| `scopeSelector` | string | `"[data-year-scope]"` | Wrapper that contains one set of buttons, items, and optional empty message. |
| `buttonSelector` | string | `"[data-filter-year]"` | Buttons that select a year or `all`. |
| `itemSelector` | string | `"[data-year]"` | Repeating CMS item wrapper containing the bound year. |
| `emptySelector` | string | `"[data-empty]"` | Custom empty element to show when 0 items match. |
| `readURL` | boolean | `true` | Enable `?year=YYYY` or `#year=YYYY` deep linking. |
| `defaultToMaxYear` | boolean | `true` | If no URL year, pick the largest numeric year button. |
| `activeStyles` | object\|null | `{ backgroundColor:"#e63946", color:"#fff" }` | Inline styles applied to the active button. Set to `null` to disable. |
| `createEmptyIfMissing` | boolean | `false` | Create a `<p data-empty>` automatically if none exists. |
| `emptyText` | string | `"No items found."` | Default empty-state text. |

---

## License

MIT © Crystal The Developer
