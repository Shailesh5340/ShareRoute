# ShareRoute Backend API

Node.js/Express backend with MongoDB Atlas integration for the ShareRoute ridesharing platform.

## Features

- ✅ RESTful API for booking management
- ✅ MongoDB Atlas cloud database
- ✅ TypeScript for type safety
- ✅ CORS enabled for frontend communication
- ✅ Environment-based configuration
- ✅ Comprehensive error handling

## Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: MongoDB Atlas
- **Language**: TypeScript
- **Package Manager**: npm

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.ts        # MongoDB connection
│   ├── models/
│   │   └── Booking.ts         # Booking schema
│   ├── controllers/
│   │   └── bookingController.ts  # Request handlers
│   ├── routes/
│   │   └── bookings.ts        # API routes
│   └── server.ts              # Express app & server
├── dist/                      # Compiled JavaScript
├── .env                       # Environment variables (git ignored)
├── .env.example              # Example environment setup
├── tsconfig.json             # TypeScript configuration
└── package.json              # Dependencies
```

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Create MongoDB Atlas Cluster

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account or log in
3. Create a new project
4. Create a new cluster (use M0 free tier)
5. Wait for cluster to deploy (~10 minutes)
6. Click "Connect" and select "Drivers"
7. Copy the connection string

### 3. Configure Environment Variables

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Edit `.env` and add your MongoDB Atlas connection string:
```
MONGODB_URI=mongodb+srv://username:password@cluster-name.mongodb.net/shareroute?retryWrites=true&w=majority
```

Replace:
- `username` - Your MongoDB database user
- `password` - Your MongoDB database user password
- `cluster-name` - Your cluster name (e.g., `cluster0`)

3. Other environment variables:
```
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### 4. Start the Server

**Development mode** (with auto-reload):
```bash
npm run dev
```

**Production mode** (after building):
```bash
npm run build
npm start
```

The server will run on `http://localhost:5000`

## API Endpoints

### Base URL
```
http://localhost:5000/api
```

### Health Check
```
GET /health
```
Response:
```json
{
  "success": true,
  "message": "ShareRoute API is running",
  "timestamp": "2025-11-18T10:30:00.000Z"
}
```

### Bookings

#### Create Booking
```
POST /bookings
Content-Type: application/json

{
  "pickupLocation": "123 Main St, City",
  "destination": "456 Oak Ave, City",
  "passengerName": "John Doe",
  "passengerEmail": "john@example.com",
  "passengerPhone": "+1234567890"
}
```

Response (201):
```json
{
  "success": true,
  "message": "Booking created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "pickupLocation": "123 Main St, City",
    "destination": "456 Oak Ave, City",
    "passengerName": "John Doe",
    "passengerEmail": "john@example.com",
    "passengerPhone": "+1234567890",
    "status": "pending",
    "createdAt": "2025-11-18T10:30:00.000Z",
    "updatedAt": "2025-11-18T10:30:00.000Z"
  }
}
```

#### Get All Bookings
```
GET /bookings?status=pending&limit=10&page=1
```

Query Parameters:
- `status` - Filter by status: `pending`, `confirmed`, `completed`, `cancelled`
- `limit` - Results per page (default: 10)
- `page` - Page number (default: 1)

Response (200):
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "total": 42,
    "page": 1,
    "pages": 5
  }
}
```

#### Get Single Booking
```
GET /bookings/:id
```

Response (200):
```json
{
  "success": true,
  "data": { ... }
}
```

#### Update Booking
```
PUT /bookings/:id
Content-Type: application/json

{
  "status": "confirmed",
  "fare": 25.50,
  "distance": 5.2,
  "estimatedDuration": 15
}
```

Response (200):
```json
{
  "success": true,
  "message": "Booking updated successfully",
  "data": { ... }
}
```

#### Delete Booking
```
DELETE /bookings/:id
```

Response (200):
```json
{
  "success": true,
  "message": "Booking deleted successfully"
}
```

## Error Responses

All errors follow this format:

```json
{
  "success": false,
  "message": "Error message here",
  "error": "Additional error details"
}
```

Common status codes:
- `400` - Bad Request (validation error)
- `404` - Not Found
- `500` - Server Error

## Database Schema

### Booking Document

```typescript
{
  _id: ObjectId;
  pickupLocation: string;      // Required
  destination: string;         // Required
  passengerName?: string;
  passengerEmail?: string;      // Valid email format
  passengerPhone?: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  fare?: number;               // Minimum 0
  distance?: number;           // In km, minimum 0
  estimatedDuration?: number;  // In minutes, minimum 0
  createdAt: Date;
  updatedAt: Date;
}
```

## Running Locally

### Prerequisites
- Node.js 18+ ([Download](https://nodejs.org))
- MongoDB Atlas account (free tier available)

### Complete Setup

```bash
# 1. Navigate to backend directory
cd backend

# 2. Install dependencies
npm install

# 3. Create .env file with MongoDB URI
cp .env.example .env
# Edit .env and add your MongoDB connection string

# 4. Start development server
npm run dev

# 5. Backend is running at http://localhost:5000
```

### Testing Endpoints

Using cURL:
```bash
# Health check
curl http://localhost:5000/api/health

# Create booking
curl -X POST http://localhost:5000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "pickupLocation": "123 Main St",
    "destination": "456 Oak Ave"
  }'

# Get all bookings
curl http://localhost:5000/api/bookings

# Get specific booking
curl http://localhost:5000/api/bookings/507f1f77bcf86cd799439011
```

Using Postman:
1. Import endpoints from API documentation
2. Set `http://localhost:5000` as base URL
3. Add endpoints and test

## Environment Variables Reference

| Variable | Default | Description |
|----------|---------|-------------|
| `MONGODB_URI` | - | MongoDB Atlas connection string (required) |
| `PORT` | 5000 | Server port |
| `NODE_ENV` | development | Environment (development/production) |
| `FRONTEND_URL` | http://localhost:5173 | Frontend URL for CORS |
| `API_VERSION` | v1 | API version |

## Deployment

### Option 1: Render (Recommended for Free)

1. Push code to GitHub
2. Go to [Render.com](https://render.com)
3. Connect GitHub repository
4. Set environment variables
5. Deploy

### Option 2: Railway.app

1. Connect GitHub
2. Add MongoDB service
3. Set environment variables
4. Deploy

### Option 3: Heroku

```bash
heroku login
heroku create your-app-name
git push heroku main
```

### Option 4: DigitalOcean App Platform

1. Connect GitHub repo
2. Set environment variables
3. Deploy

## Troubleshooting

### Connection Error
```
MongoDB Connection Error: connect ECONNREFUSED
```
**Solution:** Check MongoDB URI in `.env` file, ensure cluster is running

### Port Already in Use
```
Error: listen EADDRINUSE :::5000
```
**Solution:** Change PORT in `.env` or kill process on port 5000

### CORS Error
```
Access to XMLHttpRequest blocked by CORS policy
```
**Solution:** Ensure `FRONTEND_URL` in `.env` matches frontend URL

### Validation Error
```
"Pickup location is required"
```
**Solution:** Ensure all required fields are provided in request

## Performance Tips

1. **Database Indexing**: MongoDB Atlas automatically indexes `_id`
2. **Pagination**: Use `limit` and `page` parameters for large datasets
3. **Caching**: Consider adding Redis for frequently accessed data
4. **Rate Limiting**: Add express-rate-limit for production

## Security Considerations

1. ✅ Environment variables for sensitive data
2. ✅ Input validation with Mongoose schemas
3. ✅ CORS enabled only for frontend URL
4. ✅ TypeScript for type safety

### Additional Security (Recommended for Production)

- Add authentication (JWT)
- Add rate limiting
- Add request logging
- Enable HTTPS
- Add data encryption

## Development

### Building TypeScript
```bash
npm run build
```

Compiles TypeScript to JavaScript in `dist/` folder.

### Type Checking
```bash
npx tsc --noEmit
```

## API Documentation

Full API documentation with examples is available in this file and the inline code comments.

For interactive API testing:
1. Use Postman
2. Use REST Client extension in VS Code
3. Use cURL commands

## Contributing

When adding new features:
1. Create a new model in `src/models/`
2. Create a controller in `src/controllers/`
3. Create routes in `src/routes/`
4. Use TypeScript for type safety
5. Add error handling
6. Test with frontend

## License

Part of the ShareRoute platform.
