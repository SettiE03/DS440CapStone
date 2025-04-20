from flask import Flask, request, jsonify
from flask_cors import CORS
from newspaper import Article
from lime.lime_text import LimeTextExplainer
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.sequence import pad_sequences
import pickle
import re
import nltk
import numpy as np
import requests
import fitz
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from nltk.stem import PorterStemmer
from pyngrok import ngrok
import smtplib
from email.mime.text import MIMEText

#NLTK setup
nltk.download('punkt')
nltk.download('stopwords')
nltk.download('punkt_tab')

#Flask setup
app = Flask(__name__)
CORS(app)

#Preprocessing function
def preprocess_text(text):
    text = text.lower()
    text = re.sub(r'https?://\S+|www\.\S+', '', text)
    text = re.sub(r'<.*?>', '', text)
    text = re.sub(r'[^a-z\s]', '', text)
    tokens = word_tokenize(text)
    stop_words = set(stopwords.words('english'))
    tokens = [w for w in tokens if w not in stop_words]
    stemmer = PorterStemmer()
    stemmed_tokens = [stemmer.stem(w) for w in tokens]
    return " ".join(stemmed_tokens)

#Load model and tokenizer
model = load_model("lstm_model.h5")
with open("tokenizer.pkl", "rb") as f:
    tokenizer = pickle.load(f)

MAXLEN = 200

#LIME explanation function
def explain_with_lime(model, tokenizer, text, maxlen=MAXLEN):
    explainer = LimeTextExplainer(class_names=["fake", "real"])

    def predict_proba(texts):
        sequences = tokenizer.texts_to_sequences(texts)
        padded = pad_sequences(sequences, maxlen=maxlen)
        probs = model.predict(padded, verbose=0)
        return np.hstack([1 - probs, probs])

    exp = explainer.explain_instance(text, predict_proba, num_features=10)
    return [word for word, _ in exp.as_list()]

#Extract text from PDF
def extract_text_from_pdf(url):
    headers = {
        "User-Agent": (
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
            "AppleWebKit/537.36 (KHTML, like Gecko) "
            "Chrome/122.0.0.0 Safari/537.36"
        )
    }
    response = requests.get(url, headers=headers)
    if response.status_code != 200:
        raise ValueError("Failed to download PDF.")

    with open("temp.pdf", "wb") as f:
        f.write(response.content)

    text = ""
    doc = fitz.open("temp.pdf")
    for page in doc:
        text += page.get_text()
    return text

#Main API endpoint
@app.route("/analyze", methods=["POST"])
def analyze():
    try:
        url = request.json.get("url")
        if not url or not url.startswith("http"):
            return jsonify({"error": "Invalid or missing URL"}), 400

        headers = {
            "User-Agent": (
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/122.0.0.0 Safari/537.36"
            )
        }

        if url.lower().endswith(".pdf"):
            try:
                raw_text = extract_text_from_pdf(url)
            except Exception as e:
                return jsonify({"error": f"PDF extraction failed: {str(e)}"}), 400
        else:
            article = Article(url, request_headers=headers)
            try:
                article.download()
                article.parse()
                raw_text = article.text
            except Exception as e:
                return jsonify({"error": f"Failed to fetch article: {str(e)}"}), 400

        if not raw_text.strip():
            return jsonify({"error": "Could not extract article text."}), 400

        processed = preprocess_text(raw_text)
        sequence = tokenizer.texts_to_sequences([processed])
        padded = pad_sequences(sequence, maxlen=MAXLEN)
        prob = model.predict(padded, verbose=0)[0][0]
        credibility = "High" if prob < 0.5 else "Low"
        keywords = explain_with_lime(model, tokenizer, raw_text)

        return jsonify({
            "probability": float(prob),
            "credibility": credibility,
            "keywords": keywords
        })

    except Exception as e:
        print(f"❌ Error occurred: {e}")
        return jsonify({"error": str(e)}), 500

#Feedback route sends feedback to my email
@app.route("/send-feedback", methods=["POST"])
def send_feedback():
    data = request.get_json()
    feedback = data.get("feedback", "")

    sender_email = "ds440capstone@gmail.com"
    receiver_email = "ds440capstone@gmail.com"
    app_password = "mvmaqmzwknkwgstb"

    subject = "New Fake News Detector Feedback"
    body = f"Feedback submitted:\n\n{feedback}"

    msg = MIMEText(body)
    msg["Subject"] = subject
    msg["From"] = sender_email
    msg["To"] = receiver_email

    try:
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login(sender_email, app_password)
            server.sendmail(sender_email, receiver_email, msg.as_string())
        return jsonify({"message": "Feedback sent!"}), 200
    except Exception as e:
        print("Email failed:", e)
        return jsonify({"message": "Failed to send feedback"}), 500

#Start server with ngrok
public_url = ngrok.connect(5000)
print(f"🔗 Your public API URL: {public_url}/analyze")
app.run(port=5000)


# Load LSTM model and tokenizer
model = load_model("lstm_model.h5")
with open("tokenizer.pkl", "rb") as f:
    tokenizer = pickle.load(f)

MAX_LEN = 200

# LIME explainer setup
class_names = ['Fake', 'Real']
explainer = LimeTextExplainer(class_names=class_names)

@app.route('/analyze', methods=['POST'])
def analyze_article():
    data = request.get_json()
    url = data.get("url", "")
    
    if not url:
        return jsonify({"error": "No URL provided"}), 400

    try:
        article = Article(url)
        article.download()
        article.parse()
        content = article.text
    except Exception as e:
        return jsonify({"error": f"Article scraping failed: {str(e)}"}), 500

    processed = preprocess_text(content)
    sequence = tokenizer.texts_to_sequences([processed])
    padded = pad_sequences(sequence, maxlen=MAX_LEN)

    prediction = model.predict(padded)[0][0]
    label = "Real" if prediction > 0.5 else "Fake"
    probability = float(prediction) if prediction > 0.5 else float(1 - prediction)
    credibility_score = round(probability * 100, 2)

    # LIME explanation
    def predictor(texts):
        sequences = tokenizer.texts_to_sequences(texts)
        padded = pad_sequences(sequences, maxlen=MAX_LEN)
        return np.array([[1 - model.predict(p)[0][0], model.predict(p)[0][0]] for p in padded])

    explanation = explainer.explain_instance(processed, predictor, num_features=10)
    keywords = [word for word, weight in explanation.as_list()]

    return jsonify({
        "label": label,
        "probability": round(probability, 4),
        "credibility_score": credibility_score,
        "keywords": keywords
    })

if __name__ == '__main__':
    app.run()
