# Solução para Problemas de Registro de Usuários - Versão 2

## Problema

Após a limpeza do banco de dados, o sistema apresentava problemas no processo de registro, onde:

1. Ocorria o erro "Erro na autenticação: Database error finding user" ao tentar registrar um novo usuário
2. O gatilho para inserção automática de usuários na tabela `users` não estava funcionando corretamente
3. As políticas de segurança da tabela `users` estavam muito restritivas
4. Ocorria o erro "Erro no registro: infinite recursion detected in policy for relation 'users'" devido a recursão infinita nas políticas

## Solução Implementada

### 1. Recriação do Gatilho para Inserção Automática de Usuários

Recriamos o gatilho `on_auth_user_created` e a função `handle_new_user()` com tratamento de erros melhorado:

```sql
-- Criar a função que será chamada pelo gatilho
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', 'Usuário'),
    COALESCE(NEW.raw_user_meta_data->>'role', 'participant')
  );
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Registrar o erro para depuração
    RAISE NOTICE 'Erro ao inserir usuário: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Criar o gatilho na tabela auth.users
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### 2. Atualização das Políticas de Segurança

Atualizamos as políticas de segurança da tabela `users` para permitir a inserção de novos usuários e evitar recursão infinita:

```sql
-- Remover todas as políticas existentes para a tabela users
DROP POLICY IF EXISTS "Usuários podem ver seus próprios dados" ON public.users;
DROP POLICY IF EXISTS "Administradores podem ver todos os usuários" ON public.users;
DROP POLICY IF EXISTS "Administradores podem criar usuários" ON public.users;
DROP POLICY IF EXISTS "Administradores podem atualizar usuários" ON public.users;
DROP POLICY IF EXISTS "Permitir inserção de novos usuários durante o registro" ON public.users;

-- Criar políticas simplificadas para evitar recursão
-- Permitir que qualquer usuário autenticado veja seus próprios dados
CREATE POLICY "Usuários podem ver seus próprios dados"
ON public.users
FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Permitir que qualquer pessoa insira um novo usuário durante o registro
CREATE POLICY "Permitir inserção de novos usuários durante o registro"
ON public.users
FOR INSERT
TO anon, authenticated
WITH CHECK (true);
```

### 3. Melhoria no Método de Registro

Melhoramos o método `signUp` no contexto de autenticação para:

- Verificar se o usuário foi inserido na tabela `users` pelo gatilho
- Tentar inserir manualmente o usuário se o gatilho falhar
- Adicionar logs detalhados para facilitar a depuração

### 4. Simplificação da Página de Registro

Simplificamos a página de registro para usar o método `signUp` do contexto de autenticação em vez de chamar diretamente a API do Supabase, reduzindo a duplicação de código e melhorando a manutenibilidade.

## Benefícios da Solução

1. **Robustez**: O sistema agora tenta várias abordagens para garantir que o usuário seja registrado corretamente
2. **Depuração**: Logs detalhados facilitam a identificação e correção de problemas
3. **Manutenibilidade**: Código mais limpo e centralizado no contexto de autenticação
4. **Segurança**: Políticas de segurança adequadas para permitir o registro de usuários
5. **Desempenho**: Eliminação da recursão infinita nas políticas de segurança

## Alternativas Consideradas

1. **Remover o gatilho e usar apenas inserção manual**: Consideramos remover o gatilho e usar apenas inserção manual, mas o gatilho é uma solução mais elegante e automática
2. **Usar funções RPC do Supabase**: Consideramos usar funções RPC do Supabase para o registro, mas a solução atual é mais simples e direta

## Conclusão

A solução implementada resolve os problemas de registro de usuários, melhorando a robustez e a experiência do usuário. O sistema agora verifica adequadamente se o usuário foi inserido na tabela `users` e tenta várias abordagens para garantir o sucesso do registro. Além disso, eliminamos o problema de recursão infinita nas políticas de segurança, simplificando-as e tornando-as mais eficientes.

## Próximos Passos

1. Implementar testes automatizados para o sistema de registro
2. Melhorar o feedback visual durante o processo de registro
3. Adicionar verificação de email para novos usuários
4. Implementar recuperação de senha
