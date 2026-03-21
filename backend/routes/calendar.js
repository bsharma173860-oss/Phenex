const router = require('express').Router();
const auth = require('../middleware/auth');
const supabase = require('../lib/supabase');

router.get('/', auth, async (req, res) => {
  try {
    const { month, year } = req.query;
    let query = supabase.from('appointments').select('*, contacts(name, email, phone)').eq('user_id', req.user.id).order('start_time', { ascending: true });
    if (month && year) {
      query = query.gte('start_time', new Date(year, month-1, 1).toISOString()).lte('start_time', new Date(year, month, 0, 23, 59, 59).toISOString());
    }
    const { data, error } = await query;
    if (error) throw error;
    res.json(data);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', auth, async (req, res) => {
  try {
    const { data, error } = await supabase.from('appointments').insert({ user_id: req.user.id, ...req.body }).select().single();
    if (error) throw error;
    res.json(data);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    await supabase.from('appointments').delete().eq('id', req.params.id).eq('user_id', req.user.id);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
