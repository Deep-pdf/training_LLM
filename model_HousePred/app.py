import streamlit as st
import pandas as pd
import numpy as np
import joblib as jb

model= jb.load("models/linear_regression.pkl")

scaler= jb.load("models/scaler.pkl")

features= jb.load("models/features.pkl")

metrics = jb.load("models/metrics.pkl")

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

# Collect all user inputs

input_data = {
    "area": area,
    "bedrooms": bedrooms,
    "stories": stories,
    "parking": parking,
    "mainroad": mainroad,
    "guestroom": guestroom,
    "bathrooms": bathroom,
    "basement": basement,
    "hotwaterheating": hotwaterheating,
    "airconditioning": airconditioning,
    "prefarea": prefarea,
    "furnishingstatus": furnishingstatus
}

input_df= pd.DataFrame([input_data])

# convert yes/no into 1/0
binary_columns= [
    "mainroad",
    "guestroom",
    "basement",
    "hotwaterheating",
    "airconditioning",
    "prefarea"
]

for col in binary_columns:
    input_df[col] = input_df[col].map({
        "yes": 1,
        "no": 0
    })

# Step 4: Apply One-Hot Encoding

input_df = pd.get_dummies(
    input_df,
    columns=["furnishingstatus"]
)

# Step 5: Match training feature columns

input_df = input_df.reindex(
    columns=features,
    fill_value=0
)

# Display prepared data

st.subheader("Prepared Input Data")
st.write(input_df)


# Step 6: Make House Price Prediction

if st.button("Predict House Price"):

    # 1. Scale the user input
    scaled_input = scaler.transform(input_df)

    # 2. Predict the house price
    prediction = model.predict(scaled_input)

    # 3. Extract the predicted value
    predicted_price = prediction[0]

    # 4. Display the result
    st.success("House Price Predicted Successfully!")

    st.subheader("Estimated House Price")

    st.title(f"₹ {predicted_price:,.2f}")


    st.header("Model Performance")

    col1, col2, col3 = st.columns(3)

    col1.metric("R² Score", f"{metrics['R2 Score']:.2%}")
    col2.metric("MAE", f"₹ {metrics['MAE']:,.2f}")
    col3.metric("RMSE", f"₹ {metrics['RMSE']:,.2f}")