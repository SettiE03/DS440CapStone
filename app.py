from flask import Flask, request, jsonify
from flask_cors import CORS
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.sequence import pad_sequences
import pickle
import numpy as np
import nltk
import re

nltk.download('punkt')
nltk.download('stopwords')
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from nltk.stem import PorterStemmer

app = Flask(__name__)
CORS(app)

# Load model and tokenizer
model = load_model("lstm_model.h5")
with open("tokenizer.pkl", "rb") as f:
    tokenizer = pickle.load(f)

MAXLEN = 200  # Make sure this matches your training script

def preprocess_text(text):
    text = text.lower()
    text = re.sub(r"https?://\S+|www\.\S+", "", text)
    text = re.sub(r"<.*?>", "", text)
    text = re.sub(r"[^a-z\s]", "", text)
    tokens = word_tokenize(text)
    stop_words = set(stopwords.words("english"))
    tokens = [w for w in tokens if w not in stop_words]
    stemmed = [PorterStemmer().stem(w) for w in tokens]
    return " ".join(stemmed)

@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()
    text = data.get("text", "")
    if not text:
        return jsonify({"error": "No text provided"}), 400

    preprocessed = preprocess_text(text)
    sequence = tokenizer.texts_to_sequences([preprocessed])
    padded = pad_sequences(sequence, maxlen=MAXLEN)
    prob = model.predict(padded)[0][0]
    label = "real" if prob >= 0.5 else "fake"

    return jsonify({
        "prediction": label,
        "probability": round(float(prob), 4)
    })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)