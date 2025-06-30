--
-- Table projects
--
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID DEFAULT gen_random_uuid() NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT "now"() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE,
    owner_id UUID NOT NULL,
    title VARCHAR(100) NOT NULL,
    favorite BOOLEAN DEFAULT FALSE,
    latitude DECIMAL(9,7),
    longitude DECIMAL(9,7),
    name VARCHAR(100),
    housenumber VARCHAR(10),
    street VARCHAR(100),
    postcode VARCHAR(5),
    city VARCHAR(100),
    country VARCHAR(100),
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

-- Set project limit
CREATE OR REPLACE FUNCTION enforce_project_limit()
RETURNS TRIGGER AS $$
DECLARE
    existing_project projects%ROWTYPE;
BEGIN
    -- Check if project with the same ID already exists
    SELECT * INTO existing_project
    FROM projects
    WHERE id = NEW.id;

    -- If it exists, this is an update — allow it
    IF FOUND THEN
        RETURN NEW;
    END IF;

    -- If it's a true insert, check if the user has hit the project limit
    IF (
        SELECT COUNT(*)
        FROM projects
        WHERE owner_id = NEW.owner_id
    ) >= 50 THEN
        RAISE EXCEPTION 'Project limit exceeded.'
            USING ERRCODE = 'P0001'; -- Custom user defined error code 
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER check_project_limit
BEFORE INSERT ON public.projects
FOR EACH ROW
EXECUTE FUNCTION enforce_project_limit();
