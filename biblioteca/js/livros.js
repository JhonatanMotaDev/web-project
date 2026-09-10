let editLivroId = null;

function statusBadgeLivro(disp) {
  if (disp === 0) return '<span class="badge badge-danger">Esgotado</span>';
  return '<span class="badge badge-success">Disponível</span>';
}

function renderLivros() {
  const livros = getData(StoreKeys.LIVROS, []);
  const term = (document.getElementById('busca-livros').value || '').trim().toLowerCase();

  const filtrados = livros.filter(
    (b) =>
      !term ||
      [b.titulo, b.autor, b.categoria].some((v) => String(v || '').toLowerCase().includes(term))
  );

  const tbody = document.getElementById('tb-livros');
  document.getElementById('livro-count').textContent = `${filtrados.length} livro(s) encontrado(s)`;
  document.getElementById('livros-vazio').hidden = filtrados.length > 0;

  tbody.innerHTML = filtrados
    .map((b) => {
      return `
      <tr>
        <td>${b.id}</td>
        <td class="cell-strong">${escapeHtml(b.titulo)}</td>
        <td>${escapeHtml(b.autor)}</td>
        <td>${escapeHtml(b.isbn)}</td>
        <td><span class="badge badge-info">${escapeHtml(b.categoria)}</span></td>
        <td>${b.ano}</td>
        <td>${escapeHtml(b.editora)}</td>
        <td class="num">${b.quantidadeTotal}</td>
        <td class="num">${b.quantidadeDisponivel} ${statusBadgeLivro(b.quantidadeDisponivel)}</td>
        <td class="actions-col">
          <button class="btn btn-ghost btn-sm" onclick="abrirEdicaoLivro(${b.id})">Editar</button>
          <button class="btn btn-danger btn-sm" onclick="excluirLivro(${b.id})">Excluir</button>
        </td>
      </tr>`;
    })
    .join('');
}

function openLivroModal(livro) {
  const form = document.getElementById('form-livro');
  form.reset();
  editLivroId = livro ? livro.id : null;
  document.getElementById('modal-livro-title').textContent = livro ? `Editar Livro #${livro.id}` : 'Novo Livro';
  document.getElementById('livro-id').value = livro ? livro.id : '';
  if (livro) {
    document.getElementById('livro-titulo').value = livro.titulo;
    document.getElementById('livro-autor').value = livro.autor;
    document.getElementById('livro-isbn').value = livro.isbn;
    document.getElementById('livro-categoria').value = livro.categoria;
    document.getElementById('livro-ano').value = livro.ano;
    document.getElementById('livro-editora').value = livro.editora;
    document.getElementById('livro-qtd-total').value = livro.quantidadeTotal;
  }
  document.getElementById('livro-qtd-disponivel').value =
    livro ? livro.quantidadeDisponivel : (Number(document.getElementById('livro-qtd-total').value) || 0);
  openModal('modal-livro');
  document.getElementById('livro-titulo').focus();
}

function abrirEdicaoLivro(id) {
  const livro = getData(StoreKeys.LIVROS, []).find((b) => b.id === id);
  if (livro) openLivroModal(livro);
}

function closeLivroModal() {
  closeModal('modal-livro');
}

function saveLivro(e) {
  e.preventDefault();
  const titulo = document.getElementById('livro-titulo').value.trim();
  const autor = document.getElementById('livro-autor').value.trim();
  const isbn = document.getElementById('livro-isbn').value.trim();
  const categoria = document.getElementById('livro-categoria').value.trim();
  const ano = Number(document.getElementById('livro-ano').value);
  const editora = document.getElementById('livro-editora').value.trim();
  const qtdTotal = Number(document.getElementById('livro-qtd-total').value);

  if (!titulo || !autor || !isbn || !categoria || !editora) {
    showToast('Preencha todos os campos obrigatórios (*).', 'error');
    return;
  }
  if (!Number.isInteger(ano) || ano < 1000 || ano > 9999) {
    showToast('Informe um ano válido (4 dígitos).', 'error');
    return;
  }
  if (!Number.isInteger(qtdTotal) || qtdTotal < 0) {
    showToast('Quantidade total deve ser um número inteiro maior ou igual a zero.', 'error');
    return;
  }

  const livros = getData(StoreKeys.LIVROS, []);
  const isbnNormalizado = isbn.replace(/[-\s]/g, '').toUpperCase();
  const duplicado = livros.some(
    (b) =>
      b.id !== editLivroId &&
      String(b.isbn).replace(/[-\s]/g, '').toUpperCase() === isbnNormalizado
  );
  if (duplicado) {
    showToast('Já existe um livro com este ISBN.', 'error');
    return;
  }

  if (editLivroId) {
    const idx = livros.findIndex((b) => b.id === editLivroId);
    const antes = livros[idx];
    const emprestados = antes.quantidadeTotal - antes.quantidadeDisponivel;
    if (qtdTotal < emprestados) {
      showToast(
        `Não é possível reduzir a quantidade total para ${qtdTotal} — há ${emprestados} exemplar(es) emprestado(s).`,
        'error'
      );
      return;
    }
    livros[idx] = {
      ...antes,
      titulo,
      autor,
      isbn,
      categoria,
      ano,
      editora,
      quantidadeTotal: qtdTotal,
      quantidadeDisponivel: qtdTotal - emprestados
    };
    saveData(StoreKeys.LIVROS, livros);
    showToast('Livro atualizado com sucesso!', 'success');
  } else {
    livros.push({
      id: generateId(livros),
      titulo,
      autor,
      isbn,
      categoria,
      ano,
      editora,
      quantidadeTotal: qtdTotal,
      quantidadeDisponivel: qtdTotal
    });
    saveData(StoreKeys.LIVROS, livros);
    showToast('Livro cadastrado com sucesso!', 'success');
  }

  closeLivroModal();
  renderLivros();
}

function excluirLivro(id) {
  const livro = getData(StoreKeys.LIVROS, []).find((b) => b.id === id);
  if (!livro) return;

  const emprestimos = getData(StoreKeys.EMPRESTIMOS, []);
  const temAtivo = emprestimos.some(
    (l) => l.livroId === id && (l.status === 'ativo' || l.status === 'atrasado')
  );
  if (temAtivo) {
    showToast('Não é possível excluir: há empréstimo(s) ativo(s) vinculado(s) a este livro.', 'error');
    return;
  }

  if (!confirmAction(`Excluir o livro "${livro.titulo}"? Esta ação não pode ser desfeita.`)) return;
  const livros = getData(StoreKeys.LIVROS, []).filter((b) => b.id !== id);
  saveData(StoreKeys.LIVROS, livros);
  showToast('Livro excluído.', 'success');
  renderLivros();
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.body.dataset.page !== 'livros') return;
  document.getElementById('btn-novo-livro').addEventListener('click', () => openLivroModal(null));
  document.getElementById('busca-livros').addEventListener('input', renderLivros);
  document.getElementById('form-livro').addEventListener('submit', saveLivro);
  document.querySelectorAll('#modal-livro [data-close]').forEach((btn) =>
    btn.addEventListener('click', closeLivroModal)
  );
  document.getElementById('modal-livro').addEventListener('click', (e) => {
    if (e.target === document.getElementById('modal-livro')) closeLivroModal();
  });
  document.getElementById('livro-qtd-total').addEventListener('input', () => {
    const v = Number(document.getElementById('livro-qtd-total').value) || 0;
    document.getElementById('livro-qtd-disponivel').value = editLivroId ? '' : v;
    if (editLivroId) {
      const livro = getData(StoreKeys.LIVROS, []).find((b) => b.id === editLivroId);
      if (livro) {
        const emprestados = livro.quantidadeTotal - livro.quantidadeDisponivel;
        document.getElementById('livro-qtd-disponivel').value = Math.max(0, v - emprestados);
      }
    }
  });
  renderLivros();
});