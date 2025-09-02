--
-- Create admin user 
-- TODO: Manually change this password in production on first login!!!
--
SELECT
  create_user (
    'App', -- First Name
    'Admin', -- Last Name
    'admin@example.com', -- Email
    'admin', -- Password
    'admin'::public.user_role,
    NULL
  );