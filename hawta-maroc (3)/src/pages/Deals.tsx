
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PromotionCard } from '../components/PromotionCard';
import { Filter, Grid, List as ListIcon, ChevronDown, Search, CheckCircle } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { useTranslation, getTranslatedCategory } from '../translations';
import { Link } from 'react-router-dom';

export const Deals: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category') || 'All';
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [isVerifiedOnly, setIsVerifiedOnly] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [appliedPriceRange, setAppliedPriceRange] = useState({ min: '', max: '' });
  const { searchQuery, promotions, addNotification, language, userRole, currentUser, categories } = useAppContext();
  const t = useTranslation(language);
  const isRTL = language === 'العربية';
  
  useEffect(() => {
    setSelectedCategory(categoryParam);
  }, [categoryParam]);

  const handleCategoryChange = (category: string) => {
    setSearchParams({ category });
    setSelectedCategory(category);
  };
  
  const eligiblePromotions = React.useMemo(() => {
    return promotions.filter(p => {
      // Hide unapproved (pending) posts unless user is admin or the owner
      if (p.status === 'pending') {
        const isOwner = currentUser && p.partnerName === currentUser.name;
        const isAdmin = userRole === 'admin';
        if (!isOwner && !isAdmin) return false;
      }
      return true;
    });
  }, [promotions, currentUser, userRole]);

  const filteredDeals = React.useMemo(() => {
    return eligiblePromotions.filter(p => {
      const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
      const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           p.partnerName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesVerified = !isVerifiedOnly || p.isVerifiedPartner;
      
      let matchesPrice = true;
      if (appliedPriceRange.min) {
        matchesPrice = matchesPrice && p.discountedPrice >= parseInt(appliedPriceRange.min);
      }
      if (appliedPriceRange.max) {
        matchesPrice = matchesPrice && p.discountedPrice <= parseInt(appliedPriceRange.max);
      }

      return matchesCategory && matchesSearch && matchesVerified && matchesPrice;
    });
  }, [eligiblePromotions, selectedCategory, searchQuery, isVerifiedOnly, appliedPriceRange]);

  const handleApplyFilter = () => {
    setAppliedPriceRange(priceRange);
    addNotification(t.filters_applied, 'success');
  };

  const getTranslatedCategoryLocal = (cat: string) => {
    if (cat === 'All') return t.all;
    return getTranslatedCategory(cat, language);
  };

  return (
    <div className={`max-w-7xl mx-auto px-4 py-8 ${isRTL ? 'font-sans' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters Sidebar */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white rounded-lg alibaba-shadow p-6 space-y-8 sticky top-24">
            <div>
              <h3 className="font-bold text-sm uppercase tracking-wider mb-4 flex items-center justify-between">
                {t.categories} <Filter className={`w-4 h-4 ${isRTL ? 'mr-auto' : 'ml-auto'} text-gray-400`} />
              </h3>
              <ul className="space-y-2">
                {categories.map(category => (
                  <li 
                    key={category}
                    onClick={() => handleCategoryChange(category)}
                    className={`text-sm cursor-pointer hover:text-primary transition-colors flex justify-between items-center ${selectedCategory === category ? 'text-primary font-bold' : 'text-gray-600'}`}
                  >
                    {getTranslatedCategoryLocal(category)}
                    <span className={`text-[10px] text-gray-400 font-normal ${isRTL ? 'mr-auto' : 'ml-auto'}`}>
                      ({eligiblePromotions.filter(p => category === 'All' || p.category === category).length})
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-sm uppercase tracking-wider mb-4">{t.price_range}</h3>
              <div className="flex items-center gap-2">
                <input 
                  type="number" 
                  placeholder={t.min} 
                  value={priceRange.min}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                  className="w-full border border-gray-300 rounded px-2 py-1 text-xs outline-none focus:border-primary" 
                />
                <span className="text-gray-400">-</span>
                <input 
                  type="number" 
                  placeholder={t.max} 
                  value={priceRange.max}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                  className="w-full border border-gray-300 rounded px-2 py-1 text-xs outline-none focus:border-primary" 
                />
              </div>
              <button 
                onClick={handleApplyFilter}
                className="w-full mt-3 py-1 bg-primary text-white text-xs font-bold rounded hover:bg-primary-dark transition-all"
              >
                {t.apply}
              </button>
            </div>
          </div>
        </aside>

        {/* Results Content */}
        <main className="flex-grow">
          {/* Breadcrumbs & View Controls */}
          <div className="bg-white p-4 rounded-lg alibaba-shadow mb-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Link to="/" className="hover:text-primary cursor-pointer">Home</Link>
              <ChevronDown className={`w-3 h-3 ${isRTL ? 'rotate-90' : '-rotate-90'}`} />
              <span className="hover:text-primary cursor-pointer">{t.browse_deals}</span>
              {selectedCategory !== 'All' && (
                <>
                  <ChevronDown className={`w-3 h-3 ${isRTL ? 'rotate-90' : '-rotate-90'}`} />
                  <span className="text-gray-900 font-medium">{getTranslatedCategoryLocal(selectedCategory)}</span>
                </>
              )}
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-4 text-xs font-medium">
                <span className="text-gray-400">{t.sort_by}:</span>
                <select className="bg-transparent outline-none cursor-pointer text-gray-700">
                  <option>{t.relevance}</option>
                  <option>{t.price_low_high}</option>
                  <option>{t.price_high_low}</option>
                  <option>{t.newest}</option>
                </select>
              </div>
              <div className="flex items-center border border-gray-200 rounded overflow-hidden">
                <button className="p-1.5 bg-gray-50 text-primary border-r border-gray-200"><Grid className="w-4 h-4" /></button>
                <button className="p-1.5 hover:bg-gray-50 text-gray-400"><ListIcon className="w-4 h-4" /></button>
              </div>
            </div>
          </div>

          {/* Results Summary */}
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-800">
              {selectedCategory === 'All' ? t.special_offers : `${t.offers_cat} ${getTranslatedCategoryLocal(selectedCategory)}`}
              <span className={`text-sm font-normal text-gray-500 ${isRTL ? 'mr-2' : 'ml-2'}`}>({filteredDeals.length} {t.items_found})</span>
            </h1>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">{t.verification}:</span>
              <button 
                onClick={() => {
                  setIsVerifiedOnly(!isVerifiedOnly);
                  const msg = isVerifiedOnly ? t.all_offers : t.verified_only;
                  addNotification(msg, 'info');
                }}
                className={`flex items-center gap-2 text-xs font-bold border px-4 py-1.5 rounded-full transition-all group ${
                  isVerifiedOnly 
                  ? 'bg-orange-600 text-white border-orange-600 shadow-lg scale-105' 
                  : 'text-gray-700 border-gray-300 hover:border-primary hover:text-primary bg-white'
                }`}
              >
                <CheckCircle className={`w-3.5 h-3.5 ${isVerifiedOnly ? 'text-white' : 'text-green-500'}`} />
                {t.verified_only}
                {isVerifiedOnly && <span className={`text-[10px] opacity-80 ${isRTL ? 'mr-1' : 'ml-1'}`}>({t.active})</span>}
              </button>
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredDeals.map((promo) => (
              <PromotionCard key={promo.id} promotion={promo} />
            ))}
            {/* Pad with more mock data if empty */}
            {filteredDeals.length === 0 && (
                <div className="col-span-full py-20 text-center text-gray-500">
                    <Search className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    <p>{t.no_results}</p>
                </div>
            )}
          </div>
          
          {/* Pagination */}
          <div className="mt-12 flex justify-center items-center gap-2">
             <button 
               onClick={() => addNotification(t.previous)}
               className="px-4 py-2 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50"
             >
               {t.previous}
             </button>
             <button className="w-10 h-10 bg-primary text-white rounded font-bold text-sm">1</button>
             <button onClick={() => addNotification(`${t.next} page...`)} className="w-10 h-10 border border-gray-300 rounded font-bold text-sm hover:bg-gray-50">2</button>
             <button onClick={() => addNotification(`${t.next} page...`)} className="w-10 h-10 border border-gray-300 rounded font-bold text-sm hover:bg-gray-50">3</button>
             <span className="px-2 text-gray-400">...</span>
             <button 
               onClick={() => addNotification(t.next)}
               className="px-4 py-2 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-100"
             >
               {t.next}
             </button>
          </div>
        </main>
      </div>
    </div>
  );
};
