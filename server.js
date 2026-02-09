import express from "express";
import cors from "cors";
import { spawn } from "child_process";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.get("/", (_, res) => res.send("YT Downloader Backend OK"));

app.get("/download", (req, res) => {
  const { url, format } = req.query;
  if (!url) return res.status(400).send("Missing url");

  const filename = `youtube_${Date.now()}.mp4`;
  res.setHeader("Content-Type", "application/octet-stream");
  res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

  const args = ["-f", format || "best", "-o", "-", url];
  console.log("Downloading:", url, "format:", format || "best");

  const yt = spawn("yt-dlp", args);

  yt.stdout.pipe(res);

  yt.stderr.on("data", (data) => console.error(data.toString()));

  yt.on("close", (code) => {
    if (code !== 0) console.error("yt-dlp exited with code", code);
    else console.log("Download finished successfully");
  });

  res.on("close", () => {
    yt.kill();
    console.log("Client disconnected, killed yt-dlp");
  });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
