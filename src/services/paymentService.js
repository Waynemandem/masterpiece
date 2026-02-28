import paystackConfig from '../config/paystackConfig';


/** 
 * initialize paystack payment
 * @param {number} amount - The amount to be paid in kobo (e.g., 5000 for ₦50.00)
 * @param {string} email - The customer's email address
 * @param {function} onSuccess - Callback function to execute on successful payment
 * @param {function} onClose - Callback function to execute when the payment modal is closed
*/

export const initializePaystackPayment = (paymentData) => {
    const {
        email,
        amount, 
        reference,
        metadata = {},
        onSuccess,
        onClose
    } = paymentData;
 
    //check if paystackPop is available
    if (typeof window.PaystackPop === 'undefined') {
        console.error('Paystack script not loaded');
        alert('payment system not available. please refresh the page.');
        return;
    }

    //amount must be in kobo (multiply by 100)
    const amountInKobo = Math.round(amount * 100);

    //initialize paystack handler
    const handler = window.PaystackPop.setup({
        key: paystackConfig.publicKey,
        email: email,
        amount: amountInKobo,
        currency: paystackConfig.currency,
        ref: reference || generateReference(),
        channels: paystackConfig.channels,
        metadata: metadata,


        callback: function (response) {
            console.log('Payment successful:', response);

            //call success callback
            if (onSuccess) {
                onSuccess(response);
            }
        }, 
         
        onClose: function () {
            console.log('payment window closed'); 

            //call close callback
            if (onClose) {
                onClose();
            }
        }
    });

    //open paystack payment modal
    handler.openIframe();
};


/**
 * generate unique reference for payment
 * @returns {string} unique reference string
 * @returns {string} unique reference string
 */
export const generateReference = (prefix = 'MP') => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000000); // random 6 digit number
    return `${prefix}-${timestamp}-${random}`;
};

/**
 * verify payment (to be called on your backend)
 * @param {string} reference - The payment reference to verify
 * @returns {Promise} - Resolves with verification result
 * @returns {Promise<object>} - Resolves with verification result
 */

export const verifyPayment = async (reference) => {
    try {
        // In production, call your backend to verify payment
    // Your backend should use Paystack's verification endpoint with secret key
    
        // Example response structure (
        const response = await fetch('/api/verify-payment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ reference })
        });

        if (!response.ok) {
            throw new Error('Payment verification failed');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error verifying payment:', error);
        throw error;
    }
};  

/**
 * Format amount for display
 * @param {number} amount - amount in naira 
 * @returns {string} formatted amount
 */
export const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
};

export default {
    initializePaystackPayment,
    generateReference,
    verifyPayment,
    formatAmount
};