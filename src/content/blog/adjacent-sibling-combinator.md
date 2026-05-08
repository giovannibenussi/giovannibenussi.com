---
title: "Adjacent Sibling Combinator (+) in CSS"
description: "Learn about this powerful, not well known operator"
pubDate: "Apr 28 2021"
heroImage: "../../assets/blog/adjacent-sibling-combinator/featured-image.jpg"
---

<style>
.asc-demo { border: 1px solid #3b82f6; border-radius: 0.25rem; padding: 1rem; margin: 1rem 0; }
.asc-demo button { background-color: #3b82f6; color: white; display: block; padding: 0.25rem 0.75rem; border-radius: 0.25rem; border: 0; }
.asc-first > p { margin: 0.5rem 0 !important; }
.asc-first > button { margin-bottom: 0.5rem; }
.asc-first > p + button { background-color: #10b981; }
.asc-margin > button { margin-top: 1rem; }
.asc-margin-solution > button + button { margin-top: 1rem; }
.asc-margin-generic > * + * { margin-top: 1rem; }
</style>

If you've been into web development for a bit, you know how fast it has been evolving. CSS has gained a lot of features in the last years, allowing us to do things that weren't possible before without JavaScript. The adjacent sibling combinator is one of them.

## What's the Adjacent Sibling Combinator?

[According to MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Adjacent_sibling_combinator):

> The adjacent sibling combinator (+) separates two selectors and matches the second element only if it immediately follows the first element, and both are children of the same parent element.

Let's see an example of this:

```css
button {
  background-color: #3B82F6;
}

p + button {
  background-color: #10B981;
}
```

We are telling that if a button follows a paragraph, it should have a different background color.

So, this markup:

```html
<button>First</button>
<button>Second</button>
<p>Paragraph content</p>
<button>Third</button>
<button>Fourth</button>
```

Will look like this:

<div class="asc-demo asc-first">
  <button>First</button>
  <button>Second</button>
  <p>Paragraph content</p>
  <button>Third</button>
  <button>Fourth</button>
</div>

As you can see, only the button that comes after the paragraph has a custom color.

## Generalizing our Solution

We can go a step further and apply a given style using the Adjacent sibling combinator without it being specific to a given type.

Let's suppose we want to separate the following buttons between each other. We might write down the following CSS:

```css
button {
  margin-top: 1rem;
}
```

Here's how it will look:

<div class="asc-demo asc-margin">
  <button>First</button>
  <button>Second</button>
  <button>Third</button>
  <button>Fourth</button>
</div>

As you can see there's extra margin above the first button.

We can solve this by using the Adjacent sibling combinator:

```css
button + button {
  margin-top: 1rem;
}
```

<div class="asc-demo asc-margin-solution">
  <button>First</button>
  <button>Second</button>
  <button>Third</button>
  <button>Fourth</button>
</div>

This solves our current problem, but what happens if we want to apply the same separation between elements for more than buttons? Or what if we want to apply margins between different types of elements?

We can use the [CSS universal selector (\*)](https://developer.mozilla.org/en-US/docs/Web/CSS/Universal_selectors) that matches any element no matter its type to create a custom utility class to add separation between elements:

```css
.separate-4 > * + * {
  margin-top: 1rem;
}
```

<div class="asc-demo asc-margin-generic">
  <button>First</button>
  <button>Second</button>
  <button>Third</button>
  <button>Fourth</button>
</div>

This selector is also known as the [lobotomized owl selector](https://alistapart.com/article/axiomatic-css-and-lobotomized-owls/).

If needed, you can also combine different kind of selectors like `* + button`, `button + *`, `.myClass + *`, `.myID + .myClass`. This allows to be very flexible and match elements in such a way that wasn't possible in the past without using JavaScript.

## Conclusion

The adjacent sibling combinator is a very useful, yet not so well known operator. It allows to create layouts without too much work and that is easy to generalize.
