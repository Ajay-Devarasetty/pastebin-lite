const mongoose = require("mongoose");

const pasteSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    default: null,
  },
  maxViews: {
    type: Number,
    default: null,
  },
  currentViews: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Paste", pasteSchema);
