/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { Home } from './pages/Home';
import { Deals } from './pages/Deals';
import { PartnerDashboard } from './pages/PartnerDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { Comparison } from './pages/Comparison';
import { SignIn } from './pages/SignIn';
import { Favorites } from './pages/Favorites';
import { Profile } from './pages/Profile';
import { AppProvider } from './context/AppContext';
import { NotificationCenter } from './components/NotificationCenter';
import { CheckoutModal } from './components/CheckoutModal';

export default function App() {
  return (
    <AppProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Routes>
            <Route path="/signin" element={<SignIn />} />
            <Route path="*" element={
              <>
                <Header />
                <main className="flex-grow">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/deals" element={<Deals />} />
                    <Route path="/partner" element={<PartnerDashboard />} />
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/compare" element={<Comparison />} />
                    <Route path="/favorites" element={<Favorites />} />
                    <Route path="/profile" element={<Profile />} />
                  </Routes>
                </main>
                <Footer />
              </>
            } />
          </Routes>
          <NotificationCenter />
          <CheckoutModal />
        </div>
      </Router>
    </AppProvider>
  );
}
