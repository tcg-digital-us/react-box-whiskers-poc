
Add
<<<

Adds a single document to an index.

.. panels::
   :container: container-lg pb-3
   :column: col-lg-12 p-2

   :badge:`PUT,badge-secondary` /index/docs/add


**Parameters**

* body - An object containing two values, the first being the name of the index to
  add to, and the second being the actual data to be added to the index.

  e.g.:

  .. code:: javascript

     {
       "name": "index_to_add_to",
       "data": {
         "value_1": 40,
         "value_2": 12,
         "value_3": 31,
         ...
       }
     }

  .. NOTE::

     The data-fields of the data object must match the properties of the index that
     you are trying to add to, even if you are going to leave those fields empty.

**Code**

.. code:: javascript

   app.put("/index/docs/add", (req, res) => {

     const name = req.body.name
     const data = req.body.data  

     if (!name || !data) {
       res.json({ "error": "index name and data is a required parameter." })
     } else {
       client.index({
         index: name,
         document: data
       }).then((es_res) => {

         // Refresh the index after adding so that it is aware of our changes.
         client.indices.refresh({ index: name })
         res.json(es_res)
       }).catch((es_err) => {
         res.json(es_err)
       })
     }
   })
