import '../App.css';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { FaShoppingBag } from 'react-icons/fa';
import logo from '../images/logo.jpg';

function Navbar({ cartCount }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="logo">
        <Link to="/">
        <img src={logo} alt={logo} />
        </Link>
      </div>

      {/* Hamburger Button */}
      <button
        className="hamburger"
        onClick={() => setOpen(!open)}
        aria-label="Toggle menu"
        aria-expanded={open}
      >
        {/* Red notification badge when cart has items */}
        {cartCount > 0 && !open && (
          <span className="hamburger-badge">{cartCount}</span>
        )}
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
        <li
          className="cart-item"
          onClick={() => {
            setOpen(false);
            navigate('/cart');
          }}
        >
          {/* WHY: react-icons icon instead of emoji.
              Emojis render differently per OS/font — size,
              color, and weight are all uncontrolled.
              An SVG icon scales perfectly and inherits color. */}
          <FaShoppingBag style={{ fontSize: '15px' }} />
          Cart
          {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;