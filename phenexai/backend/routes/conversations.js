const router = require('express').Router();
const auth = require('../middleware/auth');
const supabase = require('../lib/supabase');

let twilioClient;
try {
  const twilio = require('twilio');
  twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
} catch(e) {}

// ── GET ALL CONVERSATIONS ──
router.get('/', auth, async (req, res) => {
  try {
    const { channel } = req.query;
    let query = supabase.from('conversations').select(`*, contacts(name, email, phone)`).eq('user_id', req.user.id).order('last_message_at', { ascending: false });
    if (channel && channel !== 'all') query = query.eq('channel', channel);
    const { data, error } = await query;
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── GET MESSAGES IN CONVERSATION ──
router.get('/:id/messages', auth, async (req, res) => {
  try {
    const { data, error } = await supabase.from('messages').select('*').eq('conversation_id', req.params.id).order('created_at', { ascending: true });
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── SEND SMS ──
router.post('/send/sms', auth, async (req, res) => {
  try {
    const { to, body, contactId } = req.body;
    if (!to || !body) return res.status(400).json({ error: 'Missing to or body' });

    let twilioSid = null;
    if (twilioClient) {
      const msg = await twilioClient.messages.create({
        body, from: process.env.TWILIO_PHONE_NUMBER, to
      });
      twilioSid = msg.sid;
    }

    // Save to DB
    const { data } = await supabase.from('messages').insert({
      user_id: req.user.id, contact_id: contactId,
      channel: 'sms', direction: 'outbound',
      body, twilio_sid: twilioSid
    }).select().single();

    res.json({ success: true, message: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── SEND WHATSAPP ──
router.post('/send/whatsapp', auth, async (req, res) => {
  try {
    const { to, body, contactId } = req.body;
    if (!to || !body) return res.status(400).json({ error: 'Missing to or body' });

    let twilioSid = null;
    if (twilioClient) {
      const msg = await twilioClient.messages.create({
        body, from: process.env.TWILIO_WHATSAPP_NUMBER, to: `whatsapp:${to}`
      });
      twilioSid = msg.sid;
    }

    const { data } = await supabase.from('messages').insert({
      user_id: req.user.id, contact_id: contactId,
      channel: 'whatsapp', direction: 'outbound',
      body, twilio_sid: twilioSid
    }).select().single();

    res.json({ success: true, message: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── TWILIO WEBHOOK (incoming SMS) ──
router.post('/webhook/sms', async (req, res) => {
  try {
    const { From, Body, MessageSid } = req.body;

    // Find contact by phone
    const { data: contact } = await supabase.from('contacts').select('*').eq('phone', From).single();

    // Save incoming message
    await supabase.from('messages').insert({
      channel: 'sms', direction: 'inbound',
      body: Body, from: From,
      contact_id: contact?.id,
      twilio_sid: MessageSid
    });

    // AI auto-reply if enabled
    const { runAgent } = require('../lib/ai');
    const reply = await runAgent(Body, { contactName: contact?.name });

    if (twilioClient) {
      await twilioClient.messages.create({
        body: reply, from: process.env.TWILIO_PHONE_NUMBER, to: From
      });
    }

    res.set('Content-Type', 'text/xml');
    res.send('<Response></Response>');
  } catch (err) {
    res.set('Content-Type', 'text/xml');
    res.send('<Response></Response>');
  }
});

module.exports = router;
