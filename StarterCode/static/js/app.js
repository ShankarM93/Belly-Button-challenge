// Reading in sample.json through D3 and loading URL  
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"
d3.json(url).then((data) => {
console.log(`Data: ${data}`);
});

// Initializing a web page through populating drop down menu from JSON file
function init() {
    let dropdownMenu = d3.select("#selDataset");
    d3.json(url).then((data) => {
        let names = data.names;
        names.forEach((name) => {
            dropdownMenu.append("option").text(name).property("value", name);
        });
        let name = names[0];

        bar(name);
        bubble(name);
        demo(name);
    });
}

// Creating and displaying a horizontal Bar Chart using plotly and displaying top 10 values
function bar(selectedValue) {
    d3.json(url).then((data) => {
        let samples = data.samples;
        let filteredData = samples.filter((sample) => sample.id === selectedValue);
        let obj = filteredData[0];
        
        let trace = [{
            x: obj.sample_values.slice(0,10).reverse(),
            y: obj.otu_ids.slice(0,10).map((otu_id) => `OTU ${otu_id}`).reverse(),
            text: obj.otu_labels.slice(0,10).reverse(),
            type: "bar",
            marker: {
                color: "rgb(2, 158, 59)"
            },
            orientation: "h"
        }];

        Plotly.newPlot("bar", trace);
    });
}

// Creating and displaying  a Bubble Chart using Plotly
function bubble(selectedValue) {
        d3.json(url).then((data) => {
        let samples = data.samples;
        let filteredData = samples.filter((sample) => sample.id === selectedValue);
        let obj = filteredData[0];
        
        // setting otu_ids as x-axis and sample_values as y-axis
        let trace = [{
            x: obj.otu_ids,
            y: obj.sample_values,
            text: obj.otu_labels,
            mode: "markers",
            marker: {
                size: obj.sample_values,
                color: obj.otu_ids,
                colorscale: "Greens"
            }
        }];
    
        let layout = {
            xaxis: {title: "OTU ID"}
        };

        Plotly.newPlot("bubble", trace, layout);
    });
}

// Creating Demographics information that filters the metadata based on the selected value, and displays the key-value pairs from the filtered metadata on the web page
function demo(selectedValue) {
    d3.json(url).then((data) => {
        let metadata = data.metadata;
        let filteredData = metadata.filter((meta) => meta.id == selectedValue);
        let obj = filteredData[0]
        d3.select("#sample-metadata").html("");
         let entries = Object.entries(obj);
         entries.forEach(([key,value]) => {
            d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`);
        });
        
        console.log(entries);
    });
  }


// Handling change in menu drop down selection, to update and display different visuals based on selection
function optionChanged(selectedValue) {
    demo(selectedValue);
    bar(selectedValue);
    bubble(selectedValue);
    gauge(selectedValue)
}

init();