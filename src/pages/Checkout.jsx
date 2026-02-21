import '../App.css';
import '../Checkout.css';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaUser, FaPhone, FaMapMarkerAlt, FaCreditCard, FaMoneyBillWave, FaCheckCircle, FaTruck, FaShoppingBag } from 'react-icons/fa';

function Checkout({ clearCart }) {
  const navigate = useNavigate();
  const location = useLocation();
  const orderData = location.state || {};

  const [orderType, setOrderType] = useState('delivery'); // 'delivery' or 'pickup'
  const [paymentMethod, setPaymentMethod] = useState('cash'); // 'cash', 'card', 'transfer'
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    area: '',
    notes: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delivery areas
  const deliveryAreas = [
    'Lekki Phase 1',
    'Lekki Phase 2',
    'Victoria Island',
    'Ikoyi',
    'Ajah',
    'Oniru',
    'Eti-Osa'
  ];

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[\d\s+()-]+$/.test(formData.phone)) {
      newErrors.phone = 'Invalid phone number';
    }

    if (orderType === 'delivery') {
      if (!formData.address.trim()) {
        newErrors.address = 'Delivery address is required';
      }
      if (!formData.area) {
        newErrors.area = 'Please select your area';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle order submission
  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Import the order service
      const { createOrder } = await import('../services/orderService');
      
      // Prepare order data
      const orderToCreate = {
        items: orderData.cartItems,
        customer: formData,
        orderType: orderType,
        address: orderType === 'delivery' ? {
          street: formData.address,
          area: formData.area
        } : null,
        subtotal: orderData.subtotal,
        discount: orderData.discount || 0,
        deliveryFee: orderType === 'delivery' ? orderData.deliveryFee : 0,
        total: orderData.total,
        paymentMethod: paymentMethod,
        paymentStatus: paymentMethod === 'cash' ? 'pending' : 'awaiting',
        notes: formData.notes
      };

      // Save order to Firebase
      const createdOrder = await createOrder(orderToCreate);
      
      console.log('✅ Order saved to Firebase:', createdOrder);

      // Navigate to success page
      navigate('/order-success', {
        state: {
          orderNumber: createdOrder.orderNumber,
          orderData: {
            ...orderData,
            orderType,
            paymentMethod,
            customer: formData
          }
        }
      });

      // Clear cart
      clearCart();
    } catch (error) {
      console.error('❌ Error creating order:', error);
      alert('Failed to place order. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="checkout-page">
      {/* Checkout Header */}
      <section className="checkout-header">
        <h1 className="checkout-title">Checkout</h1>
        <p className="checkout-subtitle">Complete your order</p>
      </section>

      <form className="checkout-content" onSubmit={handlePlaceOrder}>
        {/* Main Checkout Form */}
        <div className="checkout-form">
          {/* Order Type Selection */}
          <section className="checkout-section">
            <h2 className="section-title">
              <FaTruck /> Order Type
            </h2>

            <div className="order-type-options">
              <label className={`order-type-card ${orderType === 'delivery' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="orderType"
                  value="delivery"
                  checked={orderType === 'delivery'}
                  onChange={(e) => setOrderType(e.target.value)}
                />
                <div className="order-type-icon">🚚</div>
                <div className="order-type-info">
                  <h3>Delivery</h3>
                  <p>Get it delivered to your doorstep</p>
                  <span className="order-type-time">30-45 mins</span>
                </div>
              </label>

              <label className={`order-type-card ${orderType === 'pickup' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="orderType"
                  value="pickup"
                  checked={orderType === 'pickup'}
                  onChange={(e) => setOrderType(e.target.value)}
                />
                <div className="order-type-icon">🏪</div>
                <div className="order-type-info">
                  <h3>Pickup</h3>
                  <p>Pick up from our location</p>
                  <span className="order-type-time">15-20 mins</span>
                </div>
              </label>
            </div>
          </section>

          {/* Contact Information */}
          <section className="checkout-section">
            <h2 className="section-title">
              <FaUser /> Contact Information
            </h2>

            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="name">Full Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  className={errors.name ? 'error' : ''}
                />
                {errors.name && <span className="error-message">{errors.name}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+234 801 234 5678"
                  className={errors.phone ? 'error' : ''}
                />
                {errors.phone && <span className="error-message">{errors.phone}</span>}
              </div>

              <div className="form-group full-width">
                <label htmlFor="email">Email (Optional)</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="john@example.com"
                />
              </div>
            </div>
          </section>

          {/* Delivery Address (only show if delivery) */}
          {orderType === 'delivery' && (
            <section className="checkout-section">
              <h2 className="section-title">
                <FaMapMarkerAlt /> Delivery Address
              </h2>

              <div className="form-grid">
                <div className="form-group full-width">
                  <label htmlFor="address">Street Address *</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="15 Admiralty Way"
                    className={errors.address ? 'error' : ''}
                  />
                  {errors.address && <span className="error-message">{errors.address}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="area">Area *</label>
                  <select
                    id="area"
                    name="area"
                    value={formData.area}
                    onChange={handleInputChange}
                    className={errors.area ? 'error' : ''}
                  >
                    <option value="">Select area</option>
                    {deliveryAreas.map((area) => (
                      <option key={area} value={area}>{area}</option>
                    ))}
                  </select>
                  {errors.area && <span className="error-message">{errors.area}</span>}
                </div>

                <div className="form-group full-width">
                  <label htmlFor="notes">Delivery Notes (Optional)</label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="E.g., Ring doorbell twice, Apartment 4B"
                    rows="3"
                  ></textarea>
                </div>
              </div>
            </section>
          )}

          {/* Pickup Location Info */}
          {orderType === 'pickup' && (
            <section className="checkout-section pickup-info">
              <h2 className="section-title">
                <FaShoppingBag /> Pickup Location
              </h2>
              <div className="pickup-card">
                <div className="pickup-icon">📍</div>
                <div className="pickup-details">
                  <h3>Masterpiece Shawarma</h3>
                  <p>15 Admiralty Way, Lekki Phase 1, Lagos</p>
                  <a 
                    href="https://maps.google.com/?q=6.4396,3.4643" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="get-directions-link"
                  >
                    Get Directions →
                  </a>
                </div>
              </div>
            </section>
          )}

          {/* Payment Method */}
          <section className="checkout-section">
            <h2 className="section-title">
              <FaCreditCard /> Payment Method
            </h2>

            <div className="payment-methods">
              <label className={`payment-card ${paymentMethod === 'cash' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cash"
                  checked={paymentMethod === 'cash'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <div className="payment-icon">💵</div>
                <div className="payment-info">
                  <h3>Cash on {orderType === 'delivery' ? 'Delivery' : 'Pickup'}</h3>
                  <p>Pay when you receive your order</p>
                </div>
                <div className="payment-check">✓</div>
              </label>

              <label className={`payment-card ${paymentMethod === 'card' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="card"
                  checked={paymentMethod === 'card'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <div className="payment-icon">💳</div>
                <div className="payment-info">
                  <h3>Card Payment</h3>
                  <p>Pay securely with Paystack</p>
                </div>
                <div className="payment-check">✓</div>
              </label>

              <label className={`payment-card ${paymentMethod === 'transfer' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="transfer"
                  checked={paymentMethod === 'transfer'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <div className="payment-icon">🏦</div>
                <div className="payment-info">
                  <h3>Bank Transfer</h3>
                  <p>Transfer to our account</p>
                </div>
                <div className="payment-check">✓</div>
              </label>
            </div>
          </section>
        </div>

        {/* Order Summary Sidebar */}
        <div className="checkout-summary">
          <h2 className="summary-title">Order Summary</h2>

          {/* Items List */}
          {orderData.cartItems && (
            <div className="summary-items">
              {orderData.cartItems.map((item) => (
                <div key={item.id} className="summary-item">
                  <div className="summary-item-info">
                    <span className="summary-item-name">{item.name}</span>
                    <span className="summary-item-qty">x{item.quantity}</span>
                  </div>
                  <span className="summary-item-price">
                    ₦{(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Price Breakdown */}
          <div className="summary-breakdown">
            <div className="summary-row">
              <span>Subtotal</span>
              <span>₦{(orderData.subtotal || 0).toLocaleString()}</span>
            </div>

            {orderData.discount > 0 && (
              <div className="summary-row discount">
                <span>Discount</span>
                <span>-₦{orderData.discount.toLocaleString()}</span>
              </div>
            )}

            <div className="summary-row">
              <span>{orderType === 'delivery' ? 'Delivery Fee' : 'Pickup'}</span>
              <span>{orderType === 'delivery' ? `₦${(orderData.deliveryFee || 0).toLocaleString()}` : 'Free'}</span>
            </div>

            <div className="summary-row total">
              <span>Total</span>
              <span>₦{(orderData.total || 0).toLocaleString()}</span>
            </div>
          </div>

          {/* Place Order Button */}
          <button 
            type="submit" 
            className="place-order-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="spinner"></span>
                Processing...
              </>
            ) : (
              <>
                <FaCheckCircle /> Place Order
              </>
            )}
          </button>

          {/* Security Note */}
          <div className="security-note">
            <p>🔒 Your information is secure and encrypted</p>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Checkout;