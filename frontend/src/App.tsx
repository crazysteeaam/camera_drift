import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LanguageProvider } from './i18n/context';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import GroupDetail from './pages/GroupDetail';
import RelayDetail from './pages/RelayDetail';
import RouteMap from './pages/RouteMap';
import About from './pages/About';
import PhotoTest from './pages/PhotoTest';
import MapTest from './pages/MapTest';

// 第二期页面
import Phase2Home from './pages/Phase2Home';
import Phase2Province from './pages/Phase2Province';
import Phase2Group from './pages/Phase2Group';
import Phase2Test from './pages/Phase2Test';
import Phase2RelayDetail from './pages/Phase2RelayDetail';
import Gallery from './pages/Gallery';
import Phase1Gallery from './pages/Phase1Gallery';
import ExtraDriftPage from './pages/ExtraDriftPage';
import ExtraEditorialPage from './pages/ExtraEditorialPage';
import ExtraGroupDetailPage from './pages/ExtraGroupDetailPage';
import ExtraMemberDetailPage from './pages/ExtraMemberDetailPage';
import MeaningHubPage from './pages/MeaningHubPage';
import MeaningMonthPage from './pages/MeaningMonthPage';
import MeaningRecruitPage from './pages/MeaningRecruitPage';
import MeaningMemberDetailPage from './pages/MeaningMemberDetailPage';

import './App.css';

function App() {
    return (
        // 包裹整个应用，提供多语言支持
        <LanguageProvider>
            <Router>
                <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
                    <Navbar />
                    <AnimatePresence mode="wait">
                    <Routes>
                        <Route path="/" element={
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <Phase2Home />
                            </motion.div>
                        } />
                        <Route path="/phase1" element={
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <Home />
                            </motion.div>
                        } />
                        <Route path="/phase1/gallery" element={
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.5 }}
                            >
                                <Phase1Gallery />
                            </motion.div>
                        } />
                        <Route path="/group/:groupId" element={
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.5 }}
                            >
                                <GroupDetail />
                            </motion.div>
                        } />
                        <Route path="/group/:groupId/relay/:relayId" element={
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.5 }}
                            >
                                <RelayDetail />
                            </motion.div>
                        } />
                        <Route path="/about" element={
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.5 }}
                            >
                                <About />
                            </motion.div>
                        } />
                        {/* 旅行的意义（月度篇章） */}
                        <Route path="/meaning" element={
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.5 }}
                            >
                                <MeaningHubPage />
                            </motion.div>
                        } />
                        <Route path="/meaning/recruit" element={
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.5 }}
                            >
                                <MeaningRecruitPage />
                            </motion.div>
                        } />
                        <Route path="/meaning/:monthId" element={
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.5 }}
                            >
                                <MeaningMonthPage />
                            </motion.div>
                        } />
                        <Route path="/meaning/:monthId/member/:memberId" element={
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.5 }}
                            >
                                <MeaningMemberDetailPage />
                            </motion.div>
                        } />
                        <Route path="/extra" element={
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.6 }}
                            >
                                <ExtraDriftPage />
                            </motion.div>
                        } />
                        <Route path="/extra/editorial" element={
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.6 }}
                            >
                                <ExtraEditorialPage />
                            </motion.div>
                        } />
                        <Route path="/extra/group/:groupId" element={
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.5 }}
                            >
                                <ExtraGroupDetailPage />
                            </motion.div>
                        } />
                        <Route path="/extra/group/:groupId/member/:memberId" element={
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.5 }}
                            >
                                <ExtraMemberDetailPage />
                            </motion.div>
                        } />
                        <Route path="/photo-test" element={
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.5 }}
                            >
                                <PhotoTest />
                            </motion.div>
                        } />

                        <Route path="/route-map" element={
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.5 }}
                            >
                                <RouteMap />
                            </motion.div>
                        } />
                        <Route path="/route-map/:groupId" element={
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.5 }}
                            >
                                <RouteMap />
                            </motion.div>
                        } />
                        <Route path="/map-test" element={
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.5 }}
                            >
                                <MapTest />
                            </motion.div>
                        } />

                        {/* 第二期路由 */}
                        <Route path="/phase2" element={
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <Phase2Home />
                            </motion.div>
                        } />
                        <Route path="/phase2/province/:provinceId" element={
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.5 }}
                            >
                                <Phase2Province />
                            </motion.div>
                        } />
                        <Route path="/phase2/province/:provinceId/group/:groupId" element={
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.5 }}
                            >
                                <Phase2Group />
                            </motion.div>
                        } />
                        <Route path="/phase2/group/:provinceId/:groupId/relay/:relayId" element={
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.5 }}
                            >
                                <Phase2RelayDetail />
                            </motion.div>
                        } />
                        <Route path="/phase2/test" element={
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.5 }}
                            >
                                <Phase2Test />
                            </motion.div>
                        } />
                        <Route path="/phase2/gallery" element={
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.5 }}
                            >
                                <Gallery />
                            </motion.div>
                        } />
                    </Routes>
                </AnimatePresence>
            </div>
        </Router>
        </LanguageProvider>
    );
}

export default App; 
