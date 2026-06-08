
import { Promotion, Category } from './types';

export const CATEGORIES: Category[] = [
  'All',
  'Mode',
  'Restauration',
  'High-Tech',
  'Beauté',
  'Maison',
  'Sport',
  'Voyage'
];

export const MOCK_PROMOTIONS: Promotion[] = [
  {
    id: '1',
    title: 'iPhone 15 Pro - Limited Offer',
    description: 'Get the latest iPhone with a massive discount. Limited stock available.',
    partnerId: 'p1',
    partnerName: 'TechStore',
    category: 'High-Tech',
    imageUrl: 'https://images.unsplash.com/photo-1696446701796-da61225697cc?auto=format&fit=crop&w=800&q=80',
    originalPrice: 12000,
    discountedPrice: 9500,
    discountPercentage: 20,
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    status: 'active',
    tags: ['Apple', 'Smartphone', 'Premium'],
    views: 1250,
    clicks: 450,
    favoritesCount: 89,
    isVerifiedPartner: true
  },
  {
    id: '2',
    title: 'Nike Air Max - Summer Sale',
    description: 'Step up your game with 40% off on all Nike Air Max models.',
    partnerId: 'p2',
    partnerName: 'SportCenter',
    category: 'Sport',
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
    originalPrice: 1500,
    discountedPrice: 900,
    discountPercentage: 40,
    startDate: '2024-05-01',
    endDate: '2024-06-30',
    status: 'active',
    tags: ['Shoes', 'Sale', 'Nike'],
    views: 2300,
    clicks: 800,
    favoritesCount: 156,
    isVerifiedPartner: true
  },
  {
    id: '3',
    title: 'Gourmet Burger Menu for Two',
    description: 'Enjoy our signature burgers with drinks and fries at a special price.',
    partnerId: 'p3',
    partnerName: 'BurgerKing',
    category: 'Restauration',
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
    originalPrice: 250,
    discountedPrice: 150,
    discountPercentage: 40,
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    status: 'active',
    tags: ['Food', 'Combo', 'Delicious'],
    views: 800,
    clicks: 320,
    favoritesCount: 45
  },
  {
    id: '4',
    title: 'Luxury Spa Weekend',
    description: 'Relax and unwind with a full weekend pas at our luxury spa.',
    partnerId: 'p4',
    partnerName: 'ZenResort',
    category: 'Beauté',
    imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecee?auto=format&fit=crop&w=800&q=80',
    originalPrice: 3000,
    discountedPrice: 1800,
    discountPercentage: 40,
    startDate: '2024-05-15',
    endDate: '2024-08-15',
    status: 'active',
    tags: ['Relax', 'Healtcare', 'Luxury'],
    views: 1500,
    clicks: 200,
    favoritesCount: 112
  }
];
