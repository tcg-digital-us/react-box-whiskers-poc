
All
<<<

Get a list of all documents (up to a given max size) from a given index.

.. panels::
   :container: container-lg pb-3
   :column: col-lg-12 p-2

   :badge:`GET,badge-primary` /index/{index_name}/docs/all?size=500

**Parameters:**

* index_name - Name of index whose documents will be fetched.

* size - (optional) Size of JSON list to be returned (default is 500).

**Code:**

.. code:: javascript

   app.get("/index/:name/docs/all", (req, res) => {

     const index_name = req.params.name
     const return_size = req.query.size

     if (!index_name) {
       res.json({ "error": "Backend API '/index/{index_name}/docs/all' requires path parameter 'index_name' and query parameter 'size'." })
     } else {

       if (!return_size) { return_size = 500 }

       client.search({
         index: index_name,
         size: return_size
       }).then((es_res) => {
         res.json(es_res.hits.hits)
       }).catch((es_err) => {
         res.json(es_err)
       })
     }
   })

.. IMPORTANT::

   *Notice that when we get the response in* ``.then()`` *we don't return its JSON,
   rather we have to return the list of hits for the search with* ``es_res.hits.hits`` *.*

.. NOTE::

   *If you want to return more than 10k hits, the size parameter will no longer work,
   and you will need to modify the implementation of this API call to do so.*

   As per the `Elasticsearch Search API Documentation <https://www.elastic.co/guide/en/elasticsearch/reference/current/search-search.html>`_: "By default, you cannot page through more than 10,000 hits using the from and size parameters. To page through more hits, use the search_after parameter".

.. dropdown:: CLI Curl Example

   .. code:: bash

      $ curl -X GET http://localhost:3001/index/penguins/docs/all?size=10

