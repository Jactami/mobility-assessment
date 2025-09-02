--
-- Custom claims and role-based access control (RBAC) for Supabase
-- https://supabase.com/docs/guides/database/postgres/custom-claims-and-role-based-access-control-rbac
-- https://supabase.com/docs/guides/auth/auth-hooks#local-development
--
GRANT USAGE ON SCHEMA PUBLIC TO supabase_auth_admin;

GRANT ALL ON TABLE PUBLIC.profiles TO supabase_auth_admin;

REVOKE ALL ON TABLE PUBLIC.profiles
FROM
  authenticated,
  anon,
  PUBLIC;

CREATE POLICY "Allow auth admin to read user profiles" ON PUBLIC.profiles AS PERMISSIVE FOR
SELECT
  TO supabase_auth_admin USING (TRUE);

--
-- Auth hook function
--
CREATE OR REPLACE FUNCTION PUBLIC.custom_access_token_hook (event JSONB) RETURNS JSONB STABLE AS $$
DECLARE
	claims JSONB;

role PUBLIC .user_role;

BEGIN
	-- Fetch the user role from the profiles table
	SELECT
		user_role INTO role
	FROM
		PUBLIC .profiles
	WHERE
		id = (event ->> 'user_id') :: UUID;

claims := event -> 'claims';

IF role IS NOT NULL THEN -- Set the claim
claims := JSONB_SET(claims, '{user_role}', TO_JSONB(role));

ELSE claims := JSONB_SET(claims, '{user_role}', 'null');

END IF;

-- Update the 'claims' object in the original event
event := JSONB_SET(event, '{claims}', claims);

-- Return the modified or original event
RETURN event;

END;

$$ LANGUAGE plpgsql
SET
  search_path = '';

GRANT
EXECUTE ON FUNCTION PUBLIC.custom_access_token_hook TO supabase_auth_admin;

REVOKE
EXECUTE ON FUNCTION PUBLIC.custom_access_token_hook
FROM
  authenticated,
  anon,
  PUBLIC;

--
-- Create function to read user role from JWT
--
CREATE OR REPLACE FUNCTION PUBLIC.authorize (requested_role PUBLIC.user_role) RETURNS BOOLEAN AS $$
DECLARE
	user_role PUBLIC .user_role;

BEGIN
	-- Fetch user role once from the JWT to reduce repeated calls
	SELECT
		(AUTH.JWT() ->> 'user_role') :: PUBLIC .user_role INTO user_role;

RETURN user_role = requested_role;

END;

$$ LANGUAGE PLPGSQL STABLE SECURITY DEFINER
SET
  search_path = '';