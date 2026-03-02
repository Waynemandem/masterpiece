/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {setGlobalOptions} = require("firebase-functions");
const {onCall} = require("firebase-functions/v2/https");
const {onRequest} = require("firebase-functions/https");
const logger = require("firebase-functions/logger");
const axios = require("axios");
const admin = require("firebase-admin");

// Initialize Firebase Admin SDK
admin.initializeApp();

// For cost control, you can set the maximum number of containers
setGlobalOptions({ maxInstances: 10 });

// ============================================
// PAYMENT VERIFICATION
// ============================================

/**
 * Verify Paystack payment before creating order
 * This function MUST be called before creating orders
 * 
 * @param {Object} data - Function parameters
 * @param {string} data.reference - Paystack payment reference
 * @param {number} data.amount - Expected amount in Naira (e.g., 1500)
 * @returns {Object} Verification result { verified: boolean, data?: object, error?: string }
 */
exports.verifyPaystackPayment = onCall({
  maxInstances: 15,
  memory: "256MB",
  timeoutSeconds: 60,
}, async (request) => {
  try {
    const {reference, amount} = request.data;

    // Validate input
    if (!reference || !amount) {
      logger.warn("Missing payment parameters", {reference, amount});
      return {
        verified: false,
        error: "Missing payment reference or amount",
        code: "INVALID_INPUT",
      };
    }

    // Validate amount is a number
    if (typeof amount !== "number" || amount <= 0) {
      logger.warn("Invalid amount provided", {amount});
      return {
        verified: false,
        error: "Invalid amount",
        code: "INVALID_AMOUNT",
      };
    }

    const secretKey = process.env.PAYSTACK_SECRET_KEY;
    if (!secretKey) {
      logger.error("PAYSTACK_SECRET_KEY not configured");
      return {
        verified: false,
        error: "Payment service not configured",
        code: "SERVICE_ERROR",
      };
    }

    // Call Paystack API with SECRET key (not exposed to client!)
    const verificationResponse = await axios.get(
        `https://api.paystack.co/transaction/verify/${reference}`,
        {
          headers: {
            Authorization: `Bearer ${secretKey}`,
          },
        }
    );

    const {status, data: paystackData} = verificationResponse.data;

    if (status !== true) {
      logger.warn("Paystack verification failed", {reference, status});
      return {
        verified: false,
        error: "Payment verification failed with Paystack",
        code: "PAYSTACK_FAILED",
      };
    }

    // ============================================
    // CRITICAL SECURITY CHECKS
    // ============================================

    // 1. Check if payment was successful
    if (paystackData.status !== "success") {
      logger.warn("Payment not successful", {
        reference,
        paystackStatus: paystackData.status,
      });
      return {
        verified: false,
        error: `Payment status is ${paystackData.status}`,
        code: "PAYMENT_NOT_SUCCESS",
      };
    }

    // 2. Verify amount matches (critical!)
    // Paystack returns amount in KOBO (divide by 100 to get Naira)
    const paystackAmountInNaira = paystackData.amount / 100;

    if (Math.abs(paystackAmountInNaira - amount) > 0.01) {
      logger.error("FRAUDULENT ATTEMPT: Amount mismatch", {
        reference,
        expectedAmount: amount,
        actualAmount: paystackAmountInNaira,
        difference: amount - paystackAmountInNaira,
      });
      return {
        verified: false,
        error: "Amount mismatch detected",
        code: "AMOUNT_MISMATCH",
      };
    }

    // 3. Verify transaction hasn't been used before
    const db = admin.firestore();
    const existingOrder = await db
        .collection("orders")
        .where("payment.reference", "==", reference)
        .limit(1)
        .get();

    if (!existingOrder.empty) {
      logger.warn("Duplicate payment attempt", {reference});
      return {
        verified: false,
        error: "This payment reference has already been used",
        code: "DUPLICATE_PAYMENT",
      };
    }

    // ============================================
    // PAYMENT VERIFIED - SAFE TO CREATE ORDER
    // ============================================

    logger.info("Payment verified successfully", {
      reference,
      amount: paystackAmountInNaira,
      customer: paystackData.customer?.email,
    });

    return {
      verified: true,
      data: {
        reference: paystackData.reference,
        amount: paystackAmountInNaira,
        status: paystackData.status,
        paidAt: paystackData.paid_at,
        customer: {
          email: paystackData.customer?.email,
          id: paystackData.customer?.id,
        },
        authorization: {
          authorization_code: paystackData.authorization?.authorization_code,
          bin: paystackData.authorization?.bin,
          last4: paystackData.authorization?.last4,
          exp_month: paystackData.authorization?.exp_month,
          exp_year: paystackData.authorization?.exp_year,
          channel: paystackData.authorization?.channel,
          card_type: paystackData.authorization?.card_type,
        },
      },
    };
  } catch (error) {
    logger.error("Payment verification error", {
      message: error.message,
      code: error.code,
    });

    // Don't expose internal error details to client
    return {
      verified: false,
      error: "Unable to verify payment. Please contact support.",
      code: "VERIFICATION_ERROR",
    };
  }
});
