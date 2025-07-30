# Module 5, Lesson 13: Advanced Interactivity - Drag and Zoom

**Objective:**
*   Enable users to drag individual nodes to reposition them.
*   Implement zoom and pan functionality for the entire graph.
*   Ensure that links connected to dragged nodes update dynamically.

**Concepts Covered:**
*   D3.js `d3.drag()` behavior for nodes.
*   `dragstarted`, `dragged`, and `dragended` event handlers for drag operations.
*   D3.js `d3.zoom()` behavior for the SVG container.
*   `zoomed` event handler to apply transformations.
*   Updating link paths when connected nodes are moved.

---

## Code Examples (Current State)

*Note: The code provided below reflects the state of the project files after completing Module 5, Lesson 13.*

### `index.html`
\`\`\`html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Text Variant Graph - Drag and Zoom</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/d3/7.8.5/d3.min.js"></script>
    <style>
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

        .graph-scroll-container {
            overflow-x: auto;
            border: 1px solid #ccc;
            margin: 20px auto;
            background-color: white;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            max-height: 450px;
            width: 90%;
            max-width: 1200px;
        }
        #graph {
            display: block;
            width: 100%;
            height: 100%;
        }
        .node {
            cursor: grab; /* Indicate draggable */
        }
        .node circle {
            fill: steelblue;
            stroke: #fff;
            stroke-width: 1.5px;
            transition: transform 0.2s ease, opacity 0.3s ease;
        }
        .node:hover circle {
            transform: scale(1.1);
        }
        .node text {
            fill: white;
            font-size: 12px;
            text-anchor: middle;
            dominant-baseline: middle;
            pointer-events: none;
        }
        .link {
            fill: none;
            stroke: #999;
            stroke-opacity: 0.6;
            stroke-width: 2px;
            transition: stroke-width 0.2s ease, stroke-opacity 0.2s ease;
        }
        .link:hover {
            stroke-width: 3px;
            stroke-opacity: 1;
        }
        /* Styles for different node types */
        .node.start circle, .node.end circle {
            fill: #4a5568;
        }
        .node.shared circle {
            fill: #000000;
        }
        .node.variant circle {
            fill: #e53e3e;
        }

        /* Tooltip styles */
        .tooltip {
            position: absolute;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 8px 12px;
            border-radius: 6px;
            font-size: 12px;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.3s;
            z-index: 1000;
        }

        /* Highlighting styles */
        .highlighted {
            stroke-width: 4px !important;
            stroke-opacity: 1 !important;
        }
        .dimmed {
            opacity: 0.2 !important;
        }

        /* Legend styles */
        .legend-wrapper {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            margin-top: 20px;
            gap: 10px;
        }
        .legend-label {
            font-size: 0.9rem;
            font-weight: bold;
            color: #4a5568;
            width: 100%;
            text-align: center;
            margin-bottom: 10px;
        }
        .legend-item {
            display: inline-flex;
            align-items: center;
            gap: 5px;
            cursor: pointer;
            font-size: 14px;
            padding: 5px 10px;
            border-radius: 5px;
            background-color: #eee;
            transition: background-color 0.2s ease;
        }
        .legend-item:hover {
            background-color: #ddd;
        }
        .legend-item.active {
            outline: 2px solid #000;
            background-color: #e0e0e0;
        }
        .legend-color {
            width: 15px;
            height: 15px;
            border-radius: 50%;
        }
    </style>
</head>
<body>
    <h1>My First Text Variant Graph</h1>

    <div class="controls-container">
        <div class="search-bar">
            <input type="text" id="search-input" placeholder="Search node text...">
        </div>
        <div class="filter-section" id="witness-filters">
            <!-- Witness checkboxes will be dynamically added here -->
        </div>
    </div>

    <div class="graph-scroll-container">
        <div id="graph"></div>
    </div>

    <div class="tooltip" id="tooltip"></div>

    <div class="legend-wrapper" id="legend-container">
        <!-- Legend items will be dynamically added here -->
    </div>

    <script src="script.js"></script>
    <script>
        // Global variables to store data, accessible by functions in script.js
        let allReferencesData = [];
        let allGraphData = null;

        // Fetch all data and render the graph
        Promise.all([
            d3.json('graph-data.json'),
            d3.json('references.json')
        ]).then(([graphData, referencesData]) => {
            if (graphData && referencesData) {
                allGraphData = graphData; // Store graph data globally
                allReferencesData = referencesData; // Store references data globally
                
                // Initialize filters and render graph
                window.initializeFilters(referencesData);
                window.applyFilters(); // Apply initial filters (all active)
                
                window.renderLegend(allReferencesData); // Call global function to render legend
            } else {
                console.error('Failed to load one or more data files.');
            }
        }).catch(error => {
            console.error('Error fetching data:', error);
        });

        // Add resize event listener
        window.addEventListener('resize', () => {
            if (allGraphData) {
                window.applyFilters(); // Re-apply filters on resize to ensure correct rendering with new dimensions
            }
        });
    </script>
</body>
</html>
\`\`\`

### `script.js`
\`\`\`javascript
// Module 5, Lesson 13: Advanced Interactivity - Drag and Zoom

console.log("Lesson 13: Advanced Interactivity - Drag and Zoom")

const d3 = window.d3

// Color schemes for different witnesses and node types
const witnessColors = {
  A: "#e53e3e", // Red
  B: "#3182ce", // Blue
  C: "#38a169", // Green
  D: "#ff8c00", // Orange
  E: "#4169e1", // Royal Blue
  F: "#00ced1", // Dark Cyan
  shared: "#000000", // Black for shared nodes
  start: "#4a5568", // Dark gray for START node
  end: "#4a5568", // Dark gray for END node
}

// Define SVG intrinsic height (this is the height of the content within the viewBox)
const svgIntrinsicHeight = 400

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
let currentTransform = d3.zoomIdentity;

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

  // Define arrow markers in SVG <defs>
  let defs = svg.select("defs")
  if (defs.empty()) {
    defs = svg.append("defs")
  }

  // Clear existing markers before redrawing (important for resize)
  defs.selectAll("marker").remove()

  // Create a marker for each witness color
  Object.keys(witnessColors).forEach((key) => {
    if (key !== "shared" && key !== "start" && key !== "end") {
      defs
        .append("marker")
        .attr("id", `arrowhead-${key}`)
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 8)
        .attr("refY", 0)
        .attr("orient", "auto")
        .attr("markerWidth", 6)
        .attr("markerHeight", 6)
        .append("path")
        .attr("d", "M0,-5L10,0L0,5")
        .attr("fill", witnessColors[key])
    }
  })

  // Create a group for all graph elements (nodes and links) that will be zoomed/panned
  let graphGroup = svg.select(".graph-group");
  if (graphGroup.empty()) {
      graphGroup = svg.append("g").attr("class", "graph-group");
  } else {
      // Clear existing graph elements within the group before redrawing
      graphGroup.selectAll("*").remove();
  }

  // Apply the current zoom transform to the graph group
  graphGroup.attr("transform", currentTransform);

  // Create a map for quick node lookup by ID
  const nodesMap = new Map(data.nodes.map((node) => [node.id, node]))

  // Use d3.linkHorizontal for curved paths
  const linkPathGenerator = d3
    .linkHorizontal()
    .x((d_node) => d_node.x)
    .y((d_node) => d_node.y) // Y offset will be handled per link

  // Draw Links
  const links = graphGroup.selectAll(".link-group")
    .data(data.links)
    .enter()
    .append("g")
    .attr("class", "link-group");

  links.each(function (d) {
    const sourceNode = nodesMap.get(d.source)
    const targetNode = nodesMap.get(d.target)

    if (!sourceNode || !targetNode) {
      return
    }

    const witnessesToDraw = d.witnesses
    const numWitnesses = witnessesToDraw.length
    const offsetStep = 5

    witnessesToDraw.forEach((witness, i) => {
      // Only draw if the witness is currently active in filters
      if (!currentFilters.activeWitnesses.has(witness)) {
        return
      }

      const offset = (i - (numWitnesses - 1) / 2) * offsetStep

      // Create a temporary link generator for this specific link with its offset
      const currentLinkPathGenerator = d3.linkHorizontal()
        .x(d_node => d_node.x)
        .y(d_node => d_node.y + offset);

      const pathD = currentLinkPathGenerator({ source: sourceNode, target: targetNode })

      d3.select(this)
        .append("path")
        .attr("class", "link")
        .attr("d", pathD)
        .attr("stroke", witnessColors[witness] || "#999")
        .attr("stroke-width", 2)
        .attr("opacity", 0.6)
        .attr("data-witness", witness)
        .attr("marker-end", `url(#arrowhead-${witness})`)
        .on("mouseover", (event) => {
          tooltip
            .style("opacity", 1)
            .html(`Link: ${d.source} &rarr; ${d.target}<br>Witnesses: ${d.witnesses.join(", ")}`)
            .style("left", event.pageX + 10 + "px")
            .style("top", event.pageY - 10 + "px")
        })
        .on("mouseout", () => {
          tooltip.style("opacity", 0)
        })
    })
  })

  // Draw Nodes
  const nodes = graphGroup.selectAll(".node").data(data.nodes).enter().append("g").attr("class", (d) => `node ${d.type}`)
  .attr("transform", (d) => `translate(${d.x},${d.y})`)
  .attr("data-witness", (d) => (d.witnesses ? d.witnesses.join(",") : ""))
  .on("mouseover", (event, d) => {
    tooltip
      .style("opacity", 1)
      .html(`Text: "${d.text}"<br>Type: ${d.type}<br>Witnesses: ${d.witnesses ? d.witnesses.join(", ") : "N/A"}`)
      .style("left", event.pageX + 10 + "px")
      .style("top", event.pageY - 10 + "px")
  })
  .on("mouseout", () => {
    tooltip.style("opacity", 0)
  })
  .on("click", (event, d) => {
    if (d.witnesses && d.witnesses.length > 0) {
      window.toggleWitness(d.witnesses[0], null)
    }
  })
  .call(d3.drag() // Apply drag behavior
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended));

  nodes.append("circle").attr("r", 10)

  nodes.append("text").text((d) => d.text)

  // Zoom behavior
  const zoom = d3.zoom()
    .scaleExtent([0.1, 4]) // Min and max zoom levels
    .on("zoom", zoomed);

  svg.call(zoom); // Apply zoom behavior to the SVG

  // Zoom event handler
  function zoomed(event) {
    currentTransform = event.transform; // Store the current transform
    graphGroup.attr("transform", event.transform); // Apply transform to the graph group
  }

  // Drag event handlers
  function dragstarted(event, d) {
    d3.select(this).raise().attr("stroke", "black"); // Bring dragged node to front
  }

  function dragged(event, d) {
    d.x = event.x;
    d.y = event.y;
    d3.select(this).attr("transform", `translate(${d.x},${d.y})`);
    updateLinks(); // Update links connected to the dragged node
  }

  function dragended(event, d) {
    d3.select(this).attr("stroke", null);
  }

  // Function to update links (re-calculate and redraw paths)
  function updateLinks() {
    svg.selectAll(".link-group").each(function(d_link) {
        const sourceNode = nodesMap.get(d_link.source);
        const targetNode = nodesMap.get(d_link.target);

        if (!sourceNode || !targetNode) {
            return;
        }

        const witnessesToDraw = d_link.witnesses;
        const numWitnesses = witnessesToDraw.length;
        const offsetStep = 5;

        d3.select(this).selectAll("path").each(function(d_path, i_path) {
            const witness = d3.select(this).attr("data-witness");
            const offset = (i_path - (numWitnesses - 1) / 2) * offsetStep;

            const currentLinkPathGenerator = d3.linkHorizontal()
                .x(d_node => d_node.x)
                .y(d_node => d_node.y + offset);

            d3.select(this).attr("d", currentLinkPathGenerator({ source: sourceNode, target: targetNode }));
        });
    });
  }

  console.log("Graph with drag and zoom functionality rendered!");
}

// Function to highlight links and nodes for a specific witness (made global)
window.toggleWitness = (witness, clickedElement) => {
  document.querySelectorAll(".legend-item").forEach((item) => {
    item.classList.remove("active")
  })
  if (clickedElement) {
    clickedElement.classList.add("active")
  }

  svg
    .selectAll(".link")
    .classed("highlighted", function () {
      return d3.select(this).attr("data-witness").split(",").includes(witness)
    })
    .classed("dimmed", function () {
      return !d3.select(this).attr("data-witness").split(",").includes(witness)
    })

  svg
    .selectAll(".node circle")
    .classed("dimmed", function (d) {
      return !d.witnesses.includes(witness)
    })
  svg
    .selectAll(".node text")
    .classed("dimmed", function (d) {
      return !d.witnesses.includes(witness)
    })
}

// Function to reset all highlights (made global)
window.resetHighlight = (clickedElement) => {
  document.querySelectorAll(".legend-item").forEach((item) => {
    item.classList.remove("active")
  })

  svg.selectAll(".link").classed("dimmed", false).classed("highlighted", false)

  svg.selectAll(".node circle").classed("dimmed", false)
  svg.selectAll(".node text").classed("dimmed", false)
}

// Function to render legend dynamically (made global)
window.renderLegend = (references) => {
  const legendContainer = d3.select("#legend-container")
  legendContainer.selectAll("*").remove() // Clear existing legend

  legendContainer.append("p").attr("class", "legend-label").text("Witnesses")

  const legendItems = legendContainer
    .selectAll(".legend-item")
    .data(references)
    .enter()
    .append("div")
    .attr("class", "legend-item")
    .attr("onclick", (d) => `window.toggleWitness('${d.witness}', this)`)

  legendItems
    .append("div")
    .attr("class", "legend-color")
    .style("background-color", (d) => witnessColors[d.witness])

  legendItems.append("span").text((d) => d.witness)

  // Add a reset button to the legend
  legendContainer
    .append("div")
    .attr("class", "legend-item")
    .attr("onclick", "window.resetHighlight(this)")
    .html(
      `
            <div class="legend-color" style="background-color: #ccc;"></div>
            <span>Reset View</span>
        `,
    )
}
\`\`\`

### `scripts/generate-graph-data.mjs`
\`\`\`javascript
import fs from "fs/promises"

async function generateGraphData() {
  const centerY = 300
  const wordSpacingX = 100 // Horizontal spacing between words
  const variantSpacingY = 80 // Vertical spacing for variants
  const paddingX = 150; // Padding for graph edges on both sides

  // Calculate startX dynamically to center the graph
  const startX = paddingX + wordSpacingX; 

  // Simple word tokenizer: converts to lowercase and matches word characters
  const tokenize = (text) => text.toLowerCase().match(/\b\w+\b/g) || []

  try {
    const referencesData = JSON.parse(await fs.readFile("references.json", "utf8"))
    console.log(`[DEBUG] Loaded ${referencesData.length} references from references.json`);

    const nodesMap = new Map() // Map: unique_node_id -> { id, text, x, y, witnesses }
    const linksMap = new Map() // Map: source_id-target_id -> { source, target, witnesses }

    // Track vertical offsets for variants at each X position
    // Stores { x_coord: { above: count, below: count } }
    const xPositionVariantOffsets = new Map()

    // Helper to get a unique Y for a variant at a given X
    const getVariantY = (x) => {
      if (!xPositionVariantOffsets.has(x)) {
        xPositionVariantOffsets.set(x, { above: 0, below: 0, lastAssigned: 'below' }); // Start alternating below
      }
      const offsets = xPositionVariantOffsets.get(x);

      // Alternate between above and below
      if (offsets.lastAssigned === 'below') {
          offsets.above++;
          offsets.lastAssigned = 'above';
          return centerY - (offsets.above * variantSpacingY);
      } else {
          offsets.below++;
          offsets.lastAssigned = 'below';
          return centerY + (offsets.below * variantSpacingY);
      }
    };

    // Get Witness A's words to establish the baseline
    const witnessA = referencesData.find(r => r.witness === 'A');
    const witnessAWords = tokenize(witnessA.text);

    // Add initial START and END nodes with fixed positions
    const endX = startX + (witnessAWords.length * wordSpacingX) + wordSpacingX;
    nodesMap.set("start", { id: "start", text: "START", type: "start", witnesses: [], x: startX - wordSpacingX, y: centerY });
    nodesMap.set("end", { id: "end", text: "END", type: "end", witnesses: [], x: endX, y: centerY });

    // First pass: Process all witnesses to identify unique words at each position
    // and assign initial X, Y coordinates
    const positionToWords = new Map(); // Map: index -> { word_text -> { witnesses, node_id } }

    referencesData.forEach(ref => {
      console.log(`[DEBUG] Processing witness: ${ref.witness}`);
      const witness = ref.witness;
      const words = tokenize(ref.text);

      words.forEach((word, i) => {
        if (!positionToWords.has(i)) {
          positionToWords.set(i, new Map());
        }
        const wordsAtPosition = positionToWords.get(i);

        if (!wordsAtPosition.has(word)) {
          wordsAtPosition.set(word, { witnesses: [], nodeId: `${word}_pos${i}` });
        }
        wordsAtPosition.get(word).witnesses.push(witness);
      });
    });
    console.log(`[DEBUG] After first pass, positionToWords map has ${positionToWords.size} positions.`);


    // Second pass: Create actual nodes with calculated positions
    positionToWords.forEach((wordsAtPosition, i) => {
      const x = startX + (i * wordSpacingX);
      let mainPathWord = null;
      let mainPathNodeId = null;

      // Find the word that belongs on the main path (Witness A's word if present)
      const witnessAWordAtThisPos = witnessAWords[i];
      if (witnessAWordAtThisPos && wordsAtPosition.has(witnessAWordAtThisPos)) {
        mainPathWord = witnessAWordAtThisPos;
        mainPathNodeId = wordsAtPosition.get(mainPathWord).nodeId;
        const witnesses = wordsAtPosition.get(mainPathWord).witnesses;
        nodesMap.set(mainPathNodeId, {
          id: mainPathNodeId,
          text: mainPathWord,
          type: witnesses.length > 1 ? "shared" : "variant",
          witnesses: witnesses,
          x: x,
          y: centerY
        });
      }

      // Process all words at this position
      wordsAtPosition.forEach((wordData, wordText) => {
        const nodeId = wordData.nodeId;
        const witnesses = wordData.witnesses;

        if (wordText === mainPathWord) {
          // Already handled as main path node
          return;
        }

        // This is a variant word
        const y = getVariantY(x); // No longer pass witness, just x
        nodesMap.set(nodeId, {
          id: nodeId,
          text: wordText,
          type: "variant",
          witnesses: witnesses,
          x: x,
          y: y
        });
      });
    });
    console.log(`[DEBUG] After second pass, nodesMap has ${nodesMap.size} nodes.`);


    // Third pass: Create links based on the sequence of words in each witness
    referencesData.forEach(ref => {
      const witness = ref.witness;
      const words = tokenize(ref.text);

      let prevNodeId = "start"; // Start from the conceptual 'start' node

      // Add witness to 'start' node's witnesses array
      if (!nodesMap.get("start").witnesses.includes(witness)) {
        nodesMap.get("start").witnesses.push(witness);
      }

      for (let i = 0; i < words.length; i++) {
        const word = words[i];
        const wordData = positionToWords.get(i).get(word);
        const currentNodeId = wordData.nodeId;

        // Create link from previous word to current word
        const linkKey = `${prevNodeId}-${currentNodeId}`;
        let currentLink = linksMap.get(linkKey);

        if (!currentLink) {
          currentLink = { source: prevNodeId, target: currentNodeId, witnesses: [] };
          linksMap.set(linkKey, currentLink);
        }
        if (!currentLink.witnesses.includes(witness)) {
          currentLink.witnesses.push(witness);
        }

        prevNodeId = currentNodeId; // Set current node as previous for the next iteration
      }

      // Link the last word to the conceptual 'end' node
      if (!nodesMap.get("end").witnesses.includes(witness)) {
        nodesMap.get("end").witnesses.push(witness);
      }
      const linkKeyToEnd = `${prevNodeId}-end`;
      let linkToEnd = linksMap.get(linkKeyToEnd);
      if (!linkToEnd) {
        linkToEnd = { source: prevNodeId, target: "end", witnesses: [] };
        linksMap.set(linkKeyToEnd, linkToEnd);
      }
      if (!linkToEnd.witnesses.includes(witness)) {
        linkToEnd.witnesses.push(witness);
      }
    });
    console.log(`[DEBUG] After third pass, linksMap has ${linksMap.size} links.`);


    // Finalize nodes: ensure 'type' is correct (shared vs variant)
    const finalNodes = Array.from(nodesMap.values()).map((node) => {
      if (node.id !== "start" && node.id !== "end") {
        // Re-evaluate type based on final witnesses list
        node.type = node.witnesses.length > 1 ? "shared" : "variant";
      }
      return node;
    });

    const finalLinks = Array.from(linksMap.values());

    // Calculate total graph width based on max X coordinate (END node's X) plus padding
    const maxXCoord = finalNodes.find(node => node.id === "end").x;
    const totalGraphWidth = maxXCoord + paddingX; // Add padding to the right side

    const graphData = {
      nodes: finalNodes,
      links: finalLinks,
      totalGraphWidth: totalGraphWidth // Include calculated width
    };

    await fs.writeFile("graph-data.json", JSON.stringify(graphData, null, 2), "utf8");
    console.log(`[DEBUG] Final graphData: ${graphData.nodes.length} nodes, ${graphData.links.length} links.`);
    console.log("Graph data generated successfully to graph-data.json");
  } catch (error) {
    console.error("Error generating graph data:", error);
  }
}

generateGraphData();
\`\`\`

### `references.json`
\`\`\`json
[
  {
    "witness": "A",
    "year": 1850,
    "text": "in principio creavit deus caelum et terram et aquas dei",
    "characteristics": "Original manuscript, archaic language with divine terminology",
    "title": "Witness A"
  },
  {
    "witness": "B",
    "year": 1920,
    "text": "in principio creavit deus caelum et terram",
    "characteristics": "Modern translation, follows shared/central text path",
    "title": "Witness B"
  },
  {
    "witness": "C",
    "year": 1950,
    "text": "in initio creavit dominus caelum et terram",
    "characteristics": "Revised translation, introduces new vocabulary",
    "title": "Witness C"
  },
  {
    "witness": "D",
    "year": 1980,
    "text": "in principio deus creavit mundum",
    "characteristics": "Simplified version, focuses on core message",
    "title": "Witness D"
  },
  {
    "witness": "E",
    "year": 2000,
    "text": "in principio creavit deus caelum et terram et spiritus dei",
    "characteristics": "Contemporary interpretation, emphasizes spiritual aspect",
    "title": "Witness E"
  },
  {
    "witness": "F",
    "year": 2010,
    "text": "in principio creavit dominus universum",
    "characteristics": "Modern academic translation, uses broader terms",
    "title": "Witness F"
  }
]
\`\`\`

### `graph-data.json`
\`\`\`json
{
  "nodes": [
    {
      "id": "start",
      "text": "START",
      "type": "start",
      "witnesses": ["A", "B", "C", "D", "E", "F"],
      "x": 250,
      "y": 300
    },
    {
      "id": "in_pos0",
      "text": "in",
      "type": "shared",
      "witnesses": ["A", "B", "C", "D", "E", "F"],
      "x": 350,
      "y": 300
    },
    {
      "id": "principio_pos1",
      "text": "principio",
      "type": "shared",
      "witnesses": ["A", "B", "D", "E", "F"],
      "x": 450,
      "y": 300
    },
    { "id": "initio_pos1", "text": "initio", "type": "variant", "witnesses": ["C"], "x": 450, "y": 220 },
    {
      "id": "creavit_pos2",
      "text": "creavit",
      "type": "shared",
      "witnesses": ["A", "B", "C", "E", "F"],
      "x": 550,
      "y": 300
    },
    { "id": "deus_pos2", "text": "deus", "type": "variant", "witnesses": ["D"], "x": 550, "y": 380 },
    { "id": "deus_pos3", "text": "deus", "type": "shared", "witnesses": ["A", "B", "E"], "x": 650, "y": 300 },
    { "id": "dominus_pos3", "text": "dominus", "type": "shared", "witnesses": ["C", "F"], "x": 650, "y": 220 },
    { "id": "caelum_pos4", "text": "caelum", "type": "shared", "witnesses": ["A", "B", "C", "E"], "x": 750, "y": 300 },
    { "id": "mundum_pos4", "text": "mundum", "type": "variant", "witnesses": ["D"], "x": 750, "y": 380 },
    { "id": "universum_pos4", "text": "universum", "type": "variant", "witnesses": ["F"], "x": 750, "y": 220 },
    { "id": "et_pos5", "text": "et", "type": "shared", "witnesses": ["A", "B", "C", "E"], "x": 850, "y": 300 },
    { "id": "terram_pos6", "text": "terram", "type": "shared", "witnesses": ["A", "B", "C", "E"], "x": 950, "y": 300 },
    { "id": "et_pos7", "text": "et", "type": "shared", "witnesses": ["A", "E"], "x": 1050, "y": 300 },
    { "id": "aquas_pos8", "text": "aquas", "type": "variant", "witnesses": ["A"], "x": 1150, "y": 220 },
    { "id": "spiritus_pos8", "text": "spiritus", "type": "variant", "witnesses": ["E"], "x": 1150, "y": 380 },
    { "id": "dei_pos9", "text": "dei", "type": "variant", "witnesses": ["A"],
      "x": 1250,
      "y": 300
    },
    {
      "id": "end",
      "text": "END",
      "type": "end",
      "witnesses": ["A", "B", "C", "D", "E", "F"],
      "x": 1350,
      "y": 300
    }
  ],
  "links": [
    { "source": "start", "target": "in_pos0", "witnesses": ["A", "B", "C", "D", "E", "F"] },
    { "source": "in_pos0", "target": "principio_pos1", "witnesses": ["A", "B", "D", "E", "F"] },
    { "source": "in_pos0", "target": "initio_pos1", "witnesses": ["C"] },
    { "source": "principio_pos1", "target": "creavit_pos2", "witnesses": ["A", "B", "E", "F"] },
    { "source": "principio_pos1", "target": "deus_pos2", "witnesses": ["D"] },
    { "source": "initio_pos1", "target": "creavit_pos2", "witnesses": ["C"] },
    { "source": "creavit_pos2", "target": "deus_pos3", "witnesses": ["A", "B", "E"] },
    { "source": "creavit_pos2", "target": "dominus_pos3", "witnesses": ["C", "F"] },
    { "source": "deus_pos2", "target": "mundum_pos4", "witnesses": ["D"] },
    { "source": "deus_pos3", "target": "caelum_pos4", "witnesses": ["A", "B", "E"] },
    { "source": "dominus_pos3", "target": "caelum_pos4", "witnesses": ["C"] },
    { "source": "dominus_pos3", "target": "universum_pos4", "witnesses": ["F"] },
    { "source": "caelum_pos4", "target": "et_pos5", "witnesses": ["A", "B", "C", "E"] },
    { "source": "mundum_pos4", "target": "end", "witnesses": ["D"] },
    { "source": "universum_pos4", "target": "end", "witnesses": ["F"] },
    { "source": "et_pos5", "target": "terram_pos6", "witnesses": ["A", "B", "C", "E"] },
    { "source": "terram_pos6", "target": "end", "witnesses": ["B", "C"] },
    { "source": "terram_pos6", "target": "et_pos7", "witnesses": ["A", "E"] },
    { "source": "et_pos7", "target": "aquas_pos8", "witnesses": ["A"] },
    { "source": "et_pos7", "target": "spiritus_pos8", "witnesses": ["E"] },
    { "source": "aquas_pos8", "target": "dei_pos9", "witnesses": ["A"] },
    { "source": "spiritus_pos8", "target": "end", "witnesses": ["E"] },
    { "source": "dei_pos9", "target": "end", "witnesses": ["A"] }
  ],
  "totalGraphWidth": 1700
}
\`\`\`
