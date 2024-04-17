// Fetch data asynchronously from a URL
async function fetchData(url) {
  try {
    // Send a GET request to the specified URL
    const response = await fetch(url);

    // Parse the response body as JSON
    const data = await response.json();

    // Return the parsed JSON data
    return data;
  } catch (error) {
    // If an error occurs during fetching or parsing, log the error
    console.error('Error fetching data:', error);
    
    // Return null to indicate that the fetch operation failed
    return null;
  }
}
// Call the URL
fetchData('https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json')

// Create bar chart function
function createBarChart(sample) {
  // Extract top 10 sample values, OTU IDs, and labels from the sample data
  const sampleValues = sample.sample_values.slice(0, 10).reverse(); // Extract top 10 sample values and reverse the order
  const otuIDs = sample.otu_ids.slice(0, 10).reverse().map(id => `OTU ${id}`); // Extract top 10 OTU IDs, reverse the order, and format as 'OTU id'
  const otuLabels = sample.otu_labels.slice(0, 10).reverse(); // Extract top 10 OTU labels and reverse the order

  // Define trace object for the bar chart
  const trace = {
    x: sampleValues, // Set x-axis values to sample values
    y: otuIDs, // Set y-axis values to OTU IDs
    text: otuLabels, // Set hover text to OTU labels
    type: 'bar', // Set chart type to bar
    orientation: 'h' // Set chart orientation to horizontal
  };

  // Define layout object for the bar chart
  const layout = {
    title: 'Top 10 Bacteria Cultures Found', // Set chart title
    xaxis: { title: 'Sample Values' }, // Set x-axis title
    yaxis: { title: 'OTU ID' } // Set y-axis title
  };

  // Create a new Plotly bar chart with the specified trace and layout
  Plotly.newPlot('bar', [trace], layout);
}

// Function to create bubble chart
function createBubbleChart(sample) {
  // Define trace object for the bubble chart
  const trace = {
    x: sample.otu_ids, // Set x-axis values to OTU IDs
    y: sample.sample_values, // Set y-axis values to sample values
    text: sample.otu_labels, // Set hover text to OTU labels
    mode: 'markers', // Set mode to markers for bubble chart
    marker: {
      size: sample.sample_values, // Set marker size based on sample values
      color: sample.otu_ids // Set marker color based on OTU IDs
    }
  };

  // Define layout object for the bubble chart
  const layout = {
    title: 'Bacteria Cultures Per Sample', // Set chart title
    xaxis: { title: 'OTU ID' }, // Set x-axis title
    yaxis: { title: 'Sample Values' } // Set y-axis title
  };

  // Create a new Plotly bubble chart with the specified trace and layout
  Plotly.newPlot('bubble', [trace], layout);
}

// Demographic info update function
function updateDemographicInfo(metadata){
  // Select the HTML element with the id 'sample-metadata'
  const panel = d3.select('#sample-metadata');
  // Clear any existing content within the selected element
  panel.html('');

  // Iterate over each key-value pair in the metadata object
  Object.entries(metadata).forEach(([key, value]) => {
    // Append a paragraph element to the panel element with the key-value pair as text
    panel.append('p').text(`${key}: ${value}`);
  });
}
// Function to create dropdown menu
function createDropdown(samples){
  // Select the dropdown element
  const dropdown = d3.select('#selDataset');

  // Clear any previous options (optional, depending on your use case)
  dropdown.html('');

  // Iterate over each sample in the array
  samples.forEach(sample => {
    // Append an option element to the dropdown with the sample as both value and text
    dropdown.append('option').attr('value', sample).text(sample);
  });
}

// Initialize the dashboard
async function init(){
  // Fetch data asynchronously
  const data = await fetchData('https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json');

  // Check if data is successfully fetched
  if (!data){
    console.error('Failed to fetch data');
    return;
  }

  // Create dropdown menu using sample names
  createDropdown(data.names);

  // Assuming data.samples[0] corresponds to the first sample
  createBarChart(data.samples[0]);
  createBubbleChart(data.samples[0]);

  // Assuming data.metadata[0] corresponds to the metadata for the first sample
  updateDemographicInfo(data.metadata[0]);
}

// Update the charts based on the selected option
async function optionChanged(id) {
  // Fetch data from the provided URL asynchronously
  const data = await fetchData('https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json');
  
  // If data is not available, return early
  if (!data){
    return;
  }

  // Find the sample corresponding to the selected ID
  const sample = data.samples.find(sample => sample.id === id);
  
  // Find the metadata corresponding to the selected ID
  const metadata = data.metadata.find(metadata => metadata.id.toString() === id);

  // Create bar chart using the selected sample data
  createBarChart(sample);

  // Create bubble chart using the selected sample data
  createBubbleChart(sample);
  
  // Update demographic information using the selected metadata
  updateDemographicInfo(metadata);
}

// Initialize the dashboard
init();
