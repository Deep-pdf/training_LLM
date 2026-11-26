import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
MODELS_DIR = Path(os.getenv("MODELS_DIR", BASE_DIR / "models"))

MODEL_PATH = MODELS_DIR / "linear_regression.pkl"
SCALER_PATH = MODELS_DIR / "scaler.pkl"
FEATURES_PATH = MODELS_DIR / "features.pkl"
METRICS_PATH = MODELS_DIR / "metrics.pkl"

APP_TITLE = "House Price Prediction API"
APP_VERSION = "0.1.0"

_raw_origins = os.getenv("CORS_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000")
CORS_ORIGINS = [origin.strip() for origin in _raw_origins.split(",") if origin.strip()]
