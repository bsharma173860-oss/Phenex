const router = require('express').Router();
const supabase = require('../lib/supabase');

router.post('/stripe', require('express').raw({ type: 'application/json' }), async (req, res) => {
  try {
    if (!process.env.STRIPE_SECRET_KEY) return res.json({ received: true });
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    const event = stripe.webhooks.constructEvent(req.body, req.headers['stripe-signature'], process.env.STRIPE_WEBHOOK_SECRET);
    if (event.type === 'checkout.session.completed') {
      await supabase.from('invoices').update({ status: 'paid', paid_at: new Date() }).eq('stripe_id', event.data.object.id);
    }
    res.json({ received: true });
  } catch (err) { res.status(400).send(`Webhook Error: ${err.message}`); }
});

module.exports = router;
