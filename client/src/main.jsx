import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { createRoot } from "react-dom/client";
import Context from "./context/Context.jsx";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <Context>
    <BrowserRouter>
      <ToastContainer />
      <App />
    </BrowserRouter>
  </Context>
);
