
Create a Basic NodeJS Elasticsearch Backend
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

We now can set up a backend that provides a single API route that we can use to
interact with kibana.

.. code:: bash

   $ cd ~/vre-tutorial
   $ mkdir backend
   $ cd backend
   $ npm init -y

To ensure that the project will be run as an es6 module, we need to add
``"type": "module"`` to the package.json configuration. The ``...`` just
denotes that there may or may not be other values before and after the
type is defined (it just has to be defined at the same indent level as
'name'):

.. code:: javascript

   {
     "name": "backend",
     ...
     "type": "module",
     ...
   }

We will use Express to serve our routes, and the Elasticsearch
JavaScript client to communicate with our Elasticsearch instance. To get
around same-origin policy, we will use the cors module.

.. code:: bash

   $ npm install express cors @elastic/elasticsearch

Now, in a new file, ``index.js``, we can begin to put our backend together
by importing some of our es6 modules:

.. code:: javascript

   import Express from 'express'
   import cors from 'cors'

We will also need some non-module libraries as well. To enable the use
of ``require()`` in our code, we need to import the ``createRequire``
module and use it to require the other libraries we need:

.. code:: javascript

   // Allows us to import libraries using 'require()'
   import { createRequire } from 'module'
   const require = createRequire(import.meta.url)

   const { Client } = require('@elastic/elasticsearch')

   // For loading local files
   const fs = require('fs')

We can now create a new Elasticsearch connection client:

.. code:: javascript

   const url = 'https://localhost:9200'
   const user = 'elastic'

   // Change this to the password you copied from earlier.
   const pass = ''

   // Update with username with elasticsearch installed.
   const credential = '/home/{username}/elasticsearch-8.3.3/config/certs/http_ca.crt'

   // Use Elasticsearch's self-signed certs for tls:ca.
   const client = new Client({
     node: url,
     auth: {
       username: user,
       password: pass
     },
     tls: {
       ca: fs.readFileSync(credential),
       rejectUnauthorized: false
     }
   })

Now we can begin to develop our server application using Express. First
we set our application to a variable and use the cors library we
required to bypass SOP issues.

.. code:: javascript

   const app = Express()
   app.use(cors())

Also, we will cause our App to use two Express settings that will allow us to 
parse and access the JSON bodies that are sent to our API endpoints:

.. code:: javascript

   app.use(Express.json());
   app.use(Express.urlencoded({ extended: true }));


Next, we will add a single route to our application that will return 
a JSON response from Elasticsearch:

.. code:: javascript

   app.get("/status", async (req, res) => {
     client.cluster.health().then((es_res) => {
       res.json(es_res)
     }).catch((es_err) => {
       res.json(es_err)
     })
   })

Finally, we will add a listener for incoming requests and set it on port 3001,
given our eact application will be running on 3000:

.. code:: javascript

   app.listen(3001, () => {
     console.log('listening on port 3001!');
   })

Here is what we should end up with in ``index.js``:

.. code:: javascript

   import Express from 'express'
   import cors from 'cors'

   import { createRequire } from 'module'
   const require = createRequire(import.meta.url)
   const { Client } = require('@elastic/elasticsearch')
   const fs = require('fs')

   const url = 'https://localhost:9200'
   const user = 'elastic'
   const pass = ''
   const credential = '/home/{username}/elasticsearch-8.3.3/config/certs/http_ca.crt'

   const client = new Client({
     node: url,
     auth: {
       username: user,
       password: pass
     },
     tls: {
       ca: fs.readFileSync(credential),
       rejectUnauthorized: false
     }
   })

   const app = Express()
   app.use(cors())

   app.get("/status", async (req, res) => {
     client.cluster.health().then((es_res) => {
       res.json(es_res)
     }).catch((es_err) => {
       res.json(es_err)
     })
   })

   app.listen(3001, () => {
     console.log("listening on port 3001")
   })

This wraps it up for the backend! Later more routes can be added, but
for now, this will prove our connection works properly.
