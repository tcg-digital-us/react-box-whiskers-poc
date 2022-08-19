
Further Define the Backend API
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Now that we have a generic graph displayed using data retrieved from
Elasticsearch's 'status' call, we can change direction towards what we
are actually trying to accomplish. We need to use an actual dataset that
we can query data from that would be relevant in displaying to a box and
whiskers graph.

A freely available dataset that is perfect for our purposes is the
penguins dataset provided by (). A copy of this JSON file is also
available in the repo under the ``res`` folder. The data is an array of
JSON objects, so in effect we can import this file as a list of
documents to add to the index, but to do so we need to manipulate the
data in a way that makes Elasticsearch's bulk upload function happy.

Given this, we will be developing some API ends that are required for
our visualisation, and some others that are just for ease of use. The
functionalites for ease of use will be denoted as such, and they won't
have in-depth explanations (though, feel free to go through their code
and understand why they do what they do).

PUT: Import
^^^^^^^^^^^

CLI Functionality:
''''''''''''''''''

.. code:: bash

   curl --cacert '/path/to/elasticsearch-8.3.3/config/certs/http_ca.crt' --user 'elastic:ELASTIC_PASSWORD' -X PUT --header 'Content-Type: application/json' https://localhost:9200/_bulk -d '
   { "index":{ "_index": "penguins"} }
   { "Species": "Adelie", "Island": "Torgersen", "Beak Length (mm)": 39.1, "Beak Depth (mm)": 18.7, "Flipper Length (mm)": 181, "Body Mass (g)": 3750, "Sex": "MALE" }
   { "index":{ "_index": "penguins"} }
   { "Species": "Adelie", "Island": "Torgersen", "Beak Length (mm)": 39.5, "Beak Depth (mm)": 17.4, "Flipper Length (mm)": 186, "Body Mass (g)": 3800, "Sex": "FEMALE" }
   ...
   '

**Note:** *The trailing elipses in the JSON data should be removed, or
replaced with more pairs of index/document JSON objects!*

For uploading our data into elasticsearch it will be easiest to create
an API point to do this for us. Here the completed API route should be
appended to server.js:

.. code:: javascript

   app.put("/index/docs/import", async (req, res) => {
     const index = req.body.index
     const type = req.body.type
     const filename = req.body.file
     const data = require(filename)

     const json_header = { "index":{ "_index": index} }

     if(type) {
       json_header['index']['_type'] = type
     }

     const operations = data.flatMap(doc => [json_header, doc])
     const bulkResponse = await client.bulk({ refresh: true, operations})

     if(bulkResponse.errors) {
       console.log(bulkResponse.errors)
       res.send('there was an error')
     }

     res.send('Finished writing temp file')
   })
