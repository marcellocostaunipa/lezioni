# Module 1, Lesson 2: Loading Data and Initial Node Placement

**Objective:**
*   Load graph data from a JSON file.
*   Render nodes as simple circles on the SVG canvas based on their coordinates.

**Concepts Covered:**
*   Asynchronous data loading with `d3.json()`.
*   Promises (`.then()`, `.catch()`) for handling asynchronous operations.
*   Data binding in D3.js (`selection.data()`, `selection.enter()`).
*   Creating SVG circle elements (`<circle>`).
*   Setting SVG attributes (`cx`, `cy`, `r`, `fill`).

---

## Code Examples (Current State)

*Note: The code provided below reflects the state of the project files after completing Module 1, Lesson 2.*

### `index.html`
\`\`\`html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Text Variant Graph - Initial Nodes</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/d3/7.8.5/d3.min.js"></script>
    <style>
        body {
            font-family: sans-serif;
            margin: 20px;
        }
        #graph {
            border: 1px solid #ccc;
            background-color: #f9f9f9;
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
// Module 1, Lesson 2: Loading Data and Initial Node Placement

console.log("Lesson 2: Loading Data and Initial Node Placement")

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

    // Draw Nodes
    svg.selectAll("circle")
        .data(data.nodes)
        .enter()
        .append("circle")
        .attr("cx", d => d.x)
        .attr("cy", d => d.y)
        .attr("r", 10) // Radius of the circle
        .attr("fill", "steelblue"); // Node color

    console.log("Nodes rendered!");
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
  "links": []
}
\`\`\`
\`\`\`
\`\`\`
