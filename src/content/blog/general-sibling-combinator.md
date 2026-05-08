---
title: "General Sibling Combinator (~) in CSS"
description: "How to target very specific elements without recurring to JavaScript"
pubDate: "May 05 2021"
heroImage: "../../assets/blog/general-sibling-combinator/featured-image.png"
---

<style>
.gsc-demo { border: 1px solid #3b82f6; border-radius: 0.25rem; padding: 1rem; margin: 1rem 0; }
.gsc-demo p { background-color: lightblue; padding: 0.25rem 0.5rem; margin: 0.25rem 0; }
.gsc-demo h1 ~ p { background-color: lightgreen; }
.gsc-demo .gsc-header { font-weight: bold; font-size: 1.25rem; margin: 0.5rem 0; }
</style>

## What's the General Sibling Combinator?

[According to MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/General_sibling_combinator):

> The general sibling combinator (~) separates two selectors and matches all iterations of the second element, that are following the first element (though not necessarily immediately), and are children of the same parent element.

In other words, it matches all elements that follows a certain element as long as they share the same parent.

Let's see an example of this:

```css
p {
  background-color: lightblue;
}

h1 ~ p {
  background-color: lightgreen;
}
```

The previous CSS with this markup:

```html
<p>Before header 1</p>
<p>Before header 2</p>
<h1>Header</h1>
<p>After header 1</p>
<p>After header 2</p>
```

Will produce the following output:

<div class="gsc-demo">
  <p>Before header 1</p>
  <p>Before header 2</p>
  <h1 class="gsc-header">Header</h1>
  <p>After header 1</p>
  <p>After header 2</p>
</div>

This selector only matches direct children. Keeping the same previous CSS but changing the markup to this:

```html
<p>Before header 1</p>
<p>Before header 2</p>
<h1>Header</h1>
<p>After header 1</p>
<p>After header 2</p>
<div>
  <p>Nested paragraph</p>
</div>
```

Produces the following output:

<div class="gsc-demo">
  <p>Before header 1</p>
  <p>Before header 2</p>
  <h1 class="gsc-header">Header</h1>
  <p>After header 1</p>
  <p>After header 2</p>
  <div>
    <p>Nested paragraph</p>
  </div>
</div>

## Conclusion

The general sibling combinator gives us a convenient and precise way to match elements. Now that you have it in your toolbelt, be aware of opportunities to use it and let me know how it goes!
