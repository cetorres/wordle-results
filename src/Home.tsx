import React, { useState, useEffect, useRef } from "react";
import { exportToJsonFile, importFromJson, isIOS, loadFromLocalStorage, saveToLocaStorage } from "./Util";
import { Modal } from "bootstrap";
import { Result } from "./interfaces";
import { firebaseAuth, saveResultsToCurrentUser, loadResultsForCurrentUser, signInWithGoogle } from "./Firebase";
import { useAuthState } from "react-firebase-hooks/auth";

export default function Home(props: any) {
  const [results, setResults] = useState(Array<Result>());
  const [user, loading] = useAuthState(firebaseAuth);
  const [msgTitle, setMsgTitle] = useState('');
  const [msgBody, setMsgBody] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [msgBodyElement, setMsgBodyElement] = useState<JSX.Element>();
  const refFileUpload = useRef<HTMLInputElement>(null);
  const refDate = useRef<HTMLInputElement>(null);
  let modalNewResult: Modal;

  function openNewResult() {
    modalNewResult = new Modal(document.getElementById('modalNewResult')!);
    modalNewResult.show();
    setTimeout(() => {
      document.getElementById('resultText')?.focus();
      setDefaultDate();
    }, 500);
  }

  function onSubmitNewResultForm(e: any) {
    e.preventDefault();
    setErrorMsg('');

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
      const date = e.target.date.value;

      const newResult: Result = {
        number: number,
        result: resultEmojis,
        tries: tries,
        date: date,
        word: word
      };

      setResults([...results, newResult]);
      if (user) {
        saveResultsToCurrentUser([...results, newResult]);
      }
      else {
        saveToLocaStorage('results', [...results, newResult]);
      }
    
      e.target.resultText.value = '';
      e.target.word.value = '';
      setDefaultDate();

      setErrorMsg('');
      modalNewResult.hide();
    }
    catch (error: any) {
      setErrorMsg('Please enter a valid Wordle share text.');
    }
  }

  function removeResult(resultToDelete: Result) {
    if (window.confirm('Confirm delete this result?')) {
      const filteredResults = results.filter((res) => res !== resultToDelete);
      setResults(filteredResults);

      if (user) {
        saveResultsToCurrentUser(filteredResults);
      }
      else {
        saveToLocaStorage('results', filteredResults);
      }
    }
  }

  function exportData() {
    exportToJsonFile(results);
  }

  function importData() {
    refFileUpload.current?.click();
  }

  function handleFileUploadChange(this: any, e: any) {
    const fileObj = e.target.files[0];
    const reader = new FileReader();
    let fileloaded = (e: any) => {
      const importedResults = importFromJson(e.target.result);
      setResults(importedResults);

      if (user) {
        saveResultsToCurrentUser(importedResults);
      }
      else {
        saveToLocaStorage('results', importedResults);
      }
    }
    fileloaded = fileloaded.bind(this);
    reader.onload = fileloaded;
    reader.readAsText(fileObj);
  }

  function showModal(title: string, body?: string | null, bodyElement?: JSX.Element | null) {
    setMsgTitle(title);
    if (body) setMsgBody(body!); else setMsgBody('');
    if (bodyElement) setMsgBodyElement(bodyElement!); else setMsgBodyElement(undefined);
    const modalMessage = new Modal(document.getElementById('modalMessage')!);
    modalMessage.show();
  }

  function shareResult(resultToShare: Result) {
    const result = results.filter((res) => res === resultToShare)[0];
    const shareText = `Wordle ${result.number} ${result.tries}\n\n${result.result}`;
    navigator.clipboard.writeText(shareText);
    document.execCommand('copy', false, shareText);
    showModal('Share', null, <div>Result copied to the clipboard.<br/><br/><pre>{shareText}</pre></div>);
  }

  function setDefaultDate() {
    // Get current date and format as yyyy-MM-dd
    // So it can be set the date input as the default date
    const date = new Date();
    const dateString = date.getFullYear() + '-' + (date.getMonth()+1).toString().padStart(2, '0') + '-' + date.getDate().toString().padStart(2, '0');
    if (refDate) refDate.current!.defaultValue = dateString;
  }

  function formatString(date: string) {
    return date.split('T')[0];
  }

  async function loadResults() {
    if (user) {
      const savedResults = await loadResultsForCurrentUser();
      setResults(savedResults ?? []);
    }
    else {
      const savedResults = loadFromLocalStorage('results');
      if (savedResults) {
        setResults(savedResults ?? []);
      }
    }
  }

  useEffect(() => {
    loadResults();
  }, [user]);

  useEffect(() => {
    if (props.reloadPage) {
      props.setReloadPage(false);
      loadResults();
    }
  }, [props.reloadPage]);

  return (
    <div className='container'>
      <div className="row align-items-start mt-5">

        <div className="col-12 mb-4">

          <div className="d-flex justify-content-between">
            <h3>Saved Results</h3>
            <div>
              <div className="btn-group">
                <button type="button" className="btn btn-success btn-sm" onClick={openNewResult}><i className="bi bi-plus-lg"></i> New Result</button>
                <button type="button" className="btn btn-success btn-sm dropdown-toggle dropdown-toggle-split" id="dropdownMenuOptions" data-bs-toggle="dropdown" aria-expanded="false" data-bs-reference="parent">
                  <span className="visually-hidden">Toggle Dropdown</span>
                </button>
                <ul className="dropdown-menu" aria-labelledby="dropdownMenuOptions">
                  <li><button className="dropdown-item" onClick={importData}>Import JSON</button></li>
                  <li><button className={`dropdown-item ${!results || results.length <= 0 ? 'disabled' : ''}`} onClick={exportData}>Export JSON</button></li>
                </ul>
              </div>
              <input accept="application/json" ref={refFileUpload} onChange={handleFileUploadChange} multiple={false} hidden type="file" />
            </div>
          </div>

          <div className="table-responsive">
            <table className='table table-striped'>
              <thead><tr><td>Number</td><td>Tries</td><td>Result</td><td>Word</td><td>Date</td><td>Actions</td></tr></thead>
              <tbody>
                {results && results.sort((r1, r2) => r2.number - r1.number).map((result, i) => <tr key={i}>
                  <td>{result.number}</td>
                  <td>{result.tries}</td>
                  <td><pre>{result.result}</pre></td>
                  <td>{result.word}</td>
                  <td>{formatString(result.date)}</td>
                  <td>
                    <button className='btn btn-success btn-sm me-2 mb-2' title='Share' onClick={() => shareResult(result)}><i className="bi bi-share"></i></button>
                    <button className='btn btn-danger btn-sm mb-2' title='Delete' onClick={() => removeResult(result)}><i className="bi bi-x-lg"></i></button>
                  </td>
                </tr>)}
              </tbody>
            </table>
          </div>

          {loading && (!results || results.length <= 0) ?
            <div className='text-center mt-4'>
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          : ''}

          {!loading && (!results || results.length <= 0) ?
            <div className='d-grid d-md-flex justify-content-md-center mt-3'>
              <div className='text-center'>
                <button className="btn btn-outline-success" onClick={openNewResult}>No results yet. Click to add a new result.</button>
                {!user && isIOS() ?
                <div>
                  <div className='text-muted mb-1'>or</div>
                  <button className='btn btn-outline-success' onClick={signInWithGoogle}><i className="bi bi-google"></i>&nbsp;&nbsp;Sign in with Google</button>
                  <div className='text-muted mt-1'><small>If you want to save results with your Google accout.</small></div>
                </div>
                : ''}
              </div>
            </div> : ''}
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
                {msgBody}{msgBodyElement}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              </div>
            </div>
          </div>
        </div>

        {/* New Result Modal */}
        <div className="modal fade" id="modalNewResult" tabIndex={-1} aria-labelledby="modalLabel" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <form onSubmit={onSubmitNewResultForm}>
                <div className="modal-header">
                  <h5 className="modal-title" id="modalLabel">New Result</h5>
                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
                  <div className="alert alert-danger alert-dismissible fade show" hidden={errorMsg === ''} role="alert">
                    <strong>Error:</strong> {errorMsg}
                    <button type="button" className="btn-close" onClick={() => setErrorMsg('')} aria-label="Close"></button>
                  </div>
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
                    <input type='date' ref={refDate} required={true} id='date' className='form-control' />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                  <button type="submit" className="btn btn-success">Save</button>
                </div>
              </form>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}
