# Hour 6: DOM Manipulation with JavaScript

## Introduction to DOM Manipulation

The Document Object Model (DOM) is a programming interface for web documents. It represents the page as nodes and objects that JavaScript can interact with. In this hour, we'll explore how our portfolio uses JavaScript to manipulate the DOM and create interactive experiences.

## The DOM Tree

The DOM represents an HTML document as a tree structure where each node is an object representing a part of the document. Our portfolio's JavaScript interacts with various parts of this tree:

    // Selecting elements from the DOM
    modal = document.getElementById("sketch-modal")
    modalTitle = document.getElementById("modal-title")
    sketchContainer = document.getElementById("sketch-container")
    closeButton = document.getElementById("close-modal")

## Selecting DOM Elements

JavaScript provides several methods to select elements from the DOM. Our portfolio uses:

### getElementById

    modal = document.getElementById("sketch-modal")

This selects a single element with the specified ID.

### querySelectorAll

    const sketchButtons = document.querySelectorAll("[data-sketch]")

This selects all elements that match the CSS selector (in this case, elements with a `data-sketch` attribute).

### DOM Traversal

    const card = event.currentTarget.closest(".card")
    const cardTitle = card.querySelector(".card__title").textContent

This uses:
- `closest()`: Finds the nearest ancestor that matches the selector
- `querySelector()`: Finds the first descendant that matches the selector

## Modifying DOM Elements

Once we've selected elements, we can modify them in various ways:

### Changing Text Content

    modalTitle.textContent = title

This changes the text content of the modal title element.

### Changing HTML Content

    sketchContainer.innerHTML = ""

This clears the HTML content of the sketch container.

    sketchContainer.innerHTML = `
      <div style="color: white; text-align: center; font-size: 1.5rem;">
        <p>Sketch not found</p>
        <p style="font-size: 1rem; opacity: 0.7; margin-top: 1rem;">
          This sketch is still in development
        </p>
      </div>
    `

This sets new HTML content for the sketch container.

### Changing Styles

    document.body.style.overflow = "hidden"

This changes the CSS `overflow` property of the body element.

    document.body.style.overflow = ""

This resets the CSS `overflow` property to its default value.

## Working with Attributes

Attributes provide additional information about HTML elements. Our portfolio works with attributes in several ways:

### Getting Attribute Values

    const sketchId = event.currentTarget.getAttribute("data-sketch")

This gets the value of the `data-sketch` attribute from the clicked element.

### Custom Data Attributes

Our portfolio uses custom `data-*` attributes to store information:

    <button class="btn btn--primary" data-sketch="particle-system">

This button has a custom `data-sketch` attribute that identifies which sketch to load.

    const sketchId = event.currentTarget.getAttribute("data-sketch")

We retrieve this value when the button is clicked.

## Creating and Managing DOM Elements

JavaScript can create, modify, and remove DOM elements dynamically. Our portfolio creates p5.js sketch instances:

    currentSketch = new p5(createParticleSystemSketch(), sketchContainer)

This creates a new p5.js sketch and attaches it to the sketch container.

### Cleaning Up Elements

    function cleanupSketch() {
      // Remove the current p5 sketch if it exists
      if (currentSketch) {
        currentSketch.remove()
        currentSketch = null
      }

      // Clear the container
      sketchContainer.innerHTML = ""
    }

This function:
- Removes the current p5.js sketch instance
- Clears the sketch container's HTML content

## Working with Dialog Elements

Our portfolio uses the HTML `<dialog>` element for modals. JavaScript can control this element:

### Opening a Dialog

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

This function:
- Sets the modal title
- Loads the appropriate sketch
- Opens the modal using the `showModal()` method
- Prevents scrolling of the body

### Closing a Dialog

    function closeModal() {
      // Close the modal
      modal.close()

      // Clean up the current sketch
      cleanupSketch()

      // Restore body scroll
      document.body.style.overflow = ""
    }

This function:
- Closes the modal using the `close()` method
- Cleans up the current sketch
- Restores scrolling of the body

## Event Delegation

Event delegation is a technique where you attach a single event listener to a parent element instead of multiple listeners on individual child elements. Our portfolio uses this technique for the modal:

    modal.addEventListener("click", (event) => {
      if (event.target === modal) {
        closeModal()
      }
    })

This attaches a single click event listener to the modal element. When a click occurs, it checks if the clicked element (`event.target`) is the modal itself. If so, it closes the modal.

This allows clicks on the modal background (but not its contents) to close the modal.

## DOM Events in Detail

Let's explore the events used in our portfolio in more detail:

### Click Events

    sketchButtons[i].addEventListener("click", handleSketchButtonClick)
    closeButton.addEventListener("click", closeModal)

Click events fire when an element is clicked. Our portfolio uses them to:
- Open the modal when a sketch button is clicked
- Close the modal when the close button is clicked

### Keyboard Events

    document.addEventListener("keydown", handleKeyboardInput)

    function handleKeyboardInput(event) {
      // Close modal when Escape key is pressed
      if (event.key === "Escape" && modal.open) {
        closeModal()
      }
    }

Keyboard events fire when a key is pressed. Our portfolio uses them to:
- Close the modal when the Escape key is pressed

### DOMContentLoaded Event

    document.addEventListener("DOMContentLoaded", () => {
      // Initialize the main application
      initializeApp()
      console.log("All systems ready! 🚀")
    })

The DOMContentLoaded event fires when the initial HTML document has been completely loaded and parsed. Our portfolio uses it to:
- Initialize the application once the DOM is ready

## The Event Object

When an event occurs, JavaScript passes an event object to the event handler. This object contains information about the event. Our portfolio uses several properties of the event object:

### event.currentTarget

    const sketchId = event.currentTarget.getAttribute("data-sketch")

`event.currentTarget` refers to the element that the event listener is attached to.

### event.target

    if (event.target === modal) {
      closeModal()
    }

`event.target` refers to the element that triggered the event (the element that was actually clicked).

### event.key

    if (event.key === "Escape" && modal.open) {
      closeModal()
    }

`event.key` contains the value of the key that was pressed in a keyboard event.

## DOM Properties and Methods

Our portfolio uses various DOM properties and methods:

### Element Properties

    if (modal.open) {
      // Modal is open
    }

`open` is a property of the dialog element that indicates whether it's open.

### Element Methods

    modal.showModal()
    modal.close()

`showModal()` and `close()` are methods of the dialog element that open and close it.

    currentSketch.remove()

`remove()` is a method that removes an element from the DOM.

## Exercise: DOM Manipulation

Take 15 minutes to:
1. Identify all the different ways the DOM is manipulated in our portfolio
2. Trace the flow of DOM changes when a user opens and closes a modal
3. Consider how you might add a new feature that manipulates the DOM, such as a filter for sketches by category

## Next Hour

In the next hour, we'll explore JavaScript events in more detail and how they create interactive elements in our portfolio.
