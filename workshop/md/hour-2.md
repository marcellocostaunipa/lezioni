# Hour 2: CSS Fundamentals & Styling Principles

## Introduction to CSS

CSS (Cascading Style Sheets) is the language used to style and layout web pages. It transforms the structured content from HTML into visually appealing designs. In this hour, we'll explore CSS fundamentals using our portfolio project as a reference.

## CSS Syntax and Structure

Let's start by examining the basic structure of CSS:

    selector {
      property: value;
      another-property: value;
    }

Our portfolio's CSS is organized into logical sections with comments, making it easier to navigate and maintain:

    /* ==========================================================================
       CUSTOM PROPERTIES AND GLOBAL STYLES
       ========================================================================== */

    /* ==========================================================================
       CSS RESET AND BASE STYLES
       ========================================================================== */

    /* ==========================================================================
       LAYOUT UTILITIES
       ========================================================================== */

This organization helps separate concerns and makes the stylesheet more maintainable.

## CSS Custom Properties (Variables)

Our portfolio uses CSS custom properties (also called CSS variables) to maintain consistency and make global changes easier:

    :root {
      --primary-color: #1f1f1f;
      --secondary-color: #718096;
      --accent-color: #667eea;
      --border-color: #e2e8f0;
      --text-color: #2d3748;
      --transition-duration: 0.3s;
      --border-radius: 8px;
      --spacing: 1.5rem;
    }

These variables are defined in the `:root` selector, making them globally available. We can use them throughout our CSS:

    .btn--primary {
      background: var(--primary-color);
      color: #fff;
    }

Benefits of CSS variables:
- Centralized control over repeated values
- Easier theming and customization
- More maintainable code
- Ability to change values dynamically with JavaScript

## CSS Reset and Normalization

Our portfolio includes a modern CSS reset to ensure consistent rendering across browsers:

    *,
    *::before,
    *::after {
      box-sizing: border-box;
    }

    * {
      margin: 0;
      padding: 0;
    }

    html {
      font-size: 100%;
      scroll-behavior: smooth;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      line-height: 1.6;
      color: var(--text-color);
      min-height: 100vh;
    }

    img {
      max-width: 100%;
      height: auto;
      display: block;
    }

    button {
      font: inherit;
      cursor: pointer;
      border: none;
      background: none;
    }

    a {
      color: var(--primary-color);
    }

This reset:
- Sets `box-sizing: border-box` for all elements
- Removes default margins and padding
- Establishes base font settings
- Makes images responsive by default
- Normalizes button and link styles

## CSS Selectors

Our portfolio uses various types of selectors:

### Class Selectors

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 var(--spacing);
    }

### Descendant Selectors

    .card__content {
      padding: 0 var(--spacing);
    }

    .card__title {
      font-size: 1.5rem;
      font-weight: 600;
      margin-bottom: calc(var(--spacing) / 2);
      color: #1a202c;
    }

### Pseudo-classes

    .card:hover {
      transform: translateY(-8px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1), 0 20px 40px rgba(0, 0, 0, 0.15);
    }

    .card:hover .card__image {
      transform: scale(1.05);
    }

### Pseudo-elements

    .modal::backdrop {
      background: rgba(0, 0, 0, 0.8);
      backdrop-filter: blur(4px);
    }

## CSS Naming Conventions: BEM

Our portfolio uses the BEM (Block, Element, Modifier) naming convention:

    /* Block */
    .card { }

    /* Element (belongs to the block) */
    .card__title { }
    .card__description { }
    .card__footer { }

    /* Modifier (changes the style of the block) */
    .btn--primary { }

BEM provides several benefits:
- Clear, structured naming system
- Reduces style conflicts
- Improves code readability
- Makes CSS more maintainable

## The Box Model

Every HTML element is represented as a rectangular box. The CSS box model consists of:
- Content
- Padding
- Border
- Margin

Our portfolio uses `box-sizing: border-box` to include padding and border in the element's total width and height:

    *,
    *::before,
    *::after {
      box-sizing: border-box;
    }

We can see the box model in action with our card component:

    .card {
      display: flex;
      flex-direction: column;
      gap: var(--spacing);
      background: white;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05), 0 10px 25px rgba(0, 0, 0, 0.1);
      overflow: hidden;
      transition: all var(--transition-duration) cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
    }

    .card__content {
      padding: 0 var(--spacing);
    }

    .card__footer {
      padding: 0 var(--spacing);
      padding-bottom: var(--spacing);
    }

## Typography

Our portfolio sets up a consistent typography system:

    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      line-height: 1.6;
      color: var(--text-color);
    }

    .header__title {
      font-size: clamp(2.5rem, 5vw, 4rem);
      font-weight: 700;
      margin-bottom: var(--spacing);
      letter-spacing: -0.02em;
      max-width: 600px;
      line-height: 1;
    }

    .header__description {
      font-size: 1.25rem;
      max-width: 600px;
      opacity: 0.9;
      line-height: 1.7;
      text-wrap: balance;
    }

Note the use of:
- System font stack for optimal performance
- `clamp()` for responsive font sizing
- `line-height` for readability
- `letter-spacing` for visual refinement
- `text-wrap: balance` for better text wrapping

## Colors and Shadows

Our portfolio uses a consistent color scheme defined with variables:

    :root {
      --primary-color: #1f1f1f;
      --secondary-color: #718096;
      --accent-color: #667eea;
      --border-color: #e2e8f0;
      --text-color: #2d3748;
    }

And applies them throughout:

    .btn--primary {
      background: var(--primary-color);
      color: #fff;
    }

    .card {
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05), 0 10px 25px rgba(0, 0, 0, 0.1);
    }

    .card:hover {
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1), 0 20px 40px rgba(0, 0, 0, 0.15);
    }

## Exercise: Modify the Color Scheme

Take 10 minutes to:
1. Identify all the places where color variables are used
2. Create a new color scheme by changing the variable values
3. Consider how you might implement a dark mode using CSS variables

## Next Hour

In the next hour, we'll explore CSS layout techniques including Flexbox and Grid, and how they're used to create the responsive design of our portfolio.
