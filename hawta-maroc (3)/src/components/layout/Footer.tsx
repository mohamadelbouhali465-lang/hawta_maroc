
import React from 'react';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { useTranslation } from '../../translations';

export const Footer: React.FC = () => {
  const { language } = useAppContext();
  const t = useTranslation(language);
  const isRTL = language === 'العربية';

  return (
    <footer className={`bg-[#222] text-[#ccc] pt-12 pb-6 ${isRTL ? 'font-sans' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-4">
        {/* Footer Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          <div className="lg:col-span-1">
            <div className="text-white text-2xl font-bold mb-6">
              HAWTA<span className={`text-primary ${isRTL ? 'mr-2' : 'ml-2'}`}>MAROC</span>
            </div>
            <p className="text-xs leading-relaxed mb-6">
              {language === 'English' ? 'Connecting professional partners with smart shoppers across the globe. The leading promotional B2B/B2C marketplace for verified deals.' : language === 'Français' ? 'Connecter des partenaires professionnels avec des acheteurs avisés à travers le monde. La première place de marché promotionnelle B2B/B2C pour des offres vérifiées.' : 'ربط الشركاء المحترفين مع المتسوقين الأذكياء في جميع أنحاء العالم. السوق الترويجي الرائد B2B / B2C للعروض الموثقة.'}
            </p>
            <div className="flex gap-4">
              <Facebook className="w-5 h-5 cursor-pointer hover:text-primary" />
              <Twitter className="w-5 h-5 cursor-pointer hover:text-primary" />
              <Instagram className="w-5 h-5 cursor-pointer hover:text-primary" />
              <Youtube className="w-5 h-5 cursor-pointer hover:text-primary" />
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-wider">{language === 'English' ? 'Source on HAWTA' : language === 'Français' ? 'Sourcing sur HAWTA' : 'المصادر على HAWTA'}</h4>
            <ul className="space-y-3 text-xs">
              <li className="hover:text-primary cursor-pointer">{language === 'English' ? 'Post Buy Request' : language === 'Français' ? 'Publier une demande' : 'نشر طلب شراء'}</li>
              <li className="hover:text-primary cursor-pointer">{language === 'English' ? 'Manufacturers' : language === 'Français' ? 'Fabricants' : 'المصنعون'}</li>
              <li className="hover:text-primary cursor-pointer">{language === 'English' ? 'Sourcing Solutions' : language === 'Français' ? 'Solutions de sourcing' : 'حلول المصادر'}</li>
              <li className="hover:text-primary cursor-pointer">{language === 'English' ? 'Services' : language === 'Français' ? 'Services' : 'الخدمات'}</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-wider">{language === 'English' ? 'Sell on HAWTA' : language === 'Français' ? 'Vendre sur HAWTA' : 'البيع على HAWTA'}</h4>
            <ul className="space-y-3 text-xs">
              <li className="hover:text-primary cursor-pointer">{t.become_partner}</li>
              <li className="hover:text-primary cursor-pointer">{language === 'English' ? 'Partner Central' : language === 'Français' ? 'Centre Partenaire' : 'مركز الشركاء'}</li>
              <li className="hover:text-primary cursor-pointer">{language === 'English' ? 'Training Center' : language === 'Français' ? 'Centre de Formation' : 'مركز التدريب'}</li>
              <li className="hover:text-primary cursor-pointer">{t.verified_only}</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-wider">{language === 'English' ? 'Trade Services' : language === 'Français' ? 'Services Commerciaux' : 'خدمات التجارة'}</h4>
            <ul className="space-y-3 text-xs">
              <li className="hover:text-primary cursor-pointer">{t.payment_methods}</li>
              <li className="hover:text-primary cursor-pointer">{language === 'English' ? 'Logistics Services' : language === 'Français' ? 'Services Logistiques' : 'خدمات اللوجستيات'}</li>
              <li className="hover:text-primary cursor-pointer">{language === 'English' ? 'Inspection Services' : language === 'Français' ? 'Services d\'Inspection' : 'خدمات التفتيش'}</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-wider">{language === 'English' ? 'Customer Care' : language === 'Français' ? 'Service Client' : 'خدمة العملاء'}</h4>
            <ul className="space-y-3 text-xs">
              <li className="hover:text-primary cursor-pointer flex items-center gap-2"><Mail className="w-3 h-3" /> help@hawtamaroc.com</li>
              <li className="hover:text-primary cursor-pointer flex items-center gap-2"><Phone className="w-3 h-3" /> +212 522-000000</li>
              <li className="hover:text-primary cursor-pointer flex items-center gap-2"><MapPin className="w-3 h-3" /> Casablanca, Morocco</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px]">
          <div className="flex flex-wrap justify-center gap-4">
            <span className="hover:text-white cursor-pointer">{language === 'English' ? 'Privacy Policy' : language === 'Français' ? 'Politique de confidentialité' : 'سياسة الخصوصية'}</span>
            <span className="hover:text-white cursor-pointer">{language === 'English' ? 'Terms of Use' : language === 'Français' ? 'Conditions d\'utilisation' : 'شروط الاستخدام'}</span>
            <span className="hover:text-white cursor-pointer">{language === 'English' ? 'Sitemap' : language === 'Français' ? 'Plan du site' : 'خريطة الموقع'}</span>
          </div>
          <p>© 2024 HAWTA MAROC. {language === 'English' ? 'All rights reserved.' : language === 'Français' ? 'Tous droits réservés.' : 'جميع الحقوق محفوظة.'}</p>
        </div>
      </div>
    </footer>
  );
};
