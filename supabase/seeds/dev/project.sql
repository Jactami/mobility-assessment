--
-- Create projects
--
INSERT INTO public.projects(id, title, favorite, country, postcode, city, street, housenumber, owner_id, latitude, longitude, radius, score)
  VALUES ('00000000-0000-0000-0000-000000000000', 'ERBA', TRUE, 'Deutschland', '96047', 'Bamberg', 'An der Weberei', '5', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 49.9031251, 10.8696332, 1000, 0.63);

INSERT INTO public.projects(id, title, country, postcode, city, street, housenumber, owner_id, latitude, longitude, radius, score)
  VALUES ('11111111-1111-1111-1111-111111111111', 'Feki', 'Deutschland', '96052', 'Bamberg', 'Feldkirchenstraße', '21', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 49.9073867, 10.9042038, 1000, 0.74);

INSERT INTO public.projects(id, title, country, postcode, city, street, housenumber, owner_id, latitude, longitude)
  VALUES ('33333333-3333-3333-3333-333333333333', 'Leeres Projekt', 'Deutschland', '96047 ', 'Bamberg', 'Austraße', '37', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 49.8935324, 10.8870821);

