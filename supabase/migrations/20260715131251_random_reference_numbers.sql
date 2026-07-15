/*
# Replace sequential reference numbers with random unique ones

1. Changes
   - Drops the existing `generate_reference_number` trigger function
   - Recreates it to generate random 8-digit reference numbers in format HCF-YYYY-XXXXXXXX
   - Loops up to 100 times checking the `applications` table for uniqueness before saving
   - If no unique number is found after 100 attempts, raises an exception (practically impossible with 8 digits)
   - Recreates the existing BEFORE INSERT trigger

2. Why
   - Sequential numbers are predictable and can be enumerated
   - Random numbers prevent guessing other applicants' reference numbers

3. Notes
   - Existing applications keep their current reference numbers
   - Only new inserts get random reference numbers
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
  ref text;
  attempts integer := 0;
  max_attempts integer := 100;
  rand_num bigint;
BEGIN
  year_part := to_char(now(), 'YYYY');

  LOOP
    attempts := attempts + 1;
    -- Generate a random 8-digit number (10000000 - 99999999)
    rand_num := floor(random() * 90000000) + 10000000;
    ref := 'HCF-' || year_part || '-' || rand_num::text;

    -- Check if this reference number already exists
    PERFORM 1 FROM public.applications WHERE reference_number = ref LIMIT 1;
    IF NOT FOUND THEN
      -- Unique reference number found
      NEW.reference_number := ref;
      RETURN NEW;
    END IF;

    IF attempts >= max_attempts THEN
      RAISE EXCEPTION 'Could not generate a unique reference number after % attempts', max_attempts;
    END IF;
  END LOOP;
END;
$$;

DROP TRIGGER IF EXISTS trg_generate_reference_number ON public.applications;
CREATE TRIGGER trg_generate_reference_number
  BEFORE INSERT ON public.applications
  FOR EACH ROW
  WHEN (NEW.reference_number IS NULL)
  EXECUTE FUNCTION public.generate_reference_number();
