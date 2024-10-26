const express = require('express');
const fs = require('fs');
const multer = require('multer');
const Groq = require('groq-sdk');

const app = express();
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// הגדרת המיקום בו קובץ האודיו יישמר זמנית
const upload = multer({ dest: 'uploads/' });

// נקודת קצה להעלאת קובץ האודיו ולביצוע תמלול
app.post('/transcribe', upload.single('audio'), async (req, res) => {
    const audioFilePath = req.file.path;

    try {
        // ביצוע תמלול באמצעות ה-Groq SDK
        const transcription = await groq.audio.transcriptions.create({
            file: fs.createReadStream(audioFilePath),
            model: 'whisper-large-v3-turbo',
            language: 'he',
            response_format: 'verbose_json',
        });

        // החזרת התמלול לדפדפן
        res.json({ text: transcription.text });
    } catch (error) {
        console.error("Error in transcription:", error);
        res.status(500).send('Error in transcription');
    } finally {
        // מחיקת קובץ האודיו הזמני
        fs.unlink(audioFilePath, (err) => {
            if (err) {
                console.error("Error deleting file:", err);
            }
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
