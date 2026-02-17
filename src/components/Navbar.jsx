import '../App.css';
import { Link } from 'react-router-dom';
import { useState } from 'react';

function Navbar({ cartCount }) {
  const [open, setOpen] = useState(false);

  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="logo">
        <Link to="/">Masterpiece</Link>
      </div>

      {/* Hamburger Button */}
      <button
        className="hamburger"
        onClick={() => setOpen(!open)}
        aria-label="Toggle menu"
        aria-expanded={open}
      >
        {open ? '✕' : '☰'}
      </button>

      {/* Nav Links */}
      <ul className={`nav-links ${open ? "open" : ""}`}>
        <li onClick={() => setOpen(false)}>
          <Link to="/">Home</Link>
        </li>
        <li onClick={() => setOpen(false)}>
          <Link to="/menu">Menu</Link>
        </li>
        <li onClick={() => setOpen(false)}>
          <Link to="/gallery">Gallery</Link>
        </li>
        <li onClick={() => setOpen(false)}>
          <Link to="/contact">Contact</Link>
        </li>
        <li className="cart-item">
          🛒 Cart ({cartCount})
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;