const express = require('express');
const URL = require('../models/URL');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');
const { validateRequest, schemas } = require('../middleware/validation');
const { generateShortCode, isValidAlias } = require('../utils/generateShortCode');
const { generateQRCode } = require('../utils/qrCode');

const router = express.Router();

// Create shortened URL
router.post('/shorten', authMiddleware, validateRequest(schemas.shortenUrl), async (req, res) => {
  try {
    const { originalUrl, customAlias, title, description, expiresAt, tags } = req.body;

    let shortCode = customAlias;

    if (customAlias) {
      if (!isValidAlias(customAlias)) {
        return res.status(400).json({
          success: false,
          message: 'Custom alias must be 3-20 characters (alphanumeric, -, _)',
        });
      }

      const aliasExists = await URL.findOne({ customAlias });
      if (aliasExists) {
        return res.status(400).json({ success: false, message: 'Custom alias already taken' });
      }
    } else {
      let isUnique = false;
      while (!isUnique) {
        shortCode = generateShortCode();
        const existing = await URL.findOne({ shortCode });
        isUnique = !existing;
      }
    }

    const url = new URL({
      userId: req.user._id,
      originalUrl,
      shortCode,
      customAlias: customAlias || null,
      title: title || originalUrl.substring(0, 100),
      description,
      expiresAt: expiresAt || null,
      tags: tags || [],
    });

    await url.save();

    // Update user stats
    await User.findByIdAndUpdate(req.user._id, { $inc: { totalUrls: 1 } });

    const shortUrl = `${process.env.BASE_URL}/${shortCode}`;
    const qrCode = await generateQRCode(shortUrl);

    res.status(201).json({
      success: true,
      message: 'URL shortened successfully',
      data: {
        ...url.toObject(),
        shortUrl,
        qrCode,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all URLs
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { sortBy = 'createdAt', order = 'desc', search } = req.query;
    const filter = { userId: req.user._id };

    if (search) {
      filter.$or = [
        { originalUrl: { $regex: search, $options: 'i' } },
        { title: { $regex: search, $options: 'i' } },
        { shortCode: { $regex: search, $options: 'i' } },
      ];
    }

    const urls = await URL.find(filter).sort({ [sortBy]: order === 'desc' ? -1 : 1 });

    res.status(200).json({
      success: true,
      count: urls.length,
      data: urls,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get single URL
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const url = await URL.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!url) {
      return res.status(404).json({ success: false, message: 'URL not found' });
    }

    const shortUrl = `${process.env.BASE_URL}/${url.shortCode}`;
    const qrCode = await generateQRCode(shortUrl);

    res.status(200).json({
      success: true,
      data: { ...url.toObject(), shortUrl, qrCode },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update URL
router.put('/:id', authMiddleware, validateRequest(schemas.updateUrl), async (req, res) => {
  try {
    const url = await URL.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!url) {
      return res.status(404).json({ success: false, message: 'URL not found' });
    }

    res.status(200).json({
      success: true,
      message: 'URL updated successfully',
      data: url,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete URL
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const url = await URL.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!url) {
      return res.status(404).json({ success: false, message: 'URL not found' });
    }

    // Update user stats
    await User.findByIdAndUpdate(req.user._id, { $inc: { totalUrls: -1 } });

    res.status(200).json({ success: true, message: 'URL deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Check if custom alias exists
router.get('/check/alias/:alias', async (req, res) => {
  try {
    const { alias } = req.params;

    if (!isValidAlias(alias)) {
      return res.status(400).json({
        success: false,
        available: false,
        message: 'Invalid alias format',
      });
    }

    const existing = await URL.findOne({ customAlias: alias });

    res.status(200).json({
      success: true,
      available: !existing,
      message: existing ? 'Alias already taken' : 'Alias available',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
