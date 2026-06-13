
import React from 'react';
import { useAppContext } from '../context/AppContext';
import { motion } from 'motion/react';
import { X, ShoppingCart, Check, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation, getTranslatedCategory } from '../translations';
import { useNavigate } from 'react-router-dom';

export const Comparison: React.FC = () => {
  const { compareList, removeFromCompare, language } = useAppContext();
  const navigate = useNavigate();
  const t = useTranslation(language);
  const isRTL = language === 'العربية';
  const currency = language === 'العربية' ? 'د.م.' : 'DH';

  if (compareList.length === 0) {
    return (
      <div className={`max-w-7xl mx-auto px-4 py-20 text-center ${isRTL ? 'font-sans' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShoppingCart className="w-10 h-10 text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold mb-4">{t.no_deals_to_compare}</h2>
        <p className="text-gray-500 mb-8">{t.compare_desc}</p>
        <Link to="/deals" className="bg-primary text-white px-8 py-3 rounded-full font-bold hover:bg-primary-dark transition-colors inline-block">
          {t.browse_deals}
        </Link>
      </div>
    );
  }

  return (
    <div className={`max-w-7xl mx-auto px-4 py-12 ${isRTL ? 'font-sans' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <h1 className="text-3xl font-bold mb-8">{t.compare_promotions}</h1>
      
      <div className="overflow-x-auto alibaba-shadow rounded-xl bg-white border border-gray-100">
        <table className={`w-full ${isRTL ? 'text-right' : 'text-left'} border-collapse`}>
          <thead>
            <tr>
              <th className={`p-6 bg-gray-50 border-b border-gray-200 min-w-[200px] ${isRTL ? 'border-l' : 'border-r'}`}>{t.features}</th>
              {compareList.map((promo) => (
                <th key={promo.id} className={`p-6 bg-white border-b border-gray-200 min-w-[250px] relative ${isRTL ? 'border-l last:border-l-0' : 'border-r last:border-r-0'}`}>
                  <button 
                    onClick={() => removeFromCompare(promo.id)}
                    className={`absolute top-2 ${isRTL ? 'left-2' : 'right-2'} p-1 text-gray-400 hover:text-red-500`}
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <img src={promo.imageUrl} alt="" className="w-full h-40 object-cover rounded-lg mb-4" />
                  <h3 className="text-sm font-bold line-clamp-2 mb-2">{promo.title}</h3>
                  <div className={`text-xl font-extrabold text-red-600 ${isRTL ? 'flex flex-row-reverse justify-end gap-1' : ''}`}>
                    {isRTL ? '' : currency}{promo.discountedPrice.toLocaleString()}{isRTL ? ` ${currency}` : ''}
                  </div>
                </th>
              ))}
              {/* Fill remaining slots if < 4 */}
              {[...Array(Math.max(0, 4 - compareList.length))].map((_, i) => (
                <th key={`empty-${i}`} className={`p-6 bg-gray-50/50 border-b border-gray-200 min-w-[250px] text-center ${isRTL ? 'border-l last:border-l-0' : 'border-r last:border-r-0'}`}>
                   <div className="border-2 border-dashed border-gray-200 rounded-lg h-40 flex items-center justify-center">
                     <Link to="/deals" className="text-primary text-sm font-bold hover:underline">+ {t.add}</Link>
                   </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-sm">
            <tr>
              <td className={`p-6 font-bold bg-gray-50 border-b border-gray-200 ${isRTL ? 'border-l' : 'border-r'}`}>{t.category}</td>
              {compareList.map(p => <td key={p.id} className={`p-6 border-b border-gray-200 ${isRTL ? 'border-l last:border-l-0' : 'border-r last:border-r-0'}`}>{getTranslatedCategory(p.category, language)}</td>)}
              {[...Array(Math.max(0, 4 - compareList.length))].map((_, i) => <td key={i} className={`p-6 border-b border-gray-200 bg-gray-50/20 ${isRTL ? 'border-l last:border-l-0' : 'border-r last:border-r-0'}`}></td>)}
            </tr>
            <tr>
              <td className={`p-6 font-bold bg-gray-50 border-b border-gray-200 ${isRTL ? 'border-l' : 'border-r'}`}>{t.partner}</td>
              {compareList.map(p => (
                <td key={p.id} className={`p-6 border-b border-gray-200 ${isRTL ? 'border-l last:border-l-0' : 'border-r last:border-r-0'}`}>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{p.partnerName}</span>
                    <Check className="w-3 h-3 text-green-500" />
                  </div>
                </td>
              ))}
              {[...Array(Math.max(0, 4 - compareList.length))].map((_, i) => <td key={i} className={`p-6 border-b border-gray-200 bg-gray-50/20 ${isRTL ? 'border-l last:border-l-0' : 'border-r last:border-r-0'}`}></td>)}
            </tr>
            <tr>
              <td className={`p-6 font-bold bg-gray-50 border-b border-gray-200 ${isRTL ? 'border-l' : 'border-r'}`}>{t.rating}</td>
              {compareList.map(p => (
                <td key={p.id} className={`p-6 border-b border-gray-200 ${isRTL ? 'border-l last:border-l-0' : 'border-r last:border-r-0'}`}>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 fill-orange-400 text-orange-400" />
                    <Star className="w-3 h-3 fill-orange-400 text-orange-400" />
                    <Star className="w-3 h-3 fill-orange-400 text-orange-400" />
                    <Star className="w-3 h-3 fill-orange-400 text-orange-400" />
                    <span className={`text-xs text-gray-500 ${isRTL ? 'mr-1' : 'ml-1'}`}>({p.views})</span>
                  </div>
                </td>
              ))}
              {[...Array(Math.max(0, 4 - compareList.length))].map((_, i) => <td key={i} className={`p-6 border-b border-gray-200 bg-gray-50/20 ${isRTL ? 'border-l last:border-l-0' : 'border-r last:border-r-0'}`}></td>)}
            </tr>
            <tr>
              <td className={`p-6 font-bold bg-gray-50 border-b border-gray-200 ${isRTL ? 'border-l' : 'border-r'}`}>{t.discount}</td>
              {compareList.map(p => <td key={p.id} className={`p-6 border-b border-gray-200 text-red-600 font-bold ${isRTL ? 'border-l last:border-l-0' : 'border-r last:border-r-0'}`}>{p.discountPercentage}% OFF</td>)}
              {[...Array(Math.max(0, 4 - compareList.length))].map((_, i) => <td key={i} className={`p-6 border-b border-gray-200 bg-gray-50/20 ${isRTL ? 'border-l last:border-l-0' : 'border-r last:border-r-0'}`}></td>)}
            </tr>
            <tr>
              <td className={`p-6 font-bold bg-gray-50 ${isRTL ? 'border-l' : 'border-r'}`}>{t.actions}</td>
              {compareList.map(p => (
                <td key={p.id} className={`p-6 ${isRTL ? 'border-l last:border-l-0' : 'border-r last:border-r-0'}`}>
                  <button 
                    onClick={() => navigate(`/deals?category=${encodeURIComponent(p.category)}`)}
                    className="w-full bg-primary text-white py-2 rounded font-bold hover:bg-primary-dark shadow-sm transition-all"
                  >
                    {t.view_deal}
                  </button>
                </td>
              ))}
              {[...Array(Math.max(0, 4 - compareList.length))].map((_, i) => <td key={i} className={`p-6 bg-gray-50/20 ${isRTL ? 'border-l last:border-l-0' : 'border-r last:border-r-0'}`}></td>)}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
