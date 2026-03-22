// ── PHENEXAI SHARED JS — LIGHT THEME ──

const NAV_ITEMS = [
  { group: 'Agency', items: [
    { icon: '🏢', label: 'Agency', href: 'agency.html', badge: null },
    { icon: '🧠', label: 'AI Command', href: 'ai-command.html', badge: 'Live', badgeClass: 'green' },
  ]},
  { group: 'Workspace', items: [
    { icon: '▦', label: 'Dashboard', href: 'index.html', badge: null },
    { icon: '👥', label: 'CRM', href: 'crm.html', badge: null },
    { icon: '💬', label: 'Inbox', href: 'conversations.html', badge: '7', badgeClass: 'red' },
    { icon: '📅', label: 'Calendar', href: 'calendar.html', badge: null },
    { icon: '📊', label: 'Pipeline', href: 'pipeline.html', badge: null },
  ]},
  { group: 'Automation', items: [
    { icon: '🤖', label: 'AI Agent', href: 'ai-agent.html', badge: 'Live', badgeClass: 'green' },
    { icon: '⚡', label: 'Workflows', href: 'workflows.html', badge: null },
    { icon: '📣', label: 'Campaigns', href: 'campaigns.html', badge: null },
  ]},
  { group: 'Business', items: [
    { icon: '💳', label: 'Payments', href: 'payments.html', badge: null },
    { icon: '📈', label: 'Analytics', href: 'analytics.html', badge: null },
    { icon: '🔗', label: 'Integrations', href: 'integrations.html', badge: null },
    { icon: '🎨', label: 'White Label', href: 'white-label.html', badge: null },
    { icon: '⚙️', label: 'Settings', href: 'settings.html', badge: null },
  ]},
];

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
      <div class="sidebar-logo">
        <img src="/logo.png" alt="PhenexAi" style="height:26px;object-fit:contain;" onerror="this.style.display='none'">
        <span class="logo-text">phenexAi</span>
      </div>
      <nav class="sidebar-nav">${nav}</nav>
      <div class="sidebar-footer">
        <div class="user-card">
          <div class="avatar avatar-sm">JD</div>
          <div style="flex:1;min-width:0">
            <div style="font-size:12.5px;font-weight:600;color:var(--ink)">John Doe</div>
            <div style="font-size:11px;color:var(--ink4)">Admin · Pro Plan</div>
          </div>
          <span style="color:var(--ink4);font-size:14px">⋯</span>
        </div>
        <div class="midnight-tag">Powered by <span>Midnight Glimmers</span></div>
      </div>
    </aside>`;
}

function buildTopbar(title, subtitle) {
  return `
    <div class="topbar">
      <div class="topbar-left">
        <div class="page-title">${title}</div>
        ${subtitle ? `<div class="page-sub">${subtitle}</div>` : ''}
      </div>
      <div class="topbar-right">
        <div class="search-box">
          <span style="color:var(--ink4);font-size:13px">🔍</span>
          <input type="text" placeholder="Search…">
        </div>
        <div class="icon-btn">🔔<div class="notif-dot"></div></div>
        <div class="avatar avatar-md avatar-sq" style="cursor:pointer">JD</div>
      </div>
    </div>`;
}

function showToast(msg, type = 'success') {
  const icons = { success:'✅', error:'❌', info:'ℹ️', warning:'⚠️' };
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
  setTimeout(() => toast.remove(), 3200);
}

function openModal(id) { document.getElementById(id)?.classList.add('open'); }
function closeModal(id) { document.getElementById(id)?.classList.remove('open'); }

const SAMPLE_CONTACTS = [
  { id:1, name:'Sarah Mitchell', email:'sarah@techcorp.com', phone:'+1 555 0101', source:'LinkedIn', status:'hot', value:12000, company:'TechCorp Inc.', lastContact:'2h ago', avatar:'SM', color:'#4F46E5' },
  { id:2, name:'Ahmed Khan', email:'ahmed@novaco.com', phone:'+1 555 0102', source:'Website', status:'warm', value:8500, company:'Nova Agency', lastContact:'1d ago', avatar:'AK', color:'#F59E0B' },
  { id:3, name:'Lisa Rodriguez', email:'lisa@bloom.io', phone:'+1 555 0103', source:'Referral', status:'closed', value:21000, company:'Bloom Studio', lastContact:'3d ago', avatar:'LR', color:'#10B981' },
  { id:4, name:'Marcus Patel', email:'marcus@fintechx.com', phone:'+1 555 0104', source:'Facebook', status:'cold', value:5200, company:'FintechX', lastContact:'5d ago', avatar:'MP', color:'#6366F1' },
  { id:5, name:'Julia Thompson', email:'julia@apex.co', phone:'+1 555 0105', source:'Instagram', status:'hot', value:15800, company:'Apex Group', lastContact:'30m ago', avatar:'JT', color:'#EF4444' },
  { id:6, name:'David Chen', email:'david@solarwave.io', phone:'+1 555 0106', source:'Cold Email', status:'warm', value:9400, company:'SolarWave', lastContact:'2d ago', avatar:'DC', color:'#8B5CF6' },
  { id:7, name:'Emma Wilson', email:'emma@creatives.co', phone:'+1 555 0107', source:'Referral', status:'new', value:6700, company:'Creatives Co.', lastContact:'4h ago', avatar:'EW', color:'#06B6D4' },
  { id:8, name:'Ryan Park', email:'ryan@buildfast.dev', phone:'+1 555 0108', source:'LinkedIn', status:'hot', value:18200, company:'BuildFast Dev', lastContact:'1h ago', avatar:'RP', color:'#EC4899' },
];

const SAMPLE_MESSAGES = [
  { id:1, contact:'Sarah Mitchell', avatar:'SM', color:'#4F46E5', channel:'sms', preview:'Hey, just checking in on the proposal...', time:'2m', unread:2, status:'online' },
  { id:2, contact:'Ahmed Khan', avatar:'AK', color:'#F59E0B', channel:'email', preview:'Thank you for sending over the documents...', time:'15m', unread:1, status:'away' },
  { id:3, contact:'Julia Thompson', avatar:'JT', color:'#EF4444', channel:'whatsapp', preview:'Can we reschedule for Thursday?', time:'1h', unread:0, status:'online' },
  { id:4, contact:'Marcus Patel', avatar:'MP', color:'#6366F1', channel:'email', preview:'I reviewed the pricing...', time:'3h', unread:0, status:'offline' },
  { id:5, contact:'Ryan Park', avatar:'RP', color:'#EC4899', channel:'sms', preview:'Sounds good! See you at 2pm.', time:'5h', unread:0, status:'online' },
  { id:6, contact:'Emma Wilson', avatar:'EW', color:'#06B6D4', channel:'whatsapp', preview:'Do you offer monthly plans?', time:'1d', unread:3, status:'away' },
];
