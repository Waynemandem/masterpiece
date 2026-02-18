# 🥙 Masterpiece Shawarma - Restaurant Website

A modern, feature-rich restaurant website built with React for a local shawarma business. Includes online ordering, real-time status updates, and customer engagement features.

## ✨ Features Implemented

### Homepage
- ✅ **Live Status Bar** - Shows open/closed status and delivery hours
- ✅ **Today's Special Banner** - Highlight daily deals and promotions
- ✅ **Hero Section** - Full-screen image background with call-to-actions
- ✅ **Live Order Widget** - Shows current queue and estimated wait time
- ✅ **Quick Reorder Section** - One-click reorder from recent orders
- ✅ **Why Choose Us** - Feature cards with ratings and badges

### Contact Page
- ✅ **Google Maps Embed** - Exact restaurant location
- ✅ **Click-to-Call Button** - Direct phone call on mobile
- ✅ **WhatsApp Chat Button** - Instant messaging
- ✅ **Delivery Zones Map** - Visual representation of delivery areas
- ✅ **Operating Hours** - Auto-updating open/closed status
- ✅ **Social Media Links** - Instagram, Facebook, WhatsApp
- ✅ **Contact Form** - Message submission form

### Navigation
- ✅ **Responsive Navbar** - Mobile hamburger menu
- ✅ **Cart Counter** - Live cart item count
- ✅ **Smooth Animations** - Professional transitions

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Step 1: Install Dependencies

```bash
npm install
```

This will install:
- React & React DOM
- React Router DOM (for navigation)
- React Icons (for icons)

### Step 2: Configure Business Information

Open `Contact.jsx` and update the `businessInfo` object with your details:

```javascript
const businessInfo = {
  name: "Your Restaurant Name",
  phone: "+234-XXX-XXX-XXXX",
  whatsapp: "+234XXXXXXXXXX",
  email: "your@email.com",
  address: "Your Address Here",
  instagram: "https://instagram.com/yourhandle",
  facebook: "https://facebook.com/yourpage",
  mapCoordinates: {
    lat: YOUR_LATITUDE,  // Get from Google Maps
    lng: YOUR_LONGITUDE
  },
  operatingHours: {
    // Update your actual hours
    monday: { open: "11:00", close: "23:00" },
    // ... etc
  }
};
```

### Step 3: Update Delivery Zones

In `Contact.jsx`, modify the `deliveryZones` array:

```javascript
const deliveryZones = [
  { name: "Your Area 1", fee: "₦500", time: "30-45 min" },
  { name: "Your Area 2", fee: "₦800", time: "35-50 min" },
  // Add your delivery areas
];
```

### Step 4: Customize Today's Special

In `Home.jsx`, update the `todaySpecial` object:

```javascript
const todaySpecial = {
  title: "Your Special Title",
  description: "Your Offer Description",
  discount: "Discount %",
  validUntil: "Time",
  code: "PROMO_CODE"
};
```

### Step 5: Replace Hero Background Image

In `App.css`, find `.hero-section` and replace the background image:

```css
.hero-section {
  background-image: url('YOUR_IMAGE_URL_HERE');
}
```

### Step 6: Start Development Server

```bash
npm start
```

Visit `http://localhost:3000` to see your site!

## 📁 Project Structure

```
masterpiece-shawarma/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   └── Navbar.jsx          # Navigation component
│   ├── pages/
│   │   ├── Home.jsx             # Homepage with all features
│   │   ├── Contact.jsx          # Contact page
│   │   ├── Menu.jsx             # Menu page (to be built)
│   │   └── Gallery.jsx          # Gallery page (to be built)
│   ├── App.js                   # Main app component
│   ├── App.css                  # Global styles
│   └── index.js                 # Entry point
├── package.json
└── README.md
```

## 🎨 Customization Guide

### Colors
The site uses a gold/black theme. To change colors, update these CSS variables in `App.css`:

```css
/* Primary Gold */
#f4b400, #ffd700

/* Dark Backgrounds */
#0f172a, #1e293b, #111

/* Text Colors */
#ffffff (white)
#cbd5e1 (light gray)
#94a3b8 (medium gray)
```

### Fonts
Current font stack is system fonts. To use custom fonts:

1. Add font link to `public/index.html`
2. Update `body` font-family in `App.css`

### Images
Replace placeholder images in:
- Hero section background (`App.css`)
- Reorder section items (`Home.jsx`)
- Menu items (when you build menu page)

## 🔧 Configuration

### Google Maps API
To use Google Maps properly:

1. Get API key from [Google Cloud Console](https://console.cloud.google.com/)
2. Enable Maps Embed API
3. Replace the iframe src in `Contact.jsx` with your embed code

### WhatsApp Integration
The WhatsApp button uses the format:
```
https://wa.me/PHONE_NUMBER?text=MESSAGE
```

Replace `PHONE_NUMBER` with your WhatsApp number (include country code, no +).

### Operating Hours Logic
The site auto-detects if you're open based on:
- Current day of week
- Current time in 24-hour format

Update `operatingHours` in `Contact.jsx` to match your schedule.

## 📱 Mobile Optimization

The site is fully responsive with:
- Mobile-first design approach
- Hamburger menu for small screens
- Touch-friendly buttons (44px minimum)
- Optimized images for mobile data
- Fixed navigation for easy access

## 🚀 Next Steps (Phase 2)

To continue development:

1. **Build Menu Page**
   - Menu items with images
   - Category filtering
   - Add to cart functionality

2. **Shopping Cart**
   - Cart state management
   - Quantity adjustments
   - Subtotal calculations

3. **Checkout Flow**
   - Customer information form
   - Delivery/pickup selection
   - Payment integration

4. **Backend Integration**
   - Firebase setup
   - Real-time order updates
   - Customer authentication

5. **Admin Panel**
   - Order management
   - Menu editing
   - Analytics dashboard

## 🐛 Common Issues

### Icons not showing
```bash
npm install react-icons
```

### Routing not working
Make sure you're using `react-router-dom` v6:
```bash
npm install react-router-dom@latest
```

### Styles not applying
Check that `App.css` and `Contact.css` are imported in components:
```javascript
import '../App.css';
import './Contact.css';  // If separate file
```

## 📞 Support

For questions or issues:
- Check the code comments in each file
- Review the senior developer plan document
- Open an issue on your repository

## 📄 License

This project is for Masterpiece Shawarma business use.

## 🙏 Credits

Built with:
- React
- React Router
- React Icons
- Love for great shawarma! 🥙

---

**Version:** 1.0.0  
**Last Updated:** February 2026  
**Status:** Phase 1 MVP Complete ✅