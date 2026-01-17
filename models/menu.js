const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    category: { 
        type: String, 
        required: true, 
        enum: ['Appetizers', 'Soups & Salads', 'Main Courses', 'Pizzas', 'Burgers & Sandwiches', 'Sides', 'Desserts', 'Beverages'] 
    },
    icon: { type: String }
});

module.exports = mongoose.model('Menu', menuSchema);