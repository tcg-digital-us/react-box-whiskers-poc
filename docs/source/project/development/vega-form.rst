
Develop Form For Data Submission and Integration Into Refreshed Vega Visualisation
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Our last major step is to include a form so that new data can be added to our
penguins data and displayed in our graph. To do this, we will set up a basic HTML 
form that when submitted, takes the input values and forms a requst body and calls
``/index/docs/add`` on our backend. DOM class names and id's will be connected to 
CSS styling later.

.. code:: JSX

   <form className="penguin_form" onSubmit={addDocToPenguinsIndex}>

     <h3>Add Document to Elasticsearch Index:</h3>

     <label htmlFor="species">Species:</label><br />
     <input className="penguin_form_text_input" type="text" id="species" name="species"></input><br />

     <label htmlFor="island">Island:</label><br />
     <input className="penguin_form_text_input" type="text" id="island" name="island"></input><br />

     <label htmlFor="beak_length">Beak Length (mm):</label><br />
     <input className="penguin_form_text_input" type="text" id="beak_length" name="beak_length"></input><br />

     <label htmlFor="beak_depth">Beak Depth (mm):</label><br />
     <input className="penguin_form_text_input" type="text" id="beak_depth" name="beak_depth"></input><br />

     <label htmlFor="flipper_length">Flipper Length (mm):</label><br />
     <input className="penguin_form_text_input" type="text" id="flipper_length" name="flipper_length"></input><br />

     <label htmlFor="body_mass">Body Mass (g):</label><br />
     <input className="penguin_form_text_input" type="text" id="body_mass" name="body_mass"></input><br />

     <label htmlFor="sex">Sex:</label><br />
     <input className="penguin_form_text_input" type="text" id="sex" name="sex"></input>

     <div id="penguin_form_submit"><input type="submit" value="Add Document"></input></div>
    
   </form>

Let us add this form, as well as some extra DOM divisions to our module's JSX. The 
extra divs just allow us to compartmentalize our DOM better for more styling. Also at
the end, we can print the current value of our ``last_elastic_response`` state for
debugging purposes:

.. code:: JSX
   :force:

   return (
     <div className="App">
       <header className="App-header">

         {/* Main page title */}
         <div id="title_header">
           <h1>Box And Whiskers Vega Visualisation in React with Elasticsearch</h1>
         </div>

         {/* Main card with graph and form */}
         <div id="graph_card">

           {/* Card title */}
           <h1>Penguin Data:</h1>

           {/* Graph title */}
           <h2>Body Mass Across Species</h2>

           {/* Container for Graph division.
               Lets us position/center the graph easier.*/}
           <div id="graph_container">
             <div id="Graph">
             </div>
           </div>

           {/* Form to add doc to index. */}
           <form className="penguin_form" onSubmit={addDocToPenguinsIndex}>
             <h3>Add Document to Elasticsearch Index:</h3>
             <label htmlFor="species">Species:</label><br />
             <input className="penguin_form_text_input" type="text" id="species" name="species"></input><br />

             <label htmlFor="island">Island:</label><br />
             <input className="penguin_form_text_input" type="text" id="island" name="island"></input><br />

             <label htmlFor="beak_length">Beak Length (mm):</label><br />
             <input className="penguin_form_text_input" type="text" id="beak_length" name="beak_length"></input><br />

             <label htmlFor="beak_depth">Beak Depth (mm):</label><br />
             <input className="penguin_form_text_input" type="text" id="beak_depth" name="beak_depth"></input><br />

             <label htmlFor="flipper_length">Flipper Length (mm):</label><br />
             <input className="penguin_form_text_input" type="text" id="flipper_length" name="flipper_length"></input><br />

             <label htmlFor="body_mass">Body Mass (g):</label><br />
             <input className="penguin_form_text_input" type="text" id="body_mass" name="body_mass"></input><br />

             <label htmlFor="sex">Sex:</label><br />
             <input className="penguin_form_text_input" type="text" id="sex" name="sex"></input>

             <div id="penguin_form_submit"><input type="submit" value="Add Document "></input></div>
           </form>
         </div>

         {/* Display the current value of last_elastic_response, and
             indent the JSON a-la prettify. */}
         <div id="elastic_response">
           <pre>{JSON.stringify(last_elastic_response, null, 4)}</pre>
         </div>
       </header>
     </div>
   )

Finally, we can now define the ``addDocToPenguinsIndex`` function that we provided to the
form's ``onSumbit`` event handler. Because ``onSumbit`` is an event handler, it will provide
``addDocToPenguinsIndex`` an argument ``event`` that contains the information regarding
the event that triggered the function. We can use this event to prevent the whole page
from reloading after form submission (the default behavior) and to get our form input
values out of. Then we can form the proper request body to provide to ``/index/docs/add``.
After a successful fetch request, we then set the ``last_elastic_response`` state to the
current fetch's response:

.. code:: JSX
   :force:

   function addDocToPenguinsIndex(event) {

     // block page reloading
     event.preventDefault()

     var request_data = {}

     // Build request_data object with our index and
     // the values provided in the form inputs via their id/name.
     request_data["name"] = "penguins"
     request_data["data"] = {}
     request_data["data"]["Species"] = event.target.species.value
     request_data["data"]["Island"] = event.target.island.value
     request_data["data"]["Beak Length (mm)"] = event.target.beak_length.value
     request_data["data"]["Beak Depth (mm)"] = event.target.beak_depth.value
     request_data["data"]["Flipper Length (mm)"] = event.target.flipper_length.value
     request_data["data"]["Body Mass (g)"] = event.target.body_mass.value
     request_data["data"]["Sex"] = event.target.sex.value

     // Because this is a PUT call, we provide fetch() both the
     // URL and the metadata for our PUT request.
     //
     // Ensure to stringify the JSON object before delivery.
     fetch('http://localhost:3001/index/docs/add', {
       method: "PUT",
       headers: {
         'Content-Type': 'application/json',
       },
       body: JSON.stringify(request_data),
     })
     .then((response) => {
       response.json().then((data) => {
         // Update the state, causing the module to refresh.
         setLastElasticResponse(data)
       })
     })
     .catch((error) => {
       console.error('Error:', error);
     });
   }

The final code for App.js should look something like this:

.. code:: JSX
   :force:

   import logo from './logo.svg';
   import './App.css';
   import { useState } from 'react';
   import { useEffect } from 'react';
   import vegaEmbed from 'vega-embed';

   function App() {

     const [ last_elastic_response, setLastElasticResponse ] = useState({});

     async function getBoxPlotData() {
       var data = []
       const url = 'http://localhost:3001/index/docs/all?name=penguins'
       const response = await fetch(url);
       const elastic_json = await response.json();
       elastic_json.forEach((each) => {
         data.push(each._source)
       })
       return data
     }

     async function DrawBoxPlot() {
       const box_plot_data = await getBoxPlotData();
       console.log(box_plot_data)

       let yourVlSpec = {
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

       vegaEmbed('#Graph', yourVlSpec);
     }

     useEffect(() => {
       (async () => {
         DrawBoxPlot()
       })();
     }, []);

     useEffect(() => {
       (async () => {
         DrawBoxPlot()
       })();
     }, [last_elastic_response]);

     function addDocToPenguinsIndex(event) {

       event.preventDefault()
       var request_data = {}

       request_data["name"] = "penguins"
       request_data["data"] = {}
       request_data["data"]["Species"] = event.target.species.value
       request_data["data"]["Island"] = event.target.island.value
       request_data["data"]["Beak Length (mm)"] = event.target.beak_length.value
       request_data["data"]["Beak Depth (mm)"] = event.target.beak_depth.value
       request_data["data"]["Flipper Length (mm)"] = event.target.flipper_length.value
       request_data["data"]["Body Mass (g)"] = event.target.body_mass.value
       request_data["data"]["Sex"] = event.target.sex.value

       fetch('http://localhost:3001/index/docs/add', {
         method: "PUT",
         headers: {
           'Content-Type': 'application/json',
         },
         body: JSON.stringify(request_data),
       })
       .then((response) => {
         response.json().then((data) => {
           console.log(data)
           setLastElasticResponse(data)
         })
       })
       .catch((error) => {
         console.error('Error:', error);
       });
     }

     return (
       <div className="App">
         <header className="App-header">
           <div id="title_header">
             <h1>Box And Whiskers Vega Visualisation in React with Elasticsearch</h1>
           </div>
           <div id="graph_card">
             <h1>Penguin Data:</h1>
             <h2>Body Mass Across Species</h2>
             <div id="graph_container">
               <div id="Graph">
               </div>
             </div>
             <form className="penguin_form" onSubmit={addDocToPenguinsIndex}>
               <h3>Add Document to Elasticsearch Index:</h3>
               <label htmlFor="species">Species:</label><br />
               <input className="penguin_form_text_input" type="text" id="species" name="species"></input><br />

               <label htmlFor="island">Island:</label><br />
               <input className="penguin_form_text_input" type="text" id="island" name="island"></input><br />

               <label htmlFor="beak_length">Beak Length (mm):</label><br />
               <input className="penguin_form_text_input" type="text" id="beak_length" name="beak_length"></input><br />

               <label htmlFor="beak_depth">Beak Depth (mm):</label><br />
               <input className="penguin_form_text_input" type="text" id="beak_depth" name="beak_depth"></input><br />

               <label htmlFor="flipper_length">Flipper Length (mm):</label><br />
               <input className="penguin_form_text_input" type="text" id="flipper_length" name="flipper_length"></input><br />

               <label htmlFor="body_mass">Body Mass (g):</label><br />
               <input className="penguin_form_text_input" type="text" id="body_mass" name="body_mass"></input><br />

               <label htmlFor="sex">Sex:</label><br />
               <input className="penguin_form_text_input" type="text" id="sex" name="sex"></input>

               <div id="penguin_form_submit"><input type="submit" value="Add Document "></input></div>
             </form>
           </div>

           <div id="elastic_response">
             <pre>{JSON.stringify(last_elastic_response, null, 4)}</pre>
           </div>
         </header>
       </div>
     );
   }

   export default App;

Et Voila! Now, when running Elasticsearch, your backend, and then your frontend, you
should see your box and whiskers plot connected with Elasticsearch!