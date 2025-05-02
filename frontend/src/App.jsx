import './App.css'
import { Menu } from './pages/Menu'
import { AppRouter } from './Router/AppRouter'
import { Footer } from './components/Footer'
import AuthValidator from './components/ui/AuthValidator'

function App() {
  return (
    <>
      <AuthValidator/>
      <div className="app-container">
        <div className="content-wrap">
          <Menu />
          <AppRouter />
        </div>
        <Footer />
      </div>
    </>
  )
}

export default App