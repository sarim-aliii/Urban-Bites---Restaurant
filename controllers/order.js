const wrapAsync = require('../util/WrapAsync');
const Order = require('../models/order');
const mongoose = require('mongoose');
const Menu = require('../models/menu');

const DELIVERY_THRESHOLD = 199;
const DELIVERY_FEE = 99;
const GST_RATE = 0.05;

module.exports.delivery = wrapAsync(async (req, res) => {
    const menuItems = await Menu.find({});

    const menuByCategory = menuItems.reduce((acc, item) => {
        if (!acc[item.category]) {
            acc[item.category] = {
                items: [],
                icon: item.icon
            };
        }
        acc[item.category].items.push(item);
        return acc;
    }, {});

    // FIXED: Correct view path
    res.render("delivery", { menuByCategory });
});

module.exports.submitOrder = async (req, res) => {
    const { name, phone, address, items } = req.body;

    // 1. Basic Validation
    if (!name || !phone || !address || !items) {
        req.flash('error', 'Missing customer details or items.');
        return res.redirect('/delivery');
    }

    try {
        // FIXED: Ensure items is an array (it might be a string if only 1 item is selected)
        const itemNames = Array.isArray(items) ? items : [items];
        
        let calculatedSubtotal = 0;
        const finalOrderItems = [];

        // 2. Re-fetch authentic prices from the database
        for (const itemName of itemNames) {
            // FIXED: We now search using itemName directly (since we fixed the value in EJS)
            const dbItem = await Menu.findOne({ name: itemName });

            if (!dbItem) {
                console.error(`Item not found in menu: ${itemName}`);
                req.flash('error', `Item '${itemName}' is no longer available.`);
                return res.redirect('/delivery');
            }

            calculatedSubtotal += dbItem.price; 
            
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

        // FIXED: Redirect to summary instead of sending JSON
        req.flash('success', 'Order placed successfully!');
        res.redirect(`/order-summary/${newOrder._id}`);

    } catch (error) {
        console.error("Error processing secure order:", error);
        req.flash('error', 'Server error processing order.');
        res.redirect('/delivery');
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

        // FIXED: Correct view path
        res.render("orderSummary", { order });
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

    // FIXED: Correct view path
    res.render("madePayment", { order }); 
});