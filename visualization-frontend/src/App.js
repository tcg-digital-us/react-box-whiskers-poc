import logo from './logo.svg';
import './App.css';
import { useState } from 'react';
import { useEffect } from 'react';
import vegaEmbed from 'vega-embed';

function App() {

  const [ last_elastic_response, setLastElasticResponse ] = useState({});

  async function getBoxPlotData() {
    var data = []
    const url = 'http://localhost:3001/index/docs/all?name=penguins'
    const response = await fetch(url);
    const elastic_json = await response.json();
    elastic_json.forEach((each) => {
      data.push(each._source)
    })
    return data
  }

  async function DrawBoxPlot() {
    const box_plot_data = await getBoxPlotData();
    console.log(box_plot_data)

    let yourVlSpec = {
      width: "container",
      height: {"step": 30},
      data: {
        values: box_plot_data
      },
      mark: {
        type: "boxplot",
        extent: "min-max"
      },
      encoding: {
        y: { "field": "Species", "type": "nominal" },
        x: {
          field: "Body Mass (g)",
          type: "quantitative",
          scale: { "zero": false }
        }
      }
    }

    vegaEmbed('#Graph', yourVlSpec);
  }

  useEffect(() => {
    (async () => {
      DrawBoxPlot()
    })();
  }, []);

  useEffect(() => {
    (async () => {
      DrawBoxPlot()
    })();
  }, [last_elastic_response]);

  function addDocToPenguinsIndex(event) {

    // block page reloading
    event.preventDefault()

    // { "Species": "Adelie", "Island": "Torgersen", "Beak Length (mm)": 39.1, "Beak Depth (mm)": 18.7, "Flipper Length (mm)": 181, "Body Mass (g)": 3750, "Sex": "MALE" }

    var request_data = {}

    request_data["name"] = "penguins"
    request_data["data"] = {}
    request_data["data"]["Species"] = event.target.species.value
    request_data["data"]["Island"] = event.target.island.value
    request_data["data"]["Beak Length (mm)"] = event.target.beak_length.value
    request_data["data"]["Beak Depth (mm)"] = event.target.beak_depth.value
    request_data["data"]["Flipper Length (mm)"] = event.target.flipper_length.value
    request_data["data"]["Body Mass (g)"] = event.target.body_mass.value
    request_data["data"]["Sex"] = event.target.sex.value

    fetch('http://localhost:3001/index/docs/add', {
      method: "PUT",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request_data),
    })
    .then((response) => {
      response.json().then((data) => {
        console.log(data)
        setLastElasticResponse(data)
      })
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  }

  return (
    <div className="App">
      <header className="App-header">
        <div id="title_header">
          <h1>Box And Whiskers Vega Visualisation in React with Elasticsearch</h1>
        </div>
        <div id="graph_card">
          <h1>Penguin Data:</h1>
          <h2>Body Mass Across Species</h2>
          <div id="graph_container">
            <div id="Graph">
            </div>
          </div>
          <form className="penguin_form" onSubmit={addDocToPenguinsIndex}>
            <h3>Add Document to Elasticsearch Index:</h3>
            <label htmlFor="species">Species:</label><br />
            <input className="penguin_form_text_input" type="text" id="species" name="species"></input><br />

            <label htmlFor="island">Island:</label><br />
            <input className="penguin_form_text_input" type="text" id="island" name="island"></input><br />

            <label htmlFor="beak_length">Beak Length (mm):</label><br />
            <input className="penguin_form_text_input" type="text" id="beak_length" name="beak_length"></input><br />

            <label htmlFor="beak_depth">Beak Depth (mm):</label><br />
            <input className="penguin_form_text_input" type="text" id="beak_depth" name="beak_depth"></input><br />

            <label htmlFor="flipper_length">Flipper Length (mm):</label><br />
            <input className="penguin_form_text_input" type="text" id="flipper_length" name="flipper_length"></input><br />

            <label htmlFor="body_mass">Body Mass (g):</label><br />
            <input className="penguin_form_text_input" type="text" id="body_mass" name="body_mass"></input><br />

            <label htmlFor="sex">Sex:</label><br />
            <input className="penguin_form_text_input" type="text" id="sex" name="sex"></input>

            <div id="penguin_form_submit"><input type="submit" value="Add Document "></input></div>
          </form>
        </div>

        <div id="elastic_response">
          <pre>{JSON.stringify(last_elastic_response, null, 4)}</pre>
        </div>
      </header>
    </div>
  );
}

export default App;
