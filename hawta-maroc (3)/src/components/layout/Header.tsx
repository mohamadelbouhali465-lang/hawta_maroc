
import React from 'react';
import { Search, ShoppingCart, User, Globe, Menu, Heart, Shield, X, Truck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { useTranslation } from '../../translations';

export const Header: React.FC = () => {
  const { 
    compareList, 
    searchQuery, 
    setSearchQuery, 
    language, 
    setLanguage, 
    addNotification,
    isLoggedIn,
    userRole,
    setUserRole,
    currentUser,
    logout
  } = useAppContext();
  const navigate = useNavigate();
  const t = useTranslation(language);

  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const isRTL = language === 'العربية';

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate('/deals');
    }
  };

  return (
    <header className={`bg-white border-b border-gray-200 sticky top-0 z-50 ${isRTL ? 'font-sans' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Top bar */}
      <div className="bg-gray-100 py-1 text-xs text-gray-600 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <div className="flex gap-4">
            {isLoggedIn && (
              <Link to="/partner" className="cursor-pointer hover:text-primary">{t.partner_center}</Link>
            )}
            {isLoggedIn && userRole === 'admin' && (
              <Link to="/admin" className="text-red-600 hover:text-red-700 font-extrabold flex items-center gap-1">
                🛡️ {language === 'English' ? 'Admin Panel' : language === 'Français' ? 'Panel Admin' : 'لوحة التحكم'}
              </Link>
            )}
            <div className="relative group">
              <span className="flex items-center gap-1 cursor-pointer hover:text-primary">
                <Globe className="w-3 h-3" /> {language}
              </span>
              <div className={`hidden group-hover:block absolute ${isRTL ? 'right-0' : 'left-0'} top-full mt-1 bg-white border border-gray-100 rounded-lg shadow-xl overflow-hidden min-w-[120px] z-[100] animate-in fade-in slide-in-from-top-1`}>
                <button 
                  onClick={() => { setLanguage('English'); addNotification(t.categories_initialized, 'info'); }}
                  className={`w-full px-4 py-2.5 text-[11px] text-left hover:bg-orange-50 transition-colors ${language === 'English' ? 'text-primary font-bold bg-orange-50/50' : 'text-gray-600'}`}
                >
                  English
                </button>
                <button 
                  onClick={() => { setLanguage('Français'); addNotification(t.categories_initialized, 'info'); }}
                  className={`w-full px-4 py-2.5 text-[11px] text-left hover:bg-orange-50 transition-colors ${language === 'Français' ? 'text-primary font-bold bg-orange-50/50' : 'text-gray-600'}`}
                >
                  Français
                </button>
                <button 
                  onClick={() => { setLanguage('العربية'); addNotification(t.categories_initialized, 'info'); }}
                  className={`w-full px-4 py-2.5 text-[13px] text-right hover:bg-orange-50 transition-colors font-sans ${language === 'العربية' ? 'text-primary font-bold bg-orange-50/50' : 'text-gray-600'}`}
                >
                  العربية
                </button>
              </div>
            </div>
          </div>
          <p className="font-medium tracking-tight text-gray-700">{t.tagline}</p>
          <div className="flex gap-4">
            {!isLoggedIn && (
              <Link to="/signin" className="cursor-pointer hover:text-primary font-semibold">{t.join_free}</Link>
            )}
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-6">
        {/* Logo */}
        <button 
          onClick={() => setIsMenuOpen(true)}
          className="md:hidden text-gray-700 hover:text-primary transition-colors focus:outline-none"
          aria-label="Toggle menu"
        >
          <Menu className={`w-6 h-6 ${isRTL ? 'ml-2' : ''}`} />
        </button>
        <Link to="/" className="flex items-center gap-2 flex-shrink-0">
          <motion.div 
            initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl font-bold text-primary flex items-center"
          >
            HAWTA<span className="text-secondary ml-2 mr-2">MAROC</span>
          </motion.div>
        </Link>

        {/* Categories Link for mobile or desktop */}
        <Link to="/deals" className="hidden md:flex items-center gap-2 text-sm font-semibold hover:text-primary whitespace-nowrap">
           {t.browse_deals}
        </Link>

        {/* Search Bar - Alibaba style */}
        <form onSubmit={handleSearch} className="flex-grow max-w-2xl hidden md:flex items-center overflow-hidden border-2 border-primary rounded-full">
          <div className={`px-4 py-2 bg-gray-50 ${isRTL ? 'border-l' : 'border-r'} border-gray-200 text-sm font-medium flex items-center gap-1 cursor-pointer whitespace-nowrap`}>
            {t.products} <Search className="w-4 h-4 ml-1 mr-1" />
          </div>
          <input 
            type="text" 
            placeholder={t.search_placeholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 outline-none text-sm"
          />
          <button type="submit" className="bg-primary text-white px-8 py-2 font-semibold hover:bg-primary-dark transition-colors">
            {t.search}
          </button>
        </form>

        {/* User Actions */}
        <div className={`flex items-center gap-6 ${isRTL ? 'mr-auto' : 'ml-auto'}`}>
          {isLoggedIn && (
            <div className={`relative flex flex-col items-center ${userRole === 'admin' ? 'group/role' : ''}`}>
              <div className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full border flex items-center gap-1 transition-all ${
                userRole === 'admin' ? 'cursor-pointer' : 'cursor-default'
              } ${
                userRole === 'admin' 
                  ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100' 
                  : userRole === 'user'
                  ? 'bg-indigo-50 text-indigo-600 border-indigo-200'
                  : 'bg-emerald-50 text-emerald-600 border-emerald-200'
              }`}>
                <span>{userRole === 'admin' ? '🛡️ Admin' : userRole === 'user' ? '📦 Seller' : '👤 Client'}</span>
              </div>
              
              {/* Dropdown to switch roles for demonstration - restricted to admin role strictly */}
              {userRole === 'admin' && (
                <div className={`absolute top-full mt-1 hidden group-hover/role:block bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden min-w-[140px] z-[100] p-1 font-semibold text-center text-xs text-gray-700 ${isRTL ? 'right-0' : 'left-0'}`}>
                  <div className="p-1 px-2 text-[9px] uppercase tracking-wider text-gray-400 border-b border-gray-50 mb-1">Demo Role Switch</div>
                  {(['client', 'user', 'admin'] as const).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => {
                        setUserRole(r);
                        addNotification(language === 'English' ? `Role changed to ${r.toUpperCase()}!` : language === 'Français' ? `Rôle changé en ${r.toUpperCase()} !` : `تم تغيير الصلاحية إلى ${r}!`, 'success');
                      }}
                      className={`w-full text-left px-3 py-1.5 rounded-lg transition-colors hover:bg-orange-50 ${userRole === r ? 'text-primary font-bold bg-orange-50/50' : 'text-gray-600 font-medium'}`}
                    >
                      {r === 'admin' ? '🛡️ Admin' : r === 'user' ? '📦 Seller' : '👤 Client'}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {isLoggedIn && userRole === 'admin' && (
            <Link to="/admin" className="hidden md:flex flex-col items-center cursor-pointer group bg-red-50 hover:bg-red-100 p-1 px-2.5 rounded-xl border border-red-100 transition-all">
              <Shield className="w-5 h-5 text-red-600 animate-pulse" />
              <span className="text-[9px] text-red-700 font-extrabold mt-0.5">{language === 'English' ? 'Dashboard' : 'Admin'}</span>
            </Link>
          )}

          {isLoggedIn && (
            <>
              <Link to="/profile" className="hidden md:flex flex-col items-center cursor-pointer group">
                {currentUser?.avatar ? (
                  <img 
                    src={currentUser.avatar} 
                    alt="Profile" 
                    className="w-6 h-6 rounded-full object-cover border border-gray-100 group-hover:border-primary transition-all shadow-xs" 
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <User className="w-6 h-6 text-gray-700 group-hover:text-primary" />
                )}
                <span className="text-[10px] text-gray-500 font-medium">{t.profile}</span>
              </Link>
              <Link to="/favorites" className="hidden md:flex flex-col items-center cursor-pointer group">
                <Heart className="w-6 h-6 text-gray-700 group-hover:text-primary" />
                <span className="text-[10px] text-gray-500 font-medium">{t.favorites}</span>
              </Link>
              <Link to="/profile?tab=orders" className="flex flex-col items-center cursor-pointer group">
                <div className="relative">
                  <Truck className="w-6 h-6 text-gray-700 group-hover:text-primary transition-colors" />
                </div>
                <span className="text-[10px] text-gray-500 font-medium font-sans">{t.track_orders}</span>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile Search - Only on mobile */}
      <div className="px-4 pb-4 md:hidden text-left" dir="ltr">
        <form onSubmit={handleSearch} className="flex items-center overflow-hidden border border-gray-300 rounded-lg">
          <input 
            type="text" 
            placeholder={t.search_placeholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-2 outline-none text-sm"
          />
          <button type="submit" className="bg-primary px-4 py-2 text-white">
            <Search className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/60 z-50 backdrop-blur-xs md:hidden"
            />
            {/* Drawer Body */}
            <motion.div
              initial={{ x: isRTL ? '100%' : '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: isRTL ? '100%' : '-100%' }}
              transition={{ type: 'spring', damping: 22, stiffness: 220 }}
              className={`fixed top-0 bottom-0 ${isRTL ? 'right-0 border-l' : 'left-0 border-r'} w-[290px] bg-white z-50 shadow-2xl flex flex-col md:hidden p-5 border-gray-100 font-sans`}
              dir={isRTL ? 'rtl' : 'ltr'}
            >
              <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                <span className="text-xl font-black text-primary flex items-center">
                  HAWTA<span className="text-secondary ml-1.5 mr-1.5">MAROC</span>
                </span>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Links inside Drawer */}
              <div className="flex flex-col gap-1.5 mt-5 overflow-y-auto flex-grow">
                {/* Guest welcome or User Profile summary */}
                <div className="p-3 bg-gray-50 rounded-xl mb-3">
                  <p className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-1">
                    {language === 'English' ? 'Account' : language === 'Français' ? 'Compte' : 'الحساب'}
                  </p>
                  {isLoggedIn && currentUser ? (
                    <div>
                      <p className="font-bold text-sm text-gray-800">{currentUser.name}</p>
                      <p className="text-xs text-gray-500 truncate">{currentUser.email}</p>
                      <div className="mt-2">
                        <span className={`inline-block text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${
                          userRole === 'admin' 
                            ? 'bg-red-50 text-red-600 border-red-200' 
                            : userRole === 'user'
                            ? 'bg-indigo-50 text-indigo-600 border-indigo-200'
                            : 'bg-emerald-50 text-emerald-600 border-emerald-200'
                        }`}>
                          {userRole === 'admin' ? (language === 'English' ? 'Admin' : language === 'Français' ? 'Admin' : 'مشرف') : userRole === 'user' ? (language === 'English' ? 'Seller' : 'Vendeur') : (language === 'English' ? 'Client' : 'Acheteur')}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p className="font-bold text-sm text-gray-800">{t.welcome_guest}</p>
                      <div className="flex gap-2.5 mt-2.5">
                        <Link
                          to="/signin"
                          onClick={() => setIsMenuOpen(false)}
                          className="flex-1 text-center py-1.5 bg-primary text-white rounded-lg font-bold text-xs hover:bg-primary-dark transition-colors"
                        >
                          {t.login}
                        </Link>
                        <Link
                          to="/signin"
                          onClick={() => setIsMenuOpen(false)}
                          className="flex-1 text-center py-1.5 border border-primary text-primary rounded-lg font-bold text-xs hover:bg-orange-50 transition-colors"
                        >
                          {t.register}
                        </Link>
                      </div>
                    </div>
                  )}
                </div>

                <Link
                  to="/"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-orange-50 hover:text-primary transition-colors font-semibold"
                >
                  🏠 {language === 'English' ? 'Home' : language === 'Français' ? 'Accueil' : 'الرئيسية'}
                </Link>

                <Link
                  to="/deals"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-orange-50 hover:text-primary transition-colors font-semibold"
                >
                  🔥 {t.browse_deals}
                </Link>

                <Link
                  to="/partner"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-orange-50 hover:text-primary transition-colors font-semibold"
                >
                  💼 {t.partner_center}
                </Link>

                {isLoggedIn && userRole === 'admin' && (
                  <Link
                    to="/admin"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-600 bg-red-50 hover:bg-red-100 transition-colors font-bold"
                  >
                    🛡️ {language === 'English' ? 'Admin Panel' : language === 'Français' ? 'Panel Admin' : 'لوحة التحكم'}
                  </Link>
                )}

                {isLoggedIn && (
                  <>
                    <Link
                      to="/profile"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-orange-50 hover:text-primary transition-colors font-semibold"
                    >
                      👤 {t.profile}
                    </Link>
                    <Link
                      to="/favorites"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-orange-50 hover:text-primary transition-colors font-semibold"
                    >
                      ❤️ {t.favorites}
                    </Link>
                    <Link
                      to="/profile?tab=orders"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-orange-50 hover:text-primary transition-colors font-semibold"
                    >
                      🚚 {t.track_orders}
                    </Link>
                  </>
                )}

                <Link
                  to="/compare"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-orange-50 hover:text-primary transition-colors font-semibold"
                >
                  <span className="flex items-center gap-3">🛒 {t.compare}</span>
                  {compareList.length > 0 && (
                    <span className="bg-primary text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                      {compareList.length}
                    </span>
                  )}
                </Link>

                {/* Language Picker in Drawer */}
                <div className="pt-2 border-t border-gray-100 mt-2">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3 mb-2">
                    {language === 'English' ? 'Choose Language' : language === 'Français' ? 'Choisir la langue' : 'اختر اللغة'}
                  </p>
                  <div className="grid grid-cols-3 gap-1.5 px-1.5">
                    {[
                      { code: 'English', flag: '🇬🇧' },
                      { code: 'Français', flag: '🇫🇷' },
                      { code: 'العربية', flag: '🇲🇦' }
                    ].map((l) => (
                      <button
                        key={l.code}
                        onClick={() => {
                          setLanguage(l.code as any);
                          addNotification(t.categories_initialized, 'info');
                        }}
                        className={`py-1.5 rounded-lg text-xs font-semibold flex flex-col items-center justify-center border transition-all ${
                          language === l.code 
                            ? 'bg-orange-50 text-primary border-primary font-bold' 
                            : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <span className="text-base mb-0.5">{l.flag}</span>
                        <span>{l.code}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sign out button at the very bottom */}
              {isLoggedIn && (
                <div className="pt-4 border-t border-gray-100">
                  <button
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                      addNotification(language === 'English' ? 'Logged out successfully' : 'Déconnexion réussie', 'success');
                    }}
                    className="w-full text-center py-2.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl font-bold text-xs transition-colors"
                  >
                    🚪 {t.sign_out}
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};
