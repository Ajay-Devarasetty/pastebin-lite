require("dotenv").config();
const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 5000;

connectDB();

app.get("/api/healthz", async (req, res) => {
  const mongoose = require("mongoose");
  res.json({ ok: mongoose.connection.readyState === 1 });
});

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
