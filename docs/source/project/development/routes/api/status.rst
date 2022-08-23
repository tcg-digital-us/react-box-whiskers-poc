

Status
++++++

Get the status of the running Elasticsearch instance as a whole.

.. panels::
   :container: container-lg pb-3
   :column: col-lg-12 p-2

   :badge:`GET,badge-primary` /status

**Code**

.. code:: javascript

   app.get("/status", async (req, res) => {
      client.cluster.health().then((resres) => {
         res.json(resres);
      })
   })
