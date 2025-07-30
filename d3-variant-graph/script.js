// Lesson 14: Advanced Styling - Custom Node Shapes and Textures

console.log("Lesson 14: Advanced Styling - Custom Node Shapes and Textures")

const d3 = window.d3

// Color schemes for different witnesses and node types
const witnessColors = {
  A: "#e53e3e", // Red
  B: "#3182ce", // Blue
  C: "#38a169", // Green
  D: "#ff8c00", // Orange
  E: "#4169e1", // Royal Blue
  F: "#00ced1", // Dark Cyan
  shared: "#000000", // Black for shared nodes (used as pattern background)
  start: "#4a5568", // Dark gray for START node
  end: "#4a5568", // Dark gray for END node
}

// Define SVG intrinsic height (this is the height of the content within the viewBox)
const svgIntrinsicHeight = 400
const textPadding = 10 // Padding inside the rect for text
const minRectWidth = 40 // Minimum width for very short words

// Select the container where we want to draw our SVG
const graphDiv = d3.select("#graph")

// Select the tooltip (it's already in index.html)
const tooltip = d3.select("#tooltip")

// Global variables to store data (populated by index.html's inline script)
// window.allReferencesData = [];
// window.allGraphData = null; // This holds the *original* full dataset

// State for filters
const currentFilters = {
  activeWitnesses: new Set(),
  searchTerm: "",
}

// Store the current zoom transform
let currentTransform = d3.zoomIdentity

// Function to initialize witness filter checkboxes (made global)
window.initializeFilters = (references) => {
  const filterSection = d3.select("#witness-filters")
  filterSection.selectAll("*").remove() // Clear existing filters

  references.forEach((ref) => {
    currentFilters.activeWitnesses.add(ref.witness) // Add all witnesses to active by default

    const label = filterSection.append("label")
    label
      .append("input")
      .attr("type", "checkbox")
      .attr("name", "witness-filter")
      .attr("value", ref.witness)
      .property("checked", true) // All checked by default
      .on("change", function () {
        if (this.checked) {
          currentFilters.activeWitnesses.add(this.value)
        } else {
          currentFilters.activeWitnesses.delete(this.value)
        }
        window.applyFilters()
      })
    label.append("span").text(ref.witness)
  })

  // Add event listener for search input
  d3.select("#search-input").on("input", function () {
    currentFilters.searchTerm = this.value.toLowerCase()
    window.applyFilters()
  })
}

// Function to apply filters and re-render the graph (made global)
window.applyFilters = () => {
  if (!window.allGraphData) return // Ensure data is loaded

  const filteredNodes = window.allGraphData.nodes.filter((node) => {
    // Filter by witness: node must be part of at least one active witness
    const isWitnessMatch =
      node.type === "start" ||
      node.type === "end" ||
      Array.from(currentFilters.activeWitnesses).some((w) => node.witnesses.includes(w))

    // Filter by search term: node text must contain the search term (case-insensitive)
    const isSearchMatch = node.text.toLowerCase().includes(currentFilters.searchTerm)

    return isWitnessMatch && isSearchMatch
  })

  const filteredNodeIds = new Set(filteredNodes.map((n) => n.id))

  const filteredLinks = window.allGraphData.links.filter((link) => {
    // Link must connect two filtered nodes AND be part of at least one active witness
    const isSourceFiltered = filteredNodeIds.has(link.source)
    const isTargetFiltered = filteredNodeIds.has(link.target)
    const isWitnessMatch = Array.from(currentFilters.activeWitnesses).some((w) => link.witnesses.includes(w))

    return isSourceFiltered && isTargetFiltered && isWitnessMatch
  })

  // Re-render the graph with filtered data
  window.renderGraph({
    nodes: filteredNodes,
    links: filteredLinks,
    totalGraphWidth: window.allGraphData.totalGraphWidth, // Keep original width for viewBox
  })
}

// Function to render the graph (made global)
window.renderGraph = (data) => {
  // Note: allGraphData is the *original* full dataset. We pass filtered data to this function.

  // Calculate the intrinsic width of the graph content based on generated data
  const svgIntrinsicWidth = data.totalGraphWidth || 1200 // Fallback if not provided

  let svg = graphDiv.select("svg")
  if (svg.empty()) {
    svg = graphDiv.append("svg")
  }
  // Set viewBox to the full logical dimensions of the graph.
  // The SVG will scale to fit its container while maintaining this aspect ratio.
  // The actual rendered size will be controlled by CSS (width: 100%, height: 100%)
  // on the SVG element itself, within its parent container.
  svg.attr("viewBox", `0 0 ${svgIntrinsicWidth} ${svgIntrinsicHeight}`).attr("preserveAspectRatio", "xMidYMid meet") // Center the content and scale to fit

  // Define arrow markers and patterns in SVG <defs>
  let defs = svg.select("defs")
  if (defs.empty()) {
    defs = svg.append("defs")
  }

  // Clear existing markers and patterns before redrawing (important for resize)
  defs.selectAll("marker").remove()
  defs.selectAll("pattern").remove() // Clear existing patterns

  // Create a marker for each witness color
  Object.keys(witnessColors).forEach((key) => {
    // Only create markers for actual witness colors, not 'shared', 'start', 'end'
    if (key !== "shared" && key !== "start" && key !== "end") {
      defs
        .append("marker")
        .attr("id", `arrowhead-${key}`) // Unique ID for each color
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 8) // Position of the arrowhead relative to the end of the path
        .attr("refY", 0)
        .attr("orient", "auto")
        .attr("markerWidth", 6)
        .attr("markerHeight", 6)
        .append("path")
        .attr("d", "M0,-5L10,0L0,5")
        .attr("fill", witnessColors[key]) // Dynamic fill color
    }
  })

  // Define a pattern for shared nodes (black background with white diagonal stripes)
  const sharedNodePattern = defs
    .append("pattern")
    .attr("id", "shared-node-pattern")
    .attr("patternUnits", "userSpaceOnUse")
    .attr("width", 10)
    .attr("height", 10)

  sharedNodePattern
    .append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", 10)
    .attr("height", 10)
    .attr("fill", witnessColors.shared) // Background color for the pattern

  sharedNodePattern
    .append("line")
    .attr("x1", 0)
    .attr("y1", 0)
    .attr("x2", 10)
    .attr("y2", 10)
    .attr("stroke", "#ffffff") // White stripes
    .attr("stroke-width", 1.5)

  // Create a group for all graph elements (nodes and links) that will be zoomed/panned
  let g = svg.select(".graph-content-group")
  if (g.empty()) {
    g = svg.append("g").attr("class", "graph-content-group")
  }

  // Apply the current zoom transform to the group
  g.attr("transform", currentTransform)

  // Clear existing graph elements within the group before redrawing
  g.selectAll(".link-group, .node").remove()

  // 1. Draw Links
  // Create link groups, each representing a logical connection between two nodes
  const linksGroup = g.selectAll(".link-group").data(data.links).enter().append("g").attr("class", "link-group")

  // For each logical link, draw individual paths for each witness it belongs to
  linksGroup.each(function (d) {
    const sourceNode = data.nodes.find((n) => n.id === d.source)
    const targetNode = data.nodes.find((n) => n.id === d.target)

    if (!sourceNode || !targetNode) {
      // This can happen if a link's source/target node was filtered out
      return
    }

    const witnessesToDraw = d.witnesses
    const numWitnesses = witnessesToDraw.length
    const offsetStep = 5 // Small offset for parallel lines

    witnessesToDraw.forEach((witness, i) => {
      // Only draw if the witness is currently active in filters
      if (!currentFilters.activeWitnesses.has(witness)) {
        return
      }

      // Calculate offset for parallel links
      // This ensures links between the same two nodes but for different witnesses are slightly separated
      const offset = (i - (numWitnesses - 1) / 2) * offsetStep

      // Use d3.linkHorizontal for curved paths
      const linkPathGenerator = d3
        .linkHorizontal()
        .x((d_node) => d_node.x)
        .y((d_node) => d_node.y + offset) // Apply offset to Y coordinate

      const pathD = linkPathGenerator({ source: sourceNode, target: targetNode })

      d3.select(this)
        .append("path")
        .attr("class", "link")
        .attr("d", pathD)
        .attr("stroke", witnessColors[witness] || "#999") // Use witness color for stroke
        .attr("stroke-width", 2)
        .attr("opacity", 0.6)
        .attr("data-witness", witness) // Store witness data for highlighting
        .attr("marker-end", `url(#arrowhead-${witness})`) // Dynamic arrowhead ID based on witness color
        .on("mouseover", (event) => {
          // Show tooltip on mouseover
          tooltip
            .style("opacity", 1)
            .html(`Link: ${d.source} &rarr; ${d.target}<br>Witnesses: ${d.witnesses.join(", ")}`)
            .style("left", event.pageX + 10 + "px")
            .style("top", event.pageY - 10 + "px")
        })
        .on("mouseout", () => {
          // Hide tooltip on mouseout
          tooltip.style("opacity", 0)
        })
    })
  })

  // 2. Draw Nodes
  // Create a group (<g>) for each node to hold its shape and text
  const nodes = g.selectAll(".node").data(data.nodes).enter().append("g").attr("class", "node")

  // Position the group based on the node's x, y coordinates
  nodes
    .attr("transform", (d) => `translate(${d.x},${d.y})`)
    .on("mouseover", (event, d) => {
      // Show tooltip on mouseover
      tooltip
        .style("opacity", 1)
        .html(`Text: "${d.text}"<br>Type: ${d.type}<br>Witnesses: ${d.witnesses ? d.witnesses.join(", ") : "N/A"}`)
        .style("left", event.pageX + 10 + "px")
        .style("top", event.pageY - 10 + "px")
    })
    .on("mouseout", () => {
      // Hide tooltip on mouseout
      tooltip.style("opacity", 0)
    })
    .on("click", (event, d) => {
      // Call the global highlightNode function
      window.highlightNode(d.id)
    })
    .call(
      d3
        .drag() // Apply drag behavior to nodes
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended),
    )

  // Append different shapes based on node type
  nodes.each(function (d) {
    const nodeGroup = d3.select(this)
    let shape

    if (d.type === "start" || d.type === "end") {
      // Circle for start/end nodes
      const radius = Math.max(20, d.text.length * 4 + textPadding / 2) // Dynamic radius
      shape = nodeGroup
        .append("circle")
        .attr("cx", 0)
        .attr("cy", 0)
        .attr("r", radius)
        .attr("fill", witnessColors[d.type])
    } else {
      // Rectangle for variant and shared nodes
      const rectWidth = Math.max(minRectWidth, d.text.length * 8 + 2 * textPadding)
      const rectHeight = 30
      shape = nodeGroup
        .append("rect")
        .attr("width", rectWidth)
        .attr("height", rectHeight)
        .attr("x", -rectWidth / 2)
        .attr("y", -rectHeight / 2)
        .attr("rx", 5) // Rounded corners
        .attr("ry", 5)

      if (d.type === "shared") {
        shape.attr("fill", "url(#shared-node-pattern)") // Apply pattern
      } else {
        shape.attr("fill", witnessColors[d.witnesses[0]] || "#ccc") // Solid color for variants
      }
    }

    // Add common stroke to all shapes
    shape.attr("stroke", "#fff").attr("stroke-width", 1.5).attr("opacity", 0.9)

    // Append text to the node group
    nodeGroup
      .append("text")
      .text((d_text) => d_text.text)
      .attr("dy", "0.35em") // Fine-tune vertical alignment
      .style("font-size", (d_text) => {
        if (d_text.type === "shared") return "20px"
        if (d_text.type === "start" || d_text.type === "end") return "12px"
        return "14px"
      })
      .style("fill", "white")
      .style("pointer-events", "none") // Ensure text doesn't block mouse events on shape
  })

  console.log("Graph with custom node shapes and textures applied!")
}

// Zoom behavior
const zoom = d3
  .zoom()
  .scaleExtent([0.5, 5]) // Allow zooming from 0.5x to 5x
  .on("zoom", zoomed)

function zoomed(event) {
  currentTransform = event.transform // Store the current transform
  d3.select(".graph-content-group").attr("transform", event.transform)
}

// Apply zoom behavior to the SVG
graphDiv.select("svg").call(zoom)

// Drag behavior functions
function dragstarted(event, d) {
  d3.select(this).raise().classed("active", true) // Bring dragged node to front
}

function dragged(event, d) {
  // Update node's x and y based on drag event
  d.x = event.x
  d.y = event.y
  d3.select(this).attr("transform", `translate(${d.x},${d.y})`)

  // Re-render links connected to this node
  // Find all links where this node is either source or target
  const affectedLinks = window.allGraphData.links.filter((link) => link.source === d.id || link.target === d.id)

  // Update the paths of affected links
  d3.select(".graph-content-group")
    .selectAll(".link-group")
    .filter((linkData) => affectedLinks.includes(linkData))
    .each(function (linkData) {
      const sourceNode = window.allGraphData.nodes.find((n) => n.id === linkData.source)
      const targetNode = window.allGraphData.nodes.find((n) => n.id === linkData.target)

      if (!sourceNode || !targetNode) return

      const witnessesToDraw = linkData.witnesses
      const numWitnesses = witnessesToDraw.length
      const offsetStep = 5

      d3.select(this)
        .selectAll("path")
        .each(function (pathData, i) {
          const witness = d3.select(this).attr("data-witness")
          // Only update if the witness is currently active in filters
          if (!currentFilters.activeWitnesses.has(witness)) {
            return
          }
          const offset = (i - (numWitnesses - 1) / 2) * offsetStep
          const linkPathGenerator = d3
            .linkHorizontal()
            .x((node) => node.x)
            .y((node) => node.y + offset)
          d3.select(this).attr("d", linkPathGenerator({ source: sourceNode, target: targetNode }))
        })
    })
}

function dragended(event, d) {
  d3.select(this).classed("active", false)
  // After dragging, update the original graphData's node positions
  const originalNode = window.allGraphData.nodes.find((n) => n.id === d.id)
  if (originalNode) {
    originalNode.x = d.x
    originalNode.y = d.y
  }
}

// Function to highlight links and nodes for a specific witness (made global)
window.toggleWitness = (witness, clickedElement) => {
  // Clear any active node highlights
  d3.select(".graph-content-group").selectAll(".link").classed("highlighted", false).classed("dimmed", false)
  d3.select(".graph-content-group").selectAll(".node rect, .node circle").style("opacity", 0.9)

  // Remove 'active' class from all legend items
  document.querySelectorAll(".legend-item").forEach((item) => {
    item.classList.remove("active")
  })
  // Add 'active' class to the clicked legend item
  if (clickedElement) {
    clickedElement.classList.add("active")
  }

  highlightWitness(witness)
}

function highlightWitness(witness) {
  d3.select(".graph-content-group")
    .selectAll(".link") // Select all individual link paths
    .classed("highlighted", function () {
      return d3.select(this).attr("data-witness") === witness
    })
    .classed("dimmed", function () {
      return d3.select(this).attr("data-witness") !== witness
    })

  d3.select(".graph-content-group")
    .selectAll(".node rect, .node circle") // Select both rect and circle
    .style("opacity", (d) => {
      if (d.type === "start" || d.type === "end") return 0.9
      return d.witnesses && d.witnesses.includes(witness) ? 0.9 : 0.3
    })
}

// Function to highlight paths connected to a clicked node (made global)
window.highlightNode = (nodeId) => {
  // Clear any active legend highlights
  document.querySelectorAll(".legend-item").forEach((item) => {
    item.classList.remove("active")
  })

  const clickedNode = window.allGraphData.nodes.find((n) => n.id === nodeId) // Use allGraphData
  if (!clickedNode) return

  const witnessesOfClickedNode = new Set(clickedNode.witnesses)

  // Highlight links: a link is highlighted if any of its witnesses are in witnessesOfClickedNode
  d3.select(".graph-content-group")
    .selectAll(".link")
    .classed("highlighted", (d_link) => d_link.witnesses.some((witness) => witnessesOfClickedNode.has(witness)))
    .classed("dimmed", (d_link) => !d_link.witnesses.some((witness) => witnessesOfClickedNode.has(witness)))

  // Highlight nodes: a node is highlighted if it's the clicked node, or if it's part of any highlighted link
  d3.select(".graph-content-group")
    .selectAll(".node rect, .node circle") // Select both rect and circle
    .style("opacity", (d_node) => {
      if (d_node.id === nodeId) return 0.9 // Always highlight the clicked node

      // Check if this node is a source or target of any currently highlighted link
      const isConnectedToHighlightedPath = d3
        .select(".graph-content-group")
        .selectAll(".link.highlighted")
        .data()
        .some((link) => {
          return link.source === d_node.id || link.target === d_node.id
        })

      return isConnectedToHighlightedPath ? 0.9 : 0.3
    })
}

// Function to reset all highlights (made global)
window.resetHighlight = (clickedElement) => {
  // Remove 'active' class from all legend items
  document.querySelectorAll(".legend-item").forEach((item) => {
    item.classList.remove("active")
  })
  // No need to add 'active' to reset button itself, as it's a reset.

  d3.select(".graph-content-group").selectAll(".link").classed("dimmed", false).classed("highlighted", false)
  d3.select(".graph-content-group").selectAll(".node rect, .node circle").style("opacity", 0.9)
}

// Function to render witness info cards and legend dynamically (moved from index.html and made global)
window.renderWitnessInfoAndLegend = (references) => {
  // Remove existing info container and legend to prevent duplicates on re-render
  d3.select("#witness-info-container").remove()
  d3.select(".legend-wrapper").remove()

  const infoContainer = d3
    .select("body")
    .append("div")
    .attr("class", "witness-info")
    .attr("id", "witness-info-container")

  const cards = infoContainer
    .selectAll(".witness-card")
    .data(references)
    .enter()
    .append("div")
    .attr("class", (d) => `witness-card witness-${d.witness}`)

  cards.append("h3").text((d) => `${d.title} (${d.year})`)

  cards.append("p").html((d) => `"${d.text}"`)

  cards.append("p").html((d) => `<span class="small">${d.characteristics}</span>`)

  const legendContainer = d3.select("body").append("div").attr("class", "legend-wrapper") // Append to body, not #graph-container

  legendContainer.append("p").attr("class", "legend-label").text("Witnesses")

  const legendItems = legendContainer
    .selectAll(".legend-item")
    .data(references)
    .enter()
    .append("div")
    .attr("class", "legend-item")
    .attr("data-witness", (d) => d.witness)
    .attr("onclick", (d) => `window.toggleWitness('${d.witness}', this)`)

  legendItems
    .append("div")
    .attr("class", "legend-color")
    .style("background", (d) => witnessColors[d.witness])

  legendItems.append("span").text((d) => d.witness)

  legendContainer
    .append("div")
    .attr("class", "legend-item non-clickable")
    .html(`
        <div class="legend-color" style="background: ${witnessColors.shared};"></div>
        <span>Shared Terms</span>
    `)

  legendContainer
    .append("div")
    .attr("class", "legend-item legend-string")
    .attr("onclick", "window.resetHighlight(this)")
    .html(`
        <span>Reset View</span>
    `)
}

// Function to export the graph as SVG or PNG (made global)
window.exportGraph = (type) => {
  const svgElement = d3.select("#graph svg").node()
  if (!svgElement) {
    console.error("SVG element not found for export.")
    return
  }

  // Get the current viewBox dimensions
  const viewBox = svgElement.getAttribute("viewBox").split(" ").map(Number)
  const svgWidth = viewBox[2]
  const svgHeight = viewBox[3]

  // Get the current transform applied by D3 zoom
  const currentTransformString = d3.select(".graph-content-group").attr("transform")

  // Create a temporary SVG element to include styles and patterns
  const tempSvg = d3
    .create("svg")
    .attr("xmlns", "http://www.w3.org/2000/svg")
    .attr("xmlns:xlink", "http://www.w3.org/1999/xlink")
    .attr("width", svgWidth)
    .attr("height", svgHeight)
    .attr("viewBox", `0 0 ${svgWidth} ${svgHeight}`)

  // Clone defs (markers and patterns)
  const defs = svgElement.querySelector("defs")
  if (defs) {
    tempSvg.node().appendChild(defs.cloneNode(true))
  }

  // Clone the graph content group and apply the current transform
  const graphContentGroup = svgElement.querySelector(".graph-content-group")
  if (graphContentGroup) {
    const clonedGroup = graphContentGroup.cloneNode(true)
    clonedGroup.setAttribute("transform", currentTransformString)
    tempSvg.node().appendChild(clonedGroup)
  }

  // Embed CSS styles directly into the SVG
  const style = document.createElement("style")
  style.textContent = `
    body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        margin: 20px;
        background-color: #f4f4f4;
        color: #333;
    }
    h1 {
        text-align: center;
        color: #0056b3;
        margin-bottom: 20px;
    }
    .controls-container {
        display: flex;
        flex-wrap: wrap;
        gap: 20px;
        justify-content: center;
        margin-bottom: 20px;
        padding: 15px;
        background-color: white;
        border-radius: 8px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    }
    .search-bar {
        flex-grow: 1;
        max-width: 400px;
    }
    .search-bar input {
        width: 100%;
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 5px;
        font-size: 1rem;
    }
    .filter-section {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        align-items: center;
    }
    .filter-section label {
        display: flex;
        align-items: center;
        gap: 5px;
        font-size: 0.9rem;
        cursor: pointer;
    }
    .filter-section input[type="checkbox"] {
        transform: scale(1.2);
    }

    /* Container for the graph, handles horizontal scrolling if content is too wide */
    .graph-scroll-container {
        overflow-x: auto;
        border: 1px solid #ccc;
        margin: 20px auto;
        background-color: white;
        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        max-height: 450px; /* Max height for the container to allow vertical scaling within limits */
        width: 90%; /* Make container responsive to viewport width */
        max-width: 1200px; /* Max width for the container */
    }
    /* The SVG element itself */
    #graph {
        display: block; /* Remove extra space below SVG */
        width: 100%; /* SVG takes 100% width of its container */
        height: 100%; /* SVG takes 100% height of its container */
    }
    /* Tooltip styles */
    .tooltip {
        position: absolute;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 8px 12px;
        border-radius: 6px;
        font-size: 12px;
        pointer-events: none; /* Important: tooltip itself should not block mouse events */
        opacity: 0; /* Start hidden */
        transition: opacity 0.3s; /* Smooth fade in/out */
        z-index: 1000; /* Ensure it's on top */
    }
    /* Witness info cards */
    .witness-info {
        margin-top: 20px;
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 15px;
    }
    .witness-card {
        background: white;
        padding: 15px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        border-left: 4px solid;
    }
    /* Witness-specific border colors for cards */
    .witness-A { border-left-color: #e53e3e; }
    .witness-B { border-left-color: #3182ce; }
    .witness-C { border-left-color: #38a169; }
    .witness-D { border-left-color: #ff8c00; }
    .witness-E { border-left-color: #4169e1; }
    .witness-F { border-left-color: #00ced1; }

    /* Legend styles */
    .legend-wrapper {
        display: flex;
        flex-direction: column;
        flex-wrap: wrap;
        margin: 0;
    }
    .legend {
        display: flex;
        gap: 20px;
        flex-wrap: wrap;
    }
    .legend-label {
        font-size: 0.8rem;
        font-weight: bold;
        color: #4a5568;
        margin: 0;
        margin-bottom: 1rem;
    }
    .legend-item {
        display: flex;
        align-items: center;
        gap: 8px;
        background: white;
        padding: 8px 15px;
        border-radius: 20px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        cursor: pointer;
        transition: all 0.3s ease;
    }
    .legend-item:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
    }
    .legend-item.active {
        box-shadow: 0 6px 20px rgba(56, 161, 105, 0.4);
        transform: translateY(-2px);
        outline: 3px solid #000000;
    }
    .legend-item.active .legend-color {
        border: 2px solid white;
    }
    .legend-item.non-clickable {
        cursor: default;
        opacity: 0.8;
    }
    .legend-item.non-clickable:hover {
        transform: none;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .legend-color {
        width: 16px;
        height: 16px;
        border-radius: 50%;
    }
    .legend-string {
        display: flex;
        align-items: center;
        cursor: pointer;
        transition: all 0.3s ease;
        text-decoration: underline;
    }

    /* Node and Link styles */
    .node {
        cursor: grab; /* Indicate draggable */
    }
    /* Apply common styles to both rect and circle within a node group */
    .node rect, .node circle {
        stroke: #fff;
        stroke-width: 1.5;
        transition: transform 0.2s ease;
        opacity: 0.9;
    }
    .node:hover rect, .node:hover circle { /* Apply hover scale to both */
        transform: scale(1.05);
    }
    .node text {
        fill: white;
        font-size: 14px;
        text-anchor: middle;
        dominant-baseline: middle;
        pointer-events: none;
    }
    .link {
        fill: none;
        stroke: #999;
        stroke-width: 2;
        opacity: 0.6;
        transition: all 0.3s ease;
    }
    .link:hover {
        stroke-width: 3;
        opacity: 1;
    }
    .highlighted {
        stroke-width: 4 !important;
        opacity: 1 !important;
    }
    .dimmed {
        opacity: 0.2 !important;
    }
  `
  tempSvg.node().prepend(style) // Add styles to the temporary SVG

  const svgString = new XMLSerializer().serializeToString(tempSvg.node())
  const filename = `text-variant-graph-${new Date().toISOString().slice(0, 10)}`

  if (type === "svg") {
    const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${filename}.svg`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    console.log("SVG exported successfully!")
  } else if (type === "png") {
    const canvas = document.createElement("canvas")
    const context = canvas.getContext("2d")

    // Set canvas dimensions to match SVG viewBox dimensions
    canvas.width = svgWidth
    canvas.height = svgHeight

    const img = new Image()
    img.crossOrigin = "anonymous" // Important for handling external resources if any
    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgString)))

    img.onload = () => {
      context.drawImage(img, 0, 0)
      const pngUrl = canvas.toDataURL("image/png")
      const a = document.createElement("a")
      a.href = pngUrl
      a.download = `${filename}.png`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      console.log("PNG exported successfully!")
    }

    img.onerror = (error) => {
      console.error("Error converting SVG to PNG:", error)
      alert(
        "Failed to export PNG. Check console for details. (CORS issues might occur if external images are used without proper headers.)",
      )
    }
  } else {
    console.error("Unsupported export type:", type)
  }
}

// Add resize event listener
window.addEventListener("resize", () => {
  if (window.allGraphData) {
    // Re-apply filters on resize to ensure correct rendering with new dimensions
    window.applyFilters()
    // Re-render legend and info cards as well, in case their container sizes change
    window.renderWitnessInfoAndLegend(window.allReferencesData)
  }
})
