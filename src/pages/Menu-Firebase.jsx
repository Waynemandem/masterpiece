import { initializeFirebaseData } from '../utils/initializeFirebase';

import '../App.css';
import '../menu-loadingstyle.css';
import { useState, useEffect } from 'react';
import { FaFire, FaLeaf, FaStar, FaSearch, FaTimes } from 'react-icons/fa';
import { getAllMenuItems, getAvailableMenuItems } from '../services/menuService';

// Menu page with Firebase integration
function Menu({ addToCart }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [notification, setNotification] = useState('');
  const [menuData, setMenuData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [initializing, setInitializing] = useState(false);
  const [showInitButton, setShowInitButton] = useState(false);

  // Load menu items from Firebase on component mount
  useEffect(() => {
    const loadMenu = async () => {
      try {
        setLoading(true);
        // Get all available menu items from Firebase
        const items = await getAvailableMenuItems();
        
        if (items.length === 0) {
          // No items in Firebase, show initialization button
          setShowInitButton(true);
          // Also load local data as fallback
          const fallbackData = await import('../data/menuData');
          setMenuData(fallbackData.default);
        } else {
          setMenuData(items);
          setShowInitButton(false);
        }
        setError(null);
      } catch (err) {
        console.error('Error loading menu:', err);
        setError('Failed to load menu. Please try again.');
        setShowInitButton(true);
        // Fallback to local data if Firebase fails
        const fallbackData = await import('../data/menuData');
        setMenuData(fallbackData.default);
      } finally {
        setLoading(false);
      }
    };

    loadMenu();
  }, []);

  // Initialize Firebase Database
  const handleInitializeDB = async () => {
    if (window.confirm('This will upload 18 menu items to Firebase. Continue?')) {
      setInitializing(true);
      try {
        console.log('🔥 Starting database initialization...');
        const result = await initializeFirebaseData();
        console.log('✅ Success:', result);
        alert(`✅ Success! Created ${result.menuItemsCreated} menu items in Firebase!`);
        setShowInitButton(false);
        window.location.reload(); // Refresh to load from Firebase
      } catch (error) {
        console.error('❌ Initialization error:', error);
        alert('❌ Error: ' + error.message + '\n\nCheck console for details.');
      } finally {
        setInitializing(false);
      }
    }
  };

  // Get unique categories from menu data
  const categories = ['all', ...new Set(menuData.map(item => item.category))];

  // Filter menu items
  const filteredMenu = menuData.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Handle add to cart with notification
  const handleAddToCart = (item) => {
    addToCart(item);
    setNotification(`${item.name} added to cart!`);
    setTimeout(() => setNotification(''), 3000);
  };

  // Open item details modal
  const openModal = (item) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
    setSelectedItem(null);
  };

  // Loading state
  if (loading) {
    return (
      <div className="menu-page">
        <section className="menu-header">
          <h1 className="menu-title">Our Menu</h1>
          <p className="menu-subtitle">Loading delicious items...</p>
        </section>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading menu from database...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && menuData.length === 0) {
    return (
      <div className="menu-page">
        <section className="menu-header">
          <h1 className="menu-title">Our Menu</h1>
        </section>
        <div className="error-container">
          <p className="error-message">❌ {error}</p>
          <button 
            className="retry-btn"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="menu-page">
      {/* Notification Toast */}
      {notification && (
        <div className="notification-toast">
          ✅ {notification}
        </div>
      )}

      {/* Menu Header */}
      <section className="menu-header">
        <h1 className="menu-title">Our Menu</h1>
        <p className="menu-subtitle">Discover our delicious selection</p>
        {error && (
          <p className="warning-message">⚠️ Using cached menu data</p>
        )}
      </section>

      {/* Firebase Initialization Button (First Time Setup) */}
      {showInitButton && (
        <section style={{ 
          textAlign: 'center', 
          padding: '30px 20px',
          background: 'rgba(244, 180, 0, 0.1)',
          margin: '20px',
          borderRadius: '16px',
          border: '2px solid rgba(244, 180, 0, 0.3)',
          maxWidth: '600px',
          marginLeft: 'auto',
          marginRight: 'auto'
        }}>
          <h3 style={{ 
            color: '#f4b400', 
            marginBottom: '12px',
            fontSize: '24px',
            fontWeight: '700'
          }}>
            🔥 First Time Setup
          </h3>
          <p style={{ 
            color: '#cbd5e1', 
            marginBottom: '20px',
            fontSize: '16px',
            lineHeight: '1.6'
          }}>
            Your menu is currently loading from local data.<br/>
            Click below to upload it to Firebase for real-time management.
          </p>
          <button
            onClick={handleInitializeDB}
            disabled={initializing}
            style={{
              padding: '16px 40px',
              background: initializing 
                ? 'rgba(107, 114, 128, 0.5)' 
                : 'linear-gradient(135deg, #f4b400 0%, #ffd700 100%)',
              color: '#111',
              border: 'none',
              borderRadius: '50px',
              fontSize: '18px',
              fontWeight: '700',
              cursor: initializing ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 15px rgba(244, 180, 0, 0.3)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              if (!initializing) {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 20px rgba(244, 180, 0, 0.5)';
              }
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 15px rgba(244, 180, 0, 0.3)';
            }}
          >
            {initializing ? '⏳ Uploading to Firebase...' : '🚀 Initialize Database'}
          </button>
          <p style={{
            color: '#94a3b8',
            fontSize: '13px',
            marginTop: '12px'
          }}>
            (You only need to do this once)
          </p>
        </section>
      )}

      {/* Search Bar */}
      <section className="menu-search">
        <div className="search-container">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search for dishes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          {searchQuery && (
            <button 
              className="search-clear"
              onClick={() => setSearchQuery('')}
              aria-label="Clear search"
            >
              <FaTimes />
            </button>
          )}
        </div>
      </section>

      {/* Category Tabs */}
      <section className="category-tabs">
        {categories.map((category) => (
          <button
            key={category}
            className={`category-tab ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category)}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </section>

      {/* Menu Grid */}
      <section className="menu-content">
        {filteredMenu.length === 0 ? (
          <div className="no-results">
            <p>😕 No items found</p>
            <button 
              className="reset-btn"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="menu-grid">
            {filteredMenu.map((item, index) => (
              <div 
                className="menu-item" 
                key={item.id}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Badges */}
                <div className="item-badges">
                  {item.popular && (
                    <span className="badge badge-popular">
                      <FaFire /> Popular
                    </span>
                  )}
                  {item.vegetarian && (
                    <span className="badge badge-veg">
                      <FaLeaf /> Veg
                    </span>
                  )}
                  {item.new && (
                    <span className="badge badge-new">
                      ✨ New
                    </span>
                  )}
                  {!item.available && (
                    <span className="badge badge-soldout">
                      Sold Out
                    </span>
                  )}
                </div>

                {/* Image */}
                <div 
                  className="item-image-container"
                  onClick={() => openModal(item)}
                >
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="item-image"
                    loading="lazy"
                  />
                  <div className="item-overlay">
                    <span className="view-details">View Details</span>
                  </div>
                </div>

                {/* Content */}
                <div className="item-content">
                  <h3 className="item-name">{item.name}</h3>
                  
                  {/* Rating */}
                  {item.rating && (
                    <div className="item-rating">
                      <FaStar className="star-icon" />
                      <span>{item.rating}</span>
                      {item.reviews && (
                        <span className="review-count">({item.reviews})</span>
                      )}
                    </div>
                  )}

                  {/* Price & Button */}
                  <div className="item-footer">
                    <div className="item-price">
                      <span className="currency">₦</span>
                      <span className="amount">{item.price.toLocaleString()}</span>
                    </div>
                    <button 
                      className="add-to-cart-btn"
                      onClick={() => handleAddToCart(item)}
                      disabled={!item.available}
                    >
                      {item.available ? 'Add to Cart' : 'Sold Out'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Item Details Modal */}
      {showModal && selectedItem && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>
              <FaTimes />
            </button>

            <div className="modal-body">
              <div className="modal-image">
                <img src={selectedItem.image} alt={selectedItem.name} />
              </div>

              <div className="modal-info">
                <h2 className="modal-title">{selectedItem.name}</h2>
                
                {/* Badges */}
                <div className="modal-badges">
                  {selectedItem.popular && <span className="badge badge-popular"><FaFire /> Popular</span>}
                  {selectedItem.vegetarian && <span className="badge badge-veg"><FaLeaf /> Veg</span>}
                  {selectedItem.halal && <span className="badge badge-halal">🌙 Halal</span>}
                  {!selectedItem.available && <span className="badge badge-soldout">Sold Out</span>}
                </div>

                {/* Rating */}
                {selectedItem.rating && (
                  <div className="modal-rating">
                    <FaStar className="star-icon" />
                    <span>{selectedItem.rating}</span>
                    {selectedItem.reviews && (
                      <span className="review-count">({selectedItem.reviews} reviews)</span>
                    )}
                  </div>
                )}

                <p className="modal-description">{selectedItem.description}</p>

                {/* Ingredients */}
                {selectedItem.ingredients && (
                  <div className="modal-ingredients">
                    <h4>Ingredients:</h4>
                    <ul>
                      {selectedItem.ingredients.map((ingredient, idx) => (
                        <li key={idx}>{ingredient}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Allergens */}

                {/* Nutrition Info */}

                {/* Price & Add to Cart */}
                <div className="modal-footer">
                  <div className="modal-price">
                    <span className="currency">₦</span>
                    <span className="amount">{selectedItem.price.toLocaleString()}</span>
                  </div>
                  <button 
                    className="modal-add-to-cart"
                    onClick={() => {
                      handleAddToCart(selectedItem);
                      closeModal();
                    }}
                    disabled={!selectedItem.available}
                  >
                    {selectedItem.available ? 'Add to Cart' : 'Sold Out'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Menu;