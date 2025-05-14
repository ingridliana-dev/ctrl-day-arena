# Solução para o Problema de Registro de Usuários

## Problema

Ao registrar um novo usuário, o sistema estava criando o usuário na autenticação do Supabase, mas não estava conseguindo inserir os dados na tabela `users` devido a problemas de permissão.

## Solução Implementada

### 1. Criação de um Gatilho no Banco de Dados

Criamos um gatilho (trigger) no banco de dados que monitora a tabela `auth.users` e automaticamente insere um registro na tabela `public.users` quando um novo usuário é criado.

```sql
-- Criar função para lidar com novos usuários
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
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Criar gatilho que é acionado após a inserção de um novo usuário
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### 2. Melhoria na Página de Registro

Modificamos a página de registro para:

1. Aguardar um tempo após o registro para dar tempo ao gatilho de inserir o usuário
2. Verificar se o usuário foi inserido na tabela `users` pelo gatilho
3. Tentar inserir manualmente se o gatilho não funcionou
4. Redirecionar para a página de login após o registro bem-sucedido

## Benefícios da Solução

1. **Robustez**: Mesmo que a inserção direta falhe devido a problemas de permissão, o gatilho ainda funcionará porque é executado com privilégios elevados (`SECURITY DEFINER`).
2. **Consistência**: Garante que todos os usuários registrados na autenticação também sejam inseridos na tabela `users`.
3. **Experiência do Usuário**: O usuário é redirecionado para a página de login após o registro bem-sucedido, em vez de ficar preso na tela de "Registrando...".

## Alternativas Consideradas

1. **Desabilitar RLS (Row Level Security)**: Isso resolveria o problema, mas comprometeria a segurança do banco de dados.
2. **Criar Políticas de Permissão**: Poderíamos criar políticas específicas para permitir a inserção de novos usuários, mas o gatilho é uma solução mais robusta.

## Conclusão

A solução implementada resolve o problema de registro de usuários de forma robusta e segura, garantindo que todos os usuários registrados na autenticação também sejam inseridos na tabela `users`.
