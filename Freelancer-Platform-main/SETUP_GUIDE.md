# Freelancer Platform - MongoDB + Node.js Setup Guide

This project has been converted from TypeScript + Supabase to **JavaScript + Node.js/Express + MongoDB**.

## What's Changed

### Frontend (React + Vite)
- ✅ All `.tsx` files converted to `.jsx`
- ✅ All `.ts` files converted to `.js`
- ✅ TypeScript configuration simplified
- ✅ Removed Supabase dependencies
- ✅ New MongoDB API client integration

### Backend (Node.js + Express)
- ✅ Express server with MongoDB integration
- ✅ JWT authentication
- ✅ Complete REST API for all operations
- ✅ Admin panel support
- ✅ CORS enabled for frontend communication

## Installation & Setup

### Prerequisites
- Node.js (v18+)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Frontend Setup

```bash
cd Freelancer_Platform
npm install
# or
bun install
```

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:

```env
MONGODB_URI=mongodb://localhost:27017/freelancer_platform
JWT_SECRET=your_secret_key_change_this_in_production
PORT=3000
NODE_ENV=development
```

### Frontend Environment

Create a `.env` file in `Freelancer_Platform` directory:

```env
VITE_API_BASE_URL=http://localhost:3000
VITE_MONGODB_URL=mongodb://localhost:27017
```

## Running the Application

### Start Backend
```bash
cd backend
npm run dev
# or npm start for production
```

The API will be available at `http://localhost:3000`

### Start Frontend
```bash
cd Freelancer_Platform
npm run dev
```

The frontend will be available at `http://localhost:8080`

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/signin` - Login
- `POST /api/auth/signout` - Logout
- `GET /api/auth/me` - Get current user

### Freelancers
- `GET /api/freelancers` - List all freelancers
- `GET /api/freelancers/:id` - Get freelancer details
- `POST /api/freelancers` - Create freelancer (requires auth)
- `PUT /api/freelancers/:id` - Update freelancer (requires auth)
- `DELETE /api/freelancers/:id` - Delete freelancer (requires auth)

### Reports
- `GET /api/reports` - Get all reports
- `POST /api/reports` - Create report (requires admin)
- `DELETE /api/reports/:id` - Delete report (requires admin)

### Settings
- `GET /api/settings` - Get all settings
- `GET /api/settings/:key` - Get specific setting
- `PUT /api/settings/:key` - Update setting (requires admin)
- `DELETE /api/settings/:key` - Delete setting (requires admin)

### Admin
- `GET /api/admin/users` - List all users (requires admin)
- `PUT /api/admin/users/:userId/role` - Change user role (requires admin)
- `GET /api/admin/stats` - Get platform statistics (requires admin)

## Project Structure

```
Freelancer-Platform-main/
├── Freelancer_Platform/          # React Frontend
│   ├── src/
│   │   ├── components/           # React components
│   │   ├── contexts/             # React contexts (AuthContext)
│   │   ├── pages/                # Page components
│   │   ├── lib/                  # API client
│   │   └── integrations/
│   │       └── mongodb/          # MongoDB client
│   ├── package.json
│   └── vite.config.js
│
└── backend/                      # Node.js/Express Backend
    ├── models/                   # MongoDB models
    ├── routes/                   # API routes
    ├── middleware/               # Auth middleware
    ├── server.js                 # Main server
    └── package.json
```

## Database Setup

### MongoDB Locally
```bash
# On Windows with MongoDB installed
mongod

# Create database (will auto-create on first insert)
mongo
use freelancer_platform
```

### MongoDB Atlas (Cloud)
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Get connection string
4. Update `.env` with your connection string

## Development

### Environment Variables
- `VITE_API_BASE_URL` - Backend API URL (frontend)
- `VITE_MONGODB_URL` - MongoDB connection (for info, backend uses MONGODB_URI)
- `JWT_SECRET` - Secret key for JWT tokens
- `MONGODB_URI` - MongoDB connection string
- `PORT` - Backend server port (default: 3000)

### Testing
```bash
# Frontend tests
cd Freelancer_Platform
npm run test

# Backend - add tests as needed
```

## Authentication Flow

1. User signs up/signs in via frontend
2. Backend validates credentials and returns JWT token
3. Frontend stores token in localStorage
4. Token is sent with each API request in Authorization header
5. Backend validates token with middleware

## Default Admin Account

To create an admin account, modify the User creation in `backend/routes/auth.js`:

```javascript
// After user signup, set role to 'admin'
user.role = 'admin';
```

Or use MongoDB directly:
```bash
db.users.updateOne({ email: "admin@example.com" }, { $set: { role: "admin" } })
```

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check connection string in `.env`
- Verify network access if using MongoDB Atlas

### CORS Errors
- Ensure backend is running
- Check `VITE_API_BASE_URL` matches backend URL
- Verify CORS is enabled in backend

### Authentication Errors
- Ensure JWT_SECRET is set and consistent
- Check token expiration (7 days)
- Verify user exists in database

## Future Enhancements

- Add email verification
- Implement refresh tokens
- Add rate limiting
- Add pagination for large datasets
- Add file uploads for portfolios
- Add WebSocket for real-time notifications
- Add comprehensive error handling
- Add request validation schemas

## Support

For issues or questions, check the API logs and MongoDB data to diagnose problems.
