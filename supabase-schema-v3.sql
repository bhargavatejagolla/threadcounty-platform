-- NovaWeave AI Runtime - Enterprise Migration (v3)

-- 1. Add New Columns to inspections table
ALTER TABLE inspections
ADD COLUMN feature_vector JSONB,
ADD COLUMN material_prediction TEXT DEFAULT 'Unknown',
ADD COLUMN pattern_prediction TEXT DEFAULT 'Unknown',
ADD COLUMN processed_image_url TEXT,
ADD COLUMN vision_engine_version TEXT DEFAULT 'NovaWeave Vision Core v3.2',
ADD COLUMN feature_engine_version TEXT DEFAULT 'NovaWeave Feature Engine v3.2',
ADD COLUMN classifier_version TEXT DEFAULT 'NovaWeave Material Classifier v1.0',
ADD COLUMN llm_version TEXT DEFAULT 'NovaWeave Insight Engine (Groq Llama-3.3)',
ADD COLUMN report_engine_version TEXT DEFAULT 'NovaWeave Report Generator v2.0',
ADD COLUMN pipeline_version TEXT DEFAULT '2026.06.28',
ADD COLUMN camera_metadata JSONB,
ADD COLUMN device_info JSONB;

-- 2. Optional: Migrate existing flat metrics into the JSONB feature_vector for old records
UPDATE inspections
SET feature_vector = jsonb_build_object(
  'entropy', entropy,
  'energy', energy,
  'homogeneity', homogeneity,
  'contrast', contrast,
  'correlation', correlation,
  'edge_density', edge_density,
  'orientation', orientation,
  'texture_variance', texture_variance,
  'fft_peak', fft_peak,
  'discontinuity_score', discontinuity_score
)
WHERE feature_vector IS NULL;

-- Note: We retain the original flat columns for backward compatibility in the dashboard,
-- but all new analytics and reports will utilize the JSONB `feature_vector`.
