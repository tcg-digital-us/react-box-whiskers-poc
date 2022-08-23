
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

     const name = req.params.name

     if (!name) {
       res.json({ "error": "index name is a required parameter." })
     } else {
       client.count({
         index: name
       }).then((es_res) => {
         res.json(es_res)
       }).catch((es_err) => {
         res.json(es_err)
       })
     }
   })


   