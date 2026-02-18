import '../App.css';
import '../Cart.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTrash, FaPlus, FaMinus, FaShoppingBag, FaArrowLeft } from 'react-icons/fa';

function Cart({ cart, setCart, clearCart }) {
  const navigate = useNavigate();
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [promoApplied, setPromoApplied] = useState(false);

  // Valid promo codes
  const promoCodes = {
    'FIRST15': 0.15,      // 15% off
    'FRIYAY': 0.20,       // 20% off (Friday special)
    'WELCOME10': 0.10,    // 10% off
    'LOYALTY': 0.25       // 25% off (loyal customers)
  };

  // Calculate quantity of each unique item
  const getCartWithQuantities = () => {
    const itemMap = {};
    cart.forEach(item => {
      if (itemMap[item.id]) {
        itemMap[item.id].quantity += 1;
      } else {
        itemMap[item.id] = { ...item, quantity: 1 };
      }
    });
    return Object.values(itemMap);
  };

  const cartItems = getCartWithQuantities();

  // Calculate totals
  const subtotal = cart.reduce((sum, item) => sum + item.price, 0);
  const deliveryFee = subtotal > 0 ? 500 : 0; // Free delivery over certain amount could be added
  const discountAmount = subtotal * discount;
  const total = subtotal - discountAmount + deliveryFee;

  // Update quantity
  const updateQuantity = (itemId, change) => {
    if (change > 0) {
      // Add one more of this item
      const itemToAdd = cart.find(item => item.id === itemId);
      setCart([...cart, itemToAdd]);
    } else {
      // Remove one of this item
      const indexToRemove = cart.findIndex(item => item.id === itemId);
      if (indexToRemove !== -1) {
        const newCart = [...cart];
        newCart.splice(indexToRemove, 1);
        setCart(newCart);
      }
    }
  };

  // Remove all of a specific item
  const removeItem = (itemId) => {
    setCart(cart.filter(item => item.id !== itemId));
  };

  // Apply promo code
  const applyPromoCode = () => {
    const code = promoCode.toUpperCase();
    if (promoCodes[code]) {
      setDiscount(promoCodes[code]);
      setPromoApplied(true);
      setTimeout(() => setPromoApplied(false), 3000);
    } else {
      alert('Invalid promo code');
    }
  };

  // Proceed to checkout
  const handleCheckout = () => {
    if (cart.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    navigate('/checkout', { 
      state: { 
        cartItems, 
        subtotal, 
        deliveryFee, 
        discount: discountAmount, 
        total 
      } 
    });
  };

  return (
    <div className="cart-page">
      {/* Cart Header */}
      <section className="cart-header">
        <button className="back-btn" onClick={() => navigate('/menu')}>
          <FaArrowLeft /> Back to Menu
        </button>
        <h1 className="cart-title">
          <FaShoppingBag /> Shopping Cart
        </h1>
        <p className="cart-subtitle">
          {cart.length} {cart.length === 1 ? 'item' : 'items'} in your cart
        </p>
      </section>

      <div className="cart-content">
        {/* Cart Items Section */}
        <section className="cart-items-section">
          {cartItems.length === 0 ? (
            <div className="empty-cart">
              <div className="empty-cart-icon">🛒</div>
              <h2>Your cart is empty</h2>
              <p>Add some delicious items from our menu!</p>
              <button 
                className="browse-menu-btn"
                onClick={() => navigate('/menu')}
              >
                Browse Menu
              </button>
            </div>
          ) : (
            <div className="cart-items-list">
              {cartItems.map((item) => (
                <div key={item.id} className="cart-item">
                  <div className="cart-item-image">
                    <img src={item.image} alt={item.name} />
                  </div>

                  <div className="cart-item-details">
                    <h3 className="cart-item-name">{item.name}</h3>
                    <p className="cart-item-description">{item.description}</p>
                    <div className="cart-item-price">
                      ₦{item.price.toLocaleString()} each
                    </div>
                  </div>

                  <div className="cart-item-actions">
                    <div className="quantity-controls">
                      <button
                        className="quantity-btn"
                        onClick={() => updateQuantity(item.id, -1)}
                        aria-label="Decrease quantity"
                      >
                        <FaMinus />
                      </button>
                      <span className="quantity-display">{item.quantity}</span>
                      <button
                        className="quantity-btn"
                        onClick={() => updateQuantity(item.id, 1)}
                        aria-label="Increase quantity"
                      >
                        <FaPlus />
                      </button>
                    </div>

                    <div className="cart-item-total">
                      ₦{(item.price * item.quantity).toLocaleString()}
                    </div>

                    <button
                      className="remove-btn"
                      onClick={() => removeItem(item.id)}
                      aria-label="Remove item"
                    >
                      <FaTrash /> Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Order Summary Section */}
        {cartItems.length > 0 && (
          <section className="order-summary">
            <h2 className="summary-title">Order Summary</h2>

            {/* Promo Code */}
            <div className="promo-section">
              <h3>Have a promo code?</h3>
              <div className="promo-input-group">
                <input
                  type="text"
                  placeholder="Enter code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="promo-input"
                />
                <button 
                  className="apply-btn"
                  onClick={applyPromoCode}
                >
                  Apply
                </button>
              </div>
              {promoApplied && (
                <div className="promo-success">
                  ✅ Promo code applied!
                </div>
              )}
              <div className="promo-hints">
                <small>Try: FIRST15, FRIYAY, WELCOME10</small>
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="price-breakdown">
              <div className="price-row">
                <span>Subtotal</span>
                <span>₦{subtotal.toLocaleString()}</span>
              </div>

              {discount > 0 && (
                <div className="price-row discount-row">
                  <span>Discount ({(discount * 100).toFixed(0)}%)</span>
                  <span className="discount-amount">-₦{discountAmount.toLocaleString()}</span>
                </div>
              )}

              <div className="price-row">
                <span>Delivery Fee</span>
                <span>₦{deliveryFee.toLocaleString()}</span>
              </div>

              <div className="price-row total-row">
                <span>Total</span>
                <span className="total-amount">₦{total.toLocaleString()}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="summary-actions">
              <button 
                className="checkout-btn"
                onClick={handleCheckout}
              >
                Proceed to Checkout
              </button>
              
              <button 
                className="continue-shopping-btn"
                onClick={() => navigate('/menu')}
              >
                Continue Shopping
              </button>

              {cartItems.length > 0 && (
                <button 
                  className="clear-cart-btn"
                  onClick={() => {
                    if (window.confirm('Are you sure you want to clear your cart?')) {
                      clearCart();
                    }
                  }}
                >
                  Clear Cart
                </button>
              )}
            </div>

            {/* Delivery Info */}
            <div className="delivery-info">
              <h4>📦 Delivery Information</h4>
              <ul>
                <li>🚚 Free delivery on orders over ₦5,000</li>
                <li>⏱️ Average delivery time: 30-45 minutes</li>
                <li>📍 We deliver to Lekki, VI, Ikoyi & Ajah</li>
              </ul>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default Cart;