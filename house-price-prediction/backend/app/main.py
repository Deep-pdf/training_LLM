import logging
from contextlib import asynccontextmanager
from typing import Any

from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware

from app.config import APP_DESCRIPTION, APP_TITLE, APP_VERSION, CORS_ORIGINS
from app.predictor import predictor
from app.schemas import (
    ModelMetrics,
    PredictionRequest,
    PredictionResponse,
    RootResponse,
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger("house_price_api")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application lifespan context manager:
    Loads machine learning artifacts into memory once at startup.
    """
    try:
        predictor.load_artifacts()
        logger.info("FastAPI backend initialized successfully.")
    except Exception as exc:
        logger.error("Failed to load model artifacts on startup: %s", exc)
    yield
    logger.info("FastAPI backend shutting down.")


# Initialize FastAPI application
app = FastAPI(
    title=APP_TITLE,
    description=APP_DESCRIPTION,
    version=APP_VERSION,
    lifespan=lifespan,
)

# Configure CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get(
    "/",
    response_model=RootResponse,
    summary="API Root Verification",
    tags=["Status"],
)
def read_root() -> RootResponse:
    """Verifies that the API service is running."""
    return RootResponse(
        status="running",
        message="House Price Prediction API is operational",
        version=APP_VERSION,
        docs_url="/docs",
    )


@app.get(
    "/health",
    summary="Health Check",
    tags=["Status"],
)
def health_check() -> dict[str, Any]:
    """Health endpoint returning model readiness status."""
    return {
        "status": "healthy" if predictor.is_loaded else "degraded",
        "model_loaded": predictor.is_loaded,
    }


@app.get(
    "/metrics",
    response_model=ModelMetrics,
    summary="Get Model Performance Metrics",
    tags=["Metrics"],
)
def read_metrics() -> ModelMetrics:
    """
    Returns actual evaluation metrics (R², MAE, MSE, RMSE)
    saved from original model training.
    """
    if not predictor.is_loaded:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Model artifacts are not loaded. Service is currently unavailable.",
        )
    try:
        return predictor.get_metrics()
    except Exception as exc:
        logger.error("Error reading model metrics: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve model evaluation metrics.",
        )


@app.post(
    "/predict",
    response_model=PredictionResponse,
    summary="Predict House Price",
    tags=["Prediction"],
)
def predict_price(payload: PredictionRequest) -> PredictionResponse:
    """
    Accepts house feature attributes, applies preprocessing and scaling,
    and returns estimated house price calculated by Linear Regression.
    """
    if not predictor.is_loaded:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Model artifacts are not loaded. Service is currently unavailable.",
        )
    try:
        predicted_price = predictor.predict(payload)
        return PredictionResponse(
            predicted_price=round(predicted_price, 2),
            currency="INR",
        )
    except Exception as exc:
        logger.error("Prediction inference error: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while generating the house price prediction.",
        )
