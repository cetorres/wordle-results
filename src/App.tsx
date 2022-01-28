import React, { useEffect, useState } from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import Home from './Home';
import About from "./About";
import Nav from './Nav';
import './App.css';
import Statistics from "./Statistics";
import { firebaseApp, firebaseAnalytics, loadResultsForCurrentUser, firebaseAuth, saveResultsToCurrentUser } from './Firebase';
import { Result } from "./interfaces";
import { loadFromLocalStorage, saveToLocaStorage } from "./Util";
import { useAuthState } from "react-firebase-hooks/auth";

function App() {
  const [results, setResults] = useState(Array<Result>());
  const [user, loading] = useAuthState(firebaseAuth);
  
  async function loadResults() {
    if (user) {
      const savedResults = await loadResultsForCurrentUser();
      setResults(savedResults ?? []);
    }
    else {
      const savedResults = loadFromLocalStorage('results');
      setResults(savedResults ?? []);
    }
  }

  async function saveResults(newResults: Result[]) {
    setResults(newResults);
    if (user) {
      saveResultsToCurrentUser(newResults);
    }
    else {
      saveToLocaStorage('results', newResults);
    }
  }

  useEffect(() => {
    loadResults();
  }, [user]);

  return (
    <Routes>
      <Route path="/" element={<Main loading={loading} results={results} loadResults={loadResults} />}>
        <Route index element={<Home results={results} saveResults={saveResults} />} />
        <Route path="statistics" element={<Statistics results={results} />} />
        <Route path="about" element={<About />} />
      </Route>
    </Routes>  
  );
}

function Main(props: any) {
  return (
    <div>
      <Nav results={props.results} loadResults={props.loadResults} />
      <main>
        {props.loading ? <div className='text-center' style={{marginTop: '150px'}}>
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div> : <Outlet />}
      </main>
    </div>
  );
}

export default App;