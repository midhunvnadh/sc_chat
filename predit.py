import os
import numpy as np
from PIL import Image
import pickle
import pandas as pd
from dataset_gen import process_file

model_filename = "skin_disease_model.pkl"
with open(model_filename, "rb") as file:
    model = pickle.load(file)


def predict_skin_disease(image_path):
    # Load and preprocess the image data
    pattern = r"[-+]?\d*\.\d+|\d+"
    image_data = pd.DataFrame([process_file(image_path)])
    image_data.drop("Variance", axis=1, inplace=True)
    image_data.drop("Mode", axis=1, inplace=True)
    image_data.drop("target", axis=1, inplace=True)

    column_names = ['Hue Histogram', 'Saturation Histogram', 'Value Histogram']
    for column_name in column_names:
        image_data[column_name] = image_data[column_name].astype(
            str).str.findall(pattern).apply(lambda x: [float(v) for v in x])
        image_data[column_name] = image_data[column_name].apply(
            lambda x: x if len(x) > 0 else [float('NaN')])
        image_data[column_name] = pd.to_numeric(
            image_data[column_name].str[0], errors='coerce')

    # Make the prediction
    prediction = model.predict(image_data.drop("Image", axis=1))

    return prediction[0]


if __name__ == "__main__":
    dataset_path = "dataset/"
    actual_labels = []
    predicted_labels = []

    disease_folders = os.listdir(dataset_path)
    for folder in disease_folders:
        folder_path = os.path.join(dataset_path, folder)
        if not os.path.isdir(folder_path):
            continue

        label = folder

        image_files = os.listdir(folder_path)
        for image_file in image_files:
            image_path = os.path.join(folder_path, image_file)
            if not os.path.isfile(image_path):
                continue

            predicted_disease = predict_skin_disease(image_path)

            actual_labels.append(label)
            predicted_labels.append(predicted_disease)
        break

    accuracy = (np.array(actual_labels) == np.array(
        predicted_labels)).mean() * 100
    print("Accuracy:", accuracy)
