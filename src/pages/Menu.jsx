import '../App.css';
import { useState } from 'react';
import { FaFire, FaLeaf, FaStar, FaSearch, FaTimes } from 'react-icons/fa';
import menuData from '../data/menuData';

// Menu page with categories, filters, and add to cart
function Menu({ addToCart }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [notification, setNotification] = useState('');

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
      </section>

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
      key={category || Math.random()}
      className={`category-tab ${
        selectedCategory === category ? "active" : ""
      }`}
      onClick={() => setSelectedCategory(category)}
    >
      {category
        ? category.charAt(0).toUpperCase() + category.slice(1)
        : ""}
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

                  <p className="item-description">{item.description}</p>

                  {/* Price & Button */}
                  <div className="item-footer">
                    <div className="item-price">
                      <span className="currency">₦</span>
                      <span className="amount">{item.price.toLocaleString()}</span>
                    </div>
                    <button 
                      className="add-to-cart-btn"
                      onClick={() => handleAddToCart(item)}
                    >
                      Add to Cart
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
                {selectedItem.allergens && (
                  <div className="modal-allergens">
                    <h4>⚠️ Contains:</h4>
                    <p>{selectedItem.allergens.join(', ')}</p>
                  </div>
                )}

                {/* Nutrition Info */}
                {selectedItem.nutrition && (
                  <div className="modal-nutrition">
                    <h4>Nutrition (per serving):</h4>
                    <div className="nutrition-grid">
                      <div className="nutrition-item">
                        <span className="nutrition-value">{selectedItem.nutrition.calories}</span>
                        <span className="nutrition-label">Calories</span>
                      </div>
                      <div className="nutrition-item">
                        <span className="nutrition-value">{selectedItem.nutrition.protein}g</span>
                        <span className="nutrition-label">Protein</span>
                      </div>
                      <div className="nutrition-item">
                        <span className="nutrition-value">{selectedItem.nutrition.carbs}g</span>
                        <span className="nutrition-label">Carbs</span>
                      </div>
                    </div>
                  </div>
                )}

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
                  >
                    Add to Cart
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