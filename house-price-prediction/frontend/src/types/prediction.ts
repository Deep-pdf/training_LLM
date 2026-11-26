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

export interface PredictionResponse {
  predicted_price: number;
  currency: string;
}

export interface ModelMetrics {
  model_name: string;
  r2_score: number;
  mae: number;
  mse: number;
  rmse: number;
}

export interface HealthStatus {
  status: "healthy" | "degraded" | "offline";
  model_loaded: boolean;
}
