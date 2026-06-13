
import React from 'react';
import { Sidebar } from '../components/layout/Sidebar';
import { PromotionCard } from '../components/PromotionCard';
import { motion } from 'motion/react';
import { ChevronRight, ArrowRight, Zap, TrendingUp, Flame, Laptop, Home as HomeIcon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { useTranslation } from '../translations';

export const Home: React.FC = () => {
  const { promotions, addNotification, language, userRole, currentUser, isLoggedIn } = useAppContext();
  const navigate = useNavigate();
  const t = useTranslation(language);
  const isRTL = language === 'العربية';
  const currency = language === 'العربية' ? 'د.م.' : 'DH';

  const eligiblePromotions = promotions.filter(p => {
    if (p.status === 'pending') {
      const isOwner = currentUser && p.partnerName === currentUser.name;
      const isAdmin = userRole === 'admin';
      if (!isOwner && !isAdmin) return false;
    }
    return true;
  });

  return (
    <div className={`max-w-7xl mx-auto px-4 py-6 ${isRTL ? 'font-sans' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Hero Section - Alibaba Style */}
      <div className="flex flex-col md:flex-row gap-6 mb-12">
        {/* Left Categories Sidebar - In RTL this should be logic handled but currently its static left */}
        <div className={`hidden md:block w-64 flex-shrink-0 ${isRTL ? 'order-last' : ''}`}>
          <Sidebar />
        </div>

        {/* Center Banner Slider (Placeholder) */}
        <div className="flex-grow">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative h-[450px] rounded-lg overflow-hidden alibaba-shadow bg-gradient-to-r from-orange-400 to-orange-600 group"
          >
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
            <div className={`relative z-10 p-12 h-full flex flex-col justify-center max-w-lg text-white ${isRTL ? 'mr-0' : ''}`}>
              <span className={`text-xl font-bold bg-white/20 backdrop-blur-sm px-4 py-1 rounded-full mb-6 ${isRTL ? 'self-start ml-auto' : 'self-start'}`}>
                {t.premium_selection}
              </span>
              <h1 className="text-5xl font-extrabold mb-6 leading-tight">
                {t.quality_products}
              </h1>
              <p className="text-white/90 text-lg mb-8 font-light italic">
                {t.hero_desc}
              </p>
              <Link to="/deals" className={`bg-white text-primary font-bold px-8 py-3 rounded-full hover:shadow-xl transition-all transform hover:-translate-y-1 flex items-center gap-2 self-start ${isRTL ? 'flex-row-reverse' : ''}`}>
                {t.find_hawta} {isRTL ? <ArrowRight className="w-5 h-5 rotate-180" /> : <ArrowRight className="w-5 h-5" />}
              </Link>
            </div>
            
            {/* Abstract visual elements */}
            <div className={`absolute top-1/2 ${isRTL ? 'left-20' : 'right-20'} transform -translate-y-1/2 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse`} />
          </motion.div>
        </div>

        {/* Right Info Section */}
        <div className={`hidden lg:flex w-64 flex-shrink-0 flex-col gap-4 ${isRTL ? 'order-first' : ''}`}>
          <div className="bg-white p-4 rounded-lg alibaba-shadow flex-grow">
            <h4 className="font-bold text-sm mb-4">
              {isLoggedIn && currentUser ? `${language === 'English' ? 'Welcome back,' : 'Bienvenue,'} ${currentUser.name}` : t.welcome_guest}
            </h4>
            {!isLoggedIn && (
              <div className="space-y-3">
                <Link 
                  to="/signin"
                  className="block text-center w-full py-2 bg-primary text-white rounded font-bold text-sm hover:bg-primary-dark transition-colors"
                >
                  {t.register}
                </Link>
                <Link 
                  to="/signin"
                  className="block text-center w-full py-2 border border-primary text-primary rounded font-bold text-sm hover:bg-orange-50 transition-colors"
                >
                  {t.login}
                </Link>
              </div>
            )}
            <div className="mt-8 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-500 mb-2">{t.request_quote_desc}</p>
              <button 
                onClick={() => addNotification(language === 'English' ? 'Publishing a need will be available soon.' : language === 'Français' ? 'Publier un besoin sera bientôt disponible.' : 'نشر الحاجة سيكون متاحاً قريباً.')}
                className="w-full py-2 border border-gray-300 text-gray-700 rounded text-xs font-semibold hover:bg-gray-50 transition-colors"
              >
                {t.request_quote}
              </button>
            </div>
          </div>
          <div className="bg-indigo-900 p-4 rounded-lg text-white">
            <h4 className="font-bold text-xs uppercase tracking-wider mb-2 opacity-80">{t.local_market}</h4>
            <p className="text-sm font-medium">{t.trends_in}</p>
          </div>
        </div>
      </div>

      {/* Flash Deals / Top Promotions Section */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <Zap className="w-6 h-6 text-red-600 fill-red-600" />
            </div>
            <h2 className="text-2xl font-bold">{t.flash_deals}</h2>
            <div className="flex items-center gap-2 ml-4 font-mono" dir="ltr">
              <span className="bg-black text-white px-2 py-1 rounded text-sm font-bold">02</span>
              <span>:</span>
              <span className="bg-black text-white px-2 py-1 rounded text-sm font-bold">45</span>
              <span>:</span>
              <span className="bg-black text-white px-2 py-1 rounded text-sm font-bold">12</span>
            </div>
          </div>
          <Link to="/deals" className="text-primary font-bold flex items-center gap-1 hover:underline">
            {t.view_more} {isRTL ? <ChevronRight className="w-4 h-4 rotate-180" /> : <ChevronRight className="w-4 h-4" />}
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {eligiblePromotions.slice(0, 12).map((promo, idx) => (
            <PromotionCard key={`${promo.id}-${idx}`} promotion={promo} />
          ))}
        </div>
      </section>

      {/* Verified Partners / Trends */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div className="bg-white p-6 rounded-xl alibaba-shadow overflow-hidden relative">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-6 h-6 text-blue-600" />
            <h3 className="text-xl font-bold">{t.new_arrivals}</h3>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {eligiblePromotions.slice(2, 5).map(p => (
              <div 
                key={p.id} 
                className="group cursor-pointer"
                onClick={() => navigate(`/deals?category=${encodeURIComponent(p.category)}`)}
              >
                <div className="aspect-square bg-gray-100 rounded-lg mb-2 overflow-hidden">
                  <img src={p.imageUrl} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                </div>
                <p className={`text-xs font-bold text-center text-primary ${isRTL ? 'flex flex-row-reverse justify-center gap-1' : ''}`}>
                  {isRTL ? '' : currency}{p.discountedPrice.toLocaleString()}{isRTL ? ` ${currency}` : ''}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl alibaba-shadow overflow-hidden relative">
          <div className="flex items-center gap-2 mb-6">
            <Flame className="w-6 h-6 text-orange-600" />
            <h3 className="text-xl font-bold">{t.hot_categories}</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div 
              onClick={() => navigate('/deals?category=Electronics')}
              className="bg-orange-50 p-4 rounded-lg flex items-center justify-between cursor-pointer hover:bg-orange-100 transition-colors"
            >
              <div className={`${isRTL ? 'text-right' : 'text-left'}`}>
                <p className="font-bold text-sm">{language === 'English' ? 'Electronics' : language === 'Français' ? 'Électronique' : 'الإلكترونيات'}</p>
                <p className="text-[10px] text-gray-500">{language === 'English' ? '10k+ active promos' : language === 'Français' ? '10k+ offres actives' : 'أكثر من 10 آلاف عرض نشط'}</p>
              </div>
              <Laptop className="w-8 h-8 text-orange-200" />
            </div>
            <div 
              onClick={() => navigate('/deals?category=Home')}
              className="bg-blue-50 p-4 rounded-lg flex items-center justify-between cursor-pointer hover:bg-blue-100 transition-colors"
            >
              <div className={`${isRTL ? 'text-right' : 'text-left'}`}>
                <p className="font-bold text-sm">{language === 'English' ? 'Home' : language === 'Français' ? 'Maison' : 'المنزل'}</p>
                <p className="text-[10px] text-gray-500">{language === 'English' ? '5k+ active promos' : language === 'Français' ? '5k+ offres actives' : 'أكثر من 5 آلاف عرض نشط'}</p>
              </div>
              <HomeIcon className="w-8 h-8 text-blue-200" />
            </div>
          </div>
        </div>
      </section>

      {/* Sourcing by Category (Example) */}
      <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            {t.for_you}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
            {/* Even more cards to simulate the dense Alibaba look */}
            {[...eligiblePromotions, ...eligiblePromotions, ...eligiblePromotions].slice(0, 12).map((p, i) => (
               <PromotionCard key={`${p.id}-${i}`} promotion={p} />
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link 
              to="/deals" 
              className="inline-flex items-center gap-2 px-8 py-3 bg-white border border-gray-200 rounded-full font-bold text-gray-700 hover:border-primary hover:text-primary transition-all alibaba-shadow"
            >
              {language === 'English' ? 'Discover More' : language === 'Français' ? 'Découvrir Plus' : 'اكتشف المزيد'}
              {isRTL ? <ChevronRight className="w-4 h-4 rotate-180" /> : <ChevronRight className="w-4 h-4" />}
            </Link>
          </div>
      </section>
    </div>
  );
};
