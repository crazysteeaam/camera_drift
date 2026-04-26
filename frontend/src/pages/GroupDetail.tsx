import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Calendar, ArrowRight, Users, Compass, Map } from 'lucide-react';
import { projectData } from '../config/projectData';
import AmapComponent from '../components/AmapComponent';
import SmartImage from '../components/SmartImage';

const GroupDetail: React.FC = () => {
    const { groupId } = useParams<{ groupId: string }>();

    // 添加类型检查
    if (!groupId) {
        return <div>参数错误</div>;
    }

    const group = projectData.find(g => g.id === groupId);
    if (!group) {
        return <div>小组不存在</div>;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
            {/* 小组头部信息 */}
            <section className="py-16 bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className={`inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br ${group.color} rounded-full mb-6`}>
                            <span className="text-4xl font-bold">{groupId}</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">{group.name}</h1>
                        <p className="text-xl text-blue-200 mb-6">{group.description}</p>

                        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8">
                            <div className="flex items-center">
                                <Compass className="h-5 w-5 mr-2 text-blue-300" />
                                <span className="text-lg">{group.startLocation}</span>
                                <ArrowRight className="h-5 w-5 mx-2 text-blue-300" />
                                <span className="text-lg">{group.endLocation}</span>
                            </div>
                            <div className="flex items-center">
                                <Users className="h-5 w-5 mr-2 text-blue-300" />
                                <span className="text-lg">{group.relays.length}位参与者</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* 地图区域 */}
            <section className="py-12 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="text-center mb-8"
                    >
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">接力路线图</h2>
                        <p className="text-lg text-gray-600">追踪每一棒的传递路径，感受地理的变迁</p>
                    </motion.div>

                    {/* 地图组件 */}
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <div className="flex items-center">
                                <Map className="h-6 w-6 text-blue-500 mr-3" />
                                <h3 className="text-lg font-semibold text-gray-900">接力路线图</h3>
                            </div>
                            <Link
                                to={`/route-map/${groupId}`}
                                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
                            >
                                <Map className="h-4 w-4 mr-2" />
                                查看完整路线
                            </Link>
                        </div>
                        <div className="h-96">
                            <AmapComponent
                                relays={group.relays}
                                height="100%"
                                showRoute={true}
                                showAllMarkers={true}
                            />
                        </div>
                        <div className="p-4 bg-gray-50 border-t border-gray-200">
                            <div className="flex items-center justify-between text-sm text-gray-600">
                                <span>路线：{group.relays.map(r => r.location).join(' → ')}</span>
                                <span>{group.relays.length} 个接力点</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 接力棒列表 */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">接力棒详情</h2>
                        <p className="text-lg text-gray-600">每一棒都承载着独特的视角和故事</p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {group.relays.map((relay, index) => (
                            <motion.div
                                key={relay.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="group"
                            >
                                <Link to={`/group/${groupId}/relay/${relay.id}`}>
                                    <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                                        {/* 照片 */}
                                        <div className="aspect-square overflow-hidden">
                                            <SmartImage
                                                asset={relay.photos[0]} // 显示第一张照片作为封面
                                                variant="thumbnail"
                                                alt={relay.name}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                            />
                                        </div>

                                        {/* 信息 */}
                                        <div className="p-6">
                                            <div className="flex items-center justify-between mb-3">
                                                <h3 className="text-xl font-semibold text-gray-900">{relay.name}</h3>
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${group.color} text-white`}>
                                                    {relay.participant}
                                                </span>
                                            </div>

                                            <div className="space-y-2 mb-4">
                                                <div className="flex items-center text-sm text-gray-500">
                                                    <MapPin className="h-4 w-4 mr-2" />
                                                    <span>{relay.location}</span>
                                                </div>
                                                <div className="flex items-center text-sm text-gray-500">
                                                    <Calendar className="h-4 w-4 mr-2" />
                                                    <span>{relay.date}</span>
                                                </div>
                                            </div>

                                            <p className="text-gray-600 text-sm line-clamp-3">{relay.message}</p>

                                            {/* 照片数量 */}
                                            <div className="mt-3 text-xs text-gray-500">
                                                📸 {relay.photos.length} 张照片
                                            </div>

                                            {/* 查看详情 */}
                                            <div className="mt-4 text-center">
                                                <span className="inline-flex items-center text-sm font-medium text-blue-600 group-hover:text-blue-700">
                                                    查看详情
                                                    <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 小组统计 */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            viewport={{ once: true }}
                            className="text-center"
                        >
                            <div className="text-3xl font-bold text-blue-600 mb-2">{group.relays.length}</div>
                            <div className="text-gray-600">接力棒</div>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            viewport={{ once: true }}
                            className="text-center"
                        >
                            <div className="text-3xl font-bold text-green-600 mb-2">{group.relays.length}</div>
                            <div className="text-gray-600">摄影师</div>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            viewport={{ once: true }}
                            className="text-center"
                        >
                            <div className="text-3xl font-bold text-purple-600 mb-2">{new Set(group.relays.map(r => r.city)).size}</div>
                            <div className="text-gray-600">城市</div>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            viewport={{ once: true }}
                            className="text-center"
                        >
                            <div className="text-3xl font-bold text-orange-600 mb-2">15</div>
                            <div className="text-gray-600">天完成</div>
                        </motion.div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default GroupDetail;

