# House Price Prediction

Full-stack House Price Prediction application with a Next.js (App Router, TypeScript, Tailwind CSS, shadcn/ui) frontend and a FastAPI + Scikit-learn backend.

## Project Structure

```text
house-price-prediction/
├── frontend/    # Next.js App Router frontend
├── backend/     # FastAPI + pre-trained Scikit-learn inference API
├── .gitignore
└── README.md
```

## Backend Setup

From `house-price-prediction/backend`:

```bash
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

## Frontend Setup

From `house-price-prediction/frontend`:

```bash
npm install
npm run dev
```
