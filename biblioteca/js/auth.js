function session() {
  return getData(StoreKeys.SESSAO, null);
}

function requireAuth() {
  const s = getData(StoreKeys.SESSAO, null);
  if (!s || !s.bibliotecarioId) {
    window.location.href = 'login.html';
    return null;
  }
  return s;
}

function setSession(bibliotecario) {
  saveData(StoreKeys.SESSAO, {
    bibliotecarioId: bibliotecario.id,
    nome: bibliotecario.nome,
    loginAt: new Date().toISOString()
  });
}

function logout() {
  localStorage.removeItem(StoreKeys.SESSAO);
  window.location.href = 'login.html';
}

async function hashPassword(senha) {
  if (window.crypto && crypto.subtle) {
    const enc = new TextEncoder().encode(senha);
    const buf = await crypto.subtle.digest('SHA-256', enc);
    return Array.from(new Uint8Array(buf))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  }
  let seed = 2166136261;
  for (let i = 0; i < senha.length; i++) {
    seed ^= senha.charCodeAt(i);
    seed += (seed << 1) + (seed << 4) + (seed << 7) + (seed << 8) + (seed << 24);
  }
  return (seed >>> 0).toString(16);
}

async function handleRegistrar(nome, email, senha, senha2) {
  if (isEmpty(nome)) {
    showToast('Informe seu nome completo.', 'error');
    return false;
  }
  if (isEmpty(email) || !isValidEmail(email)) {
    showToast('Informe um e-mail válido.', 'error');
    return false;
  }
  if (isEmpty(senha) || senha.length < 6) {
    showToast('A senha deve ter no mínimo 6 caracteres.', 'error');
    return false;
  }
  if (senha !== senha2) {
    showToast('As senhas não conferem.', 'error');
    return false;
  }
  const accounts = getData(StoreKeys.BIBLIOTECARIOS, []);
  const emailNormalizado = email.trim().toLowerCase();
  if (accounts.some((a) => a.email.toLowerCase() === emailNormalizado)) {
    showToast('Este e-mail já está cadastrado.', 'error');
    return false;
  }
  accounts.push({
    id: generateId(accounts),
    nome: nome.trim(),
    email: emailNormalizado,
    senha: await hashPassword(senha)
  });
  saveData(StoreKeys.BIBLIOTECARIOS, accounts);
  return true;
}

async function handleLogin(email, senha) {
  if (isEmpty(email) || isEmpty(senha)) {
    showToast('Informe e-mail e senha.', 'error');
    return false;
  }
  const accounts = getData(StoreKeys.BIBLIOTECARIOS, []);
  const hash = await hashPassword(senha);
  const found = accounts.find(
    (a) => a.email.toLowerCase() === email.trim().toLowerCase() && a.senha === hash
  );
  if (!found) {
    showToast('E-mail ou senha inválidos.', 'error');
    return false;
  }
  setSession(found);
  return true;
}

function initLoginPage() {
  const tabLogin = document.getElementById('tab-login');
  const tabReg = document.getElementById('tab-register');
  const formLogin = document.getElementById('form-login');
  const formReg = document.getElementById('form-register');

  function switchTab(which) {
    const isLogin = which === 'login';
    tabLogin.classList.toggle('active', isLogin);
    tabReg.classList.toggle('active', !isLogin);
    formLogin.classList.toggle('show', isLogin);
    formReg.classList.toggle('show', !isLogin);
  }

  if (session()) {
    window.location.href = 'dashboard.html';
    return;
  }

  if (tabLogin) {
    tabLogin.addEventListener('click', () => switchTab('login'));
    tabReg.addEventListener('click', () => switchTab('register'));
  }

  if (formLogin) {
    formLogin.addEventListener('submit', async (e) => {
      e.preventDefault();
      const ok = await handleLogin(
        document.getElementById('login-email').value,
        document.getElementById('login-senha').value
      );
      if (ok) window.location.href = 'dashboard.html';
    });
  }

  if (formReg) {
    formReg.addEventListener('submit', async (e) => {
      e.preventDefault();
      const ok = await handleRegistrar(
        document.getElementById('reg-nome').value,
        document.getElementById('reg-email').value,
        document.getElementById('reg-senha').value,
        document.getElementById('reg-senha2').value
      );
      if (ok) {
        showToast('Conta criada! Agora entre com seu e-mail e senha.', 'success');
        switchTab('login');
        formReg.reset();
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const page = document.body ? document.body.dataset.page : null;
  if (page === 'login') {
    initLoginPage();
  } else if (page) {
    requireAuth();
    renderNav(page);
  }
});