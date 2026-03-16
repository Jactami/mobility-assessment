--
-- Delete users
--
CREATE OR REPLACE FUNCTION public.delete_user(target_user_id uuid)
    RETURNS VOID
    SECURITY DEFINER
    SET search_path = public, auth
    AS $$
BEGIN
    DELETE FROM auth.identities
    WHERE user_id = target_user_id;
    DELETE FROM public.profiles
    WHERE id = target_user_id;
    DELETE FROM auth.users
    WHERE id = target_user_id;
END;
$$
LANGUAGE plpgsql;

COMMENT ON FUNCTION public.delete_user IS 'Deletes a user and all associated data.';

