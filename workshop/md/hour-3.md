# Hour 3: CSS Layout & Responsive Design

## Introduction to CSS Layout

Modern CSS offers powerful layout systems that make it easier to create complex, responsive designs. In this hour, we'll explore how our portfolio uses Flexbox and CSS Grid for layout, and how it implements responsive design principles.

## The Container Pattern

Our portfolio uses a container pattern to create a centered, width-constrained layout:

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 var(--spacing);
    }

This pattern:
- Sets a maximum width (`max-width: 1200px`)
- Centers the container horizontally (`margin: 0 auto`)
- Adds horizontal padding for breathing room (`padding: 0 var(--spacing)`)

We use this container throughout our HTML:

    <header class="header">
      <div class="container">
        <!-- Header content -->
      </div>
    </header>

    <main class="main">
      <div class="container">
        <!-- Main content -->
      </div>
    </main>

    <footer class="footer">
      <div class="container">
        <!-- Footer content -->
      </div>
    </footer>

## Flexbox Layout

Flexbox is a one-dimensional layout method designed for laying out items in rows or columns. Our portfolio uses Flexbox extensively:

### Card Component with Flexbox

    .card {
      display: flex;
      flex-direction: column;
      gap: var(--spacing);
    }

    .card__footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: auto;
    }

This creates a card where:
- Content flows vertically (`flex-direction: column`)
- There's consistent spacing between elements (`gap: var(--spacing)`)
- The footer is pushed to the bottom with `margin-top: auto`
- Footer items are aligned vertically center and spaced horizontally

### Button Component with Flexbox

    .btn {
      display: inline-flex;
      align-items: center;
      gap: calc(var(--spacing) / 2);
    }

This creates a button where:
- Text and icon are aligned vertically center
- There's consistent spacing between text and icon

### Modal Header with Flexbox

    .modal__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

This creates a header where:
- Title and close button are aligned vertically center
- Title is on the left, close button on the right

## CSS Grid Layout

CSS Grid is a two-dimensional layout system designed for laying out items in rows and columns. Our portfolio uses Grid for the portfolio card layout:

    .portfolio__grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: var(--spacing);
      margin-bottom: calc(var(--spacing)*2);
    }

This creates a responsive grid where:
- Columns automatically fit as many 350px-minimum-width items as possible
- Each column takes up an equal fraction of available space (`1fr`)
- There's consistent spacing between grid items (`gap: var(--spacing)`)
- The grid has bottom margin for spacing from the next section

The `repeat(auto-fit, minmax(350px, 1fr))` is particularly powerful:
- `auto-fit`: Fit as many columns as possible
- `minmax(350px, 1fr)`: Each column is at least 350px wide, but can grow to fill available space

## Responsive Design

Our portfolio implements responsive design to ensure it looks good on all devices. Let's examine the techniques used:

### Viewport Meta Tag

    <meta name="viewport" content="width=device-width, initial-scale=1.0">

This tag ensures the page is rendered at the device's width with a 1:1 scale.

### Fluid Typography

    .header__title {
      font-size: clamp(2.5rem, 5vw, 4rem);
    }

The `clamp()` function creates responsive typography that:
- Has a minimum size of 2.5rem
- Scales based on viewport width (5vw)
- Has a maximum size of 4rem

### Responsive Images

    img {
      max-width: 100%;
      height: auto;
      display: block;
    }

This ensures images never overflow their containers and maintain their aspect ratio.

### Media Queries

Our portfolio uses media queries to adjust layouts for different screen sizes:

    @media (max-width: 768px) {
      .header {
        padding: calc(var(--spacing) * 1.5) 0;
      }

      .header__title {
        font-size: 2.5rem;
      }

      .header__description {
        font-size: 1.125rem;
      }

      .portfolio__grid {
        grid-template-columns: 1fr;
        gap: calc(var(--spacing) / 2);
      }

      .modal {
        width: 95vw;
        height: 95vh;
      }

      .modal__header {
        padding: calc(var(--spacing) / 2);
      }

      .modal__body {
        padding: 0;
      }
    }

    @media (max-width: 480px) {
      .container {
        padding: 0 calc(var(--spacing) / 2);
      }

      .card__content {
        padding: calc(var(--spacing) / 2);
      }

      .btn {
        padding: 0.625rem 1.25rem;
        font-size: 0.875rem;
      }
    }

These media queries:
- Adjust spacing and font sizes for smaller screens
- Change the grid to a single column on tablets
- Reduce padding and button size on mobile devices

### Responsive Grid

The portfolio grid automatically adjusts based on screen width:

    .portfolio__grid {
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    }

    @media (max-width: 768px) {
      .portfolio__grid {
        grid-template-columns: 1fr;
      }
    }

On larger screens, it shows multiple columns. On smaller screens, it switches to a single column.

## Aspect Ratio for Consistent Card Images

Our portfolio maintains consistent image proportions using aspect ratio:

    .card__preview {
      position: relative;
      overflow: hidden;
      aspect-ratio: 3 / 2;
    }

    .card__image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

This ensures all card images have a 3:2 aspect ratio, regardless of the original image dimensions.

## Responsive Modal

The modal adapts to different screen sizes:

    .modal {
      width: 90vw;
      height: 90vh;
    }

    @media (max-width: 768px) {
      .modal {
        width: 95vw;
        height: 95vh;
      }

      .modal__header {
        padding: calc(var(--spacing) / 2);
      }

      .modal__body {
        padding: 0;
      }
    }

On smaller screens, the modal takes up more screen space and reduces padding.

## Accessibility in Responsive Design

Our portfolio includes accessibility considerations for responsive design:

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

This media query respects the user's preference for reduced motion, which is important for users who experience motion sickness or have vestibular disorders.

## Exercise: Responsive Design Analysis

Take 10 minutes to:
1. Identify all the responsive design techniques used in the portfolio
2. Consider how the layout would change at different screen sizes
3. Think about how you might improve the responsive design

## Next Hour

In the next hour, we'll explore advanced CSS techniques including transitions, animations, and other visual effects used in our portfolio.
