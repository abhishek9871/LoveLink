
import React, { useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import useAuthStore from './store/authStore';

import AuthPage from './pages/AuthPage';
import OnboardingPage from './pages/OnboardingPage';
import DiscoverPage from './pages/DiscoverPage';
import MatchesPage from './pages/MatchesPage';
import LikesYouPage from './pages/LikesYouPage';
import ChatPage from './pages/ChatPage';
import ProfilePage from './pages/ProfilePage';
import VideoChatPage from './pages/VideoChatPage';
import SubscriptionPage from './pages/SubscriptionPage';

import Header from './components/layout/Header';
import BottomNav from './components/layout/BottomNav';

const App: React.FC = () => {
  const { isAuthenticated, user, checkAuth } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (isAuthenticated && user) {
      if (!user.profileComplete) {
        if(location.pathname !== '/onboarding') navigate('/onboarding');
      } else if (['/auth', '/onboarding'].includes(location.pathname)) {
        navigate('/discover');
      }
    } else if (!isAuthenticated && location.pathname !== '/auth') {
       if (location.pathname !== '/auth') navigate('/auth');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, user, location.pathname, navigate]);


  const showLayout = isAuthenticated && user?.profileComplete && !location.pathname.startsWith('/video') && location.pathname !== '/auth' && location.pathname !== '/onboarding';

  return (
    <div className="bg-light-gray min-h-screen font-sans text-text-primary">
      <div className="container mx-auto max-w-lg h-screen flex flex-col">
        {showLayout && <Header />}
        <main className="flex-grow overflow-y-auto">
          <Routes>
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/onboarding" element={isAuthenticated ? <OnboardingPage /> : <Navigate to="/auth" />} />
            <Route path="/discover" element={isAuthenticated && user?.profileComplete ? <DiscoverPage /> : <Navigate to="/auth" />} />
            <Route path="/matches" element={isAuthenticated && user?.profileComplete ? <MatchesPage /> : <Navigate to="/auth" />} />
            <Route path="/likes-you" element={isAuthenticated && user?.profileComplete ? <LikesYouPage /> : <Navigate to="/auth" />} />
            <Route path="/chat/:userId" element={isAuthenticated && user?.profileComplete ? <ChatPage /> : <Navigate to="/auth" />} />
            <Route path="/video/:userId" element={isAuthenticated && user?.profileComplete ? <VideoChatPage /> : <Navigate to="/auth" />} />
            <Route path="/profile" element={isAuthenticated && user?.profileComplete ? <ProfilePage /> : <Navigate to="/auth" />} />
            <Route path="/subscription" element={isAuthenticated && user?.profileComplete ? <SubscriptionPage /> : <Navigate to="/auth" />} />
            <Route path="*" element={<Navigate to={isAuthenticated ? "/discover" : "/auth"} />} />
          </Routes>
        </main>
        {showLayout && <BottomNav />}
      </div>
    </div>
  );
};

export default App;
