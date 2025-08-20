import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import GroupDetail from './pages/GroupDetail';
import RelayDetail from './pages/RelayDetail';
import About from './pages/About';
import PhotoTest from './pages/PhotoTest';
import './App.css';

function App() {
    return (
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
                                <Home />
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
                    </Routes>
                </AnimatePresence>
            </div>
        </Router>
    );
}

export default App; 