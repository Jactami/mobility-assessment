CREATE TYPE osm_type AS ENUM(
  'node',
  'way',
  'relation'
);

--
-- Table projects
--
CREATE TABLE IF NOT EXISTS public.pois(
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  created_at timestamp with time zone DEFAULT "now"() NOT NULL,
  updated_at timestamp with time zone,
  project_id uuid NOT NULL,
  osm_id bigint NOT NULL,
  osm_type osm_type NOT NULL,
  label varchar(100),
  category varchar(50) NOT NULL,
  latitude decimal(9, 7) NOT NULL,
  longitude decimal(9, 7) NOT NULL,
  distance decimal(10, 2) NOT NULL -- TODO: Decide whether to store geometry as well
);

ALTER TABLE public.pois OWNER TO postgres;

COMMENT ON TABLE public.pois IS 'Stores point of interest data.';

ALTER TABLE ONLY public.pois
  ADD CONSTRAINT pois_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.pois
  ADD CONSTRAINT pois_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id) ON UPDATE CASCADE ON DELETE CASCADE;

-- Moddatetime extension
CREATE TRIGGER handle_updated_at_pois
  BEFORE UPDATE ON public.pois
  FOR EACH ROW
  EXECUTE FUNCTION moddatetime('updated_at');

