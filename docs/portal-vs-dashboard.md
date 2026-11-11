# Portal vs Dashboard Architecture

## Overview

The Nexus Operations application has two distinct user interfaces:

1. **Dashboard** (`/dashboard/*`) - Full-featured desktop/web interface
2. **Portal** (`/portal`) - Mobile-first, simplified interface

## Dashboard (`/dashboard`)

### Purpose
The dashboard is the **primary web interface** designed for desktop and tablet users who need full control and comprehensive features.

### Key Characteristics
- **Desktop-First**: Optimized for large screens with sidebar navigation
- **Role-Based Routing**: Separate routes for each role:
  - `/dashboard/homeowner/*` - Homeowner features
  - `/dashboard/contractor/*` - Contractor features
  - `/dashboard/property-manager/*` - Property manager features
  - `/dashboard/admin/*` - Admin features
- **Feature-Rich**: Advanced features like:
  - AI-powered request analysis
  - Multi-step wizards
  - Detailed analytics and reporting
  - Comprehensive settings management
- **Component Structure**: Uses `DashboardNav` component with full sidebar
- **Context**: Uses `AuthContext` and `RequestsContext` for state management

### When to Use Dashboard
- Desktop/laptop users
- Users needing advanced features
- Administrative tasks
- Detailed reporting and analytics
- Multi-step workflows

## Portal (`/portal`)

### Purpose
The portal is a **mobile-first, simplified interface** designed for quick access and essential functions on mobile devices.

### Key Characteristics
- **Mobile-First**: Optimized for mobile devices with bottom tab navigation
- **Single-Page App**: All views in one route with tab-based navigation
- **Simplified UI**: Uses glassmorphism design with animations
- **Tab-Based Navigation**: Bottom tabs for:
  - Dashboard - Quick overview
  - Jobs - Job listings
  - Search - Find jobs/requests
  - Profile - User settings
  - Admin - (Admin users only)
- **Component Structure**: Uses `TabBar` and `PortalHeader` components
- **Context**: Uses `PortalContext` (separate from main auth context)
- **Styling**: Custom `portal.css` with mobile-optimized styles

### When to Use Portal
- Mobile device users
- Quick access to key features
- Simplified workflows
- Users who prefer app-like experience
- Contractors checking available work on-the-go

## Technical Differences

### Routing Strategy

**Dashboard:**
```
/dashboard
  /homeowner
    /new-request
    /requests
    /requests/[id]
    /properties
    /profile
    /settings
  /contractor
    /available-work
    /my-projects
    /analytics
    /profile
    /settings
  /admin
    /users
    /contractors
    /jobs
```

**Portal:**
```
/portal (single route)
  - Tab-based views (client-side routing)
  - All state managed within portal page
  - No route changes for tab navigation
```

### Authentication

**Dashboard:**
- Server-side auth checks on each route
- Middleware validates session
- Role-based redirects in each page component

**Portal:**
- Client-side auth via `PortalContext`
- Single auth check on portal mount
- Tab visibility controlled by role

### API Usage

**Dashboard:**
- Direct API route calls from each page
- Full CRUD operations
- Complex data fetching with React Query patterns

**Portal:**
- Centralized API calls through portal context
- Simplified data fetching
- Real-time updates via context

### State Management

**Dashboard:**
- React Context (`AuthContext`, `RequestsContext`)
- Server components where possible
- Client components for interactive features

**Portal:**
- Single `PortalContext` manages all state
- All components are client-side
- Shared state across all tabs

## Migration Considerations

### Should We Consolidate?

**Arguments for Keeping Both:**
- Different use cases (desktop vs mobile)
- Portal provides better mobile UX
- Some users prefer simplified interface
- Portal serves as a progressive web app (PWA) experience

**Arguments for Consolidation:**
- Maintenance overhead (two codebases)
- Feature parity challenges
- Potential for bugs/inconsistencies
- Duplicate API integration code

### Recommendation

**Keep both** but with clear delineation:

1. **Focus dashboard on desktop power users**
   - Keep advanced features dashboard-only
   - Don't try to replicate all features in portal

2. **Keep portal mobile-focused**
   - Essential features only
   - Optimized mobile UX
   - Quick actions

3. **Implement responsive dashboard**
   - Make dashboard responsive for mobile
   - Redirect mobile dashboard users to portal with option to switch
   - Add a toggle in settings to choose preferred interface

4. **Shared components where possible**
   - Extract shared UI components to `/components`
   - Use same API client library
   - Share type definitions

## Implementation Checklist

- [ ] Add mobile detection in dashboard layout
- [ ] Show portal suggestion banner for mobile users on dashboard
- [ ] Add interface preference in user settings
- [ ] Document which features are dashboard-only vs available in both
- [ ] Ensure API endpoints work consistently for both interfaces
- [ ] Add feature parity matrix documentation
- [ ] Consider adding PWA manifest for portal
- [ ] Test all critical flows in both interfaces

## User Flow Examples

### Homeowner Creating Request

**Dashboard Flow:**
1. Login → Dashboard
2. Navigate to "New Request"
3. Multi-step wizard with AI analysis
4. Upload photos
5. Review and submit
6. View in requests list

**Portal Flow:**
1. Login → Portal dashboard
2. Tap "+" button
3. Bottom sheet form
4. Quick photo upload
5. Submit
6. Job appears in feed

### Contractor Claiming Job

**Dashboard Flow:**
1. Navigate to "Available Work"
2. Filter and sort jobs
3. Click job card
4. View full details
5. Click "Claim Job"
6. Navigate to "My Projects"

**Portal Flow:**
1. Open portal → Jobs tab
2. Browse feed
3. Tap job card
4. Swipe-up detail sheet
5. Tap "Claim"
6. Sheet closes, job moves to "My Jobs"

## Future Enhancements

1. **Progressive Web App (PWA)**
   - Add service worker for portal
   - Enable offline mode for reading jobs
   - Push notifications for new jobs

2. **Unified Component Library**
   - Create design system
   - Share components between dashboard and portal
   - Consistent theming

3. **API Client Abstraction**
   - Single API client used by both
   - Type-safe API calls
   - Automatic error handling

4. **Feature Flags**
   - Control feature availability per interface
   - A/B test new features
   - Gradual rollouts

## Conclusion

Both interfaces serve important but different purposes. Rather than consolidating, focus on:

1. Clear user guidance on which to use
2. Consistent data/API layer
3. Shared components where sensible
4. Different feature sets appropriate to each use case
