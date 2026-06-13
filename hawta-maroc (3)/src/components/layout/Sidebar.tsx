
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShoppingBag, 
  ChefHat, 
  Laptop, 
  Sparkles, 
  Home, 
  Trophy, 
  Plane,
  ChevronRight
} from 'lucide-react';

import { useAppContext } from '../../context/AppContext';
import { useTranslation, getTranslatedCategory } from '../../translations';

const CATEGORY_ICONS: Record<string, any> = {
  'Mode': ShoppingBag,
  'Restauration': ChefHat,
  'High-Tech': Laptop,
  'Beauté': Sparkles,
  'Maison': Home,
  'Sport': Trophy,
  'Voyage': Plane,
  'All': ChevronRight
};

export const Sidebar: React.FC = () => {
  const { language, categories } = useAppContext();
  const t = useTranslation(language);
  const isRTL = language === 'العربية';

  return (
    <div className={`bg-white rounded-lg alibaba-shadow p-4 w-full h-[450px] ${isRTL ? 'text-right' : 'text-left'}`}>
      <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
        {t.categories}
      </h3>
      <ul className="space-y-1">
        {categories.filter(c => c !== 'All').map((category) => {
          const Icon = CATEGORY_ICONS[category] || ChevronRight;
          return (
            <Link 
              key={category}
              to={`/deals?category=${encodeURIComponent(category)}`}
              className="flex items-center justify-between p-2 rounded-md hover:bg-orange-50 hover:text-primary cursor-pointer border border-transparent transition-colors group"
            >
              <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Icon className="w-5 h-5 text-gray-500 group-hover:text-primary" />
                <span className="text-sm font-medium">{getTranslatedCategory(category, language)}</span>
              </div>
              <ChevronRight className={`w-4 h-4 text-gray-300 group-hover:text-primary ${isRTL ? 'rotate-180' : ''}`} />
            </Link>
          );
        })}
      </ul>
      <div className="mt-6 pt-4 border-t border-gray-100">
        <Link to="/deals" className="w-full text-sm font-semibold text-primary hover:underline flex items-center justify-center gap-1">
          {t.view_more}
        </Link>
      </div>
    </div>
  );
};
