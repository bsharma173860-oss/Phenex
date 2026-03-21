require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3000;

// ── SECURITY MIDDLEWARE ──
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: process.env.FRONTEND_URL || '*', credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ── RATE LIMITING ──
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use('/api/', limiter);

// ── SERVE FRONTEND ──
app.use(express.static(path.join(__dirname, '../frontend')));
app.use('/css', express.static(path.join(__dirname, '../frontend/css')));
app.use('/js', express.static(path.join(__dirname, '../frontend/js')));

// ── API ROUTES ──
app.use('/api/auth',          require('./routes/auth'));
app.use('/api/contacts',      require('./routes/contacts'));
app.use('/api/deals',         require('./routes/deals'));
app.use('/api/conversations', require('./routes/conversations'));
app.use('/api/calendar',      require('./routes/calendar'));
app.use('/api/payments',      require('./routes/payments'));
app.use('/api/ai',            require('./routes/ai'));
app.use('/api/campaigns',     require('./routes/campaigns'));
app.use('/api/workflows',     require('./routes/workflows'));
app.use('/api/analytics',     require('./routes/analytics'));
app.use('/api/onboarding',    require('./routes/onboarding'));
app.use('/api/webhooks',      require('./routes/webhooks'));

// ── HEALTH CHECK ──
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', version: '1.0.0', platform: 'PhenexAi' });
});

// ── CATCH ALL → SERVE FRONTEND ──
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// ── ERROR HANDLER ──
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.message);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`
  ██████╗ ██╗  ██╗███████╗███╗   ██╗███████╗██╗  ██╗ █████╗ ██╗
  ██╔══██╗██║  ██║██╔════╝████╗  ██║██╔════╝╚██╗██╔╝██╔══██╗██║
  ██████╔╝███████║█████╗  ██╔██╗ ██║█████╗   ╚███╔╝ ███████║██║
  ██╔═══╝ ██╔══██║██╔══╝  ██║╚██╗██║██╔══╝   ██╔██╗ ██╔══██║██║
  ██║     ██║  ██║███████╗██║ ╚████║███████╗██╔╝ ██╗██║  ██║██║
  ╚═╝     ╚═╝  ╚═╝╚══════╝╚═╝  ╚═══╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝
  
  🚀 Server running on http://localhost:${PORT}
  🤖 AI Agent: ${process.env.ANTHROPIC_API_KEY ? '✅ Connected' : '⚠️  Add ANTHROPIC_API_KEY'}
  🗄️  Database: ${process.env.SUPABASE_URL ? '✅ Connected' : '⚠️  Add SUPABASE_URL'}
  💳 Stripe:   ${process.env.STRIPE_SECRET_KEY ? '✅ Connected' : '⚠️  Add STRIPE_SECRET_KEY'}
  📱 Twilio:   ${process.env.TWILIO_ACCOUNT_SID ? '✅ Connected' : '⚠️  Add TWILIO_ACCOUNT_SID'}
  `);
});

module.exports = app;
