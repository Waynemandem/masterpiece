// paystack configuration 
// src/config/paystackConfig.js

const paystackConfig = {
    publicKey: 'pk_test_7c2d6be07d36ea7046409e7cf58a186db27bbba9',
    currency: 'NGN',
    // Payment channels to accept
  channels: ['card', 'bank', 'ussd', 'qr', 'mobile_money', 'bank_transfer'],
};

export default paystackConfig;