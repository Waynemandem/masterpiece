import '../App.css';
import '../Ordersuccess.css';
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaCheckCircle, FaWhatsapp, FaHome, FaReceipt } from 'react-icons/fa';

function OrderSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const { orderNumber, orderData } = location.state || {};

  // Redirect if no order data
  useEffect(() => {
    if (!orderNumber) {
      navigate('/menu');
    }
  }, [orderNumber, navigate]);

  if (!orderNumber) {
    return null;
  }

  const { cartItems, subtotal, discount, deliveryFee, total, orderType, paymentMethod, customer } = orderData || {};

  // Format estimated time
  const getEstimatedTime = () => {
    const now = new Date();
    const minutes = orderType === 'delivery' ? 40 : 20;
    now.setMinutes(now.getMinutes() + minutes);
    return now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  // WhatsApp message
  const handleWhatsAppContact = () => {
    const message = encodeURIComponent(
      `Hi! I just placed order #${orderNumber}. I have a question about my order.`
    );
    window.open(`https://wa.me/+2348012345678?text=${message}`, '_blank');
  };

  return (
    <div className="success-page">
      {/* Success Animation */}
      <div className="success-animation">
        <div className="success-circle">
          <FaCheckCircle className="success-icon" />
        </div>
        <div className="success-confetti">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="confetti" style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 0.5}s`,
              backgroundColor: ['#f4b400', '#ffd700', '#10b981', '#3b82f6'][Math.floor(Math.random() * 4)]
            }}></div>
          ))}
        </div>
      </div>

      {/* Success Content */}
      <div className="success-content">
        <h1 className="success-title">Order Placed Successfully! 🎉</h1>
        <p className="success-subtitle">
          Thank you for your order! We've received it and are preparing your delicious meal.
        </p>

        {/* Order Number */}
        <div className="order-number-card">
          <span className="order-number-label">Order Number</span>
          <span className="order-number">#{orderNumber}</span>
          <span className="order-number-hint">Save this for tracking</span>
        </div>

        {/* Estimated Time */}
        <div className="estimated-time-card">
          {orderType === 'delivery' ? (
            <>
              <div className="time-icon">🚚</div>
              <div className="time-info">
                <h3>Estimated Delivery</h3>
                <p className="time-value">{getEstimatedTime()}</p>
                <p className="time-duration">In about 30-45 minutes</p>
              </div>
            </>
          ) : (
            <>
              <div className="time-icon">🏪</div>
              <div className="time-info">
                <h3>Ready for Pickup</h3>
                <p className="time-value">{getEstimatedTime()}</p>
                <p className="time-duration">In about 15-20 minutes</p>
              </div>
            </>
          )}
        </div>

        {/* Order Details */}
        <div className="order-details-card">
          <h2 className="details-title">
            <FaReceipt /> Order Details
          </h2>

          {/* Customer Info */}
          <div className="detail-section">
            <h3>Customer Information</h3>
            <div className="detail-grid">
              <div className="detail-item">
                <span className="detail-label">Name:</span>
                <span className="detail-value">{customer?.name}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Phone:</span>
                <span className="detail-value">{customer?.phone}</span>
              </div>
              {customer?.email && (
                <div className="detail-item">
                  <span className="detail-label">Email:</span>
                  <span className="detail-value">{customer.email}</span>
                </div>
              )}
            </div>
          </div>

          {/* Delivery/Pickup Info */}
          {orderType === 'delivery' ? (
            <div className="detail-section">
              <h3>Delivery Address</h3>
              <div className="detail-grid">
                <div className="detail-item full-width">
                  <span className="detail-label">Address:</span>
                  <span className="detail-value">{customer?.address}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Area:</span>
                  <span className="detail-value">{customer?.area}</span>
                </div>
                {customer?.notes && (
                  <div className="detail-item full-width">
                    <span className="detail-label">Notes:</span>
                    <span className="detail-value">{customer.notes}</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="detail-section">
              <h3>Pickup Location</h3>
              <div className="pickup-location-info">
                <p><strong>Masterpiece Shawarma</strong></p>
                <p>15 Admiralty Way, Lekki Phase 1, Lagos</p>
              </div>
            </div>
          )}

          {/* Items Ordered */}
          <div className="detail-section">
            <h3>Items Ordered</h3>
            <div className="items-list">
              {cartItems?.map((item) => (
                <div key={item.id} className="order-item">
                  <div className="order-item-info">
                    <span className="order-item-name">{item.name}</span>
                    <span className="order-item-qty">x{item.quantity}</span>
                  </div>
                  <span className="order-item-price">
                    ₦{(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Summary */}
          <div className="detail-section">
            <h3>Payment Summary</h3>
            <div className="payment-breakdown">
              <div className="payment-row">
                <span>Subtotal</span>
                <span>₦{subtotal?.toLocaleString()}</span>
              </div>
              {discount > 0 && (
                <div className="payment-row discount">
                  <span>Discount</span>
                  <span>-₦{discount.toLocaleString()}</span>
                </div>
              )}
              <div className="payment-row">
                <span>{orderType === 'delivery' ? 'Delivery Fee' : 'Pickup'}</span>
                <span>{orderType === 'delivery' ? `₦${deliveryFee?.toLocaleString()}` : 'Free'}</span>
              </div>
              <div className="payment-row total">
                <span>Total</span>
                <span>₦{total?.toLocaleString()}</span>
              </div>
            </div>

            <div className="payment-method-info">
              <strong>Payment Method:</strong>{' '}
              {paymentMethod === 'cash' && `Cash on ${orderType === 'delivery' ? 'Delivery' : 'Pickup'}`}
              {paymentMethod === 'card' && 'Card Payment'}
              {paymentMethod === 'transfer' && 'Bank Transfer'}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="success-actions">
          <button 
            className="whatsapp-btn"
            onClick={handleWhatsAppContact}
          >
            <FaWhatsapp /> Contact on WhatsApp
          </button>

          <button 
            className="home-btn"
            onClick={() => navigate('/')}
          >
            <FaHome /> Back to Home
          </button>
        </div>

        {/* What's Next */}
        <div className="whats-next-card">
          <h3>📱 What's Next?</h3>
          <ul>
            <li>✅ We'll send you a confirmation on WhatsApp</li>
            <li>👨‍🍳 Our chef is preparing your order</li>
            {orderType === 'delivery' ? (
              <li>🚚 A driver will deliver to your location</li>
            ) : (
              <li>🏪 Visit our location to pick up your order</li>
            )}
            <li>🍽️ Enjoy your delicious meal!</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default OrderSuccess;