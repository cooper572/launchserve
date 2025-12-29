
import React from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import OpportunitiesPage from './pages/OpportunitiesPage';
import OpportunityDetailPage from './pages/OpportunityDetailPage';
import SubmitOpportunityPage from './pages/SubmitOpportunityPage';
import Header from './components/Header';
import Footer from './components/Footer';

const AppContent: React.FC = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/opportunities" element={<OpportunitiesPage />} />
                    <Route path="/opportunity/:id" element={<OpportunityDetailPage />} />
                    <Route path="/submit" element={<SubmitOpportunityPage />} />
                </Routes>
            </main>
            <Footer />
        </div>
    );
};

const App: React.FC = () => {
    return (
        <HashRouter>
            <AppContent />
        </HashRouter>
    );
};

export default App;
