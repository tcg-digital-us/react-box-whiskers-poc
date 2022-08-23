
All
<<<

Get a list of all documents (up to a given max size) from a given index.

.. panels::
   :container: container-lg pb-3
   :column: col-lg-12 p-2

   :badge:`GET,badge-primary` /index/{index_name}/docs/all?size={return_size}

**Parameters:**

* index_name - Name of index whose documents will be fetched.

* return_size - Size of JSON list to be returned (default is 500).

**Code:**

.. code:: javascript

   app.get("/index/:name/docs/all", (req, res) => {

      var index_name = req.params.name
      var return_size = req.query.size

      if (!index_name) {
         res.json({ "error": "index name is a required parameter." })
      } else {

         if(!return_size){ return_size = 500 }

         client.search({
            index: index_name,
            size: return_size
         }).then((resres) => {
            res.json(resres.hits.hits)
         }).catch((resres) => {
            res.json(resres)
         })
      }
   })

.. NOTE::

   *If you want to return more than 10k hits, the size parameter will no longer work,
   and you will need to modify the implementation of this API call to do so.*

   As per the `Elasticsearch Search API Documentation <https://www.elastic.co/guide/en/elasticsearch/reference/current/search-search.html>`_: "By default, you cannot page through more than 10,000 hits using the from and size parameters. To page through more hits, use the search_after parameter".