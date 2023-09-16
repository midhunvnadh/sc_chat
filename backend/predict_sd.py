import numpy as np
from tensorflow.keras.preprocessing import image
from tensorflow.keras.preprocessing.image import ImageDataGenerator
import tensorflow as tf

# Load the saved model
model_path = 'skin_disease_classifier.h5'
loaded_model = tf.keras.models.load_model(model_path)
img_width, img_height = 300, 225


def get_full_name(label):
    if (label == "akiec"):
        label = "Actinic Keratoses and intraepithelial Carcinoma"
    elif (label == "bcc"):
        label = "Basal Cell Carcinoma"
    elif (label == "bkl"):
        label = "Benign keratosis lesions"
    elif (label == "df"):
        label = "Dermatofibroma"
    elif (label == "mel"):
        label = "Melanoma"
    elif (label == "nv"):
        label = "Melanocytic Nevi"
    elif (label == "vasc"):
        label = "Vascular Lesions"
    else:
        pass
    return label


def predict_skin_disease(image_path):
    # Load the image and preprocess it
    img = image.load_img(image_path, target_size=(img_width, img_height))
    img = image.img_to_array(img)
    img = np.expand_dims(img, axis=0)
    img /= 255.0  # Rescale the image

    # Make prediction
    prediction = loaded_model.predict(img)
    predicted_class = np.argmax(prediction, axis=1)

    # Get the class labels from the generator
    class_labels = list(
        [
            "akiec",
            "bcc",
            "bkl",
            "df",
            "mel",
            "nv",
            "vasc"
        ]
    )

    print(predicted_class)
    # Get the predicted class label
    predicted_label = class_labels[predicted_class[0]]
    predicted_label = get_full_name(predicted_label)

    # Get the prediction probabilities for each class
    prediction_probabilities = {class_labels[i]: float(
        prediction[0][i]) for i in range(len(class_labels))}

    for key, value in prediction_probabilities.items():
        prediction_probabilities[key] = round(value * 100, 2)

    print(prediction_probabilities)

    return predicted_label, prediction_probabilities
