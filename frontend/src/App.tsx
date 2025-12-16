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
