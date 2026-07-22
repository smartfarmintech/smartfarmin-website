# AgreeConnect - Farmer-First Digital Agriculture Platform

## Overview

AgreeConnect is India's most farmer-friendly digital agriculture platform, designed specifically for users with little to no technical knowledge. The platform follows WhatsApp/PhonePe's principle of "simplicity first" with large buttons, colorful cards, and icon-driven interfaces.

## Design Principles

### Mobile-First Philosophy
- **Large Touch Targets**: Minimum 44x44px for all interactive elements
- **Thumb-Friendly**: Primary actions within reach of bottom half of screen
- **Minimal Scrolling**: Key information visible without scrolling
- **Low Bandwidth Ready**: Optimized for 3G networks

### Visual Design
- **Color Palette**: Forest Green (#106141) primary, with Leaf Green, Fresh Mint, and Golden Yellow accents
- **Typography**: Fraunces (serif) for headings, Inter (sans-serif) for body
- **Icons**: Emoji-based for familiarity, supplemented with Lucide React icons
- **Cards**: Rounded corners (20px+), soft shadows, glass morphism effects

### Language Support
- English, Telugu, Hindi
- Large language switcher in header
- Context-aware translations throughout

## Built Dashboards

### 1. Farmer Dashboard (`/farmer/dashboard`)
**Purpose**: Main home screen for farmers

**Key Components**:
- Farmer info summary (name, wallet, weather, crop health)
- Action cards for quick access:
  - Book Tractor
  - Book Harvester
  - Book Drone Spray
  - AI Crop Doctor
  - Marketplace
  - Government Schemes
  - Weather
  - My Wallet
  - My Bookings
  - Support
- Upcoming bookings tracker
- Farming tips (seasonal guidance)
- Metric summary cards

**Data Sources**:
- `getFarmerDashboardData()` - Complete dashboard data
- `getFarmerWeather()` - Location-based weather
- `getFarmerSchemeEligibility()` - Government scheme matching
- `getFarmerBookingHistory()` - Recent bookings
- `getFarmerAiHistory()` - AI crop doctor history

### 2. Telecaller Dashboard (`/telecaller/dashboard`)
**Purpose**: Lead management and call tracking

**Key Features**:
- Today's call statistics (total, completed, pending)
- Conversion rate tracking
- Pending leads list with 1-tap calling
- Call history with farmer details
- Performance metrics

### 3. Field Agent Dashboard (`/field-agent/dashboard`)
**Purpose**: On-ground field visit management

**Key Features**:
- Daily visit planning
- GPS check-in tracking
- Photo capture for field documentation
- Village map with all registered farmers
- Daily report submission
- Visit status tracking (pending, in-progress, completed)

### 4. Machinery Owner Dashboard (`/machinery-owner/dashboard`)
**Purpose**: Machine fleet management

**Key Features**:
- Machine inventory (status, daily rate, availability)
- Booking calendar
- Revenue tracking (daily, monthly)
- Maintenance scheduling
- Machine-specific booking details

### 5. Drone Operator Dashboard (`/drone-operator/dashboard`)
**Purpose**: Drone mission and flight management

**Key Features**:
- Today's missions list
- Flight history with earnings
- Mission status (scheduled, in-progress, completed)
- Drone health monitoring (battery, motor, camera, GPS)
- Mission-specific farmer and area details

### 6. Admin Dashboard (`/admin/dashboard`)
**Purpose**: Platform management and analytics

**Key Features**:
- Real-time statistics (users, orders, bookings, leads)
- Recent orders monitoring
- System health tracking
- Tabs for different management areas:
  - Overview (orders, system health)
  - Users management
  - Content management
  - System settings

## Component Architecture

### Reusable Components

#### ActionCard
- Colorful action cards with emoji icons
- Supports 5 color schemes: green, blue, orange, purple, teal
- Hover animation with Framer Motion
- Optional badge for notifications

```tsx
<ActionCard
  title="Book Tractor"
  icon="🚜"
  description="Rent a tractor"
  href="/book/tractor"
  color="green"
/>
```

#### MetricSummary
- Displays key numbers with icons
- Supports trends (up/down)
- Formatted values (currency, percent, etc.)
- Compact mobile-friendly layout

```tsx
<MetricSummary
  label="My Wallet"
  value={2500}
  format="currency"
  icon={<Wallet />}
/>
```

#### FarmerInfoSummary
- Farmer profile card
- Shows name, village, wallet balance
- Weather widget
- Crop health indicator

#### UpcomingBookings
- List of upcoming bookings
- Shows booking details
- Status tracking
- Easy navigation to booking details

#### LanguageSwitcher
- Large, visible language selector
- Supports English, Telugu, Hindi
- Stores preference in localStorage

#### BottomNavigation
- Mobile-optimized navigation
- 5 main categories
- Always accessible
- Touch-friendly spacing

#### FarmingTips
- Seasonal farming guidance
- Category-based tips
- Easy-to-read format

### Layout Components

#### Farmer Layout (`app/farmer/layout.tsx`)
- Includes bottom navigation for mobile
- Header with language switcher
- Footer
- Responsive max-width container

## Data Schema Integration

### Farmer Profile
```sql
farmers {
  id, user_id, village_id, land_size, crops, 
  experience_years, preferred_language
}
```

### Bookings
```sql
bookings {
  id, renter_id, machine_id, owner_id,
  start_date, end_date, status, total_cost
}
```

### Drone Missions
```sql
drone_missions {
  id, operator_id, farmer_id, area_acres,
  service_type, mission_date, status, earnings
}
```

### Government Schemes
```sql
schemes {
  id, name, code, category_id, eligibility,
  status, benefits, requirements
}
```

## Accessibility Guidelines

- **Large Fonts**: Minimum 16px for body text
- **High Contrast**: All text meets WCAG AA standards
- **Color-Blind Friendly**: Not relying on color alone for information
- **No Tiny Buttons**: All interactive elements ≥44px
- **Voice Support**: Future-ready for voice interactions
- **Offline Mode**: Core features work offline (future)

## Responsive Breakpoints

- **Mobile**: < 640px (full-width single column)
- **Tablet**: 640px - 1024px (2-column grid)
- **Desktop**: > 1024px (3+ column grid)
- **XL**: > 1280px (full multi-column experience)

## Performance Optimizations

- **Image Optimization**: AVIF/WebP formats with fallbacks
- **Code Splitting**: Lazy loading of dashboard components
- **CSS Minification**: Tree-shaken Tailwind CSS
- **Animations**: GPU-accelerated with Framer Motion
- **Caching**: Strategic use of Next.js caching

## API Integration Points

### Farmer Dashboard
- `GET /api/farmer/profile` - User profile
- `GET /api/farmer/weather` - Weather data
- `GET /api/farmer/bookings` - Active bookings
- `GET /api/farmer/schemes` - Eligible schemes
- `GET /api/ai/crop-doctor` - AI predictions

### Telecaller Dashboard
- `GET /api/telecaller/leads` - Lead list
- `POST /api/telecaller/call-log` - Log calls
- `GET /api/telecaller/stats` - Performance metrics

### Field Agent Dashboard
- `GET /api/fieldagent/visits` - Visit schedule
- `POST /api/fieldagent/checkin` - GPS check-in
- `POST /api/fieldagent/photo-upload` - Image upload
- `POST /api/fieldagent/report` - Daily report

### Machinery Owner Dashboard
- `GET /api/machinery/fleet` - Machine list
- `GET /api/machinery/bookings` - Booking details
- `GET /api/machinery/revenue` - Revenue tracking
- `POST /api/machinery/maintenance` - Schedule maintenance

### Drone Operator Dashboard
- `GET /api/drone/missions` - Mission list
- `POST /api/drone/mission-start` - Start mission
- `GET /api/drone/health` - Drone status
- `GET /api/drone/earnings` - Revenue tracking

## Future Enhancements

1. **Voice Search**: Speech-to-text for Indian languages
2. **Offline Mode**: Core features work without internet
3. **USSD Support**: SMS-based interactions for feature phones
4. **Live Chat Support**: In-app customer support
5. **Payment Integration**: Multiple payment methods
6. **Analytics**: Usage patterns for optimization
7. **Dark Mode**: Optional dark theme
8. **Accessibility**: Screen reader support

## Development Guidelines

### Adding New Features
1. Always check mobile first
2. Use existing components when possible
3. Maintain the color palette
4. Test on slow networks (2G/3G)
5. Follow the naming conventions

### Component Naming
- Dashboard pages: `app/[role]/dashboard/page.tsx`
- Components: `components/dashboard/[feature].tsx`
- Query functions: `lib/queries/[role]-dashboard.ts`

### Styling Guidelines
- Use Tailwind CSS utility classes
- Leverage CSS variables for colors
- Mobile-first responsive design
- No hardcoded colors in components
- Always test on mobile devices

## Testing Checklist

- [ ] All buttons 44x44px minimum
- [ ] Text readable on mobile (16px+ body text)
- [ ] Works on 3G networks (< 3MB total)
- [ ] No horizontal scrolling on mobile
- [ ] Language switching works
- [ ] All links functional
- [ ] Forms easy to fill on mobile
- [ ] Loading states visible
- [ ] Error messages clear
- [ ] Works offline (where applicable)

## Support

For questions about the AgreeConnect farmer dashboard architecture, refer to:
- AgreeConnect.md for technical details
- This guide for design and component documentation
- Individual dashboard pages for implementation examples
