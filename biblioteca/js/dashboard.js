function diasAtraso(prevista) {
  const prev = new Date(prevista + 'T00:00:00');
  const hoje = new Date(todayISO() + 'T00:00:00');
  const diff = Math.floor((hoje - prev) / 86400000);
  return diff > 0 ? diff : 0;
}

function statusBadge(status) {
  const map = {
    ativo: '<span class="badge badge-info">Ativo</span>',
    atrasado: '<span class="badge badge-danger">Atrasado</span>',
    devolvido: '<span class="badge badge-success">Devolvido</span>'
  };
  return map[status] || status;
}

function renderDashboard() {
  const loans = normalizeEmpAtrasados();
  const [livros, leitores] = [
    getData(StoreKeys.LIVROS, []),
    getData(StoreKeys.LEITORES, [])
  ];

  const ativos = loans.filter((l) => l.status === 'ativo').length;
  const atrasados = loans.filter((l) => l.status === 'atrasado');

  document.getElementById('stat-livros').textContent = livros.length;
  document.getElementById('stat-leitores').textContent = leitores.length;
  document.getElementById('stat-ativos').textContent = ativos;
  document.getElementById('stat-atrasados').textContent = atrasados.length;

  const livroTitulo = (id) => {
    const b = livros.find((x) => x.id === id);
    return b ? b.titulo : 'Livro removido';
  };
  const leitorNome = (id) => {
    const u = leitores.find((x) => x.id === id);
    return u ? u.nome : 'Leitor removido';
  };

  document.getElementById('atrasados-vazio').hidden = atrasados.length > 0;
  document.getElementById('tb-atrasados').innerHTML = atrasados
    .sort((a, b) => b.dataPrevistaDevolucao.localeCompare(a.dataPrevistaDevolucao))
    .map(
      (l) => `
      <tr>
        <td>${l.id}</td>
        <td class="cell-strong">${escapeHtml(livroTitulo(l.livroId))}</td>
        <td>${escapeHtml(leitorNome(l.leitorId))}</td>
        <td>${formatDate(l.dataPrevistaDevolucao)}</td>
        <td><span class="badge badge-danger">${diasAtraso(l.dataPrevistaDevolucao)} dia(s)</span></td>
      </tr>`
    )
    .join('');

  const recentes = [...loans].sort((a, b) => b.id - a.id).slice(0, 8);
  document.getElementById('recentes-vazio').hidden = recentes.length > 0;
  document.getElementById('tb-recentes').innerHTML = recentes
    .map(
      (l) => `
      <tr>
        <td>${l.id}</td>
        <td class="cell-strong">${escapeHtml(livroTitulo(l.livroId))}</td>
        <td>${escapeHtml(leitorNome(l.leitorId))}</td>
        <td>${formatDate(l.dataEmprestimo)}</td>
        <td>${formatDate(l.dataPrevistaDevolucao)}</td>
        <td>${statusBadge(l.status)}</td>
      </tr>`
    )
    .join('');
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.body.dataset.page !== 'dashboard') return;
  const s = session();
  if (s && s.nome) {
    document.getElementById('dashboard-welcome').textContent = `Visão geral da biblioteca — bem-vindo(a), ${s.nome}!`;
  }
  renderDashboard();
});