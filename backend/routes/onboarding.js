const router = require('express').Router();
const auth = require('../middleware/auth');
const supabase = require('../lib/supabase');
const { scrapeAndBuildAccount } = require('../lib/ai');

router.post('/create-account', auth, async (req, res) => {
  try {
    const { businessName, website, industry, phone, integrations } = req.body;
    const startTime = Date.now();
    const accountData = await scrapeAndBuildAccount(businessName, website);
    const { data: account, error } = await supabase.from('sub_accounts').insert({ user_id: req.user.id, business_name: businessName, website, industry, phone, ai_data: accountData, integrations: integrations || [], status: 'active' }).select().single();
    if (error) throw error;
    res.json({ account, accountData, createdIn: ((Date.now() - startTime) / 1000).toFixed(1) + 's' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
