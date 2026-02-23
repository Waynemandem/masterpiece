// Menu data for Masterpiece Shawarma
// Each item includes: name, description, price, category, image, badges, etc.

const menuData = [
  // WRAPS
  {
    id: 1,
    name: "Chicken Shawarma Wrap",
    description: "Tender grilled chicken with garlic sauce, pickles, and fresh veggies",
    price: 1125,
    category: "wraps",
    image: "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=600&q=80",
    popular: true,
    halal: true,
    rating: 4.8,
    reviews: 127,
    ingredients: ["Grilled chicken", "Garlic sauce", "Pickles", "Tomatoes", "Lettuce", "Flatbread"],
    allergens: ["Gluten", "Dairy"],
    nutrition: {
      calories: 450,
      protein: 28,
      carbs: 42
    }
  }
];

export default menuData;