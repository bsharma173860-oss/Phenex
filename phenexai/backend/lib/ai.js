const Anthropic = require('@anthropic-ai/sdk');

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// ── MAIN AI AGENT ──
async function runAgent(userMessage, context = {}) {
  const { businessName, contactName, history = [] } = context;

  const systemPrompt = `You are PhenexAi, an intelligent AI business assistant for ${businessName || 'this business'}.

You have access to and can perform these actions:
- 📞 Answer and handle phone calls
- 📅 Book and reschedule appointments  
- 📧 Send personalized emails
- 💬 Reply to SMS and WhatsApp messages
- 👥 Update CRM contacts and deal stages
- 💳 Send invoices and chase payments
- 📊 Generate business reports
- 🔥 Qualify and follow up with leads

Always be professional, friendly, and concise. 
When taking actions, confirm what you did clearly.
If asked about ${contactName || 'a contact'}, use their name personally.
Format responses cleanly — use emojis sparingly for clarity.`;

  const messages = [
    ...history,
    { role: 'user', content: userMessage }
  ];

  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    system: systemPrompt,
    messages
  });

  return response.content[0].text;
}

// ── SCRAPE + AUTO-FILL BUSINESS INFO ──
async function scrapeAndBuildAccount(businessName, website) {
  const prompt = `You are an AI that auto-creates CRM sub-accounts for businesses.

Given this business:
- Name: ${businessName}
- Website: ${website || 'not provided'}

Generate a complete account setup in JSON format with:
{
  "businessName": "${businessName}",
  "industry": "detected industry",
  "description": "2 sentence business description",
  "agentName": "AI agent name for this business",
  "agentPersonality": "professional tone description",
  "suggestedPipeline": ["Stage 1", "Stage 2", "Stage 3", "Stage 4", "Stage 5"],
  "suggestedTags": ["tag1", "tag2", "tag3"],
  "welcomeEmail": {
    "subject": "email subject line",
    "body": "email body text"
  },
  "followUpSMS": "SMS follow up message",
  "subdomain": "lowercase-slug"
}

Return ONLY valid JSON, no explanation.`;

  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    messages: [{ role: 'user', content: prompt }]
  });

  try {
    const text = response.content[0].text;
    const clean = text.replace(/```json|```/g, '').trim();
    return JSON.parse(clean);
  } catch (e) {
    return {
      businessName,
      industry: 'General Business',
      description: `${businessName} is a growing business looking to automate their operations.`,
      agentName: `${businessName} AI Assistant`,
      agentPersonality: 'Professional and friendly',
      suggestedPipeline: ['Lead', 'Qualified', 'Proposal', 'Negotiation', 'Won'],
      suggestedTags: ['new-lead', 'follow-up', 'vip'],
      welcomeEmail: {
        subject: `Welcome to ${businessName}!`,
        body: `Hi there,\n\nThank you for reaching out to ${businessName}. We'll be in touch shortly!\n\nBest regards,\n${businessName} Team`
      },
      followUpSMS: `Hi! Thanks for your interest in ${businessName}. We'll reach out within 24 hours. Reply STOP to unsubscribe.`,
      subdomain: businessName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    };
  }
}

// ── WRITE EMAIL WITH AI ──
async function writeEmail(context) {
  const { contactName, purpose, businessName, tone = 'professional' } = context;

  const prompt = `Write a ${tone} email for ${businessName || 'our business'}.
Purpose: ${purpose}
To: ${contactName || 'the contact'}

Write subject line and body. Format as JSON:
{"subject": "...", "body": "..."}
Return ONLY JSON.`;

  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 512,
    messages: [{ role: 'user', content: prompt }]
  });

  try {
    const text = response.content[0].text;
    const clean = text.replace(/```json|```/g, '').trim();
    return JSON.parse(clean);
  } catch (e) {
    return {
      subject: `Following up — ${purpose}`,
      body: `Hi ${contactName || 'there'},\n\nI wanted to follow up regarding ${purpose}.\n\nPlease let me know if you have any questions.\n\nBest regards`
    };
  }
}

// ── QUALIFY LEAD WITH AI ──
async function qualifyLead(leadData) {
  const prompt = `Based on this lead data, qualify them and suggest next steps:
${JSON.stringify(leadData, null, 2)}

Return JSON:
{
  "score": 1-100,
  "status": "hot|warm|cold",
  "reasoning": "why this score",
  "nextAction": "what to do next",
  "suggestedMessage": "personalized outreach message"
}
Return ONLY JSON.`;

  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 512,
    messages: [{ role: 'user', content: prompt }]
  });

  try {
    const text = response.content[0].text;
    const clean = text.replace(/```json|```/g, '').trim();
    return JSON.parse(clean);
  } catch (e) {
    return { score: 50, status: 'warm', reasoning: 'Standard lead', nextAction: 'Follow up within 24 hours', suggestedMessage: 'Hi! Thanks for your interest. Would you be open to a quick call?' };
  }
}

module.exports = { runAgent, scrapeAndBuildAccount, writeEmail, qualifyLead };
