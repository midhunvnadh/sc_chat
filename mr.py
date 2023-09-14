import pandas as pd
import tensorflow as tf
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelBinarizer
from sklearn.metrics import accuracy_score
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences
from pre_proc import preprocess_text

# Load the dataset
data = pd.read_csv('dataset_mr/Medicine_description.csv')

# Handle missing values
data.dropna(subset=['Description', 'Drug_Name', 'Reason'], inplace=True)

# Preprocess text data
data['Description'] = data['Description'].apply(lambda x: preprocess_text(x))
data['Reason'] = data['Reason'].apply(lambda x: preprocess_text(x))

# Combine 'Description' and 'Reason' as input features
X = data['Description'] + " " + data['Reason']

# Encode the 'Drug_Name' labels using binary encoding
label_binarizer = LabelBinarizer()
y = label_binarizer.fit_transform(data['Drug_Name'])  # y will be a 2D binary matrix

# Split the data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Tokenize and pad sequences
max_seq_length = 100  # Adjust the maximum sequence length as needed
tokenizer = Tokenizer(num_words=5000)
tokenizer.fit_on_texts(X_train)
X_train_seq = tokenizer.texts_to_sequences(X_train)
X_test_seq = tokenizer.texts_to_sequences(X_test)
X_train_padded = pad_sequences(X_train_seq, maxlen=max_seq_length, padding='post', truncating='post')
X_test_padded = pad_sequences(X_test_seq, maxlen=max_seq_length, padding='post', truncating='post')

# Build a neural network model using TensorFlow/Keras
model = tf.keras.Sequential([
    tf.keras.layers.Embedding(input_dim=5000, output_dim=128, input_length=max_seq_length),
    tf.keras.layers.Flatten(),
    tf.keras.layers.Dense(128, activation='relu'),
    tf.keras.layers.Dense(len(label_binarizer.classes_), activation='sigmoid')  # Use sigmoid for binary classification
])

# Compile the model
model.compile(loss='binary_crossentropy', optimizer='adam', metrics=['accuracy'])

# Train the model
model.fit(X_train_padded, y_train, epochs=10, batch_size=64, validation_split=0.2)

# Evaluate the model on the test set
y_pred = model.predict(X_test_padded)
y_pred_classes = (y_pred > 0.5).astype(int)  # Convert probabilities to binary classes
accuracy = accuracy_score(y_test, y_pred_classes)
print("Model Accuracy:", accuracy)

# Make predictions on user input
user_input = input("Enter your symptoms: ")
user_input = preprocess_text(user_input)
user_input_seq = tokenizer.texts_to_sequences([user_input])
user_input_padded = pad_sequences(user_input_seq, maxlen=max_seq_length, padding='post', truncating='post')
predicted_labels = model.predict(user_input_padded)
predicted_medicine = label_binarizer.inverse_transform(predicted_labels)[0]
print("Predicted Medicine:", predicted_medicine)

