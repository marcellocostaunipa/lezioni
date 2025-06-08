// ==========================================================================
// GLOBAL VARIABLES - Store important elements and state
// ==========================================================================

// Modal elements
let modal = null
let modalTitle = null
let sketchContainer = null
let closeButton = null

// Current p5 sketch instance
let currentSketch = null

// ==========================================================================
// INITIALIZATION - Set up the application when page loads
// ==========================================================================

function initializeApp() {
  // Get references to important DOM elements
  modal = document.getElementById("sketch-modal")
  modalTitle = document.getElementById("modal-title")
  sketchContainer = document.getElementById("sketch-container")
  closeButton = document.getElementById("close-modal")

  // Set up event listeners
  setupEventListeners()
}

// ==========================================================================
// EVENT LISTENERS - Handle user interactions
// ==========================================================================

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

// ==========================================================================
// MODAL FUNCTIONS - Open and close the sketch modal
// ==========================================================================

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

// ==========================================================================
// SKETCH MANAGEMENT - Load and cleanup p5.js sketches
// ==========================================================================

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
    case "sound-waves":
      currentSketch = new p5(createSoundWavesSketch(), sketchContainer)
      break
    case "flow-field":
      currentSketch = new p5(createFlowFieldSketch(), sketchContainer)
      break
    case "game-of-life":
      currentSketch = new p5(createGameOfLifeSketch(), sketchContainer)
      break
    case "3d-geometry":
      currentSketch = new p5(create3DGeometrySketch(), sketchContainer)
      break
    default:
      showSketchNotFound()
  }
}

function cleanupSketch() {
  // Remove the current p5 sketch if it exists
  if (currentSketch) {
    currentSketch.remove()
    currentSketch = null
  }

  // Clear the container
  sketchContainer.innerHTML = ""
}

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

// ==========================================================================
// P5.JS SKETCH CREATORS - Functions that return sketch functions
// ==========================================================================

function createParticleSystemSketch() {
  return (p) => {
    const particles = []

    p.setup = () => {
      const canvas = p.createCanvas(p.windowWidth * 0.8, p.windowHeight * 0.7)
      canvas.parent(sketchContainer)

      // Create initial particles
      for (let i = 0; i < 100; i++) {
        particles.push({
          x: p.random(p.width),
          y: p.random(p.height),
          vx: p.random(-2, 2),
          vy: p.random(-2, 2),
          size: p.random(3, 8),
          color: p.color(p.random(255), p.random(255), p.random(255), 150),
        })
      }
    }

    p.draw = () => {
      p.background(20, 25, 40)

      // Update and draw particles
      for (let i = 0; i < particles.length; i++) {
        const particle = particles[i]

        // Update position
        particle.x += particle.vx
        particle.y += particle.vy

        // Bounce off edges
        if (particle.x < 0 || particle.x > p.width) particle.vx *= -1
        if (particle.y < 0 || particle.y > p.height) particle.vy *= -1

        // Draw particle
        p.fill(particle.color)
        p.noStroke()
        p.ellipse(particle.x, particle.y, particle.size)
      }

      // Draw connections between nearby particles
      p.stroke(255, 50)
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const d = p.dist(particles[i].x, particles[i].y, particles[j].x, particles[j].y)
          if (d < 100) {
            p.line(particles[i].x, particles[i].y, particles[j].x, particles[j].y)
          }
        }
      }
    }

    p.windowResized = () => {
      p.resizeCanvas(p.windowWidth * 0.8, p.windowHeight * 0.7)
    }
  }
}

function createFractalTreeSketch() {
  return (p) => {
    let angle = 0

    p.setup = () => {
      const canvas = p.createCanvas(p.windowWidth * 0.8, p.windowHeight * 0.7)
      canvas.parent(sketchContainer)
    }

    p.draw = () => {
      p.background(20, 25, 40)
      p.stroke(100, 255, 100)
      p.strokeWeight(2)

      // Save the current transformation
      p.push()

      // Move to bottom center
      p.translate(p.width / 2, p.height)

      // Draw the tree
      drawBranch(p, 120, angle)

      // Restore transformation
      p.pop()

      angle += 0.01
    }

    function drawBranch(p, len, currentAngle) {
      p.line(0, 0, 0, -len)
      p.translate(0, -len)

      if (len > 4) {
        // Left branch
        p.push()
        p.rotate(currentAngle)
        drawBranch(p, len * 0.67, currentAngle)
        p.pop()

        // Right branch
        p.push()
        p.rotate(-currentAngle)
        drawBranch(p, len * 0.67, currentAngle)
        p.pop()
      }
    }

    p.windowResized = () => {
      p.resizeCanvas(p.windowWidth * 0.8, p.windowHeight * 0.7)
    }
  }
}

function createSoundWavesSketch() {
  return (p) => {
    const waves = []

    p.setup = () => {
      const canvas = p.createCanvas(p.windowWidth * 0.8, p.windowHeight * 0.7)
      canvas.parent(sketchContainer)

      // Initialize wave data
      for (let i = 0; i < 5; i++) {
        waves.push({
          amplitude: p.random(50, 150),
          frequency: p.random(0.01, 0.03),
          phase: p.random(p.TWO_PI),
          color: p.color(p.random(100, 255), p.random(100, 255), p.random(100, 255), 100),
        })
      }
    }

    p.draw = () => {
      p.background(20, 25, 40)

      // Draw each wave
      for (let i = 0; i < waves.length; i++) {
        const wave = waves[i]

        p.stroke(wave.color)
        p.strokeWeight(3)
        p.noFill()

        p.beginShape()
        for (let x = 0; x < p.width; x += 5) {
          const y = p.height / 2 + wave.amplitude * p.sin(wave.frequency * x + wave.phase + p.frameCount * 0.02)
          p.vertex(x, y)
        }
        p.endShape()

        wave.phase += 0.02
      }
    }

    p.windowResized = () => {
      p.resizeCanvas(p.windowWidth * 0.8, p.windowHeight * 0.7)
    }
  }
}

function createFlowFieldSketch() {
  return (p) => {
    const particles = []
    const flowField = []
    let cols, rows
    const scale = 20

    p.setup = () => {
      const canvas = p.createCanvas(p.windowWidth * 0.8, p.windowHeight * 0.7)
      canvas.parent(sketchContainer)

      cols = Math.floor(p.width / scale) + 1
      rows = Math.floor(p.height / scale) + 1

      // Initialize particles
      for (let i = 0; i < 500; i++) {
        particles.push({
          x: p.random(p.width),
          y: p.random(p.height),
          vx: 0,
          vy: 0,
          prevX: 0,
          prevY: 0,
        })
      }
    }

    p.draw = () => {
      p.background(20, 25, 40, 10)

      // Update flow field
      let yoff = 0
      for (let y = 0; y < rows; y++) {
        let xoff = 0
        for (let x = 0; x < cols; x++) {
          const index = x + y * cols
          const angle = p.noise(xoff, yoff, p.frameCount * 0.01) * p.TWO_PI * 2
          flowField[index] = p.createVector(p.cos(angle), p.sin(angle))
          xoff += 0.1
        }
        yoff += 0.1
      }

      // Update particles
      for (let i = 0; i < particles.length; i++) {
        const particle = particles[i]

        particle.prevX = particle.x
        particle.prevY = particle.y

        const x = Math.floor(particle.x / scale)
        const y = Math.floor(particle.y / scale)
        const index = x + y * cols

        if (flowField[index]) {
          const force = flowField[index]
          particle.vx += force.x * 0.5
          particle.vy += force.y * 0.5
        }

        particle.x += particle.vx
        particle.y += particle.vy

        // Wrap around edges
        if (particle.x < 0) particle.x = p.width
        if (particle.x > p.width) particle.x = 0
        if (particle.y < 0) particle.y = p.height
        if (particle.y > p.height) particle.y = 0

        // Limit velocity
        particle.vx *= 0.99
        particle.vy *= 0.99

        // Draw particle trail
        p.stroke(255, 100)
        p.strokeWeight(1)
        p.line(particle.prevX, particle.prevY, particle.x, particle.y)
      }
    }

    p.windowResized = () => {
      p.resizeCanvas(p.windowWidth * 0.8, p.windowHeight * 0.7)
      cols = Math.floor(p.width / scale) + 1
      rows = Math.floor(p.height / scale) + 1
    }
  }
}

function createGameOfLifeSketch() {
  return (p) => {
    let grid
    let cols, rows
    const resolution = 10

    p.setup = () => {
      const canvas = p.createCanvas(p.windowWidth * 0.8, p.windowHeight * 0.7)
      canvas.parent(sketchContainer)

      cols = Math.floor(p.width / resolution)
      rows = Math.floor(p.height / resolution)

      // Initialize grid randomly
      grid = []
      for (let i = 0; i < cols; i++) {
        grid[i] = []
        for (let j = 0; j < rows; j++) {
          grid[i][j] = Math.random() > 0.8 ? 1 : 0
        }
      }
    }

    p.draw = () => {
      p.background(20, 25, 40)

      // Draw grid
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = i * resolution
          const y = j * resolution

          if (grid[i][j] === 1) {
            p.fill(100, 255, 100)
            p.noStroke()
            p.rect(x, y, resolution, resolution)
          }
        }
      }

      // Update grid every 10 frames
      if (p.frameCount % 10 === 0) {
        const next = []
        for (let i = 0; i < cols; i++) {
          next[i] = []
        }

        for (let i = 0; i < cols; i++) {
          for (let j = 0; j < rows; j++) {
            const neighbors = countNeighbors(grid, i, j, cols, rows)
            const state = grid[i][j]

            if (state === 0 && neighbors === 3) {
              next[i][j] = 1
            } else if (state === 1 && (neighbors < 2 || neighbors > 3)) {
              next[i][j] = 0
            } else {
              next[i][j] = state
            }
          }
        }

        grid = next
      }
    }

    function countNeighbors(grid, x, y, cols, rows) {
      let sum = 0
      for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
          const col = (x + i + cols) % cols
          const row = (y + j + rows) % rows
          sum += grid[col][row]
        }
      }
      sum -= grid[x][y]
      return sum
    }

    p.windowResized = () => {
      p.resizeCanvas(p.windowWidth * 0.8, p.windowHeight * 0.7)
      cols = Math.floor(p.width / resolution)
      rows = Math.floor(p.height / resolution)
    }
  }
}

function create3DGeometrySketch() {
  return (p) => {
    let rotationX = 0
    let rotationY = 0

    p.setup = () => {
      const canvas = p.createCanvas(p.windowWidth * 0.8, p.windowHeight * 0.7, p.WEBGL)
      canvas.parent(sketchContainer)
    }

    p.draw = () => {
      p.background(20, 25, 40)

      // Lighting
      p.ambientLight(60, 60, 60)
      p.pointLight(255, 255, 255, 0, 0, 200)

      // Rotate based on time
      rotationX += 0.01
      rotationY += 0.005

      p.push()
      p.rotateX(rotationX)
      p.rotateY(rotationY)

      // Draw multiple geometric shapes
      p.fill(255, 100, 100)
      p.push()
      p.translate(-100, 0, 0)
      p.box(60)
      p.pop()

      p.fill(100, 255, 100)
      p.push()
      p.translate(100, 0, 0)
      p.sphere(40)
      p.pop()

      p.fill(100, 100, 255)
      p.push()
      p.translate(0, -80, 0)
      p.cylinder(30, 80)
      p.pop()

      p.fill(255, 255, 100)
      p.push()
      p.translate(0, 80, 0)
      p.cone(40, 80)
      p.pop()

      p.pop()
    }

    p.windowResized = () => {
      p.resizeCanvas(p.windowWidth * 0.8, p.windowHeight * 0.7)
    }
  }
}

// ==========================================================================
// START THE APPLICATION - Initialize everything when DOM is ready
// ==========================================================================

document.addEventListener("DOMContentLoaded", () => {
  // Initialize the main application
  initializeApp()
  console.log("All systems ready! 🚀")
})
