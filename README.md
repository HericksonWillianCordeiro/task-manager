# ✅ Task Manager

![PHP](https://img.shields.io/badge/PHP-8.2-777BB4?logo=php&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-336791?logo=postgresql&logoColor=white)
![PHPUnit](https://img.shields.io/badge/PHPUnit-11-6C3EB3?logo=php)
![Vitest](https://img.shields.io/badge/Vitest-2-6E9F18?logo=vitest&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green)

Sistema de gerenciamento de tarefas desenvolvido com **PHP** (backend REST) e **React** (frontend SPA). Projeto desenvolvido para demonstrar habilidades com as tecnologias utilizadas no dia a dia de times de desenvolvimento modernos.

🔗 **[Demo ao vivo no GitHub Pages](https://hericksonwillian.github.io/task-manager/)**

---

## 🚀 Tecnologias

### Backend
| Tecnologia | Uso |
|---|---|
| PHP 8.2 | API REST, lógica de negócio |
| PDO | Acesso ao banco com prepared statements |
| firebase/php-jwt | Autenticação JWT |
| PHPUnit 11 | Testes unitários |
| PostgreSQL / MySQL | Banco de dados relacional |

### Frontend
| Tecnologia | Uso |
|---|---|
| React 18 | Interface de usuário (SPA) |
| React Router 6 | Roteamento client-side |
| Vite | Bundler e dev server |
| Axios | Comunicação com a API |
| Vitest + Testing Library | Testes de componentes e hooks |
| CSS Modules | Estilização escopada |

---

## 🏗️ Arquitetura

```
task-manager/
├── frontend/              # React + Vite (GitHub Pages)
│   └── src/
│       ├── components/    # Componentes reutilizáveis
│       ├── pages/         # Páginas (Login, Dashboard)
│       ├── hooks/         # Hooks customizados (useTasks)
│       ├── context/       # Contexto de autenticação
│       └── services/      # Integração com API + modo demo
│
├── backend/               # API REST em PHP
│   └── src/
│       ├── Controllers/   # AuthController, TaskController
│       ├── Models/        # User, Task (POO + PDO)
│       ├── Middleware/    # AuthMiddleware (JWT)
│       └── Utils/         # Response helper
│
├── database/
│   ├── schema.sql         # Estrutura das tabelas
│   └── seed.sql           # Dados de exemplo
│
├── tests/
│   ├── backend/           # PHPUnit
│   └── frontend/          # Vitest
│
└── .github/workflows/     # CI/CD — testes + deploy automático
```

### API REST

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| POST | `/api/auth/register` | Cadastro de usuário | ❌ |
| POST | `/api/auth/login` | Login + retorna JWT | ❌ |
| GET | `/api/tasks` | Lista tarefas (filtros opcionais) | ✅ |
| POST | `/api/tasks` | Cria nova tarefa | ✅ |
| GET | `/api/tasks/{id}` | Detalhe de uma tarefa | ✅ |
| PUT | `/api/tasks/{id}` | Atualiza tarefa | ✅ |
| PATCH | `/api/tasks/{id}/toggle` | Avança status | ✅ |
| DELETE | `/api/tasks/{id}` | Remove tarefa | ✅ |

---

## ⚙️ Como rodar localmente

### Pré-requisitos
- PHP 8.2+
- Composer
- Node.js 20+
- PostgreSQL (ou MySQL)

### Backend

```bash
# 1. Entrar na pasta do backend
cd backend

# 2. Instalar dependências PHP
composer install

# 3. Copiar e configurar variáveis de ambiente
cp .env.example .env
# Edite o .env com suas credenciais de banco

# 4. Criar o banco e executar o schema
psql -U postgres -c "CREATE DATABASE taskmanager;"
psql -U postgres -d taskmanager -f ../database/schema.sql
psql -U postgres -d taskmanager -f ../database/seed.sql

# 5. Iniciar o servidor PHP embutido
php -S localhost:8000 -t .
```

A API estará disponível em `http://localhost:8000/api`

### Frontend

```bash
# 1. Entrar na pasta do frontend
cd frontend

# 2. Instalar dependências Node
npm install

# 3. (Opcional) Conectar ao backend local
# Crie um arquivo .env.local com:
# VITE_API_URL=http://localhost:8000/api

# 4. Iniciar o servidor de desenvolvimento
npm run dev
```

O app estará em `http://localhost:5173/task-manager/`

> **💡 Modo demo:** sem o arquivo `.env.local`, o frontend roda completamente no navegador usando localStorage como banco de dados — ideal para testar sem backend.

---

## 🧪 Testes

### Backend (PHPUnit)

```bash
cd backend
composer install
./vendor/bin/phpunit --configuration ../tests/backend/phpunit.xml --colors
```

### Frontend (Vitest)

```bash
cd frontend
npm install
npm test          # execução única
npm run test:watch     # modo watch
npm run test:coverage  # com relatório de cobertura
```

---

## 🔐 Boas práticas aplicadas

- **Prepared statements** em todas as queries SQL — prevenção de SQL Injection
- **Bcrypt** com cost 12 para hash de senhas
- **JWT** com expiração de 24h para autenticação stateless
- **Validação** de dados no frontend (antes do envio) e no backend (antes de persistir)
- **Sanitização** de inputs com `trim()` e `filter_var()`
- **Typed properties** e return types em todo o PHP (PHP 8+)
- **Rotas protegidas** no React — redirecionamento automático para login
- **CORS** configurado no backend

---

## 🤖 Ferramentas de IA utilizadas

Este projeto foi desenvolvido com o auxílio de ferramentas de IA:

- **[Kiro](https://kiro.dev)** — IDE com IA da AWS, utilizado para scaffolding, geração de código e revisão
- **GitHub Copilot** — Sugestões de código inline durante o desenvolvimento

O uso consciente dessas ferramentas acelera o desenvolvimento e reduz erros, sem substituir o entendimento técnico do desenvolvedor.

---

## 📄 Licença

MIT — veja o arquivo [LICENSE](LICENSE) para detalhes.

---

Desenvolvido por **Herickson Willian Cordeiro**
