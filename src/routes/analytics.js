const express = require('express');
const Analytics = require('../models/Analytics');
const URL = require('../models/URL');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Get analytics for a specific URL
router.get('/:code', authMiddleware, async (req, res) => {
  try {
    const { code } = req.params;

    const url = await URL.findOne({
      $or: [{ shortCode: code }, { customAlias: code }],
      userId: req.user._id,
    });

    if (!url) {
      return res.status(404).json({ success: false, message: 'URL not found' });
    }

    const analytics = await Analytics.find({ urlId: url._id }).sort({ createdAt: -1 });

    const summary = {
      totalClicks: url.clicks,
      uniqueIPs: new Set(analytics.map((a) => a.ipAddress)).size,
      topReferrers: analytics.reduce((acc, curr) => {
        const existing = acc.find((a) => a.referrer === curr.referrer);
        if (existing) {
          existing.count++;
        } else {
          acc.push({ referrer: curr.referrer, count: 1 });
        }
        return acc;
      }, []),
      topBrowsers: analytics.reduce((acc, curr) => {
        const existing = acc.find((a) => a.browser === curr.browser);
        if (existing) {
          existing.count++;
        } else {
          acc.push({ browser: curr.browser, count: 1 });
        }
        return acc;
      }, []),
    };

    res.status(200).json({
      success: true,
      data: {
        url: {
          originalUrl: url.originalUrl,
          shortCode: url.shortCode,
          title: url.title,
          createdAt: url.createdAt,
        },
        summary,
        recentClicks: analytics.slice(0, 10),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get summary analytics for all URLs
router.get('/stats/summary', authMiddleware, async (req, res) => {
  try {
    const urls = await URL.find({ userId: req.user._id });

    const totalUrls = urls.length;
    const totalClicks = urls.reduce((sum, url) => sum + url.clicks, 0);

    const urlStats = urls.map((url) => ({
      id: url._id,
      title: url.title,
      shortCode: url.shortCode,
      clicks: url.clicks,
      createdAt: url.createdAt,
    }));

    res.status(200).json({
      success: true,
      data: {
        totalUrls,
        totalClicks,
        averageClicks: totalUrls > 0 ? (totalClicks / totalUrls).toFixed(2) : 0,
        urls: urlStats,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Export analytics as JSON
router.get('/:code/export', authMiddleware, async (req, res) => {
  try {
    const { code } = req.params;

    const url = await URL.findOne({
      $or: [{ shortCode: code }, { customAlias: code }],
      userId: req.user._id,
    });

    if (!url) {
      return res.status(404).json({ success: false, message: 'URL not found' });
    }

    const analytics = await Analytics.find({ urlId: url._id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: {
        url: url.originalUrl,
        shortCode: url.shortCode,
        exportDate: new Date(),
        totalClicks: url.clicks,
        analytics,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
