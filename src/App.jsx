import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Menu from './pages/Menu-Firebase';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import Contact from './pages/Contact';
import Gallery from './pages/Gallery';
import NotFound from './components/NotFound';

function App() {
  const [cart, setCart] = useState([]);

  const addToCart = (item) => {
    setCart((prevCart) => [...prevCart, item]);
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <BrowserRouter>
      <Navbar cartCount={cart.length} />
      <Routes>
        <Route path="/" element={<Home />} />

        {/* WHY: All routes use lowercase consistently.
            React Router v6 is case-sensitive. The old
            routes mixed /Menu, /Cart, /Contact which
            meant Navbar links (lowercase) hit 404. */}
        <Route path="/menu" element={<Menu addToCart={addToCart} />} />
        <Route path="/cart" element={<Cart cart={cart} setCart={setCart} clearCart={clearCart} />} />
        <Route path="/checkout" element={<Checkout clearCart={clearCart} />} />
        <Route path="/ordersuccess" element={<OrderSuccess />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/contact" element={<Contact />} />

        {/* 404 — must be last */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
