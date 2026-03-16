--
-- Delete users
--
CREATE OR REPLACE FUNCTION public.delete_user(target_user_id uuid)
    RETURNS public.profiles
    SECURITY DEFINER
    SET search_path = public, auth
    AS $$
DECLARE
    deleted_profile public.profiles;
BEGIN
    -- Store profile before deleting
    SELECT
        * INTO deleted_profile
    FROM
        public.profiles
    WHERE
        id = target_user_id;
    -- Delete from identities
    DELETE FROM auth.identities
    WHERE user_id = target_user_id;
    -- Delete from profiles
    DELETE FROM public.profiles
    WHERE id = target_user_id;
    -- Delete from users
    DELETE FROM auth.users
    WHERE id = target_user_id;
    -- Return the deleted profile
    RETURN deleted_profile;
END;
$$
LANGUAGE plpgsql;

COMMENT ON FUNCTION public.delete_user IS 'Deletes a user and all associated data.';

