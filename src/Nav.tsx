import React from "react";
import { useLocation, Link } from "react-router-dom";

export default function Nav() {
  const location = useLocation();

  return (
    <header className="d-flex justify-content-center py-3">
      <nav className="navbar navbar-expand-md fixed-top navbar-dark bg-dark">
        <div className="container">
          <Link className="navbar-brand" to="/">
            <img src='wordle_results_logo_192x192.png' alt='Wordle Results History Logo' className='nav-image' width='40' height='40' />
            Wordle Results History
          </Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link to="/" className={location.pathname === '/' ? 'nav-link active' : 'nav-link'} aria-current="page">Home</Link>
              </li>
              <li className="nav-item">
                <Link to="/about" className={location.pathname === '/about' ? 'nav-link active' : 'nav-link'}>About</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}
