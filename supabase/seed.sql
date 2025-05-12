--
-- Create users
--
SELECT public.create_user(email => 'max@mustermann.de', PASSWORD => 'password');

--
-- Create projects
--
INSERT INTO projects (id, title, zip_code, city, street, street_number, owner_id) 
VALUES ('00000000-0000-0000-0000-000000000000', 'ERBA', '96049', 'Bamberg', 'An der Weberei', '5', (
    SELECT id FROM auth.users WHERE email = 'max@mustermann.de'
));   

INSERT INTO projects (id, title, zip_code, city, street, street_number, owner_id) 
VALUES ('11111111-1111-1111-1111-111111111111', 'Feki', '96052', 'Bamberg', 'Feldkirchenstraße', '21', (
    SELECT id FROM auth.users WHERE email = 'max@mustermann.de'
));   