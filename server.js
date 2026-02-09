import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for Flutter web/mobile
app.use(cors());

// Health check
app.get("/", (_, res) => res.send("YT Downloader Backend OK"));

// Info endpoint: returns browser-safe download URL
app.get("/info", (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: "Missing URL" });

  try {
    // Encode URL for safety
    const encodedUrl = encodeURIComponent(url);

    // Browser-safe download link (user clicks in browser)
    const downloadUrl = `https://www.yt-download.org/api/button/mp4/${encodedUrl}`;

    res.json({
      action: "open_browser",
      openUrl: downloadUrl,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to generate download URL" });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
