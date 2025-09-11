--
-- Create admin user
-- TODO: Manually change this password in production on first login!!!
--
SELECT
  public.create_user(first_name => 'App', last_name => 'Admin', email => 'admin@example.com', PASSWORD => 'admin', user_role => 'admin'::public.user_role);

