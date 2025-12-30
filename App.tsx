
import React from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import LandingPage from './pages/LandingPage';
import OpportunitiesPage from './pages/OpportunitiesPage';
import OpportunityDetailPage from './pages/OpportunityDetailPage';
import SubmitOpportunityPage from './pages/SubmitOpportunityPage';
import LearnMorePage from './pages/LearnMorePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import OnboardingPage from './pages/OnboardingPage';
import DashboardPage from './pages/DashboardPage';
import TailoredForMePage from './pages/TailoredForMePage';
import OrganizationOnboardingPage from './pages/OrganizationOnboardingPage';
import OrganizationDashboardPage from './pages/OrganizationDashboardPage';
import Header from './components/Header';
import Footer from './components/Footer';

const AppContent: React.FC = () => {
    const location = useLocation();
    const hideHeaderFooter = location.pathname === '/organization-dashboard';

    return (
        <div className="flex flex-col min-h-screen">
            {!hideHeaderFooter && <Header />}
            <main className="flex-grow">
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/opportunities" element={<OpportunitiesPage />} />
                    <Route path="/opportunity/:id" element={<OpportunityDetailPage />} />
                    <Route path="/submit" element={<SubmitOpportunityPage />} />
                    <Route path="/learn-more" element={<LearnMorePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />
                    <Route path="/onboarding" element={<OnboardingPage />} />
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/tailored-for-me" element={<TailoredForMePage />} />
                    <Route path="/organization-onboarding" element={<OrganizationOnboardingPage />} />
                    <Route path="/organization-dashboard" element={<OrganizationDashboardPage />} />
                </Routes>
            </main>
            {!hideHeaderFooter && <Footer />}
        </div>
    );
};

const App: React.FC = () => {
    return (
        <HashRouter>
            <AuthProvider>
                <AppContent />
            </AuthProvider>
        </HashRouter>
    );
};

export default App;
