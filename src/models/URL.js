const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    originalUrl: {
      type: String,
      required: [true, 'Please provide original URL'],
      validate: {
        validator: function (url) {
          try {
            new URL(url);
            return true;
          } catch (error) {
            return false;
          }
        },
        message: 'Please provide a valid URL',
      },
    },
    shortCode: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    customAlias: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
    },
    title: {
      type: String,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    clicks: {
      type: Number,
      default: 0,
    },
    expiresAt: {
      type: Date,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    tags: [String],
  },
  { timestamps: true }
);

// Index for faster queries
urlSchema.index({ userId: 1, shortCode: 1 });
urlSchema.index({ shortCode: 1 });
urlSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('URL', urlSchema);
