import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import "./index.css"
import { ArtefactosProvider } from "./context/ArtefactosContext"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ArtefactosProvider>
      <App />
    </ArtefactosProvider>
  </React.StrictMode>
)