--
-- Create users
--
SELECT public.create_user(user_id => 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', email => 'max@mustermann.de', PASSWORD => 'password');

SELECT public.create_user(user_id => 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', email => 'john@doe.com', PASSWORD => 'password');

--
-- Create projects
--
INSERT INTO projects (id, title, zip_code, city, street, street_number, owner_id) 
VALUES ('00000000-0000-0000-0000-000000000000', 'ERBA', '96049', 'Bamberg', 'An der Weberei', '5', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa');   

INSERT INTO projects (id, title, zip_code, city, street, street_number, owner_id) 
VALUES ('11111111-1111-1111-1111-111111111111', 'Feki', '96052', 'Bamberg', 'Feldkirchenstraße', '21', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa');   

INSERT INTO projects (id, title, zip_code, city, street, street_number, owner_id) 
VALUES ('33333333-3333-3333-3333-333333333333', 'Austraße', '96047 ', 'Bamberg', 'Austraße', '37', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb');   