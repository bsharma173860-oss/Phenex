const router = require('express').Router();
const auth = require('../middleware/auth');
const supabase = require('../lib/supabase');

router.get('/overview', auth, async (req, res) => {
  try {
    const uid = req.user.id;
    const [contacts, deals, invoices, appointments] = await Promise.all([
      supabase.from('contacts').select('status').eq('user_id', uid),
      supabase.from('deals').select('value, stage').eq('user_id', uid),
      supabase.from('invoices').select('amount, status').eq('user_id', uid),
      supabase.from('appointments').select('id').eq('user_id', uid)
    ]);
    const totalRevenue = invoices.data?.filter(i => i.status === 'paid').reduce((s, i) => s + i.amount, 0) || 0;
    const pipelineValue = deals.data?.reduce((s, d) => s + (d.value || 0), 0) || 0;
    const wonDeals = deals.data?.filter(d => d.stage === 'Won').length || 0;
    const closeRate = deals.data?.length ? Math.round((wonDeals / deals.data.length) * 100) : 0;
    res.json({ totalContacts: contacts.data?.length || 0, hotLeads: contacts.data?.filter(c => c.status === 'hot').length || 0, totalRevenue, pipelineValue, closeRate, totalAppointments: appointments.data?.length || 0 });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
