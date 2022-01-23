import React, { useState, useEffect } from "react";
import { exportToJsonFile, loadFromLocalStorage, saveToLocaStorage } from "./Util";
import { Modal } from "bootstrap";

interface Result {
  number: number;
  result: string;
  tries: string;
  date: Date;
  word: string;
}

export default function Home() {
  const [results, setResults] = useState(Array<Result>());
  const [msgTitle, setMsgTitle] = useState('');
  const [msgBody, setMsgBody] = useState('');

  function addResult(e: any) {
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

      const newResult: Result = {
        number: number,
        result: resultEmojis,
        tries: tries,
        date: date,
        word: word
      };

      setResults([...results, newResult]);
      saveToLocaStorage('results', [...results, newResult]);
    
      e.target.resultText.value = '';
      e.target.word.value = '';
      e.target.date.value = null;
    }
    catch (error: any) {
      showModal('Error', 'Please enter a valid Wordle share text. ' + error.message);
    }
  }

  function removeResult(number: number) {
    const filteredResults = results.filter((result) => result.number !== number);
    setResults(filteredResults);
    saveToLocaStorage('results', filteredResults);
  }

  function exportData() {
    exportToJsonFile(results);
  }

  function showModal(title: string, body: string) {
    setMsgTitle(title);
    setMsgBody(body);
    const modalMessage = new Modal(document.getElementById('modalMessage')!);
    modalMessage.show();
  }

  useEffect(() => {
    const savedResults = loadFromLocalStorage('results');
    if (savedResults) {
      setResults(savedResults);
    }
  }, []);

  return (
    <div className='container'>
      <div className="row align-items-start mt-5">
      
        <div className="col-sm-3 col-12 mb-3">
          <h3>New Result</h3>
          <form onSubmit={addResult}>
            <div className="mb-3">
              <textarea id='resultText' className='form-control' required={true} rows={11} cols={24} aria-describedby="resultTextHelp"></textarea>
              <div id="resultTextHelp" className="form-text">Paste from Wordle share option.</div>
            </div>
            <div className="mb-3">
              <label htmlFor="word" className='form-label'>Word</label>
              <input type='text' required={true} id='word' className='form-control' />
            </div>
            <div className="mb-3">
              <label htmlFor="date" className='form-label'>Date</label>
              <input type='datetime-local' required={true} id='date' className='form-control' />
            </div>
            <input type='submit' className="btn btn-primary" value='Save' />
          </form>
        </div>

        <div className="col-sm-9 col-12 mb-4">
          <h3>Saved Results</h3>
          <div className="table-responsive">
            <table className='table table-striped'>
              <thead><tr><td>Number</td><td>Tries</td><td>Result</td><td>Word</td><td>Date</td><td></td></tr></thead>
              <tbody>
                {results.sort((r1, r2) => r2.number - r1.number).map((result, i) => <tr key={i}>
                  <td>{result.number}</td>
                  <td>{result.tries}</td>
                  <td><pre>{result.result}</pre></td>
                  <td>{result.word}</td>
                  <td>{(new Date(result.date)).toLocaleString()}</td>
                  <td><button className='btn btn-danger btn-sm' onClick={() => removeResult(result.number)}><i className="bi bi-x-lg"></i></button></td>
                </tr>)}
              </tbody>
            </table>
          </div>
          <div className="d-grid gap-2 d-md-flex justify-content-md-end">
            <button className='btn btn-primary' disabled={results.length === 0} onClick={exportData}>Export JSON</button>
          </div>
        </div>

        {/* Modal */}
        <div className="modal fade" id="modalMessage" tabIndex={-1} aria-labelledby="modalLabel" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="modalLabel">{msgTitle}</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                {msgBody}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              </div>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}