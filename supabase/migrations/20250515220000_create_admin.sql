--
-- Create admin user 
--
SELECT create_user(
    'Admin',
    'BGW',
    'admin@bgw24.local',
    'admin', -- TODO: change this password in production after the first login!
    'admin'::public.user_role,
    NULL
);
