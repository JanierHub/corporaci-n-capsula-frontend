import { AppRouter } from "./router"
import { ArtefactosProvider } from "./context/ArtefactosContext"

function App() {
  return (
    <ArtefactosProvider>
      <AppRouter />
    </ArtefactosProvider>
  )
}

export default App