import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Camera, Menu, X, Home, Users, MapPin, Info } from 'lucide-react';

const Navbar: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    const navItems = [
        { path: '/', label: '首页', icon: <Home className="h-4 w-4" /> },
        { path: '/about', label: '关于', icon: <Info className="h-4 w-4" /> },
    ];

    const isActive = (path: string) => location.pathname === path;

    return (
        <nav className="bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 backdrop-blur-sm sticky top-0 z-50 border-b border-blue-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="flex items-center space-x-2"
                    >
                        <Camera className="h-8 w-8 text-blue-400" />
                        <Link to="/" className="text-xl font-serif font-bold text-white">
                            胶片漂流计划
                        </Link>
                    </motion.div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-4">
                            {navItems.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                                        isActive(item.path)
                                            ? 'bg-blue-600 text-white'
                                            : 'text-blue-200 hover:text-white hover:bg-blue-700'
                                    }`}
                                >
                                    <span className="mr-2">{item.icon}</span>
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-blue-200 hover:text-white p-2"
                        >
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation */}
            <motion.div
                initial={false}
                animate={isOpen ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="md:hidden overflow-hidden bg-blue-800"
            >
                <div className="px-2 pt-2 pb-3 space-y-1">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setIsOpen(false)}
                            className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                                isActive(item.path)
                                    ? 'bg-blue-600 text-white'
                                    : 'text-blue-200 hover:text-white hover:bg-blue-700'
                            }`}
                        >
                            <span className="mr-2">{item.icon}</span>
                            {item.label}
                        </Link>
                    ))}
                </div>
            </motion.div>
        </nav>
    );
};

export default Navbar; 