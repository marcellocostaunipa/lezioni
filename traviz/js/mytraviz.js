// Store the data globally so we can re-use it
        var currentData = null;
        var currentLineBreaks = false; // Start with line breaks disabled
        
        // Initialize TRAViz
        var traviz = new TRAViz("containerDiv", {
            lineBreaks: currentLineBreaks
        });
        
        // Function to get button text based on current state
        function getButtonText() {
            return currentLineBreaks ? 'Disable Line Breaks' : 'Enable Line Breaks';
        }
        
        // Function to toggle line breaks and reinitialize
        function toggleLineBreaks() {
            if (currentData) {
                // Toggle the line breaks setting
                currentLineBreaks = !currentLineBreaks;
                
                console.log('Toggling line breaks to:', currentLineBreaks);
                
                // Clear the container
                document.getElementById('containerDiv').innerHTML = '';
                
                // Create a new TRAViz instance with updated options
                traviz = new TRAViz("containerDiv", {
                    lineBreaks: currentLineBreaks
                });
                
                // Re-align and visualize with the stored data
                traviz.align(currentData);
                traviz.visualize();
                
                // Update button text to show current state
                updateButtonText();
                
            } else {
                console.error('No data available to re-render');
            }
        }
        
        // Function to update button text
        function updateButtonText() {
            var button = document.getElementById('toggleButton');
            if (button) {
                var newText = getButtonText();
                button.innerHTML = newText;
                console.log('Button text updated to:', newText);
            }
        }

        // Function to load JSON data and initialize visualization
        async function loadDataAndVisualize() {
            try {
                // Fetch the JSON file
                const response = await fetch('data/data-extended.json');
                
                // Check if the request was successful
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                // Parse the JSON data
                const data = await response.json();
                
                // Store the data globally
                currentData = data;
                
                // Use the loaded data with traviz
                traviz.align(currentData);
                traviz.visualize();
                
                // Create button after successful initialization
                createToggleButton();
                
            } catch (error) {
                console.error('Error loading JSON data:', error);
                
                // Fallback to original hardcoded data if JSON loading fails
                console.log('Falling back to hardcoded data...');
                
                currentData = [
                    {
                        edition: 'Edition 1',
                        text: 'Thank You very much for thinking about using this library'
                    },
                    {
                        edition: 'Edition 2',
                        text: 'I thank You for downloading this library'
                    },
                    {
                        edition: 'Edition 3',
                        text: 'Thank You a lot for using this library'
                    },
                    {
                        edition: 'Edition 4',
                        text: 'Thanks a lot for watching this example'
                    },
                    {
                        edition: 'Edition 5',
                        text: 'Thanks for downloading and thinking about using this library'
                    }
                ];
                
                traviz.align(currentData);
                traviz.visualize();
                
                // Create button after fallback initialization
                createToggleButton();
            }
        }
        
        // Function to create the toggle button
        function createToggleButton() {
            // Check if button already exists to avoid duplicates
            if (!document.getElementById('toggleButton')) {
                console.log('Creating toggle button, currentLineBreaks:', currentLineBreaks);
                
                var button = document.createElement('button');
                button.id = 'toggleButton';
                button.className = 'toggle';
                button.onclick = toggleLineBreaks;
                
                // Set initial button text explicitly with fallback
                var initialText = getButtonText();
                button.innerHTML = initialText || 'Toggle Line Breaks'; // Fallback text
                
                console.log('Initial button text set to:', button.innerHTML);
                
                // Add the button to the document
                document.body.appendChild(button);
                
                // Double-check the text is set after appending (additional safety)
                setTimeout(function() {
                    if (button.innerHTML === '' || button.innerHTML === null) {
                        button.innerHTML = 'Enable Line Breaks';
                        console.log('Fixed empty button text with fallback');
                    }
                }, 10);
                
                // Add hover effect
                button.onmouseover = function() {
                    this.style.backgroundColor = '#0056b3';
                };
                button.onmouseout = function() {
                    this.style.backgroundColor = '#007bff';
                };
            }
        }

        // Load data and initialize visualization when page loads
        loadDataAndVisualize();