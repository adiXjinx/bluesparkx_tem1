
## Complete Checkout System Flow & File Breakdown

### **Main Entry Point**
**`checkout-contents.tsx`** - The core checkout component that orchestrates the entire checkout experience:
- Initializes Paddle checkout with inline display mode
- Manages quantity state and checkout data from Paddle events
- Handles user email pre-filling if available
- Sets up checkout configuration (success URL, theme, display mode)
- Renders the price section and payment frame side by side
- Uses throttled updates to prevent excessive API calls

### **Header & Navigation**
**`checkout-header.tsx`** - Simple navigation header:
- Provides back button to return to home page
- Displays the AeroEdit logo
- Maintains brand consistency during checkout

### **Price Display & Order Summary**
**`price-section.tsx`** - Responsive price display component:
- Shows different layouts for desktop vs mobile
- Desktop: Full order summary with price container and line items
- Mobile: Collapsible accordion with order summary
- Integrates quantity controls and price breakdown

**`checkout-price-container.tsx`** - Desktop order summary container:
- Displays "Order summary" title
- Shows total price with tax included
- Handles recurring billing cycle display (for subscriptions)
- Shows "then $X monthly/yearly" for recurring payments

**`checkout-price-amount.tsx`** - Price amount display:
- Shows the total amount in large text
- Includes "inc. tax" indicator
- Handles loading states with skeleton components
- Uses proper currency formatting

**`checkout-line-items.tsx`** - Detailed price breakdown:
- Shows product name and quantity controls
- Displays subtotal, tax, and total amounts
- Handles loading states for each price component
- Uses proper currency formatting for all amounts

### **Quantity Management**
**`quantity-field.tsx`** - Quantity selector component:
- Plus/minus buttons to adjust quantity
- Minimum quantity of 1
- Updates checkout totals when quantity changes
- Styled to match the checkout theme

### **UI Components**
**`accordion.tsx`** - Collapsible content component:
- Built with Radix UI for accessibility
- Used for mobile order summary
- Smooth animations for expand/collapse
- Chevron icon rotation on state change

**`separator.tsx`** - Visual divider component:
- Built with Radix UI primitives
- Used throughout checkout for visual separation
- Supports horizontal and vertical orientations
- Consistent styling with theme

**`skeleton.tsx`** - Loading placeholder component:
- Animated pulse effect for loading states
- Used when checkout data is not yet available
- Consistent with design system

### **Utility Functions**
**`parse-money.ts`** - Currency formatting utilities:
- `convertAmountFromLowestUnit`: Converts Paddle amounts (cents) to decimal
- `parseMoney`: Parses string amounts to formatted currency
- `formatMoney`: Formats numbers as currency with proper locale
- Handles special cases for JPY/KRW (no decimal conversion)

**`data-helpers.ts`** - Data processing utilities:
- `parseSDKResponse`: Safely parses Paddle SDK responses
- `getPaymentReason`: Determines if payment is new or renewal
- `formatBillingCycle`: Formats billing cycles (monthly, yearly, etc.)
- Error handling utilities

## **Complete User Flow:**

1. **Entry**: User clicks "Get Started" from pricing page with specific `priceId`
2. **Initialization**: `checkout-contents.tsx` initializes Paddle with inline checkout
3. **Price Loading**: Paddle fetches real-time pricing based on user's location
4. **UI Setup**: Price section displays order summary, payment frame loads
5. **Quantity Adjustment**: User can modify quantity, totals update in real-time
6. **Payment**: User completes payment in the embedded Paddle frame
7. **Success**: Redirects to `/checkout/success` upon completion

## **Key Features:**

### **Real-time Pricing**
- Dynamic price updates from Paddle based on location
- Tax calculation and display
- Currency formatting based on user's locale

### **Responsive Design**
- Desktop: Side-by-side layout with full order summary
- Mobile: Collapsible accordion for space efficiency
- Consistent experience across devices

### **User Experience**
- Pre-filled email if user is logged in
- Quantity controls with real-time updates
- Loading states for smooth experience
- Clear price breakdown (subtotal, tax, total)

### **Payment Integration**
- Inline Paddle checkout for seamless experience
- Dark theme integration
- Success URL redirection
- Event handling for checkout data

### **Accessibility**
- Radix UI primitives for screen reader support
- Keyboard navigation
- Proper ARIA labels and roles

### **Error Handling**
- Graceful fallbacks for missing data
- Loading states during API calls
- Error messages for failed operations

## **Technical Architecture:**

- **Paddle Integration**: Direct SDK integration for payment processing
- **State Management**: React hooks for quantity and checkout data
- **Event Handling**: Real-time updates from Paddle checkout events
- **Responsive Layout**: CSS Grid and Flexbox for adaptive design
- **Currency Handling**: Proper formatting for international users
- **Performance**: Throttled API calls to prevent rate limiting

This checkout system provides a professional, seamless payment experience with real-time pricing, responsive design, and robust error handling, making it easy for users to complete their purchases.