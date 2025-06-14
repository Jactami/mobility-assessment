-- 
-- RLS policies for table profiles
--
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read all profiles." ON public.profiles FOR SELECT
TO authenticated
USING (authorize('admin'));

CREATE POLICY "Admins can insert profiles." ON public.profiles FOR INSERT
TO authenticated
WITH CHECK (authorize('admin'));

CREATE POLICY "Admins can update all profiles." ON public.profiles FOR UPDATE
TO authenticated
USING (authorize('admin'));

CREATE POLICY "Admins can delete all profiles." ON public.profiles FOR DELETE
TO authenticated
USING (authorize('admin'));

CREATE POLICY "Authenticated users can read their own profiles." ON public.profiles FOR SELECT
TO authenticated
USING ( (SELECT auth.uid()) = id);

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
