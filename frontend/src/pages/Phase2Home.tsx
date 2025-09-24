import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    Camera,
    Users,
    ArrowRight,
    Film,
    Search,
    Filter,
    Star,
    Clock,
    CheckCircle,
    PlayCircle
} from 'lucide-react';
import { getAllProvinces } from '../config/phase2Data';
import Phase2MapComponent from '../components/Phase2MapComponent';

const Phase2Home: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'planning' | 'completed'>('all');
    const [filterGroup, setFilterGroup] = useState<string>('all');
    const [filterProvince, setFilterProvince] = useState<string>('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(8); // 每页显示8个省份（4列 * 2行）

    const provinces = getAllProvinces();

    // 过滤省份
    const filteredProvinces = provinces.filter(province => {
        const matchesSearch = province.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            province.shortName.toLowerCase().includes(searchTerm.toLowerCase());

        // 省份筛选
        const matchesProvince = filterProvince === 'all' || province.id === filterProvince;

        // 状态筛选
        let matchesStatus = true;
        if (filterStatus === 'active') {
            matchesStatus = province.activeGroups > 0;
        } else if (filterStatus === 'completed') {
            matchesStatus = province.completedGroups > 0;
        } else if (filterStatus === 'planning') {
            matchesStatus = province.activeGroups === 0 && province.completedGroups === 0;
        }

        // 如果有组数筛选，只显示有对应组的省份
        if (filterGroup !== 'all') {
            const hasMatchingGroup = province.groups.some(group => group.id === filterGroup);
            return matchesSearch && matchesProvince && matchesStatus && hasMatchingGroup;
        }

        return matchesSearch && matchesProvince && matchesStatus;
    });

    // 当状态为“全部”时，按小组字母顺序排序（无小组的排在最后）
    const sortedProvinces = React.useMemo(() => {
        if (filterStatus !== 'all') return filteredProvinces;
        const order = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
        const getRank = (p: any) => {
            if (!p.groups || p.groups.length === 0) return Number.MAX_SAFE_INTEGER;
            const firstId = p.groups
                .map((g: any) => g.id)
                .filter((id: string) => typeof id === 'string' && id.length > 0)
                .map((id: string) => id[0])
                .sort()[0];
            const idx = order.indexOf(firstId.toUpperCase());
            return idx >= 0 ? idx : Number.MAX_SAFE_INTEGER;
        };
        return [...filteredProvinces].sort((a, b) => getRank(a) - getRank(b));
    }, [filteredProvinces, filterStatus]);

    // 分页计算
    const totalPages = Math.ceil(sortedProvinces.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentProvinces = sortedProvinces.slice(startIndex, endIndex);

    // 重置页码当筛选条件改变时
    React.useEffect(() => {
        setCurrentPage(1);
    }, [filterStatus, filterGroup, filterProvince, searchTerm]);


    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
            {/* Hero Section */}
            <section className="relative py-20 bg-gradient-to-br from-orange-900 via-red-900 to-pink-900 text-white overflow-hidden">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-orange-500/20 rounded-full mb-6">
                            <Film className="h-10 w-10 text-orange-300" />
                        </div>
                        <h1 className="text-5xl md:text-6xl font-bold mb-8">
                            点亮中国 胶片漂流计划
                        </h1>
                        <p className="text-lg text-orange-100 max-w-4xl mx-auto leading-relaxed mb-8">
                            ⛳ 一台相机，六张胶片，一本笔记，它将穿越整个中国。<br />
                            我们开启了一个有点慢、有点傻、但特别浪漫的计划：<br />
                            把100台一次性胶片相机和100本手写留言本漂流到全国300多座城市，<br />
                            让每一个你，拍下属于自己城市的六帧生活。
                        </p>

                        {/* 快速操作按钮 */}
                        <div className="flex flex-wrap justify-center gap-4">
                            <Link
                                to="/phase2/gallery"
                                className="inline-flex items-center px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors duration-200"
                            >
                                <Camera className="h-5 w-5 mr-2" />
                                浏览作品集
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>





            {/* 全国地图 */}
            <section className="py-16 bg-gradient-to-r from-blue-50 to-indigo-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">全国地图</h2>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                            点亮中国每一座城市，查看胶片漂流计划的全国分布
                        </p>
                    </motion.div>

                    {/* 地图容器 */}
                    <div className="bg-white rounded-2xl p-8 shadow-lg">
                        <Phase2MapComponent
                            provinces={provinces}
                            onProvinceClick={(province) => {
                                // 点击省份时设置筛选状态，更新下方区域
                                setFilterProvince(province.id);
                            }}
                            highlightedProvinces={provinces
                                .filter(p => p.activeGroups > 0)
                                .map(p => p.id)
                            }
                        />
                    </div>
                </div>
            </section>

            {/* 搜索和筛选 */}
            <section className="py-8 bg-white/80 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                        {/* 搜索框 */}
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="搜索省份..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            />
                        </div>

                        {/* 状态筛选 */}
                        <div className="flex flex-wrap gap-2">
                            {[
                                { key: 'all', label: '全部', icon: Filter },
                                { key: 'active', label: '进行中', icon: PlayCircle },
                                { key: 'planning', label: '计划中', icon: Clock },
                                { key: 'completed', label: '已完成', icon: CheckCircle }
                            ].map(({ key, label, icon: Icon }) => (
                                <button
                                    key={key}
                                    onClick={() => setFilterStatus(key as any)}
                                    className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filterStatus === key
                                        ? 'bg-orange-500 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    <Icon className="h-4 w-4 mr-2" />
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* 省份筛选 */}
                    <div className="mt-4">
                        <div className="flex flex-wrap gap-2">
                            <span className="text-sm font-medium text-gray-700 mr-2">省份筛选：</span>
                            <button
                                onClick={() => setFilterProvince('all')}
                                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${filterProvince === 'all'
                                    ? 'bg-orange-500 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                全部
                            </button>
                            {provinces.map((province) => (
                                <button
                                    key={province.id}
                                    onClick={() => setFilterProvince(province.id)}
                                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${filterProvince === province.id
                                        ? 'bg-orange-500 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    {province.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* 字母组数筛选 */}
                    <div className="mt-4">
                        <div className="flex flex-wrap gap-2">
                            <span className="text-sm font-medium text-gray-700 mr-2">组数筛选：</span>
                            {[
                                { key: 'all', label: '全部' },
                                { key: 'A', label: 'A组' },
                                { key: 'B', label: 'B组' },
                                { key: 'C', label: 'C组' },
                                { key: 'D', label: 'D组' },
                                { key: 'E', label: 'E组' },
                                { key: 'F', label: 'F组' },
                                { key: 'G', label: 'G组' },
                                { key: 'H', label: 'H组' },
                                { key: 'I', label: 'I组' },
                                { key: 'J', label: 'J组' }
                            ].map(({ key, label }) => (
                                <button
                                    key={key}
                                    onClick={() => setFilterGroup(key)}
                                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${filterGroup === key
                                        ? 'bg-orange-500 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* 省份展示 */}
            <section id="province-section" className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">参与省份</h2>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                            点亮中国每一座城市，每个省份的小组数量不同，每个小组由6位参与者组成接力棒
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {currentProvinces.map((province, index) => (
                            <motion.div
                                key={province.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="group"
                            >
                                <Link to={`/phase2/province/${province.id}`}>
                                    <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 relative h-80 flex flex-col">
                                        {/* 状态标识 - 右上角 */}
                                        <div className="absolute top-4 right-4">
                                            {province.activeGroups > 0 ? (
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                                                    <div className="w-2 h-2 bg-orange-500 rounded-full mr-1"></div>
                                                    进行中
                                                </span>
                                            ) : province.completedGroups > 0 ? (
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                    <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                                                    已完成
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                    <div className="w-2 h-2 bg-gray-400 rounded-full mr-1"></div>
                                                    计划中
                                                </span>
                                            )}
                                        </div>
                                        {/* 省份标识 - 颜色与状态一致 */}
                                        <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center text-white text-xl font-bold ${province.completedGroups > 0
                                                ? 'bg-green-500'
                                                : province.activeGroups > 0
                                                    ? 'bg-orange-500'
                                                    : 'bg-gray-400'
                                            }`}>
                                            {province.shortName}
                                        </div>

                                        {/* 省份信息 */}
                                        <h3 className="text-xl font-semibold text-gray-900 mb-2 text-center">{province.name}</h3>
                                        <p className="text-gray-600 text-sm mb-4 text-center flex-grow">{province.description}</p>

                                        {/* 统计信息 */}
                                        <div className="grid grid-cols-3 gap-4 mb-4">
                                            <div className="text-center">
                                                <div className="text-lg font-bold text-gray-900">{province.totalGroups}</div>
                                                <div className="text-xs text-gray-500">总小组</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-lg font-bold text-orange-600">{province.activeGroups}</div>
                                                <div className="text-xs text-gray-500">进行中</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-lg font-bold text-green-600">{province.completedGroups}</div>
                                                <div className="text-xs text-gray-500">已完成</div>
                                            </div>
                                        </div>

                                        {/* 小组预览 */}
                                        <div className="mb-4">
                                            <div className="flex flex-wrap gap-1 justify-center">
                                                {province.groups.slice(0, 6).map((group) => (
                                                    <div
                                                        key={group.id}
                                                        className={`w-6 h-6 rounded-full bg-gradient-to-br ${group.color} flex items-center justify-center text-white text-xs font-bold`}
                                                        title={`${group.name} - ${group.description}`}
                                                    >
                                                        {group.id}
                                                    </div>
                                                ))}
                                                {province.groups.length > 6 && (
                                                    <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-xs font-bold">
                                                        +{province.groups.length - 6}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* 计划开启时间 */}
                                        {province.planningStartDate && province.activeGroups === 0 && province.completedGroups === 0 && (
                                            <div className="text-xs text-gray-500 text-center mb-2">
                                                {province.planningStartDate}
                                            </div>
                                        )}

                                        {/* 查看详情按钮 */}
                                        <div className="text-center mt-auto">
                                            <span className="inline-flex items-center text-sm font-medium text-orange-600 group-hover:text-orange-700">
                                                查看详情
                                                <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>

                    {/* 分页组件 */}
                    {totalPages > 1 && (
                        <div className="mt-12 flex justify-center">
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                    disabled={currentPage === 1}
                                    className="px-3 py-2 rounded-lg text-sm font-medium text-gray-500 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    上一页
                                </button>

                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                    <button
                                        key={page}
                                        onClick={() => setCurrentPage(page)}
                                        className={`px-3 py-2 rounded-lg text-sm font-medium ${currentPage === page
                                            ? 'bg-orange-500 text-white'
                                            : 'text-gray-700 bg-gray-100 hover:bg-gray-200'
                                            }`}
                                    >
                                        {page}
                                    </button>
                                ))}

                                <button
                                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                    disabled={currentPage === totalPages}
                                    className="px-3 py-2 rounded-lg text-sm font-medium text-gray-500 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    下一页
                                </button>
                            </div>
                        </div>
                    )}

                    {/* 分页信息 */}
                    <div className="mt-4 text-center text-sm text-gray-500">
                        显示 {startIndex + 1}-{Math.min(endIndex, sortedProvinces.length)} 共 {sortedProvinces.length} 个省份
                    </div>
                </div>
            </section>

            {/* 活动说明 */}
            <section className="py-16 bg-gradient-to-r from-orange-50 to-red-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="bg-white rounded-2xl p-8 shadow-lg"
                    >
                        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">活动说明</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* 左侧：参与流程 */}
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                                    <Camera className="h-6 w-6 mr-2 text-orange-600" />
                                    参与流程
                                </h3>
                                <div className="space-y-4">
                                    {[
                                        '每位参与者会收到 1 台一次性胶片相机（24 张底片）+ 1 本漂流笔记本',
                                        '你只需拍摄 6 张，并写点想说的话',
                                        '最多保留 5 天，拍完后联系发起人',
                                        '我们会告诉你下一个人的地址，你只需要付一点邮费即可',
                                        '最终我们会冲洗这些照片，扫描留言，在小红书发布完整展览'
                                    ].map((step, index) => (
                                        <div key={index} className="flex items-start">
                                            <div className="flex-shrink-0 w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center mr-3 mt-1">
                                                <span className="text-orange-600 text-sm font-bold">{index + 1}</span>
                                            </div>
                                            <span className="text-gray-700">{step}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* 右侧：参与条件 */}
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                                    <Users className="h-6 w-6 mr-2 text-red-600" />
                                    参与条件
                                </h3>
                                <div className="space-y-4">
                                    <p className="text-gray-700 mb-4">
                                        我们想点亮中国的每一座城市。不论你是：
                                    </p>
                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                        {['初中生', '大学生', '社畜', '骑手', '店主', '程序员', '作家'].map((role, index) => (
                                            <div key={index} className="flex items-center p-2 bg-gray-50 rounded-lg">
                                                <Star className="h-4 w-4 text-yellow-500 mr-2" />
                                                {role}
                                            </div>
                                        ))}
                                    </div>
                                    <p className="text-gray-700 text-sm mt-4">
                                        来自都市的高楼，也好，来自县城的小街巷，也好<br />
                                        你都值得拥有 1 次，属于自己的快门故事。
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* 小红书账号和二维码 */}
                        <div className="mt-8 p-6 bg-gradient-to-r from-pink-50 to-red-50 rounded-xl">
                            <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                                {/* 小红书账号信息 */}
                                <div className="flex flex-col items-center">
                                    <p className="text-lg text-gray-700 mb-2">
                                        关注我的小红书账号
                                    </p>
                                    <p className="text-2xl font-bold text-orange-600 mb-2">
                                        7527914100
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        后续推进进度和活动更新
                                    </p>
                                </div>

                                {/* 二维码预留位置 */}
                                <div className="flex flex-col items-center">
                                    <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                                        <div className="text-center">
                                            <Camera className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                                            <p className="text-xs text-gray-500">小红书二维码</p>
                                            <p className="text-xs text-gray-400">预留位置</p>
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2">扫码关注</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* 报名通道 */}
            <section className="py-16 bg-gradient-to-br from-orange-600 to-red-600 text-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl font-bold mb-4">报名通道现已开启</h2>
                        <p className="text-xl mb-6">
                            请认真填写以下信息，我们会根据时间、城市、节奏合理安排漂流路线。
                        </p>
                        <p className="text-lg mb-8">
                            如果你被选中，我们会在半个月内联系你。
                        </p>
                        <button className="inline-flex items-center px-8 py-4 bg-white text-orange-600 font-bold text-lg rounded-lg hover:bg-gray-100 transition-colors duration-200 shadow-lg">
                            <Camera className="h-6 w-6 mr-2" />
                            立即报名
                        </button>
                        <p className="text-orange-100 mt-4">
                            感谢你，让一台相机，看到世界。
                        </p>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default Phase2Home;
