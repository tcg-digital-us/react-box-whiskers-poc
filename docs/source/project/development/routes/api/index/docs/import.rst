Import
<<<<<<

Imports data of a single type contained inside a JSON file into an Elasticsearch index.

.. panels::
   :container: container-lg pb-3
   :column: col-lg-12 p-2

   :badge:`PUT,badge-secondary` /index/docs/import

**Parameters**

* body - An object containing the index name, document type, and filename from
  which the data will be uploaded.

  e.g.:

  .. code:: javascript

     {
       "index": "penguins",
       "file": "/path_to_file/penguins.json"
     }

The data that we plan to import is an array of
JSON objects, and we will assume that currently this is the only data format that we
will be using to upload. We can import this file as a list of
documents to add to a penguins index, but to do so we need to manipulate the
data in a way that makes Elasticsearch's bulk upload function happy.

Currently the data is in the format:

.. code:: javascript

   [
     {
       "Species": "Adelie",
       "Island": "Torgersen",
       "Beak Length (mm)": 39.1,
       "Beak Depth (mm)": 18.7,
       "Flipper Length (mm)": 181,
       "Body Mass (g)": 3750,
       "Sex": "MALE"
     },
     {
       ...
     },
     ...
   ]

But elasticsearch's bulk function requires each document in the data to have the
index and type defined for each document. You can see how this works with the
command line equivalent of this API call:

Equivalent Elasticsearch CLI API Call:

.. code:: bash

   curl --cacert '/path/to/elasticsearch-8.3.3/config/certs/http_ca.crt' --user 'elastic:ELASTIC_PASSWORD' -X PUT --header 'Content-Type: application/json' https://localhost:9200/_bulk -d '
   { "index":{ "_index": "penguins"} }
   { "Species": "Adelie", "Island": "Torgersen", "Beak Length (mm)": 39.1, "Beak Depth (mm)": 18.7, "Flipper Length (mm)": 181, "Body Mass (g)": 3750, "Sex": "MALE" }
   { "index":{ "_index": "penguins"} }
   { "Species": "Adelie", "Island": "Torgersen", "Beak Length (mm)": 39.5, "Beak Depth (mm)": 17.4, "Flipper Length (mm)": 186, "Body Mass (g)": 3800, "Sex": "FEMALE" }
   ...
   '

In javascript though, the end product we will be providing will look more like this:

.. code:: javascript

   [
     [
       { "index":{ "_index": "penguins"} },
       { "Species": "Adelie", "Island": "Torgersen", "Beak Length (mm)": 39.1, "Beak Depth (mm)": 18.7, "Flipper Length (mm)": 181, "Body Mass (g)": 3750, "Sex": "MALE" }
     ],
     [
       { "index":{ "_index": "penguins"} }
       { "Species": "Adelie", "Island": "Torgersen", "Beak Length (mm)": 39.5, "Beak Depth (mm)": 17.4, "Flipper Length (mm)": 186, "Body Mass (g)": 3800, "Sex": "FEMALE" }
     ],
     ...
   ]

By importing the filename as a list of objects, we can use ``.flatMap()`` to 
map all of the index identifying objects we need to each document, resulting
in a JSON array that we can provide to Elasticsearch for bulk upload.

**Code**

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

----

All right! You are still here? Then onwards and oxwards!