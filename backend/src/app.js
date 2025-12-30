const express = require("express");
const cors = require("cors");
const Paste = require("./models/Paste");
const { getNow } = require("./utils/time");
const pasteRoutes = require("./routes/paste.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/healthz", (req, res) => {
  res.status(200).json({ ok: true });
});

app.use("/api/pastes", pasteRoutes);

// 🔥 HTML VIEW ROUTE
app.get("/p/:id", async (req, res) => {
  try {
    const paste = await Paste.findById(req.params.id);
    if (!paste) return res.status(404).send("Not Found");

    const now = getNow(req);

    if (paste.expiresAt && paste.expiresAt <= now) {
      return res.status(404).send("Not Found");
    }

    if (paste.maxViews !== null && paste.currentViews >= paste.maxViews) {
      return res.status(404).send("Not Found");
    }

    paste.currentViews += 1;
    await paste.save();

    res.status(200).send(`
      <html>
        <body>
          <pre>${paste.content}</pre>
        </body>
      </html>
    `);
  } catch {
    res.status(404).send("Not Found");
  }
});
module.exports = app;
