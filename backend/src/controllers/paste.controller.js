const Paste = require("../models/Paste");
const { getNow } = require("../utils/time");

exports.createPaste = async (req, res) => {
  try {
    const { content, ttl_seconds, max_views } = req.body;

    if (!content || typeof content !== "string" || !content.trim()) {
      return res.status(400).json({ message: "Content is required" });
    }

    let expiresAt = null;

    if (ttl_seconds !== undefined) {
      if (!Number.isInteger(ttl_seconds) || ttl_seconds < 1) {
        return res.status(400).json({ message: "Invalid ttl_seconds" });
      }
      expiresAt = new Date(Date.now() + ttl_seconds * 1000);
    }

    if (max_views !== undefined) {
      if (!Number.isInteger(max_views) || max_views < 1) {
        return res.status(400).json({ message: "Invalid max_views" });
      }
    }

    const paste = await Paste.create({
      content,
      expiresAt,
      maxViews: max_views ?? null,
    });

    res.status(201).json({
      id: paste._id,
      url: `${process.env.BASE_URL}/p/${paste._id}`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getPaste = async (req, res) => {
  try {
    const paste = await Paste.findById(req.params.id);
    if (!paste) {
      return res.status(404).json({ message: "Paste not found" });
    }

    const now = getNow(req);

    // TTL check
    if (paste.expiresAt && paste.expiresAt <= now) {
      return res.status(404).json({ message: "Paste expired" });
    }

    // View limit check
    if (paste.maxViews !== null && paste.currentViews >= paste.maxViews) {
      return res.status(404).json({ message: "View limit exceeded" });
    }

    // Count view
    paste.currentViews += 1;
    await paste.save();

    res.status(200).json({
      content: paste.content,
      remaining_views:
        paste.maxViews !== null ? paste.maxViews - paste.currentViews : null,
      expires_at: paste.expiresAt,
    });
  } catch (err) {
    res.status(404).json({ message: "Paste not found" });
  }
};
