--
-- Table profiles
-- https://supabase.com/docs/guides/auth/managing-user-data?queryGroups=language&language=js
--
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT "now"() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    user_role public.user_role DEFAULT 'user'::public.user_role NOT NULL
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

-- Inserts a row into public.profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
    RETURNS trigger
    LANGUAGE plpgsql
    SECURITY definer SET search_path = ''
    AS $$
BEGIN
    INSERT INTO public.profiles (id, first_name, last_name, user_role)
    VALUES (
        new.id, new.raw_user_meta_data ->> 'first_name', 
        new.raw_user_meta_data ->> 'last_name',
        (new.raw_user_meta_data ->> 'user_role')::public.user_role
    );
    RETURN new;
END;
$$;

-- Trigger the function every time a user is created
CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Ensure that only one user can have the role 'admin'
CREATE UNIQUE INDEX only_one_admin
ON public.profiles ((user_role))
WHERE user_role = 'admin';

