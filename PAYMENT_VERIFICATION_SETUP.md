# 🔒 Backend Payment Verification Setup Guide

## Overview

This guide covers setting up secure payment verification using Firebase Cloud Functions. This ensures payments are verified on the backend (with your secret Paystack key) before orders are created.

## Why This Matters

**Without verification (❌ INSECURE):**
```javascript
// Client-side callback - attacker can fake this!
const handlePaymentSuccess = (response) => {
  // response.reference could be fabricated
  await createOrder({ paymentStatus: 'paid' });
};
```

**With verification (✅ SECURE):**
```javascript
// Backend verifies with Paystack SECRET key
const verifyPayment = httpsCallable(functions, 'verifyPaystackPayment');
const result = await verifyPayment({ reference, amount });
if (result.verified) {
  // Only THEN create the order
  await createOrder({ paymentStatus: 'paid' });
}
```

---

## Setup Steps

### Step 1: Get Your Paystack Secret Key

1. Go to https://dashboard.paystack.com/settings/developer
2. Copy your **Secret Key** (starts with `sk_live_` or `sk_test_`)
3. Add it to `.env.local`:

```env
VITE_PAYSTACK_SECRET_KEY=sk_test_your_secret_key_here
```

### Step 2: Set Up Firebase Functions Environment Variables

Firebase Cloud Functions need access to your Paystack secret key:

```bash
cd functions

# Set the secret key (do this once per project)
firebase functions:config:set paystack.secret_key="sk_test_your_secret_key_here"

# Verify it was set
firebase functions:config:get
```

Or use Google Cloud Secret Manager (recommended for production):

```bash
# Create secret
echo -n "sk_test_your_secret_key_here" | gcloud secrets create paystack-secret-key --data-file=-

# Grant Cloud Functions access
gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
  --member serviceAccount:YOUR_PROJECT_ID@appspot.gserviceaccount.com \
  --role roles/secretmanager.secretAccessor
```

### Step 3: Deploy Cloud Functions

```bash
cd functions
npm install
firebase deploy --only functions
```

Expected output:
```
✔ Deploy complete!

Function URL (verifyPaystackPayment(us-central1)): 
https://us-central1-your-project.cloudfunctions.net/verifyPaystackPayment
```

### Step 4: Deploy Firestore Security Rules

```bash
firebase deploy --only firestore:rules
```

This secures your Firestore database so only Cloud Functions can create orders.

### Step 5: Test the Payment Flow

1. Start your local development server:
```bash
npm run dev
```

2. Go to Menu → Add items → Checkout
3. Pay with test card:
   - Card: 4111111111111111
   - Expiry: 12/25
   - CVV: 123

4. Check browser console for logs:
```
🔒 Payment callback received, verifying on backend...
✅ Payment verified by backend
💾 Saving verified order to Firebase...
✅ Order saved
```

---

## Security Features Implemented

### 1. **Backend Verification**
- Payment verified using Paystack SECRET key (never exposed to client)
- Amount verified matches expected amount
- Payment status verified as "success"

### 2. **Duplicate Prevention**
- System checks if payment reference was already used
- Prevents replay attacks

### 3. **Audit Trail**
- Stores verification data with order
- Card last 4 digits, authorization code saved
- Timestamps for all operations

### 4. **Firestore Security Rules**
- Only Cloud Functions can create orders
- Orders include payment verification proof
- Menu is read-only
- Default deny policy on all collections

### 5. **Error Handling**
- Detailed error messages in server logs
- Generic messages to clients (don't leak internal details)
- Failed verifications don't create orders

---

## File Structure

```
functions/
├── index.js              ← Cloud Function for payment verification
├── package.json
└── .env.local           ← (Not in repo) Contains PAYSTACK_SECRET_KEY

src/
├── pages/
│   └── Checkout.jsx     ← Updated to call Cloud Function
├── services/
│   └── paymentService.js → Client-side payment initialization
└── config/
    └── firebase.js

firestore.rules          ← Security rules (deploy to Firestore)
.env.example            ← Template for environment variables
.env.local              ← (Not in repo) Your actual keys
```

---

## Verification Process Flow

```
User clicks "Pay" on Checkout
         ↓
Paystack opens payment modal
         ↓
User enters card details & pays
         ↓
Paystack calls onSuccess callback
         ↓
Cloud Function: verifyPaystackPayment() called
         ↓
Cloud Function calls Paystack API with SECRET key
         ↓
Verification checks:
  ✓ Payment status = "success"
  ✓ Amount matches (prevents undercharging scam)
  ✓ Reference not used before (prevents replay attack)
         ↓
If all checks pass: Client creates order
If any check fails: Order NOT created, user sees error
         ↓
Order saved to Firestore with verification proof
         ↓
User sees success page with order number
```

---

## Monitoring & Logging

### View Cloud Function Logs

```bash
firebase functions:log
```

Or in Firebase Console:
- Go to Functions → verifyPaystackPayment
- Click "Logs" tab

### Example Log Entries

**Successful payment:**
```
info: Payment verified successfully
  reference: MP-1709312400-123456
  amount: 5000
  customer: user@example.com
```

**Failed Amount Check (fraud attempt):**
```
error: FRAUDULENT ATTEMPT: Amount mismatch
  reference: MP-1709312400-123456
  expectedAmount: 5000
  actualAmount: 2000
  difference: 3000
```

**Duplicate Payment:**
```
warn: Duplicate payment attempt
  reference: MP-1709312400-123456
```

---

## Troubleshooting

### Issue: "verifyPaystackPayment is not a function"

**Cause:** Cloud Function not deployed or name mismatch

**Fix:**
```bash
firebase deploy --only functions
# Wait for deployment to complete
```

### Issue: "PAYSTACK_SECRET_KEY not configured"

**Cause:** Secret key not set in Cloud Functions config

**Fix:**
```bash
firebase functions:config:set paystack.secret_key="sk_test_..."
firebase deploy --only functions
```

### Issue: Payment verified but order not created

**Cause:** Might be Firestore security rules or database error

**Check:**
1. Firestore Rules are deployed: `firebase deploy --only firestore:rules`
2. No Firestore permission errors in browser console
3. Check Cloud Functions logs: `firebase functions:log`

### Issue: "Service is currently unavailable"

**Cause:** Paystack API temporarily down or network error

**Fix:**
- Retry payment (user can try again)
- Check Paystack status: https://status.paystack.com

---

## Production Checklist

- [ ] `.env.local` added to `.gitignore` (prevent secret leaks)
- [ ] `.env.example` committed with template
- [ ] Paystack SECRET key set in Cloud Functions
- [ ] Cloud Functions deployed: `firebase deploy --only functions`
- [ ] Firestore Security Rules deployed: `firebase deploy --only firestore:rules`
- [ ] Test payment completed successfully
- [ ] Server logs reviewed for any errors
- [ ] Payment verification working for both test & live keys
- [ ] Monitoring set up (enable Cloud Monitoring in Firebase Console)

---

## Quick Reference: Deployed Resources

After deployment, you'll have:

```
🔧 Cloud Function: verifyPaystackPayment
   - Triggered by: httpsCallable from frontend
   - Runtime: Node.js 24
   - Memory: 256MB
   - Timeout: 60 seconds
   - Max instances: 15

🔐 Firestore Collections:
   - orders/      (server-write only)
   - menu/        (read-only)
   - settings/    (server-only)

📋 Security Rules: firestore.rules deployed
```

---

## Support & Reference

- Paystack Docs: https://paystack.com/docs/payments/accept-payments/
- Firebase Cloud Functions: https://firebase.google.com/docs/functions
- Firebase Firestore Rules: https://firebase.google.com/docs/firestore/security/get-started
