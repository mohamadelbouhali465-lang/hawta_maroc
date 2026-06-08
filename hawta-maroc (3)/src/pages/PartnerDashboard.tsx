
import React from 'react';
import { Link } from 'react-router-dom';
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
  Shield
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { useTranslation, getTranslatedCategory } from '../translations';
import { Promotion } from '../types';

const OFFER_CATEGORIES = ['High-Tech', 'Mode', 'Maison', 'Sport', 'Restauration', 'BeautÃ©', 'Voyage'];

export const PartnerDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState('Statistics');
  const [isShowingCreateModal, setIsShowingCreateModal] = React.useState(false);
  const [editingPromotion, setEditingPromotion] = React.useState<Promotion | null>(null);
  const [previewImage, setPreviewImage] = React.useState('');
  const { promotions, addPromotion, updatePromotion, deletePromotion, addNotification, logActivity, language } = useAppContext();
  const t = useTranslation(language);
  const isRTL = language === 'العربية';
  const currency = language === 'العربية' ? 'د.م.' : 'DH';

  const handleAction = (msg: string, type: 'info' | 'success' | 'error' = 'info') => {
    addNotification(msg, type);
  };

  const handleEditOffer = (promo: Promotion) => {
    setEditingPromotion(promo);
    setPreviewImage(promo.imageUrl);
  };

  const handleDeleteOffer = async (promoId: string, title: string) => {
    if (!window.confirm(`Delete "${title}" from the database?`)) return;
    await deletePromotion(promoId);
  };

  const handleCreateOffer = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const title = String(formData.get('title') || '').trim();
    const originalPrice = Number(formData.get('originalPrice'));
    const discountedPrice = Number(formData.get('discountedPrice'));
    const category = String(formData.get('category') || 'High-Tech');
    const discountPercentage = originalPrice > 0
      ? Math.round(((originalPrice - discountedPrice) / originalPrice) * 100)
      : 0;

    await addPromotion({
      id: crypto.randomUUID(),
      title,
      description: title,
      partnerId: 'current-partner',
      partnerName: 'Hawta Maroc Partner',
      category,
      imageUrl: previewImage || 'https://images.unsplash.com/photo-1607082349566-187342175e2f?auto=format&fit=crop&w=800&q=80',
      originalPrice,
      discountedPrice,
      discountPercentage,
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'active',
      tags: [category],
      views: 0,
      clicks: 0,
      favoritesCount: 0,
      isVerifiedPartner: true,
    });
    setPreviewImage('');
    setIsShowingCreateModal(false);
  };

  const handleUpdateOffer = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingPromotion) return;

    const formData = new FormData(e.currentTarget);
    const title = String(formData.get('title') || '').trim();
    const imageUrl = String(formData.get('imageUrl') || '').trim();
    const originalPrice = Number(formData.get('originalPrice'));
    const discountedPrice = Number(formData.get('discountedPrice'));
    const category = String(formData.get('category') || editingPromotion.category);
    const discountPercentage = originalPrice > 0
      ? Math.round(((originalPrice - discountedPrice) / originalPrice) * 100)
      : 0;

    const saved = await updatePromotion(editingPromotion.id, {
      title,
      description: title,
      imageUrl: imageUrl || editingPromotion.imageUrl,
      originalPrice,
      discountedPrice,
      discountPercentage,
      category,
      tags: [category],
    });

    if (saved) {
      setEditingPromotion(null);
      setPreviewImage('');
    }
  };

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
                      <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
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
                <input name="title" required type="text" placeholder="e.g. iPhone 15 Pro Max Wholesale" className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 outline-none focus:border-primary transition-all text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">{t.orig_price}</label>
                  <input name="originalPrice" required type="number" min="0" placeholder="999" className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 outline-none focus:border-primary transition-all text-sm" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">{t.bargain_price}</label>
                  <input name="discountedPrice" required type="number" min="0" placeholder="799" className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 outline-none focus:border-primary transition-all text-sm" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">{t.categories}</label>
                <select name="category" className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 outline-none focus:border-primary transition-all text-sm">
                  {OFFER_CATEGORIES.map(c => (
                    <option key={c} value={c}>{getTranslatedCategory(c, language)}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-4 pt-4">
                <button 
                  type="button" 
                  onClick={() => setIsShowingCreateModal(false)}
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

      {editingPromotion && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl scale-in-center">
            <div className="bg-gray-900 p-6 text-white text-center">
              <h3 className="text-xl font-bold">{t.edit} {editingPromotion.title}</h3>
              <p className="text-gray-300 text-xs">Update the product name, price, image, and category.</p>
            </div>
            <form onSubmit={handleUpdateOffer} className="p-8 space-y-6">
              <div className="space-y-4">
                <label className="text-xs font-bold text-gray-500 uppercase block">{t.product_image}</label>
                <div className="flex gap-4 items-center">
                  <div className="w-24 h-24 rounded-xl bg-gray-100 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center overflow-hidden flex-shrink-0">
                    {previewImage ? (
                      <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="w-8 h-8 text-gray-300" />
                    )}
                  </div>
                  <div className="flex-grow space-y-2">
                    <div className="relative">
                      <input
                        name="imageUrl"
                        type="text"
                        placeholder={t.paste_image_url}
                        defaultValue={editingPromotion.imageUrl}
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
                <input name="title" required type="text" defaultValue={editingPromotion.title} className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 outline-none focus:border-primary transition-all text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">{t.orig_price}</label>
                  <input name="originalPrice" required type="number" min="0" defaultValue={editingPromotion.originalPrice} className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 outline-none focus:border-primary transition-all text-sm" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">{t.bargain_price}</label>
                  <input name="discountedPrice" required type="number" min="0" defaultValue={editingPromotion.discountedPrice} className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 outline-none focus:border-primary transition-all text-sm" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">{t.categories}</label>
                <select name="category" defaultValue={editingPromotion.category} className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 outline-none focus:border-primary transition-all text-sm">
                  {OFFER_CATEGORIES.map(c => (
                    <option key={c} value={c}>{getTranslatedCategory(c, language)}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setEditingPromotion(null);
                    setPreviewImage('');
                  }}
                  className="flex-grow py-3 px-4 rounded-lg bg-gray-100 text-gray-600 font-bold hover:bg-gray-200 transition-colors"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="flex-grow py-3 px-4 rounded-lg bg-primary text-white font-bold hover:bg-primary-dark shadow-lg shadow-orange-100 transition-colors"
                >
                  {t.save_changes}
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
              onClick={() => logActivity('security', 'Partner security settings opened')}
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

            {activeTab === 'Statistics' ? (
              <>
                {/* Quick Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  {[
                    { label: t.total_views, value: '45.2k', icon: Eye, color: 'text-blue-600', bg: 'bg-blue-100', trend: '+12.5%' },
                    { label: t.total_clicks, value: '12.8k', icon: MousePointer2, color: 'text-orange-600', bg: 'bg-orange-100', trend: '+8.2%' },
                    { label: t.favorites, value: '3,456', icon: Heart, color: 'text-red-600', bg: 'bg-red-100', trend: '+15.1%' },
                    { label: t.conversion_rate, value: '4.2%', icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-100', trend: '+2.4%' }
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
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                  <h2 className="text-lg font-bold text-gray-800">{t.active_promos}</h2>
                  <div className="flex gap-2">
                    <input type="text" placeholder={t.search_my_offers} className="text-sm border border-gray-200 px-3 py-1.5 rounded-lg outline-none focus:border-primary" />
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
                      {promotions.map((promo, i) => (
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
                            <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full bg-green-100 text-green-700 uppercase ${isRTL ? 'flex-row-reverse' : ''}`}>
                              <CheckCircle2 className="w-3 h-3" /> {t.active}
                            </span>
                          </td>
                          <td className={`px-6 py-4 ${isRTL ? 'text-left' : 'text-right'}`}>
                            <div className={`flex ${isRTL ? 'justify-start' : 'justify-end'} gap-2 text-primary font-bold text-xs`}>
                              <button 
                                onClick={() => handleEditOffer(promo)}
                                className="hover:text-primary-dark transition-colors px-2 py-1 rounded hover:bg-orange-50"
                              >
                                {t.edit}
                              </button>
                              <button 
                                onClick={() => handleDeleteOffer(promo.id, promo.title)}
                                className="text-red-500 hover:text-red-700 transition-colors px-2 py-1 rounded hover:bg-red-50"
                              >
                                {t.delete}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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
                    onClick={() => logActivity('campaign', t.campaign_optimized)}
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
