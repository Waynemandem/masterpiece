import '../App.css';
import '../Checkout.css';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { createOrder } from '../services/orderService';
import {
  FaUser, FaPhone, FaMapMarkerAlt, FaMoneyBillWave,
  FaCheckCircle, FaTruck, FaShoppingBag, FaCopy, FaWhatsapp
} from 'react-icons/fa';

// Manual payment details — single source of truth
const PAYMENT_DETAILS = {
  bank: 'Opay',
  accountNumber: '7067027109',
  accountName: 'Muheez Tolani Issa',
  whatsapp: '2347067027109',
};

function Checkout({ clearCart }) {
  const navigate = useNavigate();
  const location = useLocation();
  const orderData = location.state || {};

  const [orderType, setOrderType] = useState('delivery');
  const [paymentMethod, setPaymentMethod] = useState('transfer');
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
  const [copied, setCopied] = useState(false);

  const deliveryAreas = ['Warewa', 'Inside Warewa', 'Arepo', 'Fatgbems'];
  const deliveryFee = orderType === 'delivery' ? (orderData.deliveryFee || 500) : 0;
  const finalTotal = (orderData.subtotal || 0) - (orderData.discount || 0) + deliveryFee;

  // ── Copy account number ──────────────────────────────────
  const handleCopyAccount = () => {
    navigator.clipboard.writeText(PAYMENT_DETAILS.accountNumber).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  // ── WhatsApp shortcut to send payment proof ──────────────
  const openWhatsAppProof = () => {
    const msg = encodeURIComponent(
      `Hi! I just placed an order on Masterpiece Shawarma. Here is my proof of payment for ₦${finalTotal.toLocaleString()}.`
    );
    window.open(`https://wa.me/${PAYMENT_DETAILS.whatsapp}?text=${msg}`, '_blank');
  };

  // ── Form input handler ───────────────────────────────────
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // ── Validation ───────────────────────────────────────────
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[\d\s+()-]+$/.test(formData.phone)) {
      newErrors.phone = 'Invalid phone number';
    }

    if (orderType === 'delivery') {
      if (!formData.address.trim()) newErrors.address = 'Delivery address is required';
      if (!formData.area) newErrors.area = 'Please select your area';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ── Submit order ─────────────────────────────────────────
  const handleSubmitOrder = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (!orderData.cartItems || orderData.cartItems.length === 0) {
      navigate('/cart');
      return;
    }

    setIsSubmitting(true);

    try {
      const orderNumber = `MP${Date.now().toString().slice(-8)}`;

      const orderToCreate = {
        orderNumber,
        items: orderData.cartItems || [],
        customer: {
          name: formData.name,
          phone: formData.phone,
          email: formData.email || '',
          address: orderType === 'delivery' ? formData.address : 'Pickup at Restaurant',
          area: formData.area || '',
          notes: formData.notes || '',
        },
        orderType,
        subtotal: orderData.subtotal || 0,
        discount: orderData.discount || 0,
        deliveryFee,
        total: finalTotal,
        paymentMethod,
        paymentStatus: 'pending',
        payment: {
          method: paymentMethod,
          status: 'pending',
          reference: orderNumber,
          paidAt: null,
        },
        status: 'pending',
        createdAt: new Date().toISOString(),
      };

      const createdOrder = await createOrder(orderToCreate);
      clearCart();

      navigate('/ordersuccess', {
        state: {
          orderNumber,
          orderId: createdOrder.id,
          total: finalTotal,
          paymentMethod,
          orderData: {
            ...orderData,
            orderType,
            paymentMethod,
            customer: formData,
          },
        },
      });
    } catch (error) {
      console.error('Order creation failed:', error);
      alert('Failed to place order. Please try again or contact us on WhatsApp.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Empty cart guard ─────────────────────────────────────
  if (!orderData.cartItems || orderData.cartItems.length === 0) {
    return (
      <div className="checkout-page">
        <div className="empty-checkout">
          <h2>Your cart is empty</h2>
          <p>Add some items to your cart before checking out</p>
          <button className="btn btn-primary" onClick={() => navigate('/cart')}>
            Go to Cart
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <section className="checkout-header">
        <h1 className="checkout-title">Checkout</h1>
        <p className="checkout-subtitle">Complete your order details below</p>
      </section>

      <form className="checkout-content" onSubmit={handleSubmitOrder}>
        <div className="checkout-form">

          {/* ── Order Type ──────────────────────────────── */}
          <section className="checkout-section">
            <h2 className="section-title">
              <FaTruck /> Order Type
            </h2>
            <div className="order-type-options">
              <label className={`order-type-card ${orderType === 'delivery' ? 'active' : ''}`}>
                <input type="radio" name="orderType" value="delivery"
                  checked={orderType === 'delivery'}
                  onChange={(e) => setOrderType(e.target.value)} />
                <div className="order-type-icon">🚚</div>
                <div className="order-type-info">
                  <h3>Delivery</h3>
                  <p>Delivered to your door</p>
                  <span className="order-type-time">30–45 mins</span>
                </div>
              </label>

              <label className={`order-type-card ${orderType === 'pickup' ? 'active' : ''}`}>
                <input type="radio" name="orderType" value="pickup"
                  checked={orderType === 'pickup'}
                  onChange={(e) => setOrderType(e.target.value)} />
                <div className="order-type-icon">🏪</div>
                <div className="order-type-info">
                  <h3>Pickup</h3>
                  <p>Pick up at our location</p>
                  <span className="order-type-time">15–20 mins</span>
                </div>
              </label>
            </div>
          </section>

          {/* ── Contact Info ────────────────────────────── */}
          <section className="checkout-section">
            <h2 className="section-title">
              <FaUser /> Contact Information
            </h2>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="name">Full Name *</label>
                <input type="text" id="name" name="name" value={formData.name}
                  onChange={handleInputChange} placeholder="Your full name"
                  className={errors.name ? 'error' : ''} />
                {errors.name && <span className="error-message">{errors.name}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number *</label>
                <input type="tel" id="phone" name="phone" value={formData.phone}
                  onChange={handleInputChange} placeholder="+234 801 234 5678"
                  className={errors.phone ? 'error' : ''} />
                {errors.phone && <span className="error-message">{errors.phone}</span>}
              </div>

              <div className="form-group full-width">
                <label htmlFor="email">Email (Optional)</label>
                <input type="email" id="email" name="email" value={formData.email}
                  onChange={handleInputChange} placeholder="your@email.com"
                  className={errors.email ? 'error' : ''} />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>
            </div>
          </section>

          {/* ── Delivery Address ────────────────────────── */}
          {orderType === 'delivery' && (
            <section className="checkout-section">
              <h2 className="section-title">
                <FaMapMarkerAlt /> Delivery Address
              </h2>
              <div className="form-grid">
                <div className="form-group full-width">
                  <label htmlFor="address">Street Address *</label>
                  <input type="text" id="address" name="address" value={formData.address}
                    onChange={handleInputChange}
                    placeholder="House number, street name, landmark"
                    className={errors.address ? 'error' : ''} />
                  {errors.address && <span className="error-message">{errors.address}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="area">Area *</label>
                  <select id="area" name="area" value={formData.area}
                    onChange={handleInputChange}
                    className={errors.area ? 'error' : ''}>
                    <option value="">Select area</option>
                    {deliveryAreas.map((area) => (
                      <option key={area} value={area}>{area}</option>
                    ))}
                  </select>
                  {errors.area && <span className="error-message">{errors.area}</span>}
                </div>

                <div className="form-group full-width">
                  <label htmlFor="notes">Delivery Notes (Optional)</label>
                  <textarea id="notes" name="notes" value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="Landmarks, gate code, or any special instructions"
                    rows="3" />
                </div>
              </div>
            </section>
          )}

          {/* ── Pickup Info ──────────────────────────────── */}
          {orderType === 'pickup' && (
            <section className="checkout-section pickup-info">
              <h2 className="section-title">
                <FaShoppingBag /> Pickup Location
              </h2>
              <div className="pickup-card">
                <div className="pickup-icon">📍</div>
                <div className="pickup-details">
                  <h3>Masterpiece Shawarma</h3>
                  <p>Warewa Market Road, Warewa, Ogun State</p>
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=6.67657,3.40924"
                    target="_blank" rel="noopener noreferrer"
                    className="get-directions-link">
                    Get Directions →
                  </a>
                </div>
              </div>
            </section>
          )}

          {/* ── Payment Method ───────────────────────────── */}
          <section className="checkout-section">
            <h2 className="section-title">
              <FaMoneyBillWave /> Payment Method
            </h2>

            <div className="payment-methods">
              {/* Bank Transfer */}
              <label className={`payment-card ${paymentMethod === 'transfer' ? 'active' : ''}`}>
                <input type="radio" name="paymentMethod" value="transfer"
                  checked={paymentMethod === 'transfer'}
                  onChange={(e) => setPaymentMethod(e.target.value)} />
                <div className="payment-icon">🏦</div>
                <div className="payment-info">
                  <h3>Bank Transfer</h3>
                  <p>Transfer before delivery — faster processing</p>
                </div>
                <div className="payment-check">✓</div>
              </label>

              {/* Cash */}
              <label className={`payment-card ${paymentMethod === 'cash' ? 'active' : ''}`}>
                <input type="radio" name="paymentMethod" value="cash"
                  checked={paymentMethod === 'cash'}
                  onChange={(e) => setPaymentMethod(e.target.value)} />
                <div className="payment-icon">💵</div>
                <div className="payment-info">
                  <h3>Cash on {orderType === 'delivery' ? 'Delivery' : 'Pickup'}</h3>
                  <p>Pay when you receive your order</p>
                </div>
                <div className="payment-check">✓</div>
              </label>
            </div>

            {/* ── Transfer Details Box ─────────────────────
                WHY: Show account info INLINE before the
                order is placed. This reduces confusion —
                the customer knows exactly what to do before
                they click "Place Order". Showing it only on
                the success page means some people place
                orders and then don't know how to pay.
            ─────────────────────────────────────────────── */}
            {paymentMethod === 'transfer' && (
              <div className="transfer-info-box">
                <div className="transfer-info-header">
                  <span className="transfer-info-title">Transfer to this account</span>
                </div>

                <div className="bank-details-grid">
                  <div className="bank-detail-row">
                    <span className="bank-detail-label">Bank</span>
                    <span className="bank-detail-value">{PAYMENT_DETAILS.bank}</span>
                  </div>

                  <div className="bank-detail-row">
                    <span className="bank-detail-label">Account Number</span>
                    <div className="account-number-group">
                      <span className="bank-detail-value account-number">
                        {PAYMENT_DETAILS.accountNumber}
                      </span>
                      <button
                        type="button"
                        className={`copy-btn ${copied ? 'copied' : ''}`}
                        onClick={handleCopyAccount}
                      >
                        {copied ? (
                          <><FaCheckCircle /> Copied</>
                        ) : (
                          <><FaCopy /> Copy</>
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="bank-detail-row">
                    <span className="bank-detail-label">Account Name</span>
                    <span className="bank-detail-value">{PAYMENT_DETAILS.accountName}</span>
                  </div>
                </div>

                <div className="transfer-steps">
                  <p className="transfer-step">
                    <span className="step-num">1</span>
                    Transfer <strong>₦{finalTotal.toLocaleString()}</strong> to the account above
                  </p>
                  <p className="transfer-step">
                    <span className="step-num">2</span>
                    Place your order using the button below
                  </p>
                  <p className="transfer-step">
                    <span className="step-num">3</span>
                    Send your payment screenshot on WhatsApp to confirm
                  </p>
                </div>

                <button
                  type="button"
                  className="whatsapp-proof-btn"
                  onClick={openWhatsAppProof}
                >
                  <FaWhatsapp /> Open WhatsApp to Send Proof
                </button>
              </div>
            )}
          </section>
        </div>

        {/* ── Order Summary Sidebar ──────────────────────── */}
        <div className="checkout-summary">
          <h2 className="summary-title">Order Summary</h2>

          <div className="summary-items">
            {orderData.cartItems.map((item) => (
              <div key={item.id} className="summary-item">
                <div className="summary-item-info">
                  <span className="summary-item-name">{item.name}</span>
                  <span className="summary-item-qty">× {item.quantity}</span>
                </div>
                <span className="summary-item-price">
                  ₦{(item.price * item.quantity).toLocaleString()}
                </span>
              </div>
            ))}
          </div>

          <div className="summary-breakdown">
            <div className="summary-row">
              <span>Subtotal</span>
              <span>₦{(orderData.subtotal || 0).toLocaleString()}</span>
            </div>

            {orderData.discount > 0 && (
              <div className="summary-row discount">
                <span>Discount</span>
                <span>−₦{orderData.discount.toLocaleString()}</span>
              </div>
            )}

            <div className="summary-row">
              <span>{orderType === 'delivery' ? 'Delivery Fee' : 'Pickup'}</span>
              <span>
                {orderType === 'delivery' ? `₦${deliveryFee.toLocaleString()}` : 'Free'}
              </span>
            </div>

            <div className="summary-row total">
              <span>Total</span>
              <span>₦{finalTotal.toLocaleString()}</span>
            </div>
          </div>

          <button type="submit" className="place-order-btn" disabled={isSubmitting}>
            {isSubmitting ? (
              <><span className="spinner" /> Processing…</>
            ) : (
              <><FaCheckCircle /> Place Order — ₦{finalTotal.toLocaleString()}</>
            )}
          </button>

          {paymentMethod === 'transfer' && (
            <p className="summary-payment-note">
              You will pay ₦{finalTotal.toLocaleString()} via Opay transfer
            </p>
          )}

          <div className="security-note">
            <p>🔒 Your details are only used to fulfill your order</p>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Checkout;
