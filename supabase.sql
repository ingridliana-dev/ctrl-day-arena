-- Criação das tabelas para o projeto ctrl day arena

-- Tabela de usuários (estende a tabela auth.users do Supabase)
CREATE TABLE users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'participant', 'judge')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de competições
CREATE TABLE competitions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  rules TEXT,
  submission_start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  submission_end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  judging_start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  judging_end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('draft', 'active', 'judging', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de categorias
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  competition_id UUID REFERENCES competitions(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  allowed_file_types TEXT[] NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de critérios de avaliação
CREATE TABLE criteria (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  scale_min INTEGER NOT NULL,
  scale_max INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de submissões
CREATE TABLE submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  participant_id UUID REFERENCES users(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT NOT NULL,
  submission_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de avaliações
CREATE TABLE evaluations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  judge_id UUID REFERENCES users(id) ON DELETE CASCADE,
  submission_id UUID REFERENCES submissions(id) ON DELETE CASCADE,
  criteria_id UUID REFERENCES criteria(id) ON DELETE CASCADE,
  score INTEGER NOT NULL,
  comments TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de atribuições de jurados (opcional)
CREATE TABLE judge_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  judge_id UUID REFERENCES users(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (judge_id, category_id)
);

-- Políticas de segurança (RLS - Row Level Security)

-- Habilitar RLS em todas as tabelas
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE competitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE criteria ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE judge_assignments ENABLE ROW LEVEL SECURITY;

-- Políticas para usuários
CREATE POLICY "Usuários podem ver seus próprios dados" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Administradores podem ver todos os usuários" ON users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Administradores podem criar usuários" ON users
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Administradores podem atualizar usuários" ON users
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Políticas para competições
CREATE POLICY "Todos podem ver competições" ON competitions
  FOR SELECT USING (true);

CREATE POLICY "Administradores podem gerenciar competições" ON competitions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Políticas para categorias
CREATE POLICY "Todos podem ver categorias" ON categories
  FOR SELECT USING (true);

CREATE POLICY "Administradores podem gerenciar categorias" ON categories
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Políticas para critérios
CREATE POLICY "Todos podem ver critérios" ON criteria
  FOR SELECT USING (true);

CREATE POLICY "Administradores podem gerenciar critérios" ON criteria
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Políticas para submissões
CREATE POLICY "Participantes podem ver suas próprias submissões" ON submissions
  FOR SELECT USING (auth.uid() = participant_id);

CREATE POLICY "Administradores podem ver todas as submissões" ON submissions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Jurados podem ver submissões das categorias atribuídas" ON submissions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'judge'
      AND EXISTS (
        SELECT 1 FROM judge_assignments
        WHERE judge_id = auth.uid() AND category_id = submissions.category_id
      )
    )
  );

CREATE POLICY "Participantes podem criar suas próprias submissões" ON submissions
  FOR INSERT WITH CHECK (
    auth.uid() = participant_id AND
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'participant'
    )
  );

-- Políticas para avaliações
CREATE POLICY "Jurados podem criar e ver suas próprias avaliações" ON evaluations
  FOR ALL USING (
    auth.uid() = judge_id AND
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'judge'
    )
  );

CREATE POLICY "Administradores podem ver todas as avaliações" ON evaluations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Políticas para atribuições de jurados
CREATE POLICY "Jurados podem ver suas próprias atribuições" ON judge_assignments
  FOR SELECT USING (
    auth.uid() = judge_id
  );

CREATE POLICY "Administradores podem gerenciar atribuições de jurados" ON judge_assignments
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Funções e gatilhos

-- Função para calcular a média das avaliações de uma submissão
CREATE OR REPLACE FUNCTION get_submission_average_score(submission_uuid UUID)
RETURNS DECIMAL AS $$
DECLARE
  avg_score DECIMAL;
BEGIN
  SELECT AVG(score)::DECIMAL INTO avg_score
  FROM evaluations
  WHERE submission_id = submission_uuid;
  
  RETURN COALESCE(avg_score, 0);
END;
$$ LANGUAGE plpgsql;
