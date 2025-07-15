document.addEventListener("DOMContentLoaded", () => {
    const menuItems = document.querySelectorAll('.menu-item');
    const totalPriceEl = document.getElementById('totalPrice'); 
    const totalPriceInput = document.getElementById('totalPriceInput'); 
    const deliveryFeeEl = document.getElementById('deliveryFee');
    const gstAmountEl = document.getElementById('gstAmount');
    const finalTotalEl = document.getElementById('finalTotal');

    const DELIVERY_THRESHOLD = 199;
    const DELIVERY_FEE = 99;
    const GST_RATE = 0.05;

    const updateTotals = () => {
        let subtotal = 0;
        document.querySelectorAll('.menu-item:checked').forEach(checkedItem => {
            subtotal += parseFloat(checkedItem.getAttribute('data-price'));
        });

        let currentDeliveryFee = 0;
        if (subtotal > 0 && subtotal < DELIVERY_THRESHOLD) {
            currentDeliveryFee = DELIVERY_FEE;
        }

        const gstAmount = subtotal * GST_RATE;
        const finalTotal = subtotal + currentDeliveryFee + gstAmount;

        // Update display elements
        totalPriceEl.textContent = subtotal.toFixed(2);
        if (deliveryFeeEl) {
            deliveryFeeEl.textContent = currentDeliveryFee.toFixed(2);
        }
        if (gstAmountEl) {
            gstAmountEl.textContent = gstAmount.toFixed(2);
        }
        if (finalTotalEl) {
            finalTotalEl.textContent = finalTotal.toFixed(2);
        }

        totalPriceInput.value = finalTotal.toFixed(2);
    };

    menuItems.forEach(item => {
        item.addEventListener('change', updateTotals);
    });

    updateTotals();


    const orderForm = document.getElementById('orderForm');
    orderForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const customerName = document.getElementById("customerName").value.trim();
        const customerPhone = document.getElementById("customerPhone").value.trim();
        const customerAddress = document.getElementById("customerAddress").value.trim();
        const selectedItems = Array.from(document.querySelectorAll('.menu-item:checked')).map(item => ({
            name: item.value.split(' - ')[0], 
            price: parseFloat(item.getAttribute('data-price'))
        }));

        // Re-calculate the final total just before submission to ensure accuracy
        let subtotal = 0;
        selectedItems.forEach(item => {
            subtotal += item.price;
        });

        let currentDeliveryFee = 0;
        if (subtotal > 0 && subtotal < DELIVERY_THRESHOLD) {
            currentDeliveryFee = DELIVERY_FEE;
        }

        const gstAmount = subtotal * GST_RATE;
        const finalCalculatedTotal = subtotal + currentDeliveryFee + gstAmount;


        if (!customerName || !customerPhone || !customerAddress || selectedItems.length === 0) {
            alert("Please fill in all customer details and select at least one item.");
            return;
        }

        try {
            const response = await fetch('/submit-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: customerName,
                    phone: customerPhone,
                    address: customerAddress,
                    items: selectedItems,
                    subtotal: subtotal.toFixed(2),
                    deliveryFee: currentDeliveryFee.toFixed(2),
                    gstAmount: gstAmount.toFixed(2),
                    totalPrice: finalCalculatedTotal.toFixed(2)
                }),
            });

            if (response.ok) {
                const result = await response.json(); 
                window.location.href = `/order-summary/${result.order._id}`; 
            } 
            else {
                const errorData = await response.json();
                alert(`Error: ${errorData.message || 'An unknown error occurred.'}`);
            }
        }
        catch (err) {
            console.error("Error submitting order:", err);
            alert("An error occurred while placing the order. Please try again.");
        }
    });
});