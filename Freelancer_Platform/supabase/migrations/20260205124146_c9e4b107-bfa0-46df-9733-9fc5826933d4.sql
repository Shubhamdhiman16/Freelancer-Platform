-- Fix function search_path for update_updated_at_column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

-- Drop permissive policies and create more restrictive ones
DROP POLICY IF EXISTS "Authenticated users can create freelancers" ON public.freelancers;

-- Users can only create freelancers linked to their own account
CREATE POLICY "Users can create their own freelancer profile"
ON public.freelancers FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);