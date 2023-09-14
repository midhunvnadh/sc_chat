import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report
from pre_proc import preprocess_text

# Load the dataset
data = pd.read_csv('dataset_mr/Medicine_description.csv')

# Preprocess the text data (you can use libraries like NLTK or spaCy for this)
# Assuming you have a function preprocess_text(text) for text preprocessing

data['preprocessed_description'] = data['Description'].apply(preprocess_text)

# Create a list of predefined symptom tags
symptom_tags = data['Reason'].unique().tolist()

# Split the data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(data['preprocessed_description'], data[symptom_tags], test_size=0.2, random_state=42)

# TF-IDF vectorization
tfidf_vectorizer = TfidfVectorizer(max_features=1000)  # You can adjust the number of features as needed
X_train_tfidf = tfidf_vectorizer.fit_transform(X_train)
X_test_tfidf = tfidf_vectorizer.transform(X_test)

# Train a logistic regression classifier
clf = LogisticRegression()
clf.fit(X_train_tfidf, y_train)

# Predict symptom tags for new medicines
new_medicine_description = ["Your new medicine description here"]
new_medicine_tfidf = tfidf_vectorizer.transform(new_medicine_description)
predicted_tags = clf.predict(new_medicine_tfidf)

# Print the predicted tags
print(predicted_tags)
