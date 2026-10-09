-- =============================================================
-- Task Manager - Dados de Exemplo (Seed)
-- =============================================================

-- Usuário de demonstração
-- Senha: demo123 (hash bcrypt gerado com cost=12)
INSERT INTO users (name, email, password) VALUES
(
    'Herickson Willian',
    'herickson@demo.com',
    '$2y$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'
),
(
    'Demo User',
    'demo@taskmanager.com',
    '$2y$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'
);

-- Tarefas de exemplo para o usuário 1
INSERT INTO tasks (title, description, status, priority, user_id) VALUES
(
    'Configurar ambiente de desenvolvimento',
    'Instalar PHP 8.2, Composer, Node.js, PostgreSQL e configurar variáveis de ambiente do projeto.',
    'done',
    'high',
    1
),
(
    'Implementar autenticação JWT',
    'Criar endpoints de login e registro, gerar tokens JWT com expiração de 24h e middleware de validação.',
    'done',
    'high',
    1
),
(
    'Criar CRUD de tarefas',
    'Desenvolver os endpoints REST para criação, leitura, atualização e exclusão de tarefas com validação de dados.',
    'in_progress',
    'high',
    1
),
(
    'Desenvolver frontend React',
    'Criar interface com React + Vite, implementar autenticação, dashboard de tarefas e formulários.',
    'in_progress',
    'medium',
    1
),
(
    'Escrever testes unitários PHPUnit',
    'Cobrir controllers e models com testes unitários usando PHPUnit. Meta: 80% de cobertura.',
    'pending',
    'medium',
    1
),
(
    'Escrever testes com Vitest',
    'Testar componentes React e hooks customizados com Vitest e Testing Library.',
    'pending',
    'medium',
    1
),
(
    'Configurar CI/CD com GitHub Actions',
    'Pipeline para rodar testes automaticamente e fazer deploy do frontend no GitHub Pages.',
    'pending',
    'low',
    1
),
(
    'Documentar a API',
    'Criar documentação dos endpoints com exemplos de request/response no README.',
    'pending',
    'low',
    1
);
