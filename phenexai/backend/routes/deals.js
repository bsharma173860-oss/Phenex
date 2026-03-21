const router = require('express').Router();
const auth = require('../middleware/auth');
const supabase = require('../lib/supabase');

router.get('/', auth, async (req, res) => {
  try {
    const { data, error } = await supabase.from('deals').select('*, contacts(name, company)').eq('user_id', req.user.id).order('created_at', { ascending: false });
    if (error) throw error;
    res.json(data);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', auth, async (req, res) => {
  try {
    const { data, error } = await supabase.from('deals').insert({ user_id: req.user.id, ...req.body }).select().single();
    if (error) throw error;
    res.json(data);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const { data, error } = await supabase.from('deals').update({ ...req.body, updated_at: new Date() }).eq('id', req.params.id).eq('user_id', req.user.id).select().single();
    if (error) throw error;
    res.json(data);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    await supabase.from('deals').delete().eq('id', req.params.id).eq('user_id', req.user.id);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
