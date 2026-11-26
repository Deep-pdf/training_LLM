from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from app.config import APP_TITLE, APP_VERSION, CORS_ORIGINS
from app.predictor import HousePricePredictor
from app.schemas import (
    HealthResponse,
    ModelMetrics,
    PredictionRequest,
    PredictionResponse,
)

predictor: HousePricePredictor | None = None


@asynccontextmanager
async def lifespan(_: FastAPI):
    global predictor
    predictor = HousePricePredictor()
    yield
    predictor = None


app = FastAPI(title=APP_TITLE, version=APP_VERSION, lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health", response_model=HealthResponse)
def health_check() -> HealthResponse:
    return HealthResponse(status="ok", model_loaded=predictor is not None)


@app.get("/metrics", response_model=ModelMetrics)
def read_metrics() -> ModelMetrics:
    if predictor is None:
        raise HTTPException(status_code=503, detail="Model artifacts are not loaded.")
    return predictor.get_metrics()


@app.post("/predict", response_model=PredictionResponse)
def predict_house_price(payload: PredictionRequest) -> PredictionResponse:
    if predictor is None:
        raise HTTPException(status_code=503, detail="Model artifacts are not loaded.")
    return predictor.predict(payload)
