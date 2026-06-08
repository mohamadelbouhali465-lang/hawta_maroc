
import React from 'react';
import { Search, ShoppingCart, User, Globe, Menu, Heart } from 'lucide-react';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { useTranslation } from '../../translations';

export const Header: React.FC = () => {
  const { isLoggedIn, currentUser, compareList, searchQuery, setSearchQuery, language, setLanguage, addNotification, logActivity } = useAppContext();
  const navigate = useNavigate();
  const t = useTranslation(language);
  const isAdmin = currentUser?.email === 'mohamadelbouhali465@gmail.com';

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
            {isAdmin && <Link to="/partner" className="cursor-pointer hover:text-primary">{t.partner_center}</Link>}
            <span onClick={() => logActivity('support', 'Applet service opened')} className="cursor-pointer hover:text-primary">{t.applet_service}</span>
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
            <span onClick={() => logActivity('support', 'Help center opened')} className="cursor-pointer hover:text-primary">{t.help_center}</span>
            {isLoggedIn ? (
              <button onClick={() => addNotification(`Logged in as ${currentUser?.email}`, 'info')} className="cursor-pointer hover:text-primary font-semibold">
                {currentUser?.name || currentUser?.email}
              </button>
            ) : (
              <Link to="/signin" className="cursor-pointer hover:text-primary font-semibold">{t.join_free}</Link>
            )}
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 flex-shrink-0">
          <Menu className={`w-6 h-6 md:hidden text-gray-700 ${isRTL ? 'ml-2' : ''}`} />
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
            <Link to="/profile" className="hidden lg:flex flex-col items-center cursor-pointer group">
              <User className="w-6 h-6 text-gray-700 group-hover:text-primary" />
              <span className="text-[10px] text-gray-500 font-medium">{t.profile}</span>
            </Link>
          )}
          <Link to="/favorites" className="hidden lg:flex flex-col items-center cursor-pointer group">
            <Heart className="w-6 h-6 text-gray-700 group-hover:text-primary" />
            <span className="text-[10px] text-gray-500 font-medium">{t.favorites}</span>
          </Link>
          <Link to="/compare" className="flex flex-col items-center cursor-pointer group">
            <div className="relative">
              <ShoppingCart className="w-6 h-6 text-gray-700 group-hover:text-primary" />
              {compareList.length > 0 && (
                <div className={`absolute -top-1 ${isRTL ? '-left-1' : '-right-1'} bg-primary text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold`}>
                  {compareList.length}
                </div>
              )}
            </div>
            <span className="text-[10px] text-gray-500 font-medium font-sans">{t.compare}</span>
          </Link>
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
    </header>
  );
};
