import React, { useState, useEffect } from "react";
import './App.css';
import { Modal } from "bootstrap";
import Nav from './Nav';

function App() {
  const [results, setResults] = useState([]);
  const [msgTitle, setMsgTitle] = useState('');
  const [msgBody, setMsgBody] = useState('');

  function addResult(e) {
    e.preventDefault();

    try {
      const newResultText = e.target.resultText.value.trim().split('\n');
      if (newResultText.length <= 0) {
        throw Error('Empty array.');
      }
      if (newResultText[0].split(' ')[0] !== 'Wordle') {
        throw Error('Wordle not found.');
      }
      const number = newResultText[0].split(' ')[1];
      const tries = newResultText[0].split(' ')[2];
      newResultText.shift();
      const resultEmojis = newResultText.join('\n').trim();
      const word = e.target.word.value.trim().toUpperCase();
      const date = new Date(e.target.date.value);

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
      showModal('Error', 'Please enter a valid Wordle share text. ' + error.message);
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

  function exportToJsonFile(jsonData) {
    let dataStr = JSON.stringify(jsonData);
    let dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

    let exportFileDefaultName = 'wordle-results-history.json';

    let linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  }

  function exportData() {
    exportToJsonFile(results);
  }

  function showModal(title, body) {
    setMsgTitle(title);
    setMsgBody(body);
    const modalMessage = new Modal(document.getElementById('modalMessage'));
    modalMessage.show();
  }

  useEffect(() => {
    const json = localStorage.getItem("results");
    const savedResults = JSON.parse(json);
    if (savedResults) {
      setResults(savedResults);
    }
  }, []);

  return (
    <main>
      <Nav />
      <div class='container'>
        <div class="row align-items-start mt-5">
        
          <div class="col-sm-3 col-12 mb-3">
            <h3>New Result</h3>
            <form onSubmit={addResult}>
              <div class="mb-3">
                <textarea id='resultText' class='form-control' required={true} rows={11} cols={24} aria-describedby="resultTextHelp"></textarea>
                <div id="resultTextHelp" class="form-text">Paste from Wordle share option.</div>
              </div>
              <div class="mb-3">
                <label for="word" class='form-label'>Word</label>
                <input type='text' required={true} id='word' class='form-control' />
              </div>
              <div class="mb-3">
                <label for="date" class='form-label'>Date</label>
                <input type='datetime-local' required={true} id='date' class='form-control' />
              </div>
              <input type='submit' class="btn btn-primary" value='Save' />
            </form>
          </div>

          <div class="col-sm-9 col-12 mb-4">
            <h3>Saved Results</h3>
            <div class="table-responsive">
              <table class='table table-striped'>
                <thead><tr><td>Number</td><td>Tries</td><td>Result</td><td>Word</td><td>Date</td><td></td></tr></thead>
                <tbody>
                  {results.sort((r1, r2) => r2.number - r1.number).map((result, i) => <tr key={i}>
                    <td>{result.number}</td>
                    <td>{result.tries}</td>
                    <td><pre>{result.result}</pre></td>
                    <td>{result.word}</td>
                    <td>{(new Date(result.date)).toLocaleString()}</td>
                    <td><button class='btn btn-danger btn-sm' onClick={() => removeResult(result.number)}><i class="bi bi-x-lg"></i></button></td>
                  </tr>)}
                </tbody>
              </table>
            </div>
            <div class="d-grid gap-2 d-md-flex justify-content-md-end">
                <button class='btn btn-primary' disabled={results.length === 0} onClick={exportData}>Export JSON</button>
              </div>
          </div>

          {/* Modal */}
          <div class="modal fade" id="modalMessage" tabindex="-1" aria-labelledby="modalLabel" aria-hidden="true">
            <div class="modal-dialog">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="modalLabel">{msgTitle}</h5>
                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                  {msgBody}
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </main>
  );
}

export default App;
