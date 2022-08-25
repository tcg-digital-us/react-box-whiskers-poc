
Incorporate Real-Time Elasticsearch Data Into Vega Visualisation
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Now to start mucking around with the fun stuff. Last we left off the front end looked something like this:

.. code:: JSX

   import logo from './logo.svg';
   import './App.css';
   import { useState, useEffect } from 'react'
   import vegaEmbed from 'vega-embed'

   function App() {

     async function drawBarGraph() {
       const response = await fetch('http://localhost:3001/status')
       const elastic_json = await response.json()

       let bar_graph_spec = {
         $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
         description: 'A simple bar chart with embedded data.',
         data: {
           values: [
             { Metric: 'Nodes', Count: elastic_json.number_of_nodes },
             { Metric: 'Data Nodes', Count: elastic_json.number_of_data_nodes },
             { Metric: 'Active Primary Shards', Count: elastic_json.active_primary_shards }
           ]
         },
         mark: 'bar',
         encoding: {
           x: { field: 'Metric', type: 'ordinal' },
           y: { field: 'Count', type: 'quantitative' }
         }
       };

       vegaEmbed('#Graph', bar_graph_spec)
     }

     useEffect(() => {
       drawBarGraph()
     }, [])

     return (
       <div className="App">
         <header className="App-header">
           <div id="Graph"></div>
         </header>
       </div>
     )
   }

   export default App;

We used an effect without dependencies (by putting nothing in the dependency list ``[]``) to draw a bar graph when the
App module loads using Elasticsearch's status data fetched from our backend. After fetching the data, we display
the resulting graph in our DOM element with id ``Graph``.

We know in the grand scheme of things that we want to display a box-and-whiskers plot and a form for adding a new
document to our penguins index. When the App module is first loaded, it should make the calls necessary to get the 
list of all documents in the penguins index and display it in our graph.

When the form is submitted, we want to send the data in that form to our backend. Once that has finished, we want 
the module to re-evaluate some javascript that once again gets the now-updated data from the penguins index and
displays that data to the plot.

The easiest way to make a module reload in React, is to update a state. So one thing we can do is to store the 
response from each fetch call inside a single state, so this way when the last successful response changes we know
our index has been updated and our module should reload.

This just requires we add a new state. We can also remove our previous graph drawing code, given it is no longer 
relevant, and rename ``drawBarGraph()`` to ``drawBoxWhiskersPlot()`` to reflect our new goal:

.. code:: JSX

   function App() {

     const [ last_elastic_response, setLastElasticResponse ] = useState({})
 
     async function drawBoxWhiskersPlot() {
       const response = await fetch('http://localhost:3001/status')
       const elastic_json = await response.json()
     }

     useEffect(() => {
       drawBoxWhiskersPlot()
     }, [])

     return (
       <div className="App">
         <header className="App-header">
           <div id="Graph"></div>
         </header>
       </div>
     )
   }

Since we need code to be run in two effects - when the module loads for the first time, and when the ``last_elastic_response``
state changes - we will create a second effect below the first with ``last_elastic_response`` as a 
dependency that also calls ``drawBoxWhiskersPlot()``:

.. code:: JSX

   useEffect(() => {
     drawBoxWhiskersPlot()
   }, [last_elastic_response]);

The list that Elasticsearch returns when making a call to ``/index/penguins/docs/all`` contains the data we are
interested in, but we need to pull our document data out of each returned object in the list by accessing its ``_source`` field.
Because this requires a little bit more logic than before, we will abstract this out to another function ``getDocsFromIndex()``.
When calling ``getDocsFromIndex`` we should handle it with ``then`` and ``catch`` so that we can handle the case
that an error occured trying to connect to the backend:

.. code:: JSX

   async function getDocsFromIndex(index) {
     const response = await fetch(`http://localhost:3001/index/${index}/docs/all`)
     const elastic_json = await response.json()

     return elastic_json
   }

   async function drawBoxWhiskersPlot() {
     getDocsFromIndex('penguins').then((box_plot_data) => {
       // Draw plot.
     }).catch(() => {
       // Error
     })
   }

   // Runs only once, on module load.
   useEffect(() => {
     drawBoxWhiskersPlot()
   }, []);

   // Runs every time last_elastic_response state's value changes.
   useEffect(() => {
     drawBoxWhiskersPlot()
   }, [last_elastic_response]);

Now lets flesh-out ``getDocsFromIndex()`` further. For each element in the list that is returned from our fetch,
we need to grab the ``_source`` data, append it to a list of objects, and then return that list. This list of 
data will later be provided to Vega:

.. code:: JSX

   async function getDocsFromIndex(index) {
     var data = []

     // Default is 500. For another number set the 'size' query parameter.
     const url = `http://localhost:3001/index/${index}/docs/all`
     const response = await fetch(url)
     const elastic_json = await response.json()

     // Append the _source field of each document to the data[] list.
     elastic_json.forEach((each_document) => {
       data.push(each_document._source)
     })

     return data
   }

Moving on, we now get to create our Vega visualization. We have to create a Vega specification to provide to 
``vegaEmbed()`` for our box plot. Specifications can change greatly from one graph to the next, so I would very
much reccomend taking a look at the Vega documentation to get a good grasp on all of the specification fields
available. For our purposes, I will provide the specification with a comment explaining its makeup:

.. code:: JSX

   async function drawBoxWhiskersPlot() {
     const plot_index = 'penguins'

     getDocsFromIndex(plot_index).then((box_plot_data) => {
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
     }).catch(() => {
       console.log(`An error occured when trying to fetch /index/${plot_index}/docs/all`)
     })
   }

.. NOTE::

   You must ensure that the field names encoded to your axis EXACTLY reflect the desired field names within
   the data that you provide as values. Note the field ``Body Mass (g)`` which is exactly as it is listed
   in our data.

Now, if we put it all together, we should have a box-and-whiskers graph that is generated with the data that we uploaded
to the Elasticsearch penguins index.

.. code:: JSX

   import logo from './logo.svg';
   import './App.css';
   import { useState, useEffect } from 'react'
   import vegaEmbed from 'vega-embed'

   function App() {

     const [ last_elastic_response, setLastElasticResponse ] = useState({})
 
     async function getDocsFromIndex(index) {
       var data = []

       const url = `http://localhost:3001/index/${index}/docs/all`
       const response = await fetch(url)
       const elastic_json = await response.json()

       elastic_json.forEach((each_document) => {
         data.push(each_document._source)
       })

       return data
     }

     async function drawBoxWhiskersPlot() {
       const plot_index = 'penguins'

       getDocsFromIndex(plot_index).then((box_plot_data) => {

         const box_whiskers_spec = {
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
       }).catch(() => {
         console.log(`An error occured when trying to fetch /index/${plot_index}/docs/all`)
       })
     }

     useEffect(() => {
       drawBoxWhiskersPlot()
     }, []);

     useEffect(() => {
       drawBoxWhiskersPlot()
     }, [last_elastic_response])

     return (
       <div className="App">
         <header className="App-header">
           <div id="Graph"></div>
         </header>
       </div>
     )
   }

   export default App;
