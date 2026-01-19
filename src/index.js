import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { PrimeReactProvider } from "primereact/api";

import App from "./App";

/* PrimeReact styles */
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
// import "primeflex/primeflex.css";

/* Tailwind */
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <PrimeReactProvider value={{ ripple: true }}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </PrimeReactProvider>
);
