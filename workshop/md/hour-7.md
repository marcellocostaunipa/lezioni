# Hour 7: JavaScript Events & Interactive Elements

## Introduction to JavaScript Events

Events are actions or occurrences that happen in the browser, which the browser tells you about so you can respond to them. In this hour, we'll dive deeper into how our portfolio uses events to create interactive elements.

## The Event-Driven Programming Model

JavaScript in the browser uses an event-driven programming model. Instead of executing code sequentially from top to bottom, the code responds to events as they occur. Our portfolio follows this model:

\`\`\`javascript
function setupEventListeners() {
  // Add click listeners to all sketch buttons
  const sketchButtons = document.querySelectorAll("[data-sketch]")
  for (let i = 0; i < sketchButtons.length; i++) {
    sketchButtons[i].addEventListener("click", handleSketchButtonClick);
  }

  // Close modal when close button is clicked
  closeButton.addEventListener("click", closeModal)

  // Close modal when clicking outside of it
  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeModal()
    }
  })

  // Handle keyboard navigation
  document.addEventListener("keydown", handleKeyboardInput)
}
\`\`\`

This code sets up event listeners that wait for specific events to occur, then execute the corresponding handler functions.

## Event Types in Detail

Let's explore the different types of events used in our portfolio:

### Mouse Events

\`\`\`javascript
sketchButtons[i].addEventListener("click", handleSketchButtonClick);
closeButton.addEventListener("click", closeModal)
modal.addEventListener("click", (event) => { /* ... */ })
\`\`\`

Mouse events include:
- `click`: Fires when an element is clicked
- `mousedown`: Fires when a mouse button is pressed down
- `mouseup`: Fires when a mouse button is released
- `mousemove`: Fires when the mouse moves
- `mouseover`: Fires when the mouse enters an element
- `mouseout`: Fires when the mouse leaves an element

Our portfolio primarily uses the `click` event.

### Keyboard Events

\`\`\`javascript
document.addEventListener("keydown", handleKeyboardInput)

function handleKeyboardInput(event) {
  // Close modal when Escape key is pressed
  if (event.key === "Escape" && modal.open) {
    closeModal()
  }
}
\`\`\`

Keyboard events include:
- `keydown`: Fires when a key is pressed down
- `keyup`: Fires when a key is released
- `keypress`: Fires when a key that produces a character is pressed

Our portfolio uses the `keydown` event to detect when the Escape key is pressed.

### Document Events

\`\`\`javascript
document.addEventListener("DOMContentLoaded", () => {
  // Initialize the main application
  initializeApp()
  console.log("All systems ready! 🚀")
})
\`\`\`

Document events include:
- `DOMContentLoaded`: Fires when the HTML document has been completely loaded and parsed
- `load`: Fires when the entire page has loaded, including all dependent resources

Our portfolio uses the `DOMContentLoaded` event to initialize the application once the DOM is ready.

## Event Propagation

Events in the DOM propagate in two phases:
1. **Capturing phase**: From the document root down to the target element
2. **Bubbling phase**: From the target element back up to the document root

Our portfolio uses event bubbling for the modal:

\`\`\`javascript
modal.addEventListener("click", (event) => {
  if (event.target === modal) {
    closeModal()
  }
})
\`\`\`

When a user clicks on the modal background (but not its contents), the click event bubbles up to the modal element. We check if the target of the event is the modal itself, and if so, close the modal.

## Event Handlers vs. Event Listeners

There are two main ways to attach event handlers:

### Event Handler Properties

\`\`\`javascript
element.onclick = function() { /* ... */ }
\`\`\`

This approach assigns a function to a specific event property of an element. It's simple but limited because you can only assign one handler per event.

### Event Listeners

\`\`\`javascript
element.addEventListener("click", function() { /* ... */ })
\`\`\`

This approach adds a function to the element's list of event listeners. It's more flexible because you can add multiple listeners for the same event.

Our portfolio uses the event listener approach:

\`\`\`javascript
sketchButtons[i].addEventListener("click", handleSketchButtonClick);
closeButton.addEventListener("click", closeModal)
document.addEventListener("keydown", handleKeyboardInput)
\`\`\`

## Creating Interactive Elements

Our portfolio creates several interactive elements using JavaScript events:

### Interactive Cards

\`\`\`javascript
function handleSketchButtonClick(event) {
  // Get the sketch ID from the button's data attribute
  const sketchId = event.currentTarget.getAttribute("data-sketch")

  // Get the card title for the modal
  const card = event.currentTarget.closest(".card")
  const cardTitle = card.querySelector(".card__title").textContent

  // Open the modal with this sketch
  openModal(sketchId, cardTitle)
}
\`\`\`

When a user clicks a card button:
1. We get the sketch ID from the button's data attribute
2. We find the card title from the DOM
3. We open the modal with the sketch and title

### Interactive Modal

\`\`\`javascript
function openModal(sketchId, title) {
  // Set the modal title
  modalTitle.textContent = title

  // Load the appropriate sketch
  loadSketch(sketchId)

  // Show the modal
  modal.showModal()

  // Prevent body scroll when modal is open
  document.body.style.overflow = "hidden"
}

function closeModal() {
  // Close the modal
  modal.close()

  // Clean up the current sketch
  cleanupSketch()

  // Restore body scroll
  document.body.style.overflow = ""
}
\`\`\`

The modal can be:
- Opened by clicking a card button
- Closed by clicking the close button
- Closed by clicking outside the modal
- Closed by pressing the Escape key

### Keyboard Navigation

\`\`\`javascript
function handleKeyboardInput(event) {
  // Close modal when Escape key is pressed
  if (event.key === "Escape" && modal.open) {
    closeModal()
  }
}
\`\`\`

This allows users to close the modal by pressing the Escape key, improving accessibility and user experience.

## Dynamic Content Loading

Our portfolio dynamically loads content based on user interaction:

\`\`\`javascript
function loadSketch(sketchId) {
  // Clean up any existing sketch first
  cleanupSketch()

  // Load the appropriate sketch based on ID
  switch (sketchId) {
    case "particle-system":
      currentSketch = new p5(createParticleSystemSketch(), sketchContainer)
      break
    case "fractal-tree":
      currentSketch = new p5(createFractalTreeSketch(), sketchContainer)
      break
    // More cases...
    default:
      showSketchNotFound()
  }
}
\`\`\`

When a user clicks a card button:
1. We clean up any existing sketch
2. We load the appropriate sketch based on the ID
3. If the sketch doesn't exist, we show a "not found" message

## Error Handling

Our portfolio includes basic error handling for sketches that don't exist:

\`\`\`javascript
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
\`\`\`

This provides a user-friendly message when a sketch can't be loaded.

## Resource Management

Our portfolio manages resources efficiently by cleaning up sketches when they're no longer needed:

\`\`\`javascript
function cleanupSketch() {
  // Remove the current p5 sketch if it exists
  if (currentSketch) {
    currentSketch.remove()
    currentSketch = null
  }

  // Clear the container
  sketchContainer.innerHTML = ""
}
\`\`\`

This prevents memory leaks and ensures smooth performance.

## User Experience Enhancements

Our portfolio includes several user experience enhancements:

### Preventing Body Scroll

\`\`\`javascript
// Prevent body scroll when modal is open
document.body.style.overflow = "hidden"

// Restore body scroll
document.body.style.overflow = ""
\`\`\`

This prevents the page from scrolling behind the modal, which can be disorienting.

### Visual Feedback

Our portfolio uses CSS transitions and transforms to provide visual feedback for interactions:

\`\`\`css
.card {
  transition: all var(--transition-duration) cubic-bezier(0.4, 0, 0.2, 1);
}

.card:hover {
  transform: translateY(-8px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1), 0 20px 40px rgba(0, 0, 0, 0.15);
}
\`\`\`

This creates a subtle "lifting" effect when users hover over cards.

## Accessibility Considerations

Our portfolio includes several accessibility enhancements:

### Keyboard Navigation

\`\`\`javascript
document.addEventListener("keydown", handleKeyboardInput)
\`\`\`

This allows users to navigate the site using the keyboard.

### ARIA Attributes

\`\`\`html
<button class="modal__close" id="close-modal" aria-label="Close modal">
\`\`\`

The `aria-label` attribute provides a text alternative for screen readers.

### Focus Management

\`\`\`css
.btn:focus-visible,
.modal__close:focus-visible {
  outline: 2px solid var(--accent-color);
  outline-offset: 6px;
}
\`\`\`

This provides a visible focus indicator for keyboard navigation.

## Exercise: Enhancing Interactivity

Take 15 minutes to:
1. Identify all the interactive elements in our portfolio
2. Trace the flow of events when a user interacts with these elements
3. Consider how you might add a new interactive feature, such as:
   - A filter system for sketches
   - A "favorite" button for sketches
   - A fullscreen mode for the modal

## Next Hour

In the final hour, we'll explore how HTML, CSS, and JavaScript work together to build complete web applications, and discuss best practices for web development.
