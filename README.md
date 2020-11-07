# @ne1410s/scrollr

## Customisable & lightweight scrollbars.

```html
<ne14-scrollr>
  <span>Hello world</span>
</ne14-scrollr>
```

- **Use:** `<script src="PATH_TO_UMD_SCRIPT"></script>`
- **Extend:** _npm i -S @ne1410s/scrollr_

### Attributes

- _There are no bespoke attributes exposed in this element_

### Events

- _There are no bespoke events raised by this element_

### Methods

As well as specifying the element directly in HTML, it is also possible to wrap an element with scrollbars dynamically:

```javascript
window.ne_scrollr.apply('#existing-element', 'new-class-name');
```

- _[Module].apply(selector, (newClass))_

-- **selector**: CSS selector of element to wrap

-- **newClass**: Class to add to wrapper; e.g. to help deliver different styles to different scrollrs

### Properties

- _There are no bespoke properties exposed in this element_

### CSS Variables

A reasonable amount of custom styling can be provided, by way of css variables:

```css
ne14-scrollr {
  --max-width: 300px;
  --max-height: 200px;
}
```

- **`--background`** _Background for the scroll area. Not normally necessary; the background of the wrapped content should work in most cases_
- **`--color`** _Color for the draggable bars. Defaults to: `rgb(193, 193, 193)`_
- **`--cursor`** _Cursor for the draggable bars_
- **`--cursor-x`** _Cursor override for the horizontal bar_
- **`--cursor-y`** _Cursor override for the vertical bar_
- **`--margin`** _Separation between bar and side (only when inactive)_
- **`--max-width`** _Maximum width of the scroll area. Defaults to: `100%`_
- **`--max-height`** _Maximum height of the scroll area. Defaults to: `600px`_
- **`--min-length`** _Minimum bar length. Defaults to: `30px`_
- **`--outline`** _Outline for the bar_
- **`--radius`** _Border radius for the bar_
- **`--shadow`** _Shadow for the bar_
- **`--thickness`** _Thickness of the bar. Defaults to: `3px`_
- **`--track-color`** _Color for the track behind the bar_
- **`--track-cursor`** _Cursor for the track behind the bar_
- **`--transition-duration`** _Duration for several tranistions. Defaults to: `0.2s`_
- **`--active-color`** _Color for the bar (when active). Defaults to: `rgb(168, 168, 168)`_
- **`--active-outline`** _Outline for the bar (when active)_
- **`--active-radius`** _Border radius for the bar (when active)_
- **`--active-shadow`** _Box shadow for the bar (when active)_
- **`--active-thickness`** _Thickness of the bar (when active). Defaults to: `10px`_
- **`--active-track-color`** _Color for the track behind the bar (when active). Defaults to: `rgba(241, 241, 241, 0.3)`_

_\*The active state of the bar is triggered on hover_
