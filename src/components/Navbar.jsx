import  '../App.css'
import { Link } from 'react-router-dom';



// This is the navigation bar at the top of the website
function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">
           Masterpiece 
      </div> 

      <ul className="nav-links">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/menu">Menu</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
