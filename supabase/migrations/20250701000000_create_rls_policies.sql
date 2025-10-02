--
-- RLS policies for table profiles
--
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- SELECT
CREATE POLICY "Authenticated users can read their own profiles." ON public.profiles
  FOR SELECT TO authenticated
    USING (authorize('admin')
      OR (
        SELECT
          auth.uid()) = id);

-- INSERT
CREATE POLICY "Authenticated users can insert their own profiles." ON public.profiles
  FOR INSERT TO authenticated
    WITH CHECK (authorize('admin')
    OR (
      SELECT
        auth.uid()) = id);

-- UPDATE
CREATE POLICY "Authenticated users can update their own profiles." ON public.profiles
  FOR UPDATE TO authenticated
    USING (authorize('admin')
      OR (
        SELECT
          auth.uid()) = id);

-- DELETE
CREATE POLICY "Authenticated users can delete their own profiles." ON public.profiles
  FOR DELETE TO authenticated
    USING (authorize('admin')
      OR (
        SELECT
          auth.uid()) = id);

REVOKE ALL ON TABLE public.profiles FROM anon;

GRANT ALL ON TABLE public.profiles TO authenticated;

GRANT ALL ON TABLE public.profiles TO service_role;

--
-- RLS policies for table projects
--
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- SELECT
CREATE POLICY "Authenticated users can read their own projects." ON public.projects
  FOR SELECT TO authenticated
    USING (authorize('admin')
      OR (
        SELECT
          auth.uid()) = owner_id);

-- INSERT
CREATE POLICY "Authenticated users can insert their own projects." ON public.projects
  FOR INSERT TO authenticated
    WITH CHECK (authorize('admin')
    OR (
      SELECT
        auth.uid()) = owner_id);

-- UPDATE
CREATE POLICY "Authenticated users can update their own projects." ON public.projects
  FOR UPDATE TO authenticated
    USING (authorize('admin')
      OR (
        SELECT
          auth.uid()) = owner_id);

-- DELETE
CREATE POLICY "Authenticated users can delete their own projects." ON public.projects
  FOR DELETE TO authenticated
    USING (authorize('admin')
      OR (
        SELECT
          auth.uid()) = owner_id);

REVOKE ALL ON TABLE public.projects FROM anon;

GRANT ALL ON TABLE public.projects TO authenticated;

GRANT ALL ON TABLE public.projects TO service_role;

--
-- RLS policies for table pois
--
ALTER TABLE public.pois ENABLE ROW LEVEL SECURITY;

-- SELECT
CREATE POLICY "Authenticated users can read POIs of their own projects." ON public.pois
  FOR SELECT TO authenticated
    USING (authorize('admin')
      OR ((
        SELECT
          auth.uid()) =(
            SELECT
              owner_id
            FROM
              public.projects
            WHERE
              id = project_id)));

-- INSERT
CREATE POLICY "Authenticated users can insert POIs into their own projects." ON public.pois
  FOR INSERT TO authenticated
    WITH CHECK (authorize('admin')
    OR ((
      SELECT
        auth.uid()) =(
          SELECT
            owner_id
          FROM
            public.projects
          WHERE
            id = project_id)));

-- UPDATE
CREATE POLICY "Authenticated users can update POIs of their own projects." ON public.pois
  FOR UPDATE TO authenticated
    USING (authorize('admin')
      OR ((
        SELECT
          auth.uid()) =(
            SELECT
              owner_id
            FROM
              public.projects
            WHERE
              id = project_id)));

-- DELETE
CREATE POLICY "Authenticated users can delete POIs of their own projects." ON public.pois
  FOR DELETE TO authenticated
    USING (authorize('admin')
      OR ((
        SELECT
          auth.uid()) =(
            SELECT
              owner_id
            FROM
              public.projects
            WHERE
              id = project_id)));

REVOKE ALL ON TABLE public.pois FROM anon;

GRANT ALL ON TABLE public.pois TO authenticated;

GRANT ALL ON TABLE public.pois TO service_role;

