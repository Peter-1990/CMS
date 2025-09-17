import express from 'express';
import { createCheckoutSession, verifyPayment, handleWebhook } from '../controllers/paymentController.js';
import authUser from '../middlewares/authUser.js';

const paymentRouter = express.Router();

// Webhook must be without body parser
paymentRouter.post('/webhook', express.raw({type: 'application/json'}), handleWebhook);

// Protected routes
paymentRouter.post('/create-session', authUser, createCheckoutSession);
paymentRouter.post('/verify-payment', authUser, verifyPayment);

export default paymentRouter;