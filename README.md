# 🚀 NeuroFleet AI — Logistics Command Platform

A production-ready, enterprise-grade AI logistics management platform with a comprehensive, secure Admin Panel.

![Architecture](https://img.shields.io/badge/Frontend-React_19_+_Vite-blue) ![Backend](https://img.shields.io/badge/Backend-Spring_Boot_3.x-green) ![Database](https://img.shields.io/badge/Database-PostgreSQL_16-blue) ![Auth](https://img.shields.io/badge/Auth-JWT_RBAC-orange)

---

## 🏗️ Enterprise Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                              │
│  React 19 + Vite + TypeScript + Tailwind CSS + Shadcn UI       │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐          │
│  │  Login   │ │Dashboard │ │  Fleet   │ │ Live Map │          │
│  │  Page    │ │  Stats   │ │  CRUD    │ │  View    │          │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘          │
└───────────────────────────┬─────────────────────────────────────┘
                            │ HTTPS + JWT Bearer Token
┌───────────────────────────▼─────────────────────────────────────┐
│                       SECURITY LAYER                             │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  JwtAuthenticationFilter → Validates Bearer Token       │    │
│  │  @PreAuthorize("hasRole('ADMIN')") → Method Security    │    │
│  │  RBAC: ADMIN | OPERATOR | VIEWER                        │    │
│  └─────────────────────────────────────────────────────────┘    │
└───────────────────────────┬─────────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────────┐
│                     BACKEND LAYER                                │
│  Spring Boot 3.x (Java 21)                                     │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐          │
│  │  Auth    │ │  Fleet   │ │  Route   │ │  Alert   │          │
│  │Controller│ │Controller│ │Controller│ │Controller│          │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘          │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Service Layer → Business Logic + Validation             │  │
│  └──────────────────────────────────────────────────────────┘  │
└───────────────────────────┬─────────────────────────────────────┘
                            │ JPA / Hibernate
┌───────────────────────────▼─────────────────────────────────────┐
│                    DATA LAYER                                    │
│  PostgreSQL 16                                                   │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐          │
│  │  users   │ │  fleets  │ │  routes  │ │audit_logs│          │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘          │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔐 Security Architecture

### Authentication Flow
1. Client sends `POST /api/auth/login` with credentials
2. Spring Security validates via `AuthenticationManager`
3. On success, `JwtTokenProvider` generates a signed JWT
4. JWT returned to client, stored in localStorage
5. All subsequent requests include `Authorization: Bearer <token>`
6. `JwtAuthenticationFilter` validates token on every request

### Authorization (RBAC)
| Role | Access | Endpoints |
|------|--------|-----------|
| `ADMIN` | Full system access | `/api/admin/**` |
| `OPERATOR` | Fleet monitoring | `/api/operator/**` |
| `VIEWER` | Read-only dashboards | `/api/public/**` |

### Key Security Features
- **Stateless Authentication**: No server-side sessions
- **BCrypt Password Hashing**: Strength 12
- **Method-Level Security**: `@PreAuthorize("hasRole('ADMIN')")`
- **CORS Configuration**: Whitelisted origins only
- **JWT Expiration**: Configurable token lifetime
- **Audit Logging**: All admin actions tracked

---

## 📁 Project Structure

```
neurofleet-platform/
├── src/                          # React Frontend
│   ├── App.tsx                   # Router setup with protected routes
│   ├── context/
│   │   └── AuthContext.tsx       # JWT auth state management
│   ├── components/
│   │   ├── ProtectedRoute.tsx    # Route guard (checks JWT + role)
│   │   └── AdminLayout.tsx       # Sidebar + Header layout
│   ├── pages/
│   │   ├── Login.tsx             # JWT login form
│   │   ├── Dashboard.tsx         # Command dashboard with charts
│   │   ├── FleetManagement.tsx   # Full CRUD data table
│   │   ├── LiveMap.tsx           # Real-time vehicle tracking
│   │   └── Settings.tsx          # Platform configuration
│   ├── services/
│   │   └── api.ts                # API client (mock + real endpoints)
│   └── types/
│       └── index.ts              # TypeScript interfaces
│
├── backend/                      # Spring Boot Backend
│   └── src/main/java/com/neurofleet/
│       ├── config/
│       │   └── SecurityConfig.java       # Spring Security + JWT setup
│       ├── controller/
│       │   ├── AuthController.java       # POST /api/auth/login
│       │   └── FleetController.java      # CRUD with @PreAuthorize
│       ├── entity/
│       │   └── Fleet.java                # JPA Entity with validation
│       ├── security/
│       │   ├── JwtTokenProvider.java     # JWT creation/validation
│       │   └── JwtAuthenticationFilter.java  # Request filter
│       └── resources/
│           ├── application.properties    # Spring Boot config
│           └── db/init.sql              # Database initialization
│
├── docker-compose.yml            # Full stack orchestration
├── Dockerfile.frontend           # React build + Nginx
├── nginx.conf                    # Reverse proxy config
└── README.md                     # This file
```

---

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- Node.js 20+ (for local development)
- Java 21+ (for local backend development)

### Run with Docker Compose
```bash
# Start all services
docker-compose up -d

# Services available at:
# Frontend:  http://localhost:3000
# API:       http://localhost:8080
# Database:  localhost:5432
```

### Local Development
```bash
# Frontend
npm install
npm run dev     # http://localhost:3000

# Backend (requires Java 21)
cd backend
./gradlew bootRun   # http://localhost:8080
```

### Demo Credentials
| Username | Password | Role |
|----------|----------|------|
| `admin` | `admin123` | ADMIN |

---

## 🎯 Admin Panel Features

### 1. Authentication & Protected Routing
- JWT-based login with Spring Boot backend
- `<ProtectedRoute>` wrapper blocks unauthorized access
- Role-based route protection (`requiredRole="ADMIN"`)
- Persistent sessions via localStorage

### 2. Admin Layout
- Collapsible sidebar navigation
- Top header with profile dropdown & logout
- Real-time system status indicator
- Notification bell with badge

### 3. Fleet Management (CRUD)
- **Data Table**: Sortable, filterable, searchable
- **Add Vehicle**: Modal dialog with form validation
- **Edit Vehicle**: Pre-populated form dialog
- **Delete Vehicle**: Confirmation dialog
- **Status Badges**: Color-coded vehicle states
- **Fuel Level Indicators**: Visual progress bars

### 4. Dashboard
- Real-time KPI cards (vehicles, deliveries, revenue)
- Interactive charts (Recharts)
- System alerts feed
- Active delivery routes

### 5. Live Map
- Simulated geospatial visualization
- Vehicle markers with status colors
- Click-to-inspect vehicle details
- Connection lines between active vehicles

### 6. Settings
- JWT configuration
- Security parameters
- Infrastructure settings
- RBAC documentation
- System information

---

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/login` | Public | Login & get JWT |

### Fleet Management (ADMIN only)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/admin/fleets` | ADMIN | List all vehicles |
| GET | `/api/admin/fleets/{id}` | ADMIN | Get vehicle by ID |
| POST | `/api/admin/fleets` | ADMIN | Register new vehicle |
| PUT | `/api/admin/fleets/{id}` | ADMIN | Update vehicle |
| DELETE | `/api/admin/fleets/{id}` | ADMIN | Remove vehicle |
| PATCH | `/api/admin/fleets/{id}/status` | ADMIN | Quick status update |

---

## 🛡️ Security Headers

The platform implements the following security measures:
- **X-Frame-Options**: SAMEORIGIN (clickjacking protection)
- **X-Content-Type-Options**: nosniff (MIME sniffing prevention)
- **X-XSS-Protection**: 1; mode=block
- **Referrer-Policy**: strict-origin-when-cross-origin
- **CORS**: Whitelisted origins only
- **JWT**: Signed with HMAC-SHA256, configurable expiration

---

## 📊 Tech Stack Summary

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite, TypeScript, Tailwind CSS |
| UI Components | Custom Shadcn-inspired (Tables, Dialogs, Forms) |
| Charts | Recharts |
| Icons | Lucide React |
| Backend | Spring Boot 3.x, Java 21 |
| Security | Spring Security, JWT, BCrypt, RBAC |
| Database | PostgreSQL 16 |
| ORM | Hibernate / Spring Data JPA |
| Infrastructure | Docker Compose, Nginx |
| Build | Gradle (backend), Vite (frontend) |

---

## 📝 License

Enterprise Internal Use — NeuroFleet AI Platform
