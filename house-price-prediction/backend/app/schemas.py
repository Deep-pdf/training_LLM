from typing import Literal

from pydantic import BaseModel, Field

YesNo = Literal["yes", "no"]
FurnishingStatus = Literal["furnished", "semi-furnished", "unfurnished"]


class PredictionRequest(BaseModel):
    area: float = Field(..., ge=100, le=50000, description="Total area in sq. ft.")
    bedrooms: int = Field(..., ge=1, le=10)
    bathrooms: int = Field(..., ge=1, le=10)
    stories: int = Field(..., ge=1, le=10)
    parking: int = Field(..., ge=0, le=5)
    mainroad: YesNo
    guestroom: YesNo
    basement: YesNo
    hotwaterheating: YesNo
    airconditioning: YesNo
    prefarea: YesNo
    furnishingstatus: FurnishingStatus


class ModelMetrics(BaseModel):
    model_name: str
    mae: float
    mse: float
    rmse: float
    r2_score: float


class PredictionResponse(BaseModel):
    predicted_price: float
    currency: str = "INR"
    metrics: ModelMetrics


class HealthResponse(BaseModel):
    status: str
    model_loaded: bool
