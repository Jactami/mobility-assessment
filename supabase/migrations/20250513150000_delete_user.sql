--
-- Function delete_user
--
CREATE
OR REPLACE FUNCTION public.delete_user(target_user_id UUID) RETURNS VOID AS $ $ BEGIN
DELETE FROM
    auth.identities
WHERE
    user_id = target_user_id;

DELETE FROM
    public.profiles
WHERE
    id = target_user_id;

DELETE FROM
    auth.users
WHERE
    id = target_user_id;

END;

$ $ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.delete_user IS 'Deletes a user and all associated data from the auth and public schemas.';