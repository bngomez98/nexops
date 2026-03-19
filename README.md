

# Nexus Operations - Home Improvement Marketplace

A modern, full-featured marketplace connecting homeowners with licensed contractors for home improvement projects.

## Overview

Nexus Operations is a two-sided marketplace where:
- **Homeowners** post project requests and receive bids from multiple contractors
- **Contractors** browse available projects in their service areas and claim work

The platform streamlines project discovery, bidding, and management with role-based dashboards and real-time project tracking.

## Features

### For Homeowners
- **Post Project Requests**: Submit detailed project information with budget and location
- **Get Multiple Bids**: Receive bids from licensed contractors
- **Project Tracking**: Monitor project status in real-time
- **Contractor Profiles**: View contractor ratings, reviews, and experience
- **Secure Communication**: Direct messaging with contractors
- **Free Forever**: No hidden fees or subscription required

### For Contractors
- **Project Feed**: Browse available projects matching your service categories
- **Flexible Claiming**: Claim projects that fit your schedule and capacity
- **Membership Tiers**: Choose from Free Trial, Professional, or Enterprise
- **Performance Analytics**: Track ratings, reviews, and project history
- **Project Management**: Manage active projects and capacity limits

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 3.4 with custom design tokens
- **UI Components**: Custom built + Radix UI primitives
- **Authentication**: Session-based with secure HTTP-only cookies
- **Password Security**: bcrypt for password hashing
- **Icons**: Lucide React
- **Database**: In-memory for development (PostgreSQL ready)

## Project Structure

```
nexus-operations/
├── app/
│   ├── api/
│   │   ├── auth/              # Authentication (signup, login, logout, me)
│   │   └── projects/          # Project management (create, list, claim)
│   ├── dashboard/
│   │   ├── homeowner/         # Homeowner dashboard & new request form
│   │   └── contractor/        # Contractor dashboard & available projects
│   ├── login/                 # Login page
│   ├── signup/                # Signup page
│   ├── services/              # Services directory
│   ├── pricing/               # Pricing & membership tiers
│   ├── page.tsx               # Landing page
│   ├── layout.tsx             # Root layout
│   └── globals.css            # Global styles & design tokens
├── components/
│   └── ui/                    # Reusable UI components
│       ├── button.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── card.tsx
│       ├── alert.tsx
│       └── select.tsx
├── lib/
│   ├── types.ts               # TypeScript type definitions
│   ├── db.ts                  # In-memory database operations
│   ├── auth.ts                # Authentication utilities
│   └── utils.ts               # Utility functions
├── middleware.ts              # Security headers & route protection
├── tailwind.config.ts         # Tailwind configuration
├── next.config.js             # Next.js configuration
├── tsconfig.json              # TypeScript configuration
└── package.json               # Dependencies
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

## Authentication

The application uses session-based authentication with secure HTTP-only cookies.

### User Roles
- **Homeowner**: Post projects, receive bids, manage requests
- **Contractor**: Browse projects, claim work, manage active projects

### Protected Routes
- `/dashboard/homeowner/*` - Homeowner-only access
- `/dashboard/contractor/*` - Contractor-only access

Unauthenticated users are redirected to `/login`.

## API Reference

### Authentication Endpoints

```
POST   /api/auth/signup          Register a new user
POST   /api/auth/login           Authenticate user
POST   /api/auth/logout          End session
GET    /api/auth/me              Get current user profile
```

### Project Endpoints

```
POST   /api/projects/create      Create project request (homeowners)
GET    /api/projects/list        Get projects (filters by role)
POST   /api/projects/claim/[id]  Claim project (contractors)
```

## Service Categories

| Service | Budget Range |
|---------|--------------|
| Tree Removal | $500 – $8,000 |
| Concrete Work | $1,200 – $15,000 |
| Roofing | $2,000 – $25,000 |
| HVAC | $3,000 – $20,000 |
| Fencing | $1,500 – $8,000 |
| Electrical | $500 – $10,000 |
| Plumbing | $300 – $5,000 |
| Excavation | $2,000 – $20,000+ |

## Membership Tiers

### For Homeowners
**Free** - Forever free
- Unlimited project posts
- Browse contractor profiles
- Direct contractor communication

### For Contractors

| Tier | Price | Active Projects | Features |
|------|-------|-----------------|----------|
| Free Trial | $0/month | 3 | 30-day trial, basic profile |
| Professional | $299/month | 5 | Priority access, analytics |
| Enterprise | $749/month | 15 | Exclusive access, 24/7 support |

## Security

Security headers are configured in `middleware.ts`:

- XSS protection with Content-Security-Policy
- CSRF protection via secure headers
- Clickjacking protection (X-Frame-Options: DENY)
- MIME type sniffing prevention
- Secure password hashing with bcrypt
- HTTP-only, secure session cookies
- Referrer policy enforcement

## Database Schema

### Users
- id, email, password_hash, name, role, created_at, updated_at

### Contractor Profiles
- userId, companyName, licenseNumber, yearsInBusiness
- serviceCategories[], averageRating, totalReviews
- membershipTier, membershipExpiresAt
- maxActiveProjects, currentActiveProjects

### Project Requests
- id, homeownerId, category, title, description, location
- budget, status, claimedBy, created_at, updated_at, completed_at

### Sessions
- id, userId, expiresAt, created_at

## Design System

### Colors
- **Primary**: Navy Blue (#1f2d42) - Trust & Professionalism
- **Secondary**: Slate Gray (#3a4a5c) - Professional Neutral
- **Accent**: Emerald Green (#2d9d65) - Growth & Action
- **Neutrals**: White, Light Gray, Dark Text

### Typography
- **Headings**: Clean, sans-serif system font
- **Body**: Optimized for readability
- **Line Height**: 1.4-1.6 for body text

## Deployment

### Vercel (Recommended)

```bash
git push origin main  # Vercel auto-deploys on push
```

### Docker

```bash
docker build -t nexus-operations .
docker run -p 3000:3000 nexus-operations
```

## Environment Variables

For production deployment, configure:

```env
DATABASE_URL=your_database_url        # When using real database
SESSION_SECRET=your_session_secret    # Session encryption key
NODE_ENV=production
```

## Future Roadmap

- Payment processing (Stripe integration)
- Email notifications
- Image uploads for projects
- Advanced project filtering
- Real-time notifications with WebSockets
- Mobile app
- PostgreSQL/MongoDB integration
- Two-way ratings & reviews system
- Contractor verification system

## Development Notes

This is a monolithic Next.js application with in-memory data storage for rapid development. The architecture is designed to scale:

1. **Database agnostic**: Replace in-memory db.ts with any database
2. **API-first**: All features use RESTful APIs
3. **Type-safe**: Full TypeScript throughout
4. **Security-first**: Built-in security headers and best practices

## Support

For issues or feature requests, please open an issue on GitHub or contact support@nexusoperations.org.

## License

MIT License - see LICENSE file for details.
