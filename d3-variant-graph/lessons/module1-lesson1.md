# Module 1, Lesson 1: Setting Up the Environment and Basic SVG

**Objective:**
*   Set up the basic HTML structure for the project.
*   Include the D3.js library.
*   Create an empty SVG container where the graph will be drawn.

**Concepts Covered:**
*   Basic HTML document structure (`<!DOCTYPE html>`, `<html>`, `<head>`, `<body>`).
*   Including external JavaScript libraries using `<script src="...">`.
*   Introduction to SVG (`<svg>` tag) as a drawing canvas.
*   D3.js `d3.select()` for selecting DOM elements.
*   D3.js `selection.append()` for adding new elements to the DOM.

---

## Code Examples (Current State)

*Note: The code provided below reflects the state of the project files after completing Module 1, Lesson 1.*

### `index.html`
\`\`\`html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Text Variant Graph</title>
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
</body>
</html>
\`\`\`

### `script.js`
\`\`\`javascript
// Module 1, Lesson 1: Setting Up the Environment and Basic SVG

console.log("Lesson 1: Setting Up the Environment and Basic SVG")

const d3 = window.d3

// Select the container where we want to draw our SVG
const graphDiv = d3.select("#graph")

// Define SVG dimensions
const svgWidth = 800
const svgHeight = 400

// Append an SVG element to the graph container
const svg = graphDiv.append("svg").attr("width", svgWidth).attr("height", svgHeight)

console.log("SVG container created!")
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
// This file is not introduced until Module 1, Lesson 2.
// It is empty for this lesson.
\`\`\`
\`\`\`
\`\`\`
