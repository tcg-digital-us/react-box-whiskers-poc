
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

   $ curl -X PUT --header 'Content-Type: application/json' http://localhost:3001/index/penguins/docs/import -d '
   {
     "filename": "/path/to/penguins.json"
   }'

Another summary response in JSON format should show that the documents were uploaded properly:

.. code:: javascript
 
   {"success":"index count is 344"}

.. NOTE::

   If you get the error:

   .. code:: javascript

      {"code":"MODULE_NOT_FOUND","requireStack":["/some/path/to/file.js"]}

   Then it is highly likely that your filepath pointing to the penguins.json file is incorrect.
   
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