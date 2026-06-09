-- Criar usuário admin via auth
SELECT auth.create_user(
  '{"email": "steniodsb@gmail.com", "password": "Solaris2026@!", "email_confirm": true}'::jsonb
);
