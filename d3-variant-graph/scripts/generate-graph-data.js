import fs from "fs/promises"

async function generateGraphData() {
  const centerY = 300

  // Define explicit positions for each unique phrase based on your original layout
  const phraseToCoords = {
    START: { x: 100, y: centerY },
    "In the beginning": { x: 250, y: centerY },
    "was the Word": { x: 400, y: centerY },
    "existed the Word": { x: 400, y: centerY - 80 },
    "and the Word was with God": { x: 600, y: centerY },
    "and the Word was divine": { x: 600, y: centerY - 80 },
    "and dwelt among us": { x: 850, y: centerY },
    "and lived among us": { x: 850, y: centerY + 80 },
    END: { x: 1000, y: centerY },
  }

  try {
    const referencesData = JSON.parse(await fs.readFile("references.json", "utf8"))

    const nodesMap = new Map() // Map: phrase_text -> node_object
    const linksMap = new Map() // Map: source_id-target_id -> link_object

    // Add START and END nodes initially
    nodesMap.set("START", { id: "start", text: "START", type: "start", editions: [], ...phraseToCoords["START"] })
    nodesMap.set("END", { id: "end", text: "END", type: "end", editions: [], ...phraseToCoords["END"] })

    let nodeIdCounter = 0

    referencesData.forEach((ref) => {
      const edition = ref.edition
      const fullPath = ["START", ...ref.path_phrases, "END"]

      for (let i = 0; i < fullPath.length; i++) {
        const currentPhrase = fullPath[i]
        let currentNode = nodesMap.get(currentPhrase)

        if (!currentNode) {
          // Create new node if it doesn't exist
          const newId = currentPhrase === "START" ? "start" : currentPhrase === "END" ? "end" : `n${nodeIdCounter++}`
          currentNode = {
            id: newId,
            text: currentPhrase,
            type: "variant", // Default to variant, will be updated to shared if multiple editions
            editions: [],
            ...phraseToCoords[currentPhrase],
          }
          nodesMap.set(currentPhrase, currentNode)
        }

        // Add edition to node's editions array if not already present
        if (!currentNode.editions.includes(edition)) {
          currentNode.editions.push(edition)
        }

        // Create links
        if (i > 0) {
          const prevPhrase = fullPath[i - 1]
          const prevNode = nodesMap.get(prevPhrase)

          const linkKey = `${prevNode.id}-${currentNode.id}`
          let currentLink = linksMap.get(linkKey)

          if (!currentLink) {
            currentLink = {
              source: prevNode.id,
              target: currentNode.id,
              editions: [],
            }
            linksMap.set(linkKey, currentLink)
          }

          // Add edition to link's editions array if not already present
          if (!currentLink.editions.includes(edition)) {
            currentLink.editions.push(edition)
          }
        }
      }
    })

    // Finalize nodes: set type based on number of editions
    const finalNodes = Array.from(nodesMap.values()).map((node) => {
      if (node.id !== "start" && node.id !== "end") {
        node.type = node.editions.length > 1 ? "shared" : "variant"
      }
      return node
    })

    const finalLinks = Array.from(linksMap.values())

    const graphData = {
      nodes: finalNodes,
      links: finalLinks,
    }

    await fs.writeFile("graph-data.json", JSON.stringify(graphData, null, 2), "utf8")
    console.log("Graph data generated successfully to graph-data.json")
  } catch (error) {
    console.error("Error generating graph data:", error)
  }
}

generateGraphData()
