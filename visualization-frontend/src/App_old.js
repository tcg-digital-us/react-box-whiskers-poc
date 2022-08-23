import logo from './logo.svg';
import './App.css';
import { useState } from 'react';
import { useEffect } from 'react';

function App() {
  const [elastic_response, setElasticResponse] = useState({});

  useEffect(() => {

    (async () => {
      const response = await fetch('http://localhost:3001/status');
      const elastic_json = await response.json();

      setElasticResponse(elastic_json);
    })();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        {JSON.stringify(elastic_response)}
      </header>
    </div>
  )
}