# 🔗 URL Shortener

A powerful, feature-rich URL shortener API built with Node.js, Express, and MongoDB.

## ✨ Features

- **Shorten URLs** - Convert long URLs to short, memorable codes
- **Custom Aliases** - Create custom short codes for your URLs
- **Analytics** - Track clicks, visitor info, referrers, and more
- **QR Codes** - Generate QR codes for shortened URLs
- **User Authentication** - Secure JWT-based authentication
- **URL Expiration** - Set expiration dates for temporary links
- **Redirect Tracking** - Monitor all redirects with detailed analytics
- **Bulk Operations** - Shorten multiple URLs at once
- **API Rate Limiting** - Prevent abuse with rate limiting

## 🚀 Quick Start

### Prerequisites
- Node.js (v14+)
- MongoDB (Local or MongoDB Atlas)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/lavkush2/URLshortener.git
cd URLshortener

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Update .env with your configuration
# - MongoDB URI
# - JWT Secret
# - Base URL

# Start the server
npm run dev        # Development with auto-reload
npm start          # Production
```

## 📚 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user

### URL Management
- `POST /api/v1/urls/shorten` - Create shortened URL
- `GET /api/v1/urls` - Get all URLs for user
- `GET /api/v1/urls/:id` - Get specific URL details
- `PUT /api/v1/urls/:id` - Update URL
- `DELETE /api/v1/urls/:id` - Delete shortened URL
- `GET /api/v1/urls/custom/:code` - Check if custom code exists

### Redirect
- `GET /:code` - Redirect to original URL
- `GET /:code/preview` - Preview URL without redirecting

### Analytics
- `GET /api/v1/analytics/:code` - Get URL analytics
- `GET /api/v1/analytics/stats/summary` - Get all analytics
- `GET /api/v1/analytics/:code/export` - Export analytics as CSV

## 📋 Project Structure

```
URLshortener/
├── src/
│   ├── app.js
│   ├── server.js
│   ├── config/
│   │   └── database.js
│   ├── models/
│   │   ├── User.js
│   │   ├── URL.js
│   │   └── Analytics.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── validation.js
│   │   └── errorHandler.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── url.js
│   │   ├── redirect.js
│   │   └── analytics.js
│   └── utils/
│       ├── generateShortCode.js
│       └── qrCode.js
├── package.json
├── .env.example
├── .gitignore
└── README.md
```

## 🔐 Security Features

- JWT authentication
- Password hashing with bcryptjs
- Input validation with Joi
- MongoDB injection prevention
- CORS protection
- Rate limiting
- Secure headers

## 🗄️ Database Schema

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  createdAt: Date
}
```

### URL Model
```javascript
{
  userId: ObjectId (ref: User),
  originalUrl: String,
  shortCode: String (unique),
  customAlias: String (optional),
  title: String,
  description: String,
  expiresAt: Date (optional),
  clicks: Number (default: 0),
  createdAt: Date,
  updatedAt: Date
}
```

### Analytics Model
```javascript
{
  urlId: ObjectId (ref: URL),
  userId: ObjectId (ref: User),
  ipAddress: String,
  userAgent: String,
  referrer: String,
  country: String,
  browser: String,
  device: String,
  timestamp: Date
}
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## 📦 Dependencies

- **express** - Web framework
- **mongoose** - MongoDB ODM
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **joi** - Input validation
- **qrcode** - QR code generation
- **nanoid** - Short ID generation
- **cors** - Cross-origin resource sharing
- **dotenv** - Environment variables

## 🚢 Deployment

### Heroku
```bash
heroku create your-app-name
heroku config:set MONGODB_URI=your_mongodb_uri
heroku config:set JWT_SECRET=your_jwt_secret
git push heroku main
```

### AWS/DigitalOcean
1. Set up Node.js server
2. Configure MongoDB
3. Set environment variables
4. Deploy using PM2 or Docker

## 📖 Example Usage

### Register User
```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@example.com","password":"password123"}'
```

### Shorten URL
```bash
curl -X POST http://localhost:5000/api/v1/urls/shorten \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"originalUrl":"https://www.example.com/very/long/url"}'
```

### Get Analytics
```bash
curl -X GET http://localhost:5000/api/v1/analytics/abc123 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 🐛 Troubleshooting

### MongoDB Connection Error
- Check MongoDB URI in .env
- Ensure MongoDB is running
- Check network access in MongoDB Atlas

### JWT Token Issues
- Verify JWT_SECRET is set
- Check token expiration
- Ensure token format: `Bearer <token>`

## 📝 License

MIT

## 👨‍💻 Author

Your Name

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For support, email support@urlshortener.com or open an issue on GitHub.
