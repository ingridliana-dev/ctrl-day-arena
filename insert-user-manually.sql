-- Substitua o ID pelo ID do usuário que você vê na seção Authentication > Users
INSERT INTO public.users (id, email, name, role)
VALUES (
  '3d8b4c0c-eee9-64d4-9c2da9f5d5f5', -- Substitua pelo ID real do usuário
  'profkirana@gmail.com', -- Substitua pelo email real do usuário
  'kirana', -- Substitua pelo nome real do usuário
  'participant' -- Ou 'admin' ou 'judge', dependendo do papel desejado
);
