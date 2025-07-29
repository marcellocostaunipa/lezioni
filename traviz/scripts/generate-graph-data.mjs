import fs from "fs/promises"

async function generateGraphData() {
  const centerY = 300
  const wordSpacingX = 100 // Horizontal spacing between words
  const variantSpacingY = 80 // Vertical spacing for variants
  const paddingX = 350; // Increased padding for graph edges on both sides

  // Calculate startX dynamically to center the graph
  // This ensures the START node is at 'paddingX' from the left edge of the SVG
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
    // endX is calculated based on the new dynamic startX
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
