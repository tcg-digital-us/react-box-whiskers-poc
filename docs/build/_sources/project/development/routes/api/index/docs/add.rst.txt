
Add
<<<

Adds a single document to an index 


.. NOTE:: 

   *This function adds a document without specifying a type. Specifying a type could
   be done with a query parameter, but this will be an excersize left up to the reader.*

.. panels::
   :container: container-lg pb-3
   :column: col-lg-12 p-2

   :badge:`PUT,badge-secondary` /index/{index_name}/docs/add


**Parameters**

* index_name - Name of index to which the document will be added.

* body - An object containing the actual data to be added to the index.

  e.g.:

  .. code:: javascript

     {
       "value_1": 40,
       "value_2": 12,
       "value_3": 31,
     }

  .. NOTE::

     The data-fields of the data object must match the properties of the index that
     you are trying to add to, even if you are going to leave those fields empty.

**Code**

.. code:: javascript

   app.put("/index/:name/docs/add", (req, res) => {

     const name = req.params.name
     const data = req.body

     if (!name || !data) {
       res.json({ "error": "Backend API '/index/{index_name}/docs/add' requires path parameter 'name' and body content." })
     } else {
       client.index({
         index: name,
         document: data,
         refresh: true
       }).then((es_res) => {
         res.json(es_res)
       }).catch((es_err) => {
         res.json(es_err)
       })
     }
   })

.. dropdown:: CLI Curl Example

   .. code:: bash

      $ curl -X PUT --header 'Content-Type: application/json' http://localhost:3001/index/penguins/docs/add -d '
      {
        "Species": "Emperor",
        "Island": "Snow Hill",
        "Beak Length (mm)": 39.4,
        "Beak Depth (mm)": 18.2,
        "Flipper Length (mm)": 182,
        "Body Mass (g)" 3720,
        "Sex": "MALE"
      }'