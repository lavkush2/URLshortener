const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema(
  {
    urlId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'URL',
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    ipAddress: {
      type: String,
    },
    userAgent: {
      type: String,
    },
    referrer: {
      type: String,
    },
    country: {
      type: String,
    },
    city: {
      type: String,
    },
    browser: {
      type: String,
    },
    device: {
      type: String,
    },
    os: {
      type: String,
    },
  },
  { timestamps: true }
);

// Index for analytics queries
analytics Schema.index({ urlId: 1, userId: 1 });
analyticsSchema.index({ createdAt: 1 });

module.exports = mongoose.model('Analytics', analyticsSchema);
