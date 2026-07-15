/*
# International Applicant Support

## Purpose
Expands the applications table to support international applicants by adding
structured address fields: country, city, region (state/province), and postal_code.
The existing `address` column is retained for backward compatibility.

## 1. Modified Tables

### applications (altered)
- `country` (text) — applicant's country (NEW)
- `city` (text) — applicant's city (NEW)
- `region` (text) — state / province / region (NEW)
- `postal_code` (text) — postal / ZIP code (NEW)

## 2. Security
No policy changes needed — existing RLS policies already cover the new columns
since they are on the same table.
*/

ALTER TABLE public.applications
  ADD COLUMN IF NOT EXISTS country text,
  ADD COLUMN IF NOT EXISTS city text,
  ADD COLUMN IF NOT EXISTS region text,
  ADD COLUMN IF NOT EXISTS postal_code text;
