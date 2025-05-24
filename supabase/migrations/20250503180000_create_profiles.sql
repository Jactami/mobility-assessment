--
-- Table profiles
-- https://supabase.com/docs/guides/auth/managing-user-data?queryGroups=language&language=js
--
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT "now"() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL
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
    EXECUTE FUNCTION moddatetime('updated_at');

-- RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read their own profiles." ON public.profiles FOR SELECT
TO authenticated
USING ((SELECT auth.uid()) = id);

CREATE POLICY "Authenticated users can insert their own profiles." ON public.profiles FOR INSERT
TO authenticated
WITH CHECK ((SELECT auth.uid()) = id);

CREATE POLICY "Authenticated users can update their own profiles." ON public.profiles FOR UPDATE
TO authenticated
USING ((SELECT auth.uid()) = id);

CREATE POLICY "Authenticated users can delete their own profiles." ON public.profiles FOR DELETE
TO authenticated
USING ((SELECT auth.uid()) = id);

REVOKE ALL ON TABLE public.profiles FROM anon;

GRANT ALL ON TABLE public.profiles TO authenticated;

GRANT ALL ON TABLE public.profiles TO service_role;

-- Inserts a row into public.profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
    RETURNS trigger
    LANGUAGE plpgsql
    SECURITY definer SET search_path = ''
    AS $$
BEGIN
    INSERT INTO public.profiles (id, first_name, last_name)
    VALUES (new.id, new.raw_user_meta_data ->> 'first_name', new.raw_user_meta_data ->> 'last_name');
    RETURN new;
END;
$$;

-- Trigger the function every time a user is created
CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();