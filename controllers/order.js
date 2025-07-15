// controllers/order.js
const wrapAsync = require('../util/WrapAsync');
const Order = require('../models/order');
const mongoose = require('mongoose');

module.exports.delivery = wrapAsync(async (req, res) => {
    const orders = await Order.find();
    res.render("../views/delivery.ejs", { orders });
});


module.exports.submitOrder = async (req, res) => {
    const { name, phone, address, items, subtotal, deliveryFee, gstAmount, totalPrice } = req.body;

    if (!name || !phone || !address || !Array.isArray(items) || items.length === 0 ||
        subtotal === undefined || deliveryFee === undefined || gstAmount === undefined || totalPrice === undefined) {
        console.error("Invalid input data:", req.body);
        return res.status(400).json({ message: "Invalid input. All customer details, items, and price calculations are required." });
    }

    const areItemsValid = items.every(item => typeof item.name === 'string' && typeof item.price === 'number');
    if (!areItemsValid) {
        console.error("Invalid item data in array:", items);
        return res.status(400).json({ message: "Invalid item data format." });
    }

    try {
        const newOrder = new Order({
            name,
            phone,
            address,
            items,
            subtotal: parseFloat(subtotal),
            deliveryFee: parseFloat(deliveryFee),
            gstAmount: parseFloat(gstAmount),
            totalPrice: parseFloat(totalPrice)
        });

        await newOrder.save();
        console.log("Order saved successfully:", newOrder);

        return res.status(200).json({ message: "Order placed successfully!", order: newOrder });
    }
    catch (error) {
        console.error("Error saving order:", error);
        return res.status(500).json({ message: "Failed to place order due to a server error. Please try again later." });
    }
};


module.exports.getOrderSummary = wrapAsync(async (req, res) => {
    const { id } = req.params; 

    if (!mongoose.Types.ObjectId.isValid(id)) {
        req.flash('error', 'Invalid order ID.');
        return res.redirect('/delivery');
    }

    try {
        const order = await Order.findById(id);

        if (!order) {
            req.flash('error', 'Order not found.');
            return res.redirect('/delivery');
        }

        res.render("../views/orderSummary.ejs", { order });
    } 
    catch (error) {
        console.error("Error fetching order summary:", error);
        req.flash('error', 'An error occurred while fetching your order summary.');
        res.redirect('/delivery'); 
    }
});


module.exports.madePayment = wrapAsync(async (req, res) => {
    const orderId = req.query.orderId;

    if (!orderId || !mongoose.Types.ObjectId.isValid(orderId)) {
        req.flash('error', 'Invalid order details for payment.');
        return res.redirect('/delivery'); 
    }

    const order = await Order.findById(orderId);

    if (!order) {
        req.flash('error', 'Order not found for payment.');
        return res.redirect('/delivery');
    }

    res.render("../views/madePayment.ejs", { order }); 
});