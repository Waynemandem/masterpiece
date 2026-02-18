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
  },
  {
    id: 2,
    name: "Beef Shawarma Wrap",
    description: "Succulent beef strips with tahini sauce and Mediterranean spices",
    price: 1350,
    category: "wraps",
    image: "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=600&q=80",
    popular: true,
    halal: true,
    rating: 4.9,
    reviews: 98,
    ingredients: ["Grilled beef", "Tahini sauce", "Onions", "Tomatoes", "Parsley", "Flatbread"],
    allergens: ["Gluten", "Sesame"],
    nutrition: {
      calories: 520,
      protein: 32,
      carbs: 45
    }
  },
  {
    id: 3,
    name: "Veggie Shawarma Wrap",
    description: "Grilled vegetables with hummus and tahini sauce",
    price: 950,
    category: "wraps",
    image: "https://images.unsplash.com/photo-1623428187969-5da2dcea5ebf?w=600&q=80",
    vegetarian: true,
    halal: true,
    rating: 4.6,
    reviews: 54,
    ingredients: ["Grilled vegetables", "Hummus", "Tahini", "Lettuce", "Flatbread"],
    allergens: ["Gluten", "Sesame"],
    nutrition: {
      calories: 350,
      protein: 12,
      carbs: 48
    }
  },
  {
    id: 4,
    name: "Mixed Meat Wrap",
    description: "Combination of chicken and beef with special sauce",
    price: 1500,
    category: "wraps",
    image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=600&q=80",
    popular: true,
    halal: true,
    new: true,
    rating: 4.9,
    reviews: 76,
    ingredients: ["Grilled chicken", "Grilled beef", "Mixed sauce", "Veggies", "Flatbread"],
    allergens: ["Gluten", "Dairy", "Sesame"],
    nutrition: {
      calories: 580,
      protein: 35,
      carbs: 46
    }
  },

  // PLATES
  {
    id: 5,
    name: "Chicken Shawarma Plate",
    description: "Generous chicken serving with rice, salad, and sauces",
    price: 1800,
    category: "plates",
    image: "https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=600&q=80",
    popular: true,
    halal: true,
    rating: 4.7,
    reviews: 112,
    ingredients: ["Grilled chicken", "Basmati rice", "Salad", "Garlic sauce", "Pickles"],
    allergens: ["Dairy"],
    nutrition: {
      calories: 650,
      protein: 42,
      carbs: 68
    }
  },
  {
    id: 6,
    name: "Beef Shawarma Plate",
    description: "Premium beef with rice, hummus, and Mediterranean salad",
    price: 2100,
    category: "plates",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&q=80",
    halal: true,
    rating: 4.8,
    reviews: 89,
    ingredients: ["Grilled beef", "Basmati rice", "Hummus", "Salad", "Tahini"],
    allergens: ["Sesame"],
    nutrition: {
      calories: 720,
      protein: 48,
      carbs: 72
    }
  },
  {
    id: 7,
    name: "Mixed Grill Combo",
    description: "Chicken, beef, and kofta with sides and sauces",
    price: 2500,
    category: "plates",
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80",
    popular: true,
    halal: true,
    new: true,
    rating: 5.0,
    reviews: 142,
    ingredients: ["Grilled chicken", "Beef", "Kofta", "Rice", "Salad", "Mixed sauces"],
    allergens: ["Dairy", "Sesame"],
    nutrition: {
      calories: 850,
      protein: 58,
      carbs: 75
    }
  },
  {
    id: 8,
    name: "Falafel Plate",
    description: "Crispy falafel with hummus, tahini, and fresh salad",
    price: 1400,
    category: "plates",
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&q=80",
    vegetarian: true,
    halal: true,
    rating: 4.5,
    reviews: 67,
    ingredients: ["Falafel", "Hummus", "Tahini", "Salad", "Pickles"],
    allergens: ["Gluten", "Sesame"],
    nutrition: {
      calories: 480,
      protein: 18,
      carbs: 62
    }
  },

  // SIDES
  {
    id: 9,
    name: "Hummus & Pita",
    description: "Creamy hummus served with warm pita bread",
    price: 550,
    category: "sides",
    image: "https://images.unsplash.com/photo-1595587637401-f8f03d1e6370?w=600&q=80",
    vegetarian: true,
    halal: true,
    rating: 4.7,
    reviews: 93,
    ingredients: ["Chickpeas", "Tahini", "Olive oil", "Lemon", "Pita bread"],
    allergens: ["Gluten", "Sesame"],
    nutrition: {
      calories: 280,
      protein: 8,
      carbs: 32
    }
  },
  {
    id: 10,
    name: "French Fries",
    description: "Crispy golden fries with special seasoning",
    price: 400,
    category: "sides",
    image: "https://images.unsplash.com/photo-1576107232684-1279f390859f?w=600&q=80",
    vegetarian: true,
    halal: true,
    rating: 4.4,
    reviews: 156,
    ingredients: ["Potatoes", "Seasoning"],
    allergens: [],
    nutrition: {
      calories: 320,
      protein: 4,
      carbs: 42
    }
  },
  {
    id: 11,
    name: "Arabic Salad",
    description: "Fresh tomatoes, cucumbers, and onions with lemon dressing",
    price: 450,
    category: "sides",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80",
    vegetarian: true,
    halal: true,
    rating: 4.6,
    reviews: 78,
    ingredients: ["Tomatoes", "Cucumbers", "Onions", "Parsley", "Lemon", "Olive oil"],
    allergens: [],
    nutrition: {
      calories: 120,
      protein: 3,
      carbs: 18
    }
  },
  {
    id: 12,
    name: "Garlic Sauce",
    description: "Our signature creamy garlic sauce",
    price: 200,
    category: "sides",
    image: "https://images.unsplash.com/photo-1472476443507-c7a5948772fc?w=600&q=80",
    vegetarian: true,
    halal: true,
    popular: true,
    rating: 4.9,
    reviews: 201,
    ingredients: ["Garlic", "Oil", "Lemon", "Salt"],
    allergens: [],
    nutrition: {
      calories: 150,
      protein: 1,
      carbs: 4
    }
  },

  // DRINKS
  {
    id: 13,
    name: "Fresh Orange Juice",
    description: "Freshly squeezed orange juice",
    price: 400,
    category: "drinks",
    image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=600&q=80",
    vegetarian: true,
    halal: true,
    rating: 4.5,
    reviews: 87,
    ingredients: ["Fresh oranges"],
    allergens: [],
    nutrition: {
      calories: 110,
      protein: 2,
      carbs: 26
    }
  },
  {
    id: 14,
    name: "Mango Juice",
    description: "Sweet and refreshing mango juice",
    price: 400,
    category: "drinks",
    image: "https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=600&q=80",
    vegetarian: true,
    halal: true,
    rating: 4.6,
    reviews: 64,
    ingredients: ["Fresh mango", "Sugar"],
    allergens: [],
    nutrition: {
      calories: 130,
      protein: 1,
      carbs: 32
    }
  },
  {
    id: 15,
    name: "Ayran (Yogurt Drink)",
    description: "Traditional salted yogurt drink",
    price: 350,
    category: "drinks",
    image: "https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?w=600&q=80",
    vegetarian: true,
    halal: true,
    rating: 4.3,
    reviews: 45,
    ingredients: ["Yogurt", "Water", "Salt"],
    allergens: ["Dairy"],
    nutrition: {
      calories: 80,
      protein: 4,
      carbs: 12
    }
  },
  {
    id: 16,
    name: "Coca-Cola",
    description: "Classic Coca-Cola (330ml)",
    price: 300,
    category: "drinks",
    image: "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=600&q=80",
    vegetarian: true,
    halal: true,
    rating: 4.7,
    reviews: 198,
    ingredients: ["Carbonated water", "Sugar", "Cola flavor"],
    allergens: [],
    nutrition: {
      calories: 140,
      protein: 0,
      carbs: 39
    }
  },

  // DESSERTS
  {
    id: 17,
    name: "Baklava",
    description: "Sweet pastry made of layers of filo with nuts and honey",
    price: 600,
    category: "desserts",
    image: "https://images.unsplash.com/photo-1519676867240-f03562e64548?w=600&q=80",
    vegetarian: true,
    halal: true,
    popular: true,
    rating: 4.8,
    reviews: 115,
    ingredients: ["Filo pastry", "Walnuts", "Honey", "Butter"],
    allergens: ["Gluten", "Nuts", "Dairy"],
    nutrition: {
      calories: 350,
      protein: 6,
      carbs: 45
    }
  },
  {
    id: 18,
    name: "Kunafa",
    description: "Cheese pastry soaked in sweet syrup",
    price: 650,
    category: "desserts",
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&q=80",
    vegetarian: true,
    halal: true,
    new: true,
    rating: 4.9,
    reviews: 82,
    ingredients: ["Shredded filo", "Cheese", "Sugar syrup", "Butter"],
    allergens: ["Gluten", "Dairy"],
    nutrition: {
      calories: 420,
      protein: 8,
      carbs: 52
    }
  }
];

export default menuData;