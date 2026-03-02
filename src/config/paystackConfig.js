// paystack configuration 
// src/config/paystackConfig.js
// Configuration loaded from environment variables

const paystackConfig = {
    publicKey: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
    currency: 'NGN',
    // Payment channels to accept
    channels: ['card', 'bank', 'ussd', 'qr', 'mobile_money', 'bank_transfer'],
};

// Validate Paystack configuration
if (!paystackConfig.publicKey) {
  console.error('❌ VITE_PAYSTACK_PUBLIC_KEY is not set in environment variables');
}

export default paystackConfig;