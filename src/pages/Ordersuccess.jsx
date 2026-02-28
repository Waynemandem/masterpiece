import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaCheckCircle, FaWhatsapp, FaPhone, FaReceipt, FaHome } from 'react-icons/fa';
import '../App.css';

function OrderSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const orderInfo = location.state;

  const [showConfetti, setShowConfetti] = useState(true);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  // Handle window resize for confetti
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);

    // Stop confetti after 5 seconds
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 5000);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
    };
  }, []);

  // Redirect if no order info
  useEffect(() => {
    if (!orderInfo.orderNumber) {
      navigate('/menu');
    }
  }, [orderInfo, navigate]);

  // WhatsApp support
  const handleWhatsAppSupport = () => {
    const phone = '2348012345678'; // Replace with your WhatsApp number
    const message = `Hi! I just placed an order (${orderInfo.orderNumber}). I have a question.`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  // Call support
  const handleCallSupport = () => {
    window.location.href = 'tel:+2348012345678'; // Replace with your phone number
  };

  if (!orderInfo.orderNumber) {
    return null; // Will redirect
  }

  const isPaid = orderInfo.paymentMethod === 'card';
  const isPickup = orderInfo.orderData?.orderType === 'pickup';

  return (
    <div className="order-success-page">
      {/* Confetti Animation */}
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={500}
          gravity={0.3}
        />
      )}

      <div className="success-container">
        {/* Success Icon */}
        <div className="success-icon-wrapper">
          <div className="success-icon-bg">
            <FaCheckCircle className="success-icon" />
          </div>
          <div className="success-pulse"></div>
        </div>

        {/* Success Message */}
        <h1 className="success-title">Order Confirmed! 🎉</h1>
        <p className="success-subtitle">
          {isPaid 
            ? 'Your payment was successful and your order is confirmed'
            : 'Your order has been received and is being processed'
          }
        </p>

        {/* Order Number Card */}
        <div className="order-number-card">
          <div className="order-number-label">Order Number</div>
          <div className="order-number">{orderInfo.orderNumber}</div>
          {orderInfo.paymentReference && (
            <div className="payment-reference">
              Payment Ref: {orderInfo.paymentReference}
            </div>
          )}
        </div>

        {/* Order Details */}
        <div className="order-details-card">
          <h3 className="details-title">
            <FaReceipt /> Order Details
          </h3>
          
          <div className="details-grid">
            <div className="detail-item">
              <span className="detail-label">Order Type:</span>
              <span className="detail-value">
                {isPickup ? '🏪 Pickup' : '🚚 Delivery'}
              </span>
            </div>

            <div className="detail-item">
              <span className="detail-label">Payment Method:</span>
              <span className="detail-value">
                {orderInfo.paymentMethod === 'card' ? '💳 Card (Paid)' : 
                 orderInfo.paymentMethod === 'transfer' ? '🏦 Bank Transfer' : 
                 '💵 Cash on ' + (isPickup ? 'Pickup' : 'Delivery')}
              </span>
            </div>

            <div className="detail-item">
              <span className="detail-label">Total Amount:</span>
              <span className="detail-value amount">
                ₦{(orderInfo.total || 0).toLocaleString()}
              </span>
            </div>

            <div className="detail-item">
              <span className="detail-label">Estimated Time:</span>
              <span className="detail-value">
                {isPickup ? '15-20 minutes' : '30-45 minutes'}
              </span>
            </div>

            {orderInfo.orderData?.customer?.name && (
              <div className="detail-item full-width">
                <span className="detail-label">Customer:</span>
                <span className="detail-value">
                  {orderInfo.orderData.customer.name}
                </span>
              </div>
            )}

            {orderInfo.orderData?.customer?.phone && (
              <div className="detail-item full-width">
                <span className="detail-label">Phone:</span>
                <span className="detail-value">
                  {orderInfo.orderData.customer.phone}
                </span>
              </div>
            )}

            {!isPickup && orderInfo.orderData?.customer?.address && (
              <div className="detail-item full-width">
                <span className="detail-label">Delivery Address:</span>
                <span className="detail-value">
                  {orderInfo.orderData.customer.address}, {orderInfo.orderData.customer.area}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Next Steps */}
        <div className="next-steps-card">
          <h3 className="steps-title">What Happens Next?</h3>
          
          <div className="steps-timeline">
            <div className="step completed">
              <div className="step-icon">✓</div>
              <div className="step-content">
                <h4>Order Confirmed</h4>
                <p>Your order has been received</p>
              </div>
            </div>

            <div className="step active">
              <div className="step-icon">👨‍🍳</div>
              <div className="step-content">
                <h4>Preparing</h4>
                <p>Our chef is preparing your delicious meal</p>
              </div>
            </div>

            <div className="step">
              <div className="step-icon">{isPickup ? '🏪' : '🚚'}</div>
              <div className="step-content">
                <h4>{isPickup ? 'Ready for Pickup' : 'Out for Delivery'}</h4>
                <p>{isPickup ? 'We\'ll notify you when ready' : 'On the way to you'}</p>
              </div>
            </div>

            <div className="step">
              <div className="step-icon">😋</div>
              <div className="step-content">
                <h4>Enjoy!</h4>
                <p>Enjoy your delicious meal</p>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Instructions (for cash/transfer) */}
        {!isPaid && (
          <div className="payment-instructions-card">
            <h3 className="instructions-title">
              💰 Payment Instructions
            </h3>
            {orderInfo.paymentMethod === 'transfer' ? (
              <div className="transfer-details">
                <p className="instructions-text">
                  Please transfer ₦{(orderInfo.total || 0).toLocaleString()} to:
                </p>
                <div className="bank-details">
                  <div className="bank-detail">
                    <span className="bank-label">Bank Name:</span>
                    <span className="bank-value">GTBank</span>
                  </div>
                  <div className="bank-detail">
                    <span className="bank-label">Account Number:</span>
                    <span className="bank-value">0123456789</span>
                  </div>
                  <div className="bank-detail">
                    <span className="bank-label">Account Name:</span>
                    <span className="bank-value">Masterpiece Shawarma</span>
                  </div>
                </div>
                <p className="instructions-note">
                  ⚠️ Use order number <strong>{orderInfo.orderNumber}</strong> as reference
                </p>
              </div>
            ) : (
              <p className="instructions-text">
                💵 Please have ₦{(orderInfo.total || 0).toLocaleString()} ready for payment on {isPickup ? 'pickup' : 'delivery'}
              </p>
            )}
          </div>
        )}

        {/* Contact Support */}
        <div className="support-section">
          <h3 className="support-title">Need Help?</h3>
          <div className="support-buttons">
            <button className="support-btn whatsapp" onClick={handleWhatsAppSupport}>
              <FaWhatsapp /> WhatsApp Us
            </button>
            <button className="support-btn phone" onClick={handleCallSupport}>
              <FaPhone /> Call Us
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <button className="btn-secondary" onClick={() => navigate('/menu')}>
            Order More
          </button>
          <button className="btn-primary" onClick={() => navigate('/')}>
            <FaHome /> Go Home
          </button>
        </div>

        {/* Thank You Note */}
        <div className="thank-you-note">
          <p>Thank you for choosing Masterpiece Shawarma! 🌯</p>
          <p className="thank-you-small">
            We can't wait to serve you the best shawarma in Lagos!
          </p>
        </div>
      </div>
    </div>
  );
}

export default OrderSuccess;