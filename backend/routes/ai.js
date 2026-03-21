const router = require('express').Router();
const auth = require('../middleware/auth');
const { runAgent, scrapeAndBuildAccount, writeEmail, qualifyLead } = require('../lib/ai');
const supabase = require('../lib/supabase');

// ── CHAT WITH AI AGENT ──
router.post('/chat', auth, async (req, res) => {
  try {
    const { message, history = [], contactId } = req.body;

    // Get user's business info
    const { data: user } = await supabase.from('users').select('name, business_name').eq('id', req.user.id).single();

    // Get contact info if provided
    let contactName = null;
    if (contactId) {
      const { data: contact } = await supabase.from('contacts').select('name').eq('id', contactId).single();
      contactName = contact?.name;
    }

    const reply = await runAgent(message, {
      businessName: user?.business_name,
      contactName,
      history
    });

    // Save conversation to DB
    await supabase.from('ai_conversations').insert({
      user_id: req.user.id,
      user_message: message,
      ai_reply: reply,
      contact_id: contactId || null
    });

    res.json({ reply });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── WRITE EMAIL WITH AI ──
router.post('/write-email', auth, async (req, res) => {
  try {
    const { contactName, purpose, tone } = req.body;
    const { data: user } = await supabase.from('users').select('business_name').eq('id', req.user.id).single();
    const email = await writeEmail({ contactName, purpose, tone, businessName: user?.business_name });
    res.json(email);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── AUTO-BUILD ACCOUNT FROM WEBSITE ──
router.post('/build-account', auth, async (req, res) => {
  try {
    const { businessName, website } = req.body;
    if (!businessName) return res.status(400).json({ error: 'Business name required' });

    const accountData = await scrapeAndBuildAccount(businessName, website);
    res.json(accountData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── QUALIFY LEAD ──
router.post('/qualify', auth, async (req, res) => {
  try {
    const result = await qualifyLead(req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── GET AI CONVERSATION HISTORY ──
router.get('/history', auth, async (req, res) => {
  try {
    const { data } = await supabase
      .from('ai_conversations')
      .select('*')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false })
      .limit(50);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
