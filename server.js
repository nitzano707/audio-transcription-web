const express = require('express');
const fs = require('fs');
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');

const app = express();

// הגדרת המיקום בו קובץ האודיו יישמר זמנית
const upload = multer({ dest: 'uploads/' });

// נקודת קצה להעלאת קובץ האודיו ולביצוע תמלול
app.post('/transcribe', upload.single('audio'), async (req, res) => {
    const audioFilePath = req.file.path;

    try {
        // קריאת הקובץ כ-Stream
        const fileStream = fs.createReadStream(audioFilePath);

        // יצירת FormData לצורך שליחת הקובץ ל-API
        const formData = new FormData();
        formData.append("file", fileStream);
        formData.append("model", "whisper-large-v3-turbo");
        formData.append("temperature", 0);
        formData.append("response_format", "verbose_json");
        formData.append("language", "he");
        formData.append("prompt", "");

        // הגדרת הבקשה ל-Groq API
        const response = await axios.post('https://api.groq.com/audio/transcriptions', formData, {
            headers: {
                'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
                ...formData.getHeaders() // להוסיף את הכותרות המתאימות ל-FormData
            }
        });

        // החזרת התמלול לדפדפן
        res.json({ text: response.data.text });
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
