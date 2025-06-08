# Hour 5: JavaScript Fundamentals

## Introduction to JavaScript

JavaScript is the programming language of the web that allows us to create dynamic, interactive experiences. In this hour, we'll explore JavaScript fundamentals using our portfolio project as a reference.

## JavaScript in the Browser Environment

JavaScript runs in the browser and interacts with the Document Object Model (DOM). Our portfolio includes JavaScript in two ways:

1. External library (p5.js):

    <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.7.0/p5.min.js"></script>

2. Our custom script:

    <script src="js/script.js"></script>

The script tag at the end of the body ensures the DOM is fully loaded before our JavaScript runs.

## JavaScript Structure and Organization

Our portfolio's JavaScript is well-organized with clear sections and comments:

    // ==========================================================================
    // GLOBAL VARIABLES - Store important elements and state
    // ==========================================================================

    // ==========================================================================
    // INITIALIZATION - Set up the application when page loads
    // ==========================================================================

    // ==========================================================================
    // EVENT LISTENERS - Handle user interactions
    // ==========================================================================

    // ==========================================================================
    // MODAL FUNCTIONS - Open and close the sketch modal
    // ==========================================================================

    // ==========================================================================
    // SKETCH MANAGEMENT - Load and cleanup p5.js sketches
    // ==========================================================================

    // ==========================================================================
    // P5.JS SKETCH CREATORS - Functions that return sketch functions
    // ==========================================================================

    // ==========================================================================
    // START THE APPLICATION - Initialize everything when DOM is ready
    // ==========================================================================

This organization:
- Groups related functionality together
- Makes the code easier to navigate
- Clarifies the purpose of each section
- Improves maintainability

## Variables and Scope

JavaScript uses variables to store and manage data. Our portfolio declares variables at the top:

    // Modal elements
    let modal = null
    let modalTitle = null
    let sketchContainer = null
    let closeButton = null

    // Current p5 sketch instance
    let currentSketch = null

We use `let` for variables that might change value. These variables are:
- Declared at the top for visibility
- Initially set to `null`
- Scoped to the entire script (global variables)

Later, we assign values to these variables:

    function initializeApp() {
      // Get references to important DOM elements
      modal = document.getElementById("sketch-modal")
      modalTitle = document.getElementById("modal-title")
      sketchContainer = document.getElementById("sketch-container")
      closeButton = document.getElementById("close-modal")

      // Set up event listeners
      setupEventListeners()
    }

## Functions

Functions are reusable blocks of code. Our portfolio uses functions extensively:

### Function Declaration

    function initializeApp() {
      // Function body
    }

    function setupEventListeners() {
      // Function body
    }

    function handleSketchButtonClick(event) {
      // Function body
    }

### Function Parameters

    function handleSketchButtonClick(event) {
      // Using the event parameter
      const sketchId = event.currentTarget.getAttribute("data-sketch")
    }

    function openModal(sketchId, title) {
      // Using multiple parameters
      modalTitle.textContent = title
      loadSketch(sketchId)
    }

### Function Return Values

    function createParticleSystemSketch() {
      return (p) => {
        // Function that creates a p5.js sketch
      }
    }

This function returns another function, demonstrating higher-order functions in JavaScript.

## DOM Manipulation

JavaScript can interact with HTML elements through the DOM API. Our portfolio uses several DOM methods:

### Selecting Elements

    modal = document.getElementById("sketch-modal")
    const sketchButtons = document.querySelectorAll("[data-sketch]")

- `getElementById`: Selects a single element by its ID
- `querySelectorAll`: Selects multiple elements matching a CSS selector

### Modifying Elements

    modalTitle.textContent = title
    sketchContainer.innerHTML = ""

- `textContent`: Changes the text content of an element
- `innerHTML`: Changes the HTML content of an element

### Element Properties and Methods

    modal.showModal()
    modal.close()

- `showModal()`: Opens the dialog element as a modal
- `close()`: Closes the dialog element

## Events and Event Handling

JavaScript uses events to respond to user interactions. Our portfolio sets up event listeners:

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

This code:
- Selects elements to attach listeners to
- Uses `addEventListener` to register event handlers
- Specifies the event type (`click`, `keydown`) and handler function

### Event Handler Functions

    function handleSketchButtonClick(event) {
      // Get the sketch ID from the button's data attribute
      const sketchId = event.currentTarget.getAttribute("data-sketch")

      // Get the card title for the modal
      const card = event.currentTarget.closest(".card")
      const cardTitle = card.querySelector(".card__title").textContent

      // Open the modal with this sketch
      openModal(sketchId, cardTitle)
    }

    function handleKeyboardInput(event) {
      // Close modal when Escape key is pressed
      if (event.key === "Escape" && modal.open) {
        closeModal()
      }
    }

These functions:
- Receive the event object as a parameter
- Extract information from the event
- Take appropriate actions based on the event

### Inline Arrow Functions

    modal.addEventListener("click", (event) => {
      if (event.target === modal) {
        closeModal()
      }
    })

This uses an arrow function for a simple inline event handler.

## Control Flow

JavaScript uses control flow statements to make decisions and repeat actions. Our portfolio uses several:

### Conditional Statements

    if (event.key === "Escape" && modal.open) {
      closeModal()
    }

    if (event.target === modal) {
      closeModal()
    }

    if (len > 4) {
      // Draw branches
    }

These `if` statements check conditions and execute code only when the condition is true.

### Switch Statement

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

This `switch` statement selects different code to run based on the value of `sketchId`.

### Loops

    for (let i = 0; i < sketchButtons.length; i++) {
      sketchButtons[i].addEventListener("click", handleSketchButtonClick);
    }

    for (let i = 0; i < particles.length; i++) {
      const particle = particles[i]
      // Update and draw particle
    }

These `for` loops repeat code a specific number of times.

## Data Structures

JavaScript uses various data structures to organize and manipulate data. Our portfolio uses arrays and objects:

### Arrays

    const particles = []

    // Adding items to an array
    for (let i = 0; i < 100; i++) {
      particles.push({
        x: p.random(p.width),
        y: p.random(p.height),
        // More properties...
      })
    }

    // Iterating through an array
    for (let i = 0; i < particles.length; i++) {
      const particle = particles[i]
      // Use particle
    }

Arrays store ordered collections of items that can be accessed by index.

### Objects

    particles.push({
      x: p.random(p.width),
      y: p.random(p.height),
      vx: p.random(-2, 2),
      vy: p.random(-2, 2),
      size: p.random(3, 8),
      color: p.color(p.random(255), p.random(255), p.random(255), 150),
    })

Objects store collections of key-value pairs, allowing us to group related data together.

## DOMContentLoaded Event

Our portfolio initializes when the DOM is fully loaded:

    document.addEventListener("DOMContentLoaded", () => {
      // Initialize the main application
      initializeApp()
      console.log("All systems ready! 🚀")
    })

This ensures our JavaScript only runs after the HTML document has been completely loaded and parsed.

## Exercise: JavaScript Fundamentals

Take 15 minutes to:
1. Identify all the different types of variables used in the code
2. List all the event types that are being listened for
3. Trace the flow of execution when a user clicks on a sketch card
4. Consider how you might add a new feature, such as a "favorite" button for sketches

## Next Hour

In the next hour, we'll dive deeper into DOM manipulation and explore how our portfolio uses JavaScript to create interactive elements.
