--
-- RLS policies for table profiles
--
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile or admin" ON public.profiles
  FOR SELECT TO authenticated
    USING ((
    -- Admins can always read
      SELECT
        authorize('admin'))
        -- Users can read own profile
        OR id =(
          SELECT
            auth.uid()));

CREATE POLICY "Admins can insert profiles" ON public.profiles
  FOR INSERT TO authenticated
    WITH CHECK ((
    -- Admins can always insert, users cannot insert profiles directly
    SELECT authorize('admin')));

CREATE POLICY "Admins can update profiles" ON public.profiles
  FOR UPDATE TO authenticated
    USING ((
    -- Admins can always update, users cannot update profiles directly
    SELECT authorize('admin')));

CREATE POLICY "Admins can delete profiles" ON public.profiles
  FOR DELETE TO authenticated
    USING ((
    -- Admins can always delete, users cannot delete profiles directly
    SELECT authorize('admin')));

REVOKE ALL ON TABLE public.profiles FROM anon;

GRANT ALL ON TABLE public.profiles TO authenticated;

GRANT ALL ON TABLE public.profiles TO service_role;

--
-- RLS policies for table projects
--
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own projects or admin" ON public.projects
  FOR SELECT TO authenticated
    USING ((
    -- Admins can always read
      SELECT
        authorize('admin'))
        -- Users can read own projects if active
        OR ((
          SELECT
            is_user_active()) AND owner_id =(
              SELECT
                auth.uid())));

CREATE POLICY "Users can insert own projects or admin" ON public.projects
  FOR INSERT TO authenticated
    WITH CHECK ((
    -- Admins can always insert
    SELECT authorize('admin'))
    -- Users can insert into own projects if active
    OR ((
      SELECT
        is_user_active()) AND owner_id =(
          SELECT
            auth.uid())));

CREATE POLICY "Users can update own projects or admin" ON public.projects
  FOR UPDATE TO authenticated
    USING ((
    -- Admins can always update
    SELECT authorize('admin'))
    -- Users can update own projects if active
      OR ((
        SELECT
          is_user_active()) AND owner_id =(
            SELECT
              auth.uid())));

CREATE POLICY "Users can delete own projects or admin" ON public.projects
  FOR DELETE TO authenticated
    USING ((
    -- Admins can always delete
    SELECT authorize('admin'))
    -- Users can delete own projects if active
      OR ((
        SELECT
          is_user_active()) AND owner_id =(
            SELECT
              auth.uid())));

REVOKE ALL ON TABLE public.projects FROM anon;

GRANT ALL ON TABLE public.projects TO authenticated;

GRANT ALL ON TABLE public.projects TO service_role;

--
-- RLS policies for table pois
--
ALTER TABLE public.pois ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read POIs of own projects or admin" ON public.pois
  FOR SELECT TO authenticated
    USING ((
    -- Admins can always read
      SELECT
        authorize('admin'))
        -- Users can read POIs of own projects if active
        OR ((
          SELECT
            is_user_active()) AND EXISTS (
              SELECT
                1
              FROM
                public.projects p
              WHERE
                p.id = pois.project_id AND p.owner_id =(
                  SELECT
                    auth.uid()))));

CREATE POLICY "Users can insert POIs into own projects or admin" ON public.pois
  FOR INSERT TO authenticated
    WITH CHECK ((
    -- Admins can always insert
    SELECT authorize('admin'))
    -- Users can insert POIs of own projects if active
    OR ((
      SELECT
        is_user_active()) AND EXISTS (
          SELECT
            1
          FROM
            public.projects p
          WHERE
            p.id = pois.project_id AND p.owner_id =(
              SELECT
                auth.uid()))));

CREATE POLICY "Users can update POIs of own projects or admin" ON public.pois
  FOR UPDATE TO authenticated
    USING ((
    -- Admins can always update
    SELECT authorize('admin'))
    -- Users can update POIs of own projects if active
      OR ((
        SELECT
          is_user_active()) AND EXISTS (
            SELECT
              1
            FROM
              public.projects p
            WHERE
              p.id = pois.project_id AND p.owner_id =(
                SELECT
                  auth.uid()))));

CREATE POLICY "Users can delete POIs of own projects or admin" ON public.pois
  FOR DELETE TO authenticated
    USING ((
    -- Admins can always delete
    SELECT authorize('admin'))
    -- Users can delete POIs of own projects if active
      OR ((
        SELECT
          is_user_active()) AND EXISTS (
            SELECT
              1
            FROM
              public.projects p
            WHERE
              p.id = pois.project_id AND p.owner_id =(
                SELECT
                  auth.uid()))));

REVOKE ALL ON TABLE public.pois FROM anon;

GRANT ALL ON TABLE public.pois TO authenticated;

GRANT ALL ON TABLE public.pois TO service_role;

