--
-- Create users
--
SELECT
  public.create_user(user_id => 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', first_name => 'Max', last_name => 'Mustermann', email => 'max@mustermann.de', PASSWORD => 'password');

SELECT
  public.create_user(user_id => 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', first_name => 'John', last_name => 'Doe', email => 'john@doe.com', PASSWORD => 'password');

