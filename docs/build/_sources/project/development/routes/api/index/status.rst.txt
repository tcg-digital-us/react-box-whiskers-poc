
Status
######

Get the status of a single index.

.. panels::
   :container: container-lg pb-3
   :column: col-lg-12 p-2

   :badge:`GET,badge-primary` /index/{index_name}/status

**Parameters:**

* index_name [string] - Name of index whose status will be fetched.

**Code**

.. code:: javascript

   app.get("/index/:name/status", (req, res) => {
      if (!req.params.name) {
         res.json({ "error": "index name is a required parameter." })
      } else {
         client.indices.get({
            index: req.params.name
         }).then((resres) => {
            res.json(resres)
         }).catch((resres) => {
            res.json(resres)
         })
      }
   })