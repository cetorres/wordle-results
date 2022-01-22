import React, { useState, useEffect } from "react";
import './App.css';

function App() {
  const [results, setResults] = useState([]);

  function addResult(e) {
    e.preventDefault();

    try {
      const newResultText = e.target.resultText.value.trim().split('\n');
      const number = newResultText[0].split(' ')[1];
      const tries = newResultText[0].split(' ')[2];
      newResultText.shift();
      const resultEmojis = newResultText.join('\n').trim();
      const word = e.target.word.value.trim().toUpperCase();
      const date = new Date(e.target.date.value); //new Date();

      const newResult = {
        number: number,
        result: resultEmojis,
        tries: tries,
        date: date,
        word: word
      };

      setResults([...results, newResult]);
      saveToLocaStorage([...results, newResult]);
    
      e.target.resultText.value = '';
      e.target.word.value = '';
      e.target.date.value = null;
    }
    catch (error) {
      console.log('Error', error);
      alert('Please enter a valid Wordle share text.');
    }
  }

  function saveToLocaStorage(value) {
    const json = JSON.stringify(value);
    localStorage.setItem("results", json);
  }

  function removeResult(number) {
    const filteredResults = results.filter((result) => result.number !== number);
    setResults(filteredResults);
    saveToLocaStorage(filteredResults);
  }

  useEffect(() => {
    const json = localStorage.getItem("results");
    const savedResults = JSON.parse(json);
    if (savedResults) {
      setResults(savedResults);
    }
  }, []);

  return (
    <div className="App">
      <div class='inner-container'>
        <h2>Wordle Results History</h2>

        <form onSubmit={addResult}>
          <div>
            <label for="resultText">Result (paste from Wordle share option)</label>
            <textarea id='resultText' required={true} rows={11} cols={24}></textarea>
          </div>
          <div>
            <label for="word">Word</label>
            <input type='text' required={true} id='word' />
          </div>
          <div>
            <label for="date">Date</label>
            <input type='datetime-local' required={true} id='date' />
          </div>
          <div class='submit'>
            <input type='submit' value='Save' />
          </div>
        </form>

        <div class='resultList'>
          <h3>Saved Results</h3>
          <div>
            <table border={1}>
              <thead><tr><td>Number</td><td>Tries</td><td>Result</td><td>Word</td><td>Date</td><td></td></tr></thead>
              <tbody>
                {results.sort((r1, r2) => r2.number - r1.number).map((result, i) => <tr key={i}>
                  <td>{result.number}</td>
                  <td>{result.tries}</td>
                  <td><pre>{result.result}</pre></td>
                  <td>{result.word}</td>
                  <td>{(new Date(result.date)).toLocaleString()}</td>
                  <td><button onClick={() => removeResult(result.number)}>X</button></td>
                </tr>)}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
