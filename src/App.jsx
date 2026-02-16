import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Menu from './pages/Menu';
import Contact from './pages/Contact';
import Gallery from './pages/Gallery';



function App() {
  // cart state (array of items)
  const [cart, setCart] = useState([]);

  //Function to add item to cart
  const addToCart = (item) => {
    setCart((prevCart) => [...prevCart, item]);
  };

  return (
   
     <BrowserRouter>

      {/* Navbar will show on all pages */}
      <Navbar cartCount={cart.length} />

      {/* Routes container */}
      <Routes>

        {/* Home page route */}
        <Route path="/" element={<Home />} />

        {/* pass addtocart function to menu */}
        <Route
          path='/Menu'
          element={<Menu
            addToCart={addToCart} />}
            />

        <Route 
          path='Contact'
          element={<Contact />} />

         <Route 
          path='gallery'
          element={<Gallery />} />  
               
      </Routes>

    </BrowserRouter>
  )
}

export default App;
