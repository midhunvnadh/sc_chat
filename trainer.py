from sklearn.metrics import accuracy_score
from sklearn.model_selection import GridSearchCV
from sklearn.metrics import accuracy_score
from sklearn.ensemble import RandomForestClassifier, IsolationForest
from sklearn.model_selection import train_test_split
from imblearn.over_sampling import SMOTE
import numpy as np
import pandas as pd
import pickle

data = pd.read_excel('dataset.xlsx')
data.drop("Variance", axis=1, inplace=True)
data.drop("Mode", axis=1, inplace=True)
print(data.head())

column_names = ['Hue Histogram', 'Saturation Histogram', 'Value Histogram']
pattern = r"[-+]?\d*\.\d+|\d+"
for column_name in column_names:
    data[column_name] = data[column_name].astype(str).str.findall(
        pattern).apply(lambda x: [float(v) for v in x])
    data[column_name] = data[column_name].apply(
        lambda x: x if len(x) > 0 else [float('NaN')])
    data[column_name] = pd.to_numeric(
        data[column_name].str[0], errors='coerce')

print("Starting Grid Search...")
rfc = RandomForestClassifier(random_state=66, n_jobs=12)

param_grid = {
    'n_estimators': [100, 200, 300],
    'max_depth': [None, 5, 10]
}

features = data.drop("Image", axis=1)

print("Converting data to numpy arrays...")

non_numeric_rows = features.apply(lambda x: pd.to_numeric(
    x, errors='coerce').isna().any(), axis=1)

X = features.drop("target", axis=1).apply(pd.to_numeric, errors='coerce')
y = features["target"]


smote = SMOTE(random_state=42)
outlier_detector = IsolationForest(contamination=0.1)
outlier_detector.fit(X)

# Predict outliers
outliers = outlier_detector.predict(X)
outliers = np.where(outliers == -1)[0]

# Get the outlier instances and their corresponding labels
outlier_instances = X.iloc[outliers]
outlier_labels = y.iloc[outliers]

# Print the outlier instances and their corresponding labels
print("Outlier Instances:")
print(outlier_instances)
print("Outlier Labels:")
print(outlier_labels)

non_outlier_instances = X.drop(outlier_instances.index)
non_outlier_labels = y.drop(outlier_instances.index)
X_resampled, y_resampled = smote.fit_resample(
    non_outlier_instances, non_outlier_labels
)

print("Data converted to numpy arrays!")

X_train, X_test, y_train, y_test = train_test_split(
    X_resampled, y_resampled, test_size=0.2, random_state=42
)
print("Data split!")

print("Flattening the image data...")
grid_search = GridSearchCV(rfc, param_grid, cv=5, n_jobs=12)
grid_search.fit(X_train, y_train)
print("Image data flattened!")

best_params = grid_search.best_params_
print("Best Hyperparameters:", best_params)

print("Training the classifier...")
best_model = RandomForestClassifier(**best_params, random_state=42, n_jobs=12)
best_model.fit(X_train, y_train)
print("Training completed!")

print("Calculating accuracy on the testing data...")
rfc_pred = best_model.predict(X_test)
rfc_accuracy = accuracy_score(y_test, rfc_pred)
print("Tuned Random Forest Accuracy:", rfc_accuracy)

# Save the model to a file
model_filename = "skin_disease_model.pkl"
with open(model_filename, "wb") as file:
    pickle.dump(best_model, file)
