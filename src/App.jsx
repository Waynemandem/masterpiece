import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Menu from './pages/Menu'
import Contact from './pages/Contact';



function App() {

  return (
   
     <BrowserRouter>

      {/* Navbar will show on all pages */}
      <Navbar />

      {/* Routes container */}
      <Routes>

        {/* Home page route */}
        <Route path="/" element={<Home />} />

        {/* Menu page route */}
        <Route path="/menu" element={<Menu />} />

        {/* Contact page route */}
        <Route path="/contact" element={<Contact />} />

      
      </Routes>

    </BrowserRouter>
  )
}

export default App;
