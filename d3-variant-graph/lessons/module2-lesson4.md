# Module 2, Lesson 4: Adding Text Labels to Nodes

**Objective:**
*   Add text labels to each node, displaying the `text` property from the data.
*   Position the text correctly within or near the node shape.

**Concepts Covered:**
*   Creating SVG text elements (`<text>`).
*   Setting text content (`selection.text()`).
*   Text positioning attributes (`x`, `y`, `text-anchor`, `dominant-baseline` or `dy`).
*   Grouping SVG elements (`<g>`) to treat nodes and their labels as a single unit.

---

## Code Examples (Current State)

*Note: The code provided below reflects the state of the project files after completing Module 2, Lesson 4.*

### `index.html`
\`\`\`html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Text Variant Graph - Text Labels</title>
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
        }
        .node text {
            fill: white;
            font-size: 12px;
            text-anchor: middle; /* Center text horizontally */
            dominant-baseline: middle; /* Center text vertically */
            pointer-events: none; /* Text should not block mouse events on the circle */
        }
        .link {
            stroke: #999;
            stroke-opacity: 0.6;
            stroke-width: 2px;
        }
    </style>
</head>
<body>
    <h1>My First Text Variant Graph</h1>
    <div id="graph"></div>
    <script src="script.js"></script>
    <script>
        // Fetch data and render the graph
        d3.json('graph-data.json').then(data => {
            if (data) {
                window.renderGraph(data); // Call global function from script.js
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
// Module 2, Lesson 4: Adding Text Labels to Nodes

console.log("Lesson 4: Adding Text Labels to Nodes")

const d3 = window.d3

// Select the container where we want to draw our SVG
const graphDiv = d3.select("#graph")

// Define SVG dimensions
const svgWidth = 800
const svgHeight = 400

// Append an SVG element to the graph container
const svg = graphDiv.append("svg").attr("width", svgWidth).attr("height", svgHeight)

// Function to render the graph (made global for access from index.html)
window.renderGraph = (data) => {
    console.log("Rendering graph with data:", data);

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
        .attr("y2", d => nodesMap.get(d.target).y);

    // Draw Nodes (as groups to contain circle and text)
    const nodes = svg.selectAll(".node")
        .data(data.nodes)
        .enter()
        .append("g") // Group for node and text
        .attr("class", "node")
        .attr("transform", d => `translate(${d.x},${d.y})`); // Translate the group to the node's position

    // Append circle to each node group
    nodes.append("circle")
        .attr("r", 10); // Radius of the circle (cx, cy are 0 because group is translated)

    // Append text to each node group
    nodes.append("text")
        .text(d => d.text); // Text content (x, y are 0 because group is translated, alignment handled by CSS)

    console.log("Nodes and links with text labels rendered!");
}
\`\`\`

### `scripts/generate-graph-data.js`
\`\`\`javascript
// This file is not introduced until Module 2, Lesson 5.
// It is empty for this lesson.
\`\`\`

### `scripts/generate-graph-data.mjs`
\`\`\`javascript
// This file is not introduced until Module 2, Lesson 5.
// It is empty for this lesson.
\`\`\`

### `references.json`
\`\`\`json
// This file is not introduced until Module 2, Lesson 5.
// It is empty for this lesson.
\`\`\`

### `graph-data.json`
\`\`\`json
{
  "nodes": [
    { "id": "n1", "text": "Word 1", "x": 100, "y": 200 },
    { "id": "n2", "text": "Word 2", "x": 300, "y": 200 },
    { "id": "n3", "text": "Word 3", "x": 500, "y": 200 },
    { "id": "n4", "text": "Variant 1", "x": 300, "y": 100 }
  ],
  "links": [
    { "source": "n1", "target": "n2" },
    { "source": "n2", "target": "n3" },
    { "source": "n1", "target": "n4" },
    { "source": "n4", "target": "n3" }
  ]
}
\`\`\`
\`\`\`
\`\`\`
