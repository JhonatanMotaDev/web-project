const StoreKeys = {
  BIBLIOTECARIOS: 'biblioteca_bibliotecarios',
  LEITORES: 'biblioteca_leitores',
  LIVROS: 'biblioteca_livros',
  EMPRESTIMOS: 'biblioteca_emprestimos',
  SESSAO: 'biblioteca_sessao'
};

function getData(key, fallback = null) {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null || raw === undefined) return fallback;
    return JSON.parse(raw);
  } catch (e) {
    return fallback;
  }
}

function saveData(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (e) {
    return false;
  }
}

function generateId(records) {
  return records.reduce((max, r) => Math.max(max, Number(r.id) || 0), 0) + 1;
}

function toISODate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function todayISO() {
  return toISODate(new Date());
}

function addDays(iso, days) {
  const d = new Date(iso + 'T00:00:00');
  d.setDate(d.getDate() + days);
  return toISODate(d);
}

function formatDate(iso) {
  if (!iso) return '—';
  const parts = String(iso).split('-');
  if (parts.length !== 3) return iso;
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

function normalizeEmpAtrasados() {
  const loans = getData(StoreKeys.EMPRESTIMOS, []);
  const today = todayISO();
  let changed = false;
  loans.forEach((l) => {
    if (l.status === 'ativo' && l.dataPrevistaDevolucao < today) {
      l.status = 'atrasado';
      changed = true;
    }
  });
  if (changed) saveData(StoreKeys.EMPRESTIMOS, loans);
  return loans;
}

function escapeHtml(value) {
  const str = value == null ? '' : String(value);
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return str.replace(/[&<>"']/g, (c) => map[c]);
}

function isEmpty(value) {
  return value === undefined || value === null || String(value).trim() === '';
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim());
}

function onlyDigits(value) {
  return String(value).replace(/\D/g, '');
}

function isValidPhone(phone) {
  const digits = onlyDigits(phone);
  return digits.length >= 10 && digits.length <= 11;
}

function isIntegerOrZero(value) {
  return /^-?\d+$/.test(String(value).trim()) && Number(value) >= 0;
}

function showToast(message, type = 'success') {
  const icons = { success: '✓', error: '✕', warning: '⚠' };
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<span class="toast-icon">${icons[type] || ''}</span><span>${escapeHtml(message)}</span>`;
  container.appendChild(toast);
  setTimeout(() => toast.classList.add('toast-show'), 10);
  setTimeout(() => {
    toast.classList.remove('toast-show');
    setTimeout(() => toast.remove(), 300);
  }, 3400);
}

function confirmAction(message) {
  return window.confirm(message);
}

function openModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.add('open');
}

function closeModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.remove('open');
}

function renderNav(activePage) {
  const navEl = document.getElementById('navbar');
  if (!navEl) return;
  const pages = [
    ['dashboard', 'dashboard.html', 'Dashboard'],
    ['livros', 'livros.html', 'Livros'],
    ['usuarios', 'usuarios.html', 'Usuários'],
    ['emprestimos', 'emprestimos.html', 'Empréstimos']
  ];
  const links = pages
    .map(
      ([key, href, label]) =>
        `<a href="${href}" class="nav-link${key === activePage ? ' active' : ''}">${label}</a>`
    )
    .join('');
  navEl.innerHTML = `
    <div class="navbar-inner container">
      <div class="navbar-brand">
        <svg class="brand-icon" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
        <span>Biblioteca</span>
      </div>
      <div class="navbar-links">${links}</div>
      <div class="navbar-user">
        <span class="user-name" id="navbar-user-name"></span>
        <button type="button" class="btn btn-ghost btn-logout" onclick="logout()">Sair</button>
      </div>
    </div>`;
  const s = getData(StoreKeys.SESSAO, null);
  const nameEl = document.getElementById('navbar-user-name');
  if (nameEl && s && s.nome) nameEl.textContent = `Olá, ${s.nome}`;
}