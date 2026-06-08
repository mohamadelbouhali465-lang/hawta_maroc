
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Promotion, UserProfile, BuyerRequest } from '../types';
import { MOCK_PROMOTIONS } from '../constants';
import { translations } from '../translations';

interface Notification {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

interface AppContextType {
  // Navigation & Auth
  isLoggedIn: boolean;
  setIsLoggedIn: (val: boolean) => void;
  currentUser: UserProfile | null;
  signIn: (email: string, password: string) => Promise<boolean>;
  signOut: () => void;
  updateUserProfile: (updates: Partial<UserProfile>) => Promise<boolean>;
  // Compare & Favorites
  compareList: Promotion[];
  addToCompare: (promo: Promotion) => void;
  removeFromCompare: (id: string) => void;
  favorites: string[];
  toggleFavorite: (id: string) => void;
  // Search & Filter
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  // Promotions
  promotions: Promotion[];
  addPromotion: (promo: Promotion) => void;
  updatePromotion: (id: string, updates: Partial<Promotion>) => Promise<boolean>;
  deletePromotion: (id: string) => Promise<boolean>;
  createBuyerRequest: (request: Omit<BuyerRequest, 'id' | 'status'>) => Promise<boolean>;
  buyPromotion: (promo: Promotion) => Promise<boolean>;
  logActivity: (type: string, message: string, metadata?: Record<string, unknown>) => Promise<boolean>;
  // Language
  language: string;
  setLanguage: (lang: string) => void;
  // Notifications
  notifications: Notification[];
  addNotification: (message: string, type?: 'success' | 'info' | 'error') => void;
  removeNotification: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [compareList, setCompareList] = useState<Promotion[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [promotions, setPromotions] = useState<Promotion[]>(MOCK_PROMOTIONS);
  const [language, setLanguage] = useState('English');
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const savedUser = localStorage.getItem('hawta_user');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setCurrentUser(user);
      setIsLoggedIn(true);
      setFavorites(user.favorites || []);
    }
  }, []);

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const response = await fetch('/api/deals');
        if (response.ok) {
          const data = await response.json();
          if (data && data.length > 0) {
            setPromotions(data);
          }
        }
      } catch (error) {
        console.error('Failed to fetch promotions from backend:', error);
      }
    };
    fetchPromotions();
  }, []);

  const addNotification = (message: string, type: 'success' | 'info' | 'error' = 'info') => {
    const id = Math.random().toString(36).substr(2, 9);
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => removeNotification(id), 5000);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const signIn = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error || 'Failed to sign in');
      }
      const user = await response.json();
      setCurrentUser(user);
      setIsLoggedIn(true);
      setFavorites(user.favorites || []);
      localStorage.setItem('hawta_user', JSON.stringify(user));
      return true;
    } catch (error) {
      console.error('Failed to sign in:', error);
      addNotification(error instanceof Error ? error.message : 'Failed to sign in', 'error');
      return false;
    }
  };

  const signOut = () => {
    setCurrentUser(null);
    setIsLoggedIn(false);
    setFavorites([]);
    localStorage.removeItem('hawta_user');
    addNotification('Signed out successfully', 'success');
  };

  const updateUserProfile = async (updates: Partial<UserProfile>) => {
    if (!currentUser) {
      addNotification('Please sign in first', 'error');
      return false;
    }
    try {
      const response = await fetch(`/api/users/${currentUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error || 'Failed to update profile');
      }
      const user = await response.json();
      setCurrentUser(user);
      setFavorites(user.favorites || []);
      localStorage.setItem('hawta_user', JSON.stringify(user));
      addNotification('Profile saved to database', 'success');
      return true;
    } catch (error) {
      console.error('Failed to update profile:', error);
      addNotification('Profile was not saved to the database', 'error');
      return false;
    }
  };

  const addToCompare = (promo: Promotion) => {
    const t = (translations as any)[language] || translations.English;
    if (compareList.length >= 4) {
      addNotification(t.compare_limit_reached, 'error');
      return;
    }
    if (!compareList.find(p => p.id === promo.id)) {
      setCompareList([...compareList, promo]);
      addNotification(t.added_to_compare, 'success');
    }
  };

  const removeFromCompare = (id: string) => {
    setCompareList(compareList.filter(p => p.id !== id));
  };

  const toggleFavorite = async (id: string) => {
    const t = (translations as any)[language] || translations.English;
    const nextFavorites = favorites.includes(id)
      ? favorites.filter(fid => fid !== id)
      : [...favorites, id];
    setFavorites(prev => {
      const exists = prev.includes(id);
      if (exists) {
        addNotification(t.removed_from_favorites);
        return prev.filter(fid => fid !== id);
      } else {
        addNotification(t.added_to_favorites, 'success');
        return [...prev, id];
      }
    });
    if (currentUser) {
      await updateUserProfile({ favorites: nextFavorites });
    }
  };

  const addPromotion = async (promo: Promotion) => {
    const t = (translations as any)[language] || translations.English;
    try {
      const response = await fetch('/api/deals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(promo),
      });
      if (response.ok) {
        const newPromo = await response.json();
        setPromotions(prev => [newPromo, ...prev]);
        addNotification(t.offer_created_success, 'success');
      } else {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error || 'Failed to save promotion');
      }
    } catch (error) {
      console.error('Failed to save promotion to backend:', error);
      addNotification('Offer was not saved to the database. Check MongoDB connection.', 'error');
    }
  };

  const updatePromotion = async (id: string, updates: Partial<Promotion>) => {
    try {
      const response = await fetch(`/api/deals/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error || 'Failed to update deal');
      }
      const updated = await response.json();
      setPromotions(prev => prev.map(p => p.id === id ? updated : p));
      addNotification('Deal updated in database', 'success');
      return true;
    } catch (error) {
      console.error('Failed to update deal:', error);
      addNotification('Deal was not updated in the database', 'error');
      return false;
    }
  };

  const deletePromotion = async (id: string) => {
    try {
      const response = await fetch(`/api/deals/${id}`, { method: 'DELETE' });
      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error || 'Failed to delete deal');
      }
      setPromotions(prev => prev.filter(p => p.id !== id));
      setFavorites(prev => prev.filter(favoriteId => favoriteId !== id));
      setCompareList(prev => prev.filter(p => p.id !== id));
      addNotification('Deal deleted from database', 'success');
      return true;
    } catch (error) {
      console.error('Failed to delete deal:', error);
      addNotification('Deal was not deleted from the database', 'error');
      return false;
    }
  };

  const createBuyerRequest = async (request: Omit<BuyerRequest, 'id' | 'status'>) => {
    try {
      const response = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error || 'Failed to publish request');
      }
      addNotification('Request saved to database', 'success');
      return true;
    } catch (error) {
      console.error('Failed to create request:', error);
      addNotification('Request was not saved to the database', 'error');
      return false;
    }
  };

  const buyPromotion = async (promo: Promotion) => {
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dealId: promo.id,
          title: promo.title,
          price: promo.discountedPrice,
          buyerEmail: currentUser?.email || 'guest@hawta-maroc.local',
          status: 'pending',
        }),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error || 'Failed to create order');
      }
      addNotification('Order saved to database', 'success');
      return true;
    } catch (error) {
      console.error('Failed to create order:', error);
      addNotification('Order was not saved to the database', 'error');
      return false;
    }
  };

  const logActivity = async (type: string, message: string, metadata: Record<string, unknown> = {}) => {
    try {
      const response = await fetch('/api/activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, message, metadata }),
      });
      if (!response.ok) throw new Error('Failed to log activity');
      addNotification(message, 'success');
      return true;
    } catch (error) {
      console.error('Failed to log activity:', error);
      addNotification(message, 'info');
      return false;
    }
  };

  return (
    <AppContext.Provider value={{ 
      isLoggedIn,
      setIsLoggedIn,
      currentUser,
      signIn,
      signOut,
      updateUserProfile,
      compareList, 
      addToCompare, 
      removeFromCompare, 
      favorites, 
      toggleFavorite,
      searchQuery,
      setSearchQuery,
      promotions,
      addPromotion,
      updatePromotion,
      deletePromotion,
      createBuyerRequest,
      buyPromotion,
      logActivity,
      language,
      setLanguage,
      notifications,
      addNotification,
      removeNotification
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};
