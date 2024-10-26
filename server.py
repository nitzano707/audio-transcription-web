import os
import requests
from flask import Flask, request, jsonify

app = Flask(__name__)

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
    files = {"file": (audio_file.filename, audio_file, "audio/m4a")}
    headers = {"Authorization": f"Bearer {api_key}"}

    response = requests.post(api_url, headers=headers, params=params, files=files)

    # בדיקת התגובה מהשרת
    if response.status_code == 200:
        transcription = response.json()
        return jsonify({"text": transcription.get("text", "No transcription available")})
    else:
        return jsonify({"error": response.text}), response.status_code

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)
