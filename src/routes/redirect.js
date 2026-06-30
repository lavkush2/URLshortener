const express = require('express');
const URL = require('../models/URL');
const Analytics = require('../models/Analytics');

const router = express.Router();

// Get client info from request
const getClientInfo = (req) => {
  return {
    ipAddress: req.ip || req.connection.remoteAddress,
    userAgent: req.get('user-agent'),
    referrer: req.get('referrer') || 'direct',
  };
};

// Redirect to original URL
router.get('/:code', async (req, res) => {
  try {
    const { code } = req.params;

    const url = await URL.findOne({
      $or: [{ shortCode: code }, { customAlias: code }],
      isActive: true,
    });

    if (!url) {
      return res.status(404).json({ success: false, message: 'URL not found or expired' });
    }

    // Check expiration
    if (url.expiresAt && new Date() > url.expiresAt) {
      return res.status(410).json({ success: false, message: 'URL has expired' });
    }

    // Record analytics
    const clientInfo = getClientInfo(req);
    await Analytics.create({
      urlId: url._id,
      userId: url.userId,
      ...clientInfo,
    });

    // Update click count
    await URL.findByIdAndUpdate(url._id, { $inc: { clicks: 1 } });

    // Redirect
    res.redirect(301, url.originalUrl);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Preview URL without redirecting
router.get('/:code/preview', async (req, res) => {
  try {
    const { code } = req.params;

    const url = await URL.findOne({
      $or: [{ shortCode: code }, { customAlias: code }],
      isActive: true,
    });

    if (!url) {
      return res.status(404).json({ success: false, message: 'URL not found or expired' });
    }

    if (url.expiresAt && new Date() > url.expiresAt) {
      return res.status(410).json({ success: false, message: 'URL has expired' });
    }

    res.status(200).json({
      success: true,
      data: {
        title: url.title,
        description: url.description,
        originalUrl: url.originalUrl,
        shortCode: url.shortCode,
        clicks: url.clicks,
        createdAt: url.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
