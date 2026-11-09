import streamlit as st
import pandas as pd
import joblib

model = joblib.load("Logistic_heart.pkl")
scaler= joblib.load("scaler.pkl")
expected_columns= joblib.load("columns.pkl")

st.title("Heart Stroke Predictor")
st.markdown("Provide the given details")

age= st.slider("Age",18,100,30)
sex= st.radio("Gender",['Male','Female'])
pain= st.selectbox("Choose your Pain: ", ["ATA", "NAP", "TA", "ASY"])
resting_bp= st.number_input("Resting Blood Pressure(mm Hg):",80,200)
cholesterol = st.number_input("Your Colesterol:", 100, 600, 200)
fasting_bs= st.selectbox("Fasting Bloodsugar", [0,1])
resting_ecg= st.selectbox("Resting ECG: ", ["Normal", "ST", "LVH"])
max_hr= st.slider("Max Heart Rate", 60,220,110)
excercise_angina= st.selectbox("Excercise Induced Angina: ",["Y", "N"])
old_peak= st.slider("Old Peak (St Depression):", 1.0, 6.0, 2.0)
st_slope= st.selectbox("ST slope:", ["Up", "Flat", "Down"])

if st.button("Predict"):
    st.success("submited")
    raw_input= {
        "Age": age,
        "Sex": 1 if sex=="Male" else 0,
        "ChestPainType": pain,
        "RestingBP": resting_bp,
        "Cholesterol": cholesterol,
        "FastingBS": fasting_bs,
        "RestingECG": resting_ecg,
        "MaxHR": max_hr,
        "ExerciseAngina": 1 if excercise_angina=="Y" else 0,
        "Oldpeak": old_peak,
        "ST_Slope": st_slope
    }
    df_input= pd.DataFrame([raw_input])

    for col in expected_columns:
        if col not in df_input.columns:
            df_input[col]=0

    df_input= df_input[expected_columns]
    
    scaled_input= scaler.transform(df_input)
    predict= model.predict(scaled_input)[0]

    if predict == 1:
        st.error("High Risk of Heart Disease")
    else:
        st.success("Low Risk of Heart Diseasse")