from typing import Literal

from pydantic import BaseModel, ConfigDict, Field, field_validator

# Allowed categorical values matching training dataset
YesNo = Literal["yes", "no"]
FurnishingStatus = Literal["furnished", "semi-furnished", "unfurnished"]


class PredictionRequest(BaseModel):
    """
    Input schema for house price prediction.
    Features mirror the dataset schema used during model training.
    """

    area: float = Field(
        ...,
        gt=0,
        le=100000,
        description="Total property area in square feet (e.g., 5000).",
        examples=[5000],
    )
    bedrooms: int = Field(
        ...,
        ge=1,
        le=20,
        description="Number of bedrooms (e.g., 3).",
        examples=[3],
    )
    bathrooms: int = Field(
        ...,
        ge=1,
        le=10,
        description="Number of bathrooms (e.g., 2).",
        examples=[2],
    )
    stories: int = Field(
        ...,
        ge=1,
        le=10,
        description="Number of stories/floors (e.g., 2).",
        examples=[2],
    )
    parking: int = Field(
        ...,
        ge=0,
        le=10,
        description="Number of dedicated parking spaces (e.g., 1).",
        examples=[1],
    )
    mainroad: YesNo = Field(
        ...,
        description="Is the house connected to the main road ('yes' or 'no').",
        examples=["yes"],
    )
    guestroom: YesNo = Field(
        ...,
        description="Does the house have a guest room ('yes' or 'no').",
        examples=["no"],
    )
    basement: YesNo = Field(
        ...,
        description="Does the house have a basement ('yes' or 'no').",
        examples=["no"],
    )
    hotwaterheating: YesNo = Field(
        ...,
        description="Does the house have hot water heating ('yes' or 'no').",
        examples=["no"],
    )
    airconditioning: YesNo = Field(
        ...,
        description="Does the house have air conditioning ('yes' or 'no').",
        examples=["yes"],
    )
    prefarea: YesNo = Field(
        ...,
        description="Is the property located in a preferred area ('yes' or 'no').",
        examples=["yes"],
    )
    furnishingstatus: FurnishingStatus = Field(
        ...,
        description="Furnishing status: 'furnished', 'semi-furnished', or 'unfurnished'.",
        examples=["furnished"],
    )

    @field_validator(
        "mainroad",
        "guestroom",
        "basement",
        "hotwaterheating",
        "airconditioning",
        "prefarea",
        "furnishingstatus",
        mode="before",
    )
    @classmethod
    def normalize_string_case(cls, value: str) -> str:
        """Strip whitespace and convert to lowercase for case-insensitive input tolerance."""
        if isinstance(value, str):
            return value.strip().lower()
        return value


class PredictionResponse(BaseModel):
    """Prediction output containing estimated house price and currency."""

    predicted_price: float = Field(
        ...,
        description="Estimated house price based on model prediction.",
        examples=[6573852.77],
    )
    currency: str = Field(
        default="INR",
        description="Currency code for the predicted valuation.",
        examples=["INR"],
    )


class ModelMetrics(BaseModel):
    """Actual model evaluation metrics saved during training."""

    model_name: str = Field(..., description="Model algorithm name.")
    r2_score: float = Field(..., description="R² coefficient of determination.")
    mae: float = Field(..., description="Mean Absolute Error.")
    mse: float = Field(..., description="Mean Squared Error.")
    rmse: float = Field(..., description="Root Mean Squared Error.")

    model_config = ConfigDict(populate_by_name=True)


class RootResponse(BaseModel):
    """Response schema for root health verification."""

    status: str
    message: str
    version: str
    docs_url: str
