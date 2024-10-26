import os
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # הוספת תמיכה ב-CORS לכל המסלולים

@app.route('/transcribe', methods=['POST'])
def transcribe():
    # מפתח ה-API
    api_key = os.getenv("GROQ_API_KEY")

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
    files_data = {"file": (audio_file.filename, audio_file, "audio/mpeg")}
    headers = {"Authorization": f"Bearer {api_key}"}

    response = requests.post(api_url, headers=headers, params=params, files=files_data)

    # בדיקת התגובה מהשרת
    if response.status_code == 200:
        transcription = response.json()
        transcription_text = transcription.get("text", "No transcription available")
        return jsonify({"text": transcription_text})
    else:
        return jsonify({"error": response.text}), response.status_code

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)
