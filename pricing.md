
## Complete Pricing System Flow & File Breakdown

### **Main Entry Point**
**`pricingpage.tsx`** - The main component that orchestrates the entire pricing page:
- Uses `useAutoCountryDetection` to automatically detect user's country for localized pricing
- Renders the hero section and main pricing component
- Passes the detected country to the pricing system

### **Core Pricing Logic**
**`pricing.tsx`** - The central pricing component that:
- Initializes Paddle (payment processor) with environment variables
- Manages billing frequency state (monthly/yearly toggle)
- Uses `usePaddlePrices` hook to fetch real-time pricing from Paddle
- Renders the toggle and price cards

### **Data & Configuration**
**`pricing-tier.ts`** - Defines the pricing structure:
- Contains 3 tiers: Free, Pro, and Hobby
- Each tier has price IDs for Paddle integration, static prices, and plan IDs
- Defines features, descriptions, and visual properties for each tier

**`billing-frequency.ts`** - Defines billing options:
- Monthly and yearly billing frequencies
- Price suffixes for display ("per user/month", "per user/year")

### **Price Management**
**`usePaddlePrices.ts`** - Custom hook for dynamic pricing:
- Fetches real-time prices from Paddle based on user's country
- Handles price preview requests with proper line items
- Returns formatted prices and loading states
- Falls back to static prices if Paddle is unavailable

**`useAutoCountryDetection.ts`** - Geolocation hook:
- Automatically detects user's country using IP geolocation
- Falls back to timezone detection if IP geolocation fails
- Maps timezones to country codes for pricing localization
- Defaults to US if detection fails

### **UI Components**

**`price-cards.tsx`** - Main pricing display:
- Renders all pricing tiers in a grid layout
- Handles checkout URL generation (free → signup, paid → checkout)
- Manages price display logic and featured card styling
- Integrates with all sub-components

**`toggle.tsx`** - Billing frequency selector:
- Allows users to switch between monthly and yearly billing
- Uses Radix UI tabs for accessibility
- Updates pricing display when frequency changes

**`price-amount.tsx`** - Price display component:
- Shows dynamic prices from Paddle or static fallback prices
- Handles loading states with skeleton components
- Formats prices with proper currency symbols

**`price-title.tsx`** - Tier header component:
- Displays tier name, icon, and "Most Popular" badge for featured tiers
- Applies special styling for featured cards

**`features-list.tsx`** - Feature display:
- Lists all features for each pricing tier
- Uses checkmark icons for visual appeal

**`hero-section.tsx`** - Page header:
- Displays the main pricing page title and description
- Sets the tone for the pricing experience

### **UI Utilities**
**`tabs.tsx`** - Reusable tab component:
- Built with Radix UI for accessibility
- Used by the billing frequency toggle
- Provides consistent tab styling

**`featured-card-gradient.tsx`** - Visual enhancement:
- Adds gradient effects to featured pricing cards
- Creates visual hierarchy to highlight the "Pro" tier

**`home-page.css`** - Styling:
- Contains all custom CSS for the pricing page
- Defines gradient effects, card borders, and visual enhancements
- Handles responsive design and animations

## **Complete User Flow:**

1. **Page Load**: `pricingpage.tsx` loads and starts country detection
2. **Country Detection**: `useAutoCountryDetection` determines user's location
3. **Paddle Initialization**: `pricing.tsx` initializes Paddle payment processor
4. **Price Fetching**: `usePaddlePrices` fetches localized prices from Paddle
5. **UI Rendering**: Price cards display with real-time pricing
6. **User Interaction**: Users can toggle between monthly/yearly billing
7. **Checkout**: Clicking "Get Started" redirects to appropriate checkout flow

## **Key Features:**
- **Real-time pricing** from Paddle with country-based localization
- **Automatic country detection** with multiple fallback methods
- **Responsive design** with modern UI components
- **Accessible** using Radix UI primitives
- **Graceful fallbacks** when Paddle is unavailable
- **Visual hierarchy** with featured card highlighting

This is a sophisticated pricing system that provides a professional, localized pricing experience with real-time price updates and smooth user interactions.