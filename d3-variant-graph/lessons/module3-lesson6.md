# Module 3, Lesson 6: Basic Interactivity - Hover Effects and Tooltips

**Objective:**
*   Add basic interactivity to the graph elements.
*   Implement hover effects for nodes and links.
*   Display informative tooltips on hover.

**Concepts Covered:**
*   D3.js `selection.on()` for event handling (`mouseover`, `mouseout`).
*   Styling elements on hover using CSS classes or direct style manipulation.
*   Creating and positioning a custom HTML tooltip element.
*   Accessing data bound to D3.js selections.

---

## Code Examples (Current State)

*Note: The code provided below reflects the state of the project files after completing Module 3, Lesson 6.*

### `index.html`
\`\`\`html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Text Variant Graph - Hover and Tooltips</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/d3/7.8.5/d3.min.js"></script>
    <style>
        body {
            font-family: sans-serif;
            margin: 20px;
        }
        h1 {
            text-align: center;
        }
        #graph {
            border: 1px solid #ccc;
            background-color: #f9f9f9;
        }
        .node circle {
            fill: steelblue;
            stroke: #fff;
            stroke-width: 1.5px;
            transition: transform 0.2s ease; /* Smooth hover effect */
        }
        .node:hover circle {
            transform: scale(1.1); /* Enlarge on hover */
        }
        .node text {
            fill: white;
            font-size: 12px;
            text-anchor: middle;
            dominant-baseline: middle;
            pointer-events: none;
        }
        .link {
            stroke: #999;
            stroke-opacity: 0.6;
            stroke-width: 2px;
            transition: stroke-width 0.2s ease, stroke-opacity 0.2s ease; /* Smooth hover effect */
        }
        .link:hover {
            stroke-width: 3px;
            stroke-opacity: 1;
        }
        /* New styles for different node types */
        .node.start circle, .node.end circle {
            fill: #4a5568; /* Dark gray */
        }
        .node.shared circle {
            fill: #000000; /* Black */
        }
        .node.variant circle {
            fill: #e53e3e; /* Red */
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
    </style>
</head>
<body>
    <h1>My First Text Variant Graph</h1>
    <div id="graph"></div>
    <div class="tooltip" id="tooltip"></div>
    <script src="script.js"></script>
    <script>
        // Global variable to store all graph data
        let allGraphData = null;

        // Fetch data and render the graph
        d3.json('graph-data.json').then(data => {
            if (data) {
                allGraphData = data; // Store data globally
                window.renderGraph(allGraphData); // Call global function from script.js
            } else {
                console.error('Failed to load graph-data.json');
            }
        }).catch(error => {
            console.error('Error fetching data:', error);
        });
    </script>
</body>
</html>
\`\`\`

### `script.js`
\`\`\`javascript
// Module 3, Lesson 6: Basic Interactivity - Hover Effects and Tooltips

console.log("Lesson 6: Basic Interactivity - Hover Effects and Tooltips")

const d3 = window.d3

// Select the container where we want to draw our SVG
const graphDiv = d3.select("#graph")

// Select the tooltip (it's already in index.html)
const tooltip = d3.select("#tooltip")

// Define SVG dimensions (these will become dynamic later)
const svgWidth = 1200
const svgHeight = 400

// Append an SVG element to the graph container
const svg = graphDiv.append("svg").attr("width", svgWidth).attr("height", svgHeight)

// Function to render the graph (made global for access from index.html)
window.renderGraph = (data) => {
    console.log("Rendering graph with data:", data);

    // Clear existing graph elements before redrawing
    svg.selectAll("*").remove();

    // Create a map for quick node lookup by ID
    const nodesMap = new Map(data.nodes.map(node => [node.id, node]));

    // Draw Links
    svg.selectAll(".link")
        .data(data.links)
        .enter()
        .append("line")
        .attr("class", "link")
        .attr("x1", d => nodesMap.get(d.source).x)
        .attr("y1", d => nodesMap.get(d.source).y)
        .attr("x2", d => nodesMap.get(d.target).x)
        .attr("y2", d => nodesMap.get(d.target).y)
        .on("mouseover", (event, d) => {
            // Show tooltip on mouseover
            tooltip.style("opacity", 1)
                   .html(`Link: ${d.source} &rarr; ${d.target}<br>Witnesses: ${d.witnesses.join(", ")}`)
                   .style("left", (event.pageX + 10) + "px")
                   .style("top", (event.pageY - 10) + "px");
        })
        .on("mouseout", () => {
            // Hide tooltip on mouseout
            tooltip.style("opacity", 0);
        });

    // Draw Nodes (as groups to contain circle and text)
    const nodes = svg.selectAll(".node")
        .data(data.nodes)
        .enter()
        .append("g") // Group for node and text
        .attr("class", d => `node ${d.type}`) // Add class based on node type
        .attr("transform", d => `translate(${d.x},${d.y})`) // Translate the group to the node's position
        .on("mouseover", (event, d) => {
            // Show tooltip on mouseover
            tooltip.style("opacity", 1)
                   .html(`Text: "${d.text}"<br>Type: ${d.type}<br>Witnesses: ${d.witnesses ? d.witnesses.join(", ") : "N/A"}`)
                   .style("left", (event.pageX + 10) + "px")
                   .style("top", (event.pageY - 10) + "px");
        })
        .on("mouseout", () => {
            // Hide tooltip on mouseout
            tooltip.style("opacity", 0);
        });

    // Append circle to each node group
    nodes.append("circle")
        .attr("r", 10); // Radius of the circle (cx, cy are 0 because group is translated)

    // Append text to each node group
    nodes.append("text")
        .text(d => d.text); // Text content (x, y are 0 because group is translated, alignment handled by CSS)

    console.log("Nodes and links with text labels, hover effects, and tooltips rendered!");
}
\`\`\`

### `scripts/generate-graph-data.js`
\`\`\`javascript
// This file is deprecated and replaced by generate-graph-data.mjs.
// It is kept for historical context but not used.
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
      "witnesses": ["A", "B"],
      "x": 250,
      "y": 300
    },
    {
      "id": "in_pos0",
      "text": "in",
      "type": "shared",
      "witnesses": ["A", "B"],
      "x": 350,
      "y": 300
    },
    {
      "id": "principio_pos1",
      "text": "principio",
      "type": "shared",
      "witnesses": ["A", "B"],
      "x": 450,
      "y": 300
    },
    {
      "id": "creavit_pos2",
      "text": "creavit",
      "type": "shared",
      "witnesses": ["A", "B"],
      "x": 550,
      "y": 300
    },
    {
      "id": "deus_pos3",
      "text": "deus",
      "type": "shared",
      "witnesses": ["A", "B"],
      "x": 650,
      "y": 300
    },
    {
      "id": "caelum_pos4",
      "text": "caelum",
      "type": "shared",
      "witnesses": ["A", "B"],
      "x": 750,
      "y": 300
    },
    {
      "id": "et_pos5",
      "text": "et",
      "type": "shared",
      "witnesses": ["A", "B"],
      "x": 850,
      "y": 300
    },
    {
      "id": "terram_pos6",
      "text": "terram",
      "type": "shared",
      "witnesses": ["A", "B"],
      "x": 950,
      "y": 300
    },
    {
      "id": "aquas_pos7",
      "text": "aquas",
      "type": "variant",
      "witnesses": ["A"],
      "x": 1050,
      "y": 220
    },
    {
      "id": "dei_pos8",
      "text": "dei",
      "type": "variant",
      "witnesses": ["A"],
      "x": 1150,
      "y": 300
    },
    {
      "id": "end",
      "text": "END",
      "type": "end",
      "witnesses": ["A", "B"],
      "x": 1250,
      "y": 300
    }
  ],
  "links": [
    { "source": "start", "target": "in_pos0", "witnesses": ["A", "B"] },
    { "source": "in_pos0", "target": "principio_pos1", "witnesses": ["A", "B"] },
    { "source": "principio_pos1", "target": "creavit_pos2", "witnesses": ["A", "B"] },
    { "source": "creavit_pos2", "target": "deus_pos3", "witnesses": ["A", "B"] },
    { "source": "deus_pos3", "target": "caelum_pos4", "witnesses": ["A", "B"] },
    { "source": "caelum_pos4", "target": "et_pos5", "witnesses": ["A", "B"] },
    { "source": "et_pos5", "target": "terram_pos6", "witnesses": ["A", "B"] },
    { "source": "terram_pos6", "target": "aquas_pos7", "witnesses": ["A"] },
    { "source": "terram_pos6", "target": "end", "witnesses": ["B"] },
    { "source": "aquas_pos7", "target": "dei_pos8", "witnesses": ["A"] },
    { "source": "dei_pos8", "target": "end", "witnesses": ["A"] }
  ],
  "totalGraphWidth": 1600
}
\`\`\`
