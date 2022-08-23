
Loading Datasets Into Elasticsearch
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

First before we start trying to incorporate data into our graph, we need to make sure that we have data in
our index to retrieve. Let's run our backend and use a couple of its routes to import our data and to check
the status of the index:

.. code:: bash 
  
   $ curl -X PUT --header 'Content-Type: application/json' http://localhost:3001/index/new -d '
   {
     "index": "penguins",
     "settings": {
       "index": {
         "number_of_shards": 1,
         "number_of_replicas": 1
       }
     },
     "mappings": {
       "properties": {
         "Species": {
           "type": "text"
         },
         "Island": {
           "type": "text"
         },
         "Beak Length (mm)": {
           "type": "float"
         },
         "Beak Depth (mm)": {
           "type": "float"
         },
         "Flipper Length (mm)": {
           "type": "float"
         },
         "Body Mass (g)": {
           "type": "float"
         },
         "Sex": {
           "type": "text"
         }
       }
     }
   }'

A summary JSON response should indicate that the call was successful:

.. code:: javascript

   {"acknowledged":true,"shards_acknowledged":true,"index":"penguins"}
 
Now to import the penguins data to our index:

.. code:: bash

   $ curl -X PUT --header 'Content-Type: application/json' http://localhost:3001/index/docs/import -d '
   {
     "index": "penguins",
     "file": "/path_to_file/penguins.json"
   }'

Another summary response in JSON format should show that the documents were uploaded properly:

.. code:: javascript
 
   { "status": "success" }

We can further check this by checking the count of the index:

.. code:: bash

   $ curl -X GET http://localhost:3001/index/penguins/count

.. code:: javascript

   {
     "count": 344,
     "_shards": {
       "total": 1,
       "successful": 1,
       "skipped": 0,
       "failed": 0
     }
   }