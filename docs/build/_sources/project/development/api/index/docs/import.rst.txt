Import
******

.. code:: text

   PUT: /index/docs/import

Imports data contained inside a JSON file into an Elasticsearch index.

The data is an array of
JSON objects, so in effect we can import this file as a list of
documents to add to a penguins index, but to do so we need to manipulate the
data in a way that makes Elasticsearch's bulk upload function happy.

**Equivalent Elasticsearch CLI API Call**

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