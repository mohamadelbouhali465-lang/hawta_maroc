
export interface Promotion {
  id: string;
  title: string;
  description: string;
  partnerId: string;
  partnerName: string;
  category: string;
  imageUrl: string;
  originalPrice: number;
  discountedPrice: number;
  discountPercentage: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'pending' | 'expired' | 'paused';
  tags: string[];
  views: number;
  clicks: number;
  favoritesCount: number;
  isVerifiedPartner?: boolean;
}

export interface Partner {
  id: string;
  name: string;
  logo: string;
  category: string;
  description: string;
  verified: boolean;
  joinDate: string;
}

export type Category = 'All' | 'Mode' | 'Restauration' | 'High-Tech' | 'Beauté' | 'Maison' | 'Sport' | 'Voyage';
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  role: 'customer' | 'partner' | 'admin';
  category?: string;
  favorites: string[];
  notificationPreferences?: {
    emailAlerts: boolean;
    pushNotifications: boolean;
    partnerOffers: boolean;
    accountActivity: boolean;
  };
}

export interface BuyerRequest {
  id: string;
  title: string;
  description?: string;
  category?: string;
  budget?: number;
  contactEmail?: string;
  status: 'open' | 'closed';
}
