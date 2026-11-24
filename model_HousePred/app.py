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