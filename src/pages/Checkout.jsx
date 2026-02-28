import '../App.css';
import '../Checkout.css';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { initializePaystackPayment, generateReference } from '../services/paymentService';
import { createOrder } from '../services/orderService';
import { FaUser, FaPhone, FaMapMarkerAlt, FaCreditCard, FaCheckCircle, FaTruck, FaShoppingBag } from 'react-icons/fa';

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
    'Fatgbems',
    'Arepo',
    'Warewa'
  ];

  // Calculate delivery fee
  const deliveryFee = orderType === 'delivery' ? (orderData.deliveryFee || 500) : 0;
  const finalTotal = (orderData.subtotal || 0) - (orderData.discount || 0) + deliveryFee;

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

    // Email validation if provided
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }

    // For card payment, email is required
    if (paymentMethod === 'card' && !formData.email) {
      newErrors.email = 'Email is required for card payment';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Payment success handler
  const handlePaymentSuccess = async (response) => {
    try {
      console.log('✅ Payment successful:', response);
      
      // Generate order number
      const orderNumber = `MP${Date.now().toString().slice(-8)}`;
      
      // Prepare order data
      const orderToCreate = {
        orderNumber,
        items: orderData.cartItems || [],
        customer: {
          name: formData.name,
          phone: formData.phone,
          email: formData.email || 'N/A',
          address: orderType === 'delivery' ? formData.address : 'Pickup at Restaurant',
          area: formData.area || 'N/A',
          notes: formData.notes || ''
        },
        orderType: orderType,
        subtotal: orderData.subtotal || 0,
        discount: orderData.discount || 0,
        deliveryFee: deliveryFee,
        total: finalTotal,
        paymentMethod: 'card',
        paymentStatus: 'paid',
        payment: {
          method: 'paystack',
          status: 'paid',
          reference: response.reference,
          transactionId: response.transaction || response.trans,
          paidAt: new Date().toISOString()
        },
        status: 'pending',
        createdAt: new Date().toISOString()
      };

      console.log('💾 Saving order to Firebase...');
      
      // Save order to Firebase
      const createdOrder = await createOrder(orderToCreate);
      
      console.log('✅ Order saved:', createdOrder);

      // Clear cart
      clearCart();

      // Navigate to success page
      navigate('/order-success', {
        state: {
          orderNumber: orderNumber,
          orderId: createdOrder.id,
          paymentReference: response.reference,
          total: finalTotal,
          orderData: {
            ...orderData,
            orderType,
            paymentMethod: 'card',
            customer: formData
          }
        }
      });
      
    } catch (error) {
      console.error('❌ Error creating order:', error);
      alert(`Payment successful! However, there was an error saving your order.

Reference: ${response.reference}

Please contact us with this reference number.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Payment close handler
  const handlePaymentClose = () => {
    console.log('Payment window closed');
    setIsSubmitting(false);
    alert('Payment cancelled. Your order is still in the cart.');
  };

  // Handle Paystack payment
  const handlePaystackPayment = () => {
    if (!formData.email) {
      alert('Email is required for card payment');
      return;
    }

    setIsSubmitting(true);

    try {
      // Initialize Paystack payment
      initializePaystackPayment({
        email: formData.email,
        amount: finalTotal,
        reference: generateReference('MP'),
        metadata: {
          custom_fields: [
            {
              display_name: "Customer Name",
              variable_name: "customer_name",
              value: formData.name
            },
            {
              display_name: "Phone Number",
              variable_name: "phone",
              value: formData.phone
            },
            {
              display_name: "Order Type",
              variable_name: "order_type",
              value: orderType
            },
            {
              display_name: "Delivery Area",
              variable_name: "delivery_area",
              value: formData.area || 'Pickup'
            }
          ],
          order_details: {
            items: orderData.cartItems?.map(item => ({
              name: item.name,
              quantity: item.quantity,
              price: item.price
            })) || [],
            subtotal: orderData.subtotal || 0,
            delivery_fee: deliveryFee,
            discount: orderData.discount || 0,
            total: finalTotal
          }
        },
        onSuccess: handlePaymentSuccess,
        onClose: handlePaymentClose
      });
    } catch (error) {
      console.error('Payment initialization error:', error);
      alert('Failed to initialize payment. Please try again.');
      setIsSubmitting(false);
    }
  };

  // Handle cash/transfer order submission
  const handleCashOrder = async () => {
    setIsSubmitting(true);

    try {
      // Generate order number
      const orderNumber = `MP${Date.now().toString().slice(-8)}`;
      
      // Prepare order data
      const orderToCreate = {
        orderNumber,
        items: orderData.cartItems || [],
        customer: {
          name: formData.name,
          phone: formData.phone,
          email: formData.email || 'N/A',
          address: orderType === 'delivery' ? formData.address : 'Pickup at Restaurant',
          area: formData.area || 'N/A',
          notes: formData.notes || ''
        },
        orderType: orderType,
        subtotal: orderData.subtotal || 0,
        discount: orderData.discount || 0,
        deliveryFee: deliveryFee,
        total: finalTotal,
        paymentMethod: paymentMethod,
        paymentStatus: 'pending',
        payment: {
          method: paymentMethod,
          status: 'pending',
          reference: orderNumber,
          paidAt: null
        },
        status: 'pending',
        createdAt: new Date().toISOString()
      };

      console.log('💾 Saving order to Firebase...');
      
      // Save order to Firebase
      const createdOrder = await createOrder(orderToCreate);
      
      console.log('✅ Order saved:', createdOrder);

      // Clear cart
      clearCart();

      // Navigate to success page
      navigate('/order-success', {
        state: {
          orderNumber: orderNumber,
          orderId: createdOrder.id,
          total: finalTotal,
          paymentMethod: paymentMethod,
          orderData: {
            ...orderData,
            orderType,
            paymentMethod,
            customer: formData
          }
        }
      });
      
    } catch (error) {
      console.error('❌ Error creating order:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle order submission
  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Check if cart has items
    if (!orderData.cartItems || orderData.cartItems.length === 0) {
      alert('Your cart is empty');
      navigate('/cart');
      return;
    }

    // Route to appropriate payment handler
    if (paymentMethod === 'card') {
      handlePaystackPayment();
    } else {
      handleCashOrder();
    }
  };

  // Redirect if no order data
  if (!orderData.cartItems || orderData.cartItems.length === 0) {
    return (
      <div className="checkout-page">
        <div className="empty-checkout">
          <h2>🛒 Your cart is empty</h2>
          <p>Add some items to your cart before checking out</p>
          <button className="btn-primary" onClick={() => navigate('/cart')}>
            Go to Cart
          </button>
        </div>
      </div>
    );
  }

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
                <label htmlFor="email">
                  Email {paymentMethod === 'card' && '*'}
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="john@example.com"
                  className={errors.email ? 'error' : ''}
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
                {paymentMethod === 'card' && (
                  <small className="field-note">Email is required for card payment</small>
                )}
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
                    placeholder="123 Main Street, Apartment 4B"
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
                    placeholder="Building landmarks, gate code, special instructions..."
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
              <span>{orderType === 'delivery' ? `₦${deliveryFee.toLocaleString()}` : 'Free'}</span>
            </div>

            <div className="summary-row total">
              <span>Total</span>
              <span>₦{finalTotal.toLocaleString()}</span>
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
                <FaCheckCircle /> 
                {paymentMethod === 'card' ? `Pay ₦${finalTotal.toLocaleString()}` : 'Place Order'}
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