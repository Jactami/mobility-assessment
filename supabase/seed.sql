--
-- Create users
--
SELECT public.create_user(
    user_id => 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 
    email => 'max@mustermann.de', 
    password => 'password', 
    metadata => '{"first_name": "Max", "last_name": "Mustermann"}'
);

SELECT public.create_user(
    user_id => 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 
    email => 'john@doe.com', 
    password => 'password',
    metadata => '{"first_name": "John", "last_name": "Doe"}'
);

--
-- Create projects
--
INSERT INTO projects (id, title, country, postcode, city, street, housenumber, owner_id, latitude, longitude, radius)
VALUES (
    '00000000-0000-0000-0000-000000000000',
    'ERBA',
    'Deutschland',
    '96047',
    'Bamberg', 
    'An der Weberei', 
    '5', 
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 
    49.9031251,
    10.8696332,
    1000
);

INSERT INTO projects (id, title, country, postcode, city, street, housenumber, owner_id, latitude, longitude, radius)
VALUES (
    '11111111-1111-1111-1111-111111111111',
    'Feki',
    'Deutschland',
    '96052',
    'Bamberg',
    'Feldkirchenstraße',
    '21', 
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    49.9073867,
    10.9042038,
    2000
);   

INSERT INTO projects (id, title, country, postcode, city, street, housenumber, owner_id, latitude, longitude, radius) 
VALUES (
    '33333333-3333-3333-3333-333333333333', 
    'Austraße', 
    'Deutschland',
    '96047 ', 
    'Bamberg', 
    'Austraße', 
    '37', 
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    49.8935324,
    10.8870821,
    1000
);   