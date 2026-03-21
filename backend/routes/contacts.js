const router = require('express').Router();
const auth = require('../middleware/auth');
const supabase = require('../lib/supabase');
const { qualifyLead } = require('../lib/ai');

// ── GET ALL CONTACTS ──
router.get('/', auth, async (req, res) => {
  try {
    const { status, search, source, limit = 50, offset = 0 } = req.query;
    let query = supabase.from('contacts').select('*').eq('user_id', req.user.id).order('created_at', { ascending: false });

    if (status) query = query.eq('status', status);
    if (source) query = query.eq('source', source);
    if (search) query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,company.ilike.%${search}%`);

    query = query.range(offset, offset + limit - 1);
    const { data, error, count } = await query;
    if (error) throw error;
    res.json({ contacts: data, total: count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── GET SINGLE CONTACT ──
router.get('/:id', auth, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('contacts').select('*').eq('id', req.params.id).eq('user_id', req.user.id).single();
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── CREATE CONTACT ──
router.post('/', auth, async (req, res) => {
  try {
    const { name, email, phone, company, source, status, value, notes } = req.body;
    if (!name) return res.status(400).json({ error: 'Name is required' });

    // AI qualify the lead
    let aiScore = null;
    try {
      const qualification = await qualifyLead({ name, email, company, source });
      aiScore = qualification;
    } catch (e) {}

    const { data, error } = await supabase.from('contacts').insert({
      user_id: req.user.id, name, email, phone, company, source,
      status: aiScore?.status || status || 'new',
      value: value || 0, notes,
      ai_score: aiScore?.score,
      ai_next_action: aiScore?.nextAction
    }).select().single();

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── UPDATE CONTACT ──
router.put('/:id', auth, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('contacts').update({ ...req.body, updated_at: new Date() })
      .eq('id', req.params.id).eq('user_id', req.user.id).select().single();
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── DELETE CONTACT ──
router.delete('/:id', auth, async (req, res) => {
  try {
    const { error } = await supabase
      .from('contacts').delete().eq('id', req.params.id).eq('user_id', req.user.id);
    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── AI QUALIFY CONTACT ──
router.post('/:id/qualify', auth, async (req, res) => {
  try {
    const { data: contact } = await supabase.from('contacts').select('*').eq('id', req.params.id).single();
    const result = await qualifyLead(contact);
    await supabase.from('contacts').update({ status: result.status, ai_score: result.score, ai_next_action: result.nextAction }).eq('id', req.params.id);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
