# 🚀 PhenexAi — AI-Powered CRM Platform

> GoHighLevel alternative with real AI that handles calls, books appointments, sends emails, and closes deals 24/7.

---

## 📁 Project Structure

```
phenexai/
├── frontend/          ← All HTML pages + CSS + JS
│   ├── index.html          Dashboard
│   ├── login.html          Auth page
│   ├── onboarding.html     Sub-account creator
│   ├── crm.html            CRM contacts
│   ├── conversations.html  SMS/Email/WhatsApp inbox
│   ├── calendar.html       Appointments
│   ├── pipeline.html       Kanban deals
│   ├── ai-agent.html       AI chat interface
│   ├── payments.html       Invoices & Stripe
│   ├── analytics.html      Charts & metrics
│   ├── workflows.html      Automation builder
│   ├── campaigns.html      Email/SMS blasts
│   ├── settings.html       Account settings
│   ├── css/phenex.css      Design system
│   └── js/
│       ├── phenex.js       Shared UI components
│       └── api.js          Backend API client
├── backend/
│   ├── server.js           Express server
│   ├── lib/
│   │   ├── ai.js           Claude AI agent
│   │   └── supabase.js     Database client
│   ├── middleware/
│   │   └── auth.js         JWT auth
│   └── routes/
│       ├── auth.js         Login/register
│       ├── contacts.js     CRM CRUD
│       ├── deals.js        Pipeline
│       ├── calendar.js     Appointments
│       ├── conversations.js SMS/WhatsApp
│       ├── payments.js     Stripe invoices
│       ├── ai.js           AI agent API
│       ├── campaigns.js    Broadcasts
│       ├── workflows.js    Automation
│       ├── analytics.js    Stats
│       ├── onboarding.js   Sub-accounts
│       └── webhooks.js     Stripe webhooks
├── supabase/
│   └── schema.sql          Database tables
├── .env.example            API keys template
├── vercel.json             Deploy config
└── package.json            Dependencies
```

---

## ⚡ Quick Setup (5 steps)

### 1. Install dependencies
```bash
npm install
```

### 2. Set up environment variables
```bash
cp .env.example .env
# Fill in your API keys
```

### 3. Set up Supabase database
- Go to supabase.com → your project → SQL Editor
- Copy & paste contents of `supabase/schema.sql`
- Click Run

### 4. Run locally
```bash
npm run dev
# Open http://localhost:3000
```

### 5. Deploy to Vercel
```bash
npm install -g vercel
vercel
```

---

## 🔑 API Keys You Need

| Service | Where to get | Cost |
|---------|-------------|------|
| **Anthropic** | console.anthropic.com | ~$5 to start |
| **Supabase** | supabase.com | FREE |
| **Stripe** | stripe.com | FREE (% on payments) |
| **Twilio** | twilio.com | FREE trial |
| **Vercel** | vercel.com | FREE |

---

## 🤖 AI Features

- **Auto-reply** to SMS, WhatsApp, Email
- **Book appointments** from conversations
- **Qualify leads** automatically with score
- **Write emails** with AI
- **Build sub-accounts** from just a business name
- **Chase invoices** automatically

---

## 📱 Pages

| Page | URL | Description |
|------|-----|-------------|
| Login | `/login.html` | Auth |
| Dashboard | `/index.html` | Overview |
| CRM | `/crm.html` | Contacts |
| Conversations | `/conversations.html` | Inbox |
| Calendar | `/calendar.html` | Bookings |
| Pipeline | `/pipeline.html` | Deals |
| AI Agent | `/ai-agent.html` | Chat with AI |
| Payments | `/payments.html` | Invoices |
| Analytics | `/analytics.html` | Charts |
| Workflows | `/workflows.html` | Automation |
| Campaigns | `/campaigns.html` | Broadcasts |
| Settings | `/settings.html` | Config |

---

Built with ❤️ by PhenexAi
