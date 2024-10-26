async function transcribeAudio() {
    const fileInput = document.getElementById('audioFile');
    if (fileInput.files.length === 0) {
        alert("Please select an audio file first.");
        return;
    }

    const audioFile = fileInput.files[0];
    const apiKey = "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"; // שים כאן את ה-API Key שלך באופן זמני

    try {
        const formData = new FormData();
        formData.append("file", audioFile);
        formData.append("model", "whisper-large-v3-turbo");
        formData.append("language", "he");

        const response = await fetch("https://api.groq.com/audio/transcriptions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`
            },
            body: formData
        });

        if (!response.ok) {
            throw new Error("Error in transcription");
        }

        const result = await response.json();
        document.getElementById("transcriptionResult").innerText = result.text;

    } catch (error) {
        console.error("Error:", error);
        alert("Failed to transcribe audio. Please try again later.");
    }
}
