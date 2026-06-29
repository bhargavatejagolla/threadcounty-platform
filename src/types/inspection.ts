import { z } from 'zod';

// The exact structure we enforce on the LLM via JSON mode
export const groqResponseSchema = z.object({
  executive_summary: z.string(),
  image_quality: z.string(),
  confidence_reasoning: z.array(z.string()),
  recommendations: z.array(z.string()),
  limitations: z.array(z.string()),
  inspection_grade: z.string(),
  risk_level: z.string(),
  overall_confidence: z.number().min(0).max(100),
});

export type GroqResponse = z.infer<typeof groqResponseSchema>;

// The advanced feature vector extracted deterministically from the image
export interface FeatureVector {
  entropy: number;
  energy: number;
  homogeneity: number;
  contrast: number;
  correlation: number;
  edge_density: number;
  orientation: number; // Dominant orientation in degrees
  texture_variance: number;
  fft_peak: number;
  discontinuity_score: number;
  
  // New Enterprise Fields
  lbp_histogram?: number[];
  hog_descriptor?: number[];
  rgb_histogram?: number[];
  lighting_score?: number;
  blur_score?: number;
  noise_score?: number;
  texture_stability?: number;
  pattern_symmetry?: number;
}

// The single source of truth record matching the Supabase table
export interface InspectionRecord {
  id: string;
  inspection_id: string;
  user_id: string;
  image_url: string;
  processed_image_url?: string;
  created_at: string;
  
  // The complete feature vector object
  feature_vector: FeatureVector;

  // For backward compatibility during migration, we keep flat metrics optional
  entropy?: number;
  energy?: number;
  homogeneity?: number;
  contrast?: number;
  correlation?: number;
  edge_density?: number;
  orientation?: number;
  texture_variance?: number;
  fft_peak?: number;
  discontinuity_score?: number;

  // AI Classification Output
  material_prediction: string;
  pattern_prediction: string;
  top_materials?: Array<{name: string, score: number}>;
  top_patterns?: Array<{name: string, score: number}>;
  texture_profile?: string[];
  matched_features?: string[];

  // Top-Level Metrics
  quality: number;
  reliability: number;
  confidence: number;
  
  // LLM Outputs
  summary: string;
  recommendations: string[];
  limitations: string[];
  confidence_reasoning: string[];
  inspection_grade: string;
  risk_level: string;

  // Versioning Metadata
  vision_engine_version: string;
  feature_engine_version: string;
  classifier_version: string;
  llm_version: string;
  report_engine_version: string;
  pipeline_version: string;

  processing_time: number;
  analysis_hash: string;
  
  // Device/Camera Info
  camera_metadata?: any;
  device_info?: any;
}

