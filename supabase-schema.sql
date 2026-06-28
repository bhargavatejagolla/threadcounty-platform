-- Create the unified inspections table
CREATE TABLE IF NOT EXISTS public.inspections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    inspection_id TEXT UNIQUE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- CV Metrics
    brightness NUMERIC,
    contrast NUMERIC,
    entropy NUMERIC,
    edge_density NUMERIC,
    texture_variance NUMERIC,
    sharpness NUMERIC,
    noise NUMERIC,
    contours INTEGER,
    warp INTEGER,
    weft INTEGER,
    density INTEGER,
    
    -- AI Generated
    quality INTEGER,
    confidence INTEGER,
    summary TEXT,
    recommendations JSONB,
    limitations JSONB,
    confidence_reasoning JSONB,
    inspection_grade TEXT,
    risk_level TEXT,
    
    -- Metadata
    engine_version TEXT,
    llm_model TEXT,
    processing_time NUMERIC,
    analysis_hash TEXT
);

-- Enable RLS
ALTER TABLE public.inspections ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own inspections
CREATE POLICY "Users can view own inspections" ON public.inspections
    FOR SELECT USING (auth.uid() = user_id);

-- Allow users to insert their own inspections
CREATE POLICY "Users can insert own inspections" ON public.inspections
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Allow users to delete their own inspections
CREATE POLICY "Users can delete own inspections" ON public.inspections
    FOR DELETE USING (auth.uid() = user_id);
