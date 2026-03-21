const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const supabase = require('../lib/supabase');

// ── REGISTER ──
router.post('/register', async (req, res) => {
  try {
    const { email, password, name, businessName } = req.body;
    if (!email || !password || !name) return res.status(400).json({ error: 'Missing fields' });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user in Supabase
    const { data: user, error } = await supabase
      .from('users')
      .insert({ email, password: hashedPassword, name, business_name: businessName })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') return res.status(400).json({ error: 'Email already exists' });
      throw error;
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ token, user: { id: user.id, email: user.email, name: user.name, businessName } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── LOGIN ──
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Missing fields' });

    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) return res.status(401).json({ error: 'Invalid credentials' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── GET CURRENT USER ──
router.get('/me', require('../middleware/auth'), async (req, res) => {
  try {
    const { data: user } = await supabase
      .from('users')
      .select('id, email, name, business_name, plan, created_at')
      .eq('id', req.user.id)
      .single();
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
