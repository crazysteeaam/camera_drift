import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Camera, MapPin, Users, Star } from 'lucide-react';

const Phase2Test: React.FC = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
            <div className="max-w-4xl mx-auto px-4 py-16">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        点亮中国 胶片漂流计划
                    </h1>
                    <p className="text-xl text-gray-600 mb-8">
                        第二期功能测试页面 - 已更新为新的设计
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* 功能测试卡片 */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="bg-white rounded-xl p-6 shadow-lg"
                    >
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                            <Camera className="h-6 w-6 mr-2 text-orange-600" />
                            主页面功能
                        </h2>
                        <p className="text-gray-600 mb-6">
                            测试第二期主页面，包括所有省份展示、状态筛选、字母组数筛选等功能
                        </p>
                        <Link
                            to="/"
                            className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                        >
                            访问主页面
                            <ArrowRight className="h-4 w-4 ml-2" />
                        </Link>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="bg-white rounded-xl p-6 shadow-lg"
                    >
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                            <MapPin className="h-6 w-6 mr-2 text-red-600" />
                            省份详情
                        </h2>
                        <p className="text-gray-600 mb-6">
                            测试浙江省详情页面，查看A-E五个小组
                        </p>
                        <Link
                            to="/phase2/province/zhejiang"
                            className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                            查看浙江省
                            <ArrowRight className="h-4 w-4 ml-2" />
                        </Link>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                        className="bg-white rounded-xl p-6 shadow-lg"
                    >
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                            <Users className="h-6 w-6 mr-2 text-purple-600" />
                            小组详情
                        </h2>
                        <p className="text-gray-600 mb-6">
                            测试浙江省A组详情页面，查看接力棒和留言图片
                        </p>
                        <Link
                            to="/phase2/province/zhejiang/group/A"
                            className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                        >
                            查看A组详情
                            <ArrowRight className="h-4 w-4 ml-2" />
                        </Link>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.8 }}
                        className="bg-white rounded-xl p-6 shadow-lg"
                    >
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                            <Star className="h-6 w-6 mr-2 text-yellow-600" />
                            第一期对比
                        </h2>
                        <p className="text-gray-600 mb-6">
                            返回第一期页面，对比两期的设计差异
                        </p>
                        <Link
                            to="/phase1"
                            className="inline-flex items-center px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                        >
                            查看第一期
                            <ArrowRight className="h-4 w-4 ml-2" />
                        </Link>
                    </motion.div>
                </div>

                {/* 功能说明 */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 1.0 }}
                    className="mt-12 bg-white rounded-xl p-8 shadow-lg"
                >
                    <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
                        第二期新功能
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-3">省份导航</h3>
                            <ul className="space-y-2 text-gray-600">
                                <li>• 以省份为单位组织小组</li>
                                <li>• 每个省份包含A-E五个小组</li>
                                <li>• 支持搜索和状态筛选</li>
                                <li>• 实时显示进度统计</li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-3">留言图片</h3>
                            <ul className="space-y-2 text-gray-600">
                                <li>• 独立的留言图片展示</li>
                                <li>• 支持图片放大查看</li>
                                <li>• 图片轮播和导航</li>
                                <li>• 参与者信息展示</li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-3">界面设计</h3>
                            <ul className="space-y-2 text-gray-600">
                                <li>• 橙色主题配色方案</li>
                                <li>• 响应式设计适配</li>
                                <li>• 流畅的动画效果</li>
                                <li>• 直观的进度展示</li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-3">交互体验</h3>
                            <ul className="space-y-2 text-gray-600">
                                <li>• 快速导航和返回</li>
                                <li>• 状态筛选和搜索</li>
                                <li>• 悬停效果和反馈</li>
                                <li>• 移动端友好设计</li>
                            </ul>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Phase2Test;
