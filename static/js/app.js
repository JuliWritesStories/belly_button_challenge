// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Filter the metadata for the object witht the desired sample number
    var metadata = data.filter(obj => obj.id == sample)[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var panel = d3.select("#sample-metadata");
    // Use `.html("") to clear any existing metadata
    panel.html("");

    // Inside a loop, you will need to use d3 to append new
    Object.entries(metadata).forEach(([key, value]) => {
      panel.append("p").text('${key}:${value}');
    });
    // tags for each key-value in the filtered metadata.

  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Filter the samples for the object with the desired sample number
    var sampleData = data.samples.filter(obj => obj.id == sample)[0];

    // Get the otu_ids, otu_labels, and sample_values
    var otu_ids = sampleData.otu_ids;
    var otu_labels = sampleData.otu_labels;
    var sample_values = sampleData.sample_values;

    // Build a Bubble Chart
    var bubbleLayout = {
      title: 'Bacteria Cultures Per Sample',
      xaxis: {tile: 'OTU ID'},
      hovermode: 'closest',
      showlegend: false
    };
    var bubbleData = [{
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: 'Earth'
      }
    }];
    Plotly.newPlot('buble', bubbleData, bubbleLayout);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    var yticks = otu_ids.slice(0,10).map(otu_id => 'OTU ${otu_id}').reverse();

    // Build a Bar Chart
    var barData = [{
      y: yticks,
      x: sample_values.slice(0,10).reverse(),
      text: otu_labels.slice(0,10).reverse(),
      type: 'bar',
      orientation: 'h'
    }];
    var barLayout = {
      title: 'Top 10 Bacteria Cultures Found',
      margin: {t: 30, 1:150}

    };
    Plotly.newPlot('bar',barData,barLayout);

  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    var names = data.name;
    // Use d3 to select the dropdown with id of `#selDataset`
    var dropdown = d3.select("#selDataset");
    // Use the list of sample names to populate the select options
    names.forEach((sample) => {
      dropdown.append("option").text(sample).property("value",sample);
    });
    // Get the first sample from the list
    var firstSample = names[0];
    // Build charts and metadata panel with the first sample
    buildMetadata(firstSample);
    buildCharts(firstSample);

  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected

}

// Initialize the dashboard
init();
