# Hour 8: Building Complete Web Applications

## Introduction to Web Application Architecture

In this final hour, we'll explore how HTML, CSS, and JavaScript work together to create complete web applications. We'll use our portfolio project as a case study to understand the principles of web application architecture and best practices.

## The Three Pillars of Web Development

Web applications are built on three core technologies:

1. **HTML**: Structure and content
2. **CSS**: Presentation and styling
3. **JavaScript**: Behavior and interactivity

Our portfolio demonstrates how these technologies work together:

    <!-- HTML: Structure and content -->
    <article class="card">
      <div class="card__preview">
        <img src="/img/sketch-01.png" alt="Particle System Animation" class="card__image">
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

    /* CSS: Presentation and styling */
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

    .card:hover {
      transform: translateY(-8px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1), 0 20px 40px rgba(0, 0, 0, 0.15);
    }

    // JavaScript: Behavior and interactivity
    function handleSketchButtonClick(event) {
      const sketchId = event.currentTarget.getAttribute("data-sketch")
      const card = event.currentTarget.closest(".card")
      const cardTitle = card.querySelector(".card__title").textContent
      openModal(sketchId, cardTitle)
    }

## Separation of Concerns

Our portfolio follows the principle of separation of concerns:

1. **HTML**: Focuses on structure and semantics
2. **CSS**: Handles all visual styling
3. **JavaScript**: Manages interactivity and behavior

This separation makes the code:
- More maintainable
- Easier to debug
- More accessible
- More reusable

## Progressive Enhancement

Progressive enhancement is a strategy that emphasizes core content and functionality first, then enhances with advanced features for modern browsers. Our portfolio follows this approach:

1. **Base Layer (HTML)**: The content is accessible even without CSS or JavaScript
2. **Presentation Layer (CSS)**: Styling enhances the visual experience
3. **Behavior Layer (JavaScript)**: Interactivity adds dynamic features

For example, our portfolio cards are still accessible and contain all necessary information even if JavaScript fails to load. The modal functionality is an enhancement, not a requirement.

## Component-Based Architecture

Our portfolio uses a component-based approach to structure the UI:

    - Header Component
    - Portfolio Grid Component
      - Card Component (repeated)
    - Footer Component
    - Modal Component

Each component:
- Has a specific purpose
- Can be developed and tested independently
- Can be reused throughout the application

This approach is reflected in our CSS organization:

    /* ==========================================================================
       HEADER COMPONENT
       ========================================================================== */

    /* ==========================================================================
       CARD COMPONENT
       ========================================================================== */

    /* ==========================================================================
       BUTTON COMPONENT
       ========================================================================== */

    /* ==========================================================================
       MODAL COMPONENT
       ========================================================================== */

    /* ==========================================================================
       FOOTER COMOPONENT
       ========================================================================== */

## State Management

Web applications need to manage state—the data that changes over time. Our portfolio manages several states:

1. **UI State**: Is the modal open or closed?
2. **Application State**: Which sketch is currently active?

    // Modal state
    modal.showModal() // Open state
    modal.close()     // Closed state

    // Active sketch state
    currentSketch = new p5(createParticleSystemSketch(), sketchContainer)

## Event-Driven Architecture

Our portfolio uses an event-driven architecture where:
1. User actions trigger events
2. Event listeners detect these events
3. Handler functions respond to the events
4. The UI updates accordingly

    // 1. Set up event listeners
    sketchButtons[i].addEventListener("click", handleSketchButtonClick)

    // 2. Define handler functions
    function handleSketchButtonClick(event) {
      // 3. Extract data from the event
      const sketchId = event.currentTarget.getAttribute("data-sketch")
      
      // 4. Update the UI
      openModal(sketchId, cardTitle)
    }

## Performance Optimization

Our portfolio includes several performance optimizations:

### Efficient DOM Manipulation

    // Clean up before adding new content
    function cleanupSketch() {
      if (currentSketch) {
        currentSketch.remove()
        currentSketch = null
      }
      sketchContainer.innerHTML = ""
    }

    // Batch DOM operations
    function showSketchNotFound() {
      sketchContainer.innerHTML = `
        <div style="color: white; text-align: center; font-size: 1.5rem;">
          <p>Sketch not found</p>
          <p style="font-size: 1rem; opacity: 0.7; margin-top: 1rem;">
            This sketch is still in development
          </p>
        </div>
      `
    }

### Optimized Assets

    // Images are optimized and appropriately sized
    <img src="/img/sketch-01.png" alt="Particle System Animation" class="card__image">

    // CSS is organized by component
    .card { /* ... */ }
    .card__preview { /* ... */ }
    .card__image { /* ... */ }

### Event Delegation

    // Single event listener for modal background clicks
    modal.addEventListener("click", (event) => {
      if (event.target === modal) {
        closeModal()
      }
    })

## Accessibility

Our portfolio implements several accessibility features:

### Semantic HTML

    <header>, <main>, <footer>, <article>, <section>, <dialog>

### ARIA Attributes

    <button class="modal__close" id="close-modal" aria-label="Close modal">

### Keyboard Navigation
