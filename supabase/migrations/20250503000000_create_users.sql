--
-- Create new users
--
CREATE OR REPLACE FUNCTION public.create_user(first_name text, last_name text, email text, PASSWORD text, user_role public.user_role DEFAULT 'user', is_disabled boolean DEFAULT FALSE, expires_at timestamp with time zone DEFAULT NULL, user_id uuid DEFAULT NULL)
    RETURNS public.profiles
    SECURITY DEFINER
    SET search_path = public, auth
    AS $$
DECLARE
    encrypted_pw text;
    confirmation timestamp;
    new_profile public.profiles;
BEGIN
    IF user_id IS NULL THEN
        user_id := gen_random_uuid();
    END IF;
    encrypted_pw := extensions.crypt(PASSWORD, extensions.gen_salt('bf'));
    confirmation := now();
    -- Insert into auth.users
    INSERT INTO auth.users(instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, recovery_sent_at, last_sign_in_at, confirmation_sent_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token)
        VALUES ('00000000-0000-0000-0000-000000000000', user_id, 'authenticated', 'authenticated', email, encrypted_pw, confirmation, confirmation, confirmation, confirmation, '{}', '{}', now(), now(), '', '', '', '');
    -- Insert into auth.identities
    INSERT INTO auth.identities(provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
        VALUES (gen_random_uuid(), user_id, format('{"sub":"%s","email":"%s"}', user_id::text, email)::jsonb, 'email', now(), now(), now());
    -- Insert into public.profiles
    INSERT INTO public.profiles(id, first_name, last_name, email, user_role, is_disabled, expires_at)
        VALUES (user_id, first_name, last_name, email, user_role, is_disabled, expires_at)
    RETURNING
        * INTO new_profile;
    -- Return the new profile
    RETURN new_profile;
END;
$$
LANGUAGE plpgsql;

COMMENT ON FUNCTION public.create_user IS 'Creates a new user.';

