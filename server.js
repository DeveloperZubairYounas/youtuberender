import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for all origins
app.use(cors());

// Health check
app.get("/", (_, res) => res.send("YT Downloader Backend OK"));

// Info endpoint (optional)
app.get("/info", (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: "Missing url" });

  // Respond with action for Flutter app
  res.json({
    action: "open_browser",
    openUrl: `https://www.yt-download.org/api/button/mp4/${encodeURIComponent(
      url
    )}`, // Using a free YouTube download service for demo
  });
});

// Download endpoint (optional direct redirect)
app.get("/download", (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).send("Missing url");

  // Redirect the browser to a downloader page (works like click-to-download)
  const downloadUrl = `https://www.yt-download.org/api/button/mp4/${encodeURIComponent(
    url
  )}`;
  res.redirect(downloadUrl);
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
