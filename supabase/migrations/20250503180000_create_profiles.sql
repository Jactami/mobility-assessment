--
-- Table profiles
-- https://supabase.com/docs/guides/auth/managing-user-data?queryGroups=language&language=js
--
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT "now" () NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  -- email is technically redundant, but useful for queries without a explicit view
  user_role public.user_role DEFAULT 'user'::public.user_role NOT NULL
);

ALTER TABLE public.profiles OWNER TO postgres;

COMMENT ON TABLE public.profiles IS 'Stores user profile data.';

ALTER TABLE ONLY public.profiles
ADD CONSTRAINT profiles_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.profiles
ADD CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users (id) ON UPDATE CASCADE ON DELETE CASCADE;

-- Moddatetime extension
CREATE TRIGGER handle_updated_at_profiles BEFORE
UPDATE ON public.profiles FOR EACH ROW
EXECUTE FUNCTION moddatetime ('updated_at');

-- Ensure that only one user can have the role 'admin'
CREATE UNIQUE INDEX only_one_admin ON public.profiles ((user_role))
WHERE
  user_role = 'admin';