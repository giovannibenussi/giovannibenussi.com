---
title: "CSS Counters"
description: "Simplify Your Apps by Using Counters Completely Managed by CSS"
pubDate: "Oct 21 2021"
heroImage: "../../assets/blog/css-counters/featured-image.jpg"
---

<style>
.cc-demo { border: 1px solid #3b82f6; border-radius: 0.25rem; padding: 1rem; margin: 1rem 0; }
.cc-demo p { margin: 0.5rem 0; }

.cc-simple { counter-reset: cc-simple; }
.cc-simple p::before {
  counter-increment: cc-simple;
  font-weight: bold;
  content: "- Paragraph " counter(cc-simple) ": ";
}

.cc-nested { counter-reset: cc-nested; }
.cc-nested p::before {
  counter-increment: cc-nested;
  font-weight: bold;
  content: "- Paragraph " counter(cc-nested) ": ";
}

.cc-fixed { counter-reset: cc-fixed; }
.cc-fixed > p::before {
  counter-increment: cc-fixed;
  font-weight: bold;
  content: "- Paragraph " counter(cc-fixed) ": ";
}

.cc-fixed-5 { counter-reset: cc-fixed-5 5; }
.cc-fixed-5 > p::before {
  counter-increment: cc-fixed-5;
  font-weight: bold;
  content: "- Paragraph " counter(cc-fixed-5) ": ";
}

.cc-fixed-neg { counter-reset: cc-fixed-neg -5; }
.cc-fixed-neg > p::before {
  counter-increment: cc-fixed-neg;
  font-weight: bold;
  content: "- Paragraph " counter(cc-fixed-neg) ": ";
}
</style>

[CSS custom properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties), also known as CSS variables, allow us to define custom properties — or variables — to use in our CSS.

CSS counters are variables that you can use in your code. You can use counters to display things like heading and code block line numbers.

One real-world use case for counters is to [display line numbers in code blocks](https://github.com/shikijs/shiki/issues/3#issuecomment-830564854). The good thing about this approach is that it doesn't require JavaScript so you don't need to deal with internal logic to update styles.

## Our First Counter

Let's start with an example followed by a step-by-step explanation:

```css
.demo {
  counter-reset: paragraph-counter;
}

.demo p::before {
  counter-increment: paragraph-counter;
  content: "Paragraph " counter(paragraph-counter) ": ";
}
```

This counter displays "Paragraph x" before each paragraph. Let's try it out with the HTML code from below.

```html
<p>First paragraph</p>
<p>Second paragraph</p>
<p>Third paragraph</p>
```

This produces the following output:

<div class="cc-demo cc-simple">
  <p>First paragraph</p>
  <p>Second paragraph</p>
  <p>Third paragraph</p>
</div>

Let's see what happens with nested paragraphs:

```html
<p>First paragraph</p>
<p>Second paragraph</p>
<div>
  <p>Nested paragraph</p>
</div>
<p>Third paragraph?</p>
```

<div class="cc-demo cc-nested">
  <p>First paragraph</p>
  <p>Second paragraph</p>
  <div>
    <p>Nested paragraph</p>
  </div>
  <p>Third paragraph?</p>
</div>

As you can see, it considers nested paragraphs too because our CSS rule increments the count on every `p` tag. If you rather want to increment the counter only on top level paragraphs, you'd need to increase the specificity of your CSS by selecting only direct descendants of your parent element (changing `.demo p` to `.demo > p`) as shown below:

```css
.demo {
  counter-reset: paragraph-counter;
}

.demo > p::before {
  counter-increment: paragraph-counter;
  content: "Paragraph " counter(paragraph-counter) ": ";
}
```

The change above produces the desired result:

<div class="cc-demo cc-fixed">
  <p>First paragraph</p>
  <p>Second paragraph</p>
  <div>
    <p>Nested paragraph</p>
  </div>
  <p>Third paragraph?</p>
</div>

Now that you have a basic understanding, I'll detail and introduce CSS properties to work with counters.

## counter-reset

We can specify an initial value to `counter-reset`:

```css
counter-reset: paragraph-counter 5;
```

<div class="cc-demo cc-fixed-5">
  <p>First paragraph</p>
  <p>Second paragraph</p>
  <div>
    <p>Nested paragraph</p>
  </div>
  <p>Third paragraph?</p>
</div>

Also works with negative numbers:

```css
counter-reset: paragraph-counter -5;
```

<div class="cc-demo cc-fixed-neg">
  <p>First paragraph</p>
  <p>Second paragraph</p>
  <div>
    <p>Nested paragraph</p>
  </div>
  <p>Third paragraph?</p>
</div>

You can reset multiple counters at the same time:

```css
counter-reset: paragraph-counter 5 another-counter 10;
```

## counter-increment

You can increment a counter by an arbitrary value:

```css
counter-increment: paragraph-counter 5;
```

If no value is specified, it will default to 1.

## counter-set

`counter-set` sets a counter to a given value.

```css
counter-set: paragraph-counter 5;
```

If you don't specify a value, it will default to 0:

```css
/* Set paragraph-counter to 0 */
counter-set: paragraph-counter;
```

## Conclusion

CSS counters allow to do things that were only possible with JavaScript a few years ago. I recommend you to take a look at places where you can start using counters!
