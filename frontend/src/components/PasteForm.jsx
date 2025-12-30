import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
} from "@mui/material";
import { createPaste } from "../api/pasteApi";

function PasteForm() {
  const [content, setContent] = useState("");
  const [ttl, setTtl] = useState("");
  const [maxViews, setMaxViews] = useState("");
  const [resultUrl, setResultUrl] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResultUrl("");

    if (!content.trim()) {
      setError("Content is required");
      return;
    }

    const payload = { content };
    if (ttl) payload.ttl_seconds = Number(ttl);
    if (maxViews) payload.max_views = Number(maxViews);

    try {
      const res = await createPaste(payload);
      setResultUrl(res.url);
      setContent("");
      setTtl("");
      setMaxViews("");
    } catch (err) {
      setError(err.message || "Something went wrong");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f7fa",
      }}
    >
      <Paper elevation={4} sx={{ p: 4, width: "100%", maxWidth: 500 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Create a Paste
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <TextField
            label="Paste Content"
            multiline
            rows={6}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />

          <TextField
            label="TTL (seconds)"
            type="number"
            value={ttl>0 ? ttl : ''}
            onChange={(e) => setTtl(e.target.value)}
          />

          <TextField
            label="Max Views"
            type="number"
            value={maxViews>0 ? maxViews : ''}
            onChange={(e) => setMaxViews(e.target.value)}
          />

          <Button variant="contained" type="submit" size="large">
            Create Paste
          </Button>

          {error && (
            <Typography color="error" align="center">
              {error}
            </Typography>
          )}

          {resultUrl && (
            <Typography align="center">
              Share URL:{" "}
              <a href={resultUrl} target="_blank" rel="noreferrer">
                {resultUrl}
              </a>
            </Typography>
          )}
        </Box>
      </Paper>
    </Box>
  );
}

export default PasteForm;