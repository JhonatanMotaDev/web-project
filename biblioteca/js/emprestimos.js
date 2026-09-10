function populateLeitoresSelect() {
  const select = document.getElementById('emp-leitor');
  const leitores = getData(StoreKeys.LEITORES, []);
  select.innerHTML =
    '<option value="">Selecione o leitor...</option>' +
    leitores
      .map((l) => `<option value="${l.id}">${escapeHtml(l.nome)} — ${escapeHtml(l.matricula)}</option>`)
      .join('');
}

function populateLivrosSelect() {
  const select = document.getElementById('emp-livro');
  const livros = getData(StoreKeys.LIVROS, []);
  const withStock = livros.filter((b) => b.quantidadeDisponivel > 0);
  const withoutStock = livros.filter((b) => b.quantidadeDisponivel <= 0);
  let html = '<option value="">Selecione o livro...</option>';
  if (withStock.length) {
    html +=
      '<optgroup label="Disponíveis">' +
      withStock
        .map(
          (b) =>
            `<option value="${b.id}">${escapeHtml(b.titulo)} (${b.quantidadeDisponivel} disp.)</option>`
        )
        .join('') +
      '</optgroup>';
  }
  if (withoutStock.length) {
    html +=
      '<optgroup label="Esgotados">' +
      withoutStock.map((b) => `<option value="${b.id}" disabled>${escapeHtml(b.titulo)} (esgotado)</option>`).join('') +
      '</optgroup>';
  }
  select.innerHTML = html;
}

function statusBadge(status) {
  const map = {
    ativo: '<span class="badge badge-info">Ativo</span>',
    atrasado: '<span class="badge badge-danger">Atrasado</span>',
    devolvido: '<span class="badge badge-success">Devolvido</span>'
  };
  return map[status] || status;
}

function renderEmprestimos() {
  normalizeEmpAtrasados();
  const loans = getData(StoreKeys.EMPRESTIMOS, []);
  const livros = getData(StoreKeys.LIVROS, []);
  const leitores = getData(StoreKeys.LEITORES, []);
  const filtro = document.getElementById('filtro-status').value;

  const filtrados = filtro === 'todos' ? loans : loans.filter((l) => l.status === filtro);
  const sorted = [...filtrados].sort((a, b) => b.id - a.id);

  const livroTitulo = (id) => {
    const b = livros.find((x) => x.id === id);
    return b ? b.titulo : 'Livro removido';
  };
  const leitorNome = (id) => {
    const u = leitores.find((x) => x.id === id);
    return u ? u.nome : 'Leitor removido';
  };

  const tbody = document.getElementById('tb-emprestimos');
  document.getElementById('emprestimos-vazio').hidden = sorted.length > 0;
  tbody.innerHTML = sorted
    .map((l) => {
      const podeDevolver = l.status !== 'devolvido';
      return `
      <tr>
        <td>${l.id}</td>
        <td class="cell-strong">${escapeHtml(livroTitulo(l.livroId))}</td>
        <td>${escapeHtml(leitorNome(l.leitorId))}</td>
        <td>${formatDate(l.dataEmprestimo)}</td>
        <td>${formatDate(l.dataPrevistaDevolucao)}</td>
        <td>${formatDate(l.dataDevolucao)}</td>
        <td>${statusBadge(l.status)}</td>
        <td class="actions-col">
          ${podeDevolver ? `<button class="btn btn-success btn-sm" onclick="devolverEmp(${l.id})">Devolver</button>` : '<span class="muted">—</span>'}
        </td>
      </tr>`;
    })
    .join('');
}

function updatePrevista() {
  const data = document.getElementById('emp-data').value;
  document.getElementById('emp-prevista').value = data ? addDays(data, 14) : '';
}

function registrarEmp(e) {
  e.preventDefault();
  const leitorId = Number(document.getElementById('emp-leitor').value);
  const livroId = Number(document.getElementById('emp-livro').value);
  const dataEmp = document.getElementById('emp-data').value;

  if (!leitorId) {
    showToast('Selecione um leitor.', 'error');
    return;
  }
  if (!livroId) {
    showToast('Selecione um livro.', 'error');
    return;
  }
  if (!dataEmp) {
    showToast('Informe a data do empréstimo.', 'error');
    return;
  }

  const livros = getData(StoreKeys.LIVROS, []);
  const livro = livros.find((b) => b.id === livroId);
  if (!livro) {
    showToast('Livro não encontrado.', 'error');
    return;
  }
  if (livro.quantidadeDisponivel <= 0) {
    showToast('Não há exemplares disponíveis deste livro.', 'error');
    return;
  }

  const prevista = addDays(dataEmp, 14);
  const loans = getData(StoreKeys.EMPRESTIMOS, []);
  loans.push({
    id: generateId(loans),
    livroId,
    leitorId,
    dataEmprestimo: dataEmp,
    dataPrevistaDevolucao: prevista,
    dataDevolucao: null,
    status: 'ativo'
  });
  livro.quantidadeDisponivel -= 1;
  saveData(StoreKeys.LIVROS, livros);
  saveData(StoreKeys.EMPRESTIMOS, loans);

  showToast('Empréstimo registrado com sucesso!', 'success');
  document.getElementById('form-emprestimo').reset();
  document.getElementById('emp-data').value = todayISO();
  updatePrevista();
  populateLivrosSelect();
  renderEmprestimos();
}

function devolverEmp(id) {
  const loans = getData(StoreKeys.EMPRESTIMOS, []);
  const loan = loans.find((l) => l.id === id);
  if (!loan || loan.status === 'devolvido') return;

  if (!confirmAction('Registrar a devolução deste empréstimo?')) return;

  loan.status = 'devolvido';
  loan.dataDevolucao = todayISO();

  const livros = getData(StoreKeys.LIVROS, []);
  const livro = livros.find((b) => b.id === loan.livroId);
  if (livro && livro.quantidadeDisponivel < livro.quantidadeTotal) {
    livro.quantidadeDisponivel += 1;
  }

  saveData(StoreKeys.EMPRESTIMOS, loans);
  saveData(StoreKeys.LIVROS, livros);
  showToast('Devolução registrada. Livro disponibilizado novamente.', 'success');
  populateLivrosSelect();
  renderEmprestimos();
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.body.dataset.page !== 'emprestimos') return;
  document.getElementById('form-emprestimo').addEventListener('submit', registrarEmp);
  document.getElementById('emp-data').value = todayISO();
  document.getElementById('emp-data').addEventListener('change', updatePrevista);
  document.getElementById('filtro-status').addEventListener('change', renderEmprestimos);
  populateLeitoresSelect();
  populateLivrosSelect();
  updatePrevista();
  renderEmprestimos();
});