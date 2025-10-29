This is the server-side application for a web platform that allows users to create, share, and collaborate on interactive timelines. Built as part of the Ironhack Web Development Bootcamp (Project for last module (3)), this RESTful API provides comprehensive timeline management capabilities with user authentication, and timeline and timeline items creation with media upload features.

## 🛠️ Tech Stack
- **Runtime** - Node.js with TypeScript
- **Framework** - Express.js
- **Database** - MongoDB with Mongoose ODM
- **Authentication** - JWT (JSON Web Tokens) with bcryptjs
- **File Upload**: Multer with Cloudinary storage
- **Development** - tsx for hot reloading, ESLint, Prettier

### 📊 API Endpoints
- **Authentication routes** - `/api/auth`
- **Timeline CRUD operations** - `/api/timelines`
- **Timeline item management** - `/api/timelines/:id/items`
- **User management** - `/api/users`
- **File upload handling** - `/api/upload`