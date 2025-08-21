import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Users, Calendar, Map, Filter } from 'lucide-react';
import { projectData, Group } from '../config/projectData';
import AmapComponent from '../components/AmapComponent';

const RouteMap: React.FC = () => {
    const { groupId } = useParams<{ groupId: string }>();
    const [selectedGroup, setSelectedGroup] = useState<Group | null>(
        groupId ? projectData.find(g => g.id === groupId) || null : null
    );
    const [showAllGroups, setShowAllGroups] = useState(!groupId);
    const [mapHeight, setMapHeight] = useState('600px');

    const handleGroupSelect = (group: Group) => {
        setSelectedGroup(group);
        setShowAllGroups(false);
    };

    const showAllGroupsMap = () => {
        setSelectedGroup(null);
        setShowAllGroups(true);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
            {/* 返回按钮 */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
                <Link
                    to={groupId ? `/group/${groupId}` : '/'}
                    className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors duration-200"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    {groupId ? '返回小组' : '返回首页'}
                </Link>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* 页面标题 */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-8"
                >
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">接力路线图</h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        探索胶片漂流计划的完整路线，见证每一棒的精彩瞬间
                    </p>
                </motion.div>

                {/* 控制面板 */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="bg-white rounded-xl p-6 shadow-lg mb-8"
                >
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center space-x-4">
                            <h3 className="text-lg font-semibold text-gray-900">路线选择</h3>
                            <div className="flex space-x-2">
                                <button
                                    onClick={showAllGroupsMap}
                                    className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                                        showAllGroups
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    全部路线
                                </button>
                                {projectData.map((group) => (
                                    <button
                                        key={group.id}
                                        onClick={() => handleGroupSelect(group)}
                                        className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                                            selectedGroup?.id === group.id
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                    >
                                        {group.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                                <span className="text-sm text-gray-600">地图高度:</span>
                                <select
                                    value={mapHeight}
                                    onChange={(e) => setMapHeight(e.target.value)}
                                    className="px-3 py-1 border border-gray-300 rounded-md text-sm"
                                >
                                    <option value="400px">小</option>
                                    <option value="600px">中</option>
                                    <option value="800px">大</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* 地图区域 */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="bg-white rounded-xl p-6 shadow-lg mb-8"
                >
                    {showAllGroups ? (
                        <div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                                <Map className="h-6 w-6 mr-2 text-blue-500" />
                                全部接力路线
                            </h3>
                            <AmapComponent
                                relays={projectData.flatMap(group => group.relays)}
                                height={mapHeight}
                                showRoute={true}
                                showAllMarkers={true}
                            />
                        </div>
                    ) : selectedGroup ? (
                        <div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                                <Map className="h-6 w-6 mr-2 text-blue-500" />
                                {selectedGroup.name} 接力路线
                            </h3>
                            <AmapComponent
                                relays={selectedGroup.relays}
                                height={mapHeight}
                                showRoute={true}
                                showAllMarkers={true}
                            />
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-500">请选择一个小组查看路线</p>
                        </div>
                    )}
                </motion.div>

                {/* 路线统计信息 */}
                {selectedGroup && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-6"
                    >
                        <div className="bg-white rounded-xl p-6 shadow-lg">
                            <div className="flex items-center">
                                <Users className="h-8 w-8 text-blue-500 mr-3" />
                                <div>
                                    <p className="text-sm text-gray-600">参与者数量</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {selectedGroup.relays.length}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl p-6 shadow-lg">
                            <div className="flex items-center">
                                <MapPin className="h-8 w-8 text-green-500 mr-3" />
                                <div>
                                    <p className="text-sm text-gray-600">覆盖城市</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {new Set(selectedGroup.relays.map(r => r.city)).size}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl p-6 shadow-lg">
                            <div className="flex items-center">
                                <Calendar className="h-8 w-8 text-purple-500 mr-3" />
                                <div>
                                    <p className="text-sm text-gray-600">活动时长</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {(() => {
                                            const dates = selectedGroup.relays.map(r => new Date(r.date));
                                            const startDate = new Date(Math.min(...dates.map(d => d.getTime())));
                                            const endDate = new Date(Math.max(...dates.map(d => d.getTime())));
                                            const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
                                            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                                            return `${diffDays}天`;
                                        })()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* 路线详情列表 */}
                {selectedGroup && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.8 }}
                        className="bg-white rounded-xl p-6 shadow-lg mt-8"
                    >
                        <h3 className="text-xl font-semibold text-gray-900 mb-6">路线详情</h3>
                        <div className="space-y-4">
                            {selectedGroup.relays.map((relay, index) => (
                                <div
                                    key={relay.id}
                                    className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                                >
                                    <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold mr-4">
                                        {relay.id}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-gray-900">{relay.name}</h4>
                                        <p className="text-sm text-gray-600">
                                            {relay.participant} • {relay.location} • {relay.date}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-gray-500">下一站</p>
                                        <p className="font-medium text-gray-900">{relay.nextLocation}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default RouteMap;
