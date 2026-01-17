const wrapAsync = require('../util/WrapAsync');
const Order = require('../models/order');
const { orderSchema } = require('../schemas');
const mongoose = require('mongoose');
const Menu = require('../models/menu');


const DELIVERY_THRESHOLD = 199;
const DELIVERY_FEE = 99;
const GST_RATE = 0.05;


module.exports.delivery = wrapAsync(async (req, res) => {
    // Fetch all items
    const menuItems = await Menu.find({});

    // Group items by category for easier rendering
    const menuByCategory = menuItems.reduce((acc, item) => {
        if (!acc[item.category]) {
            acc[item.category] = {
                items: [],
                icon: item.icon // Store icon from the first item in category
            };
        }
        acc[item.category].items.push(item);
        return acc;
    }, {});

    // Pass the grouped menu to the template
    res.render("delivery.ejs", { menuByCategory });
});


module.exports.submitOrder = async (req, res) => {
    const { name, phone, address, items } = req.body;

    // 1. Basic Validation
    if (!name || !phone || !address || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ message: "Missing customer details or items." });
    }

    try {
        let calculatedSubtotal = 0;
        const finalOrderItems = [];

        // 2. Re-fetch authentic prices from the database
        // We iterate through the requested items and look them up
        for (const item of items) {
            // Find the item in the DB by name (or ID if you refactored to IDs)
            const dbItem = await Menu.findOne({ name: item.name });

            if (!dbItem) {
                console.error(`Item not found in menu: ${item.name}`);
                // You might choose to ignore the item or fail the order
                return res.status(400).json({ message: `Item '${item.name}' is no longer available.` });
            }

            // Trust ONLY the database price
            calculatedSubtotal += dbItem.price; 
            
            // Add to our verified list
            finalOrderItems.push({
                name: dbItem.name,
                price: dbItem.price 
            });
        }

        // 3. Server-side Calculation Logic
        let currentDeliveryFee = 0;
        if (calculatedSubtotal > 0 && calculatedSubtotal < DELIVERY_THRESHOLD) {
            currentDeliveryFee = DELIVERY_FEE;
        }

        const gstAmount = calculatedSubtotal * GST_RATE;
        const total = calculatedSubtotal + currentDeliveryFee + gstAmount;

        // 4. Create Order with Verified Values
        const newOrder = new Order({
            name,
            phone,
            address,
            items: finalOrderItems,
            subtotal: calculatedSubtotal,
            deliveryFee: currentDeliveryFee,
            gstAmount: gstAmount,
            totalPrice: total
        });

        await newOrder.save();
        console.log("Secure Order Placed:", newOrder._id);

        return res.status(200).json({ message: "Order placed successfully!", order: newOrder });

    } catch (error) {
        console.error("Error processing secure order:", error);
        return res.status(500).json({ message: "Server error processing order." });
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