import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import AmapComponent from '../components/AmapComponent';
import { projectData } from '../config/projectData';

const MapTest: React.FC = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
            {/* 返回按钮 */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
                <Link
                    to="/"
                    className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors duration-200"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    返回首页
                </Link>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-8"
                >
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">地图测试页面</h1>
                    <p className="text-lg text-gray-600">
                        测试高德地图组件功能
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="bg-white rounded-xl p-6 shadow-lg"
                >
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">A组路线图</h2>
                    <AmapComponent
                        relays={projectData[0].relays}
                        height="500px"
                        showRoute={true}
                        showAllMarkers={true}
                    />
                </motion.div>
            </div>
        </div>
    );
};

export default MapTest;
