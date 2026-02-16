import "../App.css"
import { useNavigate } from "react-router-dom";


// Home page of the website
// Shows intro content and welcome message

function Home() {
    const navigate = useNavigate();

  return (
    <div className="page home-page">

      <section className="hero">
        <h2>Masterpiece Shawarma</h2>
        <p>Hot. Fresh. Legendary Taste.</p>

        <button className="cta-btn"
        onClick={() => navigate("/Menu")}>
          View Menu
        </button>
        <br />
        <br />
        <button className="cta-btn"
        onClick={() => navigate("/Gallery")}>
          View Gallery
        </button>
      </section>

      <section className="features">
        <h2>Why Choose Us?</h2>

        <div className="feature-box">
          <h3>Fresh Ingredients</h3>
          <p>We use only fresh and quality ingredients.</p>
        </div>

        <div className="feature-box">
          <h3>Fast Delivery</h3>
          <p>Your food arrives hot and fast.</p>
        </div>

        <div className="feature-box">
          <h3>Affordable Prices</h3>
          <p>Premium taste without premium price stress.</p>
        </div>

      </section>

    </div>
  );
}

export default Home;
