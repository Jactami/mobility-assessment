--
-- Table projects
--
CREATE TABLE IF NOT EXISTS public.projects(
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT "now"() NOT NULL,
    updated_at timestamp with time zone,
    owner_id uuid NOT NULL,
    title text NOT NULL,
    favorite boolean DEFAULT FALSE,
    latitude decimal(9, 7),
    longitude decimal(9, 7),
    NAME text,
    housenumber text,
    street text,
    postcode text,
    city text,
    country text,
    radius integer DEFAULT 1200,
    score numeric(5, 2)
);

ALTER TABLE public.projects OWNER TO postgres;

COMMENT ON TABLE public.projects IS 'Stores project data.';

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE;

CREATE INDEX projects_owner_id_idx ON projects(owner_id);

-- Moddatetime extension
CREATE TRIGGER handle_updated_at_projects
    BEFORE UPDATE ON public.projects
    FOR EACH ROW
    EXECUTE FUNCTION moddatetime('updated_at');

-- Set project limit
CREATE OR REPLACE FUNCTION public.enforce_project_limit()
    RETURNS TRIGGER
    SET search_path = public
    AS $$
DECLARE
    existing_project projects%ROWTYPE;
BEGIN
    -- Check if project with the same ID already exists
    SELECT
        * INTO existing_project
    FROM
        projects
    WHERE
        id = NEW.id;
    -- If it exists, this is an update — allow it
    IF FOUND THEN
        RETURN NEW;
    END IF;
    -- If it's a true insert, check if the user has hit the project limit
    IF (
        SELECT
            count(*)
        FROM
            projects
        WHERE
            owner_id = NEW.owner_id) >= 50 THEN
        RAISE EXCEPTION
            -- Custom defined error code
            'Project limit exceeded.'
            USING ERRCODE = 'P0001';
    END IF;
    RETURN NEW;
END;
$$
LANGUAGE plpgsql;

CREATE TRIGGER check_project_limit
    BEFORE INSERT ON public.projects
    FOR EACH ROW
    EXECUTE FUNCTION enforce_project_limit();

