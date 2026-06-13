
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  BarChart3, 
  Plus, 
  Package, 
  User, 
  Settings, 
  TrendingUp, 
  MousePointer2, 
  Eye, 
  Heart,
  CheckCircle2,
  Camera,
  Image as ImageIcon,
  Shield,
  Clock,
  Tags,
  Trash2
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { useTranslation, getTranslatedCategory } from '../translations';

export const PartnerDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState('Statistics');
  const [isShowingCreateModal, setIsShowingCreateModal] = React.useState(false);
  const [previewImage, setPreviewImage] = React.useState('');
  
  // Create Offer form state bindings
  const [title, setTitle] = React.useState('');
  const [originalPrice, setOriginalPrice] = React.useState('');
  const [discountedPrice, setDiscountedPrice] = React.useState('');
  const [category, setCategory] = React.useState('High-Tech');
  const [description, setDescription] = React.useState('');
  const [newCustomCategory, setNewCustomCategory] = React.useState('');
  const [isCreatingInlineCategory, setIsCreatingInlineCategory] = React.useState(false);
  const [inlineCategoryName, setInlineCategoryName] = React.useState('');

  // Wholesaler registration form state bindings
  const [showApplyForm, setShowApplyForm] = React.useState(false);
  const [applyCompanyName, setApplyCompanyName] = React.useState('');
  const [applyCategory, setApplyCategory] = React.useState('High-Tech');
  const [applyDesc, setApplyDesc] = React.useState('');
  const [applyPhone, setApplyPhone] = React.useState('+212 600-123456');

  const { 
    promotions, 
    addNotification, 
    language, 
    userRole, 
    setUserRole, 
    currentUser, 
    addPromotion, 
    deletePromotion, 
    partners, 
    applyAsSeller, 
    updatePartnerStatus,
    categories,
    addCategory,
    deleteCategory
  } = useAppContext();

  React.useEffect(() => {
    if (currentUser?.name) {
      setApplyCompanyName(currentUser.name);
    }
  }, [currentUser]);

  const myPartnerApp = React.useMemo(() => {
    if (!currentUser) return null;
    return partners.find(p => p.email === currentUser.email || p.name === currentUser.name);
  }, [partners, currentUser]);

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applyCompanyName || !applyDesc || !applyPhone) {
      addNotification(language === 'English' ? 'Please fill out all fields!' : 'Veuillez remplir tous les champs !', 'error');
      return;
    }
    applyAsSeller({
      name: applyCompanyName,
      category: applyCategory,
      description: applyDesc,
      email: currentUser?.email || 'sales@wholesaler.com',
      phone: applyPhone
    });
  };
  const t = useTranslation(language);
  const isRTL = language === 'العربية';
  const currency = language === 'العربية' ? 'د.م.' : 'DH';

  const [searchMyOffersQuery, setSearchMyOffersQuery] = React.useState('');

  const myPromotions = React.useMemo(() => {
    return promotions.filter(promo => {
      // Sellers can only see their own posts
      const isOwner = currentUser && promo.partnerName === currentUser.name;
      const matchesSearch = !searchMyOffersQuery || 
        promo.title.toLowerCase().includes(searchMyOffersQuery.toLowerCase()) ||
        (promo.description && promo.description.toLowerCase().includes(searchMyOffersQuery.toLowerCase()));
      return isOwner && matchesSearch;
    });
  }, [promotions, currentUser, searchMyOffersQuery]);

  // Compute stats dynamically for the seller's own promotions
  const totalViews = React.useMemo(() => myPromotions.reduce((sum, p) => sum + (p.views || 0), 0), [myPromotions]);
  const totalClicks = React.useMemo(() => myPromotions.reduce((sum, p) => sum + (p.clicks || 0), 0), [myPromotions]);
  const totalFavorites = React.useMemo(() => myPromotions.reduce((sum, p) => sum + (p.favoritesCount || 0), 0), [myPromotions]);
  const conversionRate = React.useMemo(() => {
    return totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(1) + '%' : '0.0%';
  }, [totalViews, totalClicks]);

  const handleAction = (msg: string, type: 'info' | 'success' | 'error' = 'info') => {
    addNotification(msg, type);
  };

  const handleCreateOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !originalPrice || !discountedPrice) {
      addNotification(language === 'English' ? 'Please fill all required fields !' : 'Veuillez remplir les champs obligatoires !', 'error');
      return;
    }

    const newPromo = {
      id: `promo-${Date.now()}`,
      title,
      description: description || (language === 'English' ? 'Exclusive Wholesale Deal' : 'Offre exclusive de gros'),
      partnerId: 'partner-99',
      partnerName: currentUser?.name || 'My Wholesale Shop',
      category: category as any,
      imageUrl: previewImage || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800',
      originalPrice: Number(originalPrice),
      discountedPrice: Number(discountedPrice),
      discountPercentage: Math.round(((Number(originalPrice) - Number(discountedPrice)) / Number(originalPrice)) * 100) || 12,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'pending' as const,
      tags: ['New', 'Promo'],
      views: 0,
      clicks: 0,
      favoritesCount: 0,
      isVerifiedPartner: false
    };

    addPromotion(newPromo);
    addNotification(
      language === 'English'
        ? 'Your deal was submitted! It will appear on the marketplace once accepted by the administrator.'
        : 'Votre offre a été soumise pour validation ! Elle s\'affichera sur la place de marché dès approbation par l\'administrateur.',
      'info'
    );
    setIsShowingCreateModal(false);
    
    // Clear state
    setTitle('');
    setOriginalPrice('');
    setDiscountedPrice('');
    setDescription('');
    setPreviewImage('');
    setIsCreatingInlineCategory(false);
    setInlineCategoryName('');
  };

  if (userRole === 'client') {
    if (myPartnerApp && myPartnerApp.status === 'pending') {
      return (
        <div className="min-h-[calc(100vh-140px)] bg-gray-50 flex items-center justify-center p-6" dir={isRTL ? 'rtl' : 'ltr'}>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white max-w-xl w-full p-8 rounded-3xl alibaba-shadow border border-gray-100 text-center space-y-6"
          >
            <div className="w-20 h-20 rounded-full bg-amber-50 flex items-center justify-center mx-auto text-amber-500">
              <Clock className="w-10 h-10 animate-pulse" />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-black text-gray-800 tracking-tight">
                {language === 'English' ? 'Seller Application Under Review' : language === 'Français' ? 'Inscription Vendeur en Cours de Revue' : 'طلب التسجيل كبائع قيد الدراسة'}
              </h1>
              <p className="text-gray-500 text-sm leading-relaxed">
                {language === 'English' 
                  ? 'Your wholesale application is under review by our administration team. We are verifying your store identity and inventory credentials. This standard moderation review typically takes less than 24 hours.' 
                  : language === 'Français' 
                  ? 'Votre demande d\'inscription en tant que grossiste est en cours de validation par notre équipe d\'administration. Nous vérifions les coordonnées de votre entreprise.' 
                  : 'طلب التسجيل الخاص بك كتاجر جملة/بائع قيد المراجعة والتدقيق من قبل إدارة المنصة.'
                }
              </p>
            </div>

            <div className="p-5 bg-gray-50 rounded-2xl text-left text-xs space-y-2.5 border border-gray-100 font-medium text-gray-600">
              <div className="flex justify-between border-b border-gray-100 pb-1.5 font-bold text-gray-800 text-[13px]">
                <span>📋 Application Details:</span>
                <span className="text-amber-500 text-[11px] uppercase tracking-wider font-extrabold flex items-center gap-1">⏱️ Pending</span>
              </div>
              <div className="flex justify-between">
                <span>Company Name:</span>
                <span className="font-bold text-gray-800">{myPartnerApp.name}</span>
              </div>
              <div className="flex justify-between">
                <span>Category:</span>
                <span className="font-bold text-gray-800 bg-orange-50 text-primary px-1.5 py-0.2 rounded">{myPartnerApp.category}</span>
              </div>
              <div className="flex justify-between">
                <span>Email Address:</span>
                <span className="font-bold text-gray-800">{myPartnerApp.email}</span>
              </div>
              <div className="flex justify-between">
                <span>Phone:</span>
                <span className="font-bold text-gray-800">{myPartnerApp.phone}</span>
              </div>
              <div className="pt-2">
                <span className="block text-[10px] text-gray-400 uppercase font-bold mb-1">Store Description:</span>
                <p className="italic text-gray-500 line-clamp-2 bg-white p-2 rounded-lg border border-gray-100">{myPartnerApp.description}</p>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <Link 
                to="/deals" 
                className="w-full sm:w-auto px-8 py-3 rounded-xl font-bold text-sm bg-primary text-white hover:bg-primary-dark transition-all text-center shadow-lg shadow-orange-100"
              >
                {language === 'English' ? 'Browse Marketplace' : 'Visiter le catalogue'}
              </Link>
            </div>
          </motion.div>
        </div>
      );
    }

    if (myPartnerApp && myPartnerApp.status === 'suspended') {
      return (
        <div className="min-h-[calc(100vh-140px)] bg-gray-50 flex items-center justify-center p-6" dir={isRTL ? 'rtl' : 'ltr'}>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white max-w-xl w-full p-8 rounded-3xl alibaba-shadow border border-red-100 text-center space-y-6"
          >
            <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mx-auto text-red-500">
              <Shield className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-black text-red-600 tracking-tight">
                {language === 'English' ? 'Wholesaler Account Suspended' : 'Compte Grossiste Suspendu'}
              </h1>
              <p className="text-gray-500 text-sm leading-relaxed">
                We protect our marketplace community strictly. Your wholesale privileges have been temporarily suspended due to a potential violation of wholesale listing policy or pending verification steps.
              </p>
            </div>
            <div className="flex gap-4 justify-center">
              <Link 
                to="/" 
                className="px-6 py-3 rounded-xl font-semibold text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all"
              >
                Go Home
              </Link>
            </div>
          </motion.div>
        </div>
      );
    }

    if (showApplyForm) {
      return (
        <div className="min-h-[calc(100vh-140px)] bg-gray-50 flex items-center justify-center p-6 py-12" dir={isRTL ? 'rtl' : 'ltr'}>
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white max-w-lg w-full p-8 rounded-3xl alibaba-shadow border border-gray-200 space-y-6"
          >
            <div className="text-center space-y-2">
              <span className="text-[10px] bg-primary/10 text-primary uppercase font-extrabold px-2.5 py-1 rounded">Seller Registration</span>
              <h1 className="text-2xl font-black tracking-tight text-gray-900 mt-2">
                Wholesaler Store Setup
              </h1>
              <p className="text-gray-500 text-xs">
                Enter your wholesale business details below to apply for certified partner status on HAWTA MAROC.
              </p>
            </div>

            <form onSubmit={handleApplySubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Company / Wholesaler Name</label>
                <input 
                  type="text" 
                  value={applyCompanyName}
                  onChange={(e) => setApplyCompanyName(e.target.value)}
                  placeholder="e.g. Atlas Bulk Electronics"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-primary text-xs font-semibold focus:bg-white transition-all text-gray-800"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Wholesale Category</label>
                <select 
                  value={applyCategory}
                  onChange={(e) => setApplyCategory(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-primary text-xs font-semibold focus:bg-white transition-all text-gray-800 mr-2 ml-2"
                >
                  <option value="High-Tech">High-Tech</option>
                  <option value="Sport">Sport</option>
                  <option value="Restauration">Restauration</option>
                  <option value="Beauté">Beauté</option>
                  <option value="Maison">Maison</option>
                  <option value="Voyage">Voyage</option>
                  <option value="Mode">Mode</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Business Contact Phone</label>
                <input 
                  type="text" 
                  value={applyPhone}
                  onChange={(e) => setApplyPhone(e.target.value)}
                  placeholder="e.g. +212 600-000000"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-primary text-xs font-semibold focus:bg-white transition-all text-gray-800"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Store Profile Description</label>
                <textarea 
                  value={applyDesc}
                  onChange={(e) => setApplyDesc(e.target.value)}
                  placeholder="Describe your wholesale products, supply network, or distribution operations briefly..."
                  rows={3}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-primary text-xs font-semibold focus:bg-white transition-all text-gray-800"
                  required
                />
              </div>

              <div className="bg-orange-50 border border-orange-100/50 p-3 rounded-2xl text-[10px] text-orange-850 font-medium font-sans">
                <span className="font-bold block mb-1">⏱️ Verification Rule:</span>
                Your application will require an administrator review in the Admin Panel prior to active catalog listing.
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  type="button" 
                  onClick={() => setShowApplyForm(false)}
                  className="flex-1 py-3 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold transition-all"
                >
                  Back
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-3 text-xs bg-primary hover:bg-primary-dark text-white rounded-xl font-bold transition-all shadow-lg shadow-orange-100"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      );
    }

    return (
      <div className="min-h-[calc(100vh-140px)] bg-gray-50 flex items-center justify-center p-6" dir={isRTL ? 'rtl' : 'ltr'}>
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white max-w-xl p-8 rounded-2xl alibaba-shadow border border-gray-100 text-center space-y-6"
        >
          <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mx-auto text-red-500">
            <Shield className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-gray-800">
              {language === 'English' ? 'Seller Hub Registration Required' : language === 'Français' ? 'Inscription Grossiste Requise' : 'مطلوب التسجيل كبائع'}
            </h1>
            <p className="text-gray-500 text-sm leading-relaxed font-sans">
              {language === 'English' 
                ? 'Your account is currently registered with a Client (Buyer) role. Only approved wholesale sellers can post promotions, upload bulk inventories, and manage physical assets on HAWTA MAROC.' 
                : language === 'Français' 
                ? 'Votre compte est actuellement enregistré avec le rôle Client. Seuls les grossistes certifiés peuvent publier de nouvelles promotions de gros.' 
                : 'حسابك مسجل حالياً بصلاحية عميل. فقط بائعي الجملة المعتمدين يمكنهم نشر عروض وتخفيضات ومخزونات.'
              }
            </p>
          </div>

          <div className="flex justify-center">
            <button 
              onClick={() => setShowApplyForm(true)}
              className="w-full sm:w-auto px-8 py-3 rounded-xl font-bold text-sm bg-primary text-white hover:bg-primary-dark transition-all shadow-lg shadow-orange-100 font-sans"
            >
              📝 Apply to become Wholesaler
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`bg-[#f0f2f5] min-h-screen ${isRTL ? 'font-sans' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Create Offer Modal */}
      {isShowingCreateModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl scale-in-center">
            <div className="bg-primary p-6 text-white text-center">
              <h3 className="text-xl font-bold">{t.new_promo}</h3>
              <p className="text-orange-100 text-xs">{t.fill_offer_details}</p>
            </div>
            <form onSubmit={handleCreateOffer} className="p-8 space-y-6">
              <div className="space-y-4">
                <label className="text-xs font-bold text-gray-500 uppercase block">{t.product_image}</label>
                <div className="flex gap-4 items-center">
                  <div className="w-24 h-24 rounded-xl bg-gray-100 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center overflow-hidden flex-shrink-0">
                    {previewImage ? (
                      <img src={previewImage} alt="Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <ImageIcon className="w-8 h-8 text-gray-300" />
                    )}
                  </div>
                  <div className="flex-grow space-y-2">
                    <div className="relative">
                      <input 
                        type="text" 
                        placeholder={t.paste_image_url} 
                        value={previewImage}
                        onChange={(e) => setPreviewImage(e.target.value)}
                        className={`w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 outline-none focus:border-primary transition-all text-sm ${isRTL ? 'pr-10' : 'pl-10'}`} 
                      />
                      <Camera className={`absolute ${isRTL ? 'right-3.5' : 'left-3.5'} top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400`} />
                    </div>
                    <p className="text-[10px] text-gray-400 leading-tight">{t.image_url_tip}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">{t.promo_title}</label>
                <input 
                  required 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. iPhone 15 Pro Max Wholesale" 
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 outline-none focus:border-primary transition-all text-sm" 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">{t.orig_price}</label>
                  <input 
                    required 
                    type="number" 
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(e.target.value)}
                    placeholder="999" 
                    className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 outline-none focus:border-primary transition-all text-sm" 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">{t.bargain_price}</label>
                  <input 
                    required 
                    type="number" 
                    value={discountedPrice}
                    onChange={(e) => setDiscountedPrice(e.target.value)}
                    placeholder="799" 
                    className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 outline-none focus:border-primary transition-all text-sm" 
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase block">{language === 'English' ? 'Description' : 'Description'}</label>
                <textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description of wholesale conditions..." 
                  className="w-full px-4 py-2 rounded-lg bg-gray-50 border border-gray-200 outline-none focus:border-primary transition-all text-sm h-16 resize-none"
                />
              </div>
              <div className="space-y-1">
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">{t.categories}</label>
                  {!isCreatingInlineCategory && (
                    <button 
                      type="button"
                      onClick={() => setIsCreatingInlineCategory(true)}
                      className="text-xs text-primary font-bold hover:underline"
                    >
                      + {language === 'English' ? 'Add Personal Category' : language === 'Français' ? 'Ajouter une catégorie perso' : 'إضافة فئة شخصية'}
                    </button>
                  )}
                </div>

                {isCreatingInlineCategory ? (
                  <div className="bg-orange-50/50 border border-orange-100 rounded-lg p-3 space-y-2 mb-3">
                    <div className="text-[11px] font-semibold text-orange-950">
                      {language === 'English' ? 'Create Custom Category' : language === 'Français' ? 'Créer une catégorie perso' : 'إنشاء فئة مخصصة'}
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder={language === 'English' ? 'e.g. Cars, Animals...' : language === 'Français' ? 'ex: Voitures, Animaux...' : 'مثال: سيارات، حيوانات...'}
                        value={inlineCategoryName}
                        onChange={(e) => setInlineCategoryName(e.target.value)}
                        className="flex-grow px-3 py-1.5 rounded-lg bg-white border border-gray-200 outline-none focus:border-primary text-xs"
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (inlineCategoryName.trim()) {
                            const formatted = inlineCategoryName.trim().charAt(0).toUpperCase() + inlineCategoryName.trim().slice(1);
                            addCategory(formatted);
                            setCategory(formatted);
                            setInlineCategoryName('');
                            setIsCreatingInlineCategory(false);
                          }
                        }}
                        className="bg-primary text-white text-xs px-3 py-1.5 rounded-lg font-bold hover:bg-primary-dark transition-colors"
                      >
                        {language === 'English' ? 'Add' : language === 'Français' ? 'Ajouter' : 'إضافة'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setInlineCategoryName('');
                          setIsCreatingInlineCategory(false);
                        }}
                        className="bg-gray-200 text-gray-700 text-xs px-3 py-1.5 rounded-lg hover:bg-gray-300 transition-colors"
                      >
                        {language === 'English' ? 'Cancel' : language === 'Français' ? 'Annuler' : 'إلغاء'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <select 
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 outline-none focus:border-primary transition-all text-sm mb-1"
                  >
                    {categories.filter(c => c !== 'All').map(c => (
                      <option key={c} value={c}>{getTranslatedCategory(c, language)}</option>
                    ))}
                  </select>
                )}
              </div>
              <div className="flex gap-4 pt-4">
                <button 
                  type="button" 
                  onClick={() => {
                    setIsShowingCreateModal(false);
                    setIsCreatingInlineCategory(false);
                    setInlineCategoryName('');
                  }}
                  className="flex-grow py-3 px-4 rounded-lg bg-gray-100 text-gray-600 font-bold hover:bg-gray-200 transition-colors"
                >
                  {t.cancel}
                </button>
                <button 
                  type="submit"
                  className="flex-grow py-3 px-4 rounded-lg bg-primary text-white font-bold hover:bg-primary-dark shadow-lg shadow-orange-100 transition-colors"
                >
                  {t.publish_now}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Sidebar and Main Content Layout */}
      <div className="flex h-full min-h-screen">
        {/* Dash Sidebar */}
        <aside className={`w-64 bg-[#001529] text-white hidden md:block flex-shrink-0 ${isRTL ? 'border-l' : 'border-r'} border-white/10`}>
          <div className="p-6">
            <h2 className="text-xl font-bold text-primary">{t.partner_hub}</h2>
          </div>
          <nav className="mt-4">
            <div className={`px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>{t.management}</div>
            <div 
              onClick={() => setActiveTab('Statistics')}
              className={`flex items-center gap-3 px-6 py-3 cursor-pointer transition-colors ${activeTab === 'Statistics' ? 'bg-primary/10 text-primary border-r-4 border-primary' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
            >
              <BarChart3 className="w-5 h-5" />
              <span className="font-medium">{t.dashboard}</span>
            </div>
            <div 
              onClick={() => setActiveTab('Promotions')}
              className={`flex items-center gap-3 px-6 py-3 cursor-pointer transition-colors ${activeTab === 'Promotions' ? 'bg-primary/10 text-primary border-r-4 border-primary' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
            >
              <Package className="w-5 h-5" />
              <span>{t.my_promotions}</span>
            </div>
            <div 
              onClick={() => setActiveTab('Categories')}
              className={`flex items-center gap-3 px-6 py-3 cursor-pointer transition-colors ${activeTab === 'Categories' ? 'bg-primary/10 text-primary border-r-4 border-primary' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
            >
              <Tags className="w-5 h-5" />
              <span>{language === 'English' ? 'Personal Categories' : language === 'Français' ? 'Catégories personnelles' : 'فئات شخصية'}</span>
            </div>
            <div 
              onClick={() => setIsShowingCreateModal(true)}
              className="flex items-center gap-3 px-6 py-3 text-gray-400 hover:text-white hover:bg-white/5 cursor-pointer transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>{t.create_new_offer}</span>
            </div>
            
            <div className={`px-4 py-6 text-xs font-semibold text-gray-500 uppercase tracking-wider ${isRTL ? 'text-right' : 'text-left'}`}>{t.account_info}</div>
            <Link 
              to="/profile"
              className="flex items-center gap-3 px-6 py-3 text-gray-400 hover:text-white hover:bg-white/5 cursor-pointer transition-colors"
            >
              <User className="w-5 h-5" />
              <span>{t.profile}</span>
            </Link>
            <div 
              onClick={() => handleAction(t.feature_coming_soon, 'info')}
              className="flex items-center gap-3 px-6 py-3 text-gray-400 hover:text-white hover:bg-white/5 cursor-pointer transition-colors"
            >
              <Shield className="w-5 h-5" />
              <span>{t.security}</span>
            </div>
          </nav>
        </aside>

        {/* Main Panel */}
        <main className="flex-grow p-4 md:p-8">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">{t.welcome_back_partner}</h1>
                <p className="text-sm text-gray-500">{t.dashboard_desc}</p>
              </div>
              <button 
                onClick={() => setIsShowingCreateModal(true)}
                className="bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 shadow-lg transition-all transform hover:-translate-y-1"
              >
                <Plus className="w-5 h-5" /> {t.create_offer}
              </button>
            </div>

            {/* Mobile Tab Switcher */}
            <div className="flex md:hidden border-b border-gray-200 mb-6 overflow-x-auto gap-4 py-1">
              {['Statistics', 'Promotions', 'Categories'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-2 text-sm font-bold border-b-2 whitespace-nowrap px-1 transition-all ${
                    activeTab === tab
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-800'
                  }`}
                >
                  {tab === 'Statistics' ? t.dashboard :
                   tab === 'Promotions' ? t.my_promotions :
                   language === 'English' ? 'Personal Categories' : language === 'Français' ? 'Catégories perso' : 'فئات شخصية'}
                </button>
              ))}
            </div>

            {activeTab === 'Statistics' && (
              <>
                {/* Quick Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  {[
                    { label: t.total_views, value: totalViews.toLocaleString(), icon: Eye, color: 'text-blue-600', bg: 'bg-blue-100', trend: '+12.5%' },
                    { label: t.total_clicks, value: totalClicks.toLocaleString(), icon: MousePointer2, color: 'text-orange-600', bg: 'bg-orange-100', trend: '+8.2%' },
                    { label: t.favorites, value: totalFavorites.toLocaleString(), icon: Heart, color: 'text-red-600', bg: 'bg-red-100', trend: '+15.1%' },
                    { label: t.conversion_rate, value: conversionRate, icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-100', trend: '+2.4%' }
                  ].map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`p-2 rounded-lg ${stat.bg}`}>
                          <stat.icon className={`w-6 h-6 ${stat.color}`} />
                        </div>
                        <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">{stat.trend}</span>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-800">{stat.value}</h3>
                      <p className="text-sm text-gray-500">{stat.label}</p>
                    </div>
                  ))}
                </div>

                {/* Recent Promotions Table snippet or Chart here */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
                   <div className="p-6 border-b border-gray-100">
                      <h2 className="text-lg font-bold text-gray-800">{t.performance_summary}</h2>
                   </div>
                   <div className="p-12 text-center text-gray-400">
                      <BarChart3 className="w-16 h-16 mx-auto mb-4 opacity-20" />
                      <p>{t.analytics_empty_msg}</p>
                   </div>
                </div>
              </>
            )}

            {activeTab === 'Promotions' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                  <h2 className="text-lg font-bold text-gray-800">{t.active_promos}</h2>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder={t.search_my_offers} 
                      value={searchMyOffersQuery}
                      onChange={(e) => setSearchMyOffersQuery(e.target.value)}
                      className="text-sm border border-gray-200 px-3 py-1.5 rounded-lg outline-none focus:border-primary" 
                    />
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className={`w-full ${isRTL ? 'text-right' : 'text-left'}`}>
                    <thead>
                      <tr className="bg-gray-50 text-[10px] uppercase tracking-wider text-gray-500 font-bold">
                        <th className={`px-6 py-4 ${isRTL ? 'text-right' : 'text-left'}`}>{t.product_offer}</th>
                        <th className={`px-6 py-4 ${isRTL ? 'text-right' : 'text-left'}`}>{t.categories}</th>
                        <th className={`px-6 py-4 ${isRTL ? 'text-right' : 'text-left'}`}>{t.price}</th>
                        <th className={`px-6 py-4 ${isRTL ? 'text-right' : 'text-left'}`}>{t.status}</th>
                        <th className={`px-6 py-4 ${isRTL ? 'text-left' : 'text-right'}`}>{t.actions}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {myPromotions.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-6 py-12 text-center text-gray-400 font-medium">
                            {language === 'English' ? 'No deals found.' : 'Aucun deal trouvé.'}
                          </td>
                        </tr>
                      ) : (
                        myPromotions.map((promo, i) => (
                          <tr key={i} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4">
                              <div className={`flex items-center gap-3 ${isRTL ? 'flex-row' : ''}`}>
                                <img src={promo.imageUrl} alt="" className="w-10 h-10 rounded object-cover" />
                                <div className={isRTL ? 'text-right' : 'text-left'}>
                                  <p className="text-sm font-semibold text-gray-800 line-clamp-1">{promo.title}</p>
                                  <p className="text-xs text-gray-400">ID: PROMO-{promo.id}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">{getTranslatedCategory(promo.category, language)}</td>
                            <td className="px-6 py-4">
                              <div className={`${isRTL ? 'flex flex-row-reverse justify-end items-center gap-2' : ''}`}>
                                <p className="text-sm font-bold text-gray-800">{isRTL ? '' : currency}{promo.discountedPrice.toLocaleString()}{isRTL ? ` ${currency}` : ''}</p>
                                <p className="text-xs text-gray-400 line-through">{isRTL ? '' : currency}{promo.originalPrice.toLocaleString()}{isRTL ? ` ${currency}` : ''}</p>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase ${
                                promo.status === 'active'
                                  ? 'bg-green-100 text-green-700'
                                  : promo.status === 'pending'
                                  ? 'bg-amber-100 text-amber-700'
                                  : 'bg-gray-100 text-gray-700'
                              } ${isRTL ? 'flex-row-reverse' : ''}`}>
                                <CheckCircle2 className="w-3 h-3" /> {
                                  promo.status === 'active' ? t.active :
                                  promo.status === 'pending' ? (language === 'English' ? 'Pending' : 'En attente') :
                                  (language === 'English' ? 'Paused' : 'Suspendu')
                                }
                              </span>
                            </td>
                            <td className={`px-6 py-4 ${isRTL ? 'text-left' : 'text-right'}`}>
                              <div className={`flex ${isRTL ? 'justify-start' : 'justify-end'} gap-2 text-primary font-bold text-xs`}>
                                <button 
                                  onClick={() => handleAction(`${t.edit} ${promo.title}`)}
                                  className="hover:text-primary-dark transition-colors px-2 py-1 rounded hover:bg-orange-50"
                                >
                                  {t.edit}
                                </button>
                                <button 
                                  onClick={() => deletePromotion(promo.id)}
                                  className="text-red-500 hover:text-red-700 transition-colors px-2 py-1 rounded hover:bg-red-50"
                                >
                                  {t.delete}
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'Categories' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-fade-in">
                <div className="p-6 border-b border-gray-100">
                  <h2 className="text-lg font-bold text-gray-800">
                    {language === 'English' ? 'Manage Personal Categories' : language === 'Français' ? 'Gérer les catégories personnelles' : 'إدارة الفئات الشخصية'}
                  </h2>
                  <p className="text-xs text-gray-500 mt-1">
                    {language === 'English' 
                      ? 'Add your custom categories (e.g. Cars, Animals) to tag your offers. These custom categories will instantly appear across the marketplace and in filters.' 
                      : language === 'Français' 
                      ? 'Ajoutez vos catégories sur mesure (ex: Voitures, Animaux) pour classer vos offres.' 
                      : 'أضف فئات مخصصة لتمكين تصنيف العروض الخاصة بك (مثل السيارات، الحيوانات، إلخ).'}
                  </p>
                </div>

                <div className="p-6 space-y-6">
                  {/* Form to add Category */}
                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (newCustomCategory.trim()) {
                        addCategory(newCustomCategory);
                        setNewCustomCategory('');
                      }
                    }}
                    className="flex flex-col sm:flex-row gap-3 max-w-lg"
                  >
                    <div className="flex-grow">
                      <input 
                        type="text"
                        value={newCustomCategory}
                        onChange={(e) => setNewCustomCategory(e.target.value)}
                        placeholder={language === 'English' ? 'e.g. Cars, Animals, Services...' : language === 'Français' ? 'ex: Voitures, Animaux...' : 'مثال: سيارات، حيوانات...'}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 outline-none focus:border-primary text-sm bg-gray-50"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-primary hover:bg-primary-dark text-white font-bold rounded-lg text-sm transition-all flex items-center justify-center gap-2 shadow"
                    >
                      <Plus className="w-4 h-4" />
                      {language === 'English' ? 'Add Category' : language === 'Français' ? 'Ajouter' : 'إضافة الفئة'}
                    </button>
                  </form>

                  {/* List of categories */}
                  <div>
                    <h3 className="font-bold text-xs uppercase text-gray-400 tracking-wider mb-4">
                      {language === 'English' ? 'Current Active Categories' : 'Catégories actives actuelles'}
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {categories.filter(c => c !== 'All').map((c) => {
                        const standardCategories = ['Mode', 'Restauration', 'High-Tech', 'Beauté', 'Maison', 'Sport', 'Voyage'];
                        const isSystem = standardCategories.includes(c);
                        
                        // Dynamic thematic style mapping for categories
                        const styleMap: Record<string, { bg: string, border: string, text: string, iconColor: string }> = {
                          'Mode': { bg: 'bg-blue-50/50', border: 'border-blue-100', text: 'text-blue-900', iconColor: 'text-blue-500' },
                          'Restauration': { bg: 'bg-red-50/50', border: 'border-red-100', text: 'text-red-900', iconColor: 'text-red-500' },
                          'High-Tech': { bg: 'bg-purple-50/50', border: 'border-purple-100', text: 'text-purple-900', iconColor: 'text-purple-500' },
                          'Beauté': { bg: 'bg-pink-50/50', border: 'border-pink-100', text: 'text-pink-900', iconColor: 'text-pink-500' },
                          'Maison': { bg: 'bg-teal-50/50', border: 'border-teal-100', text: 'text-teal-900', iconColor: 'text-teal-500' },
                          'Sport': { bg: 'bg-green-50/50', border: 'border-green-100', text: 'text-green-900', iconColor: 'text-green-500' },
                          'Voyage': { bg: 'bg-indigo-50/50', border: 'border-indigo-100', text: 'text-indigo-900', iconColor: 'text-indigo-500' },
                        };

                        const currentStyle = styleMap[c] || { 
                          bg: 'bg-orange-50/40', 
                          border: 'border-orange-100', 
                          text: 'text-orange-950', 
                          iconColor: 'text-primary' 
                        };

                        return (
                          <div 
                            key={c}
                            className={`p-3.5 rounded-xl border flex items-center justify-between transition-all hover:shadow-xs hover:border-gray-300 ${currentStyle.bg} ${currentStyle.border} ${currentStyle.text}`}
                          >
                            <div className="flex items-center gap-2.5">
                              <Tags className={`w-4 h-4 ${currentStyle.iconColor}`} />
                              <span className="text-sm font-semibold">{getTranslatedCategory(c, language)}</span>
                              {!isSystem && (
                                <span className="text-[9px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold uppercase tracking-wide">
                                  {language === 'English' ? 'Custom' : 'Perso'}
                                </span>
                              )}
                            </div>

                            {!isSystem && (
                              <button
                                type="button"
                                onClick={() => deleteCategory(c)}
                                className="text-gray-400 hover:text-red-600 hover:bg-white p-1.5 rounded-lg border border-transparent hover:border-red-100 transition-all shadow-xs"
                                title={language === 'English' ? 'Delete category' : 'Supprimer la catégorie'}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Campaign Insight Widget */}
            <div className="mt-8 bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-xl p-8 text-white relative overflow-hidden shadow-xl">
               <div className="relative z-10 max-w-lg">
                  <h3 className="text-xl font-bold mb-2">{t.campaign_tip_title}</h3>
                  <p className="text-indigo-100 mb-6 text-sm">
                    {t.campaign_tip_desc}
                  </p>
                  <button 
                    onClick={() => handleAction(t.campaign_optimized)}
                    className="bg-white text-indigo-800 font-bold px-6 py-2 rounded-lg text-sm hover:shadow-lg transition-all"
                  >
                    {t.optimize_campaign}
                  </button>
               </div>
               <div className={`absolute ${isRTL ? 'left-0' : 'right-0'} bottom-0 opacity-10`}>
                  <BarChart3 className="w-64 h-64" />
               </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
