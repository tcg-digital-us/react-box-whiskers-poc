
Create a Vega Visualization in React
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

To start with, we need to install the Vega grammar:

.. code:: bash

   $ npm install vega vega-lite vega-embed

In ``src/App.js`` we need to import ``vega-embed`` after the other imports at
the top of our file:

.. code:: javascript

   ...
   import vegaEmbed from 'vega-embed'
   ...

Our visualization needs to be created in the effect that we added so
that we can get info from the elastic_json data that was returned and
build our graph with it.

To do this, we should modify our function ``updateElasticStatus()`` so that
rather than simply getting the status and setting it to a state, it gets the
status and draws the graph that we need injected into the JSX. First we will
rename ``updateElasticStatus()`` to ``drawBarGraph()``.

.. code:: JSX

   async function drawBarGraph() {
     const response = await fetch('http://localhost:3001/status')
     const elastic_json = await response.json()

     setElasticResponse(elastic_json)
   }

   useEffect(() => {
     drawBarGraph()
   }, [])

Since we are drawing the graph with Vega rather than displaying the status JSON
as a string in our returned view, we can remove the ``elastic_response`` state 
declaration, its setter in ``drawBarGraph()``, and its stringified JSON output in ``return()``:

.. code:: JSX

   function App() {

     async function drawBarGraph() {
       const response = await fetch('http://localhost:3001/status')
       const elastic_json = await response.json()
     }

     useEffect(() => {
       drawBarGraph()
     }, [])

     return (
       <div className="App">
         <header className="App-header">
         </header>
       </div>
     );
   }

Now we need to add the Vega specification for our graph and the call to render that
graph within our ``drawBarGraph()`` function. The specification provided for the bar graph is a schema
provided by Vega. We are pulling the metrics for our bar graph out of the JSON
returned by our backend ``/status`` call:

.. code:: JSX

   async function drawBarGraph() {
     const response = await fetch('http://localhost:3001/status')
     const elastic_json = await response.json()

     // This is the specification for a bar chart found and modified from
     // code in Vega's docs https://vega.github.io/vega-lite/docs/bar.html
     //
     // For the data values in the graph, there are three bars, and we
     // are getting the values for those three bars from the returned JSON object.
     //
     // Encoding will be mentioned later, but the vega documentation should
     // have everything you need https://vega.github.io/vega-lite/docs/
     let bar_graph_spec = {
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

     // Create a visualization and embed it in the html element with id 'Graph'
     // using our custom specification.
     vegaEmbed('#Graph', bar_graph_spec)
   }

Since we set Vega to embed under an HTML element with id 'Graph', we
need to add that HTML element to our returned JSX:

.. code:: JSX

   return (
     <div className="App">
       <header className="App-header">
         <div id="Graph"></div>
       </header>
     </div>
   );

Here is what App.js should end up looking like now:

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


And that's it for the initial setup! We should now be able to run Elasticsearch, 
our backend, and our frontend app in concert to display a Vega visualization built from
a basic request to our Elasticsearch-connected backend. It is easiest to do this with three
different terminals:

.. code:: bash

   # Terminal 1
   $ cd ~/vre-tutorial/elasticsearch-8.3.3
   $ ./bin/elasticsearch

.. code:: bash

   # Terminal 2
   $ cd ~/vre-tutorial/backend
   $ node .

.. code:: bash

   # Terminal 3
   $ cd ~/vre-tutorial/frontend
   $ npm start

The React server should automatically open a new web browser tab
displaying our web page with a simple Vega Bar Chart! 

If you have any errors, re-start all three applications, in the same order, giving Elasticsearch
enough time to show a green status before starting the backend. If the issue persits, please open an 
`issue on our GitHub repo <https://github.com/tcg-digital-us/react-vega-elasticsearch/issues>`_ and we will try to help.

Next we can do some work to update the elasticsearch data in real time,
which will redraw and update our visualization.

Resources
_________

* `Vega Grammar Documentation <https://vega.github.io/vega-lite/docs/>`_