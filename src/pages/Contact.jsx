// Contact page
// Shows business contact info and simple contact form
import "../App.css"



function Contact() {
  return (
    <div className="page contact-page">

      <h1>Contact Us</h1>
      <p>We would love to hear from you. Reach out anytime.</p>

      {/* Contact Info Section */}
      <div className="contact-info">

        <div className="contact-card">
          <h3>📞 Phone</h3>
          <p>+234 XXX XXX XXXX</p>
        </div>

        <div className="contact-card">
          <h3>💬 WhatsApp</h3>
          <p>Chat with us for fast orders</p>
        </div>

        <div className="contact-card">
          <h3>📍 Location</h3>
          <p>Lagos, Nigeria</p>
        </div>

        <div className="contact-card">
          <h3>🕒 Opening Hours</h3>
          <p>Mon - Sun: 9AM - 10PM</p>
        </div>

      </div>

      {/* Simple Contact Form */}
      <div className="contact-form">
        <h2>Send Message</h2>

        <form>
          <input type="text" placeholder="Your Name" required />
          <input type="email" placeholder="Your Email" required />
          <textarea placeholder="Your Message" rows="5" required></textarea>

          <button type="submit">Send Message</button>
        </form>
      </div>

    </div>
  );
}

export default Contact;
