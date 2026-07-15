/*
# Fix: Drop and recreate generate_reference_number function
Drops the existing function before recreating with the new return type.
*/

DROP FUNCTION IF EXISTS public.generate_reference_number() CASCADE;

CREATE OR REPLACE FUNCTION public.generate_reference_number()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  year_part text;
  seq_val integer;
  ref text;
BEGIN
  year_part := to_char(now(), 'YYYY');
  SELECT COALESCE(MAX(seq), 0) + 1 INTO seq_val
  FROM (
    SELECT CAST(
      SUBSTRING(reference_number FROM 10 FOR 6)
      AS integer
    ) AS seq
    FROM public.applications
    WHERE reference_number LIKE 'HCF-' || year_part || '-%'
  ) sub;

  ref := 'HCF-' || year_part || '-' || lpad(seq_val::text, 6, '0');
  NEW.reference_number := ref;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_generate_reference_number ON public.applications;
CREATE TRIGGER trg_generate_reference_number
  BEFORE INSERT ON public.applications
  FOR EACH ROW
  WHEN (NEW.reference_number IS NULL)
  EXECUTE FUNCTION public.generate_reference_number();
