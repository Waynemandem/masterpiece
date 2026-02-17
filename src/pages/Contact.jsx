import '../App.css';
import { useState, useEffect } from 'react';
import { FaPhone, FaWhatsapp, FaInstagram, FaFacebook, FaMapMarkerAlt, FaClock } from 'react-icons/fa';

function Contact() {
  const [isOpen, setIsOpen] = useState(false);
  const [_currentTime, setCurrentTime] = useState(new Date());

  // Business information
  const businessInfo = {
    name: "Masterpiece Shawarma",
    phone: "+234-801-234-5678",
    whatsapp: "+2348012345678",
    email: "hello@masterpiece.com",
    address: "15 Admiralty Way, Lekki Phase 1, Lagos",
    instagram: "https://instagram.com/masterpiece_shawarma",
    facebook: "https://facebook.com/masterpieceshawarma",
    // Google Maps coordinates (replace with your actual location)
    mapCoordinates: {
      lat: 6.4396,
      lng: 3.4643
    },
    // Operating hours (24-hour format)
    operatingHours: {
      monday: { open: "11:00", close: "23:00" },
      tuesday: { open: "11:00", close: "23:00" },
      wednesday: { open: "11:00", close: "23:00" },
      thursday: { open: "11:00", close: "23:00" },
      friday: { open: "11:00", close: "23:00" },
      saturday: { open: "11:00", close: "23:00" },
      sunday: { open: "12:00", close: "22:00" }
    }
  };

  // Delivery zones with areas
  const deliveryZones = [
    { name: "Lekki Phase 1", fee: "₦500", time: "30-45 min" },
    { name: "Victoria Island", fee: "₦800", time: "35-50 min" },
    { name: "Ikoyi", fee: "₦800", time: "40-55 min" },
    { name: "Ajah", fee: "₦1,000", time: "45-60 min" },
    { name: "Lekki Phase 2", fee: "₦700", time: "35-50 min" },
    { name: "Oniru", fee: "₦600", time: "25-40 min" }
  ];

  // Check if restaurant is open
  useEffect(() => {
    const checkOpenStatus = () => {
      const now = new Date();
      const day = now.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      const currentTimeString = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;

      const todayHours = businessInfo.operatingHours[day];
      
      if (todayHours) {
        const isCurrentlyOpen = currentTimeString >= todayHours.open && currentTimeString < todayHours.close;
        setIsOpen(isCurrentlyOpen);
      }
    };

    checkOpenStatus();
    // Update every minute
    const interval = setInterval(() => {
      setCurrentTime(new Date());
      checkOpenStatus();
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  // Get today's hours
  const getTodayHours = () => {
    const day = new Date()
  .toLocaleDateString('en-US', { weekday: 'long' })
  .toLowerCase();

    const hours = businessInfo.operatingHours[day];
    
    if (!hours) return "Closed";
    
    // Convert 24h to 12h format
    const formatTime = (time) => {
      const [hours, minutes] = time.split(':');
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const hour12 = hour % 12 || 12;
      return `${hour12}:${minutes} ${ampm}`;
    };

    return `${formatTime(hours.open)} - ${formatTime(hours.close)}`;
  };

  // Handle click to call
  const handleCall = () => {
    window.location.href = `tel:${businessInfo.phone}`;
  };

  // Handle WhatsApp
  const handleWhatsApp = () => {
    const message = encodeURIComponent("Hi! I'd like to place an order.");
    window.open(`https://wa.me/${businessInfo.whatsapp}?text=${message}`, '_blank');
  };

  return (
    <div className="contact-page">
      {/* Header Section */}
      <section className="contact-header">
        <div className="contact-header-content">
          <h1>Get In Touch</h1>
          <p>We're here to serve you delicious shawarma!</p>
          
          {/* Operating Status Banner */}
          <div className={`status-banner ${isOpen ? 'open' : 'closed'}`}>
            <FaClock className="status-icon" />
            <div className="status-text">
              <span className="status-label">
                {isOpen ? '🟢 Open Now' : '🔴 Closed'}
              </span>
              <span className="status-hours">
                Today: {getTodayHours()}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="quick-actions">
        <button className="action-btn call-btn" onClick={handleCall}>
          <FaPhone className="action-icon" />
          <div className="action-text">
            <span className="action-label">Call Us</span>
            <span className="action-value">{businessInfo.phone}</span>
          </div>
        </button>

        <button className="action-btn whatsapp-btn" onClick={handleWhatsApp}>
          <FaWhatsapp className="action-icon" />
          <div className="action-text">
            <span className="action-label">WhatsApp</span>
            <span className="action-value">Chat Now</span>
          </div>
        </button>
      </section>

      {/* Location & Map */}
      <section className="location-section">
        <div className="section-header">
          <FaMapMarkerAlt className="section-icon" />
          <h2>Visit Us</h2>
        </div>
        
        <div className="location-content">
          <div className="address-card">
            <h3>{businessInfo.name}</h3>
            <p className="address">{businessInfo.address}</p>
            <a 
              href={`https://www.google.com/maps/search/?api=1&query=${businessInfo.mapCoordinates.lat},${businessInfo.mapCoordinates.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="directions-btn"
            >
              Get Directions →
            </a>
          </div>

          {/* Google Maps Embed */}
          <div className="map-container">
            <iframe
              title="Masterpiece Shawarma Location"
              src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3964.6464757384456!2d${businessInfo.mapCoordinates.lng}!3d${businessInfo.mapCoordinates.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwMjYnMjIuNiJOIDPCsDI3JzUxLjUiRQ!5e0!3m2!1sen!2sng!4v1234567890123!5m2!1sen!2sng`}
              width="100%"
              height="400"
              style={{ border: 0, borderRadius: '12px' }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </section>

      {/* Delivery Zones */}
      <section className="delivery-zones-section">
        <div className="section-header">
          <h2>🚚 We Deliver Here</h2>
          <p>Fast delivery to your doorstep</p>
        </div>

        <div className="zones-grid">
          {deliveryZones.map((zone, index) => (
            <div key={index} className="zone-card">
              <div className="zone-icon">📍</div>
              <h3>{zone.name}</h3>
              <div className="zone-details">
                <span className="zone-fee">{zone.fee}</span>
                <span className="zone-time">{zone.time}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="delivery-note">
          <p>💡 <strong>Don't see your area?</strong> Contact us on WhatsApp - we might still deliver!</p>
        </div>
      </section>

      {/* Operating Hours */}
      <section className="hours-section">
        <div className="section-header">
          <FaClock className="section-icon" />
          <h2>Opening Hours</h2>
        </div>

        <div className="hours-table">
          {Object.entries(businessInfo.operatingHours).map(([day, hours]) => {
            const isToday = new Date()
  .toLocaleDateString('en-US', { weekday: 'long' })
  .toLowerCase();
            
            const formatTime = (time) => {
              const [h, m] = time.split(':');
              const hour = parseInt(h);
              const ampm = hour >= 12 ? 'PM' : 'AM';
              const hour12 = hour % 12 || 12;
              return `${hour12}:${m} ${ampm}`;
            };

            return (
              <div key={day} className={`hours-row ${isToday ? 'today' : ''}`}>
                <span className="day">
                  {day.charAt(0).toUpperCase() + day.slice(1)}
                  {isToday && <span className="today-badge">Today</span>}
                </span>
                <span className="time">
                  {formatTime(hours.open)} - {formatTime(hours.close)}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Social Media */}
      <section className="social-section">
        <div className="section-header">
          <h2>Follow Us</h2>
          <p>Stay updated with our latest offers</p>
        </div>

        <div className="social-links">
          <a 
            href={businessInfo.instagram} 
            target="_blank" 
            rel="noopener noreferrer"
            className="social-link instagram"
          >
            <FaInstagram className="social-icon" />
            <span>Instagram</span>
          </a>

          <a 
            href={businessInfo.facebook} 
            target="_blank" 
            rel="noopener noreferrer"
            className="social-link facebook"
          >
            <FaFacebook className="social-icon" />
            <span>Facebook</span>
          </a>

          <button 
            onClick={handleWhatsApp}
            className="social-link whatsapp"
          >
            <FaWhatsapp className="social-icon" />
            <span>WhatsApp</span>
          </button>
        </div>
      </section>

      {/* Contact Form */}
      <section className="contact-form-section">
        <div className="section-header">
          <h2>Send Us a Message</h2>
          <p>Have a question? We'd love to hear from you</p>
        </div>

        <form className="contact-form">
          <div className="form-group">
            <label htmlFor="name">Your Name</label>
            <input 
              type="text" 
              id="name" 
              name="name"
              placeholder="John Doe"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input 
              type="tel" 
              id="phone" 
              name="phone"
              placeholder="+234 801 234 5678"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email (Optional)</label>
            <input 
              type="email" 
              id="email" 
              name="email"
              placeholder="john@example.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea 
              id="message" 
              name="message"
              rows="5"
              placeholder="How can we help you?"
              required
            ></textarea>
          </div>

          <button type="submit" className="submit-btn">
            Send Message
          </button>
        </form>
      </section>
    </div>
  );
}

export default Contact;