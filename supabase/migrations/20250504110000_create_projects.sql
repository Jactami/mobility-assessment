--
-- Table projects
--
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID DEFAULT gen_random_uuid() NOT NULL,
    title TEXT NOT NULL
);

ALTER TABLE public.projects OWNER TO postgres;

COMMENT ON TABLE public.projects IS 'Stores project data.';

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_pkey PRIMARY KEY (id);
