import os
import requests
from flask import Flask, request, jsonify
from groq import Groq
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))

@app.route('/transcribe', methods=['POST'])
def transcribe():
    # קבלת קובץ האודיו מהבקשה
    if 'audio' not in request.files:
        return jsonify({"error": "No audio file provided"}), 400

    audio_file = request.files['audio']
    api_url = "https://api.groq.com/audio/transcriptions"

    # הגדרת הפרמטרים לבקשה
    params = {
        "model": "whisper-large-v3-turbo",
        "language": "he",
        "response_format": "verbose_json",
        "temperature": 0,
        "prompt": ""
    }

    # שליחת הקובץ ל-API של Groq
    try:
        with open(audio_file, "rb") as file:
            transcription = groq_client.audio.transcriptions.create(
                file=(audio_file.filename, file.read()),
                model=params["model"],
                language=params["language"],
                response_format=params["response_format"],
            )
            transcription_text = transcription.text
            return jsonify({"text": transcription_text})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/', methods=['GET'])
def home():
    return "Welcome to the Audio Transcription API!"

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)
