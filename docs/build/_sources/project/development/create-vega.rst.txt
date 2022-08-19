
Create a Vega Visuialisation in React
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

To start with, we need to install and import Vega:

.. code:: bash

   $ npm install vega vega-lite vega-embed

In App.js we need to import ``vega-embed``:

.. code:: javascript

   ...
   import { useEffect } from 'react';
   import vegaEmbed from 'vega-embed';
   ...

Our visualisation needs to be created in the effect that we created so
that we can get info from the elastic_json data that was returned and
build our graph with it. The scehma provided is a basic bar graph schema
provided by Vega.

.. code:: javascript

     useEffect(() => {
       (async () => {
         const response = await fetch('http://localhost:3001');
         const elastic_json = await response.json();

         let yourVlSpec = {
           $schema: 'https://vega.github.io/schema/vega-lite/v5.json', // Default Vega bar chart.
           description: 'A simple bar chart with embedded data.',
           data: {
             values: [
               {Metric: 'Nodes', Count: elastic_json.number_of_nodes}, // We can directly reference the JSON fields available.
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
         
         vegaEmbed('#Graph', yourVlSpec); // Create a visualisation and embed it in the html element with id 'Graph' using our custom specification.

         setElasticResponse(elastic_json);
       })();
     }, []);

Since we set Vega to embed under an HTML element with id 'Graph', we
need to add that HTML element to our returned JSX:

.. code:: javascript
   :force:

     return (
       <div className="App">
         <header className="App-header">
           { JSON.stringify(elastic_response) }
           <div id="Graph"></div>
         </header>
       </div>
     );

Here is what App.js should end up looking like now:

.. code:: javascript
   :force:

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

   export default App;

And that's it! We should now be able to run Elasticsearch, our backend,
and our frontend app in concert to display a basic request to
Elasticsearch on our webpage. It is easiest to do this with three
different terminals:

.. code:: bash

   # Terminal 1
   $ ~/elasticsearch-8.3.3/bin/elasticsearch

.. code:: bash

   # Terminal 2
   $ cd ~/elastic-backend
   $ node .

.. code:: bash

   # Terminal 3
   $ cd ~/elastic-react
   $ npm start

The React server should automatically open a new web browser tab
displaying our web page with simple Vega visuaization! Next we can do
some work to update the elasticsearch data in real time, which will
redraw and update our visualisation.