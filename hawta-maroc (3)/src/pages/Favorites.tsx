import React from 'react';
import { useAppContext } from '../context/AppContext';
import { PromotionCard } from '../components/PromotionCard';
import { Heart, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../translations';

export const Favorites: React.FC = () => {
  const { favorites, promotions, language } = useAppContext();
  const t = useTranslation(language);
  const isRTL = language === 'العربية';
  
  const favoritePromotions = promotions.filter(p => favorites.includes(p.id));

  return (
    <div className={`max-w-7xl mx-auto px-4 py-12 ${isRTL ? 'font-sans' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">{t.my_favorites}</h1>
          <p className="text-gray-500">{t.favorites_desc}</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-lg border border-gray-100 alibaba-shadow text-sm font-medium">
          <span className="text-primary font-bold">{favoritePromotions.length}</span> {t.items_found}
        </div>
      </div>

      {favoritePromotions.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {favoritePromotions.map((promo) => (
            <PromotionCard key={promo.id} promotion={promo} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl alibaba-shadow p-16 text-center border border-gray-50">
          <div className="bg-red-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="w-10 h-10 text-red-300" />
          </div>
          <h2 className="text-2xl font-bold mb-4 text-gray-800">{t.no_favorites}</h2>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">
            {t.favorites_empty_desc}
          </p>
          <Link 
            to="/deals" 
            className="inline-flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-full font-bold hover:bg-primary-dark transition-all transform hover:-translate-y-1 shadow-lg shadow-orange-100"
          >
            {t.discover_deals} <ArrowRight className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
          </Link>
        </div>
      )}

      {/* Recommended Section if empty or few favorites */}
      {favoritePromotions.length < 4 && (
        <div className="mt-20">
          <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-primary rounded-full"></span>
            {t.recommended_for_you}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {promotions.slice(0, 6).map((promo) => (
              <PromotionCard key={`rec-${promo.id}`} promotion={promo} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
