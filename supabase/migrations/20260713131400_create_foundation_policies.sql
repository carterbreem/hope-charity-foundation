/*
# Hope Charity Foundation — RLS Policies

Applies row-level security policies to all foundation tables. All policies
are idempotent (DROP POLICY IF EXISTS before CREATE).
*/

-- ============================================================
-- profiles
-- ============================================================
DROP POLICY IF EXISTS "profiles_select_own_or_admin" ON public.profiles;
CREATE POLICY "profiles_select_own_or_admin" ON public.profiles FOR SELECT
  TO authenticated USING (auth.uid() = id OR public.is_admin());

DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = id);

-- ============================================================
-- applications
-- ============================================================
DROP POLICY IF EXISTS "applications_select_own_or_admin" ON public.applications;
CREATE POLICY "applications_select_own_or_admin" ON public.applications FOR SELECT
  TO authenticated USING (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "applications_insert_own" ON public.applications;
CREATE POLICY "applications_insert_own" ON public.applications FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "applications_update_own_or_admin" ON public.applications;
CREATE POLICY "applications_update_own_or_admin" ON public.applications FOR UPDATE
  TO authenticated USING (auth.uid() = user_id OR public.is_admin())
  WITH CHECK (auth.uid() = user_id OR public.is_admin());

-- ============================================================
-- application_status_history
-- ============================================================
DROP POLICY IF EXISTS "history_select_own_or_admin" ON public.application_status_history;
CREATE POLICY "history_select_own_or_admin" ON public.application_status_history FOR SELECT
  TO authenticated USING (
    EXISTS (
      SELECT 1 FROM public.applications a
      WHERE a.id = application_status_history.application_id
      AND (a.user_id = auth.uid() OR public.is_admin())
    )
  );

DROP POLICY IF EXISTS "history_insert_admin" ON public.application_status_history;
CREATE POLICY "history_insert_admin" ON public.application_status_history FOR INSERT
  TO authenticated WITH CHECK (public.is_admin());

-- ============================================================
-- donations
-- ============================================================
DROP POLICY IF EXISTS "donations_insert_anyone" ON public.donations;
CREATE POLICY "donations_insert_anyone" ON public.donations FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "donations_select_admin" ON public.donations;
CREATE POLICY "donations_select_admin" ON public.donations FOR SELECT
  TO authenticated USING (public.is_admin());

DROP POLICY IF EXISTS "donations_update_admin" ON public.donations;
CREATE POLICY "donations_update_admin" ON public.donations FOR UPDATE
  TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- ============================================================
-- contact_messages
-- ============================================================
DROP POLICY IF EXISTS "messages_insert_anyone" ON public.contact_messages;
CREATE POLICY "messages_insert_anyone" ON public.contact_messages FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "messages_select_admin" ON public.contact_messages;
CREATE POLICY "messages_select_admin" ON public.contact_messages FOR SELECT
  TO authenticated USING (public.is_admin());

DROP POLICY IF EXISTS "messages_update_admin" ON public.contact_messages;
CREATE POLICY "messages_update_admin" ON public.contact_messages FOR UPDATE
  TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
