import '../App.css';
import { Link } from 'react-router-dom';
import { useState } from 'react';

// Simple stable Navbar with hamburger
function Navbar({ cartCount }) {

  // controls menu open/close
  const [open, setOpen] = useState(false);

  return (
    <nav className="navbar">

      {/* Logo */}
      <div className="logo">
        Masterpiece
      </div>

      {/* Hamburger Button */}
      <button
        className="hamburger"
        onClick={() => setOpen(!open)}
      >
        ☰
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
          <Link to="/contact">Contact</Link>
        </li>

        <li>
          Cart ({cartCount})
        </li>

      </ul>

    </nav>
  );
}

export default Navbar;
