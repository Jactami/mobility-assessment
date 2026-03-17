--
-- Table profiles
-- https://supabase.com/docs/guides/auth/managing-user-data?queryGroups=language&language=js
--
CREATE TABLE IF NOT EXISTS public.profiles(
  id uuid NOT NULL,
  created_at timestamp with time zone DEFAULT "now"() NOT NULL,
  updated_at timestamp with time zone,
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  -- email is technically redundant, but useful for queries without a explicit view
  user_role public.user_role DEFAULT 'user'::public.user_role NOT NULL,
  is_disabled boolean NOT NULL DEFAULT FALSE,
  expires_at date -- inclusive expiration date
);

ALTER TABLE public.profiles OWNER TO postgres;

COMMENT ON TABLE public.profiles IS 'Stores user profile data.';

ALTER TABLE ONLY public.profiles
  ADD CONSTRAINT profiles_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.profiles
  ADD CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE;

-- Moddatetime extension
CREATE TRIGGER handle_updated_at_profiles
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION extensions.moddatetime('updated_at');

-- Ensure that only one user can have the role 'admin'
CREATE UNIQUE INDEX only_one_admin ON public.profiles((user_role))
WHERE
  user_role = 'admin';

-- Ensure that admins cannot be disabled or expired
ALTER TABLE public.profiles
  ADD CONSTRAINT admin_cannot_be_disabled_or_expire CHECK (user_role <> 'admin' OR (is_disabled = FALSE AND expires_at IS NULL));

-- Index to optimize queries checking if a user is active
CREATE INDEX idx_profiles_active_check ON public.profiles(id, is_disabled, expires_at);

-- Function to check if the current user is active (not disabled and not expired)
CREATE OR REPLACE FUNCTION public.is_user_active()
  RETURNS boolean
  LANGUAGE sql
  STABLE
  SECURITY DEFINER
  SET search_path = public
  AS $$
  SELECT
    EXISTS(
      SELECT
        1
      FROM
        public.profiles
      WHERE
        id = auth.uid()
        -- Check if user is disabled
        AND is_disabled = FALSE
        -- Check if user is expired
        AND(expires_at IS NULL
          OR expires_at >= CURRENT_DATE));
$$;

COMMENT ON FUNCTION public.is_user_active IS 'Checks if the current user is active (not disabled and not expired).';

