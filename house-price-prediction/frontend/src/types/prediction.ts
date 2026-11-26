export type YesNo = "yes" | "no";

export type FurnishingStatus = "furnished" | "semi-furnished" | "unfurnished";

export interface PredictionRequest {
  area: number;
  bedrooms: number;
  bathrooms: number;
  stories: number;
  parking: number;
  mainroad: YesNo;
  guestroom: YesNo;
  basement: YesNo;
  hotwaterheating: YesNo;
  airconditioning: YesNo;
  prefarea: YesNo;
  furnishingstatus: FurnishingStatus;
}

export interface ModelMetrics {
  model_name: string;
  mae: number;
  mse: number;
  rmse: number;
  r2_score: number;
}

export interface PredictionResponse {
  predicted_price: number;
  currency: string;
  metrics: ModelMetrics;
}

export interface HealthResponse {
  status: string;
  model_loaded: boolean;
}
