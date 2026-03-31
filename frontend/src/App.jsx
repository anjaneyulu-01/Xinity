import { Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'

export default function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-sky-50 dark:bg-gray-950 transition-colors duration-300">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
    </ThemeProvider>
  )
}
