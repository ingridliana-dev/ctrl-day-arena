-- Adicionar política para permitir a inserção de novos usuários durante o registro
CREATE POLICY "Permitir inserção de novos usuários durante o registro" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Ou, se preferir substituir a política existente:
-- DROP POLICY "Administradores podem criar usuários" ON users;
-- CREATE POLICY "Qualquer pessoa pode inserir seu próprio registro" ON users
--   FOR INSERT WITH CHECK (auth.uid() = id);
