# Sistema de Gerenciamento de Biblioteca

Aplicação web **HTML + CSS + JavaScript puro**, sem frameworks, sem dependências externas, com persistência em `localStorage`. Funciona inteiramente local — basta abrir `login.html` no navegador.

---

## Integrantes da equipe

| Nome | Módulo(s) |
|------|-----------|
| *Jhonatan Mota*
| *Pedro Maia*
| *Thales Daniel*

> **Disciplina:** Programação de Sistemas Web
> **Semestre:** 2º semestre de 2026
> **Tema:** Biblioteca

---

## Como executar

1. Acesse a pasta do projeto.
2. Abra o arquivo `login.html` em qualquer navegador moderno (Chrome, Firefox, Edge).
3. Na primeira vez, clique em **Cadastrar bibliotecário**, crie a conta e faça login.
4. Pronto — todos os dados ficam salvos no `localStorage` do navegador.

> Dica: também funciona servindo via `python -m http.server` dentro da pasta (ex.: `http://localhost:8000/login.html`).

---

## Estrutura de arquivos

```
biblioteca/
├── login.html          → cadastro e autenticação do bibliotecário
├── dashboard.html      → tela inicial com totais (livros, leitores, empréstimos ativos/atrasados)
├── livros.html         → CRUD de livros (ISBN único, busca por título/autor/categoria)
├── usuarios.html       → CRUD de leitores (matrícula/CPF único)
├── emprestimos.html    → empréstimos/devoluções (+14 dias automáticos, controle de estoque)
├── css/
│   └── style.css       → tema escuro, navbar fixa, modais, badges, toasts
├── js/
│   ├── utils.js        → helpers de localStorage, IDs, datas, navbar, validações (contrato central)
│   ├── auth.js         → hash SHA-256, sessão, proteção de rotas, login
│   ├── livros.js       → lógica do CRUD de livros
│   ├── usuarios.js     → lógica do CRUD de leitores
│   ├── emprestimos.js  → regras de empréstimo, devolução e status
│   └── dashboard.js    → estatísticas da tela inicial
└── README.md
```

---

## Regras de negócio implementadas

- **Autenticação:** senha armazenada com hash SHA-256; sessão controlada no `localStorage`; páginas protegidas redirecionam para `login.html`.
- **Livros:** ISBN duplicado é bloqueado; quantidade disponível é ajustada automaticamente ao alterar o total ou registrar/devolver empréstimos.
- **Leitores:** matrícula/CPF duplicado bloqueado; e-mail validado.
- **Empréstimos:** devolução prevista calculada automaticamente em **+14 dias**; impedido quando não há exemplares disponíveis; empréstimos cuja data prevista passa sem devolução são marcados como **atrasados**.
- **Exclusões:** um livro ou leitor com empréstimo **ativo/atrasado** vinculado **não pode ser excluído**.