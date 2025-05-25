// Shared components
export { BottomNav, PageHeader, LoadingSpinner, ErrorMessage, TabNavigation, EmptyState } from './shared';

// Cart components
export { Cart, CartItem, CartSummary, CartStallGroup, EmptyCart, FloatingCartButton } from './cart';

// Home components
export { Home, StallCard, SearchBar, StallsGrid, LoadingState, ErrorState } from './home';

// Profile components
export { Profile, UserInfo, OrderHistory, UserPreferences, LogoutSection } from './profile';

// Payment components
export { PaymentMethodSelector, OrderSummaryCard, PaymentButton, usePayment } from './payment';

// Admin components
export { AdminPanel, AdminDashboard, AdminStalls, AdminUsers, UserTable, RoleChangeModal, CreateUserModal, StallEditModal, MenuItemEditModal } from './admin';

// Stall Owner components
export { StallManagement, StallOrders, FoodTracking, StallMenuItems, MenuItemModal } from './stall-owner';

// Auth components
export { default as Login } from './auth/Login';
export { default as Register } from './auth/Register';

// Stall Menu components
export { default as MenuItemCard } from './stall-menu/MenuItemCard';
export { default as MenuItemDetail } from './stall-menu/MenuItemDetail';

// Order components
export { default as OrderProgress } from './orders/OrderProgress';
export { default as OrderTrackingDetail } from './orders/OrderTrackingDetail';

// You can also create specific exports if needed
// export { BottomNav, FloatingCartButton } from './shared';
// export { MenuItemCard, MenuItemDetail } from './stall-menu';
// export { OrderProgress, OrderTrackingDetail } from './orders'; 