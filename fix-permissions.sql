-- Remover todas as políticas existentes para a tabela users
DROP POLICY IF EXISTS "Usuários podem ver seus próprios dados" ON users;
DROP POLICY IF EXISTS "Administradores podem ver todos os usuários" ON users;
DROP POLICY IF EXISTS "Administradores podem criar usuários" ON users;
DROP POLICY IF EXISTS "Administradores podem atualizar usuários" ON users;
DROP POLICY IF EXISTS "Permitir inserção de novos usuários durante o registro" ON users;

-- Desabilitar RLS temporariamente para a tabela users
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- Conceder permissões completas ao papel anônimo e autenticado
GRANT ALL ON TABLE users TO anon;
GRANT ALL ON TABLE users TO authenticated;

-- Opcional: Reabilitar RLS com políticas mais permissivas
-- ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- CREATE POLICY "Permitir acesso total à tabela users" ON users
--   FOR ALL USING (true);
