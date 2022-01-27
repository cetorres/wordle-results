import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { Collapse } from "bootstrap";
import { firebaseAuth, signInWithGoogle, logout, saveResultsToCurrentUser } from "./Firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { clearLocaStorage, isIOS, loadFromLocalStorage, saveToLocaStorage } from "./Util";

export default function Nav(props: any) {
  const location = useLocation();
  const [user, loading] = useAuthState(firebaseAuth);
  const [showSignInMsg, setShowSignInMsg] = useState(isIOS() ? false : true);
  const [showSaveLocalResults, setShowSaveLocalResults] = useState(false);

  async function askToSaveLocalResults() {
    const askedToSave = loadFromLocalStorage('askedToSave');
    const savedResults = loadFromLocalStorage('results');
    if (!askedToSave && savedResults && savedResults.length > 0) {
      saveToLocaStorage('askedToSave', true);
      if (window.confirm('Do you want to save your local saved results in our server, so you can see them anywhere you sign in with your Google account?')) {
        saveResults();
      }
    }
  }

  async function saveResults() {
    const savedResults = loadFromLocalStorage('results');
    if (await saveResultsToCurrentUser(savedResults)) {
      setShowSaveLocalResults(false);
      props.setReloadPage(true);
      clearLocaStorage('results');
    }
    else {
      alert('Could not save local results to your account. Try again later.');
    }
  }
  
  useEffect(() => {
    const navLinks = document.querySelectorAll('.nav-item.d-block.d-sm-none');
    const menuToggle = document.getElementById('navbarNav')!;
    const bsCollapse = new Collapse(menuToggle, { toggle: false });
    navLinks.forEach((l) => {
      l.addEventListener('click', () => { bsCollapse.toggle() });
    });

    const savedResults = loadFromLocalStorage('results');
    if (savedResults && savedResults.length > 0) {
      setShowSaveLocalResults(true);
    }
  }, []);

  useEffect(() => {
    if (user) {
      askToSaveLocalResults();
    }
  }, [user]);

  function signOut() {
    logout();
    clearLocaStorage('askedToSave');
    props.setReloadPage(true);
  }

  return (
    <header className="d-flex justify-content-center py-3">
      <nav className="navbar navbar-expand-md fixed-top navbar-dark bg-dark">
        <div className="container">
          <Link className="navbar-brand" to="/">
            <img src='wordle_results_logo_192x192.png' alt='Wordle Results History Logo' className='nav-image' width='36' height='36' />
            Wordle Results
          </Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item d-none d-sm-block">
                <Link to="/" className={location.pathname === '/' ? 'nav-link active' : 'nav-link'} aria-current="page">Home</Link>
              </li>
              <li className="nav-item d-block d-sm-none">
                <Link to="/" className={location.pathname === '/' ? 'nav-link active' : 'nav-link'} aria-current="page">Home</Link>
              </li>
              <li className="nav-item d-none d-sm-block">
                <Link to="/statistics" className={location.pathname === '/statistics' ? 'nav-link active' : 'nav-link'} aria-current="page">Statistics</Link>
              </li>
              <li className="nav-item d-block d-sm-none">
                <Link to="/statistics" className={location.pathname === '/statistics' ? 'nav-link active' : 'nav-link'} aria-current="page">Statistics</Link>
              </li>
              <li className="nav-item d-none d-sm-block">
                <Link to="/about" className={location.pathname === '/about' ? 'nav-link active' : 'nav-link'} aria-current="page">About</Link>
              </li>
              <li className="nav-item d-block d-sm-none">
                <Link to="/about" className={location.pathname === '/about' ? 'nav-link active' : 'nav-link'} aria-current="page">About</Link>
              </li>
            </ul>
            <div className="d-flex">
              {user ? 
                <div className="dropdown text-end">
                  <a href="#" className="d-block link-light text-decoration-none dropdown-toggle" id="dropdownUser" data-bs-toggle="dropdown" aria-expanded="false">
                    <img src={user.photoURL ?? 'user_photo.png'} alt="User photo" width="32" height="32" className="rounded-circle" />
                  </a>
                  <ul className="dropdown-menu text-small" aria-labelledby="dropdownUser">
                    <li><button className="dropdown-item disabled">{user.displayName}<br /><small>{ user.email }</small></button></li>
                    <li><hr className="dropdown-divider" /></li>
                    {showSaveLocalResults ? <li><button className="dropdown-item" onClick={saveResults}>Save local results to my account</button></li> : ''}
                    <li><button className="dropdown-item" onClick={signOut}>Sign out</button></li>
                  </ul>
                </div> : 
                (loading ? 
                  <div className="spinner-border text-light" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div> :
                  <div className='d-flex align-items-center'>
                    {showSignInMsg ?
                      <div className='d-flex align-items-center me-3'>
                        <small className='text-light me-1'>Want to save results with your Google accout?</small>
                        <button type="button" className="btn-close btn-close-white btn-sm" onClick={() => setShowSignInMsg(!showSignInMsg)} aria-label="Close"></button>
                      </div> : ''}
                    <button className='btn btn-outline-light btn-sm' onClick={signInWithGoogle}><i className="bi bi-google"></i>&nbsp;&nbsp;Sign in with Google</button>
                  </div> 
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
