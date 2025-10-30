This is the **server-side application for a web platform that allows users to create, share, and collaborate on interactive timelines**. Built as part of the Ironhack Web Development Bootcamp (Project for last module (3)), this RESTful API provides comprehensive timeline management capabilities with user authentication, and timeline and timeline items creation with media upload features.

- **Frontend repo**: https://github.com/malejaroti/my-life-timelines-frontend
- **Deployed app**: https://my-life-timelines.netlify.app/

## 🛠️ Tech Stack
- **Runtime** - Node.js with TypeScript
- **Framework** - Express.js
- **Database** - MongoDB with Mongoose ODM
- **Authentication** - JWT (JSON Web Tokens) with bcryptjs
- **File Upload**: Multer with Cloudinary storage
- **Development** - tsx for hot reloading, ESLint, Prettier

## 📦 Project Structure

```
my-life-timelines-backend/       # Backend Node.js application
├── src/
│   ├── config/                  # Configuration files
│   ├── db/                      # Database connection
│   ├── middlewares/             # Express middlewares
│   ├── models/                  # Mongoose models
│   ├── routes/                  # API routes
│   ├── types/                   # TypeScript type definitions
│   └── utils/                   # Utility functions
│   └── server.ts                
```

## 📊 API Endpoints
- **Authentication routes** - `/api/auth`
- **Timeline CRUD operations** - `/api/timelines`
- **Timeline item management** - `/api/timelines/:id/items`
- **User management** - `/api/users`
- **File upload handling** - `/api/upload`

## Set up environment variables
Take `.env.example` as reference and create the `.env` file with the following variables:
   ```env
   PORT=5005
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_NAME=your_cloudinary_name
   CLOUDINARY_KEY=your_cloudinary_key
   CLOUDINARY_SECRET=your_cloudinary_secret
   ```