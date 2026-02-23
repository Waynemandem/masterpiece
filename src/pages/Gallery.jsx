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
      url: 'https://i.pinimg.com/736x/70/15/b0/7015b012d9e43a6bfe41bb7f7d3aca88.jpg',
      category: 'wraps',
      title: 'Chicken Shawarma Wrap',
      description: 'Perfectly grilled chicken with fresh vegetables'
    },
    {
      id: 2,
      url: 'https://i.pinimg.com/736x/df/52/4f/df524f7b7bd6c0aeecb9c9b9e553fee7.jpg',
      category: 'wraps',
      title: 'Beef Shawarma',
      description: 'Tender beef strips with tahini sauce'
    },
    {
      id: 3,
      url: "https://i.pinimg.com/736x/0b/58/9d/0b589d1d7f88ba576b7e64707cec1aa4.jpg",//imaes.unsplash.com/photo-1603360946369-dc9bb6258143?w=800&q=80',
      category: 'plates',
      title: 'Shawarma Plate',
      description: 'Full plate with rice and sides'
    },
    {
      id: 4,
      url: 'https://i.pinimg.com/736x/aa/df/43/aadf43d4996a40474d25efb8a61d51dd.jpg',
      category: 'plates',
      title: 'Mixed Grill',
      description: 'Assorted meats with authentic spices'
    },
    {
      id: 5,
      url: 'https://i.pinimg.com/736x/27/53/2c/27532c87e5eb3c158127aefba3a89b14.jpg',
      category: 'plates',
      title: 'Premium Beef Plate',
      description: 'Our signature beef shawarma plate'
    },
    {
      id: 6,
      url: 'https://i.pinimg.com/736x/08/78/8e/08788e05dd62cef90becbad81b3dc48c.jpg',
      category: 'wraps',
      title: 'Veggie Wrap',
      description: 'Fresh vegetables with hummus'
    },
    {
      id: 7,
      url: 'https://i.pinimg.com/736x/9d/61/37/9d6137ea0f4d4ab2932a8b06b92e072f.jpg',
      category: 'sides',
      title: 'Falafel Platter',
      description: 'Crispy falafel with tahini'
    },
    {
      id: 8,
      url: 'https://i.pinimg.com/736x/25/42/98/2542983abc454a53ecf983ca29f83d7a.jpg',
      category: 'sides',
      title: 'Hummus & Pita',
      description: 'Creamy hummus with warm pita'
    },
    {
      id: 9,
      url: 'https://i.pinimg.com/736x/ca/33/cc/ca33cc7762795f745654f017c00ade26.jpg',
      category: 'desserts',
      title: 'Baklava',
      description: 'Sweet pastry with honey and nuts'
    },
    {
      id: 10,
      url: 'https://i.pinimg.com/736x/08/78/8e/08788e05dd62cef90becbad81b3dc48c.jpg',
      category: 'desserts',
      title: 'Kunafa',
      description: 'Cheese pastry soaked in syrup'
    },
    {
      id: 11,
      url: 'https://i.pinimg.com/736x/86/ac/88/86ac8886a2ae0351e50535855e45102b.jpg',
      category: 'wraps',
      title: 'Special Shawarma',
      description: 'Our chef\'s special recipe'
    },
    {
      id: 12,
      url: 'https://i.pinimg.com/736x/0f/85/99/0f85992890b50bb48ac360cd23f76bf7.jpg',
      category: 'sides',
      title: 'Fresh Salad',
      description: 'Mediterranean garden salad'
    },
    {
      id: 13,
      url: ' https://i.pinimg.com/736x/4d/ce/70/4dce700db06e33e9dfceb3a70cc2ec6f.jpg',
      category: 'drinks',
      title: 'Fresh Juices',
      description: 'Freshly squeezed orange juice'
    },
    {
      id: 14,
      url: 'https://i.pinimg.com/736x/c2/98/05/c29805d4d2749da4beace7aa7dbfa092.jpg',
      category: 'drinks',
      title: 'Mango Juice',
      description: 'Sweet and refreshing'
    },
    {
      id: 15,
      url: 'https://i.pinimg.com/736x/d3/37/fc/d337fc4485a2c43d3c8ef752814e0954.jpg',
      category: 'restaurant',
      title: 'Our Kitchen',
      description: 'Where the magic happens'
    },
    {
      id: 16,
      url: 'https://i.pinimg.com/736x/ba/94/38/ba9438d77c3c31822227e9ca19fd3b60.jpg',
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