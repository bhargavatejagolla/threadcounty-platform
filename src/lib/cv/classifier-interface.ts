import { FeatureVector } from '@/types/inspection';

export interface ClassificationResult {
  material: string;
  pattern: string;
  materialConfidence: number;
  patternConfidence: number;
}

export interface ClassifierPlugin {
  name: string;
  version: string;
  isReady: boolean;
  
  /**
   * Initializes the classifier model (e.g. downloads ONNX weights, warms up tensors)
   */
  initialize(): Promise<void>;
  
  /**
   * Predicts the material and pattern based on the extracted feature vector
   */
  classify(features: FeatureVector): Promise<ClassificationResult>;
}
