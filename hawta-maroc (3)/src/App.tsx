/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import type React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { Home } from './pages/Home';
import { Deals } from './pages/Deals';
import { PartnerDashboard } from './pages/PartnerDashboard';
import { Comparison } from './pages/Comparison';
import { SignIn } from './pages/SignIn';
import { Favorites } from './pages/Favorites';
import { Profile } from './pages/Profile';
import { AppProvider } from './context/AppContext';
import { useAppContext } from './context/AppContext';
import { NotificationCenter } from './components/NotificationCenter';

const ADMIN_EMAIL = 'mohamadelbouhali465@gmail.com';

function RequireLogin({ children }: { children: React.ReactElement }) {
  const { isLoggedIn } = useAppContext();
  return isLoggedIn ? children : <Navigate to="/signin" replace />;
}

function RequireAdmin({ children }: { children: React.ReactElement }) {
  const { currentUser } = useAppContext();
  return currentUser?.email === ADMIN_EMAIL ? children : <Navigate to="/" replace />;
}

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
                    <Route path="/partner" element={<RequireAdmin><PartnerDashboard /></RequireAdmin>} />
                    <Route path="/compare" element={<Comparison />} />
                    <Route path="/favorites" element={<Favorites />} />
                    <Route path="/profile" element={<RequireLogin><Profile /></RequireLogin>} />
                  </Routes>
                </main>
                <Footer />
              </>
            } />
          </Routes>
          <NotificationCenter />
        </div>
      </Router>
    </AppProvider>
  );
}
