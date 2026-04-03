/**
 * paymentService.js
 *
 * Paystack integration has been removed.
 * Payment is now handled manually via bank transfer to Opay.
 *
 * Account:  Muheez Tolani Issa
 * Number:   7067027109
 * Bank:     Opay
 */

/**
 * Format a naira amount for display (e.g. 2500 → ₦2,500)
 * Still used across Cart, Checkout, and OrderSuccess.
 */
export const formatAmount = (amount) => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export default { formatAmount };
