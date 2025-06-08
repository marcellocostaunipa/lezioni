# Hour 4: CSS Advanced Techniques & Animations

## Introduction to Advanced CSS

Modern CSS offers powerful features for creating engaging user experiences beyond basic styling. In this hour, we'll explore transitions, transforms, animations, and other advanced CSS techniques used in our portfolio.

## CSS Transitions

Transitions allow elements to change values over a specified duration. Our portfolio uses transitions for smooth interactive effects:

\`\`\`css
.card {
  transition: all var(--transition-duration) cubic-bezier(0.4, 0, 0.2, 1);
}

.card:hover {
  transform: translateY(-8px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1), 0 20px 40px rgba(0, 0, 0, 0.15);
}
\`\`\`

This transition:
- Applies to all changing properties (`all`)
- Uses a custom duration variable (`var(--transition-duration)`)
- Uses a custom easing function (`cubic-bezier(0.4, 0, 0.2, 1)`)

When the user hovers over a card, it smoothly animates upward and changes its shadow.

### Image Hover Effect

\`\`\`css
.card__image {
  transition: transform var(--transition-duration) ease;
}

.card:hover .card__image {
  transform: scale(1.05);
}
\`\`\`

This creates a subtle zoom effect on the card image when the user hovers over the card.

### Button Icon Transition

\`\`\`css
.btn__icon {
  transition: transform 0.2s ease;
}

.btn:hover .btn__icon {
  transform: translateX(2px);
}
\`\`\`

This animates the button icon slightly to the right when the user hovers over the button.

## CSS Transforms

Transforms allow you to modify elements in 2D or 3D space. Our portfolio uses transforms for various effects:

### Card Hover Effect

\`\`\`css
.card:hover {
  transform: translateY(-8px);
}
\`\`\`

This moves the card 8 pixels upward when hovered.

### Button Icon Movement

\`\`\`css
.btn:hover .btn__icon {
  transform: translateX(2px);
}
\`\`\`

This moves the icon 2 pixels to the right when the button is hovered.

## CSS Animations

Animations allow you to create more complex, multi-step animations. Our portfolio uses a fade-in animation for cards:

\`\`\`css
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.card {
  animation: fadeIn 0.6s ease forwards;
}
\`\`\`

This animation:
- Defines keyframes from invisible and offset to fully visible and in position
- Applies the animation to all cards with a duration of 0.6 seconds
- Uses the `forwards` fill mode to maintain the final state

## Box Shadow Effects

Our portfolio uses box shadows to create depth and elevation:

\`\`\`css
.card {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05), 0 10px 25px rgba(0, 0, 0, 0.1);
}

.card:hover {
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1), 0 20px 40px rgba(0, 0, 0, 0.15);
}
\`\`\`

This creates:
- A subtle shadow for cards in their default state
- A more pronounced shadow when cards are hovered
- Combined with the transform, this creates a "lifting" effect

## Backdrop Filter

Our portfolio uses the modern `backdrop-filter` property for the modal backdrop:

\`\`\`css
.modal::backdrop {
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(4px);
}
\`\`\`

This creates a semi-transparent black background with a blur effect, giving the modal a modern, frosted-glass appearance.

## CSS Functions

Our portfolio uses various CSS functions for dynamic values:

### calc() Function

\`\`\`css
.card__title {
  margin-bottom: calc(var(--spacing) / 2);
}

.portfolio__grid {
  margin-bottom: calc(var(--spacing)*2);
}
\`\`\`

The `calc()` function performs calculations to determine CSS values, allowing for more dynamic layouts.

### clamp() Function

\`\`\`css
.header__title {
  font-size: clamp(2.5rem, 5vw, 4rem);
}
\`\`\`

The `clamp()` function sets a value between a minimum and maximum, with a preferred value in between.

## Pseudo-elements

Our portfolio uses pseudo-elements for additional styling without extra HTML:

\`\`\`css
.modal::backdrop {
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(4px);
}
\`\`\`

The `::backdrop` pseudo-element styles the background behind a modal dialog.

## Focus Styles for Accessibility

Our portfolio includes custom focus styles for keyboard navigation:

\`\`\`css
.btn:focus-visible,
.modal__close:focus-visible {
  outline: 2px solid var(--accent-color);
  outline-offset: 6px;
}
\`\`\`

This creates a visible outline when interactive elements are focused using the keyboard, which is essential for accessibility.

## Reduced Motion Preferences

Our portfolio respects user preferences for reduced motion:

\`\`\`css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }

  html {
    scroll-behavior: auto;
  }
}
\`\`\`

This media query disables animations and transitions for users who have indicated a preference for reduced motion in their operating system settings.

## Object-fit for Images

Our portfolio uses `object-fit` to control how images fill their containers:

\`\`\`css
.card__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
\`\`\`

This ensures images cover their container while maintaining their aspect ratio, preventing distortion.

## Aspect Ratio

Our portfolio uses the modern `aspect-ratio` property to maintain consistent image proportions:

\`\`\`css
.card__preview {
  aspect-ratio: 3 / 2;
}
\`\`\`

This ensures all card images have a 3:2 aspect ratio, regardless of their content.

## CSS Custom Properties for Dynamic Values

Our portfolio uses CSS custom properties not just for colors, but for spacing and other values:

\`\`\`css
:root {
  --spacing: 1.5rem;
  --transition-duration: 0.3s;
  --border-radius: 8px;
}

.card {
  gap: var(--spacing);
}

.btn {
  border-radius: var(--border-radius);
}
\`\`\`

This creates a consistent design system that's easy to maintain and update.

## Exercise: Enhance the Portfolio with Advanced CSS

Take 15 minutes to:
1. Add a new animation or transition to an element in the portfolio
2. Experiment with different transform effects
3. Try modifying the box shadow values to create different elevation effects
4. Consider how you might implement a dark/light theme toggle using CSS variables

## Next Hour

In the next hour, we'll shift our focus to JavaScript fundamentals and begin exploring how JavaScript adds interactivity to our portfolio.
