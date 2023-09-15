import numpy as np
from tensorflow.keras.preprocessing import image
from tensorflow.keras.preprocessing.image import ImageDataGenerator
import tensorflow as tf

# Load the saved model
model_path = 'skin_disease_classifier.h5'
loaded_model = tf.keras.models.load_model(model_path)
img_width, img_height = 300, 225

datagen = ImageDataGenerator(
    rescale=1.0 / 255.0,
    rotation_range=20,
    width_shift_range=0.2,
    height_shift_range=0.2,
    shear_range=0.2,
    zoom_range=0.2,
    horizontal_flip=True,
    fill_mode='nearest'
)


data_dir = 'dataset/sd/dataset'
batch_size = 32
generator = datagen.flow_from_directory(
    data_dir,
    target_size=(img_width, img_height),
    batch_size=batch_size,
    class_mode='categorical'
)

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
    class_labels = list(generator.class_indices.keys())

    # Get the predicted class label
    predicted_label = class_labels[predicted_class[0]]
    
    # Get the prediction probabilities for each class
    prediction_probabilities = {class_labels[i]: float(prediction[0][i]) for i in range(len(class_labels))}

    return predicted_label, prediction_probabilities 