const router = require('express').Router();
const auth = require('../middleware/auth');
const supabase = require('../lib/supabase');

router.get('/', auth, async (req, res) => {
  try {
    const { data, error } = await supabase.from('workflows').select('*').eq('user_id', req.user.id).order('created_at', { ascending: false });
    if (error) throw error;
    res.json(data);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', auth, async (req, res) => {
  try {
    const { data, error } = await supabase.from('workflows').insert({ user_id: req.user.id, ...req.body }).select().single();
    if (error) throw error;
    res.json(data);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const { data, error } = await supabase.from('workflows').update(req.body).eq('id', req.params.id).eq('user_id', req.user.id).select().single();
    if (error) throw error;
    res.json(data);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
