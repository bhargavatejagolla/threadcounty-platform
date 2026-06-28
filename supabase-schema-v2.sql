-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Drop the old table if it exists (for the demo/prototype phase)
drop table if exists public.inspections;

-- Create the new Enterprise Single Source of Truth table
create table public.inspections (
  id uuid default uuid_generate_v4() primary key,
  inspection_id text not null unique,
  user_id uuid references auth.users not null,
  image_url text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  -- Dense Feature Vector (The real CV math)
  entropy numeric not null,
  energy numeric not null,
  homogeneity numeric not null,
  contrast numeric not null,
  correlation numeric not null,
  edge_density numeric not null,
  orientation numeric not null,
  texture_variance numeric not null,
  fft_peak numeric not null,
  discontinuity_score numeric not null,

  -- Computed Base Quality
  quality numeric not null,

  -- AI Inferred Outputs (Groq JSON)
  confidence numeric not null,
  summary text not null,
  recommendations text[] not null default '{}',
  limitations text[] not null default '{}',
  confidence_reasoning text[] not null default '{}',
  inspection_grade text not null,
  risk_level text not null,

  -- System Metadata
  vision_core_version text not null default 'v3.2',
  feature_engine_version text not null default 'v2.1',
  prompt_version text not null default 'v1.8',
  llm_model text not null default 'Llama 3.3 70B',
  processing_time numeric not null,
  analysis_hash text not null
);

-- RLS Policies
alter table public.inspections enable row level security;

create policy "Users can view their own inspections"
  on public.inspections for select
  using (auth.uid() = user_id);

create policy "Users can insert their own inspections"
  on public.inspections for insert
  with check (auth.uid() = user_id);
