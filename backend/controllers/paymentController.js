import stripe from '../utils/stripe.js';
import appointementModel from '../models/appointmentModel.js';

// Create Stripe checkout session
const createCheckoutSession = async (req, res) => {
  try {
    const { appointmentId, successUrl, cancelUrl } = req.body;
    const { userId } = req.user;

    // Get appointment details
    const appointment = await appointementModel.findById(appointmentId);
    if (!appointment || appointment.userId.toString() !== userId.toString()) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }

    // Create Stripe session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'inr',
            product_data: {
              name: `Appointment with Dr. ${appointment.docData.name}`,
              description: `Date: ${appointment.slotDate} | Time: ${appointment.slotTime}`,
            },
            unit_amount: appointment.amount * 100, // amount in paise
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}&appointment_id=${appointmentId}`,
      cancel_url: cancelUrl,
      metadata: {
        appointmentId: appointmentId,
        userId: userId,
      },
    });

    res.json({ success: true, sessionId: session.id });

  } catch (error) {
    console.log("Stripe session error:", error);
    res.status(500).json({ success: false, message: "Failed to create payment session" });
  }
};

// Verify payment and update appointment
const verifyPayment = async (req, res) => {
  try {
    const { sessionId, appointmentId } = req.body;
    const { userId } = req.user;

    // Verify session
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === 'paid') {
      // Update appointment payment status
      await appointementModel.findByIdAndUpdate(appointmentId, {
        payment: true,
        stripeSessionId: sessionId,
        stripePaymentId: session.payment_intent,
      });

      res.json({ success: true, message: "Payment verified successfully" });
    } else {
      res.status(400).json({ success: false, message: "Payment not completed" });
    }

  } catch (error) {
    console.log("Payment verification error:", error);
    res.status(500).json({ success: false, message: "Payment verification failed" });
  }
};

// Stripe webhook handler
const handleWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.log('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      // Update appointment payment status
      await appointementModel.findOneAndUpdate(
        { _id: session.metadata.appointmentId },
        { 
          payment: true,
          stripeSessionId: session.id,
          stripePaymentId: session.payment_intent,
        }
      );
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
};

export { createCheckoutSession, verifyPayment, handleWebhook };