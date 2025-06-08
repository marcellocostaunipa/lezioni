# Hour 1: Introduction to Web Standards & HTML Basics

## Workshop Overview

Welcome to our 8-hour workshop on web standards! Throughout this workshop, we'll explore HTML, CSS, and JavaScript using a real-world example: a creative coding portfolio website. By the end of these 8 hours, you'll understand how these three technologies work together to create interactive web experiences.

## What are Web Standards?

Web standards are the formal, published specifications that define how web technologies should work. They ensure:

- **Consistency**: Websites work the same across different browsers
- **Accessibility**: Content is available to all users, including those with disabilities
- **Compatibility**: New technologies remain backward compatible
- **Interoperability**: Different technologies can work together seamlessly

The three core web standards we'll focus on are:

1. **HTML**: Structure and content
2. **CSS**: Presentation and styling
3. **JavaScript**: Behavior and interactivity

## HTML Basics

HTML (HyperText Markup Language) is the backbone of any webpage. It defines the structure and content of web pages using elements and attributes.

### HTML Document Structure

Let's look at the basic structure of our portfolio website's HTML:

    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Creative Coding Portfolio</title>
        <link rel="stylesheet" href="css/styles.css">
        <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.7.0/p5.min.js"></script>
    </head>
    <body>
        <!-- Content goes here -->
        <script src="js/script.js"></script>
    </body>
    </html>

Let's break down each part:

- `<!DOCTYPE html>`: Declares the document type and version of HTML
- `<html lang="en">`: The root element with a language attribute
- `<head>`: Contains meta-information about the document
  - `<meta charset="UTF-8">`: Specifies character encoding
  - `<meta name="viewport"...>`: Controls viewport behavior on mobile devices
  - `<title>`: Sets the page title shown in browser tabs
  - `<link>`: Links to external resources (our CSS file)
  - `<script>`: Links to external JavaScript libraries
- `<body>`: Contains all visible content
  - Final `<script>`: Links to our JavaScript file at the end of the body

### Semantic HTML Elements

Semantic HTML uses elements that clearly describe their meaning to browsers, developers, and assistive technologies. Our portfolio uses several semantic elements:

    <header class="header">
        <!-- Header content -->
    </header>

    <main class="main">
        <!-- Main content -->
        <section class="portfolio">
            <h2 class="portfolio__title">My Sketches</h2>
            <!-- Portfolio content -->
        </section>
    </main>

    <footer class="footer">
        <!-- Footer content -->
    </footer>

These semantic elements (`<header>`, `<main>`, `<section>`, `<footer>`) provide structure and meaning to our document.

### HTML Elements in Our Portfolio

Let's examine some key HTML elements used in our portfolio:

#### Article Elements for Cards

    <article class="card">
        <div class="card__preview">
            <img src="/img/sketch-01.png" 
                 alt="Particle System Animation" 
                 class="card__image">
        </div>
        <div class="card__content">
            <h3 class="card__title">Particle System</h3>
            <p class="card__description">Interactive particle system with physics simulation</p>
        </div>
        <div class="card__footer">
            <button class="btn btn--primary" data-sketch="particle-system">
                <svg class="btn__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M7 17L17 7M17 7H7M17 7V17"></path>
                </svg>
            </button>
        </div>
    </article>

This card uses:
- `<article>`: A self-contained composition
- `<img>`: Image element with `src` and `alt` attributes
- `<h3>`: Heading element for the card title
- `<p>`: Paragraph element for the description
- `<button>`: Interactive button element with a custom data attribute
- `<svg>`: Inline SVG for the icon

#### Dialog Element for Modal

    <dialog class="modal" id="sketch-modal">
        <div class="modal__content">
            <header class="modal__header">
                <h2 class="modal__title" id="modal-title">Sketch Title</h2>
                <button class="modal__close" id="close-modal" aria-label="Close modal">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </header>
            <div class="modal__body">
                <div class="modal__sketch-container" id="sketch-container">
                    <!-- p5.js sketch will be inserted here -->
                </div>
            </div>
        </div>
    </dialog>

This modal uses:
- `<dialog>`: HTML5 dialog element for modal functionality
- `aria-label`: Accessibility attribute for screen readers
- `id` attributes: For JavaScript targeting

## HTML Best Practices

From our portfolio example, we can identify several HTML best practices:

1. **Use semantic HTML**: Elements like `<header>`, `<main>`, `<article>`, and `<footer>` provide meaning
2. **Include alt text for images**: All images have descriptive alt text
3. **Use appropriate heading hierarchy**: H1 for page title, H2 for sections, H3 for cards
4. **Add accessibility attributes**: Like `aria-label` on the close button
5. **Keep structure clean and organized**: Clear nesting and indentation
6. **Separate content from presentation**: HTML for structure, CSS for styling
7. **Use modern HTML5 elements**: Like `<dialog>` for modals

## Exercise: Analyze the HTML Structure

Take 10 minutes to review the complete HTML file and identify:
1. All semantic HTML elements used
2. How the content is structured hierarchically
3. Where custom data attributes are used and why
4. How accessibility is addressed in the markup

## Next Hour

In the next hour, we'll dive into CSS fundamentals and explore how the styling is applied to our portfolio website.

