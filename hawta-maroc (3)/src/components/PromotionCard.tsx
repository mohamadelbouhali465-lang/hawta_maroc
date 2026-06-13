
import React from 'react';
import { Promotion } from '../types';
import { motion } from 'motion/react';
import { Star, CheckCircle, ShoppingCart, Heart } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { useTranslation, getTranslatedCategory } from '../translations';

interface PromotionCardProps {
  promotion: Promotion;
}

export const PromotionCard: React.FC<PromotionCardProps> = ({ promotion }) => {
  const { language, setPurchasingProduct, favorites = [], toggleFavorite } = useAppContext();
  const navigate = useNavigate();
  const t = useTranslation(language);
  const isRTL = language === 'العربية';
  const isFavorite = favorites.includes(promotion.id);
  
  const handleCardClick = () => {
    navigate(`/deals?category=${encodeURIComponent(promotion.category)}`);
  };

  const currency = language === 'العربية' ? 'د.م.' : 'DH';

  return (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      onClick={handleCardClick}
      className={`bg-white rounded-lg overflow-hidden alibaba-shadow alibaba-card-hover border border-gray-100 flex flex-col h-full cursor-pointer group ${isRTL ? 'font-sans' : ''}`}
    >
      {/* Image Section */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <img 
          src={promotion.imageUrl} 
          alt={promotion.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
          referrerPolicy="no-referrer"
        />
        <div className={`absolute top-2 ${isRTL ? 'right-2' : 'left-2'} bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded`}>
          -{promotion.discountPercentage}% {t.off}
        </div>
        
        {/* Floating Heart Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(promotion.id);
          }}
          className={`absolute top-2 ${isRTL ? 'left-2' : 'right-2'} p-1.5 rounded-full bg-white/95 text-gray-500 hover:text-red-500 shadow-md transition-all duration-300 transform active:scale-95`}
          title={isFavorite ? t.removed_from_favorites : t.added_to_favorites}
        >
          <Heart className={`w-3.5 h-3.5 transition-colors ${isFavorite ? 'text-red-500 fill-red-500 animate-pulse' : 'text-gray-400 hover:text-red-500'}`} />
        </button>
      </div>

      {/* Content Section */}
      <div className={`p-3 flex-grow flex flex-col ${isRTL ? 'text-right' : 'text-left'}`}>
        <div className="text-[10px] uppercase font-bold text-gray-400 mb-1">{getTranslatedCategory(promotion.category, language)}</div>
        <h3 className="text-sm font-medium text-gray-800 line-clamp-2 mb-2 min-h-[40px]">
          {promotion.title}
        </h3>
        
        <div className="mt-auto">
          <div className={`flex items-center gap-1 mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-3 h-3 ${i < 4 ? 'text-orange-400 fill-orange-400' : 'text-gray-300'}`} />
              ))}
            </div>
            <span className="text-[10px] text-gray-500">({promotion.views})</span>
          </div>

          <div className={`flex items-baseline gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <span className="text-lg font-bold text-red-600">{isRTL ? '' : currency}{promotion.discountedPrice.toLocaleString()}{isRTL ? ` ${currency}` : ''}</span>
            <span className="text-xs text-gray-400 line-through">{isRTL ? '' : currency}{promotion.originalPrice.toLocaleString()}{isRTL ? ` ${currency}` : ''}</span>
          </div>
          
          <div className={`mt-2 pt-2 border-t border-gray-50 flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <span className="text-[10px] text-gray-500 font-medium">{promotion.partnerName}</span>
            {promotion.isVerifiedPartner && (
              <span className={`text-[10px] text-green-600 font-bold flex items-center gap-0.5 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <CheckCircle className="w-3 h-3" /> {t.verified}
              </span>
            )}
          </div>

          {/* Action buttons including Favorites toggle */}
          <div className="mt-3 flex gap-2">
            <button 
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setPurchasingProduct(promotion);
              }}
              className="flex-grow py-2 bg-gradient-to-r from-primary to-orange-600 text-white rounded-lg text-xs font-bold hover:shadow-md transition-all text-center flex items-center justify-center gap-1.5 transform active:scale-95"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>{language === 'English' ? 'Buy Direct' : language === 'Français' ? 'Achat Direct' : 'شراء مباشر'}</span>
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(promotion.id);
              }}
              className={`p-2 rounded-lg border flex items-center justify-center transition-all ${
                isFavorite 
                ? 'bg-red-50 border-red-200 text-red-500 shadow-xs' 
                : 'border-gray-200 hover:border-red-200 text-gray-400 hover:text-red-500 hover:bg-red-50/20'
              }`}
              title={isFavorite ? t.removed_from_favorites : t.added_to_favorites}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
