import type {
  HealthStatus,
  ModelMetrics,
  PredictionRequest,
  PredictionResponse,
} from "@/types/prediction";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "") ||
  "http://localhost:8000";

/**
 * Verified baseline metrics saved in backend/models/metrics.pkl.
 * Used only as a clearly labeled fallback when the local FastAPI server is offline.
 */
export const FALLBACK_MODEL_METRICS: ModelMetrics = {
  model_name: "Linear Regression",
  r2_score: 0.6584651734197499,
  mae: 902329.6343067805,
  mse: 1463722024917.1455,
  rmse: 1209843.8018674748,
};

export async function fetchHealth(): Promise<HealthStatus> {
  try {
    const res = await fetch(`${API_BASE_URL}/health`, {
      cache: "no-store",
    });
    if (!res.ok) {
      return { status: "degraded", model_loaded: false };
    }
    const data = await res.json();
    return {
      status: data.status === "healthy" ? "healthy" : "degraded",
      model_loaded: Boolean(data.model_loaded),
    };
  } catch {
    return { status: "offline", model_loaded: false };
  }
}

export async function fetchMetrics(): Promise<{
  metrics: ModelMetrics;
  isLive: boolean;
}> {
  try {
    const res = await fetch(`${API_BASE_URL}/metrics`, {
      cache: "no-store",
    });
    if (!res.ok) {
      return { metrics: FALLBACK_MODEL_METRICS, isLive: false };
    }
    const data: ModelMetrics = await res.json();
    return { metrics: data, isLive: true };
  } catch {
    return { metrics: FALLBACK_MODEL_METRICS, isLive: false };
  }
}

export async function predictHousePrice(
  payload: PredictionRequest
): Promise<PredictionResponse> {
  const res = await fetch(`${API_BASE_URL}/predict`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    let detail = "Unable to generate prediction from the backend service.";
    try {
      const errBody = await res.json();
      if (typeof errBody?.detail === "string") {
        detail = errBody.detail;
      } else if (Array.isArray(errBody?.detail) && errBody.detail[0]?.msg) {
        detail = errBody.detail[0].msg;
      }
    } catch {
      // Keep default detail message
    }
    throw new Error(detail);
  }

  return res.json();
}
