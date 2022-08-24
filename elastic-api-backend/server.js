// ETqghg4gGz7Ocxq2Z1Nk

// elasticview setup 

// setting up cors

// # allow CORS requests from https://app.elasticvue.com
// http.cors.enabled: true
// http.cors.allow-origin: "*"

// # and if your cluster uses authorization:
// http.cors.allow-headers: X-Requested-With,Content-Type,Content-Length,Authorization

// setting up CA trust

// Chrome: Settings / Security and Privacy / Security / Manage certificates / Authorities Tab / Import / Select your CA / Check "Trust this CA to identify websites."
// Firefox: Settings / Privacy & Security / Certificates / View Certificates... / Authorities Tab / Import... / Select your CA / Check "Trust this CA to identify websites."

// For elasticsearch 8 import the file elasticsearch/config/certs/http_ca.crt

// curl --cacert '/home/donchocheese/tcg-digital/elasticsearch-8.3.3/config/certs/http_ca.crt' --user 'elastic:2halHiMGAkkLAig-bYi8' -X GET "https://localhost:9200/_cluster/health"

//========================================================================================
// add index via direct curl connection
//========================================================================================

// curl --cacert '/home/donchocheese/tcg-digital/elasticsearch-8.3.3/config/certs/http_ca.crt' --user 'elastic:2halHiMGAkkLAig-bYi8' -X PUT --header 'Content-Type: application/json' https://localhost:9200/boxplotdata -d '
// {
// "settings": {
//   "index": {
//     "number_of_shards": 1,
//     "number_of_replicas": 1
//   }
// },
// "mappings": {
//   "properties": {
//     "major_max": {
//       "type": "integer"
//     },
//     "major_min": {
//       "type": "integer"
//     },
//     "minor_max": {
//       "type": "integer"
//     },
//     "minor_min": {
//       "type": "integer"
//     },
//     "median": {
//       "type": "integer"
//     }
//   }
// }
// }'

//========================================================================================
// add index via backend connection
//========================================================================================

// curl -X PUT --header 'Content-Type: application/json' http://localhost:3001/index/new -d '
// {
// "index": "penguins",
// "settings": {
//   "index": {
//     "number_of_shards": 1,
//     "number_of_replicas": 1
//   }
// },
// "mappings": {
//   "properties": {
//     "Species": {
//       "type": "text"
//     },
//     "Island": {
//       "type": "text"
//     },
//     "Beak Length (mm)": {
//       "type": "float"
//     },
//     "Beak Depth (mm)": {
//       "type": "float"
//     },
//     "Flipper Length (mm)": {
//       "type": "float"
//     },
//     "Body Mass (g)": {
//       "type": "float"
//     },
//     "Sex": {
//       "type": "text"
//     }
//   }
// }
// }'

//========================================================================================
// add data to index via backend connection
//========================================================================================

// curl -X PUT --header 'Content-Type: application/json' http://localhost:3001/index/docs/add -d '
// {
// "name": "boxplotdata",
// "data": {
//   "major_max": 40,
//   "major_min": 12,
//   "minor_max": 31,
//   "minor_min": 20,
//   "median": 25
// }
// }'

//========================================================================================
// manual bulk upload via direct curl connection
//========================================================================================

// curl --cacert '/home/donchocheese/tcg-digital/elasticsearch-8.3.3/config/certs/http_ca.crt' --user 'elastic:ETqghg4gGz7Ocxq2Z1Nk' -X PUT --header 'Content-Type: application/json' https://localhost:9200/_bulk -d '
// { "index":{ "_index": "penguins"} }
// { "Species": "Adelie", "Island": "Torgersen", "Beak Length (mm)": 39.1, "Beak Depth (mm)": 18.7, "Flipper Length (mm)": 181, "Body Mass (g)": 3750, "Sex": "MALE" }
// { "index":{ "_index": "penguins"} }
// { "Species": "Adelie", "Island": "Torgersen", "Beak Length (mm)": 39.5, "Beak Depth (mm)": 17.4, "Flipper Length (mm)": 186, "Body Mass (g)": 3800, "Sex": "FEMALE" }
// '

//========================================================================================
// dynamic file bulk upload to index via backend connection
//========================================================================================

// curl -X PUT --header 'Content-Type: application/json' http://localhost:3001/index/docs/import -d '
// {
// "index": "penguins",
// "file": "/home/donchocheese/tcg-digital/penguins.json"
// }'

// curl --cacert '/path_to_cert/elasticsearch-8.3.3/config/certs/http_ca.crt' --user 'elastic:password' -X POST --header 'Content-Type: application/json' https://localhost:9200/penguins/_delete_by_query -d '
// {
//     "query" : { 
//         "match_all" : {}
//     }
// }'

import Express from 'express';
import cors from 'cors';

import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const { Client } = require('@elastic/elasticsearch');
const fs = require('fs');

// const password = 'ETqghg4gGz7Ocxq2Z1Nk'
const password = 'Mi-k86jL1=uK8y8vj=Rc'

const client = new Client({
  node: 'https://localhost:9200',
  auth: {
    username: 'elastic',
    password: password
  },
  tls: { // This is necessary for defining where elasticsearch's self-signed certs are at
    ca: fs.readFileSync('/home/donchocheese/tcg-digital/react-vega-elasticsearch/elasticsearch-8.3.3/config/certs/http_ca.crt'),
    rejectUnauthorized: false
  }
})

const app = Express();
app.use(cors());

app.use(Express.json());
app.use(Express.urlencoded({ extended: true }));

app.get("/status", async (req, res) => {
  client.cluster.health().then((resres) => {
    res.json(resres);
  })
})

app.put("/index/new", (req, res) => {
  const spec = req.body

  if (!spec) {
    res.json({ "error": "spec is a required parameter." })
  } else {
    client.indices.create(spec)
      .then((resres) => {
        res.json(resres)
      }).catch((resres) => {
        res.json(resres)
      })
  }
})

app.get("/index/:name/count", (req, res) => {
  if (!req.params.name) {
    res.json({ "error": "index name is a required parameter." })
  } else {
    client.count({
      index: req.params.name
    }).then((resres) => {
      res.json(resres)
    }).catch((resres) => {
      res.json(resres)
    })
  }
})

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

app.put("/index/docs/add", (req, res) => {
  const name = req.body.name
  const data = req.body.data

  if (!name || !data) {
    res.json({ "error": "index name and data is a required parameter." })
  } else {
    console.log(JSON.stringify(data))
    client.index({
      index: name,
      document: data
    }).then((resres) => {
      client.indices.refresh({ index: name })
      res.json(resres)
    }).catch((resres) => {
      res.json(resres)
    })
  }
})

app.put("/index/docs/import", async (req, res) => {
  const index = req.body.index
  const type = req.body.type
  const filename = req.body.file
  const data = require(filename)

  const json_header = { "index":{ "_index": index} }

  if(type) {
    json_header['index']['_type'] = type
  }

  const operations = data.flatMap(doc => [json_header, doc])
  const bulkResponse = await client.bulk({ refresh: true, operations})

  if(bulkResponse.errors) {
    console.log(bulkResponse.errors)
    res.send('there was an error')
  }

  res.send('Finished writing temp file')
})

app.listen(3001, () => {
  console.log("listening on port 3001");
})