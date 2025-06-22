--
-- Function create_user
--
CREATE OR REPLACE FUNCTION public.create_user(
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    email VARCHAR(100),
    PASSWORD VARCHAR(100),
    user_role public.user_role DEFAULT 'user',
    user_id UUID DEFAULT NULL
)
RETURNS uuid
SECURITY DEFINER
AS $$
DECLARE
    encrypted_pw VARCHAR(255);
    confirmation timestamp;
BEGIN
    IF user_id IS NULL THEN
        user_id := gen_random_uuid();
    END IF;

    encrypted_pw := crypt(PASSWORD, gen_salt('bf'));
    confirmation := now();

    -- Insert into auth.users
    INSERT INTO auth.users(
        instance_id, id, aud, ROLE, email, encrypted_password, 
        email_confirmed_at, recovery_sent_at, last_sign_in_at, 
        confirmation_sent_at, raw_app_meta_data, raw_user_meta_data, 
        created_at, updated_at, confirmation_token, email_change, 
        email_change_token_new, recovery_token
    )
    VALUES (
        '00000000-0000-0000-0000-000000000000', user_id, 'authenticated', 'authenticated', 
        email, encrypted_pw, confirmation, confirmation, confirmation, confirmation,
        '{}', '{}', now(), now(), '', '', '', ''
    );

    -- Insert into auth.identities
    INSERT INTO auth.identities(
        provider_id, user_id, identity_data, provider, 
        last_sign_in_at, created_at, updated_at
    )
    VALUES (
        gen_random_uuid(), user_id, 
        format('{"sub":"%s","email":"%s"}', user_id::text, email)::jsonb, 
        'email', now(), now(), now()
    );

    -- Insert directly into public.profiles
    INSERT INTO public.profiles(
        id, first_name, last_name, user_role
    )
    VALUES (
        user_id, first_name, last_name, user_role
    );

    RETURN user_id;
END;
$$
LANGUAGE plpgsql;

COMMENT ON FUNCTION public.create_user IS 'Helper function to add users during development.';