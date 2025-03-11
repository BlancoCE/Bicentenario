import './App.css'
import { Menu } from './pages/Menu'
import { AppRouter } from './Router/AppRouter'
import { Footer} from './components/Footer'

function App() {

  return (
    <>
      <Menu/>
      <AppRouter/>
      <Footer />
    </>
  )
}

export default App
