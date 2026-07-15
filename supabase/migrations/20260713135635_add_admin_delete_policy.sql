/*
# Admin Delete Policy for Applications

## Purpose
Allows admin users to delete application records. Applicants cannot delete
their own applications — only authenticated admins with the 'admin' role
in their profile can perform deletions.

## Security
- DELETE policy scoped to `is_admin()` — no applicant or anon access
- Idempotent (DROP POLICY IF EXISTS before CREATE)
*/

DROP POLICY IF EXISTS "applications_delete_admin_only" ON public.applications;
CREATE POLICY "applications_delete_admin_only" ON public.applications FOR DELETE
  TO authenticated USING (public.is_admin());
