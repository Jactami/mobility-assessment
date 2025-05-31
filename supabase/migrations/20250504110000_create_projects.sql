--
-- Table projects
--
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID DEFAULT gen_random_uuid() NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT "now"() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE,
    owner_id UUID NOT NULL,
    title VARCHAR(100) NOT NULL,
    latitude DECIMAL(9,6),
    longitude DECIMAL(9,6),
    country VARCHAR(100),
    zip_code VARCHAR(5),
    city VARCHAR(100),
    street VARCHAR(100),
    street_number VARCHAR(10),
    radius INTEGER DEFAULT 1000
);

ALTER TABLE public.projects OWNER TO postgres;

COMMENT ON TABLE public.projects IS 'Stores project data.';

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE;

-- Moddatetime extension
CREATE TRIGGER handle_updated_at_projects
    BEFORE UPDATE ON public.projects
    FOR EACH ROW
    EXECUTE FUNCTION moddatetime('updated_at');

-- RLS
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read their own projects." ON public.projects FOR SELECT
TO authenticated
USING ((SELECT auth.uid()) = owner_id);

CREATE POLICY "Authenticated users can insert their own projects." ON public.projects FOR INSERT
TO authenticated
WITH CHECK ((SELECT auth.uid()) = owner_id);

CREATE POLICY "Authenticated users can update their own projects." ON public.projects FOR UPDATE
TO authenticated
USING ((SELECT auth.uid()) = owner_id);

CREATE POLICY "Authenticated users can delete their own projects." ON public.projects FOR DELETE
TO authenticated
USING ((SELECT auth.uid()) = owner_id);

REVOKE ALL ON TABLE public.projects FROM anon;

GRANT ALL ON TABLE public.projects TO authenticated;

GRANT ALL ON TABLE public.projects TO service_role;