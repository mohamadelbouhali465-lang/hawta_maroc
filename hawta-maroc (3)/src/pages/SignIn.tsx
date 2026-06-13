import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, Globe, User, ShoppingBag, Store, Users } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { useTranslation } from '../translations';
import { UserRole } from '../types';

export const SignIn: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setIsLoggedIn, setCurrentUser, addNotification, language, partners, registerUser, users } = useAppContext();
  const navigate = useNavigate();
  const t = useTranslation(language);
  const isRTL = language === 'العربية';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignUp) {
      if (fullName && email && password) {
        // Check if user already exists
        const userExists = (users || []).some(
          u => u.email.toLowerCase() === email.toLowerCase()
        );
        if (userExists) {
          addNotification(
            language === 'English'
              ? 'An account with this email already exists!'
              : language === 'Français'
              ? 'Un compte avec cet e-mail existe déjà !'
              : 'هذا البريد الإلكتروني مسجل بالفعل!',
            'error'
          );
          return;
        }

        setIsLoggedIn(true);
        const newUserAccount = {
          name: fullName,
          email: email,
          role: 'client' as UserRole,
          phone: '',
          location: 'Casablanca, Morocco',
          password: password
        };
        setCurrentUser(newUserAccount);
        registerUser(newUserAccount);
        const welcomeMsg = language === 'English' 
          ? `Account created successfully! Welcome, ${fullName}!` 
          : language === 'Français' 
          ? `Compte créé avec succès ! Bienvenue, ${fullName} !` 
          : `تم إنشاء الحساب بنجاح! مرحباً بك، ${fullName}!`;
        addNotification(welcomeMsg, 'success');
        navigate('/');
      } else {
        addNotification(t.please_fill_fields, 'error');
      }
    } else {
      if (email && password) {
        // Locate matching user
        const matchedUser = (users || []).find(
          u => u.email.toLowerCase() === email.toLowerCase()
        );

        if (!matchedUser) {
          addNotification(
            language === 'English'
              ? 'No account found with this email! Please sign up first.'
              : language === 'Français'
              ? 'Aucun compte trouvé avec cet e-mail ! Veuillez vous inscrire.'
              : 'لم نجد أي حساب بهذا البريد الإلكتروني! يرجى إنشاء حساب أولاً.',
            'error'
          );
          return;
        }

        // Validate password
        if (matchedUser.password && matchedUser.password !== password) {
          addNotification(
            language === 'English'
              ? 'Incorrect password! Please try again.'
              : language === 'Français'
              ? 'Mot de passe incorrect ! Veuillez vous y ré-essayer.'
              : 'كلمة المرور غير صحيحة! يرجى المحاولة مرة أخرى.',
            'error'
          );
          return;
        }

        setIsLoggedIn(true);
        setCurrentUser(matchedUser);
        addNotification(t.welcome_back, 'success');
        navigate('/');
      } else {
        addNotification(t.please_fill_fields, 'error');
      }
    }
  };

  return (
    <div className={`min-h-[calc(100vh-100px)] flex flex-col bg-[#f4f4f4] ${isRTL ? 'font-sans' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Mini Header for Login */}
      <div className="bg-white border-b border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <Link to="/" className="text-3xl font-bold text-primary">
            HAWTA<span className={`text-secondary ${isRTL ? 'mr-2' : 'ml-2'}`}>MAROC</span>
          </Link>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1 cursor-pointer hover:text-primary">
              <Globe className="w-4 h-4" /> {language === 'English' ? 'English-MAD' : language === 'Français' ? 'Français-MAD' : 'العربية-MAD'}
            </span>
          </div>
        </div>
      </div>

      <div className="flex-grow flex items-center justify-center p-4 py-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white w-full max-w-md p-8 rounded-xl alibaba-shadow border border-gray-100"
        >
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              {isSignUp ? t.register : t.sign_in}
            </h1>
            <p className="text-gray-500 text-sm">
              {isSignUp 
                ? (language === 'English' ? 'Join the leading Moroccan partner network' : language === 'Français' ? 'Rejoignez le premier réseau de partenaires au Maroc' : 'انضم إلى شبكة الشركاء الرائدة في المغرب')
                : t.ready_to_find
              }
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {isSignUp && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="space-y-4"
              >
                <div>
                  <label className={`block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ${isRTL ? 'mr-1' : 'ml-1'}`}>
                    {t.full_name}
                  </label>
                  <div className="relative">
                    <input 
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder={language === 'English' ? 'Your Name' : language === 'Français' ? 'Votre Nom' : 'الاسم الكامل'}
                      className={`w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-primary focus:ring-4 focus:ring-orange-100 transition-all text-sm ${isRTL ? 'pr-11' : 'pl-11'}`}
                      required={isSignUp}
                    />
                    <User className={`absolute ${isRTL ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400`} />
                  </div>
                </div>
              </motion.div>
            )}

            <div>
              <label className={`block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ${isRTL ? 'mr-1' : 'ml-1'}`}>
                {t.email_user}
              </label>
              <div className="relative">
                <input 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="exemple@email.com"
                  className={`w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-primary focus:ring-4 focus:ring-orange-100 transition-all text-sm ${isRTL ? 'pr-11' : 'pl-11'}`}
                  required
                />
                <Mail className={`absolute ${isRTL ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400`} />
              </div>
            </div>

            <div>
              <label className={`block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ${isRTL ? 'mr-1' : 'ml-1'}`}>
                {t.password}
              </label>
              <div className="relative">
                <input 
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-primary focus:ring-4 focus:ring-orange-100 transition-all text-sm ${isRTL ? 'pr-11' : 'pl-11'}`}
                  required
                />
                <Lock className={`absolute ${isRTL ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400`} />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute ${isRTL ? 'left-4' : 'right-4'} top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors`}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {!isSignUp && (
                <div className={`flex ${isRTL ? 'justify-start' : 'justify-end'} mt-2`}>
                  <button type="button" className="text-xs font-medium text-secondary hover:underline">{t.forgot_password}</button>
                </div>
              )}
            </div>

            <button 
              type="submit"
              className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 rounded-lg shadow-lg shadow-orange-200 transition-all transform hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2"
            >
              {isSignUp ? t.register : t.sign_in} <ArrowRight className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-sm text-gray-500">
              {isSignUp ? (
                <>
                  {language === 'English' ? 'Already have an account?' : language === 'Français' ? 'Vous avez déjà un compte ?' : 'هل لديك حساب بالفعل؟'}{' '}
                  <button 
                    type="button"
                    onClick={() => setIsSignUp(false)}
                    className="text-primary font-bold hover:underline ml-1 mr-1"
                  >
                    {t.sign_in}
                  </button>
                </>
              ) : (
                <>
                  {t.new_to_hawta}{' '}
                  <button 
                    type="button"
                    onClick={() => setIsSignUp(true)}
                    className="text-primary font-bold hover:underline ml-1 mr-1"
                  >
                    {t.sign_up_free}
                  </button>
                </>
              )}
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-50 flex items-center justify-center gap-2 text-xs text-gray-400">
            <ShieldCheck className="w-4 h-4 text-green-500" />
            <span>{t.secure_privacy}</span>
          </div>
        </motion.div>
      </div>

      <div className="py-8 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4 text-center">
           <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em] mb-4">HAWTA MAROC - {language === 'English' ? 'Wholesale & Partner Marketplace' : language === 'Français' ? 'La Place de Marché des Grossistes et Partenaires' : 'سوق الجملة والشركاء'}</p>
           <div className="flex flex-wrap justify-center gap-6 text-[11px] text-gray-500 font-medium">
              <span className="cursor-pointer hover:text-primary">{t.terms}</span>
              <span className="cursor-pointer hover:text-primary">{t.privacy}</span>
              <span className="cursor-pointer hover:text-primary">{t.about}</span>
              <span className="cursor-pointer hover:text-primary">{t.contact}</span>
           </div>
        </div>
      </div>
    </div>
  );
};
