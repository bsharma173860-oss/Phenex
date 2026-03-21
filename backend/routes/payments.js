const router = require('express').Router();
const auth = require('../middleware/auth');
const supabase = require('../lib/supabase');

let stripe;
try { stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); } catch(e) {}

// ── GET ALL INVOICES ──
router.get('/invoices', auth, async (req, res) => {
  try {
    const { data, error } = await supabase.from('invoices').select('*').eq('user_id', req.user.id).order('created_at', { ascending: false });
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── CREATE INVOICE ──
router.post('/invoices', auth, async (req, res) => {
  try {
    const { contactId, amount, description, dueDate, currency = 'usd', tax = 0 } = req.body;
    if (!amount || !contactId) return res.status(400).json({ error: 'Amount and contact required' });

    // Get contact
    const { data: contact } = await supabase.from('contacts').select('*').eq('id', contactId).single();

    let stripeInvoiceId = null;
    let paymentUrl = null;

    // Create Stripe payment link if configured
    if (stripe && contact?.email) {
      try {
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ['card'],
          line_items: [{ price_data: { currency, product_data: { name: description || 'Invoice' }, unit_amount: Math.round(amount * 100) }, quantity: 1 }],
          mode: 'payment',
          success_url: `${process.env.FRONTEND_URL}/payments.html?paid=true`,
          cancel_url: `${process.env.FRONTEND_URL}/payments.html`,
          customer_email: contact.email,
        });
        stripeInvoiceId = session.id;
        paymentUrl = session.url;
      } catch (stripeErr) {
        console.error('Stripe error:', stripeErr.message);
      }
    }

    // Generate invoice number
    const { count } = await supabase.from('invoices').select('*', { count: 'exact' }).eq('user_id', req.user.id);
    const invoiceNumber = `INV-${String((count || 0) + 1).padStart(4, '0')}`;

    const { data, error } = await supabase.from('invoices').insert({
      user_id: req.user.id, contact_id: contactId, amount,
      description, due_date: dueDate, currency, tax,
      invoice_number: invoiceNumber,
      stripe_id: stripeInvoiceId,
      payment_url: paymentUrl,
      status: 'pending'
    }).select().single();

    if (error) throw error;
    res.json({ ...data, paymentUrl });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── MARK INVOICE PAID ──
router.put('/invoices/:id/paid', auth, async (req, res) => {
  try {
    const { data, error } = await supabase.from('invoices').update({ status: 'paid', paid_at: new Date() }).eq('id', req.params.id).eq('user_id', req.user.id).select().single();
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── REVENUE STATS ──
router.get('/stats', auth, async (req, res) => {
  try {
    const { data: invoices } = await supabase.from('invoices').select('amount, status, created_at').eq('user_id', req.user.id);
    const paid = invoices?.filter(i => i.status === 'paid').reduce((s, i) => s + i.amount, 0) || 0;
    const pending = invoices?.filter(i => i.status === 'pending').reduce((s, i) => s + i.amount, 0) || 0;
    const overdue = invoices?.filter(i => i.status === 'overdue').reduce((s, i) => s + i.amount, 0) || 0;
    res.json({ paid, pending, overdue, total: paid + pending + overdue });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
