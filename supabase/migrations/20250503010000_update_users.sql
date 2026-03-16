--
-- Update existing users
--
CREATE OR REPLACE FUNCTION public.update_user(target_user_id uuid, new_first_name text DEFAULT NULL, new_last_name text DEFAULT NULL, new_email text DEFAULT NULL, new_password text DEFAULT NULL, new_is_disabled boolean DEFAULT NULL, new_expires_at date DEFAULT NULL)
    RETURNS VOID
    SECURITY DEFINER
    SET search_path = public, auth
    AS $$
DECLARE
    encrypted_pw text;
BEGIN
    -- Update auth.users (email and password if provided)
    IF new_password IS NOT NULL THEN
        encrypted_pw := extensions.crypt(new_password, extensions.gen_salt('bf'));
        UPDATE
            auth.users
        SET
            encrypted_password = encrypted_pw,
            email = coalesce(new_email, auth.users.email),
            email_confirmed_at = now(),
            updated_at = now()
        WHERE
            id = target_user_id;
    ELSE
        UPDATE
            auth.users
        SET
            email = coalesce(new_email, auth.users.email),
            email_confirmed_at = now(),
            updated_at = now()
        WHERE
            id = target_user_id;
    END IF;
    -- Update auth.identities email in identity_data JSON
    IF new_email IS NOT NULL THEN
        UPDATE
            auth.identities
        SET
            identity_data = jsonb_set(identity_data, '{email}', to_jsonb(new_email)),
            updated_at = now()
        WHERE
            user_id = target_user_id
            AND provider = 'email';
    END IF;
    -- Update public.profiles
    UPDATE
        public.profiles
    SET
        first_name = coalesce(new_first_name, public.profiles.first_name),
        last_name = coalesce(new_last_name, public.profiles.last_name),
        email = coalesce(new_email, public.profiles.email),
        is_disabled = new_is_disabled,
        expires_at = new_expires_at
    WHERE
        id = target_user_id;
END;
$$
LANGUAGE plpgsql;

COMMENT ON FUNCTION public.update_user IS 'Updates an existing user.';

