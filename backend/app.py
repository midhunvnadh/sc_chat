from flask import Flask, send_from_directory, request 
import random
import string
import os

from get_best_medicines import find_medicine
from flask_cors import CORS
from predict_sd import predict_skin_disease
from get_mr_reasons import get_reasons

app = Flask(__name__)
CORS(app)

def generate_random_string(length):
    letters = string.ascii_lowercase
    return ''.join(random.choice(letters) for _ in range(length))


def delete_file(file_path):
    try:
        os.remove(file_path)
        print(f"File deleted: {file_path}")
    except OSError as e:
        print(f"Error deleting file: {e}")

def create_dir_if_not_exists(dir_path):
    if not os.path.exists(dir_path):
        os.makedirs(dir_path)
        print(f"Created directory: {dir_path}")

@app.route('/submit', methods=['POST'])
def submit():
    create_dir_if_not_exists('uploads')
    files = request.files.getlist('file[]')
    predictions = []
    for file in files:
        filename = file.filename

        random_name = generate_random_string(10)
        random_name += os.path.splitext(filename)[1]
        upload_path = f"uploads/{random_name}"

        file.save(upload_path)
        prediction, acc = predict_skin_disease(upload_path)
        delete_file(upload_path)

        print(f"Saved file in: {upload_path}")
        print(f"Prediction: {prediction}")
        predictions.append(
            {'filename': filename, 'prediction': prediction, 'accuracy': acc}
        )
    return predictions

@app.route('/medicines', methods=['GET'])
def medicines():
    try:
        query = request.args.get('query')
        query = query.lower()
        reason = None
        try:
            reason = request.args.get('reason')
            reason = reason.lower()
        except:
            pass
    except:
        return "Invalid request"
    print(f"Query: {query}")
    medicines = find_medicine(query, reason)
    return medicines


@app.route('/medicine_reasons', methods=['GET'])
def medicine_reasons():
    reasons = get_reasons()
    return reasons


if __name__ == '__main__':
    app.run(debug=True)
