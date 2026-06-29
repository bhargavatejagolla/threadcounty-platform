-- NovaWeave AI Runtime - Explainability Migration (v4)

-- Add the new JSONB arrays to power the UI's Explainability views
ALTER TABLE public.inspections
ADD COLUMN top_materials JSONB DEFAULT '[]'::jsonb,
ADD COLUMN top_patterns JSONB DEFAULT '[]'::jsonb,
ADD COLUMN texture_profile JSONB DEFAULT '[]'::jsonb,
ADD COLUMN matched_features JSONB DEFAULT '[]'::jsonb;
