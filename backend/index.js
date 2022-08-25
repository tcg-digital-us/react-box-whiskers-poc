
import Express from 'express'
import cors from 'cors'

import { createRequire } from 'module'
const require = createRequire(import.meta.url)

const { Client } = require('@elastic/elasticsearch')
const fs = require('fs')

const url = 'https://localhost:9200'
const user = 'elastic'
const pass = '0swnype+rVRnx+vqFJfl'
const credential = '/home/donchocheese/vre_tutorial/elasticsearch-8.3.3/config/certs/http_ca.crt'

const client = new Client({
  node: url,
  auth: {
    username: user,
    password: pass
  },
  tls: {
    ca: fs.readFileSync(credential),
    rejectUnauthorized: false
  }
})

const app = Express()
app.use(cors())

app.use(Express.json());
app.use(Express.urlencoded({ extended: true }));

app.listen(3001, () => {
  console.log('listening on port 3001!')
})

app.get("/status", async (req, res) => {
  client.cluster.health().then((es_res) => {
    res.json(es_res)
  }).catch((es_err) => {
    res.json(es_err)
  })
})

app.put("/index/new", (req, res) => {

  const spec = req.body

  if (!spec) {
    res.json({ "error": "Backend API '/index/new' requires body parameter'spec'." })
  } else {
    client.indices.create(spec).then((es_res) => {
      res.json(es_res)
    }).catch((es_err) => {
      res.json(es_err)
    })
  }
})

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

app.get("/index/:name/docs/all", (req, res) => {

  const index_name = req.params.name
  var return_size = req.query.size

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

// Some parts of this route could be refactored/abstracted out for
// more modularity, but this will be left up to the reader.
app.put("/index/:name/docs/import", async (req, res) => {
  const index = req.params.name
  const filename = req.body.filename

  if (!index || !filename) {
    res.json({ "error": "Backend API '/index/{index_name}/docs/import' requires body parameter 'filename'" })
  } else {

    // We are assuming here that each entry in our penguins dataset belongs to the
    // same index, so we are giving each index definition the same value.
    const json_header = { "index": { "_index": index } }

    // Require doesn't return a promise, so we need to use a try/catch statement
    // to catch an error when loading the file.
    try {
      const data = require(filename)

      // Create a new list, associating the same json_header to each document.
      const bulk_operations = data.flatMap(doc => [json_header, doc])

      // If you check the .bulk() API, you will see that we can provide 'index'
      // as an argument here, but we don't need to given we have associated index
      // objects with each document. Refresh causes Elasticsearch to refresh itself 
      // after this import.
      client.bulk({
        refresh: true,
        operations: bulk_operations
      }).then((es_res) => {

        // On a successful import, get the count of the index and return that
        // as part of the success message.
        client.count({
          index: index
        }).then((es_res) => {
          const response = { "success": "index count is " + es_res.count }
          res.json(response)
        })
      }).catch((es_err) => {
        res.json(es_err)
      })
    } catch (e) {
      res.json(e)
    }
  }
})