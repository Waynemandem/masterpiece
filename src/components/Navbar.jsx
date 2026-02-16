import  '../App.css'
import { Link } from 'react-router-dom';
import { useState } from 'react';



// This is the navigation bar at the top of the website
function Navbar({ cartCount }) {
  const [open, setOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="logo">
           Masterpiece 
      </div> 

      {/* Hamburger */}
      <div className='hamburger' onClick={() => setOpen(!open)}>
        =
      </div>

      <ul className={`nav-links ${open ? "open" : ""}`}>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/menu">Menu</Link>
        </li>
        <li>
          <Link to="/contact">Contact</Link>
        </li>

        {/* cart display */}
        <li>({cartCount})</li>
      </ul>
    </nav>
  );
}

export default Navbar;
