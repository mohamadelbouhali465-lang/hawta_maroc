
import React from 'react';
import { Promotion } from '../types';
import { motion } from 'motion/react';
import { Heart, Star, Scale, CheckCircle } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { useTranslation, getTranslatedCategory } from '../translations';

interface PromotionCardProps {
  promotion: Promotion;
}

export const PromotionCard: React.FC<PromotionCardProps> = ({ promotion }) => {
  const { compareList, addToCompare, removeFromCompare, favorites, toggleFavorite, language } = useAppContext();
  const navigate = useNavigate();
  const t = useTranslation(language);
  const isRTL = language === 'العربية';
  
  const isComparing = compareList.some(p => p.id === promotion.id);
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
        />
        <div className={`absolute top-2 ${isRTL ? 'right-2' : 'left-2'} bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded`}>
          -{promotion.discountPercentage}% {t.off}
        </div>
        
        {/* Actions Overlay */}
        <div className={`absolute top-2 ${isRTL ? 'left-2' : 'right-2'} flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity`}>
          <button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleFavorite(promotion.id);
            }}
            className={`p-1.5 bg-white shadow-md rounded-full transition-colors ${isFavorite ? 'text-red-500' : 'text-gray-500 hover:text-red-500'}`}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
          <button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              isComparing ? removeFromCompare(promotion.id) : addToCompare(promotion);
            }}
            className={`p-1.5 bg-white shadow-md rounded-full transition-colors ${isComparing ? 'text-primary' : 'text-gray-500 hover:text-primary'}`}
          >
            <Scale className={`w-4 h-4 ${isComparing ? 'fill-current' : ''}`} />
          </button>
        </div>
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

          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              isComparing ? removeFromCompare(promotion.id) : addToCompare(promotion);
            }}
            className={`mt-3 w-full flex items-center justify-center gap-2 rounded-md border px-3 py-2 text-xs font-bold transition-colors ${
              isComparing
                ? 'border-primary bg-orange-50 text-primary'
                : 'border-gray-200 bg-white text-gray-700 hover:border-primary hover:text-primary'
            }`}
          >
            <Scale className="w-4 h-4" />
            {isComparing ? 'In Compare' : 'Add to Compare'}
          </button>
          
          <div className={`mt-2 pt-2 border-t border-gray-50 flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <span className="text-[10px] text-gray-500 font-medium">{promotion.partnerName}</span>
            {promotion.isVerifiedPartner && (
              <span className={`text-[10px] text-green-600 font-bold flex items-center gap-0.5 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <CheckCircle className="w-3 h-3" /> {t.verified}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
