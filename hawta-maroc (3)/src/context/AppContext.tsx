
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Promotion, UserRole, UserAccount, Partner, TrackedOrder } from '../types';
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
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  currentUser: UserAccount | null;
  setCurrentUser: (user: UserAccount | null) => void;
  logout: () => void;
  // Checkout/Purchase
  purchasingProduct: Promotion | null;
  setPurchasingProduct: (promo: Promotion | null) => void;
  orders: TrackedOrder[];
  addOrder: (order: TrackedOrder) => void;
  updateOrderStatus: (id: string, status: 'placed' | 'confirmed' | 'shipped' | 'out_for_delivery' | 'delivered') => void;
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
  deletePromotion: (id: string) => void;
  // Partners / Sellers Management
  partners: Partner[];
  updatePartnerStatus: (id: string, status: 'active' | 'suspended' | 'pending') => void;
  deletePartner: (id: string) => void;
  togglePartnerVerification: (id: string) => void;
  applyAsSeller: (info: { name: string; category: string; description: string; email: string; phone: string }) => void;
  // Admin Promotion Approval
  approvePromotion: (id: string) => void;
  rejectPromotion: (id: string) => void;
  // Users Management
  users: UserAccount[];
  updateUserRole: (email: string, role: UserRole) => void;
  deleteUser: (email: string) => void;
  registerUser: (user: UserAccount) => void;
  // Language
  language: string;
  setLanguage: (lang: string) => void;
  // Categories Management
  categories: string[];
  addCategory: (category: string) => void;
  deleteCategory: (category: string) => void;
  // Notifications
  notifications: Notification[];
  addNotification: (message: string, type?: 'success' | 'info' | 'error') => void;
  removeNotification: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const INITIAL_PARTNERS: Partner[] = [
  {
    id: 'p1',
    name: 'TechStore',
    logo: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    category: 'High-Tech',
    description: 'Premier wholesale supplier of smartphones and technology accessories in Casablanca.',
    verified: true,
    joinDate: '2023-11-12',
    status: 'active',
    email: 'contact@techstore.ma',
    phone: '+212 522-345678'
  },
  {
    id: 'p2',
    name: 'SportCenter',
    logo: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80',
    category: 'Sport',
    description: 'Official athletic garments and bulk sneaker supplier in Rabat.',
    verified: true,
    joinDate: '2024-01-20',
    status: 'active',
    email: 'sales@sportcenter.ma',
    phone: '+212 537-891011'
  },
  {
    id: 'p3',
    name: 'BurgerKing',
    logo: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=150&q=80',
    category: 'Restauration',
    description: 'Wholesale hospitality, catering services, and premium food franchise packages.',
    verified: false,
    joinDate: '2024-03-05',
    status: 'active',
    email: 'wholesale@burgerking.ma',
    phone: '+212 522-998877'
  },
  {
    id: 'p4',
    name: 'ZenResort',
    logo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80',
    category: 'Beauté',
    description: 'Wellness, luxury spa franchise, and wholesale organic cosmetic materials from Agadir.',
    verified: false,
    joinDate: '2024-04-12',
    status: 'suspended',
    email: 'info@zenresort.ma',
    phone: '+212 528-665544'
  }
];

const INITIAL_USERS: UserAccount[] = [
  {
    name: 'System Admin',
    email: 'admin@hawta.com',
    role: 'admin',
    phone: '+212 600-111111',
    location: 'Rabat, Morocco',
    password: 'admin'
  },
  {
    name: 'TechStore Supplier',
    email: 'contact@techstore.ma',
    role: 'user',
    phone: '+212 522-345678',
    location: 'Casablanca, Morocco',
    password: 'password'
  },
  {
    name: 'SportCenter Distributor',
    email: 'sales@sportcenter.ma',
    role: 'user',
    phone: '+212 537-891011',
    location: 'Rabat, Morocco',
    password: 'password'
  },
  {
    name: 'Mohamed El Bouhali',
    email: 'mohamadelbouhali465@gmail.com',
    role: 'client',
    phone: '+212 612-345678',
    location: 'Marrakech, Morocco',
    password: 'password'
  },
  {
    name: 'Anas Mansouri',
    email: 'anas@gmail.com',
    role: 'client',
    phone: '+212 655-778899',
    location: 'Tangier, Morocco',
    password: 'password'
  },
  {
    name: 'Yasmine Alami',
    email: 'yasmine@gmail.com',
    role: 'client',
    phone: '+212 644-223344',
    location: 'Fes, Morocco',
    password: 'password'
  }
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedInState] = useState(() => {
    return localStorage.getItem('hawta_isLoggedIn') === 'true';
  });
  const [userRole, setUserRoleState] = useState<UserRole>(() => {
    return (localStorage.getItem('hawta_userRole') as UserRole) || 'client';
  });
  const [currentUser, setCurrentUserState] = useState<UserAccount | null>(() => {
    const saved = localStorage.getItem('hawta_currentUser');
    return saved ? JSON.parse(saved) : null;
  });

  const [compareList, setCompareList] = useState<Promotion[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [promotions, setPromotions] = useState<Promotion[]>(MOCK_PROMOTIONS);

  const [orders, setOrders] = useState<TrackedOrder[]>(() => {
    const saved = localStorage.getItem('hawta_orders');
    return saved ? JSON.parse(saved) : [
      {
        id: 'HAWTA-784920',
        promotionId: '2',
        productTitle: 'Nike Air Max - Summer Sale',
        productImage: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
        price: 900,
        quantity: 1,
        total: 935,
        date: '2026-06-11',
        status: 'shipped',
        partnerName: 'SportCenter',
        city: 'Rabat',
        address: 'Avenue de France, Agdal',
        phone: '+212 612-345678'
      },
      {
        id: 'HAWTA-421039',
        promotionId: '1',
        productTitle: 'iPhone 15 Pro - Limited Offer',
        productImage: 'https://images.unsplash.com/photo-1696446701796-da61225697cc?auto=format&fit=crop&w=800&q=80',
        price: 9500,
        quantity: 1,
        total: 9500,
        date: '2026-06-08',
        status: 'delivered',
        partnerName: 'TechStore',
        city: 'Casablanca',
        address: 'Boulevard Zerktouni, Gauthier',
        phone: '+212 612-345678'
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('hawta_orders', JSON.stringify(orders));
  }, [orders]);

  const addOrder = async (order: TrackedOrder) => {
    setOrders(prev => [order, ...prev]);
    try {
      await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order)
      });
    } catch (error) {
      console.error('Failed to sync order with MongoDB backend:', error);
    }
  };

  const updateOrderStatus = async (id: string, status: 'placed' | 'confirmed' | 'shipped' | 'out_for_delivery' | 'delivered') => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    try {
      await fetch(`/api/orders/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
    } catch (error) {
      console.error('Failed to sync order status update with MongoDB backend:', error);
    }
  };

  const [partners, setPartners] = useState<Partner[]>(() => {
    const saved = localStorage.getItem('hawta_partners');
    return saved ? JSON.parse(saved) : INITIAL_PARTNERS;
  });

  useEffect(() => {
    localStorage.setItem('hawta_partners', JSON.stringify(partners));
  }, [partners]);

  const [users, setUsers] = useState<UserAccount[]>(() => {
    const saved = localStorage.getItem('hawta_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  useEffect(() => {
    localStorage.setItem('hawta_users', JSON.stringify(users));
  }, [users]);
  const [language, setLanguage] = useState('English');
  const [categories, setCategories] = useState<string[]>(() => {
    const saved = localStorage.getItem('hawta_categories');
    return saved ? JSON.parse(saved) : ['All', 'Mode', 'Restauration', 'High-Tech', 'Beauté', 'Maison', 'Sport', 'Voyage'];
  });

  useEffect(() => {
    localStorage.setItem('hawta_categories', JSON.stringify(categories));
  }, [categories]);

  const addCategory = async (category: string) => {
    const trimmed = category.trim();
    if (!trimmed) return;
    const formatted = trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
    if (categories.some(c => c.toLowerCase() === formatted.toLowerCase())) {
      addNotification(
        language === 'English' ? 'Category already exists!' : 'La catégorie existe déjà !',
        'error'
      );
      return;
    }
    setCategories(prev => [...prev, formatted]);
    addNotification(
      language === 'English' ? `Category "${formatted}" added!` : `Catégorie "${formatted}" ajoutée !`,
      'success'
    );
    try {
      await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category: formatted })
      });
    } catch (error) {
      console.error('Failed to sync added category with MongoDB:', error);
    }
  };

  const deleteCategory = async (category: string) => {
    const standardCategories = ['All', 'Mode', 'Restauration', 'High-Tech', 'Beauté', 'Maison', 'Sport', 'Voyage'];
    if (standardCategories.some(c => c.toLowerCase() === category.toLowerCase())) {
      addNotification(
        language === 'English' ? 'Cannot delete system categories!' : 'Impossible de supprimer des catégories système !',
        'error'
      );
      return;
    }
    setCategories(prev => prev.filter(c => c.toLowerCase() !== category.toLowerCase()));
    addNotification(
      language === 'English' ? `Category "${category}" removed!` : `Catégorie "${category}" supprimée !`,
      'success'
    );
    try {
      await fetch(`/api/categories/${encodeURIComponent(category)}`, {
        method: 'DELETE'
      });
    } catch (error) {
      console.error('Failed to sync deleted category with MongoDB:', error);
    }
  };

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [purchasingProduct, setPurchasingProduct] = useState<Promotion | null>(null);

  const setIsLoggedIn = (val: boolean) => {
    setIsLoggedInState(val);
    localStorage.setItem('hawta_isLoggedIn', val ? 'true' : 'false');
  };

  const setUserRole = (role: UserRole) => {
    setUserRoleState(role);
    localStorage.setItem('hawta_userRole', role);
    if (currentUser) {
      const updatedUser = { ...currentUser, role };
      setCurrentUserState(updatedUser);
      localStorage.setItem('hawta_currentUser', JSON.stringify(updatedUser));
    }
  };

  const setCurrentUser = async (user: UserAccount | null) => {
    setCurrentUserState(user);
    if (user) {
      localStorage.setItem('hawta_currentUser', JSON.stringify(user));
      localStorage.setItem('hawta_userRole', user.role);
      setUserRoleState(user.role);
      // Synchronize with the users list
      setUsers(prev => prev.map(u => u.email.toLowerCase() === user.email.toLowerCase() ? { ...u, ...user } : u));
      try {
        await fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(user)
        });
      } catch (error) {
        console.error('Failed to sync updated user with MongoDB:', error);
      }
    } else {
      localStorage.removeItem('hawta_currentUser');
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setUserRoleState('client');
    localStorage.removeItem('hawta_isLoggedIn');
    localStorage.removeItem('hawta_userRole');
    localStorage.removeItem('hawta_currentUser');
  };

  // Keep the current user's role synchronized with their approved wholesaler partner status
  useEffect(() => {
    if (currentUser && currentUser.role !== 'admin') {
      const matchingPartner = partners.find(
        p => p.email && p.email.toLowerCase() === currentUser.email.toLowerCase()
      );
      if (matchingPartner) {
        if (matchingPartner.status === 'active' && currentUser.role !== 'user') {
          setUserRole('user');
        } else if (matchingPartner.status !== 'active' && currentUser.role === 'user') {
          setUserRole('client');
        }
      }
    }
  }, [partners, currentUser]);


  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const response = await fetch('/api/promotions');
        if (response.ok) {
          const data = await response.json();
          if (data && data.length > 0) setPromotions(data);
        }
      } catch (e) {
        console.error('Failed to fetch promotions from MongoDB backend:', e);
      }

      try {
        const response = await fetch('/api/categories');
        if (response.ok) {
          const data = await response.json();
          if (data && data.length > 0) setCategories(data);
        }
      } catch (e) {
        console.error('Failed to fetch categories from MongoDB backend:', e);
      }

      try {
        const response = await fetch('/api/partners');
        if (response.ok) {
          const data = await response.json();
          if (data && data.length > 0) setPartners(data);
        }
      } catch (e) {
        console.error('Failed to fetch partners from MongoDB backend:', e);
      }

      try {
        const response = await fetch('/api/users');
        if (response.ok) {
          const data = await response.json();
          if (data && data.length > 0) setUsers(data);
        }
      } catch (e) {
        console.error('Failed to fetch users from MongoDB backend:', e);
      }

      try {
        const response = await fetch('/api/orders');
        if (response.ok) {
          const data = await response.json();
          if (data && data.length > 0) setOrders(data);
        }
      } catch (e) {
        console.error('Failed to fetch orders from MongoDB backend:', e);
      }
    };
    fetchAllData();
  }, []);

  const addNotification = (message: string, type: 'success' | 'info' | 'error' = 'info') => {
    const id = Math.random().toString(36).substr(2, 9);
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => removeNotification(id), 5000);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
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

  const toggleFavorite = (id: string) => {
    const t = (translations as any)[language] || translations.English;
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
  };

  const addPromotion = async (promo: Promotion) => {
    const t = (translations as any)[language] || translations.English;
    try {
      const response = await fetch('/api/promotions', {
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
        // Fallback to local state if backend fails
        setPromotions(prev => [promo, ...prev]);
        addNotification(t.offer_created_success, 'success');
      }
    } catch (error) {
      console.error('Failed to save promotion to backend:', error);
      setPromotions(prev => [promo, ...prev]);
      addNotification(t.offer_created_success, 'success');
    }
  };

  const deletePromotion = async (id: string) => {
    setPromotions(prev => prev.filter(p => p.id !== id));
    addNotification(
      language === 'English' 
        ? 'Promotion deleted successfully!' 
        : language === 'Français' 
        ? 'Promotion supprimée avec succès !' 
        : 'تم حذف العرض بنجاح!', 
      'success'
    );
    try {
      await fetch(`/api/promotions/${id}`, { method: 'DELETE' });
    } catch (error) {
      console.error('Failed to sync deleted promotion to MongoDB:', error);
    }
  };

  const updatePartnerStatus = async (id: string, status: 'active' | 'suspended' | 'pending') => {
    setPartners(prev => prev.map(p => {
      if (p.id === id) {
        if (status === 'active' && p.status === 'pending') {
          // If approved, update user's role to 'user' if their email matches
          if (currentUser && (currentUser.email === p.email || currentUser.name === p.name)) {
            setUserRole('user');
          }
        }
        return { ...p, status };
      }
      return p;
    }));

    let msg = '';
    if (status === 'active') {
      msg = language === 'English' ? 'Seller approved and activated!' : 'Grossiste approuvé et activé !';
    } else if (status === 'suspended') {
      msg = language === 'English' ? 'Seller status updated to suspended!' : 'Grossiste suspendu !';
    } else {
      msg = language === 'English' ? 'Seller status updated!' : 'Statut du grossiste mis à jour !';
    }
    addNotification(msg, 'success');

    try {
      await fetch(`/api/partners/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
    } catch (err) {
      console.error('Failed to sync partner status in DB:', err);
    }
  };

  const applyAsSeller = async (info: { name: string; category: string; description: string; email: string; phone: string }) => {
    const newPartner: Partner = {
      id: `p-${Date.now()}`,
      name: info.name,
      logo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
      category: info.category,
      description: info.description,
      verified: false,
      joinDate: new Date().toISOString().split('T')[0],
      status: 'pending',
      email: info.email,
      phone: info.phone
    };
    setPartners(prev => [newPartner, ...prev]);
    addNotification(
      language === 'English'
        ? 'Application submitted! Awaiting administrator approval.'
        : 'Demande soumise ! En attente de l\'approbation de l\'administrateur.',
      'success'
    );

    try {
      await fetch('/api/partners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPartner)
      });
    } catch (err) {
      console.error('Failed to apply as seller in MongoDB DB:', err);
    }
  };

  const togglePartnerVerification = async (id: string) => {
    let nextVerified = false;
    setPartners(prev => prev.map(p => {
      if (p.id === id) {
        nextVerified = !p.verified;
        addNotification(
          language === 'English'
            ? `Seller verification set to: ${nextVerified ? 'Verified' : 'Unverified'}`
            : `Grossiste certifié : ${nextVerified ? 'Oui' : 'Non'}`,
          'success'
        );
        return { ...p, verified: nextVerified };
      }
      return p;
    }));

    try {
      await fetch(`/api/partners/${id}/verification`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ verified: nextVerified })
      });
    } catch (err) {
      console.error('Failed to sync partner verification in DB:', err);
    }
  };

  const deletePartner = async (id: string) => {
    setPartners(prev => prev.filter(p => p.id !== id));
    addNotification(
      language === 'English'
        ? 'Seller deleted successfully from the system!'
        : 'Grossiste supprimé de la plateforme avec succès !',
      'success'
    );

    try {
      await fetch(`/api/partners/${id}`, { method: 'DELETE' });
    } catch (err) {
      console.error('Failed to delete partner in MongoDB:', err);
    }
  };

  const approvePromotion = async (id: string) => {
    setPromotions(prev => prev.map(p => {
      if (p.id === id) {
        addNotification(
          language === 'English'
            ? 'Deal approved and published to clients!'
            : 'Deal approuvé et publié !',
          'success'
        );
        return { ...p, status: 'active' };
      }
      return p;
    }));

    try {
      await fetch(`/api/promotions/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'active' })
      });
    } catch (err) {
      console.error('Failed to update promotion status in DB:', err);
    }
  };

  const rejectPromotion = async (id: string) => {
    setPromotions(prev => prev.map(p => {
      if (p.id === id) {
        addNotification(
          language === 'English'
            ? 'Deal rejected/paused.'
            : 'Deal refusé/suspendu.',
          'info'
        );
        return { ...p, status: 'paused' };
      }
      return p;
    }));

    try {
      await fetch(`/api/promotions/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'paused' })
      });
    } catch (err) {
      console.error('Failed to update promotion status in DB:', err);
    }
  };

  const updateUserRole = async (email: string, role: UserRole) => {
    if (email.toLowerCase() === 'admin@hawta.com') {
      addNotification(
        language === 'English'
          ? 'Cannot change the role of the primary administrator!'
          : 'Impossible de modifier le rôle de l\'administrateur principal !',
        'error'
      );
      return;
    }
    setUsers(prev => prev.map(u => {
      if (u.email.toLowerCase() === email.toLowerCase()) {
        if (currentUser && currentUser.email.toLowerCase() === email.toLowerCase()) {
          setUserRole(role);
        }
        return { ...u, role };
      }
      return u;
    }));
    addNotification(
      language === 'English'
        ? 'User role updated successfully!'
        : 'Rôle de l\'utilisateur mis à jour avec succès !',
      'success'
    );

    try {
      await fetch(`/api/users/${encodeURIComponent(email)}/role`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role })
      });
    } catch (err) {
      console.error('Failed to make user role update on DB:', err);
    }
  };

  const deleteUser = async (email: string) => {
    if (email.toLowerCase() === 'admin@hawta.com') {
      addNotification(
        language === 'English'
          ? 'Cannot delete the primary administrator account!'
          : 'Impossible de supprimer le compte de l\'administrateur principal !',
        'error'
      );
      return;
    }
    setUsers(prev => prev.filter(u => u.email.toLowerCase() !== email.toLowerCase()));
    addNotification(
      language === 'English'
        ? 'User account deleted successfully!'
        : 'Compte de l\'utilisateur supprimé avec succès !',
      'success'
    );

    try {
      await fetch(`/api/users/${encodeURIComponent(email)}`, { method: 'DELETE' });
    } catch (err) {
      console.error('Failed to sync user delete in MongoDB DB:', err);
    }
  };

  const registerUser = async (user: UserAccount) => {
    setUsers(prev => {
      const exists = prev.some(u => u.email.toLowerCase() === user.email.toLowerCase());
      if (exists) return prev;
      return [...prev, user];
    });

    try {
      await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
      });
    } catch (err) {
      console.error('Failed to register user to MongoDB:', err);
    }
  };

  return (
    <AppContext.Provider value={{ 
      isLoggedIn,
      setIsLoggedIn,
      userRole,
      setUserRole,
      currentUser,
      setCurrentUser,
      logout,
      purchasingProduct,
      setPurchasingProduct,
      orders,
      addOrder,
      updateOrderStatus,
      compareList, 
      addToCompare, 
      removeFromCompare, 
      favorites, 
      toggleFavorite,
      searchQuery,
      setSearchQuery,
      promotions,
      addPromotion,
      deletePromotion,
      partners,
      updatePartnerStatus,
      deletePartner,
      togglePartnerVerification,
      applyAsSeller,
      approvePromotion,
      rejectPromotion,
      users,
      updateUserRole,
      deleteUser,
      registerUser,
      language,
      setLanguage,
      categories,
      addCategory,
      deleteCategory,
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
