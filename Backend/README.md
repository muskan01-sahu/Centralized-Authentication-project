# Centralized Authentication & RBAC for Microservices

A secure, production-ready authentication and authorization system implementing Role-Based Access Control (RBAC) for microservices architecture.

## 🏗 Architecture Overview

```
┌─────────────┐    Login    ┌─────────────┐    JWT Token    ┌─────────────────┐
│   Client    │ ─────────→ │ Auth Service │ ─────────────→ │ Resource Service│
└─────────────┘            └─────────────┘                 └─────────────────┘
                                   │                              │
                                   └───── Public Key Validation ──┘
```

### Key Components

1. **Auth Service** (Port 5000)
   - User authentication & registration
   - JWT token generation (access + refresh)
   - Role & permission management
   - RSA key-based token signing

2. **Resource Service** (Port 5001)
   - Protected API endpoints
   - Token validation using public key
   - Permission-based authorization
   - No database dependency on Auth Service

## 🔐 Security Features

- **Asymmetric JWT Signing**: RS256 with private/public key pair
- **Secure Password Hashing**: bcrypt with salt rounds
- **Token Rotation**: Refresh tokens on every use
- **Permission-Based Authorization**: Granular RBAC control
- **Rate Limiting**: Prevent brute force attacks
- **Security Headers**: Helmet.js protection

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18
- MongoDB (local or cloud)
- Git

### 1. Clone & Setup
```bash
git clone <repository-url>
cd Centralized Authentication/Backend
```

### 2. Option A: Docker Compose (Recommended)
```bash
# Start all services with MongoDB
docker-compose up -d

# Seed the database with test data
docker-compose exec auth-service npm run seed
```

### 3. Option B: Local Development
```bash
# Start Auth Service
cd Auth-service
npm install
npm run seed  # Seed database with test data
npm run dev

# Start Resource Service (new terminal)
cd ../Resource-service
npm install
npm run dev
```

### 4. Verify Services
```bash
# Auth Service Health
curl http://localhost:5000/health

# Resource Service Health
curl http://localhost:5001/health
```

## 📊 RBAC Model

### Users
- `email`: Unique identifier
- `password`: Securely hashed
- `isActive`: Account status
- `roles`: Many-to-many relationship

### Roles
- `admin`: Full access to all resources
- `manager`: Orders (read/write) + Reports (read)
- `user`: Orders (read only)

### Permissions
Format: `<resource>:<action>`
- `orders:read`, `orders:write`, `orders:delete`
- `reports:read`
- `users:read`, `users:write`, `users:delete`

## 🔑 Test Credentials

| Email | Password | Role | Permissions |
|-------|----------|------|-------------|
| admin@example.com | Admin@123 | admin | All permissions |
| manager@example.com | Manager@123 | manager | orders:read/write, reports:read |
| user@example.com | User@1234 | user | orders:read only |
| disabled@example.com | Disabled@123 | user | Account disabled |

## 📡 API Endpoints

### Auth Service
```
POST /auth/register    - Register new user
POST /auth/login       - User login
POST /auth/refresh     - Refresh access token
POST /auth/logout      - Logout user
```

### Resource Service (Orders Example)
```
GET    /orders        - List orders (requires orders:read)
POST   /orders        - Create order (requires orders:write)
DELETE /orders/:id    - Delete order (requires orders:delete)
```

## 🧪 Testing the Flow

### 1. Login as Admin
```bash
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"Admin@123"}'
```

### 2. Access Protected Resource
```bash
# Use the access token from login response
curl -X GET http://localhost:5001/orders \
  -H "Authorization: Bearer <access-token>"
```

### 3. Test Permission Denied
```bash
# Login as regular user and try to delete
curl -X DELETE http://localhost:5001/orders/1 \
  -H "Authorization: Bearer <user-access-token>"
# Returns: 403 Forbidden
```

## 🔧 Token Validation Strategy

**Option A: Public Key Validation** ✅ (Implemented)
- Auth Service signs JWT with private key
- Resource Service validates with public key
- No database calls required for authorization
- High performance and scalability

## 🛡 Security Decisions

1. **JWT Access Tokens**: 15 minutes expiration
2. **Refresh Tokens**: 7 days expiration with rotation
3. **Password Hashing**: bcrypt with 12 salt rounds
4. **RSA Keys**: 2048-bit key length
5. **Rate Limiting**: 10 login attempts per 15 minutes
6. **CORS**: Configured for development domains
7. **Security Headers**: Helmet.js protection

## 📁 Project Structure

```
Backend/
├── Auth-service/
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── middleware/     # Auth & validation
│   │   ├── models/         # User, Role, Permission
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   ├── utils/          # Helpers & token generation
│   │   └── keys/           # RSA key pair
│   └── package.json
├── Resource-service/
│   ├── src/
│   │   ├── controllers/    # Order management
│   │   ├── middleware/     # Token validation & RBAC
│   │   ├── routes/         # API routes
│   │   └── utils/          # Response handlers
│   └── package.json
└── docker-compose.yml
```

## 🌟 Bonus Features Implemented

- ✅ Token revocation via logout
- ✅ Refresh token rotation
- ✅ Rate limiting
- ✅ Comprehensive error handling
- ✅ Security headers
- ✅ Docker containerization
- ✅ Database seeding script

## 📝 Environment Variables

### Auth Service (.env)
```env
PORT=5000
MONGO_URI=mongodb+srv://naveenfd101:T3XECENndRMIpJa4@cluster0.6ffhs.mongodb.net/Filesshare
JWT_PRIVATE_KEY_PATH=./src/keys/private.key
JWT_PUBLIC_KEY_PATH=./src/keys/public.key
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
NODE_ENV=development
```

### Resource Service (.env)
```env
PORT=5001
JWT_PUBLIC_KEY_PATH=./src/keys/public.key
NODE_ENV=development
```

## 🚀 Production Deployment

1. **Environment Variables**: Set production values
2. **Database**: Use production MongoDB instance
3. **HTTPS**: Enable SSL/TLS
4. **CORS**: Update to production domains
5. **Keys**: Secure RSA key storage
6. **Monitoring**: Add logging and metrics

## 🤝 Contributing

1. Follow the existing code style
2. Add tests for new features
3. Update documentation
4. Security-first development

## 📄 License

This project is for educational and demonstration purposes.
