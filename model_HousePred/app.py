import streamlit as st
import pandas as pd
import numpy as np
import joblib as jb

model= jb.load("models/linear_regression.pkl")

scaler= jb.load("models/scaler.pkl")

features= jb.load("models/features.pkl")

#Display information

st.title("House Prediction Model")
st.write("House Price Prediction Application")
st.write("Model loaded Successfully")

st.header("Enter house Price")

#Numerical inputs
area= st.number_input(
    "Area(sq. ft.)",
    min_value= 100,
    max_value= 50000,
    value= 5000
)

bedrooms= st.number_input(
    "Bedrooms",
    min_value= 1,
    max_value= 10,
    value= 3
)

bathroom= st.number_input(
    "Bathroom",
    min_value= 1,
    max_value= 10,
    value= 2
)

stories= st.number_input(
    "Stories",
    min_value= 1,
    max_value= 10,
    value= 2
)

parking= st.number_input(
    "Parking Spaces",
    min_value= 0,
    max_value= 5,
    value= 1
)

st.subheader("Additional Features")

mainroad= st.selectbox(
    "Main Road Access",
    ["yes", "no"]
)

guestroom= st.selectbox(
    "Guest Room",
    ["yes", "no"]
)

basement = st.selectbox(
    "Basement",
    ["yes", "no"]
)

hotwaterheating= st.selectbox(
    "Hot water Hearting",
    ["yes", "no"]
)

airconditioning = st.selectbox(
    "Air Conditioning",
    ["yes", "no"]
)

prefarea= st.selectbox(
    "Preferred Area",
    ["yes", "no"]
)

furnishingstatus= st.selectbox(
    "Furnishing Status",
    ["furnished", "semi-furnished", "unfurnished"]
)