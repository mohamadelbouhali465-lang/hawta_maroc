import React, { useState } from 'react';
import { User, Shield, Bell, CreditCard, ChevronRight, LogOut, Camera } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { motion } from 'motion/react';
import { useTranslation } from '../translations';

export const Profile: React.FC = () => {
  const { currentUser, updateUserProfile, signOut, addNotification, logActivity, language } = useAppContext();
  const t = useTranslation(language);
  const isRTL = language === 'العربية';
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'Account' | 'Security' | 'Notifications'>('Account');
  
  const [profile, setProfile] = useState({
    name: currentUser?.name || 'Mohamad El Bouhali',
    email: currentUser?.email || 'mohamadelbouhali465@gmail.com',
    phone: currentUser?.phone || '+212 600-000000',
    location: currentUser?.location || 'Casablanca, Morocco',
    category: t.verified_partner
  });

  React.useEffect(() => {
    if (!currentUser) return;
    setProfile({
      name: currentUser.name,
      email: currentUser.email,
      phone: currentUser.phone || '',
      location: currentUser.location || '',
      category: currentUser.category || t.verified_partner
    });
  }, [currentUser, t.verified_partner]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const saved = await updateUserProfile({
      name: profile.name,
      phone: profile.phone,
      location: profile.location,
      category: profile.category,
    });
    if (saved) {
      setIsEditing(false);
      addNotification(t.profile_updated, 'success');
    }
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
            <div className="relative inline-block mb-4">
              <div className="w-24 h-24 rounded-full bg-orange-100 flex items-center justify-center border-4 border-white shadow-md mx-auto overflow-hidden">
                <User className="w-12 h-12 text-primary" />
              </div>
              <button onClick={() => addNotification('Avatar upload needs file storage. The profile document is ready for it.', 'info')} className={`absolute bottom-0 ${isRTL ? 'left-0' : 'right-0'} p-1.5 bg-white rounded-full shadow-lg border border-gray-100 hover:text-primary transition-colors`}>
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
              <div className="pt-4 mt-4 border-t border-gray-100">
                <button onClick={signOut} className="w-full text-left p-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 flex items-center gap-3 transition-colors">
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
                  <button onClick={() => logActivity('payment', 'Payment method setup requested', { userId: currentUser?.id })} className="mt-4 text-primary font-bold text-sm flex items-center gap-2 mx-auto hover:underline">
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
                    onClick={() => logActivity('security', 'Two-factor authentication setup requested', { userId: currentUser?.id })}
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
                    onClick={() => logActivity('security', 'Password change requested', { userId: currentUser?.id })}
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
                    onClick={() => logActivity('security', 'All sessions revoked', { userId: currentUser?.id })}
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
                onClick={() => updateUserProfile({
                  notificationPreferences: {
                    emailAlerts: true,
                    pushNotifications: true,
                    partnerOffers: false,
                    accountActivity: true,
                  }
                } as any)}
                className="w-full mt-10 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-all shadow-lg shadow-orange-100"
              >
                {t.save_preferences}
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};
