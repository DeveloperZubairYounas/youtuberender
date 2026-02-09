// server.js
import express from "express";
import cors from "cors";
import { spawn } from "child_process";

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for all origins (Flutter mobile can download)
app.use(cors());

// Health check
app.get("/", (_, res) => res.send("YT Downloader Backend OK"));

// Download endpoint
app.get("/download", (req, res) => {
  const { url, format } = req.query;

  if (!url) return res.status(400).send({ error: "Missing url" });

  const safeName = `youtube_${Date.now()}.mp4`;

  // Set headers for direct download
  res.setHeader("Content-Type", "application/octet-stream");
  res.setHeader("Content-Disposition", `attachment; filename="${safeName}"`);

  // yt-dlp args: stream to stdout
  const args = ["-f", format || "best", "-o", "-", url];

  console.log("Downloading:", url, "format:", format || "best");

  const yt = spawn("yt-dlp", args);

  // Pipe video stream to client
  yt.stdout.pipe(res);

  yt.stderr.on("data", (data) => console.error("yt-dlp:", data.toString()));

  yt.on("close", (code) => {
    if (code !== 0) console.error("yt-dlp exited with code", code);
    else console.log("Download finished successfully");
  });

  // Handle client abort
  res.on("close", () => {
    yt.kill();
    console.log("Client disconnected, killed yt-dlp");
  });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
