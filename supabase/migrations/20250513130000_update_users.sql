--
-- Function update_user
--
CREATE OR REPLACE FUNCTION PUBLIC.update_user (
  target_user_id UUID,
  new_first_name VARCHAR(100) DEFAULT NULL,
  new_last_name VARCHAR(100) DEFAULT NULL,
  new_email VARCHAR(100) DEFAULT NULL,
  new_password VARCHAR(100) DEFAULT NULL
) RETURNS VOID SECURITY DEFINER AS $$ DECLARE encrypted_pw VARCHAR(255);

BEGIN -- Update auth.users (email and password if provided)
IF new_password IS NOT NULL THEN encrypted_pw := crypt(new_password, gen_salt('bf'));

UPDATE
    auth.users
SET
    encrypted_password = encrypted_pw,
    email = COALESCE(new_email, auth.users.email),
    email_confirmed_at = NOW(),
    updated_at = NOW()
WHERE
    id = target_user_id;

ELSE
UPDATE
    auth.users
SET
    email = COALESCE(new_email, auth.users.email),
    email_confirmed_at = NOW(),
    updated_at = NOW()
WHERE
    id = target_user_id;

END IF;

-- Update auth.identities email in identity_data JSON
IF new_email IS NOT NULL THEN
UPDATE
    auth.identities
SET
    identity_data = jsonb_set(identity_data, '{email}', to_jsonb(new_email)),
    updated_at = NOW()
WHERE
    user_id = target_user_id
    AND provider = 'email';

END IF;

-- Update public.profiles
UPDATE
    PUBLIC.profiles
SET
    first_name = COALESCE(new_first_name, PUBLIC.profiles.first_name),
    last_name = COALESCE(new_last_name, PUBLIC.profiles.last_name),
    email = COALESCE(new_email, PUBLIC.profiles.email)
WHERE
    id = target_user_id;

END;

$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION PUBLIC.update_user IS 'Updates user fields across auth.users, auth.identities, and public.profiles, except role.';