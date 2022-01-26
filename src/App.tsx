import React, { useState } from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import Home from './Home';
import About from "./About";
import Nav from './Nav';
import './App.css';
import Statistics from "./Statistics";
import {firebaseApp, firebaseAnalytics} from './Firebase';

function App() {
  const [reloadPage, setReloadPage] = useState(false);
  return (
    <Routes>
      <Route path="/" element={<Main reloadPage={reloadPage} setReloadPage={setReloadPage} />}>
        <Route index element={<Home reloadPage={reloadPage} setReloadPage={setReloadPage} />} />
        <Route path="statistics" element={<Statistics reloadPage={reloadPage} setReloadPage={setReloadPage} />} />
        <Route path="about" element={<About reloadPage={reloadPage} setReloadPage={setReloadPage} />} />
      </Route>
    </Routes>
  );
}

function Main(props: any) {
  return (
    <div>
      <Nav reloadPage={props.reloadPage} setReloadPage={props.setReloadPage} />
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default App;