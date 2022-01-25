import React, { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { Collapse } from "bootstrap";

export default function Nav() {
  const location = useLocation();

  useEffect(() => {
    const navLinks = document.querySelectorAll('.nav-item.d-block.d-sm-none');
    const menuToggle = document.getElementById('navbarNav')!;
    const bsCollapse = new Collapse(menuToggle, { toggle: false });
    navLinks.forEach((l) => {
      l.addEventListener('click', () => { bsCollapse.toggle() });
    });
  }, []);

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
            <ul className="navbar-nav">
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
          </div>
        </div>
      </nav>
    </header>
  );
}
