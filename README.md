# Ctrl Day Arena

Plataforma para gerenciar competições de arte digital com módulos para administradores, participantes e jurados.

## Sobre o Projeto

O Ctrl Day Arena é uma aplicação web desenvolvida para facilitar a organização, submissão, avaliação e apuração de resultados de competições de arte de forma online e remota. A plataforma permite a criação de competições com diferentes categorias (Pixel Art, Modelo 3D, Cosplay, etc.), submissão de trabalhos pelos participantes e avaliação por jurados.

## Funcionalidades Principais

### Módulo de Administração

- Criação e gerenciamento de competições
- Definição de categorias e critérios de avaliação
- Gerenciamento de usuários (participantes e jurados)
- Monitoramento de submissões
- Apuração e visualização de resultados

### Portal do Participante

- Visualização de competições disponíveis
- Submissão de trabalhos
- Acompanhamento dos próprios trabalhos

### Portal do Jurado

- Visualização de trabalhos para avaliação
- Formulário de avaliação por critérios
- Acompanhamento das avaliações realizadas

## Tecnologias Utilizadas

- **Frontend**: React.js com Next.js
- **Backend**: Next.js API Routes
- **Banco de Dados**: Supabase (PostgreSQL)
- **Autenticação**: Supabase Auth
- **Armazenamento**: Supabase Storage
- **Estilização**: Tailwind CSS
- **Linguagem**: TypeScript

## Instalação e Configuração

### Pré-requisitos

- Node.js (versão 18 ou superior)
- npm ou yarn
- Conta no Supabase

### Passos para Instalação

1. Clone o repositório:

   ```bash
   git clone https://github.com/seu-usuario/ctrl-day-arena.git
   cd ctrl-day-arena
   ```

2. Instale as dependências:

   ```bash
   npm install
   # ou
   yarn install
   ```

3. Configure as variáveis de ambiente:

   - Crie um arquivo `.env.local` na raiz do projeto
   - Copie o conteúdo do arquivo `.env.local.example`
   - Preencha com suas credenciais do Supabase

4. Execute o script SQL no seu projeto Supabase:

   - Acesse o painel do Supabase
   - Vá para a seção SQL Editor
   - Cole o conteúdo do arquivo `supabase.sql`
   - Execute o script

5. Inicie o servidor de desenvolvimento:

   ```bash
   npm run dev
   # ou
   yarn dev
   ```

6. Acesse a aplicação em `http://localhost:3000`

## Estrutura do Projeto

```
ctrl-day-arena/
├── public/                  # Arquivos estáticos
├── src/
│   ├── app/                 # Páginas Next.js (App Router)
│   │   ├── admin/           # Páginas de administração
│   │   ├── participant/     # Páginas de participantes
│   │   ├── judge/           # Páginas de jurados
│   │   └── api/             # Rotas da API
│   ├── components/          # Componentes React reutilizáveis
│   │   ├── admin/           # Componentes da interface de administração
│   │   ├── participant/     # Componentes da interface de participantes
│   │   ├── judge/           # Componentes da interface de jurados
│   │   └── shared/          # Componentes compartilhados
│   ├── lib/                 # Funções utilitárias
│   │   ├── supabase.ts      # Cliente Supabase
│   │   └── helpers.ts       # Funções auxiliares
│   ├── hooks/               # React hooks personalizados
│   ├── contexts/            # Contextos React (autenticação, etc.)
│   └── types/               # Definições de tipos (TypeScript)
├── .env.local.example       # Exemplo de variáveis de ambiente
├── supabase.sql             # Script SQL para configuração do banco de dados
├── doc.md                   # Documentação detalhada do projeto
└── README.md                # Documentação básica
```

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Faça commit das suas alterações (`git commit -m 'Adiciona nova feature'`)
4. Faça push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo LICENSE para mais detalhes.
