function buildMetadata(sample) {
  // @TODO: Complete the following function that builds the metadata panel
  var url = `/metadata/${sample}`
  d3.json(url).then(function(response) {
    // console.log(response);
    var data = [response];
    var meta = d3.select("#sample-metadata").html("");

    data.forEach((data) => {
      var row = meta.append("ul");
      Object.entries(data).forEach(([key, value]) => {
        var cell = meta.append("li");
        cell.text(`${key} : ${value}`);
      });
    });
  });
}

function buildCharts(sample) {

  // BUBBLE CHART // 
  var url = `/samples/${sample}`
  d3.json(url).then(function(data) {
    var otu_ids = data.otu_ids;
    var sample_values = data.sample_values;
    var otu_labels = data.otu_labels;
    var sample = data.sample;
    
    var data = [data];
    // console.log(data);
    
    var trace1 = {
      x: otu_ids,
      y: sample_values,
      type: "bubble",
      text: otu_labels,
      mode: "markers",
      marker: {
        color: otu_ids,
        size: sample_values,
        colorscale: "Earth"
      },
    };
    var data = [trace1];
    // console.log(data);

    var layout = {
      title: sample,
      hovermode: "closest",
      xaxis: {title: "OTU ID"},
      yaxis: {title: "Sample Value"}
    }
    
    Plotly.newPlot("bubble", data, layout);
});


// PIE CHART //
  var url = `/samples/${sample}`
  d3.json(url).then(function(data) {
    var sample_values = data.sample_values.slice(0,10);
    var otu_ids = data.otu_ids.slice(0,10);
    var otu_labels = data.otu_labels.slice(0,10);
    var data = [data];
    // console.log(data);

    var trace2 = {
      values: sample_values,
      labels: otu_ids,
      hovertext: otu_labels,
      type: "pie"
    };

    var data = [trace2];
    // console.log(data);

    var layout = {
      height: "400",
      width: "500",
      margin: {
        l: 50,
        r: 50,
        b: 100,
        t: 100,
        pad: 4
      },
    }
    
    Plotly.plot("pie", data, layout);
});
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
