import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppContext } from '../context/AppContext';
import { 
  Shield, 
  Users, 
  FileText, 
  Check, 
  X, 
  Trash2, 
  AlertCircle, 
  Search, 
  CheckCircle, 
  SlidersHorizontal, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  Clock, 
  TrendingUp,
  UserCheck 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { getTranslatedCategory } from '../translations';

export const AdminDashboard: React.FC = () => {
  const { 
    userRole, 
    setUserRole, 
    promotions, 
    partners, 
    updatePartnerStatus, 
    deletePartner,
    togglePartnerVerification, 
    approvePromotion, 
    rejectPromotion, 
    deletePromotion,
    users,
    updateUserRole,
    deleteUser,
    registerUser,
    language,
    addNotification 
  } = useAppContext();

  const isRTL = language === 'العربية';
  const currency = language === 'العربية' ? 'د.م.' : 'DH';

  // Navigation / Tab States
  const [activeTab, setActiveTab] = useState<'posts' | 'sellers' | 'users'>('posts');
  const [postsFilter, setPostsFilter] = useState<'all' | 'pending' | 'active' | 'paused'>('pending');
  const [sellersSearchQuery, setSellersSearchQuery] = useState('');
  const [postsSearchQuery, setPostsSearchQuery] = useState('');
  const [usersSearchQuery, setUsersSearchQuery] = useState('');
  
  // Custom user addition state
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<'admin' | 'user' | 'client'>('client');
  const [newUserPhone, setNewUserPhone] = useState('');
  const [newUserLocation, setNewUserLocation] = useState('Casablanca, Morocco');

  // Access Control: Strict check
  if (userRole !== 'admin') {
    return (
      <div className="min-h-[calc(100vh-140px)] bg-gray-50 flex items-center justify-center p-6" dir={isRTL ? 'rtl' : 'ltr'}>
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white max-w-xl p-8 rounded-3xl alibaba-shadow border border-gray-100 text-center space-y-6"
        >
          <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mx-auto text-red-500">
            <Shield className="w-10 h-10 animate-pulse" />
          </div>
          <div className="space-y-4">
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">
              {language === 'English' ? 'Administrator Only Access' : 'Accès Administrateur Restreint'}
            </h1>
            <p className="text-gray-500 text-sm leading-relaxed font-medium">
              {language === 'English' 
                ? 'Only users with the Administrator role hold the authorized clearance required to review, moderate, and approve wholesaler posts, manage partner storefront verification, or perform system cleanup operations.' 
                : 'Seuls les utilisateurs dotés du rôle Administrateur disposent des droits nécessaires pour modérer les annonces, gérer la certification des grossistes et administrer la plateforme.'
              }
            </p>
          </div>
          <div className="flex justify-center">
            <Link 
              to="/" 
              className="px-8 py-3 rounded-xl font-bold text-sm bg-primary text-white hover:bg-primary-dark transition-all shadow-lg shadow-orange-100"
            >
              {language === 'English' ? 'Go to Home' : 'Retour à l\'accueil'}
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  // Count helper functions
  const pendingPostsCount = promotions.filter(p => p.status === 'pending').length;
  const approvedPostsCount = promotions.filter(p => p.status === 'active').length;
  const suspendedSellersCount = partners.filter(pt => pt.status === 'suspended').length;
  const pendingSellersCount = partners.filter(pt => pt.status === 'pending').length;

  // Filter lists based on states
  const filteredSellers = partners.filter(pt => {
    return pt.name.toLowerCase().includes(sellersSearchQuery.toLowerCase()) ||
           pt.email.toLowerCase().includes(sellersSearchQuery.toLowerCase()) ||
           pt.category.toLowerCase().includes(sellersSearchQuery.toLowerCase());
  });

  const pendingSellers = React.useMemo(() => {
    return filteredSellers.filter(pt => pt.status === 'pending');
  }, [filteredSellers]);

  const activeSellers = React.useMemo(() => {
    return filteredSellers.filter(pt => pt.status !== 'pending');
  }, [filteredSellers]);

  const filteredUsers = React.useMemo(() => {
    return (users || []).filter(u => {
      const q = usersSearchQuery.toLowerCase();
      return (u.name || '').toLowerCase().includes(q) ||
             (u.email || '').toLowerCase().includes(q) ||
             (u.role || '').toLowerCase().includes(q) ||
             (u.location || '').toLowerCase().includes(q);
    });
  }, [users, usersSearchQuery]);

  const totalUsersCount = (users || []).length;

  const filteredPosts = promotions.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(postsSearchQuery.toLowerCase()) ||
                          p.partnerName.toLowerCase().includes(postsSearchQuery.toLowerCase());
    
    if (postsFilter === 'all') return matchesSearch;
    return p.status === postsFilter && matchesSearch;
  });

  return (
    <div className="bg-[#f8f9fa] min-h-screen" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Top Hero Admin Bar */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white py-10 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="bg-red-500/10 text-red-400 font-extrabold text-[10px] tracking-wider uppercase px-2 py-0.5 rounded border border-red-500/20 flex items-center gap-1">
                <Shield className="w-3 h-3" /> System Security
              </span>
            </div>
            <h1 className="text-3xl font-black tracking-tight">
              {language === 'English' ? 'Central Admin Operations' : 'Centre d\'Administration HAWTA'}
            </h1>
            <p className="text-slate-300 text-xs">
              {language === 'English' 
                ? 'Review wholesale supplier credentials, accept public postings, and curate top-tier bargains' 
                : 'Modération des grossistes certifiés, validation des publications de gros, et statistiques'
              }
            </p>
          </div>

          <div className="flex gap-4">
            <Link 
              to="/partner" 
              className="px-4 py-2 bg-white/10 hover:bg-white/15 transition-all text-white text-xs font-bold rounded-xl border border-white/10 flex items-center gap-1.5"
            >
              Seller Hub
            </Link>
            <button 
              onClick={() => {
                setUserRole('client');
                addNotification(language === 'English' ? 'Switched back to Client' : 'Rôle modifié à Client', 'info');
              }}
              className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 transition-all text-red-200 text-xs font-bold rounded-xl border border-red-500/20 flex items-center gap-1.5"
            >
              Downgrade Admin
            </button>
          </div>
        </div>
      </div>

      {/* Main Stats Panel */}
      <div className="max-w-7xl mx-auto px-4 -mt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          
          <div className="bg-white p-6 rounded-2xl alibaba-shadow border border-gray-100 flex items-center gap-4">
            <div className="p-3 bg-amber-50 rounded-xl text-amber-500">
              <Clock className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">{language === 'English' ? 'Awaiting Approval' : 'En attente d\'approbation'}</p>
              <h3 className="text-2xl font-black text-amber-500">{pendingPostsCount}</h3>
              <p className="text-[10px] text-gray-500">{language === 'English' ? 'Requires review' : 'Publications à valider'}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl alibaba-shadow border border-gray-100 flex items-center gap-4">
            <div className="p-3 bg-green-50 rounded-xl text-green-500">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">{language === 'English' ? 'Published Deals' : 'Offres Actives'}</p>
              <h3 className="text-2xl font-black text-green-600">{approvedPostsCount}</h3>
              <p className="text-[10px] text-gray-500">{language === 'English' ? 'Live on marketplace' : 'Visibles par les clients'}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl alibaba-shadow border border-gray-100 flex items-center gap-4">
            <div className="p-3 bg-indigo-50 rounded-xl text-indigo-500">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">{language === 'English' ? 'Wholesalers' : 'Grossistes Inscrits'}</p>
              <h3 className="text-2xl font-black text-indigo-600">{partners.length}</h3>
              <p className="text-[10px] text-gray-500">{language === 'English' ? 'Active partners' : 'Partenaires répertoriés'}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl alibaba-shadow border border-gray-100 flex items-center gap-4">
            <div className="p-3 bg-red-50 rounded-xl text-red-500">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">{language === 'English' ? 'Suspended Sellers' : 'Vendeurs Suspendus'}</p>
              <h3 className="text-2xl font-black text-red-600">{suspendedSellersCount}</h3>
              <p className="text-[10px] text-gray-500">{language === 'English' ? 'Account restriction active' : 'Comptes bloqués'}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl alibaba-shadow border border-gray-100 flex items-center gap-4">
            <div className="p-3 bg-sky-50 rounded-xl text-sky-500">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">{language === 'English' ? 'Total Platform Users' : "Membres Inscrits"}</p>
              <h3 className="text-2xl font-black text-sky-600">{totalUsersCount}</h3>
              <p className="text-[10px] text-gray-500">{language === 'English' ? 'All account roles' : 'Tous les types de rôles'}</p>
            </div>
          </div>

        </div>
      </div>

      {/* Main Admin Dashboard Body */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Navigation Tabs and Quick Search bar inside same wrapper */}
        <div className="bg-white p-4 rounded-3xl border border-gray-200 alibaba-shadow flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={() => setActiveTab('posts')}
              className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'posts' 
                  ? 'bg-slate-900 text-white shadow-md' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>{language === 'English' ? 'Pending Posts Management' : 'Gestion des Offres'}</span>
              {pendingPostsCount > 0 && (
                <span className="bg-amber-500 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                  {pendingPostsCount}
                </span>
              )}
            </button>
            <button 
              onClick={() => setActiveTab('sellers')}
              className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'sellers' 
                  ? 'bg-slate-900 text-white shadow-md' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>{language === 'English' ? 'Moderate Sellers' : 'Modérer les Grossistes'}</span>
              {pendingSellersCount > 0 && (
                <span className="bg-amber-500 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                  {pendingSellersCount}
                </span>
              )}
            </button>
            <button 
              onClick={() => setActiveTab('users')}
              className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'users' 
                  ? 'bg-slate-900 text-white shadow-md' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>{language === 'English' ? 'Manage Users' : 'Gérer les Utilisateurs'}</span>
            </button>
          </div>

          <div className="relative">
            {activeTab === 'posts' ? (
              <>
                <input 
                  type="text"
                  placeholder={language === 'English' ? 'Search deals...' : 'Rechercher des offres...'}
                  value={postsSearchQuery}
                  onChange={(e) => setPostsSearchQuery(e.target.value)}
                  className="pl-8 pr-4 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-slate-900 focus:bg-white transition-all w-full sm:w-60 font-medium"
                />
                <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              </>
            ) : activeTab === 'sellers' ? (
              <>
                <input 
                  type="text"
                  placeholder={language === 'English' ? 'Search sellers...' : 'Rechercher un vendeur...'}
                  value={sellersSearchQuery}
                  onChange={(e) => setSellersSearchQuery(e.target.value)}
                  className="pl-8 pr-4 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-slate-900 focus:bg-white transition-all w-full sm:w-60 font-medium"
                />
                <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              </>
            ) : (
              <>
                <input 
                  type="text"
                  placeholder={language === 'English' ? 'Search users...' : 'Rechercher un utilisateur...'}
                  value={usersSearchQuery}
                  onChange={(e) => setUsersSearchQuery(e.target.value)}
                  className="pl-8 pr-4 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-slate-900 focus:bg-white transition-all w-full sm:w-60 font-medium"
                />
                <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              </>
            )}
          </div>
        </div>

        {/* Tab Views content */}
        <div>
          {activeTab === 'posts' && (
            <div className="space-y-6">
              
              {/* Inner Posts Filter Selector Sub-tabs */}
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wide mr-2 flex items-center gap-1">
                  <SlidersHorizontal className="w-3 h-3" /> State View:
                </span>
                {(['pending', 'active', 'paused', 'all'] as const).map((filterOpt) => (
                  <button
                    key={filterOpt}
                    onClick={() => setPostsFilter(filterOpt)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all border ${
                      postsFilter === filterOpt 
                        ? 'bg-primary text-white border-primary shadow-sm' 
                        : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {filterOpt === 'pending' && `⚠️ ${language === 'English' ? 'Awaiting Approval' : 'En attente'}`}
                    {filterOpt === 'active' && `✅ ${language === 'English' ? 'Live (Approved)' : 'Approuvé'}`}
                    {filterOpt === 'paused' && `⏸️ ${language === 'English' ? 'Rejected/Paused' : 'Refusé'}`}
                    {filterOpt === 'all' && `🌐 ${language === 'English' ? 'All Posts' : 'Toutes les offres'}`}
                  </button>
                ))}
              </div>

              {/* Promotions / Posts List */}
              <div className="bg-white rounded-3xl border border-gray-200 alibaba-shadow overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left font-sans border-collapse">
                    <thead>
                      <tr className="bg-gray-50 text-[11px] font-black uppercase text-gray-400 border-b border-gray-100">
                        <th className="py-4 px-6">{language === 'English' ? 'Item Details' : 'Détails du Produit'}</th>
                        <th className="py-4 px-6">{language === 'English' ? 'Supplier Name' : 'Fournisseur / Grossiste'}</th>
                        <th className="py-4 px-6">{language === 'English' ? 'Category' : 'Catégorie'}</th>
                        <th className="py-4 px-6">{language === 'English' ? 'Prices' : 'Tarifs'}</th>
                        <th className="py-4 px-6 text-center">{language === 'English' ? 'Status' : 'Statut'}</th>
                        <th className="py-4 px-6 text-right">{language === 'English' ? 'Actions' : 'Actions de modération'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-xs font-medium text-gray-700">
                      {filteredPosts.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="text-center py-12 text-gray-400 font-bold">
                            <AlertCircle className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                            {language === 'English' ? 'No promotions match this filter.' : 'Aucune annonce ne correspond à ce filtre.'}
                          </td>
                        </tr>
                      ) : (
                        filteredPosts.map((promo) => (
                          <motion.tr 
                            layoutId={`row-${promo.id}`}
                            key={promo.id} 
                            className="hover:bg-gray-50/50 transition-colors"
                          >
                            <td className="py-4 px-6 flex items-center gap-3">
                              <img 
                                src={promo.imageUrl} 
                                alt={promo.title} 
                                className="w-10 h-10 rounded-lg object-cover bg-gray-50 border border-gray-200 flex-shrink-0"
                                referrerPolicy="no-referrer"
                              />
                              <div className="max-w-[220px]">
                                <h4 className="font-bold text-gray-800 line-clamp-1">{promo.title}</h4>
                                <p className="text-[10px] text-gray-400 line-clamp-2 mt-0.5">{promo.description}</p>
                              </div>
                            </td>

                            <td className="py-4 px-6">
                              <span className="font-bold text-gray-800 flex items-center gap-1.5">
                                {promo.partnerName}
                                {promo.isVerifiedPartner && (
                                  <span className="text-[10px] bg-sky-50 text-sky-600 font-bold px-1.5 py-0.2 rounded-md border border-sky-100">Verified</span>
                                )}
                              </span>
                            </td>

                            <td className="py-4 px-6">
                              <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-bold text-[10px]">
                                {getTranslatedCategory(promo.category as any, language)}
                              </span>
                            </td>

                            <td className="py-4 px-6">
                              <div className="space-y-0.5">
                                <span className="font-black text-red-600 text-sm block">{promo.discountedPrice.toLocaleString()} {currency}</span>
                                <span className="text-gray-400 text-[10px] line-through block">{promo.originalPrice.toLocaleString()} {currency}</span>
                              </div>
                            </td>

                            <td className="py-4 px-6 text-center">
                              <span className={`px-2 py-0.5 rounded text-[10px] uppercase tracking-wider font-extrabold ${
                                promo.status === 'active' 
                                  ? 'bg-green-50 text-green-600 border border-green-200' 
                                  : promo.status === 'pending'
                                  ? 'bg-amber-50 text-amber-600 border border-amber-200'
                                  : 'bg-gray-100 text-gray-500 border border-gray-200'
                              }`}>
                                {promo.status}
                              </span>
                            </td>

                            <td className="py-4 px-6 text-right">
                              <div className="flex gap-2 justify-end">
                                
                                {promo.status === 'pending' && (
                                  <>
                                    <button
                                      onClick={() => approvePromotion(promo.id)}
                                      className="p-1 px-3 rounded-xl bg-green-500 hover:bg-green-600 text-white font-extrabold text-[11px] hover:-translate-y-0.5 transition-all flex items-center gap-1 shadow-sm"
                                      title="Approve post"
                                    >
                                      <Check className="w-3.5 h-3.5" /> Accept
                                    </button>
                                    <button
                                      onClick={() => rejectPromotion(promo.id)}
                                      className="p-1 px-3 rounded-xl bg-orange-50/50 text-orange-600 hover:bg-orange-600 hover:text-white border border-orange-200 font-bold text-[11px]"
                                      title="Reject/Pause post"
                                    >
                                      <X className="w-3.5 h-3.5" /> Reject
                                    </button>
                                  </>
                                )}

                                {promo.status === 'active' && (
                                  <button
                                    onClick={() => rejectPromotion(promo.id)}
                                    className="p-1 px-2 text-[10px] font-bold text-gray-500 hover:bg-gray-100 rounded-lg"
                                    title="Pause active offer"
                                  >
                                    Pause
                                  </button>
                                )}

                                {promo.status === 'paused' && (
                                  <button
                                    onClick={() => approvePromotion(promo.id)}
                                    className="p-1 px-2 text-[10px] font-bold text-green-600 hover:bg-green-50 rounded-lg"
                                    title="Reactivate offer"
                                  >
                                    Activate
                                  </button>
                                )}

                                <button
                                  onClick={() => deletePromotion(promo.id)}
                                  className="p-1.5 text-gray-400 hover:text-red-500 rounded-xl hover:bg-red-50 transition-colors"
                                  title="Delete from system"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </motion.tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'sellers' && (
            <div className="space-y-8">
              
              {/* Wholesaler Applications Pending Review */}
              <div>
                <h2 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-500 animate-pulse" />
                  <span>{language === 'English' ? 'Pending Seller Applications' : 'Inscriptions Grossistes En Attente'} ({pendingSellers.length})</span>
                </h2>
                {pendingSellers.length === 0 ? (
                  <div className="bg-white p-6 rounded-2xl border border-dashed border-gray-200 text-center text-xs font-bold text-gray-400">
                    {language === 'English' ? 'No pending seller registration applications.' : 'Aucune demande d\'inscription en cours.'}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {pendingSellers.map((seller) => (
                      <motion.div
                        layout
                        key={seller.id}
                        className="bg-white rounded-3xl p-6 border border-amber-200 alibaba-shadow flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
                      >
                        <div className="flex gap-4 items-start md:items-center">
                          <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-500 flex-shrink-0 font-extrabold text-sm border border-amber-100">
                            {seller.name.slice(0, 2).toUpperCase()}
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-bold text-gray-800 text-sm">{seller.name}</h3>
                              <span className="bg-amber-100 text-amber-800 font-extrabold text-[8px] uppercase tracking-wider px-2 py-0.5 rounded">Awaiting Approval</span>
                            </div>
                            <p className="text-gray-500 text-xs line-clamp-1 max-w-sm md:max-w-md">{seller.description}</p>
                            <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-gray-400 font-semibold pt-1">
                              <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> {seller.email}</span>
                              <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> {seller.phone}</span>
                              <span className="flex items-center gap-1 bg-gray-100 px-1 rounded uppercase text-[8px] font-bold text-gray-500">{seller.category}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2 w-full md:w-auto">
                          <button
                            onClick={() => {
                              updatePartnerStatus(seller.id, 'active');
                            }}
                            className="flex-grow md:flex-initial px-5 py-2 text-xs bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black transition-all flex items-center justify-center gap-1.5 shadow-md shadow-emerald-50"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>{language === 'English' ? 'Approve & Accept' : 'Approuver'}</span>
                          </button>
                          <button
                            onClick={() => {
                              updatePartnerStatus(seller.id, 'suspended');
                            }}
                            className="flex-grow md:flex-initial px-5 py-2 text-xs bg-red-50 hover:bg-red-100 text-red-600 rounded-xl font-black transition-all flex items-center justify-center gap-1.5"
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>{language === 'English' ? 'Decline' : 'Refuser'}</span>
                          </button>
                          <button
                            onClick={() => {
                              deletePartner(seller.id);
                            }}
                            className="px-3 py-2 text-xs bg-red-50 hover:bg-red-100 text-red-600 rounded-xl font-black transition-all flex items-center justify-center border border-red-200"
                            title={language === 'English' ? 'Delete submission entirely' : 'Supprimer la demande définitivement'}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Verified & Approved Wholesalers */}
              <div>
                <h2 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                  <Users className="w-4 h-4 text-slate-500" />
                  <span>{language === 'English' ? 'Approved & Certified Sellers' : 'Grossistes Certifiés'} ({activeSellers.length})</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {activeSellers.length === 0 ? (
                    <div className="col-span-full text-center bg-white p-12 rounded-3xl border border-gray-200 font-bold text-gray-400">
                      <Users className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                      {language === 'English' ? 'No registered sellers found.' : 'Aucun vendeur enregistré.'}
                    </div>
                  ) : (
                    activeSellers.map((seller) => (
                    <motion.div 
                      layout
                      key={seller.id}
                      className={`bg-white rounded-3xl p-6 border alibaba-shadow flex flex-col justify-between gap-6 transition-all relative ${
                        seller.status === 'suspended' ? 'border-red-200 opacity-80' : 'border-gray-200'
                      }`}
                    >
                      {/* Suspended overlay info flag */}
                      {seller.status === 'suspended' && (
                        <div className="absolute top-4 right-4 bg-red-100 text-red-600 border border-red-200 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded">
                          Suspended
                        </div>
                      )}

                      <div className="space-y-4">
                        {/* Partner Identity Header */}
                        <div className="flex gap-4 items-center">
                          <img 
                            src={seller.logo} 
                            alt={seller.name} 
                            className="w-14 h-14 rounded-2xl object-cover bg-gray-50 border border-gray-100 shadow-sm flex-shrink-0"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <div className="flex items-center gap-1.5">
                              <h3 className="font-bold text-base text-gray-800">{seller.name}</h3>
                              {seller.verified ? (
                                <span className="bg-sky-600 border border-sky-200 text-white font-black text-[9px] uppercase px-1.5 py-0.5 rounded flex items-center gap-0.5">
                                  <UserCheck className="w-2.5 h-2.5" /> Certified
                                </span>
                              ) : (
                                <span className="bg-gray-100 text-gray-400 text-[8px] font-semibold tracking-wider uppercase px-1 rounded">Unverified</span>
                              )}
                            </div>
                            <span className="text-[10px] text-primary font-bold bg-orange-50 px-2 py-0.5 rounded border border-orange-100 inline-block mt-0.5">
                              {getTranslatedCategory(seller.category as any, language)}
                            </span>
                          </div>
                        </div>

                        {/* Supplier stats and contact card */}
                        <p className="text-gray-500 text-xs leading-relaxed font-medium">
                          {seller.description}
                        </p>

                        <div className="grid grid-cols-2 gap-2 text-[10px] font-bold text-gray-500 bg-gray-50 p-3 rounded-2xl border border-gray-100">
                          <div className="flex items-center gap-1.5">
                            <Mail className="w-3.5 h-3.5 text-gray-400" />
                            <span className="truncate">{seller.email}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Phone className="w-3.5 h-3.5 text-gray-400" />
                            <span>{seller.phone}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-gray-400" />
                            <span>Rabat / Casablanca</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-gray-400" />
                            <span>Joined {seller.joinDate}</span>
                          </div>
                        </div>
                      </div>

                      {/* Controls at footer */}
                      <div className="flex gap-2 pt-4 border-t border-gray-100">
                        {/* Toggle verification */}
                        <button
                          onClick={() => togglePartnerVerification(seller.id)}
                          className={`flex-grow py-2 rounded-xl text-[11px] font-black transition-all flex items-center justify-center gap-1 border-2 ${
                            seller.verified 
                              ? 'bg-transparent text-gray-500 border-gray-200 hover:bg-gray-50'
                              : 'bg-sky-50 text-sky-600 border-sky-100 hover:bg-sky-100 hover:border-sky-200'
                          }`}
                        >
                          <UserCheck className="w-3.5 h-3.5" />
                          {seller.verified ? 'Revoke Badge' : 'Grant Verified badge'}
                        </button>

                        {/* Toggle Suspend */}
                        <button
                          onClick={() => updatePartnerStatus(seller.id, seller.status === 'active' ? 'suspended' : 'active')}
                          className={`flex-grow py-2 rounded-xl text-[11px] font-black transition-all border ${
                            seller.status === 'suspended'
                              ? 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-500'
                              : 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100'
                          }`}
                        >
                          {seller.status === 'suspended' ? 'Activate Wholesaler' : 'Suspend Wholesaler'}
                        </button>

                        {/* Delete Partner */}
                        <button
                          onClick={() => deletePartner(seller.id)}
                          className="px-3.5 py-2 rounded-xl text-[11px] font-black bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 hover:border-red-300 transition-all flex items-center justify-center"
                          title={language === 'English' ? 'Delete seller account' : 'Gérer et supprimer le grossiste'}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                    </motion.div>
                  ))
                )}
              </div>

            </div>
          </div>
          )}

          {activeTab === 'users' && (
            <div className="space-y-6">
              {/* Users Header section */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-200 alibaba-shadow">
                <div>
                  <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <Users className="w-5 h-5 text-gray-500" />
                    {language === 'English' ? 'Platform User Accounts' : 'Utilisateurs de la Plateforme'}
                  </h2>
                  <p className="text-xs text-gray-400 font-medium mt-0.5">
                    {language === 'English' 
                      ? 'Review registered buyers, wholesalers/sellers, and assign roles to access administration or shop privileges.'
                      : "Gérez les rôles, modifiez les habilitations et supprimez les comptes clients ou grossistes."}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(true)}
                  className="px-5 py-2.5 bg-slate-900 border border-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 hover:border-slate-800 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <span>{language === 'English' ? '+ Create New Account' : '+ Créer un Compte'}</span>
                </button>
              </div>

              {/* Users Table / List */}
              <div className="bg-white rounded-3xl border border-gray-200 alibaba-shadow overflow-hidden">
                <div className="overflow-x-auto font-sans">
                  <table className="w-full text-left font-sans border-collapse">
                    <thead>
                      <tr className="bg-gray-50 text-[11px] font-black uppercase text-gray-400 border-b border-gray-100">
                        <th className="py-4 px-6">{language === 'English' ? 'User Info' : 'Identité'}</th>
                        <th className="py-4 px-6">{language === 'English' ? 'Email Address' : 'E-mail'}</th>
                        <th className="py-4 px-6">{language === 'English' ? 'Location' : 'Ville / Région'}</th>
                        <th className="py-4 px-6">{language === 'English' ? 'Current Privilege' : 'Permissions / Rôle'}</th>
                        <th className="py-4 px-6 text-right">{language === 'English' ? 'Manage Account' : 'Actions'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredUsers.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="py-12 text-center text-gray-400 font-bold font-sans">
                            <Users className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                            {language === 'English' ? 'No registered accounts found matching your filters.' : 'Aucun utilisateur trouvé.'}
                          </td>
                        </tr>
                      ) : (
                        filteredUsers.map((user) => (
                          <tr key={user.email} className="hover:bg-gray-50/50 transition-colors text-xs text-gray-600 font-sans">
                            <td className="py-4 px-6 font-bold text-gray-900">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-800 flex items-center justify-center font-black uppercase text-sm border border-slate-200 flex-shrink-0">
                                  {user.name ? user.name.slice(0, 2) : 'U'}
                                </div>
                                <div className="font-sans">
                                  <div className="font-bold text-gray-900 text-sm">{user.name || 'Anonymous User'}</div>
                                  <div className="text-[10px] text-gray-400 font-medium">{user.phone || '+212 --'}</div>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-6 font-mono font-medium text-gray-500">
                              {user.email}
                            </td>
                            <td className="py-4 px-6 font-semibold">
                              <span className="flex items-center gap-1.5 bg-gray-50 border border-gray-100 text-gray-500 px-2.5 py-1 rounded-xl w-fit">
                                <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                                {user.location || 'Morocco'}
                              </span>
                            </td>
                            <td className="py-4 px-6">
                              <div className="flex items-center gap-2">
                                <select
                                  value={user.role}
                                  onChange={(e) => updateUserRole(user.email, e.target.value as any)}
                                  disabled={user.email.toLowerCase() === 'admin@hawta.com'}
                                  className={`px-3 py-1.5 rounded-xl border font-bold text-[10px] outline-none transition-all uppercase ${
                                    user.email.toLowerCase() === 'admin@hawta.com'
                                      ? 'bg-red-50 text-red-700 border-red-200 opacity-60 cursor-not-allowed'
                                      : 'cursor-pointer'
                                  } ${
                                    user.role === 'admin'
                                      ? 'bg-red-50 text-red-750 border-red-200 focus:ring-red-100'
                                      : user.role === 'user'
                                      ? 'bg-amber-50 text-amber-750 border-amber-200 focus:ring-amber-100'
                                      : 'bg-sky-50 text-sky-750 border-sky-00 focus:ring-sky-100'
                                  }`}
                                >
                                  <option value="client">{language === 'English' ? 'Buyer (Client)' : 'Acheteur (Client)'}</option>
                                  <option value="user">{language === 'English' ? 'Wholesaler (User)' : 'Grossiste (Vendeur)'}</option>
                                  <option value="admin">{language === 'English' ? 'Administrator (Admin)' : 'Administrateur (Admin)'}</option>
                                </select>
                              </div>
                            </td>
                            <td className="py-4 px-6 text-right">
                              <button
                                onClick={() => {
                                  if (confirm(language === 'English' 
                                    ? `Are you sure you want to permanently delete user account: ${user.email}?` 
                                    : `Voulez-vous supprimer définitivement l'utilisateur : ${user.email} ?`)) {
                                    deleteUser(user.email);
                                  }
                                }}
                                disabled={user.email === 'admin@hawta.com'}
                                className={`p-2 rounded-xl text-red-650 bg-red-50 hover:bg-red-100 transition-all inline-flex items-center justify-center border border-red-200 ${
                                  user.email === 'admin@hawta.com' ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'
                                }`}
                                title={language === 'English' ? 'Delete User' : 'Supprimer'}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Create User Modal */}
      <AnimatePresence>
        {showAddUserModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddUserModal(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            {/* Content card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-3xl p-8 border border-gray-100 w-full max-w-md alibaba-shadow z-10 space-y-6 relative text-left"
              dir={isRTL ? 'rtl' : 'ltr'}
            >
              <button 
                onClick={() => setShowAddUserModal(false)}
                className="absolute top-6 right-6 p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-all font-sans cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="space-y-1 font-sans">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-indigo-500" />
                  {language === 'English' ? 'Register New User' : 'Inscrire un Utilisateur'}
                </h3>
                <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">
                  {language === 'English' ? 'Create credential parameters' : 'Créer les privilèges d\'accès'}
                </p>
              </div>

              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!newUserName || !newUserEmail) {
                    addNotification(language === 'English' ? 'Both Name and Email are required!' : 'Le nom et l\'e-mail sont requis !', 'error');
                    return;
                  }
                  registerUser({
                    name: newUserName,
                    email: newUserEmail,
                    role: newUserRole,
                    phone: newUserPhone,
                    location: newUserLocation,
                    password: 'password'
                  });
                  addNotification(
                    language === 'English' 
                      ? 'Account created successfully! Default login password is: password' 
                      : 'Compte créé avec succès ! Le mot de passe par défaut est : password', 
                    'success'
                  );
                  setShowAddUserModal(false);
                  setNewUserName('');
                  setNewUserEmail('');
                  setNewUserPhone('');
                }}
                className="space-y-4 text-left font-sans"
              >
                <div>
                  <label className="block text-[10px] font-black uppercase text-gray-500 tracking-wider mb-1.5">{language === 'English' ? 'Full Name' : 'Nom Complet'}</label>
                  <input
                    type="text"
                    required
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                    placeholder={language === 'English' ? "e.g., Anas Mansouri" : "Ex: Anas Mansouri"}
                    className="w-full px-4 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-slate-800 focus:bg-white transition-all font-semibold text-gray-700"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase text-gray-500 tracking-wider mb-1.5">{language === 'English' ? 'Email Address' : 'Adresse E-mail'}</label>
                  <input
                    type="email"
                    required
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                    placeholder="example@hawta.com"
                    className="w-full px-4 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-slate-800 focus:bg-white transition-all font-semibold text-gray-700"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-black uppercase text-gray-500 tracking-wider mb-1.5">{language === 'English' ? 'Phone Number' : 'N° Téléphone'}</label>
                    <input
                      type="text"
                      value={newUserPhone}
                      onChange={(e) => setNewUserPhone(e.target.value)}
                      placeholder="+212 600-000000"
                      className="w-full px-4 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-slate-800 focus:bg-white transition-all font-semibold text-gray-700"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase text-gray-500 tracking-wider mb-1.5">{language === 'English' ? 'Location' : 'Région / Ville'}</label>
                    <input
                      type="text"
                      value={newUserLocation}
                      onChange={(e) => setNewUserLocation(e.target.value)}
                      placeholder="Casablanca, Morocco"
                      className="w-full px-4 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-slate-800 focus:bg-white transition-all font-semibold text-gray-700"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase text-gray-500 tracking-wider mb-1.5">{language === 'English' ? 'Assign Initial Role' : 'Assigner le Rôle Initial'}</label>
                  <select
                    value={newUserRole}
                    onChange={(e) => setNewUserRole(e.target.value as any)}
                    className="w-full px-3 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-slate-800 focus:bg-white transition-all font-bold uppercase cursor-pointer"
                  >
                    <option value="client">{language === 'English' ? 'Buyer (Client)' : 'Acheteur (Client)'}</option>
                    <option value="user">{language === 'English' ? 'Wholesaler (User)' : 'Grossiste (Vendeur)'}</option>
                    <option value="admin">{language === 'English' ? 'Administrator (Admin)' : 'Administrateur (Admin)'}</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full mt-2 py-3 bg-slate-900 border border-slate-900 hover:bg-slate-800 hover:border-slate-800 text-white font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 alibaba-shadow shadow-slate-100 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>{language === 'English' ? 'Confirm and Add' : 'Confirmer et Ajouter'}</span>
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
