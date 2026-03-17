CREATE TYPE osm_type AS ENUM(
  'node',
  'way',
  'relation'
);

--
-- Table projects
--
-- TODO: Decide whether to store geometry as well
--
CREATE TABLE IF NOT EXISTS public.pois(
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  created_at timestamp with time zone DEFAULT "now"() NOT NULL,
  updated_at timestamp with time zone,
  project_id uuid NOT NULL,
  osm_id bigint NOT NULL,
  osm_type osm_type NOT NULL,
  label text,
  category text NOT NULL,
  latitude decimal(9, 7) NOT NULL,
  longitude decimal(9, 7) NOT NULL,
  footway jsonb, -- use json because supabase doesn't support nested arrays even though postgres does
  -- footway decimal[][]
  distance decimal(10, 2) NOT NULL
);

ALTER TABLE public.pois OWNER TO postgres;

COMMENT ON TABLE public.pois IS 'Stores point of interest data.';

ALTER TABLE ONLY public.pois
  ADD CONSTRAINT pois_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.pois
  ADD CONSTRAINT pois_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id) ON UPDATE CASCADE ON DELETE CASCADE;

CREATE INDEX pois_project_id_idx ON pois(project_id);

-- Moddatetime extension
CREATE TRIGGER handle_updated_at_pois
  BEFORE UPDATE ON public.pois
  FOR EACH ROW
  EXECUTE FUNCTION extensions.moddatetime('updated_at');

