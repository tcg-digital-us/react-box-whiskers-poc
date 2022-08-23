
Create A Basic React application
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Now for the React site itself. to get started, we will use npm to create
a new React app:

.. code:: bash

   $ cd ~/
   $ mkdir elastic-react
   $ cd ./elastic-react
   $ npx create-react-app . -y

No other modules are needed thankfully, so we can go ahead and begin
editing our React app in App.js (first delete the contents of the App
function). We want to keep it simple, we only need to display the
returned JSON, so to start off we will create a very simple return that
displays the stringified response we will be getting from Elasticsearch:

.. code:: JSX

   function App() {
     return (
       <div className="App">
         <header className="App-header">
           {JSON.stringify(elastic_response)}
         </header>
       </div>
     );
   }

We will provide a state to keep track of the Elasticsearch response so
that every time the response changes our module is re-rendered:

.. code:: JSX

   function App() {
     // Initialize the response to an empty JSON object.
     const [elastic_response, setElasticResponse] = useState({});

     return (
       <div className="App">
         <header className="App-header">
           {JSON.stringify(elastic_response)}
         </header>
       </div>
     )
   }

Next, we will add a single effect to the App module that will run once
upon loading the module. This will make a fetch request to the backend
we set up earlier so that we can set the elastic_response state to the
response, causing the module to re-render with the appropriate info:

.. code:: JSX

   function App() {
     const [elastic_response, setElasticResponse] = useState({});

     useEffect(() => {
       // Here we are defining and running an anonymous function
       // since only function objects can be provided to useEffect, 
       // not promises, and we need to wait for the backend to respond.
       (async () => {
         const response = await fetch('http://localhost:3001/status');
         const elastic_json = await response.json();

         // Set the elastic_response state using the setter provided.
         setElasticResponse(elastic_json);
       })();
     }, []); // An empty dependncy array causes the effect to run 
     //only once, when our module is initially attached to the application.

     return (
       <div className="App">
         <header className="App-header">
           {JSON.stringify(elastic_response)}
         </header>
       </div>
     )
   }

We should now be at a point now where if we ran everything we have setup
thus far, we would have a React webpage that displays the JSON returned
from Elasticsearch. We can take this a little further now with Vega to
create a very basic visualisation that is based off of Elasticsearch
data.
