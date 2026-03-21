// ── PHENEXAI SHARED JS ──

// Logo — real PNG with CSS filter to always be visible on dark bg
const PHENEX_LOGO = `
<img src="/logo.png" alt="PhenexAi" class="logo-svg" style="width:160px;filter:brightness(0) invert(1) sepia(1) saturate(2) hue-rotate(200deg) brightness(1.4);display:block;">
<!-- hidden svg kept for reference -->
<svg style="display:none" viewBox="0 0 280 70" fill="none" xmlns="http://www.w3.org/2000/svg" class="logo-svg">
  <defs>
    <linearGradient id="wg" x1="140" y1="0" x2="140" y2="26" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#9ba8ff"/>
      <stop offset="100%" stop-color="#4a55e0"/>
    </linearGradient>
    <linearGradient id="tg" x1="0" y1="0" x2="200" y2="0" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#c8ceff"/>
      <stop offset="70%" stop-color="#eef0ff"/>
    </linearGradient>
    <linearGradient id="ag" x1="0" y1="0" x2="80" y2="0" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#4a55e0"/>
      <stop offset="100%" stop-color="#8b97ff"/>
    </linearGradient>
    <filter id="wglow"><feGaussianBlur stdDeviation="1.2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  </defs>
  <!-- Wings -->
  <g filter="url(#wglow)">
    <path d="M140 4 L112 17 L122 15 L117 23 L130 14 L134 21 L138 8 Z" fill="url(#wg)"/>
    <path d="M140 4 L168 17 L158 15 L163 23 L150 14 L146 21 L142 8 Z" fill="url(#wg)"/>
    <path d="M138 8 L140 2 L142 8 L140 6 Z" fill="#b8c2ff"/>
  </g>
  <!-- phenex text -->
  <text x="4" y="62" font-family="'Arial Black',Arial,sans-serif" font-weight="900" font-size="38" fill="url(#tg)" letter-spacing="-0.5">phenex</text>
  <!-- A -->
  <text x="196" y="62" font-family="'Arial Black',Arial,sans-serif" font-weight="900" font-size="38" fill="url(#ag)">A</text>
  <!-- Robot i -->
  <circle cx="257" cy="36" r="9" fill="none" stroke="url(#ag)" stroke-width="2.2"/>
  <circle cx="257" cy="36" r="3.5" fill="none" stroke="url(#ag)" stroke-width="1.8"/>
  <line x1="266" y1="30" x2="274" y2="23" stroke="url(#ag)" stroke-width="2.2" stroke-linecap="round"/>
  <circle cx="275.5" cy="21.5" r="3.5" fill="url(#ag)"/>
  <line x1="257" y1="46" x2="257" y2="63" stroke="url(#ag)" stroke-width="6.5" stroke-linecap="round"/>
</svg>`;

// Navigation items
const NAV_ITEMS = [
  { group: 'Agency', items: [
    { icon: '🏢', label: 'Agency Dashboard', href: 'agency.html', badge: null },
    { icon: '🧠', label: 'AI Command Center', href: 'ai-command.html', badge: 'Live', badgeClass: 'green' },
  ]},
  { group: 'Sub-Account', items: [
    { icon: '▦', label: 'Dashboard', href: 'index.html', badge: null },
    { icon: '👥', label: 'CRM', href: 'crm.html', badge: null },
    { icon: '💬', label: 'Conversations', href: 'conversations.html', badge: '7', badgeClass: 'red' },
    { icon: '📅', label: 'Calendar', href: 'calendar.html', badge: null },
    { icon: '📊', label: 'Pipeline', href: 'pipeline.html', badge: null },
  ]},
  { group: 'AI Tools', items: [
    { icon: '🤖', label: 'AI Agent', href: 'ai-agent.html', badge: 'Live', badgeClass: 'green' },
    { icon: '⚡', label: 'Workflows', href: 'workflows.html', badge: null },
    { icon: '📣', label: 'Campaigns', href: 'campaigns.html', badge: null },
  ]},
  { group: 'Business', items: [
    { icon: '💳', label: 'Payments', href: 'payments.html', badge: null },
    { icon: '📈', label: 'Analytics', href: 'analytics.html', badge: null },
    { icon: '🎨', label: 'White Label', href: 'white-label.html', badge: null },
    { icon: '⚙️', label: 'Settings', href: 'settings.html', badge: null },
  ]},
];

// Build sidebar
function buildSidebar(activePage) {
  const nav = NAV_ITEMS.map(group => `
    <span class="nav-group-label">${group.group}</span>
    ${group.items.map(item => `
      <a class="nav-item ${item.href === activePage ? 'active' : ''}" href="${item.href}">
        <span class="nav-icon">${item.icon}</span>
        ${item.label}
        ${item.badge ? `<span class="nav-badge ${item.badgeClass||''}">${item.badge}</span>` : ''}
      </a>
    `).join('')}
  `).join('');

  return `
    <aside class="sidebar">
      <div class="sidebar-logo">${PHENEX_LOGO}</div>
      <nav class="sidebar-nav">${nav}</nav>
      <div class="sidebar-footer">
        <div class="user-card">
          <div class="avatar avatar-sm">JD</div>
          <div style="flex:1;min-width:0">
            <div style="font-size:12.5px;font-weight:600;color:var(--text)">John Doe</div>
            <div style="font-size:11px;color:var(--text-muted)">Admin · Pro Plan</div>
          </div>
          <span style="color:var(--text-muted);font-size:14px">⋯</span>
        </div>
      </div>
    </aside>`;
}

// Build topbar
function buildTopbar(title, subtitle) {
  return `
    <div class="topbar">
      <div class="topbar-left">
        <div class="page-title">${title}</div>
        ${subtitle ? `<div class="page-sub">${subtitle}</div>` : ''}
      </div>
      <div class="topbar-right">
        <div class="search-box">
          <span style="color:var(--text-muted);font-size:14px">🔍</span>
          <input type="text" placeholder="Search anything…">
        </div>
        <div class="icon-btn">🔔<div class="notif-dot"></div></div>
        <div class="icon-btn">💬</div>
        <div class="avatar avatar-md avatar-sq" style="cursor:pointer;border-radius:10px">JD</div>
      </div>
    </div>`;
}

// Toast system
function showToast(msg, type = 'success') {
  const icons = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span class="toast-icon">${icons[type]}</span><span class="toast-text">${msg}</span>`;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3500);
}

// Modal helper
function openModal(id) { document.getElementById(id)?.classList.add('open'); }
function closeModal(id) { document.getElementById(id)?.classList.remove('open'); }

// Sample data
const SAMPLE_CONTACTS = [
  { id:1, name:'Sarah Mitchell', email:'sarah@techcorp.com', phone:'+1 555 0101', source:'LinkedIn', status:'hot', value:12000, company:'TechCorp Inc.', lastContact:'2h ago', avatar:'SM', color:'#4a55e0' },
  { id:2, name:'Ahmed Khan', email:'ahmed@novaco.com', phone:'+1 555 0102', source:'Website', status:'warm', value:8500, company:'Nova Agency', lastContact:'1d ago', avatar:'AK', color:'#f5a623' },
  { id:3, name:'Lisa Rodriguez', email:'lisa@bloom.io', phone:'+1 555 0103', source:'Referral', status:'closed', value:21000, company:'Bloom Studio', lastContact:'3d ago', avatar:'LR', color:'#22d3a0' },
  { id:4, name:'Marcus Patel', email:'marcus@fintechx.com', phone:'+1 555 0104', source:'Facebook', status:'cold', value:5200, company:'FintechX', lastContact:'5d ago', avatar:'MP', color:'#6272ff' },
  { id:5, name:'Julia Thompson', email:'julia@apex.co', phone:'+1 555 0105', source:'Instagram', status:'hot', value:15800, company:'Apex Group', lastContact:'30m ago', avatar:'JT', color:'#ff5b7f' },
  { id:6, name:'David Chen', email:'david@solarwave.io', phone:'+1 555 0106', source:'Cold Email', status:'warm', value:9400, company:'SolarWave', lastContact:'2d ago', avatar:'DC', color:'#9b6dff' },
  { id:7, name:'Emma Wilson', email:'emma@creatives.co', phone:'+1 555 0107', source:'Referral', status:'new', value:6700, company:'Creatives Co.', lastContact:'4h ago', avatar:'EW', color:'#00d4aa' },
  { id:8, name:'Ryan Park', email:'ryan@buildfast.dev', phone:'+1 555 0108', source:'LinkedIn', status:'hot', value:18200, company:'BuildFast Dev', lastContact:'1h ago', avatar:'RP', color:'#ff6b9d' },
];

const SAMPLE_MESSAGES = [
  { id:1, contact:'Sarah Mitchell', avatar:'SM', color:'#4a55e0', channel:'sms', preview:'Hey, just checking in on the proposal...', time:'2m', unread:2, status:'online' },
  { id:2, contact:'Ahmed Khan', avatar:'AK', color:'#f5a623', channel:'email', preview:'Thank you for sending over the documents...', time:'15m', unread:1, status:'away' },
  { id:3, contact:'Julia Thompson', avatar:'JT', color:'#ff5b7f', channel:'whatsapp', preview:'Can we reschedule for Thursday?', time:'1h', unread:0, status:'online' },
  { id:4, contact:'Marcus Patel', avatar:'MP', color:'#6272ff', channel:'email', preview:'I reviewed the pricing and I think...', time:'3h', unread:0, status:'offline' },
  { id:5, contact:'Ryan Park', avatar:'RP', color:'#ff6b9d', channel:'sms', preview:'Sounds good! See you at 2pm.', time:'5h', unread:0, status:'online' },
  { id:6, contact:'Emma Wilson', avatar:'EW', color:'#00d4aa', channel:'whatsapp', preview:'Do you offer monthly plans?', time:'1d', unread:3, status:'away' },
];
