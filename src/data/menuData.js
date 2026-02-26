// Menu data for Masterpiece Shawarma
// Each item includes: name, description, price, category, image, badges, etc.

const menuData = [
  // WRAPS
  {
    id: 1,
    name: "Chicken Shawarma",
    description: "Grilled chicken with ketchup sauce and healthy Carbs",
    price: 2000,
    category: "wraps",
    image: "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=600&q=80",
    popular: true,
    rating: 4.7,
    reviews: 56,
    ingredients: ["sliced boneless chicken", "Sauage (hotdogs)","manyonnaise","chill pepper","shawarma wrap", "ketchup", "carbage", "spicy suya"],
    nutrition: {
      calories: 450,
      protein: 28,
      carbs: 42
    }
  },
    {
    id: 2,
    name: "Big Chicken Shawarma",
    description: "",
    price: 3000,
    category: "Big combo",
    image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=800&q=80",
    popular: true,
    rating: 5.0,
    reviews: 88,
    ingredients: ["Extra sliced boneless chicken", "Double Sauage","manyonnaise","chill pepper","shawarma wrap", "ketchup", "carbage", "spicy suya"],
    nutrition: {
      calories: 981,
      protein: 37,
      carbs: 70.8
    }
  }
];

export default menuData;