import '../App.css';
import '../Gallery.css';
import { useState } from 'react';
import { FaTimes, FaChevronLeft, FaChevronRight, FaInstagram } from 'react-icons/fa';

function Gallery() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Gallery images data
  const galleryImages = [
    {
      id: 1,
      url: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=800&q=80',
      category: 'wraps',
      title: 'Chicken Shawarma Wrap',
      description: 'Perfectly grilled chicken with fresh vegetables'
    },
    {
      id: 2,
      url: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=800&q=80',
      category: 'wraps',
      title: 'Beef Shawarma',
      description: 'Tender beef strips with tahini sauce'
    },
    {
      id: 3,
      url: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=800&q=80',
      category: 'plates',
      title: 'Shawarma Plate',
      description: 'Full plate with rice and sides'
    },
    {
      id: 4,
      url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80',
      category: 'plates',
      title: 'Mixed Grill',
      description: 'Assorted meats with authentic spices'
    },
    {
      id: 5,
      url: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80',
      category: 'plates',
      title: 'Premium Beef Plate',
      description: 'Our signature beef shawarma plate'
    },
    {
      id: 6,
      url: 'https://images.unsplash.com/photo-1623428187969-5da2dcea5ebf?w=800&q=80',
      category: 'wraps',
      title: 'Veggie Wrap',
      description: 'Fresh vegetables with hummus'
    },
    {
      id: 7,
      url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&q=80',
      category: 'sides',
      title: 'Falafel Platter',
      description: 'Crispy falafel with tahini'
    },
    {
      id: 8,
      url: 'https://images.unsplash.com/photo-1595587637401-f8f03d1e6370?w=800&q=80',
      category: 'sides',
      title: 'Hummus & Pita',
      description: 'Creamy hummus with warm pita'
    },
    {
      id: 9,
      url: 'https://images.unsplash.com/photo-1519676867240-f03562e64548?w=800&q=80',
      category: 'desserts',
      title: 'Baklava',
      description: 'Sweet pastry with honey and nuts'
    },
    {
      id: 10,
      url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80',
      category: 'desserts',
      title: 'Kunafa',
      description: 'Cheese pastry soaked in syrup'
    },
    {
      id: 11,
      url: 'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=800&q=80',
      category: 'wraps',
      title: 'Special Shawarma',
      description: 'Our chef\'s special recipe'
    },
    {
      id: 12,
      url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80',
      category: 'sides',
      title: 'Fresh Salad',
      description: 'Mediterranean garden salad'
    },
    {
      id: 13,
      url: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=800&q=80',
      category: 'drinks',
      title: 'Fresh Juices',
      description: 'Freshly squeezed orange juice'
    },
    {
      id: 14,
      url: 'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=800&q=80',
      category: 'drinks',
      title: 'Mango Juice',
      description: 'Sweet and refreshing'
    },
    {
      id: 15,
      url: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&q=80',
      category: 'restaurant',
      title: 'Our Kitchen',
      description: 'Where the magic happens'
    },
    {
      id: 16,
      url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80',
      category: 'restaurant',
      title: 'Dining Area',
      description: 'Comfortable seating for dine-in'
    }
  ];
  // Categories
  const categories = [
    { id: 'all', name: 'All Photos', icon: '🖼️' },
    { id: 'wraps', name: 'Wraps', icon: '🌯' },
    { id: 'plates', name: 'Plates', icon: '🍽️' },
    { id: 'sides', name: 'Sides', icon: '🥗' },
    { id: 'desserts', name: 'Desserts', icon: '🍰' },
    { id: 'drinks', name: 'Drinks', icon: '🥤' },
    { id: 'restaurant', name: 'Restaurant', icon: '🏪' }
  ];

  // Filter images
  const filteredImages = selectedCategory === 'all' 
    ? galleryImages 
    : galleryImages.filter(img => img.category === selectedCategory);

  // Open lightbox
  const openLightbox = (image, index) => {
    setSelectedImage(image);
    setCurrentIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden'; // Prevent scrolling
  };

  // Close lightbox
  const closeLightbox = () => {
    setLightboxOpen(false);
    setSelectedImage(null);
    document.body.style.overflow = 'auto'; // Restore scrolling
  };

  // Navigate to previous image
  const previousImage = () => {
    const newIndex = currentIndex === 0 ? filteredImages.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
    setSelectedImage(filteredImages[newIndex]);
  };

  // Navigate to next image
  const nextImage = () => {
    const newIndex = currentIndex === filteredImages.length - 1 ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
    setSelectedImage(filteredImages[newIndex]);
  };

  // Keyboard navigation
  const handleKeyPress = (e) => {
    if (!lightboxOpen) return;
    
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') previousImage();
    if (e.key === 'ArrowRight') nextImage();
  };

  // Add keyboard listener
  useState(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  });

  return (
    <div className="gallery-page">
      {/* Gallery Header */}
      <section className="gallery-header">
        <h1 className="gallery-title">Our Gallery</h1>
        <p className="gallery-subtitle">
          Feast your eyes on our delicious creations
        </p>
        <div className="instagram-follow">
          <FaInstagram className="instagram-icon" />
          <span>Follow us on Instagram</span>
          <a 
            href="https://instagram.com/masterpiece_shawarma" 
            target="_blank" 
            rel="noopener noreferrer"
            className="instagram-handle"
          >
            @masterpiece_shawarma
          </a>
        </div>
      </section>

      {/* Category Filter */}
      <section className="category-filter">
        {categories.map((category) => (
          <button
            key={category.id}
            className={`filter-btn ${selectedCategory === category.id ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category.id)}
          > 
            <span className="filter-icon">{category.icon}</span>
            <span className="filter-name">{category.name}</span>
          </button>
        ))}
      </section>

      {/* Gallery Grid */}
      <section className="gallery-grid">
        {filteredImages.map((image, index) => (
          <div 
            key={image.id} 
            className="gallery-item"
            onClick={() => openLightbox(image, index)}
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <img 
              src={image.url} 
              alt={image.title}
              loading="lazy"
            />
            <div className="gallery-overlay">
              <h3 className="gallery-item-title">{image.title}</h3>
              <p className="gallery-item-description">{image.description}</p>
              <span className="view-full">Click to view full size</span>
            </div>
          </div>
        ))}
      </section>

      {/* Show count */}
      <div className="gallery-count">
        Showing {filteredImages.length} {filteredImages.length === 1 ? 'photo' : 'photos'}
      </div>
{/* Lightbox Modal */}
      {lightboxOpen && selectedImage && (
        <div className="lightbox-overlay" onClick={closeLightbox}>
          <button 
            className="lightbox-close" 
            onClick={closeLightbox}
            aria-label="Close lightbox"
          >
            <FaTimes />
          </button>

          <button 
            className="lightbox-nav lightbox-prev" 
            onClick={(e) => {
              e.stopPropagation();
              previousImage();
            }}
            aria-label="Previous image"
          >
            <FaChevronLeft />
          </button>

          <button 
            className="lightbox-nav lightbox-next" 
            onClick={(e) => {
              e.stopPropagation();
              nextImage();
            }}
            aria-label="Next image"
          >
            <FaChevronRight />
          </button>

          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <img 
              src={selectedImage.url} 
              alt={selectedImage.title}
              className="lightbox-image"
            />
            <div className="lightbox-info">
              <h2 className="lightbox-title">{selectedImage.title}</h2>
              <p className="lightbox-description">{selectedImage.description}</p>
              <div className="lightbox-counter">
                {currentIndex + 1} / {filteredImages.length}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Call to Action */}
      <section className="gallery-cta">
        <div className="cta-content">
          <h2>Hungry Yet? 😋</h2>
          <p>Order now and taste the difference!</p>
          <button 
            className="cta-button"
            onClick={() => window.location.href = '/menu'}
          >
            View Our Menu
          </button>
        </div>
      </section>
    </div>
  );
}

export default Gallery;