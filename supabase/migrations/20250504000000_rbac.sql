--
-- Custom claims and role-based access control (RBAC) for Supabase
-- https://supabase.com/docs/guides/database/postgres/custom-claims-and-role-based-access-control-rbac
-- https://supabase.com/docs/guides/auth/auth-hooks#local-development
--
GRANT USAGE ON SCHEMA public TO supabase_auth_admin;

GRANT ALL ON TABLE public.profiles TO supabase_auth_admin;

REVOKE ALL ON TABLE public.profiles FROM authenticated, anon, public;

CREATE POLICY "Allow auth admin to read user profiles" ON public.profiles AS PERMISSIVE
    FOR SELECT TO supabase_auth_admin
        USING (TRUE);

--
-- Auth hook function
--
CREATE OR REPLACE FUNCTION public.custom_access_token_hook(event jsonb)
    RETURNS jsonb STABLE
    AS $$
DECLARE
    claims jsonb;
    ROLE public.user_role;
BEGIN
    -- Fetch the user role from the profiles table
    SELECT
        user_role INTO ROLE
    FROM
        public.profiles
    WHERE
        id =(event ->> 'user_id')::uuid;
    claims := event -> 'claims';
    IF ROLE IS NOT NULL THEN
        -- Set the claim
        claims := jsonb_set(claims, '{user_role}', TO_JSONB(ROLE));
    ELSE
        claims := jsonb_set(claims, '{user_role}', 'null');
    END IF;
    -- Update the 'claims' object in the original event
    event := jsonb_set(event, '{claims}', claims);
    -- Return the modified or original event
    RETURN event;
END;
$$
LANGUAGE plpgsql
SET search_path = '';

GRANT EXECUTE ON FUNCTION public.custom_access_token_hook TO supabase_auth_admin;

REVOKE EXECUTE ON FUNCTION public.custom_access_token_hook FROM authenticated, anon, public;

--
-- Create function to read user role from JWT
--
CREATE OR REPLACE FUNCTION public.authorize(requested_role public.user_role)
    RETURNS boolean
    AS $$
DECLARE
    user_role public.user_role;
BEGIN
    -- Fetch user role once from the JWT to reduce repeated calls
    SELECT
        (AUTH.JWT() ->> 'user_role')::public.user_role INTO user_role;
    RETURN user_role = requested_role;
END;
$$
LANGUAGE PLPGSQL
STABLE
SECURITY DEFINER SET search_path = '';

