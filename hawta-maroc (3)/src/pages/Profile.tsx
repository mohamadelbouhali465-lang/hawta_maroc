import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Shield, Bell, CreditCard, ChevronRight, LogOut, Camera, Truck, Package, MapPin, Calendar, Clock, CheckCircle, Store } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { motion } from 'motion/react';
import { useTranslation } from '../translations';

export const Profile: React.FC = () => {
  const { addNotification, language, currentUser, logout, userRole, setCurrentUser, orders = [], updateOrderStatus } = useAppContext();
  const t = useTranslation(language);
  const isRTL = language === 'العربية';
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'Account' | 'Security' | 'Notifications' | 'Orders'>('Account');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        addNotification(language === 'English' ? 'Image is too large (max 3MB)' : 'L\'image est trop grande (max 3 Mo)', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        
        const userToUpdate = currentUser || {
          name: profile.name,
          email: profile.email,
          role: userRole || 'client',
          phone: profile.phone,
          location: profile.location
        };

        setCurrentUser({
          ...userToUpdate,
          avatar: base64String
        });
        
        addNotification(language === 'English' ? 'Profile picture updated successfully!' : 'Photo de profil mise à jour avec succès !', 'success');
      };
      reader.onerror = () => {
        addNotification(language === 'English' ? 'Error reading file' : 'Erreur lors de la lecture du fichier', 'error');
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('tab') === 'orders') {
      setActiveTab('Orders');
    }
  }, []);
  
  const [profile, setProfile] = useState(() => {
    return {
      name: currentUser?.name || 'Mohamad El Bouhali',
      email: currentUser?.email || 'mohamadelbouhali465@gmail.com',
      phone: currentUser?.phone || '+212 600-000000',
      location: currentUser?.location || 'Casablanca, Morocco',
      category: userRole === 'admin' 
        ? 'System Administrator' 
        : userRole === 'user' 
        ? 'Verified Partner (Seller)' 
        : 'Registered Client (Buyer)'
    };
  });

  useEffect(() => {
    setProfile({
      name: currentUser?.name || 'Mohamad El Bouhali',
      email: currentUser?.email || 'mohamadelbouhali465@gmail.com',
      phone: currentUser?.phone || '+212 600-000000',
      location: currentUser?.location || 'Casablanca, Morocco',
      category: userRole === 'admin' 
        ? 'System Administrator' 
        : userRole === 'user' 
        ? 'Verified Partner (Seller)' 
        : 'Registered Client (Buyer)'
    });
  }, [currentUser, userRole]);

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
    if (currentUser) {
      setCurrentUser({
        ...currentUser,
        name: profile.name,
        phone: profile.phone,
        location: profile.location
      });
    }
    addNotification(t.profile_updated, 'success');
  };

  return (
    <div className={`max-w-4xl mx-auto px-4 py-12 ${isRTL ? 'font-sans' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-800">{t.my_profile}</h1>
        <p className="text-gray-500">{t.manage_profile_desc}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Sidebar Info */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl alibaba-shadow p-6 text-center border border-gray-50">
            <div className="relative inline-block mb-4 group cursor-pointer" onClick={triggerFileInput}>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleAvatarChange} 
                className="hidden" 
                accept="image/*" 
              />
              <div className="w-24 h-24 rounded-full bg-orange-100 flex items-center justify-center border-4 border-white shadow-md mx-auto overflow-hidden group-hover:opacity-90 transition-all">
                {currentUser?.avatar ? (
                  <img src={currentUser.avatar} alt={profile.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <User className="w-12 h-12 text-primary" />
                )}
              </div>
              <button 
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  triggerFileInput();
                }}
                className={`absolute bottom-0 ${isRTL ? 'left-0' : 'right-0'} p-1.5 bg-white rounded-full shadow-lg border border-gray-100 text-gray-600 hover:text-primary transition-colors`}
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <h2 className="text-xl font-bold text-gray-800">{profile.name}</h2>
            <p className="text-sm text-primary font-medium">{profile.category}</p>
            
            <div className="mt-8 space-y-2">
              <button 
                onClick={() => setActiveTab('Account')}
                className={`w-full text-left p-3 rounded-xl text-sm font-medium flex items-center justify-between transition-all ${
                  activeTab === 'Account' ? 'bg-orange-50 text-primary shadow-sm' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <div className={`flex items-center gap-3 ${isRTL ? 'flex-row' : ''}`}>
                  <User className="w-4 h-4" /> {t.personal_info}
                </div>
                <ChevronRight className={`w-4 h-4 transition-transform ${isRTL ? 'rotate-180' : ''} ${activeTab === 'Account' ? (isRTL ? '-rotate-90' : 'rotate-90') + ' text-primary' : 'text-gray-300'}`} />
              </button>
              <button 
                onClick={() => setActiveTab('Security')}
                className={`w-full text-left p-3 rounded-xl text-sm font-medium flex items-center justify-between transition-all ${
                  activeTab === 'Security' ? 'bg-orange-50 text-primary shadow-sm' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <div className={`flex items-center gap-3 ${isRTL ? 'flex-row' : ''}`}>
                  <Shield className="w-4 h-4" /> {t.security}
                </div>
                <ChevronRight className={`w-4 h-4 transition-transform ${isRTL ? 'rotate-180' : ''} ${activeTab === 'Security' ? (isRTL ? '-rotate-90' : 'rotate-90') + ' text-primary' : 'text-gray-300'}`} />
              </button>
              <button 
                onClick={() => setActiveTab('Notifications')}
                className={`w-full text-left p-3 rounded-xl text-sm font-medium flex items-center justify-between transition-all ${
                  activeTab === 'Notifications' ? 'bg-orange-50 text-primary shadow-sm' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <div className={`flex items-center gap-3 ${isRTL ? 'flex-row' : ''}`}>
                  <Bell className="w-4 h-4" /> {t.notifications}
                </div>
                <ChevronRight className={`w-4 h-4 transition-transform ${isRTL ? 'rotate-180' : ''} ${activeTab === 'Notifications' ? (isRTL ? '-rotate-90' : 'rotate-90') + ' text-primary' : 'text-gray-300'}`} />
              </button>
              <button 
                onClick={() => setActiveTab('Orders')}
                className={`w-full text-left p-3 rounded-xl text-sm font-medium flex items-center justify-between transition-all ${
                  activeTab === 'Orders' ? 'bg-orange-50 text-primary shadow-sm' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <div className={`flex items-center gap-3 ${isRTL ? 'flex-row' : ''}`}>
                  <Truck className="w-4 h-4" /> {t.track_orders}
                </div>
                <ChevronRight className={`w-4 h-4 transition-transform ${isRTL ? 'rotate-180' : ''} ${activeTab === 'Orders' ? (isRTL ? '-rotate-90' : 'rotate-90') + ' text-primary' : 'text-gray-300'}`} />
              </button>
              <div className="pt-4 mt-4 border-t border-gray-100">
                <button 
                  onClick={() => {
                    logout();
                    addNotification(language === 'English' ? 'Logged out successfully!' : 'Déconnexion réussie !', 'info');
                    navigate('/');
                  }}
                  className="w-full text-left p-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 flex items-center gap-3 transition-colors"
                >
                  <LogOut className="w-4 h-4" /> {t.sign_out}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Dynamic Content */}
        <div className="md:col-span-2">
          {activeTab === 'Account' && (
            <motion.div 
              key="account"
              initial={{ opacity: 0, x: isRTL ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl alibaba-shadow p-8 border border-gray-50 h-full"
            >
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-lg font-bold text-gray-800">{t.account_info}</h3>
                {!isEditing && (
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="text-sm text-primary font-bold hover:underline"
                  >
                    {t.edit_profile}
                  </button>
                )}
              </div>

              <form onSubmit={handleUpdate} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400 uppercase">{t.full_name}</label>
                    <input 
                      type="text" 
                      value={profile.name}
                      disabled={!isEditing}
                      onChange={(e) => setProfile({...profile, name: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-lg bg-gray-50 border border-gray-200 outline-none focus:border-primary disabled:opacity-60 transition-all text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400 uppercase">{t.email_address}</label>
                    <div className="relative">
                      <input 
                        type="email" 
                        value={profile.email}
                        disabled={true} 
                        className="w-full px-4 py-2.5 rounded-lg bg-gray-50 border border-gray-200 outline-none text-sm opacity-60"
                      />
                      <Shield className={`absolute ${isRTL ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300`} />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400 uppercase">{t.phone_number}</label>
                    <input 
                      type="tel" 
                      value={profile.phone}
                      disabled={!isEditing}
                      onChange={(e) => setProfile({...profile, phone: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-lg bg-gray-50 border border-gray-200 outline-none focus:border-primary disabled:opacity-60 transition-all text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400 uppercase">{t.location}</label>
                    <input 
                      type="text" 
                      value={profile.location}
                      disabled={!isEditing}
                      onChange={(e) => setProfile({...profile, location: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-lg bg-gray-50 border border-gray-200 outline-none focus:border-primary disabled:opacity-60 transition-all text-sm"
                    />
                  </div>
                </div>

                {isEditing && (
                  <div className="flex gap-4 pt-4 border-t border-gray-100">
                    <button 
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="flex-grow py-3 px-4 rounded-xl bg-gray-100 text-gray-600 font-bold hover:bg-gray-200 transition-colors"
                    >
                      {t.cancel}
                    </button>
                    <button 
                      type="submit"
                      className="flex-grow py-3 px-4 rounded-xl bg-primary text-white font-bold hover:bg-primary-dark shadow-lg shadow-orange-100 transition-colors"
                    >
                      {t.save_changes}
                    </button>
                  </div>
                )}
              </form>

              <div className="mt-12">
                <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-gray-400" /> {t.payment_methods}
                </h3>
                <div className="border border-dashed border-gray-200 rounded-2xl p-8 text-center bg-gray-50/50">
                  <p className="text-sm text-gray-400">{t.no_payment_methods}</p>
                  <button className="mt-4 text-primary font-bold text-sm flex items-center gap-2 mx-auto hover:underline">
                    {t.add_card}
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'Security' && (
            <motion.div 
              key="security"
              initial={{ opacity: 0, x: isRTL ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl alibaba-shadow p-8 border border-gray-50 h-full"
            >
              <h3 className="text-lg font-bold text-gray-800 mb-8">{t.security}</h3>
              
              <div className="space-y-8">
                <div className="flex items-center justify-between pb-6 border-b border-gray-100">
                  <div>
                    <h4 className="font-bold text-gray-800 text-sm">{t.two_factor}</h4>
                    <p className="text-xs text-gray-500">{t.two_factor_desc}</p>
                  </div>
                  <button 
                    onClick={() => addNotification('Configuration 2FA...')}
                    className="px-4 py-2 bg-primary/10 text-primary text-xs font-bold rounded-lg hover:bg-primary/20 transition-colors"
                  >
                    {t.enable}
                  </button>
                </div>

                <div className="flex items-center justify-between pb-6 border-b border-gray-100">
                  <div>
                    <h4 className="font-bold text-gray-800 text-sm">{t.password_mgmt}</h4>
                    <p className="text-xs text-gray-500">{t.password_mgmt_desc}</p>
                  </div>
                  <button 
                    onClick={() => addNotification('Changement de mot de passe...')}
                    className="px-4 py-2 bg-gray-100 text-gray-700 text-xs font-bold rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    {t.change_password}
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-gray-800 text-sm">{t.active_sessions}</h4>
                    <p className="text-xs text-gray-500">{t.active_sessions_desc}</p>
                  </div>
                  <button 
                    onClick={() => addNotification('Déconnexion de tous les appareils')}
                    className="text-xs font-bold text-red-500 hover:underline"
                  >
                    {t.revoke_all}
                  </button>
                </div>

                <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 flex gap-4">
                  <div className="p-2 bg-white rounded-lg shadow-sm h-fit">
                    <Shield className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-blue-800">{t.account_safe}</h5>
                    <p className="text-xs text-blue-600 mt-1">{t.account_safe_desc}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'Notifications' && (
            <motion.div 
              key="notifications"
              initial={{ opacity: 0, x: isRTL ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl alibaba-shadow p-8 border border-gray-50 h-full"
            >
              <h3 className="text-lg font-bold text-gray-800 mb-8">{t.notification_prefs}</h3>
              
              <div className="space-y-6">
                {[
                  { title: t.email_alerts, desc: t.email_alerts_desc },
                  { title: t.push_notifications, desc: t.push_notifications_desc },
                  { title: t.partner_offers, desc: t.partner_offers_desc },
                  { title: t.account_activity, desc: t.account_activity_desc }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                    <div className="flex-grow">
                      <h4 className="font-bold text-gray-800 text-sm">{item.title}</h4>
                      <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked={idx !== 2} />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => addNotification(t.notification_prefs_saved, 'success')}
                className="w-full mt-10 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-all shadow-lg shadow-orange-100"
              >
                {t.save_preferences}
              </button>
            </motion.div>
          )}

          {activeTab === 'Orders' && (
            <motion.div 
              key="orders"
              initial={{ opacity: 0, x: isRTL ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl alibaba-shadow p-6 md:p-8 border border-gray-50 h-full text-left font-sans"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                  <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <Truck className="w-5 h-5 text-primary" />
                    {language === 'English' ? 'Live Order & Commands Tracking' : language === 'Français' ? 'Suivi en Direct de mes Commandes' : 'تتبع الطلبات المباشر'}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    {language === 'English' ? 'Monitor shipping and delivery stages of your purchases across Morocco' : language === 'Français' ? 'Suivez les étapes de livraison et de transport de vos colis' : 'تابع مراحل شحن وتوصيل طلباتك في جميع أنحاء المغرب'}
                  </p>
                </div>
                {orders.length > 0 && (
                  <span className="bg-orange-50 text-primary text-xs font-black px-3 py-1.5 rounded-full border border-orange-100 self-start sm:self-center">
                    {orders.length} {language === 'English' ? 'Orders Total' : 'Commandes au total'}
                  </span>
                )}
              </div>

              {orders.length === 0 ? (
                <div className="border border-dashed border-gray-200 rounded-2xl p-12 text-center bg-gray-50/50 flex flex-col items-center justify-center">
                  <Package className="w-12 h-12 text-gray-300 mb-3" />
                  <p className="text-sm font-semibold text-gray-600">
                    {language === 'English' ? 'No orders placed yet' : 'Aucune commande passée pour le moment'}
                  </p>
                  <p className="text-xs text-gray-400 mt-1 max-w-sm">
                    {language === 'English' ? "Once you click 'Buy Direct' on a deal and complete checkout, your order will appear here instantly!" : "Dès que vous validez un achat direct sur une offre, votre colis apparaîtra ici avec son suivi étape par étape !"}
                  </p>
                  <button 
                    onClick={() => navigate('/deals')}
                    className="mt-5 text-xs font-bold bg-primary text-white px-5 py-2.5 rounded-xl hover:bg-primary-dark transition-all shadow-md active:scale-95"
                  >
                    {language === 'English' ? 'Browse Hot Deals' : 'Parcourir les promotions'}
                  </button>
                </div>
              ) : (
                <div className="space-y-8">
                  {orders.map((order, orderIdx) => {
                    // Status metadata
                    const statusConfig: Record<string, { bg: string, text: string, textFr: string, textEn: string, percentage: number }> = {
                      placed: { bg: 'bg-blue-50 text-blue-600 border border-blue-100', text: 'طلب مسجل', textFr: 'Commande enregistrée', textEn: 'Order placed', percentage: 10 },
                      confirmed: { bg: 'bg-purple-50 text-purple-600 border-purple-100', text: 'تم التأكيد', textFr: 'Confirmée par le bendeur', textEn: 'Confirmed by Seller', percentage: 35 },
                      shipped: { bg: 'bg-indigo-50 text-indigo-600 border-indigo-100', text: 'تم الشحن', textFr: 'En transit (Amana Express)', textEn: 'Shipped (Amana Express)', percentage: 65 },
                      out_for_delivery: { bg: 'bg-orange-50 text-orange-600 border border-orange-100', text: 'جاري التوصيل', textFr: 'Livraison en cours', textEn: 'Out for delivery', percentage: 85 },
                      delivered: { bg: 'bg-emerald-50 text-emerald-600 border border-emerald-100', text: 'تم التسليم', textFr: 'Livreur Reçu & Payé', textEn: 'Delivered & Completed', percentage: 100 },
                    };

                    const currentConfig = statusConfig[order.status] || statusConfig.placed;
                    
                    const steps = [
                      { id: 'placed', labelEn: 'Placed', labelFr: 'Reçue', labelAr: 'تسجيل' },
                      { id: 'confirmed', labelEn: 'Confirmed', labelFr: 'Confirmée', labelAr: 'تأكيد' },
                      { id: 'shipped', labelEn: 'Shipped', labelFr: 'Expédiée', labelAr: 'شحن' },
                      { id: 'out_for_delivery', labelEn: 'In Transit', labelFr: 'En cours', labelAr: 'توصيل' },
                      { id: 'delivered', labelEn: 'Delivered', labelFr: 'Livrée', labelAr: 'تسليم' }
                    ];

                    const currentStepIdx = steps.findIndex(s => s.id === order.status);

                    const advanceStatus = () => {
                      const nextStatusMap: Record<string, 'placed' | 'confirmed' | 'shipped' | 'out_for_delivery' | 'delivered'> = {
                        placed: 'confirmed',
                        confirmed: 'shipped',
                        shipped: 'out_for_delivery',
                        out_for_delivery: 'delivered',
                        delivered: 'placed'
                      };
                      const next = nextStatusMap[order.status];
                      updateOrderStatus(order.id, next);
                      
                      const advancedSuccessMsg = language === 'English' 
                        ? `Order status simulated to: ${next.toUpperCase()}`
                        : language === 'Français'
                        ? `Statut de la commande simulé à : ${next.toUpperCase()}`
                        : `تم محاكاة حالة الطلب إلى: ${next.toUpperCase()}`;
                      addNotification(advancedSuccessMsg, 'success');
                    };

                    return (
                      <div key={order.id} className="border border-gray-100 rounded-2xl p-5 md:p-6 bg-gray-50/20 hover:border-gray-200 transition-all text-left">
                        {/* Upper row */}
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-gray-100">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-gray-400 font-mono">ID:</span>
                              <span className="text-sm font-extrabold text-gray-800 font-mono">{order.id}</span>
                            </div>
                            <div className="flex items-center gap-4 mt-1 flex-wrap">
                              <span className="text-xs text-gray-400 font-mono flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5 text-gray-400" /> {order.date}
                              </span>
                              <span className="text-xs text-gray-400 font-sans flex items-center gap-1.5">
                                {currentUser?.avatar ? (
                                  <img 
                                    src={currentUser.avatar} 
                                    alt="Buyer" 
                                    className="w-4 h-4 rounded-full object-cover border border-gray-100" 
                                    referrerPolicy="no-referrer"
                                  />
                                ) : (
                                  <User className="w-3.5 h-3.5 text-gray-400" />
                                )}
                                <span className="font-semibold text-gray-700">{currentUser?.name || 'Client'}</span>
                              </span>
                              <span className="text-xs text-gray-400 font-sans flex items-center gap-1">
                                <Store className="w-3.5 h-3.5 text-gray-400" /> {order.partnerName}
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 self-stretch md:self-auto justify-between md:justify-end">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${currentConfig.bg}`}>
                              {language === 'English' ? currentConfig.textEn : language === 'Français' ? currentConfig.textFr : currentConfig.text}
                            </span>
                            
                            <button 
                              onClick={advanceStatus}
                              className="text-xs bg-primary hover:bg-primary-dark text-white font-extrabold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 whitespace-nowrap active:scale-95"
                              title={language === 'English' ? "Simulate next delivery step" : "Simuler l'étape suivante de livraison"}
                            >
                              <Clock className="w-3 h-3 animate-spin" />
                              {language === 'English' ? 'Logistics Step' : 'Étape logistique'}
                            </button>
                          </div>
                        </div>

                        {/* Tracker graphic stepper */}
                        <div className="my-8 md:my-10 px-2 md:px-6">
                          <div className="relative flex items-center justify-between">
                            {/* Line connecting steps */}
                            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-gray-100 rounded-full z-0">
                              <div 
                                className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
                                style={{ width: `${(currentStepIdx / (steps.length - 1)) * 105}%` }}
                              />
                            </div>

                            {/* Circles */}
                            {steps.map((step, idx) => {
                              const isCompleted = idx <= currentStepIdx;
                              const isCurrent = idx === currentStepIdx;
                              return (
                                <div key={step.id} className="relative z-10 flex flex-col items-center">
                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all border duration-300 ${
                                    isCompleted 
                                      ? 'bg-primary border-primary text-white shadow-md shadow-orange-100' 
                                      : 'bg-white border-gray-200 text-gray-400'
                                  }`}>
                                    {isCompleted ? (
                                      <CheckCircle className="w-4 h-4" />
                                    ) : (
                                      <span className="text-xs font-bold">{idx + 1}</span>
                                    )}
                                  </div>
                                  <div className="absolute top-10 whitespace-nowrap text-center">
                                    <p className={`text-[10px] md:text-xs font-black ${isCurrent ? 'text-primary' : isCompleted ? 'text-gray-800' : 'text-gray-400'}`}>
                                      {language === 'English' ? step.labelEn : language === 'Français' ? step.labelFr : step.labelAr}
                                    </p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Spacer to push details */}
                        <div className="h-4" />

                        {/* Logistics details / Address inside a beautiful box details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 pt-4 border-t border-gray-100 bg-gray-50/50 p-4 rounded-xl text-left">
                          <div className="text-left flex items-start gap-3">
                            {currentUser?.avatar ? (
                              <img 
                                src={currentUser.avatar} 
                                alt="Buyer Avatar" 
                                className="w-10 h-10 rounded-full object-cover border border-gray-200 mt-1 shadow-xs flex-shrink-0" 
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center mt-1 flex-shrink-0">
                                <User className="w-5 h-5 text-primary" />
                              </div>
                            )}
                            <div className="text-left">
                              <h4 className="text-xs font-black text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5 justify-start">
                                <MapPin className="w-3.5 h-3.5 text-primary" />
                                {language === 'English' ? 'Moroccan Delivery Address' : 'Adresse de Livraison Maroc'}
                              </h4>
                              <p className="text-sm font-extrabold text-gray-800">{order.address}</p>
                              <p className="text-xs font-bold text-gray-600 mt-0.5">{order.city}, Maroc</p>
                              <p className="text-xs text-gray-500 mt-1 font-mono">{order.phone}</p>
                            </div>
                          </div>

                          <div className="flex flex-col justify-between border-t md:border-t-0 md:border-l border-gray-200 pt-3 md:pt-0 md:pl-4 text-left">
                            <div className="text-left">
                              <h4 className="text-xs font-black text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5 justify-start">
                                <Package className="w-3.5 h-3.5 text-primary" />
                                {language === 'English' ? 'Shipped Item Info' : "Détails de l'article"}
                              </h4>
                              <div className="flex gap-3 items-center justify-start">
                                <img 
                                  src={order.productImage} 
                                  alt={order.productTitle} 
                                  referrerPolicy="no-referrer"
                                  className="w-10 h-10 rounded-lg object-cover border border-gray-100" 
                                />
                                <div className="text-left">
                                  <p className="text-xs font-bold text-gray-800 line-clamp-1">{order.productTitle}</p>
                                  <p className="text-[11px] text-gray-400 font-bold mt-0.5">
                                    {order.price} DH  x  {order.quantity}
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div className="flex justify-between items-center mt-3 pt-2 border-t border-gray-100">
                              <span className="text-xs font-bold text-gray-500">Total:</span>
                              <span className="text-sm font-extrabold text-primary font-mono">{order.total} DH</span>
                            </div>
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};
