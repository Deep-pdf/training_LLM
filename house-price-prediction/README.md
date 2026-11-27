# PredictHouse — House Price Prediction Platform

Full-stack House Price Prediction application with a **Next.js (App Router, TypeScript, Tailwind CSS v4)** frontend and a **FastAPI + Scikit-learn** inference backend.

---

## Project Structure

```text
house-price-prediction/
├── frontend/
│   ├── public/images/          # Architectural imagery & hero cutouts
│   ├── src/
│   │   ├── app/                # Next.js App Router layout & page
│   │   ├── components/
│   │   │   ├── home/           # HeroSection
│   │   │   ├── layout/         # Navbar
│   │   │   └── ui/             # BottomUpLetters, WordPullUp, MagicText, SmoothScroll, Reveal
│   │   ├── sections/           # AboutSection, HowItWorksSection, PredictionSection, FooterSection
│   │   ├── lib/                # Typed FastAPI client & INR formatters
│   │   ├── styles/             # Tailwind v4 theme tokens & global styles
│   │   └── types/              # TypeScript request/response schemas
│   ├── .env.local.example
│   └── package.json
├── backend/
│   ├── app/                    # FastAPI application, predictor pipeline & Pydantic schemas
│   ├── models/                 # Pre-trained linear_regression.pkl, scaler.pkl, features.pkl, metrics.pkl
│   └── requirements.txt
├── assets/                     # Original architectural assets & design references
├── .gitignore
└── README.md
```

---

## Tech Stack

### Frontend
- **Framework:** Next.js 15 (App Router) · React 19 · TypeScript
- **Styling & Typography:** Tailwind CSS v4 · `Bebas Neue`, `DM Serif Display`, and `DM Sans` via `next/font/google`
- **Motion & Smooth Scroll:** `motion`, `framer-motion`, and `lenis` (`ReactLenis`)
- **Icons:** `lucide-react`

### Backend
- **API:** FastAPI · Uvicorn · Pydantic v2
- **ML Pipeline:** Python · Scikit-learn (`LinearRegression`, `StandardScaler`) · Pandas · Joblib

---

## Backend Setup

From `house-price-prediction/backend`:

```bash
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### API Endpoints

| Method | Endpoint   | Description |
| ------ | ---------- | ----------- |
| `GET`  | `/`        | API root verification |
| `GET`  | `/health`  | Model readiness & health check |
| `GET`  | `/metrics` | Saved training evaluation metrics (`model_name`, `r2_score`, `mae`, `mse`, `rmse`) |
| `POST` | `/predict` | Predicts house price in `INR` from 12 property attributes |

---

## Frontend Setup

From `house-price-prediction/frontend`:

1. *(Optional)* Copy `.env.local.example` to `.env.local` if your backend runs on a custom URL:
   ```bash
   cp .env.local.example .env.local
   ```
   Default: `NEXT_PUBLIC_API_URL=http://localhost:8000`

2. Install dependencies and start the development server:
   ```bash
   npm install
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   npm start
   ```

---

## Author

Made by **DEEP** — [GitHub](https://github.com/Deep-pdf) · `soumodeepsantra5@gmail.com`
