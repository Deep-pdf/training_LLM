import logging
from typing import Any

import joblib
import numpy as np
import pandas as pd

from app.config import FEATURES_PATH, METRICS_PATH, MODEL_PATH, SCALER_PATH
from app.schemas import ModelMetrics, PredictionRequest

logger = logging.getLogger(__name__)

# Binary columns converted to 1/0 as defined in original training code
BINARY_COLUMNS = [
    "mainroad",
    "guestroom",
    "basement",
    "hotwaterheating",
    "airconditioning",
    "prefarea",
]


class HousePricePredictor:
    """
    Singleton service responsible for loading trained ML artifacts
    and running preprocessing and inference.
    """

    def __init__(self) -> None:
        self.model: Any = None
        self.scaler: Any = None
        self.features: list[str] = []
        self.raw_metrics: dict[str, Any] = {}
        self.is_loaded: bool = False

    def load_artifacts(self) -> None:
        """Loads model, scaler, feature list, and metrics files into memory once."""
        if self.is_loaded:
            return

        missing_files = [
            str(p)
            for p in (MODEL_PATH, SCALER_PATH, FEATURES_PATH, METRICS_PATH)
            if not p.is_file()
        ]
        if missing_files:
            raise FileNotFoundError(
                f"Missing required model artifact(s): {', '.join(missing_files)}"
            )

        logger.info("Loading ML artifacts from disk...")
        self.model = joblib.load(MODEL_PATH)
        self.scaler = joblib.load(SCALER_PATH)
        self.features = list(joblib.load(FEATURES_PATH))
        self.raw_metrics = dict(joblib.load(METRICS_PATH))
        self.is_loaded = True
        logger.info(
            "ML artifacts successfully loaded. Feature count: %d", len(self.features)
        )

    def preprocess(self, request_data: PredictionRequest) -> pd.DataFrame:
        """
        Reproduces the exact preprocessing pipeline used during training:
        1. Construct single-row DataFrame from validated request.
        2. Map binary string features ('yes'/'no') to integers (1/0).
        3. One-hot encode the categorical 'furnishingstatus' column.
        4. Reindex columns against saved features.pkl to match exact order and fill absent categories with 0.
        """
        # Step 1: Create initial DataFrame
        row_dict = request_data.model_dump()
        input_df = pd.DataFrame([row_dict])

        # Step 2: Binary yes/no mapping
        for col in BINARY_COLUMNS:
            input_df[col] = input_df[col].map({"yes": 1, "no": 0})

        # Step 3: One-hot encode furnishingstatus
        input_df = pd.get_dummies(input_df, columns=["furnishingstatus"])

        # Step 4: Reindex to ensure identical feature columns and ordering as training
        input_df = input_df.reindex(columns=self.features, fill_value=0)

        return input_df

    def predict(self, request_data: PredictionRequest) -> float:
        """
        Executes preprocessing, feature scaling, and Linear Regression prediction.
        Returns the predicted house price as a native float.
        """
        if not self.is_loaded:
            raise RuntimeError("Model artifacts are not loaded.")

        # Preprocess features
        processed_df = self.preprocess(request_data)

        # Scale features using saved StandardScaler
        scaled_features = self.scaler.transform(processed_df)

        # Predict using trained Linear Regression model
        prediction = self.model.predict(scaled_features)
        predicted_price = float(prediction[0])

        return predicted_price

    def get_metrics(self) -> ModelMetrics:
        """
        Retrieves actual evaluation metrics saved from training without recalculation.
        """
        if not self.is_loaded:
            raise RuntimeError("Model artifacts are not loaded.")

        return ModelMetrics(
            model_name=str(self.raw_metrics.get("Model", "Linear Regression")),
            r2_score=float(self.raw_metrics.get("R2 Score", 0.0)),
            mae=float(self.raw_metrics.get("MAE", 0.0)),
            mse=float(self.raw_metrics.get("MSE", 0.0)),
            rmse=float(self.raw_metrics.get("RMSE", 0.0)),
        )


# Global singleton instance
predictor = HousePricePredictor()
