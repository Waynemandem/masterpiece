import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Menu from './pages/Menu-Firebase';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Ordersuccess from './pages/Ordersuccess';
import Contact from './pages/Contact';
import Gallery from './pages/Gallery';
import NotFound from './components/NotFound';


function App() {
  // cart state (array of items)
  const [cart, setCart] = useState([]);

  //Function to add item to cart
  const addToCart = (item) => {
    setCart((prevCart) => [...prevCart, item]);
  };

  //Function to clear cart
  const clearCart = () => {
    setCart([]);
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

        {/* cart page - pass cart state and setCart */} 
        <Route   
          path='/Cart'
          element={<Cart cart={cart} setCart={setCart} clearCart={clearCart} />} /> 

         {/* Checkout page - pass clearCart function */}
        <Route
          path="/checkout"
          element={<Checkout clearCart={clearCart} />}
        />

         {/* Order success page */}
        <Route
          path="/ordersuccess"
          element={<Ordersuccess />}
        />

        <Route 
          path='Contact'
          element={<Contact />} />

         <Route 
          path='gallery'
          element={<Gallery />} />  

          {/* 404 Not Found route, this must be last */}
          <Route path="*" element={<NotFound />} />
               
      </Routes>

    </BrowserRouter>
  )
}

export default App;
