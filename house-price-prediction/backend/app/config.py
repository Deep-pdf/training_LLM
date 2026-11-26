import os
from pathlib import Path

# Base directory paths
BASE_DIR = Path(__file__).resolve().parent.parent
MODELS_DIR = Path(os.getenv("MODELS_DIR", BASE_DIR / "models"))

# Model artifact paths
MODEL_PATH = MODELS_DIR / "linear_regression.pkl"
SCALER_PATH = MODELS_DIR / "scaler.pkl"
FEATURES_PATH = MODELS_DIR / "features.pkl"
METRICS_PATH = MODELS_DIR / "metrics.pkl"

# API metadata
APP_TITLE = "House Price Prediction API"
APP_DESCRIPTION = (
    "Production-ready FastAPI backend for estimating house prices using a trained "
    "Linear Regression model and pre-saved StandardScaler."
)
APP_VERSION = "1.0.0"

# CORS configuration: allow Next.js development and production origins
_raw_origins = os.getenv("CORS_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000")
CORS_ORIGINS = [origin.strip() for origin in _raw_origins.split(",") if origin.strip()]
