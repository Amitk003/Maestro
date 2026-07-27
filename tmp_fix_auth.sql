UPDATE auth.users SET confirmed_at = email_confirmed_at, raw_app_meta_data = '{"provider":"email","providers":["email"]}'::jsonb WHERE email = 'test@maestro.demo';
