import React from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import Home from './Home';
import About from "./About";
import Nav from './Nav';
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Main />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
      </Route>
    </Routes>
  );
}

function Main() {
  return (
    <div>
      <Nav />
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default App;