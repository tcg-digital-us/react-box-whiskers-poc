
New
###

Creates a new index given the provided index schema.

.. panels::
   :container: container-lg pb-3
   :column: col-lg-12 p-2

   :badge:`PUT,badge-secondary` /index/new

**Parameters:**

* body - Specification for creating a new index. The provided object should comply
  with the IndicesCreateRequest type argument defined for ``client.indices.create()`` within the client API.

  e.g.:
  
  .. code:: javascript

     {
       "index": "names",
       "settings": {
         "index": {
           "number_of_shards": 1,
           "number_of_replicas": 1
         }
       },
       "mappings": {
         "properties": {
           "first": {
             "type": "text"
           },
           "last": {
             "type": "text"
           }
         }
       }
     }

**Code**

.. code:: javascript

   app.put("/index/new", (req, res) => {
   
     const spec = req.body 
 
     if (!spec) {
       res.json({ "error": "spec is a required parameter." })
     } else {
       client.indices.create(spec).then((es_res) => {
         res.json(es_res)
       }).catch((es_err) => {
         res.json(es_err)
       })
     }
   })