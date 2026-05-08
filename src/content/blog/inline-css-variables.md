---
title: "Inline CSS Variables"
description: "How to set CSS variables with inline styles"
pubDate: "Jun 14 2021"
heroImage: "../../assets/blog/inline-css-variables/featured-image.jpg"
---

[CSS custom properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties), aka CSS variables, allow us to define custom properties — or variables — to use in our CSS.

Let's say we want to define a custom color for a button. We could use the following CSS:

```css
.custom-button {
  /* Other styles omitted... */
  --background-color: #bfdbfe;
  background: var(--background-color);
}
```

With the following HTML:

```html
<button class='custom-button'>Click Me!</button>
```

It produces:

<button style="--background-color: #bfdbfe; background: var(--background-color); padding: 0.25rem 0.5rem; border-radius: 0.25rem; border: 1px solid rgba(0,0,0,0.1); color: #111; cursor: pointer;">Click Me!</button>

You can update the custom property by using [inline styles](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/style):

```html
<button class='custom-button' style="--background-color: lightgreen">Click Me!</button>
```

<button style="--background-color: lightgreen; background: var(--background-color); padding: 0.25rem 0.5rem; border-radius: 0.25rem; border: 1px solid rgba(0,0,0,0.1); color: #111; cursor: pointer;">Click Me!</button>

This could be very useful in some cases. For example, you could have a grid component and you may want to specify the number of columns and rows with CSS variables:

```html
<div class="grid" style="--columns: 4; --rows: 8">...</div>
```
