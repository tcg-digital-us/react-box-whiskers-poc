Import
<<<<<<

Imports data contained inside a JSON file into an Elasticsearch index.

.. NOTE:: 

   This route definition assumes that the documents are not associated with
   a type. Adding functionality for discerning and uploading documents with
   uniform or varying types will be an excersize left for the reader.

.. panels::
   :container: container-lg pb-3
   :column: col-lg-12 p-2

   :badge:`PUT,badge-secondary` /index/{index_name}/docs/import

**Parameters**

* index_name - Name of index to which the documents will be imported.

* body - An object containing the filename from which the data will be uploaded.

  e.g.:

  .. code:: javascript

     {
       "file": "/path/to/penguins.json"
     }

The data that we plan to import is an array of JSON objects within ``penguins.json``,
and we will assume that currently this is the only data format that we
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
       "Species": "Adelie",
       "Island": "Torgersen",
       "Beak Length (mm)": 39.5,
       "Beak Depth (mm)": 17.4,
       "Flipper Length (mm)": 186,
       "Body Mass (g)": 3800,
       "Sex": "FEMALE"
     },
     ...
   ]

But elasticsearch's bulk function requires each document in the data to have the
index and, optionally, type defined for each document. You can see how this works with the
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

In javascript we will be creating an equivalent list to pass to the client:

.. code:: javascript

   [
    { index: { _index: "penguins" } },
    {
      "Species": "Adelie",
      "Island": "Torgersen",
      "Beak Length (mm)": 39.1,
      "Beak Depth (mm)": 18.7,
      "Flipper Length (mm)": 181,
      "Body Mass (g)": 3750,
      "Sex": "MALE"
    },
    { index: { _index: "penguins" } },
    {
      "Species": "Adelie",
      "Island": "Torgersen",
      "Beak Length (mm)": 39.5,
      "Beak Depth (mm)": 17.4,
      "Flipper Length (mm)": 186,
      "Body Mass (g)": 3800,
      "Sex": "FEMALE"
    },
    ...
   ]

By requiring the filename as a list of objects, we can use ``.flatMap()`` to 
map all of the new index identifying objects to each document, resulting
in a JSON array that we can provide to Elasticsearch for bulk upload.

**Code**

.. code:: javascript

   // Some parts of this route could be refactored/abstracted out for
   // more modularity, but this will be left up to the reader.
   app.put("/index/:name/docs/import", async (req, res) => {
     const index = req.params.name
     const filename = req.body.filename

     if (!index || !filename) {
       res.json({ "error": "Backend API '/index/{index_name}/docs/import' requires body parameter 'filename'" })
     } else {

       // We are assuming here that each entry in our penguins dataset belongs to the
       // same index, so we are giving each index definition the same value.
       const json_header = { "index": { "_index": index } }

       // Require doesn't return a promise, so we need to use a try/catch statement
       // to catch an error when loading and parsing the file.
       try {
         const data = require(filename)

         // Create a new list, associating the same json_header to each document.
         const bulk_operations = data.flatMap(doc => [json_header, doc])

         // If you check the .bulk() API, you will see that we can provide 'index'
         // as an argument here, but we don't need to given we have associated index
         // objects with each document. Refresh causes Elasticsearch to refresh itself 
         // after this import.
         client.bulk({
           refresh: true,
           operations: bulk_operations
         }).then((es_res) => {

           // On a successful import, get the count of the index and return that
           // as part of the success message.
           client.count({
             index: index
           }).then((count_res) => {
             const response = { "success": "index count is " + count_res.count }
             res.json(response)
           })
         }).catch((es_err) => {
           res.json(es_err)
         })
       } catch (e) {
         res.json(e)
       }
     }
   })

.. dropdown:: CLI Curl Example

   .. code:: bash

      $ curl -X PUT --header 'Content-Type: application/json' http://localhost:3001/index/penguins/docs/import -d '
      {
        "file": "/path/to/penguins.json"
      }'