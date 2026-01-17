const mongoose = require('mongoose');
const Menu = require('./models/menu');

// Connect to your DB
mongoose.connect('mongodb://127.0.0.1:27017/urban-bites');

// Full menu data
const menuItems = [
    // Appetizers
    { name: "Bruschetta", price: 800, category: "Appetizers", icon: "fas fa-bread-slice" },
    { name: "Stuffed Mushrooms", price: 1000, category: "Appetizers", icon: "fas fa-bread-slice" },
    { name: "Garlic Bread", price: 600, category: "Appetizers", icon: "fas fa-bread-slice" },
    { name: "Caprese Salad", price: 900, category: "Appetizers", icon: "fas fa-bread-slice" },
    { name: "Spinach Artichoke Dip", price: 1200, category: "Appetizers", icon: "fas fa-bread-slice" },

    // Soups & Salads
    { name: "Tomato Basil Soup", price: 700, category: "Soups & Salads", icon: "fas fa-leaf" },
    { name: "Caesar Salad", price: 800, category: "Soups & Salads", icon: "fas fa-leaf" },
    { name: "Greek Salad", price: 1000, category: "Soups & Salads", icon: "fas fa-leaf" },
    { name: "Minestrone Soup", price: 750, category: "Soups & Salads", icon: "fas fa-leaf" },
    { name: "Chicken Caesar Salad", price: 1200, category: "Soups & Salads", icon: "fas fa-leaf" },

    // Main Courses
    { name: "Grilled Salmon", price: 1800, category: "Main Courses", icon: "fas fa-utensils" },
    { name: "Pasta Carbonara", price: 1500, category: "Main Courses", icon: "fas fa-utensils" },
    { name: "Chicken Parmesan", price: 1600, category: "Main Courses", icon: "fas fa-utensils" },
    { name: "Chicken Lasagna", price: 1700, category: "Main Courses", icon: "fas fa-utensils" },
    { name: "Vegetable Stir-Fry", price: 1400, category: "Main Courses", icon: "fas fa-utensils" },

    // Pizzas
    { name: "Margherita", price: 1200, category: "Pizzas", icon: "fas fa-pizza-slice" },
    { name: "Pepperoni", price: 1400, category: "Pizzas", icon: "fas fa-pizza-slice" },
    { name: "BBQ Chicken", price: 1500, category: "Pizzas", icon: "fas fa-pizza-slice" },
    { name: "Vegetarian", price: 1300, category: "Pizzas", icon: "fas fa-pizza-slice" },
    { name: "Four Cheese", price: 1400, category: "Pizzas", icon: "fas fa-pizza-slice" },

    // Burgers & Sandwiches
    { name: "Classic Cheeseburger", price: 1200, category: "Burgers & Sandwiches", icon: "fas fa-hamburger" },
    { name: "Bacon Avocado Burger", price: 1350, category: "Burgers & Sandwiches", icon: "fas fa-hamburger" },
    { name: "Grilled Chicken Sandwich", price: 1100, category: "Burgers & Sandwiches", icon: "fas fa-hamburger" },
    { name: "BLT Sandwich", price: 1000, category: "Burgers & Sandwiches", icon: "fas fa-hamburger" },
    { name: "Pulled Pork Sandwich", price: 1200, category: "Burgers & Sandwiches", icon: "fas fa-hamburger" },

    // Sides
    { name: "French Fries", price: 400, category: "Sides", icon: "fas fa-carrot" },
    { name: "Sweet Potato Fries", price: 500, category: "Sides", icon: "fas fa-carrot" },
    { name: "Coleslaw", price: 300, category: "Sides", icon: "fas fa-carrot" },
    { name: "Onion Rings", price: 450, category: "Sides", icon: "fas fa-carrot" },
    { name: "Side Salad", price: 500, category: "Sides", icon: "fas fa-carrot" },

    // Desserts
    { name: "Cheesecake", price: 700, category: "Desserts", icon: "fas fa-ice-cream" },
    { name: "Tiramisu", price: 800, category: "Desserts", icon: "fas fa-ice-cream" },
    { name: "Chocolate Lava Cake", price: 900, category: "Desserts", icon: "fas fa-ice-cream" },
    { name: "Ice Cream Sundae", price: 600, category: "Desserts", icon: "fas fa-ice-cream" },
    { name: "Apple Pie", price: 700, category: "Desserts", icon: "fas fa-ice-cream" },

    // Beverages
    { name: "Soft Drinks", price: 250, category: "Beverages", icon: "fas fa-glass-martini-alt" },
    { name: "Fresh Lemonade", price: 350, category: "Beverages", icon: "fas fa-glass-martini-alt" },
    { name: "Iced Tea", price: 300, category: "Beverages", icon: "fas fa-glass-martini-alt" },
    { name: "Coffee", price: 250, category: "Beverages", icon: "fas fa-glass-martini-alt" },
    { name: "Espresso", price: 300, category: "Beverages", icon: "fas fa-glass-martini-alt" }
];

const seedDB = async () => {
    await Menu.deleteMany({});
    await Menu.insertMany(menuItems);
    console.log("Menu seeded successfully!");
    mongoose.connection.close();
};

seedDB();