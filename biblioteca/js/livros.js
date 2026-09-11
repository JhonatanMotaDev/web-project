let editLivroId = null;

const livrosIniciais = [
  { id: 1, titulo: "Dom Casmurro", autor: "Machado de Assis", isbn: "978-8535902778", categoria: "Romance", ano: 1899, editora: "Companhia das Letras", quantidadeTotal: 5, quantidadeDisponivel: 3 },
  { id: 2, titulo: "1984", autor: "George Orwell", isbn: "978-8535914849", categoria: "Ficção Científica", ano: 1949, editora: "Companhia das Letras", quantidadeTotal: 4, quantidadeDisponivel: 1 },
  { id: 3, titulo: "O Hobbit", autor: "J.R.R. Tolkien", isbn: "978-8595084742", categoria: "Fantasia", ano: 1937, editora: "HarperCollins", quantidadeTotal: 8, quantidadeDisponivel: 6 },
  { id: 4, titulo: "Algoritmos: Teoria e Prática", autor: "Thomas H. Cormen", isbn: "978-8535236996", categoria: "Tecnologia", ano: 2012, editora: "Campus", quantidadeTotal: 3, quantidadeDisponivel: 0 },
  { id: 5, titulo: "O Pequeno Príncipe", autor: "Antoine de Saint-Exupéry", isbn: "978-8522031436", categoria: "Infantojuvenil", ano: 1943, editora: "Agir", quantidadeTotal: 6, quantidadeDisponivel: 4 },
  { id: 6, titulo: "Sapiens: Uma Breve História da Humanidade", autor: "Yuval Noah Harari", isbn: "978-8535925714", categoria: "História", ano: 2014, editora: "L&PM", quantidadeTotal: 7, quantidadeDisponivel: 5 },
  { id: 7, titulo: "O Senhor dos Anéis: A Sociedade do Anel", autor: "J.R.R. Tolkien", isbn: "978-8595084759", categoria: "Fantasia", ano: 1954, editora: "HarperCollins", quantidadeTotal: 5, quantidadeDisponivel: 2 },
  { id: 8, titulo: "A Revolução dos Bichos", autor: "George Orwell", isbn: "978-8535909555", categoria: "Sátira Político-Social", ano: 1945, editora: "Companhia das Letras", quantidadeTotal: 6, quantidadeDisponivel: 6 },
  { id: 9, titulo: "Orgulho e Preconceito", autor: "Jane Austen", isbn: "978-8535931815", categoria: "Romance", ano: 1813, editora: "Penguin Classics", quantidadeTotal: 4, quantidadeDisponivel: 2 },
  { id: 10, titulo: "Cem Anos de Solidão", autor: "Gabriel García Márquez", isbn: "978-8501012074", categoria: "Realismo Mágico", ano: 1967, editora: "Record", quantidadeTotal: 3, quantidadeDisponivel: 1 },
  { id: 11, titulo: "Código Limpo (Clean Code)", autor: "Robert C. Martin", isbn: "978-8576082675", categoria: "Tecnologia", ano: 2009, editora: "Alta Books", quantidadeTotal: 5, quantidadeDisponivel: 2 },
  { id: 12, titulo: "O Alquimista", autor: "Paulo Coelho", isbn: "978-8575422380", categoria: "Ficção", ano: 1988, editora: "Paralela", quantidadeTotal: 8, quantidadeDisponivel: 7 },
  { id: 13, titulo: "Duna", autor: "Frank Herbert", isbn: "978-8576573135", categoria: "Ficção Científica", ano: 1965, editora: "Aleph", quantidadeTotal: 6, quantidadeDisponivel: 3 },
  { id: 14, titulo: "O Apanhador no Campo de Centeio", autor: "J.D. Salinger", isbn: "978-8501020864", categoria: "Romance", ano: 1951, editora: "Editora do Autor", quantidadeTotal: 3, quantidadeDisponivel: 3 },
  { id: 15, titulo: "O Sol é Para Todos", autor: "Harper Lee", isbn: "978-8501103215", categoria: "Romance", ano: 1960, editora: "José Olympio", quantidadeTotal: 4, quantidadeDisponivel: 1 },
  { id: 16, titulo: "A Hora da Estrela", autor: "Clarice Lispector", isbn: "978-8532511010", categoria: "Literatura Brasileira", ano: 1977, editora: "Rocco", quantidadeTotal: 5, quantidadeDisponivel: 4 },
  { id: 17, titulo: "O Nome da Rosa", autor: "Umberto Eco", isbn: "978-8501033284", categoria: "Romance Histórico", ano: 1980, editora: "Record", quantidadeTotal: 3, quantidadeDisponivel: 2 },
  { id: 18, titulo: "Frankenstein", autor: "Mary Shelley", isbn: "978-8535929651", categoria: "Terror", ano: 1818, editora: "Landmark", quantidadeTotal: 4, quantidadeDisponivel: 4 },
  { id: 19, titulo: "O Código Da Vinci", autor: "Dan Brown", isbn: "978-8580410037", categoria: "Suspense", ano: 2003, editora: "Arqueiro", quantidadeTotal: 7, quantidadeDisponivel: 5 },
  { id: 20, titulo: "Fahrenheit 451", autor: "Ray Bradbury", isbn: "978-8501018861", categoria: "Ficção Científica", ano: 1953, editora: "Globo", quantidadeTotal: 5, quantidadeDisponivel: 2 },
  { id: 21, titulo: "Pense e Enriqueça", autor: "Napoleon Hill", isbn: "978-8504018240", categoria: "Desenvolvimento Pessoal", ano: 1937, editora: "Fundamento", quantidadeTotal: 6, quantidadeDisponivel: 4 },
  { id: 22, titulo: "O Programador Pragmático", autor: "Andrew Hunt, David Thomas", isbn: "978-8576082676", categoria: "Tecnologia", ano: 1999, editora: "Bookman", quantidadeTotal: 4, quantidadeDisponivel: 1 },
  { id: 23, titulo: "A Metamorfose", autor: "Franz Kafka", isbn: "978-8535900897", categoria: "Ficção", ano: 1915, editora: "Companhia das Letras", quantidadeTotal: 5, quantidadeDisponivel: 5 },
  { id: 24, titulo: "Ensaio Sobre a Cegueira", autor: "José Saramago", isbn: "978-8535901306", categoria: "Ficção", ano: 1995, editora: "Companhia das Letras", quantidadeTotal: 4, quantidadeDisponivel: 2 },
  { id: 25, titulo: "Entendendo Algoritmos", autor: "Aditya Y. Bhargava", isbn: "978-8575225639", categoria: "Tecnologia", ano: 2017, editora: "Novatec", quantidadeTotal: 6, quantidadeDisponivel: 4 },
  { id: 26, titulo: "Grande Sertão: Veredas", autor: "Guimarães Rosa", isbn: "978-8520923054", categoria: "Literatura Brasileira", ano: 1956, editora: "Nova Fronteira", quantidadeTotal: 3, quantidadeDisponivel: 1 },
  { id: 27, titulo: "Neuromancer", autor: "William Gibson", isbn: "978-8576573005", categoria: "Cyberpunk", ano: 1984, editora: "Aleph", quantidadeTotal: 4, quantidadeDisponivel: 3 },
  { id: 28, titulo: "Rápido e Devagar: Duas Formas de Pensar", autor: "Daniel Kahneman", isbn: "978-8539003839", categoria: "Psicologia", ano: 2011, editora: "Objetiva", quantidadeTotal: 5, quantidadeDisponivel: 3 },
  { id: 29, titulo: "O Silmarillion", autor: "J.R.R. Tolkien", isbn: "978-8595084377", categoria: "Fantasia", ano: 1977, editora: "HarperCollins", quantidadeTotal: 4, quantidadeDisponivel: 2 },
  { id: 30, titulo: "O Homem mais Rico da Babilônia", autor: "George S. Clason", isbn: "978-8504019995", categoria: "Finanças", ano: 1926, editora: "HarperCollins", quantidadeTotal: 8, quantidadeDisponivel: 6 }
];

function inicializarBancoDeDados() {
  const livrosExistentes = getData(StoreKeys.LIVROS, []);
  if (!livrosExistentes || livrosExistentes.length === 0) {
    saveData(StoreKeys.LIVROS, livrosIniciais);
  }
}

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

  inicializarBancoDeDados();

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