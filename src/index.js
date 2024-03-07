// index.js
import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import {App, init } from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter as Router } from "react-router-dom";

const root = createRoot(document.getElementById("root"));
init().then((props) => {
  root.render(
    <React.StrictMode>
      <Router>
        <App
		  props={props}
        />
      </Router>
    </React.StrictMode>,
  );
}).catch((_) => {});

reportWebVitals();
