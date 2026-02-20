import "../App.css"
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import { FaClock, FaFire, FaStar } from 'react-icons/fa';

// Home page of the website
// Shows intro content and welcome message

function Home() {
    const navigate = useNavigate();
    const [currentTime, setCurrentTime] = useState(new Date());
    const [isOpen, setIsOpen] = useState(true);
    
    // Mock data - replace with real data from Firebase later
    const [liveStats, setLiveStats] = useState({
      ordersToday: 47,
      activeOrders: 12,
      avgWaitTime: 25
    });

    // Today's special (this would come from Firebase/admin panel)
    const todaySpecial = {
      title: "Friday Special",
      description: "Buy 2 Chicken Wraps, Get 1 Free!",
      discount: "50% OFF",
      validUntil: "10:00 PM",
      code: "FRIYAY"
    };

    // Recent orders for quick reorder (mock data - would come from user's order history)
    const recentOrders = [
      {
        id: 1,
        name: "Chicken Shawarma Wrap",
        price: 1125,
        image: "./images/photo_2026-02-14_21-10-36.jpg",
        lastOrdered: "2 days ago"
      },
      {
        id: 2,
        name: "Beef Shawarma Plate",
        price: 1800,
        image: "https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=400&q=80",
        lastOrdered: "1 week ago"
      },
      {
        id: 3,
        name: "Mixed Grill Combo",
        price: 2500,
        image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&q=80",
        lastOrdered: "3 days ago"
      }
    ];

    // Check if restaurant is open
    useEffect(() => {
      const checkOpenStatus = () => {
        const now = new Date();
        const hour = now.getHours();
        // Open from 11 AM to 11 PM (23:00)
        const isCurrentlyOpen = hour >= 11 && hour < 23;
        setIsOpen(isCurrentlyOpen);
      };

      checkOpenStatus();
      const interval = setInterval(() => {
        setCurrentTime(new Date());
        checkOpenStatus();
      }, 60000); // Update every minute

      return () => clearInterval(interval);
    }, []);

    // Simulate live order updates (in production, use Firebase real-time listeners)
    useEffect(() => {
      const interval = setInterval(() => {
        setLiveStats(prev => ({
          ...prev,
          ordersToday: prev.ordersToday + Math.floor(Math.random() * 2),
          activeOrders: Math.max(5, prev.activeOrders + (Math.random() > 0.5 ? 1 : -1)),
          avgWaitTime: Math.max(15, Math.min(40, prev.avgWaitTime + (Math.random() > 0.5 ? 2 : -2)))
        }));
      }, 30000); // Update every 30 seconds

      return () => clearInterval(interval);
    }, []);

    const getDeliveryUntil = () => {
      const hour = currentTime.getHours();
      if (hour >= 23 || hour < 11) return "Closed";
      return "10:00 PM";
    };

  return (
    <div className="home-page">

      {/* Live Status Bar */}
      <div className={`status-bar ${isOpen ? 'open' : 'closed'}`}>
        <div className="status-container">
          <span className="status-dot"></span>
          <span className="status-text">
            {isOpen ? `🟢 Open Now` : `🔴 Closed`} • Delivery until {getDeliveryUntil()}
          </span>
          {isOpen && (
            <span className="live-orders">
              🔥 {liveStats.ordersToday} orders today
            </span>
          )}
        </div>
      </div>

      {/* Today's Special Banner */}
      {isOpen && (
        <div className="special-banner">
          <div className="special-content">
            <div className="special-badge">
              <FaFire /> TODAY'S SPECIAL
            </div>
            <h2 className="special-title">{todaySpecial.title}</h2>
            <p className="special-description">{todaySpecial.description}</p>
            <div className="special-details">
              <span className="special-discount">{todaySpecial.discount}</span>
              <span className="special-code">Code: {todaySpecial.code}</span>
              <span className="special-valid">Valid until {todaySpecial.validUntil}</span>
            </div>
            <button 
              className="special-cta"
              onClick={() => navigate("/Menu")}
            >
              Order Now →
            </button>
          </div>
        </div>
      )}

      {/* Hero Section with Image Background */}
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <span className="hero-subtitle">What a Masterpiece</span>
          <h1 className="hero-title">
            Masterpiece Shawarma
            <span className="hero-title-accent">Hot & Fresh.</span>
          </h1>
          
          <br />
          <br />
          
          {/* Live Order Status Widget */}
          {isOpen && (
            <div className="live-widget">
              <div className="widget-stat">
                <span className="widget-number">{liveStats.activeOrders}</span>
                <span className="widget-label">orders ahead</span>
              </div>
              <div className="widget-divider"></div>
              <div className="widget-stat">
                <span className="widget-number">~{liveStats.avgWaitTime}</span>
                <span className="widget-label">min wait</span>
              </div>
            </div>
          )}

          <div className="hero-buttons">
            <button className="btn btn-primary" onClick={() => navigate("/Menu")}>
              View Menu
            </button>
            <button className="btn btn-secondary" onClick={() => navigate("/Gallery")}>
              View Gallery
            </button>
          </div>
        </div>
        <div className="hero-scroll-indicator">
          <span>Scroll</span>
          <div className="scroll-arrow"></div>
        </div>
      </section>

      {/* Quick Reorder Section */}
      <section className="quick-reorder-section">
        <div className="section-header">
          <h2>
            <FaClock className="section-icon" />
            Order Again?
          </h2>
          <p>Your recent favorites, just one click away</p>
        </div>

        <div className="reorder-grid">
          {recentOrders.map((item) => (
            <div key={item.id} className="reorder-card">
              <div className="reorder-image">
                <img src={item.image} alt={item.name} loading="lazy" />
                <div className="reorder-overlay">
                  <button 
                    className="reorder-btn"
                    onClick={() => navigate("/Menu")}
                  >
                    Reorder
                  </button>
                </div>
              </div>
              <div className="reorder-info">
                <h3>{item.name}</h3>
                <div className="reorder-details">
                  <span className="reorder-price">₦{item.price.toLocaleString()}</span>
                  <span className="reorder-date">{item.lastOrdered}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="view-all-orders">
          <button 
            className="view-orders-btn"
            onClick={() => navigate("/Menu")}
          >
            View Full Menu →
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2 className="features-title">Why Choose Us?</h2>
        
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🥬</div>
            <h3>Fresh Ingredients</h3>
            <p>We use only fresh and quality ingredients sourced daily.</p>
            <div className="feature-rating">
              <FaStar className="star" />
              <FaStar className="star" />
              <FaStar className="star" />
              <FaStar className="star" />
              <FaStar className="star" />
            </div>
          </div>

          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Fast Delivery</h3>
            <p>Your food arrives hot and fast, average {liveStats.avgWaitTime} min delivery.</p>
            <div className="feature-badge">
              Average: {liveStats.avgWaitTime} mins
            </div>
          </div>

          <div className="feature-card">
            <div className="feature-icon">💰</div>
            <h3>Affordable Prices</h3>
            <p>Premium taste without premium price stress. Value for money!</p>
            <div className="feature-badge">
              From ₦2000
            </div>
          </div>
        </div>
      </section>``

      <section className="reviews-section">
        <h2>Customer Reviews</h2>
        <div className="reviews-grid">
          <div className="review-card">
            <p>"Best shawarma in town! The flavors are amazing and the delivery is super fast."</p>
            <div className="reviewer-info">
              <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Reviewer" className="reviewer-avatar" />
              <div>
                <h4>Jane Doe</h4>
                <span>⭐⭐⭐⭐⭐</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="whats-new-section">
        <h2>What's New?</h2>
        <p>Introducing our new Vegan Shawarma Wrap! Packed with flavor and plant-based goodness.</p>
        <button className="btn btn-secondary" onClick={() => navigate("/Menu")}>
          Try It Now
        </button>
      </section>

    </div>
  );
}

export default Home;