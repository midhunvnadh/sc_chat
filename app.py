from flask import Flask, send_from_directory, request
from predit import predict_skin_disease
import random
import string
import os

app = Flask(__name__)


def generate_random_string(length):
    letters = string.ascii_lowercase
    return ''.join(random.choice(letters) for _ in range(length))


def delete_file(file_path):
    try:
        os.remove(file_path)
        print(f"File deleted: {file_path}")
    except OSError as e:
        print(f"Error deleting file: {e}")


@app.route('/')
def hello():
    return send_from_directory('public', 'index.html')


@app.route('/<path:filename>')
def serve_file(filename):
    return send_from_directory('public', filename)


@app.route('/submit', methods=['POST'])
def submit():
    files = request.files.getlist('files[]')
    predictions = []
    for file in files:
        filename = file.filename

        random_name = generate_random_string(10)
        random_name += os.path.splitext(filename)[1]
        upload_path = f"uploads/{random_name}"

        file.save(upload_path)
        prediction = predict_skin_disease(upload_path)
        delete_file(upload_path)

        print(f"Saved file in: {upload_path}")
        print(f"Prediction: {prediction}")
        predictions.append(
            {'filename': filename, 'prediction': prediction}
        )
    return predictions


if __name__ == '__main__':
    app.run(debug=True)
