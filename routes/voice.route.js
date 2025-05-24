import express from "express";
import multer from "multer";
import axios from "axios";
import fs from "fs";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// POST /api/voice/command
router.post("/command", upload.single("audio"), async (req, res) => {
  const language = req.query.language || "en";

  if (!req.file) {
    return res.status(400).json({ message: "No audio file uploaded" });
  }

  try {
    const audioFile = fs.createReadStream(req.file.path);

    const response = await axios.post(
      "http://localhost:5000/voice/process", // Python microservice
      {
        language,
        audio: audioFile,
      },
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    fs.unlinkSync(req.file.path); // Clean up temp audio

    res.json({
      message: "Voice processed",
      command: response.data.command,
      intent: response.data.intent,
      response: response.data.response,
    });
  } catch (error) {
    console.error("Error sending audio to AI:", error);
    res.status(500).json({ error: "Voice processing failed" });
  }
});

export default router;
