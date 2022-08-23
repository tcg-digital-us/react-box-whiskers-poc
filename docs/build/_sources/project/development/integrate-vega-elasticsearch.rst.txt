
Incorporate Real-Time Elasticsearch Data Into Vega Visualisation
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Now to start mucking around with the fun stuff. Last we left off the front end looked something like this:

.. code:: JSX

   import logo from './logo.svg';
   import './App.css';
   import { useState } from 'react';
   import { useEffect } from 'react';
   import vegaEmbed from 'vega-embed';

   function App() {

     const [ elastic_response, setElasticResponse ] = useState({});

     useEffect(() => {
       (async () => {
         const response = await fetch('http://localhost:3001');

         const elastic_json = await response.json();

         let yourVlSpec = {
           $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
           description: 'A simple bar chart with embedded data.',
           data: {
             values: [
               {Metric: 'Nodes', Count: elastic_json.number_of_nodes},
               {Metric: 'Data Nodes', Count: elastic_json.number_of_data_nodes},
               {Metric: 'Active Primary Shards', Count: elastic_json.active_primary_shards}
             ]
           },
           mark: 'bar',
           encoding: {
             x: {field: 'Metric', type: 'ordinal'},
             y: {field: 'Count', type: 'quantitative'}
           }
         };
         
         vegaEmbed('#Graph', yourVlSpec);

         setElasticResponse(elastic_json);
       })();
     }, []);

     return (
       <div className="App">
         <header className="App-header">
           { JSON.stringify(elastic_response) }
           <div id="Graph"></div>
         </header>
       </div>
     );
   }

We used an effect without dependencies (by putting nothing in the ``[]``) to fetch the status of our elasticsearch instance
as soon as the module loads, drew a bar graph with that data, and then we set the ``elastic_response`` state to the response's json 
using the setter function ``setElasticResponse()`` provided by ``useState()``. Once the state has changed, the
module will refresh, displaying a graphical reprisentation of the current Elasticsearch nodes status.

We know in the grand scheme of things that we want to display a graph and a form. When the App module is first loaded,
it should make the calls necessary to get the list of documents that make up the penguins index from elasticsearch and display it to a box-and-whiskers plot.

When the form is submitted, we want to send the data in that form to our backend. Once that has finished, we want 
the module to re-evaluate some javascript that once again gets the now-updated data from the penguins index and
displays that data to the plot.

The easiest way to make a module reload in React, is to update a state. So one thing we can do is to store the 
response from each fetch call inside a single state, so this way when the last successful response changes we know
our index has been updated and our module should reload.

This just requires we modify our state name. and we will also remove our previous graph drawing and state 
setting calls from the effect, as well as the stringified response from the JSX returned:

.. code:: JSX
   :force:

   function App() {

     const [ last_elastic_response, setLastElasticResponse ] = useState({});
 
     useEffect(() => {
       (async () => {
         const response = await fetch('http://localhost:3001/status');
         const elastic_json = await response.json();
        })();
     }, []);
 
     return (
       <div className="App">
         <header className="App-header">
           <div id="Graph"></div>
         </header>
       </div>
     );
   }

We need code to be run in two effects, when the module loads for the first time, and when the ``last_elastic_response``
state changes. We already have our first effect. We can create a second effect below the first with ``last_elastic_response`` as a 
dependency:

.. code:: JSX
   :force:

   useEffect(() => {
     (async () => {
        // Leaving it empty for now.
     })();
   }, [last_elastic_response]);

We need to fetch our data for the graph in both effects, so rather than copying code into two effects, we should 
abstract our fetching code out into a function that can be called in both effects. That said what we ACTUALLY need
to happen in both effects is to draw the Vega graph, but this requires us getting the data first to draw the
graph, so with this in mind, we will create two functions, one to draw the graph which calls the other function
to get the data:

.. code:: JSX

   async function getBoxPlotData() {
     // Make fetch call to backend.
   }

   async function drawBoxWhiskersPlot() {
     const plot_data = getBoxPlotData()

     // Draw plot.
   }

   // Runs only once, on module load.
   useEffect(() => {
     (async () => {
        drawBoxWhiskersPlot()
     })();
   }, []);

   // Runs every time last_elastic_response state's value changes.
   useEffect(() => {
     (async () => {
        drawBoxWhiskersPlot()
     })();
   }, [last_elastic_response]);

Now lets flesh-out ``getBoxPlotData()``. We know we need to make a fetch call to our backend API ``/index/{index_name}/docs/all``. 
When the search results come back, they will be in a list of Elasticsearch JSON document objects, each of these
documents has a property ``_source`` that contains the field data of the document. So for each element in the list
that is returned, we need to grab the ``_source`` data, append it to a list of objects, and then return that
list. This list of data will later be provided to Vega:

.. code:: JSX

   async function getBoxPlotData() {
     var data = []
     
     // Default is 500. For another number set the 'size' query parameter.
     const url = 'http://localhost:3001/index/penguins/docs/all'
     const response = await fetch(url)
     const elastic_json = await response.json()

     // Append the _source field of each document to the data[] list.
     elastic_json.forEach((each_document) => {
       data.push(each_document._source)
     })

     return data
   }

Moving on, we now get to create our Vega visualization. We have to create a Vega specification to provide to 
``vegaEmbed()`` for our box plot. Specifications can chagne greatly from one graph to the next, so I would very
much reccomend taking a look at the Vega documentation and get a good grasp on all of the specification fields
available. For our purposes, I will provide the specification with a comment explaining its makeup:

.. code:: JSX

   async function drawBoxWhiskersPlot() {
     const plot_data = getBoxPlotData()

     // The width and height fields here are 
     // specific to how the visualisation is
     // styled and displayed on the page. Feel
     // free to play with those values.
     //
     // The plot data is applied to the 'values'
     // field within the data object.
     //
     // Mark 'type' and 'extent' define the type
     // of plot and its coverage of the data.
     //
     // Encoding is how we connect our data
     // with the x and y axis of the graph (in this 
     // specific 2d graph at least. this
     // may change with other graph types that
     // don't rely on a 2d plane (such as a pie
     // graph.))
     //
     // To connect the data, each axis needs
     // to know the field of each document's 
     // data that either axis will represent. 
     //
     // We want the domain of values of the Y 
     // axis to reflect our different 'Species'
     // in a 'nominal' (alphabetical) fashion
     //
     // We also want the domain of values of
     // X to reflext the 'Body Mass (g)' with
     // a quantitative (numeric) type.
     const box_whiskers_spec = {
       width: "container",
       height: {"step": 30},
       data: {
         values: box_plot_data
       },
       mark: {
         type: "boxplot",
         extent: "min-max"
       },
       encoding: {
         y: { "field": "Species", "type": "nominal" },
         x: {
           field: "Body Mass (g)",
           type: "quantitative",
           scale: { "zero": false }
         }
       }
     }
    
     // Use our specification to generate a 
     // Vega graph within the HTML DOM element
     // with the id '#Graph'.
     vegaEmbed('#Graph', box_whiskers_spec);
   }

.. NOTE::

   *You must ensure that the field names encoded to your axis EXACTLY reflect the desired field names within
   the data that you provide as values. Note the field* ``Body Mass (g)`` *which is exactly as it is listed
   in our data.*

Now, if we put it all together, we should have an empty graph that is generated with the data that we uploaded
to the Elasticsearch penguins index.

.. code:: JSX

   import logo from './logo.svg';
   import './App.css';
   import { useState } from 'react';
   import { useEffect } from 'react';

   function App() {

     const [ last_elastic_response, setLastElasticResponse ] = useState({});
 
     async function getBoxPlotData() {
       var data = []
       
       const url = 'http://localhost:3001/index/penguins/docs/all'
       const response = await fetch(url)
       const elastic_json = await response.json()

       elastic_json.forEach((each_document) => {
         data.push(each_document._source)
       })

       return data
     }

     async function drawBoxWhiskersPlot() {
       const plot_data = getBoxPlotData()

     const box_whiskers_spec = {
       width: "container",
       height: {"step": 30},
       data: {
         values: box_plot_data
       },
       mark: {
         type: "boxplot",
         extent: "min-max"
       },
       encoding: {
         y: { "field": "Species", "type": "nominal" },
         x: {
           field: "Body Mass (g)",
           type: "quantitative",
           scale: { "zero": false }
         }
       }
     }
    
     vegaEmbed('#Graph', box_whiskers_spec);
     }

     useEffect(() => {
       (async () => {
          drawBoxWhiskersPlot()
       })();
     }, []);

     useEffect(() => {
       (async () => {
          drawBoxWhiskersPlot()
       })();
     }, [last_elastic_response]);

     return (
       <div className="App">
         <header className="App-header">
           <div id="Graph"></div>
         </header>
       </div>
     )
   }

   export default App;
