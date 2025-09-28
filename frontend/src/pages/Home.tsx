import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Camera, MapPin, Users, ArrowRight, Film, Compass, Map, Filter } from 'lucide-react';
import { projectData, phase2Preview } from '../config/projectData';
import AmapComponent from '../components/AmapComponent';

const Home: React.FC = () => {
    const [selectedGroup, setSelectedGroup] = useState<string>('all');

    const handleGroupSelect = (group: string) => {
        setSelectedGroup(group);
    };

    const filteredProjectData = selectedGroup === 'all' 
        ? projectData 
        : projectData.filter(group => group.id === selectedGroup);

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative overflow-hidden py-24 text-white">
                <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a] via-[#1d1f3f] to-[#312e81]" />
                <div
                    className="absolute inset-0 opacity-40"
                    style={{
                        backgroundImage:
                            'radial-gradient(circle at 15% 20%, rgba(59,130,246,0.35), transparent 45%), radial-gradient(circle at 80% 0%, rgba(165,180,252,0.35), transparent 52%), radial-gradient(circle at 90% 80%, rgba(56,189,248,0.35), transparent 50%)'
                    }}
                />
                <div className="absolute -left-32 -bottom-32 w-96 h-96 bg-blue-500/25 blur-3xl" />
                <div className="absolute -right-24 -top-20 w-80 h-80 bg-indigo-500/30 blur-3xl" />

                <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        className="text-center"
                        initial={{ opacity: 0, y: 28 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="text-[3rem] md:text-[4.2rem] leading-tight font-extrabold tracking-[0.08em] text-white drop-shadow-[0_18px_45px_rgba(59,130,246,0.55)]">
                            胶片漂流计划 · 第一期
                        </h1>

                        <p className="mt-5 inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 border border-white/20 text-sm md:text-base font-medium text-blue-100/85">
                            <Film className="h-4 w-4 text-blue-200" />
                            一次接力，让城市的故事被胶片记住
                        </p>

                        <p className="mt-6 text-base md:text-lg text-blue-100/85 leading-relaxed max-w-3xl mx-auto">
                            四个小组，二十四位参与者，带着一次性胶片机穿行在不同的街巷与生活之间。你将看到每一张影像背后，那些真实的人与瞬间。
                        </p>

                        <div className="mt-10 flex flex-wrap justify-center gap-4">
                            <Link
                                to="/phase1/gallery"
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600 font-medium shadow-lg shadow-blue-900/40 hover:from-blue-400 hover:via-indigo-400 hover:to-blue-500 transition-all duration-200"
                            >
                                <Camera className="h-5 w-5" />
                                浏览作品集
                            </Link>
                            <a
                                href="#phase1-overview"
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-white/30 text-sm font-medium text-white/75 hover:text-white hover:border-white/60 transition"
                            >
                                了解接力线路
                                <ArrowRight className="h-4 w-4" />
                            </a>
                        </div>

                        <div className="mt-12 flex justify-center">
                            <div className="h-[2px] w-48 bg-gradient-to-r from-transparent via-white/45 to-transparent" />
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* 路线图 */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="text-center mb-8"
                    >
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">接力路线图</h2>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                            探索胶片漂流计划的完整路线，见证每一棒的精彩瞬间
                        </p>
                    </motion.div>

                    {/* 筛选组件 */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        viewport={{ once: true }}
                        className="mb-8"
                    >
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                            <div className="flex items-center justify-center gap-2 mb-4">
                                <Filter className="h-5 w-5 text-gray-600" />
                                <span className="text-sm font-medium text-gray-700">筛选小组</span>
                            </div>
                            <div className="flex flex-wrap justify-center gap-3">
                                <button
                                    onClick={() => handleGroupSelect('all')}
                                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                                        selectedGroup === 'all'
                                            ? 'bg-blue-500 text-white shadow-md'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    全部显示
                                </button>
                                {['A', 'B', 'C', 'D'].map((group) => (
                                    <button
                                        key={group}
                                        onClick={() => handleGroupSelect(group)}
                                        className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                                            selectedGroup === group
                                                ? 'bg-blue-500 text-white shadow-md'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                    >
                                        小组 {group}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                    
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        viewport={{ once: true }}
                        className="bg-white rounded-xl shadow-lg overflow-hidden"
                    >
                        <AmapComponent
                            relays={filteredProjectData.flatMap(group => group.relays)}
                            height="500px"
                            showRoute={true}
                            showAllMarkers={true}
                            groups={filteredProjectData}
                        />
                    </motion.div>
                </div>
            </section>

            {/* 项目介绍 */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">项目特色</h2>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                            每个小组由6位参与者组成，通过接力棒的形式，将摄影的接力棒从起点传递到终点，
                            每一棒都记录着不同地点、不同时间、不同视角下的精彩瞬间。
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            viewport={{ once: true }}
                            className="text-center p-6"
                        >
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                                <Camera className="h-8 w-8 text-blue-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">胶片摄影</h3>
                            <p className="text-gray-600">使用传统胶片相机，感受摄影的纯粹与质感</p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            viewport={{ once: true }}
                            className="text-center p-6"
                        >
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                                <MapPin className="h-8 w-8 text-green-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">地理接力</h3>
                            <p className="text-gray-600">跨越不同地域，记录各地的风土人情</p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            viewport={{ once: true }}
                            className="text-center p-6"
                        >
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
                                <Users className="h-8 w-8 text-purple-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">团队协作</h3>
                            <p className="text-gray-600">多人接力，共同创作，分享摄影的快乐</p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* 小组展示 */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">参与小组</h2>
                        <p className="text-lg text-gray-600">
                            四个小组，二十四位参与者，用镜头记录旅途中的每一个精彩瞬间
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {projectData.map((group, index) => (
                            <motion.div
                                key={group.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="group"
                            >
                                <Link to={`/group/${group.id}`}>
                                    <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                                        {/* 小组标识 */}
                                        <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br ${group.color} flex items-center justify-center text-white text-2xl font-bold`}>
                                            {group.id}
                                        </div>

                                        {/* 小组信息 */}
                                        <h3 className="text-xl font-semibold text-gray-900 mb-2 text-center">{group.name}</h3>
                                        <p className="text-gray-600 text-sm mb-4 text-center">{group.description}</p>

                                        {/* 路线信息 */}
                                        <div className="space-y-2 mb-4">
                                            <div className="flex items-center text-xs text-gray-500">
                                                <Compass className="h-3 w-3 mr-1" />
                                                <span className="truncate">{group.startLocation}</span>
                                                <ArrowRight className="h-3 w-3 mx-1" />
                                                <span className="truncate">{group.endLocation}</span>
                                            </div>
                                            <div className="flex items-center text-xs text-gray-500">
                                                <Users className="h-3 w-3 mr-1" />
                                                <span>{group.relays.length} 位参与者</span>
                                            </div>
                                        </div>

                                        {/* 进度条 */}
                                        <div className="mb-4">
                                            <div className="flex justify-between text-xs text-gray-500 mb-1">
                                                <span>进度</span>
                                                <span>100%</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className={`h-2 rounded-full bg-gradient-to-r ${group.color}`}
                                                    style={{ width: '100%' }}
                                                ></div>
                                            </div>
                                        </div>

                                        {/* 查看详情按钮 */}
                                        <div className="text-center">
                                            <span className="inline-flex items-center text-sm font-medium text-blue-600 group-hover:text-blue-700">
                                                查看详情
                                                <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 第二期预告 */}
            <section className="py-16 bg-gradient-to-br from-orange-50 to-red-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-orange-100 rounded-full mb-6">
                            <Film className="h-10 w-10 text-orange-600" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">{phase2Preview.title}</h2>
                        <p className="text-xl text-orange-600 font-semibold mb-4">{phase2Preview.subtitle}</p>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                            {phase2Preview.description}
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                        {/* 左侧：目标说明 */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            viewport={{ once: true }}
                            className="bg-white rounded-2xl p-8 shadow-lg"
                        >
                            <h3 className="text-2xl font-bold text-gray-900 mb-6">项目目标</h3>
                            <p className="text-lg text-gray-600 mb-6">{phase2Preview.goal}</p>

                            <div className="space-y-4">
                                {phase2Preview.features.map((feature, index) => (
                                    <div key={index} className="flex items-start">
                                        <div className="flex-shrink-0 w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center mr-3 mt-1">
                                            <span className="text-orange-600 text-sm font-bold">{index + 1}</span>
                                        </div>
                                        <span className="text-gray-700">{feature}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-8 p-4 bg-orange-50 rounded-xl">
                                <div className="flex items-center justify-between">
                                    <span className="text-orange-800 font-semibold">启动时间</span>
                                    <span className="text-orange-600 font-bold">{phase2Preview.startDate}</span>
                                </div>
                                <div className="mt-2 flex items-center justify-between">
                                    <span className="text-orange-800 font-semibold">当前状态</span>
                                    <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">
                                        {phase2Preview.status}
                                    </span>
                                </div>
                            </div>
                        </motion.div>

                        {/* 右侧：视觉元素 */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            viewport={{ once: true }}
                            className="text-center"
                        >
                            <div className="relative">
                                {/* 中国地图轮廓 */}
                                <div className="w-80 h-80 mx-auto bg-gradient-to-br from-orange-200 to-red-200 rounded-full flex items-center justify-center mb-6">
                                    <div className="text-6xl">🇨🇳</div>
                                </div>

                                {/* 城市点亮效果 */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="grid grid-cols-8 gap-1 w-64 h-64">
                                        {Array.from({ length: 64 }, (_, i) => (
                                            <div
                                                key={i}
                                                className={`w-2 h-2 rounded-full transition-all duration-500 ${i < 20 ? 'bg-orange-500 animate-pulse' : 'bg-gray-300'
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <p className="text-lg text-gray-600 mt-6">
                                点亮全国 <span className="text-orange-600 font-bold">333</span> 个地级市
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* 项目说明 */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8"
                    >
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">如何参与</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-3">参与者</h3>
                                <ul className="space-y-2 text-gray-600">
                                    <li>• 使用胶片相机拍摄</li>
                                    <li>• 记录拍摄地点和时间</li>
                                    <li>• 为照片添加个人留言</li>
                                    <li>• 将接力棒传递给下一位</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-3">观众</h3>
                                <ul className="space-y-2 text-gray-600">
                                    <li>• 浏览各小组的接力过程</li>
                                    <li>• 查看照片和留言内容</li>
                                    <li>• 在地图上追踪接力路线</li>
                                    <li>• 感受不同地域的文化魅力</li>
                                </ul>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default Home; 
