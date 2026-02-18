# 📸 Gallery Page - Complete Setup Guide

## 🎉 What We Built

A **stunning photo gallery** showcasing your delicious food:

### ✨ Features

**Visual Display:**
- 📷 **16 high-quality photos** across all categories
- 🎨 **Masonry grid layout** - Professional photo arrangement
- 🌟 **Hover effects** - Smooth image zoom and overlay
- 📱 **Fully responsive** - Perfect on all devices

**Navigation:**
- 🏷️ **Category filtering** - 7 categories (All, Wraps, Plates, Sides, Desserts, Drinks, Restaurant)
- 🔍 **Click to zoom** - Full-screen lightbox view
- ⬅️➡️ **Arrow navigation** - Browse through images
- ⌨️ **Keyboard support** - Arrow keys and ESC

**Lightbox Modal:**
- 🖼️ **Full-screen image view**
- 📝 **Image title and description**
- 🔢 **Photo counter** (1/16, 2/16, etc.)
- ❌ **Easy close** - Click outside or ESC key
- 🎯 **Navigation arrows** - Previous/Next buttons

**Social Integration:**
- 📱 **Instagram follow button** - Animated gradient
- 🔗 **Direct link** to Instagram profile

**Call to Action:**
- 🍽️ **"Hungry Yet?" section** - Drives to menu
- 🎯 **Direct menu button** - Convert viewers to customers

---

## 📁 File Structure

```
src/
├── pages/
│   ├── Gallery.jsx     ⭐ NEW FILE
│   └── Gallery.css     ⭐ NEW FILE
```

---

## 🚀 Installation

### Step 1: Add Files

Place these files:
1. **Gallery.jsx** → `src/pages/Gallery.jsx`
2. **Gallery.css** → `src/pages/Gallery.css`

### Step 2: Verify Route

Make sure `App.js` has the gallery route:

```javascript
<Route 
  path="/gallery"
  element={<Gallery />} 
/>
```

### Step 3: Test

Navigate to:
```
http://localhost:3000/gallery
```

---

## 🎨 How It Works

### **Category Filtering**

Click any category button to filter:
- **All Photos** - Shows all 16 images
- **Wraps** - Shows only wrap photos
- **Plates** - Shows only plate photos
- **Sides** - Shows sides like hummus, falafel
- **Desserts** - Shows baklava, kunafa
- **Drinks** - Shows juice photos
- **Restaurant** - Shows your location/interior

**Active category** is highlighted in gold with shadow.

### **Lightbox Features**

Click any image to:
1. Open full-screen view
2. See image title and description
3. Navigate with:
   - ⬅️ **Left arrow** - Previous image
   - ➡️ **Right arrow** - Next image
   - ❌ **Close button** - Exit lightbox
   - **Click outside** - Exit lightbox
   - **ESC key** - Exit lightbox
   - **Arrow keys** - Navigate

### **Animations**

- Images fade in one by one (staggered)
- Hover zooms image smoothly
- Overlay slides up on hover
- Lightbox scales in
- Instagram button floats

---

## ⚙️ Customization

### **Add Your Own Photos**

Edit `galleryImages` array in `Gallery.jsx`:

```javascript
const galleryImages = [
  {
    id: 1,
    url: 'YOUR_IMAGE_URL_HERE',
    category: 'wraps', // or plates, sides, desserts, drinks, restaurant
    title: 'Your Dish Name',
    description: 'Your description here'
  },
  // Add more images...
];
```

### **Image Categories**

Available categories:
- `wraps` - Shawarma wraps
- `plates` - Full plates with rice
- `sides` - Side dishes
- `desserts` - Sweet treats
- `drinks` - Beverages
- `restaurant` - Your location/interior

**To add a new category:**

1. Add to `categories` array:
```javascript
{ id: 'specials', name: 'Specials', icon: '⭐' }
```

2. Add images with that category:
```javascript
{ id: 17, url: '...', category: 'specials', ... }
```

### **Change Instagram Link**

Update in `Gallery.jsx`:

```javascript
<a 
  href="https://instagram.com/YOUR_HANDLE" 
  target="_blank" 
  rel="noopener noreferrer"
  className="instagram-handle"
>
  @YOUR_HANDLE
</a>
```

### **Image Sources**

**Where to get images:**

1. **Your own photos** - Best option!
   - Use a smartphone with good camera
   - Natural lighting is key
   - Upload to Cloudinary/ImgBB for URLs

2. **Free stock photos:**
   - Unsplash (currently used)
   - Pexels
   - Pixabay

3. **Professional photography:**
   - Hire local food photographer
   - Worth the investment for branding

**Image specifications:**
- Format: JPG or PNG
- Size: 800-1200px width recommended
- Aspect ratio: Any (grid adapts)
- File size: Under 500KB for fast loading

### **Upload to Cloudinary (Free)**

1. Sign up at cloudinary.com
2. Upload your food photos
3. Copy image URLs
4. Replace in `galleryImages` array

**Example:**
```javascript
url: 'https://res.cloudinary.com/YOUR_CLOUD/image/upload/v123/shawarma.jpg'
```

---

## 🎯 Category Examples

### **Wraps Category**
- Chicken shawarma wrap
- Beef shawarma wrap
- Mixed meat wrap
- Veggie wrap
- Special wrap
- Mini wrap

### **Plates Category**
- Chicken plate with rice
- Beef plate with rice
- Mixed grill combo
- Falafel plate
- Sampler platter

### **Sides Category**
- Hummus & pita
- French fries
- Arabic salad
- Falafel
- Baba ganoush
- Tabbouleh

### **Desserts Category**
- Baklava
- Kunafa
- Basbousa
- Ma'amoul

### **Drinks Category**
- Fresh orange juice
- Mango juice
- Ayran (yogurt drink)
- Soft drinks
- Mint lemonade

### **Restaurant Category**
- Store front exterior
- Dining area interior
- Kitchen (clean, professional)
- Staff preparing food
- Counter/ordering area
- Outdoor seating (if any)

---

## 📷 Photo Tips

### **Taking Great Food Photos**

**Lighting:**
- ✅ Natural daylight (near window)
- ✅ Soft, diffused light
- ❌ Harsh direct sunlight
- ❌ Yellow indoor lights

**Composition:**
- ✅ 45-degree angle (best for food)
- ✅ Close-up shots (show texture)
- ✅ Clean background
- ❌ Messy surroundings
- ❌ Too far away

**Styling:**
- ✅ Fresh ingredients visible
- ✅ Garnish appropriately
- ✅ Use nice plates/containers
- ❌ Old, wilted vegetables
- ❌ Messy presentation

**Editing:**
- ✅ Increase contrast slightly
- ✅ Enhance colors naturally
- ✅ Sharpen details
- ❌ Over-saturate colors
- ❌ Heavy filters

---

## 🎨 Design Customization

### **Change Grid Columns**

In `Gallery.css`, find:

```css
.gallery-grid {
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
}
```

**Options:**
- `minmax(300px, 1fr)` - Current (3-4 per row)
- `minmax(250px, 1fr)` - More columns (4-5 per row)
- `minmax(400px, 1fr)` - Fewer columns (2-3 per row)

### **Change Image Height**

```css
.gallery-item img {
  height: 280px; /* Change this value */
}
```

**Options:**
- `250px` - Shorter images
- `300px` - Taller images
- `auto` - Keep original aspect ratio

### **Change Colors**

Replace gold with your brand color:

Find `#f4b400` and `#ffd700` in CSS and replace with:
- Blue: `#3b82f6` and `#60a5fa`
- Green: `#10b981` and `#34d399`
- Red: `#ef4444` and `#f87171`
- Purple: `#8b5cf6` and `#a78bfa`

---

## 🔧 Troubleshooting

### Images Not Loading

**Problem:** Blank boxes instead of images

**Solutions:**
1. Check image URLs are correct
2. Try opening URL directly in browser
3. Check internet connection
4. Use different image source

### Lightbox Not Opening

**Problem:** Clicking image does nothing

**Solutions:**
1. Check browser console for errors (F12)
2. Make sure `Gallery.css` is imported
3. Verify `react-icons` is installed:
   ```bash
   npm install react-icons
   ```

### Category Filter Not Working

**Problem:** Clicking categories doesn't filter

**Solutions:**
1. Check `category` field in images matches category `id`
2. Make sure category names are lowercase
3. Verify state management (useState) is working

### Keyboard Navigation Not Working

**Problem:** Arrow keys don't navigate

**Solutions:**
1. Make sure lightbox is open
2. Check browser console for errors
3. Click inside lightbox first

### Layout Broken on Mobile

**Problem:** Images overflow or look weird

**Solutions:**
1. Clear browser cache
2. Test in incognito/private mode
3. Check viewport meta tag in `index.html`:
   ```html
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   ```

---

## 📱 Mobile Optimization

The gallery is **fully responsive**:

**Desktop (1200px+):**
- 4 columns
- Hover effects enabled
- Large lightbox

**Tablet (768-1200px):**
- 3 columns
- Touch-friendly
- Medium lightbox

**Mobile (< 768px):**
- 2 columns
- Large touch targets
- Full-screen lightbox
- Simplified navigation

---

## 🚀 Performance Tips

### **Lazy Loading**

Already implemented! Images load as you scroll:
```javascript
<img loading="lazy" ... />
```

### **Image Optimization**

Before uploading:
1. Resize to max 1200px width
2. Compress (TinyPNG, Squoosh)
3. Use WebP format when possible
4. Target 100-300KB per image

### **Speed Tricks**

- Use CDN (Cloudinary, ImgBB)
- Enable browser caching
- Compress with tools
- Lazy load images (already done)

---

## 🎯 Marketing with Gallery

### **Instagram Integration**

1. Post your best food photos on Instagram
2. Tag location
3. Use hashtags: #shawarma #lagos #foodie
4. Link to gallery in bio

### **Social Proof**

Add customer photos:
```javascript
{
  id: 18,
  url: 'customer-photo.jpg',
  category: 'customer',
  title: 'Happy Customer!',
  description: 'Amazing shawarma - @customername'
}
```

### **Before/After**

Show preparation:
- Raw ingredients
- Cooking process
- Final presentation
- Customer enjoying

---

## ✅ Final Checklist

Before going live:

- [ ] Replace all 16 images with your photos
- [ ] Update Instagram handle
- [ ] Test all categories
- [ ] Test lightbox on mobile
- [ ] Check loading speed
- [ ] Verify images look good
- [ ] Test keyboard navigation
- [ ] Check on different browsers
- [ ] Optimize image sizes
- [ ] Test click-to-menu button

---

## 🎉 You're Done!

Your gallery page is ready! Features:
- ✅ 16 photos (replace with yours)
- ✅ Category filtering
- ✅ Lightbox viewer
- ✅ Keyboard navigation
- ✅ Mobile responsive
- ✅ Instagram integration
- ✅ Call to action

**Next steps:**
1. Replace placeholder images with your photos
2. Update Instagram link
3. Test thoroughly
4. Show it off to customers!

**Want to add next?**
- Firebase integration
- Admin dashboard  
- Deploy to production

Just let me know! 🚀