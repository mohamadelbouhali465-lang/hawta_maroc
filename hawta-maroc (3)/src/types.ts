
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
  status: 'active' | 'suspended' | 'pending';
  email: string;
  phone: string;
}

export type Category = 'All' | 'Mode' | 'Restauration' | 'High-Tech' | 'Beauté' | 'Maison' | 'Sport' | 'Voyage';

export type UserRole = 'admin' | 'user' | 'client';

export interface UserAccount {
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  location?: string;
  password?: string;
  avatar?: string;
}

export interface TrackedOrder {
  id: string;
  promotionId: string;
  productTitle: string;
  productImage: string;
  price: number;
  quantity: number;
  total: number;
  date: string;
  status: 'placed' | 'confirmed' | 'shipped' | 'out_for_delivery' | 'delivered';
  partnerName: string;
  city: string;
  address: string;
  phone: string;
}


