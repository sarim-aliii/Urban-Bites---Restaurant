document.addEventListener('DOMContentLoaded', () => {
    const paymentMethodCards = document.querySelectorAll('.payment-method-card');
    const paymentDetailsDivs = document.querySelectorAll('.payment-details');
    const paymentForm = document.getElementById('paymentForm');
    const payNowBtn = document.getElementById('payNowBtn');
    let selectedMethod = null;

    // Function to handle showing/hiding payment details
    const togglePaymentDetails = (selectedCard) => {
        paymentMethodCards.forEach(card => {
            card.classList.remove('selected');
            card.querySelector('.payment-details').classList.add('hidden');
            // Reset required attribute for all inputs/selects
            card.querySelectorAll('input, select').forEach(input => {
                input.removeAttribute('required');
            });
        });

        if (selectedCard) {
            selectedCard.classList.add('selected');
            const detailsDiv = selectedCard.querySelector('.payment-details');
            if (detailsDiv) {
                detailsDiv.classList.remove('hidden');
                // Set required attribute for inputs/selects in the selected method
                detailsDiv.querySelectorAll('input, select').forEach(input => {
                    input.setAttribute('required', 'true');
                });
                // Focus on the first input field if available
                const firstInput = detailsDiv.querySelector('input, select');
                if (firstInput) {
                    firstInput.focus();
                }
            }
            selectedMethod = selectedCard.dataset.method;
        } else {
            selectedMethod = null;
        }
    };

    // Add click listeners to payment method cards
    paymentMethodCards.forEach(card => {
        card.addEventListener('click', () => {
            togglePaymentDetails(card);
        });
    });

    // Handle form submission (mock payment)
    if (paymentForm) {
        paymentForm.addEventListener('submit', (event) => {
            event.preventDefault(); // Prevent actual form submission

            if (!selectedMethod) {
                alert('Please select a payment method.');
                return;
            }

            // Basic validation for selected method's inputs
            const currentDetailsDiv = document.querySelector(`.payment-method-card.selected .payment-details`);
            if (currentDetailsDiv) {
                const requiredInputs = currentDetailsDiv.querySelectorAll('[required]');
                for (let input of requiredInputs) {
                    if (!input.value.trim()) {
                        alert(`Please fill in all required fields for ${selectedMethod} payment.`);
                        input.focus();
                        return;
                    }
                }
            }

            // Get amount from EJS variable (ensure it's available)
            const amount = <%= order ?order.totalPrice.toFixed(2) : '0.00' %>;

            // In a real application, you would send payment details to your backend
            // and then to a payment gateway.
            // This is a mock success/failure scenario.

            payNowBtn.textContent = 'Processing...';
            payNowBtn.disabled = true;

            // Simulate a delay for payment processing
            setTimeout(() => {
                const isPaymentSuccessful = Math.random() > 0.3; // 70% chance of success

                if (isPaymentSuccessful) {
                    alert('Payment successful! Your order has been confirmed.');
                    // Redirect to a confirmation page or home page
                    window.location.href = '/index'; // Or a dedicated /order-confirmation page
                } else {
                    alert('Payment failed. Please try again or choose a different method.');
                    payNowBtn.textContent = 'Pay Now';
                    payNowBtn.disabled = false;
                    // Optionally, re-show the selected method's details
                    const selectedCard = document.querySelector(`.payment-method-card[data-method="${selectedMethod}"]`);
                    if (selectedCard) {
                        togglePaymentDetails(selectedCard); // Re-activate selection
                    }
                }
            }, 1500); // Simulate 1.5 seconds processing time
        });
    }
});