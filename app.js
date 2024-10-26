async function transcribeAudio() {
    const fileInput = document.getElementById('audioFile');
    if (fileInput.files.length === 0) {
        alert("Please select an audio file first.");
        return;
    }

    const audioFile = fileInput.files[0];
    const apiUrl = "https://<YOUR_RENDER_SERVER_URL>/transcribe"; // החלף בכתובת השרת מ-Render

    try {
        const formData = new FormData();
        formData.append("audio", audioFile);

        const response = await fetch(apiUrl, {
            method: "POST",
            body: formData
        });

        if (!response.ok) {
            throw new Error("Error in transcription: " + response.statusText);
        }

        const result = await response.json();
        document.getElementById("transcriptionResult").innerText = result.text;

    } catch (error) {
        console.error("Error:", error);
        alert("Failed to transcribe audio. Please try again later.");
    }
}
