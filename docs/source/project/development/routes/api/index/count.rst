
Count
######

Get the count of documents within a single index.

.. panels::
   :container: container-lg pb-3
   :column: col-lg-12 p-2

   :badge:`GET,badge-primary` /index/{index_name}/count

**Parameters:**

* index_name - Name of index whose size will be fetched.

**Code**

.. code:: javascript

   app.get("/index/:name/count", (req, res) => {

     const index_name = req.params.name

     if (!index_name) {
       res.json({ "error": "Backend API '/index/{index_name}/count' requires path parameter 'index_name'." })
     } else {
       client.count({
         index: index_name
       }).then((es_res) => {
         res.json(es_res)
       }).catch((es_err) => {
         res.json(es_err)
       })
     }
   })

.. dropdown:: CLI Curl Example

   .. code:: bash

      $ curl -X GET http://localhost:3001/index/penguins/count

