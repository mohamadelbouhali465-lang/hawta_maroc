import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppContext } from '../context/AppContext';
import { X, CreditCard, ShoppingBag, Truck, Check, HelpCircle, AlertCircle } from 'lucide-react';
import { useTranslation } from '../translations';

const MOROCCAN_CITIES = [
  'Casablanca', 'Rabat', 'Marrakech', 'Tangier', 'Fès', 'Agadir', 'Meknès', 
  'Oujda', 'Kenitra', 'Tetouan', 'Safi', 'Temara', 'Laâyoune', 'Nador', 'Mohammedia'
];

export const CheckoutModal: React.FC = () => {
  const { purchasingProduct, setPurchasingProduct, addNotification, language, addOrder } = useAppContext();
  const t = useTranslation(language);
  const isRTL = language === 'العربية';
  const currency = language === 'العربية' ? 'د.م.' : 'DH';

  // State
  const [quantity, setQuantity] = useState(1);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [selectedCity, setSelectedCity] = useState('Casablanca');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'card' | 'transfer'>('cod');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!purchasingProduct) return null;

  const unitPrice = purchasingProduct.discountedPrice;
  const bulkDiscountPercent = quantity >= 5 ? 5 : 0; // 5% discount for 5 or more units
  const baseTotal = unitPrice * quantity;
  const discountAmount = Math.round(baseTotal * (bulkDiscountPercent / 100));
  const shippingCost = baseTotal > 1500 ? 0 : 35; // Free shipping on orders over 1500 DH
  const finalTotal = baseTotal - discountAmount + shippingCost;

  const handleConfirmOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !address) {
      addNotification(
        language === 'English' ? 'Please fill out all shipping fields!' : 'Veuillez remplir les informations de livraison!', 
        'error'
      );
      return;
    }

    setIsSubmitting(true);

    // Simulate ordering latency
    setTimeout(() => {
      const orderId = `HAWTA-${Math.floor(100000 + Math.random() * 900000)}`;
      addOrder({
        id: orderId,
        promotionId: purchasingProduct.id,
        productTitle: purchasingProduct.title,
        productImage: purchasingProduct.imageUrl,
        price: unitPrice,
        quantity: quantity,
        total: finalTotal,
        date: new Date().toISOString().split('T')[0],
        status: 'placed',
        partnerName: purchasingProduct.partnerName,
        city: selectedCity,
        address: address,
        phone: phone
      });
      
      const successMsg = language === 'English' 
        ? `Order ${orderId} placed successfully! Check 'Track My Order' to track progress.` 
        : language === 'Français' 
        ? `Commande ${orderId} confirmée ! Utilisez la section 'Suivre Commande' pour suivre sa livraison.` 
        : `تم تسجيل طلبك رقم ${orderId} بنجاح! انتقل إلى صفحة تتبع الطلبات لمتابعة الشحن.`;
      
      addNotification(successMsg, 'success');
      setIsSubmitting(false);
      setPurchasingProduct(null);
      
      // Reset state
      setQuantity(1);
      setFullName('');
      setPhone('');
      setAddress('');
      setPaymentMethod('cod');
    }, 1200);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-white rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl border border-gray-100 grid grid-cols-1 md:grid-cols-12 max-h-[90vh] overflow-y-auto"
        >
          {/* Header Bar */}
          <div className="col-span-12 bg-primary p-6 text-white flex justify-between items-center sticky top-0 z-50">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-6 h-6" />
              <div>
                <h3 className="text-lg font-bold">
                  {language === 'English' ? 'Secure Checkout / Commander' : language === 'Français' ? 'Paiement Sécurisé / Commander' : 'الدفع الآمن / إتمام الطلب'}
                </h3>
                <p className="text-orange-100 text-xs">
                  {language === 'English' ? 'Direct wholesale purchase with supplier guarantee' : language === 'Français' ? 'Achat grossiste direct avec garantie' : 'شراء مباشر من المورد مع ضمان هـوتة'}
                </p>
              </div>
            </div>
            <button 
              onClick={() => setPurchasingProduct(null)}
              className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-all text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Left Form: Delivery & Payment Details */}
          <form onSubmit={handleConfirmOrder} className="col-span-12 md:col-span-7 p-6 md:p-8 space-y-6 overflow-y-auto">
            <h4 className="font-bold text-gray-800 text-base border-b border-gray-100 pb-2">
              {language === 'English' ? '1. Shipping & Contact Info' : '1. Informations de Livraison'}
            </h4>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">{language === 'English' ? 'Full Contact Name' : 'Nom Complet'}</label>
                <input 
                  required
                  type="text" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder={language === 'English' ? 'First and Last name' : 'Ex: Karim El Alami'}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 outline-none rounded-xl focus:border-primary focus:ring-4 focus:ring-orange-100 transition-all text-sm font-medium" 
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">{language === 'English' ? 'WhatsApp / Phone Number' : 'N° Téléphone / WhatsApp'}</label>
                  <input 
                    required
                    type="tel" 
                    value={phone}
                    placeholder="e.g. +212 600-000000"
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 outline-none rounded-xl focus:border-primary focus:ring-4 focus:ring-orange-100 transition-all text-sm font-medium" 
                  />
                  <p className="text-[9px] text-gray-400">{language === 'English' ? 'Supplier needs this to coordinate shipping' : 'Nécessaire pour fixer le lieu de livraison'}</p>
                </div>
                
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">{language === 'English' ? 'Moroccan City' : 'Ville au Maroc'}</label>
                  <select 
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 outline-none rounded-xl focus:border-primary focus:ring-4 focus:ring-orange-100 transition-all text-sm font-semibold text-gray-700"
                  >
                    {MOROCCAN_CITIES.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">{language === 'English' ? 'Full Delivery Address' : 'Adresse de Livraison complète'}</label>
                <textarea 
                  required
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder={language === 'English' ? 'Street, Quarter, Building, Apartment' : 'Rue, Quartat, Numéro de maison...'}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 outline-none rounded-xl focus:border-primary focus:ring-4 focus:ring-orange-100 transition-all text-sm font-medium resize-none" 
                />
              </div>
            </div>

            <h4 className="font-bold text-gray-800 text-base border-b border-gray-100 pt-2 pb-2">
              {language === 'English' ? '2. Choose Payment Method' : '2. Mode de Règlement'}
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Cash On Delivery */}
              <div 
                onClick={() => setPaymentMethod('cod')}
                className={`cursor-pointer p-4 rounded-xl border-2 flex flex-col items-center text-center transition-all ${
                  paymentMethod === 'cod' 
                    ? 'border-primary bg-orange-50/50 text-gray-800 ring-2 ring-orange-200' 
                    : 'border-gray-100 bg-gray-50/30 text-gray-500 hover:border-gray-200'
                }`}
              >
                <Truck className={`w-6 h-6 mb-2 ${paymentMethod === 'cod' ? 'text-primary animate-bounce' : 'text-gray-400'}`} />
                <span className="text-xs font-bold block">{language === 'English' ? 'Cash on Delivery' : 'Paiement à la Livraison'}</span>
                <span className="text-[10px] text-green-600 font-medium leading-tight mt-1">{language === 'English' ? 'Best / Most popular' : 'Populaire au Maroc'}</span>
              </div>

              {/* Credit Card */}
              <div 
                onClick={() => setPaymentMethod('card')}
                className={`cursor-pointer p-4 rounded-xl border-2 flex flex-col items-center text-center transition-all ${
                  paymentMethod === 'card' 
                    ? 'border-primary bg-orange-50/50 text-gray-800 ring-2 ring-orange-200' 
                    : 'border-gray-100 bg-gray-50/30 text-gray-500 hover:border-gray-200'
                }`}
              >
                <CreditCard className={`w-6 h-6 mb-2 ${paymentMethod === 'card' ? 'text-primary' : 'text-gray-400'}`} />
                <span className="text-xs font-bold block">{language === 'English' ? 'Credit Card' : 'Carte Bancaire CMI'}</span>
                <span className="text-[10px] text-gray-400 leading-tight mt-1">{language === 'English' ? 'Instant secure transfer' : 'Sécurisé par CMI'}</span>
              </div>

              {/* Bank Wire */}
              <div 
                onClick={() => setPaymentMethod('transfer')}
                className={`cursor-pointer p-4 rounded-xl border-2 flex flex-col items-center text-center transition-all ${
                  paymentMethod === 'transfer' 
                    ? 'border-primary bg-orange-50/50 text-gray-800 ring-2 ring-orange-200' 
                    : 'border-gray-100 bg-gray-50/30 text-gray-500 hover:border-gray-200'
                }`}
              >
                <ShoppingBag className={`w-6 h-6 mb-2 ${paymentMethod === 'transfer' ? 'text-primary' : 'text-gray-400'}`} />
                <span className="text-xs font-bold block">{language === 'English' ? 'Wholesale Wire' : 'Virement Bancaire'}</span>
                <span className="text-[10px] text-gray-400 leading-tight mt-1">{language === 'English' ? 'For bulk / large items' : 'Recommandé pour gros volumes'}</span>
              </div>
            </div>

            <div className="flex gap-4 pt-4 border-t border-gray-100">
              <button 
                type="button"
                onClick={() => setPurchasingProduct(null)}
                className="flex-grow py-3 px-4 rounded-xl bg-gray-100 font-bold text-gray-600 hover:bg-gray-200 text-sm transition-colors"
              >
                {t.cancel}
              </button>
              <button 
                type="submit"
                disabled={isSubmitting}
                className="flex-grow py-3 px-4 rounded-xl bg-primary text-white font-bold hover:bg-primary-dark shadow-xl shadow-orange-100 text-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 rounded-full border-2 border-white/50 border-t-white animate-spin"></div>
                    <span>{language === 'English' ? 'Processing...' : 'Traitement...'}</span>
                  </>
                ) : (
                  <>
                    <Check className="w-5 h-5" />
                    <span>{language === 'English' ? 'Confirm Purchase Order' : 'Confirmer l\'Achat'}</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Right Panel: Sticky Order Summary & Quantities */}
          <div className="col-span-12 md:col-span-5 bg-gray-50 p-6 md:p-8 flex flex-col justify-between border-t md:border-t-0 md:border-l border-gray-200">
            <div>
              <h4 className="font-bold text-gray-800 text-base border-b border-gray-200 pb-2 mb-6">
                {language === 'English' ? 'Order Summary' : 'Récapitulatif Commande'}
              </h4>

              {/* Product Micro details */}
              <div className="flex gap-4 mb-6">
                <img 
                  src={purchasingProduct.imageUrl} 
                  alt={purchasingProduct.title} 
                  className="w-20 h-20 rounded-xl object-cover bg-white shadow-sm border border-gray-200 flex-shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <span className="text-[9px] uppercase font-bold text-primary bg-orange-50 px-2 py-0.5 rounded-full border border-orange-100">{purchasingProduct.category}</span>
                  <h5 className="font-bold text-gray-800 text-sm mt-1 line-clamp-2">{purchasingProduct.title}</h5>
                  <p className="text-[11px] text-gray-500 mt-1">{language === 'English' ? 'Supplier:' : 'Grossiste:'} <strong className="text-gray-700 font-semibold">{purchasingProduct.partnerName}</strong></p>
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="bg-white p-4 rounded-2xl border border-gray-200 space-y-3 shadow-sm mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-gray-600 uppercase tracking-wide">{language === 'English' ? 'Quantity' : 'Quantité de gros'}</span>
                  <div className="flex items-center gap-1">
                    <button 
                      type="button"
                      onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                      className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold flex items-center justify-center text-sm transition-colors"
                    >
                      -
                    </button>
                    <span className="w-10 text-center text-sm font-bold text-gray-800">{quantity}</span>
                    <button 
                      type="button"
                      onClick={() => setQuantity(prev => prev + 1)}
                      className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold flex items-center justify-center text-sm transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="text-[10px] text-gray-500 leading-tight pt-1.5 border-t border-gray-100 flex items-start gap-1.5 ">
                  <AlertCircle className="w-3.5 h-3.5 text-orange-500 flex-shrink-0 mt-0.5" />
                  <span>
                    {language === 'English' 
                      ? 'Wholesale Alert: Order 5 or more units to unlock an extra 5% bulk discount!' 
                      : 'Bénéficiez de 5% de remise supplémentaire à partir de 5 unités !'}
                  </span>
                </div>
              </div>

              {/* Detailed Costs */}
              <div className="space-y-3 text-sm font-medium text-gray-600">
                <div className="flex justify-between">
                  <span>{language === 'English' ? 'Unit Price' : 'Prix unitaire'}</span>
                  <span className="text-gray-800 font-bold">{unitPrice.toLocaleString()} {currency}</span>
                </div>
                <div className="flex justify-between">
                  <span>{language === 'English' ? 'Subtotal' : 'Sous-total'}</span>
                  <span className="text-gray-800 font-bold">{baseTotal.toLocaleString()} {currency}</span>
                </div>

                {bulkDiscountPercent > 0 && (
                  <div className="flex justify-between text-green-600 font-semibold">
                    <span>{language === 'English' ? 'Bulk Discount (-5%)' : 'Remise de gros (-5%)'}</span>
                    <span>-{discountAmount.toLocaleString()} {currency}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>{language === 'English' ? 'Shipping' : 'Livraison'}</span>
                  <span className="text-gray-800 font-semibold">
                    {shippingCost === 0 ? (
                      <span className="text-green-600 font-bold uppercase">{language === 'English' ? 'Free' : 'Gratuit'}</span>
                    ) : (
                      `${shippingCost} ${currency}`
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* Total Section */}
            <div className="border-t border-gray-200 pt-6 mt-8">
              <div className="flex justify-between items-baseline mb-3">
                <span className="text-sm font-bold text-gray-800 uppercase tracking-wide">{language === 'English' ? 'Total to Pay' : 'Total Général'}</span>
                <span className="text-2xl font-black text-red-600">{finalTotal.toLocaleString()} {currency}</span>
              </div>
              
              <div className="p-3.5 rounded-xl bg-orange-50 text-[10px] text-orange-700 leading-relaxed border border-orange-100">
                <span className="font-bold block mb-0.5">⚡ HAWTA Buyer Guarantee:</span>
                <span>You will only pay when you confirm and receive your wholesale product! No prepaid fees are required for Cash on Delivery orders.</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
