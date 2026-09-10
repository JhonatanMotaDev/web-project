let editUsuarioId = null;

function renderUsuarios() {
  const usuarios = getData(StoreKeys.LEITORES, []);
  const emprestimos = getData(StoreKeys.EMPRESTIMOS, []);
  const leitoresAtivos = new Set(
    emprestimos.filter((l) => l.status === 'ativo' || l.status === 'atrasado').map((l) => l.leitorId)
  );
  const term = (document.getElementById('busca-usuarios').value || '').trim().toLowerCase();

  const filtrados = usuarios.filter(
    (u) =>
      !term ||
      String(u.nome.toLowerCase()).includes(term) ||
      String(u.matricula.toLowerCase()).includes(term)
  );

  const tbody = document.getElementById('tb-usuarios');
  document.getElementById('usuario-count').textContent = `${filtrados.length} usuário(s) encontrado(s)`;
  document.getElementById('usuarios-vazio').hidden = filtrados.length > 0;

  tbody.innerHTML = filtrados
    .map((u) => {
      const temEmprestimo = leitoresAtivos.has(u.id);
      return `
      <tr>
        <td>${u.id}</td>
        <td class="cell-strong">${escapeHtml(u.nome)}</td>
        <td>${escapeHtml(u.matricula)}</td>
        <td>${escapeHtml(u.email)}</td>
        <td>${escapeHtml(u.telefone || '—')}</td>
        <td class="actions-col">
          <button class="btn btn-ghost btn-sm" onclick="abrirEdicaoUsuario(${u.id})">Editar</button>
          <button class="btn btn-danger btn-sm" onclick="excluirUsuario(${u.id})" ${temEmprestimo ? 'disabled title="Usuário com empréstimo ativo"' : ''}>Excluir</button>
          ${temEmprestimo ? `<span class="legend-hint" title="Possui empréstimo ativo"><svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></span>` : ''}
        </td>
      </tr>`;
    })
    .join('');
}

function openUsuarioModal(usuario) {
  const form = document.getElementById('form-usuario');
  form.reset();
  editUsuarioId = usuario ? usuario.id : null;
  document.getElementById('modal-usuario-title').textContent = usuario ? `Editar Usuário #${usuario.id}` : 'Novo Usuário';
  document.getElementById('usuario-id').value = usuario ? usuario.id : '';
  if (usuario) {
    document.getElementById('usuario-nome').value = usuario.nome;
    document.getElementById('usuario-matricula').value = usuario.matricula;
    document.getElementById('usuario-email').value = usuario.email;
    document.getElementById('usuario-telefone').value = usuario.telefone || '';
  }
  openModal('modal-usuario');
  document.getElementById('usuario-nome').focus();
}

function abrirEdicaoUsuario(id) {
  const usuario = getData(StoreKeys.LEITORES, []).find((u) => u.id === id);
  if (usuario) openUsuarioModal(usuario);
}

function saveUsuario(e) {
  e.preventDefault();
  const nome = document.getElementById('usuario-nome').value.trim();
  const matricula = document.getElementById('usuario-matricula').value.trim();
  const email = document.getElementById('usuario-email').value.trim();
  const telefone = document.getElementById('usuario-telefone').value.trim();

  if (!nome || !matricula || !email) {
    showToast('Preencha os campos obrigatórios (*).', 'error');
    return;
  }
  if (!isValidEmail(email)) {
    showToast('Informe um e-mail válido.', 'error');
    return;
  }
  if (telefone && !isValidPhone(telefone)) {
    showToast('Telefone inválido. Use o formato (DDD) + número.', 'error');
    return;
  }

  const usuarios = getData(StoreKeys.LEITORES, []);
  const matriculaNormalizada = onlyDigits(matricula).toUpperCase();
  const duplicada = usuarios.some(
    (u) =>
      u.id !== editUsuarioId && onlyDigits(u.matricula).toUpperCase() === matriculaNormalizada
  );
  if (duplicada) {
    showToast('Já existe um usuário com esta matrícula/CPF.', 'error');
    return;
  }

  if (editUsuarioId) {
    const idx = usuarios.findIndex((u) => u.id === editUsuarioId);
    usuarios[idx] = { ...usuarios[idx], nome, matricula, email, telefone: telefone || '' };
    saveData(StoreKeys.LEITORES, usuarios);
    showToast('Usuário atualizado com sucesso!', 'success');
  } else {
    usuarios.push({
      id: generateId(usuarios),
      nome,
      matricula,
      email,
      telefone: telefone || ''
    });
    saveData(StoreKeys.LEITORES, usuarios);
    showToast('Usuário cadastrado com sucesso!', 'success');
  }

  closeModal('modal-usuario');
  renderUsuarios();
}

function excluirUsuario(id) {
  const usuario = getData(StoreKeys.LEITORES, []).find((u) => u.id === id);
  if (!usuario) return;

  const emprestimos = getData(StoreKeys.EMPRESTIMOS, []);
  const temAtivo = emprestimos.some(
    (l) => l.leitorId === id && (l.status === 'ativo' || l.status === 'atrasado')
  );
  if (temAtivo) {
    showToast('Não é possível excluir: há empréstimo(s) ativo(s) vinculado(s) a este usuário.', 'error');
    return;
  }

  if (!confirmAction(`Excluir o usuário "${usuario.nome}"? Esta ação não pode ser desfeita.`)) return;
  const usuarios = getData(StoreKeys.LEITORES, []).filter((u) => u.id !== id);
  saveData(StoreKeys.LEITORES, usuarios);
  showToast('Usuário excluído.', 'success');
  renderUsuarios();
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.body.dataset.page !== 'usuarios') return;
  document.getElementById('btn-novo-usuario').addEventListener('click', () => openUsuarioModal(null));
  document.getElementById('busca-usuarios').addEventListener('input', renderUsuarios);
  document.getElementById('form-usuario').addEventListener('submit', saveUsuario);
  document.querySelectorAll('#modal-usuario [data-close]').forEach((btn) =>
    btn.addEventListener('click', () => closeModal('modal-usuario'))
  );
  document.getElementById('modal-usuario').addEventListener('click', (e) => {
    if (e.target === document.getElementById('modal-usuario')) closeModal('modal-usuario');
  });
  renderUsuarios();
});