import joblib
import pandas as pd

from app.config import FEATURES_PATH, METRICS_PATH, MODEL_PATH, SCALER_PATH
from app.schemas import ModelMetrics, PredictionRequest, PredictionResponse

BINARY_COLUMNS = (
    "mainroad",
    "guestroom",
    "basement",
    "hotwaterheating",
    "airconditioning",
    "prefarea",
)


class HousePricePredictor:
    """Loads pre-trained model artifacts and runs preprocessing + inference."""

    def __init__(self) -> None:
        self.model = joblib.load(MODEL_PATH)
        self.scaler = joblib.load(SCALER_PATH)
        self.features = list(joblib.load(FEATURES_PATH))
        self.raw_metrics = joblib.load(METRICS_PATH)

    def preprocess(self, payload: PredictionRequest) -> pd.DataFrame:
        input_df = pd.DataFrame([payload.model_dump()])

        for col in BINARY_COLUMNS:
            input_df[col] = input_df[col].map({"yes": 1, "no": 0})

        input_df = pd.get_dummies(input_df, columns=["furnishingstatus"])
        input_df = input_df.reindex(columns=self.features, fill_value=0)
        return input_df

    def get_metrics(self) -> ModelMetrics:
        return ModelMetrics(
            model_name=str(self.raw_metrics.get("Model", "Linear Regression")),
            mae=float(self.raw_metrics["MAE"]),
            mse=float(self.raw_metrics["MSE"]),
            rmse=float(self.raw_metrics["RMSE"]),
            r2_score=float(self.raw_metrics["R2 Score"]),
        )

    def predict(self, payload: PredictionRequest) -> PredictionResponse:
        processed = self.preprocess(payload)
        scaled = self.scaler.transform(processed)
        predicted_price = float(self.model.predict(scaled)[0])
        return PredictionResponse(
            predicted_price=predicted_price,
            metrics=self.get_metrics(),
        )
