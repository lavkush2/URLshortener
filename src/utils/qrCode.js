const QRCode = require('qrcode');

/**
 * Generate QR code for a URL
 * @param {string} url - URL to encode
 * @param {Object} options - QR code options
 * @returns {Promise<string>} QR code as data URL
 */
const generateQRCode = async (url, options = {}) => {
  try {
    const defaultOptions = {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      width: process.env.QR_CODE_SIZE || 200,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
      ...options,
    };

    const qrCode = await QRCode.toDataURL(url, defaultOptions);
    return qrCode;
  } catch (error) {
    throw new Error(`Failed to generate QR code: ${error.message}`);
  }
};

module.exports = { generateQRCode };
