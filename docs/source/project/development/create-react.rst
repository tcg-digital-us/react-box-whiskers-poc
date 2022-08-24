
Create A Basic React application
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Now for the React site itself. to get started, we will use npm to create
a new React app:

.. code:: bash

   $ cd ~/vre-tutorial
   $ mkdir frontend
   $ cd frontend
   $ npx create-react-app . -y

No other modules are needed thankfully, so we can go ahead and begin
editing our React app in ``src/App.js``, the first order of business being
to delete the entire contents of the App function that ``create-react-app``
generated for us. 

We want to keep it simple. We need to display the JSON data returned from our backend
``/status`` call as a string, so to start off we will create a very simple return that
displays the stringified response we will be getting from Elasticsearch:

.. code:: JSX

   function App() {
     return (
       <div className="App">
         <header className="App-header">
           { JSON.stringify(elastic_response) }
         </header>
       </div>
     );
   }

.. NOTE::

   The className's that you see here have already been defined 
   by ``create-react-app`` in the ``src/App.css`` file.

Calls made to a backend are asynchronous in nature, as after making the fetch
you must wait on the backend to respond. It makes sense then that when the
App module first loads, the elastic_response variable will be undefined and will 
display nothing on our page until our fetch call is completed. Once the call is 
complete, we will want to set ``elastic_response``, and we will
want its stringified value to be displayed in our view. 

React makes this easy to accomplish by using states to keep track of the variables 
whose changes we want to refresh our module or to cause other code to execute. We 
need to import this state functionality at the top of our file below the imports
that already exist (since many imports are available at the
``'react'`` level, we need to surround it in brackets):

.. code:: JSX

   ...
   import { useState } from 'react'
   ...

We will provide a state to keep track of the Elasticsearch response so
that every time the response changes our module is re-rendered:

.. code:: JSX

   function App() {
     // Initialize the response to an empty JSON object so that it
     // doesnt get initialized as undefined.
     const [elastic_response, setElasticResponse] = useState({})

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
response we get from Elasticsearch, causing the module to re-render
with the appropriate info. First we import the effect functionality from ``'react'``
alongside our ``useState`` import :

.. code:: JSX

   ...
   import { useState, useEffect } from 'react'
   ...

Now we can develop our effect that runs a new function called ``updateElasticStatus`` that
makes a fetch call to our ``/status`` API:

.. code:: JSX

   function App() {
     const [elastic_response, setElasticResponse] = useState({})
     
     async function updateElasticStatus() {
       const response = await fetch('http://localhost:3001/status')
       const elastic_json = await response.json()

       // Set the elastic_response state using the setter provided.
       setElasticResponse(elastic_json)
     }

     // useEffect requires two arguments, the function to be run, and
     // the dependency array to which the effect applies. This dependency
     // array is simply a list of the states that once changed will cause
     // this code to re-evaluate. In this case, an empty dependncy array 
     // causes the effect to run only once, when our module is initially 
     // attached to the application.
     useEffect(() => {
       updateElasticStatus()
     }, [])

     return (
       <div className="App">
         <header className="App-header">
           {JSON.stringify(elastic_response)}
         </header>
       </div>
     )
   }

.. NOTE:: 

   Make sure that your ``useEffect()`` call takes both the function and dependency
   array arguments -> ``useEffect(() => {}, [])`` .

The final contents of ``App.js`` should resemble:

.. code:: JSX 

   import logo from './logo.svg';
   import './App.css';
   import { useState, useEffect } from 'react'

   function App() {

     const [elastic_response, setElasticResponse] = useState({})

     async function updateElasticStatus() {
       const response = await fetch('http://localhost:3001/status')
       const elastic_json = await response.json()

       setElasticResponse(elastic_json)
     }

     useEffect(() => {
       updateElasticStatus()
     }, [])

     return (
       <div className="App">
         <header className="App-header">
           { JSON.stringify(elastic_response) }
         </header>
       </div>
     )
   }

   export default App;

We should now be at a point now where if we ran everything we have setup
thus far, we would have a React webpage that displays the JSON returned
from Elasticsearch, but We can take this a little further now with Vega to
create a very basic visualisation that is based off of Elasticsearch
data.
