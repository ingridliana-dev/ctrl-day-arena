# Documentação do Projeto: ctrl day arena

## Visão Geral

O "ctrl day arena" é uma plataforma online para gerenciar competições de artes digitais com três tipos de usuários:

1. Administradores (organizadores da competição)
2. Participantes (alunos/artistas)
3. Jurados (avaliadores)

## Objetivo Principal

Facilitar a organização, submissão, avaliação e apuração de resultados de competições de arte de forma online e remota.

## Módulos e Funcionalidades

### Módulo de Administração

- **Criação e Gerenciamento da Competição**
  - Definir nome, datas de início/fim para submissões e julgamento
  - Inserir regras gerais
- **Gerenciamento de Categorias**
  - Pixel Art (Imagem Estática): PNG, JPG, GIF não animado
  - Pixel Art (Animação): GIF animados
  - Modelo 3D (Print/Render): PNG, JPG
  - Cosplay (Vídeo): MP4, MOV, AVI ou links para plataformas
- **Gerenciamento de Critérios de Avaliação**
  - Definir critérios por categoria
  - Definir escala de pontuação
- **Gerenciamento de Usuários**
  - Cadastro de participantes e jurados
- **Monitoramento de Submissões**
- **Apuração e Visualização de Resultados**

### Portal do Participante

- Acesso via login
- Visualização das competições disponíveis
- Submissão de trabalhos
- Visualização dos próprios trabalhos

### Portal do Jurado

- Acesso seguro
- Painel de avaliação
- Visualização dos trabalhos
- Formulário de avaliação
- Acompanhamento das avaliações realizadas

## Plano de Desenvolvimento

### Fase 1: Planejamento e Configuração Inicial

- Definir arquitetura do sistema
- Escolher tecnologias
- Configurar ambiente de desenvolvimento
- Criar estrutura básica do projeto

**Tecnologias Escolhidas:**

- **Frontend**: React.js com Next.js
- **Backend**: Next.js API Routes
- **Banco de Dados**: Supabase (PostgreSQL)
- **Armazenamento**: Supabase Storage
- **Autenticação**: Supabase Auth
- **Hospedagem**: Vercel

### Fase 2: Modelagem do Banco de Dados

**Tabelas Principais:**

1. **Users**

   - id, name, email, password_hash, role (admin, participant, judge)

2. **Competitions**

   - id, name, description, rules, submission_start_date, submission_end_date, judging_start_date, judging_end_date, status

3. **Categories**

   - id, competition_id, name, description, allowed_file_types

4. **Criteria**

   - id, category_id, name, description, scale_min, scale_max

5. **Submissions**

   - id, participant_id, category_id, title, description, file_url, submission_date

6. **Evaluations**

   - id, judge_id, submission_id, criteria_id, score, comments

7. **JudgeAssignments** (opcional)
   - id, judge_id, category_id

### Fase 3: Desenvolvimento do Backend

- Implementar sistema de autenticação e autorização
- Desenvolver APIs para todas as funcionalidades
- Implementar validação de arquivos
- Configurar armazenamento de arquivos

### Fase 4: Desenvolvimento do Frontend

- Criar interfaces para os três tipos de usuários
- Implementar visualizadores para diferentes tipos de mídia
- Desenvolver formulários e dashboards

### Fase 5: Integração e Testes

- Integrar frontend e backend
- Implementar upload e processamento de arquivos
- Testar fluxos completos
- Realizar testes de segurança
- Verificar responsividade

### Fase 6: Refinamento e Recursos Adicionais

- Implementar sistema de notificações
- Melhorar UX/UI
- Otimizar performance
- Adicionar recursos extras

### Fase 7: Implantação e Documentação

- Configurar ambiente de produção
- Implantar aplicação
- Criar documentação para usuários
- Preparar material de treinamento

## Estrutura do Projeto

```
ctrl-day-arena/
├── public/                  # Arquivos estáticos
├── src/
│   ├── components/          # Componentes React reutilizáveis
│   │   ├── admin/           # Componentes da interface de administração
│   │   ├── participant/     # Componentes da interface de participantes
│   │   ├── judge/           # Componentes da interface de jurados
│   │   └── shared/          # Componentes compartilhados
│   ├── pages/               # Páginas Next.js
│   │   ├── api/             # Rotas da API
│   │   ├── admin/           # Páginas de administração
│   │   ├── participant/     # Páginas de participantes
│   │   └── judge/           # Páginas de jurados
│   ├── lib/                 # Funções utilitárias
│   │   ├── supabase.js      # Cliente Supabase
│   │   └── helpers.js       # Funções auxiliares
│   ├── hooks/               # React hooks personalizados
│   ├── styles/              # Estilos CSS/SCSS
│   ├── contexts/            # Contextos React (autenticação, etc.)
│   └── types/               # Definições de tipos (TypeScript)
├── prisma/                  # Esquema do banco de dados (se usar Prisma)
├── .env.local               # Variáveis de ambiente locais
├── next.config.js           # Configuração do Next.js
├── package.json             # Dependências do projeto
└── README.md                # Documentação
```

## Cronograma Estimado

1. **Fase 1 (Planejamento)**: 1-2 dias
2. **Fase 2 (Modelagem do BD)**: 1-2 dias
3. **Fase 3 (Backend)**: 5-7 dias
4. **Fase 4 (Frontend)**: 7-10 dias
5. **Fase 5 (Integração e Testes)**: 3-5 dias
6. **Fase 6 (Refinamento)**: 2-3 dias
7. **Fase 7 (Implantação)**: 1-2 dias

**Tempo total estimado**: 20-30 dias

## Atualizações e Progresso

Esta seção será atualizada conforme o projeto avança.

### [14/05/2025] - Início do Projeto

- Criação da documentação inicial
- Configuração do ambiente de desenvolvimento
- Inicialização do projeto Next.js com TypeScript e Tailwind CSS
- Criação da estrutura básica de diretórios
- Configuração do Supabase (cliente e tipos)
- Criação do script SQL para o banco de dados
- Implementação do contexto de autenticação
- Criação de hooks personalizados para competições e categorias
- Desenvolvimento da página inicial
- Implementação das páginas de login e registro

### [14/05/2025] - Desenvolvimento dos Painéis de Usuário

- Criação do componente de navegação compartilhado (Navbar)
- Implementação do layout e dashboard para administradores
- Implementação do layout e dashboard para participantes
- Implementação do layout e dashboard para jurados
- Configuração das rotas protegidas com verificação de papel do usuário
