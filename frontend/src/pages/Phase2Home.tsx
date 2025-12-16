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
import ProvinceCard from '../components/ProvinceCard';
import { useTranslation } from '../i18n/hooks';
import { useProvinceTranslation } from '../i18n/utils';

const Phase2Home: React.FC = () => {
    const { t, isLoading } = useTranslation(); // 使用翻译 Hook
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'planning' | 'completed'>('all');
    const [filterGroup, setFilterGroup] = useState<string>('all');
    const [filterProvince, setFilterProvince] = useState<string>('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(8); // 每页显示8个省份（4列 * 2行）

    const provinces = getAllProvinces();

    // 预先计算所有省份的翻译名称（避免在 map 中使用 hook）
    const provinceNames = React.useMemo(() => {
        const names: Record<string, string> = {};
        provinces.forEach(province => {
            const translated = t(`provinces.${province.id}.name`) as string;
            // 如果翻译不存在（返回的是 key），使用原始名称作为 fallback
            if (translated === `provinces.${province.id}.name`) {
                names[province.id] = province.name || province.id;
            } else {
                names[province.id] = translated;
            }
        });
        return names;
    }, [provinces, t]);

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

    // 当状态为"全部"时，按小组字母顺序排序（无小组的排在最后）
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

    // 如果翻译文件正在加载，显示加载状态
    // 注意：必须在所有 Hooks 调用之后才能进行早期返回
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                    <p className="text-gray-600">加载中...</p>
                </div>
            </div>
        );
    }


    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
            {/* Hero Section */}
            <section className="relative overflow-hidden py-24 text-white">
                <div className="absolute inset-0 bg-gradient-to-br from-[#42000f] via-[#7f1323] to-[#b91d47]" />
                <div
                    className="absolute inset-0 opacity-45"
                    style={{
                        backgroundImage:
                            'radial-gradient(circle at 15% 20%, rgba(248,113,113,0.35), transparent 45%), radial-gradient(circle at 85% 15%, rgba(253,186,116,0.4), transparent 50%), radial-gradient(circle at 70% 80%, rgba(244,114,182,0.35), transparent 50%)'
                    }}
                />
                <div className="absolute -left-28 -bottom-36 w-96 h-96 bg-orange-400/30 blur-3xl" />
                <div className="absolute -right-32 -top-24 w-96 h-96 bg-rose-500/35 blur-3xl" />

                <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        className="text-center"
                        initial={{ opacity: 0, y: 28 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="text-[3rem] md:text-[4.2rem] leading-tight font-extrabold tracking-[0.08em] text-white drop-shadow-[0_18px_45px_rgba(248,113,113,0.55)]">
                            {t('phase2.home.title')}
                        </h1>

                        <p className="mt-5 inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 border border-white/20 text-sm md:text-base font-medium text-rose-100/85">
                            <Star className="h-4 w-4 text-amber-200" />
                            {t('phase2.home.subtitle')}
                        </p>

                        <p className="mt-6 text-base md:text-lg text-rose-100/85 leading-relaxed max-w-3xl mx-auto">
                            {t('phase2.home.description')}
                        </p>

                        <div className="mt-10 flex flex-wrap justify-center gap-4">
                            <Link
                                to="/phase2/gallery"
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-red-500 via-amber-500 to-rose-500 font-medium shadow-lg shadow-rose-900/40 hover:from-red-400 hover:via-amber-400 hover:to-rose-400 transition-all duration-200"
                            >
                                <Camera className="h-5 w-5" />
                                {t('phase2.home.buttons.viewGallery')}
                            </Link>
                            <a
                                href="#phase2-provinces"
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-white/30 text-sm font-medium text-white/75 hover:text-white hover:border-white/60 transition"
                            >
                                {t('phase2.home.buttons.viewProgress')}
                                <ArrowRight className="h-4 w-4" />
                            </a>
                        </div>

                        <div className="mt-12 flex justify-center">
                            <div className="h-[2px] w-48 bg-gradient-to-r from-transparent via-white/45 to-transparent" />
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
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('phase2.home.sections.map.title')}</h2>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                            {t('phase2.home.sections.map.description')}
                        </p>
                    </motion.div>

                    {/* 地图容器 */}
                    <div>
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
                                placeholder={t('common.placeholders.searchProvince') as string}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            />
                        </div>

                        {/* 状态筛选 */}
                        <div className="flex flex-wrap gap-2">
                            {[
                                { key: 'all', label: t('phase2.home.filters.status.all'), icon: Filter },
                                { key: 'active', label: t('phase2.home.filters.status.active'), icon: PlayCircle },
                                { key: 'planning', label: t('phase2.home.filters.status.planning'), icon: Clock },
                                { key: 'completed', label: t('phase2.home.filters.status.completed'), icon: CheckCircle }
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
                            <span className="text-sm font-medium text-gray-700 mr-2">{t('phase2.home.filters.province')}：</span>
                            <button
                                onClick={() => setFilterProvince('all')}
                                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${filterProvince === 'all'
                                    ? 'bg-orange-500 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                {t('common.status.all')}
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
                                    {provinceNames[province.id] || province.name || province.id}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* 字母组数筛选 */}
                    <div className="mt-4">
                        <div className="flex flex-wrap gap-2">
                            <span className="text-sm font-medium text-gray-700 mr-2">{t('phase2.home.filters.group')}：</span>
                            {[
                                { key: 'all', label: t('common.groups.all') },
                                { key: 'A', label: t('common.groups.A') },
                                { key: 'B', label: t('common.groups.B') },
                                { key: 'C', label: t('common.groups.C') },
                                { key: 'D', label: t('common.groups.D') },
                                { key: 'E', label: t('common.groups.E') },
                                { key: 'F', label: t('common.groups.F') },
                                { key: 'G', label: t('common.groups.G') },
                                { key: 'H', label: t('common.groups.H') },
                                { key: 'I', label: t('common.groups.I') },
                                { key: 'J', label: t('common.groups.J') }
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
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('phase2.home.sections.provinces.title')}</h2>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                            {t('phase2.home.sections.provinces.description')}
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {currentProvinces.map((province, index) => (
                            <ProvinceCard key={province.id} province={province} index={index} />
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
                                    {t('common.pagination.previous')}
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
                                    {t('common.pagination.next')}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* 分页信息 */}
                    <div className="mt-4 text-center text-sm text-gray-500">
                        {t('common.pagination.showing', { 
                            start: startIndex + 1, 
                            end: Math.min(endIndex, sortedProvinces.length), 
                            total: sortedProvinces.length 
                        })}
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
                        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                            {t('phase2.home.sections.activity.title')}
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* 左侧：参与流程 */}
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                                    <Camera className="h-6 w-6 mr-2 text-orange-600" />
                                    {t('phase2.home.sections.activity.process.title')}
                                </h3>
                                <div className="space-y-4">
                                    {/* 使用 returnObjects 获取步骤数组 */}
                                    {(() => {
                                        const steps = t('phase2.home.sections.activity.process.steps', { returnObjects: true });
                                        const stepsArray = Array.isArray(steps) ? steps : [];
                                        return stepsArray.map((step, index) => (
                                            <div key={index} className="flex items-start">
                                                <div className="flex-shrink-0 w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center mr-3 mt-1">
                                                    <span className="text-orange-600 text-sm font-bold">{index + 1}</span>
                                                </div>
                                                <span className="text-gray-700">{step}</span>
                                            </div>
                                        ));
                                    })()}
                                </div>
                            </div>

                            {/* 右侧：参与条件 */}
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                                    <Users className="h-6 w-6 mr-2 text-red-600" />
                                    {t('phase2.home.sections.activity.conditions.title')}
                                </h3>
                                <div className="space-y-4">
                                    <p className="text-gray-700 mb-4">
                                        {t('phase2.home.sections.activity.conditions.description')}
                                    </p>
                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                        {/* 使用 returnObjects 获取角色数组 */}
                                        {(() => {
                                            const roles = t('phase2.home.sections.activity.conditions.roles', { returnObjects: true });
                                            const rolesArray = Array.isArray(roles) ? roles : [];
                                            return rolesArray.map((role, index) => (
                                                <div key={index} className="flex items-center p-2 bg-gray-50 rounded-lg">
                                                    <Star className="h-4 w-4 text-yellow-500 mr-2" />
                                                    {role}
                                                </div>
                                            ));
                                        })()}
                                    </div>
                                    {/* 结论文本，支持换行 */}
                                    <p className="text-gray-700 text-sm mt-4" style={{ whiteSpace: 'pre-line' }}>
                                        {t('phase2.home.sections.activity.conditions.conclusion')}
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
                                        {t('phase2.home.sections.activity.xiaohongshu.title')}
                                    </p>
                                    <p className="text-2xl font-bold text-orange-600 mb-2">
                                        {t('phase2.home.sections.activity.xiaohongshu.account')}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {t('phase2.home.sections.activity.xiaohongshu.description')}
                                    </p>
                                </div>

                                {/* 二维码预留位置 */}
                                <div className="flex flex-col items-center">
                                    <div className="w-36 h-36 bg-white rounded-xl shadow-inner border border-pink-200 overflow-hidden flex items-center justify-center">
                                        <img
                                            src="/scan.jpg"
                                            alt={t('phase2.home.sections.activity.xiaohongshu.scan') as string}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2">
                                        {t('phase2.home.sections.activity.xiaohongshu.scan')}
                                    </p>
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
                        <h2 className="text-3xl font-bold mb-4">
                            {t('phase2.home.sections.registration.title')}
                        </h2>
                        <p className="text-xl mb-6">
                            {t('phase2.home.sections.registration.description')}
                        </p>
                        <p className="text-lg mb-8">
                            {t('phase2.home.sections.registration.notice')}
                        </p>
                        <button className="inline-flex items-center px-8 py-4 bg-white text-orange-600 font-bold text-lg rounded-lg hover:bg-gray-100 transition-colors duration-200 shadow-lg">
                            <Camera className="h-6 w-6 mr-2" />
                            {t('phase2.home.sections.registration.button')}
                        </button>
                        <p className="text-orange-100 mt-4">
                            {t('phase2.home.sections.registration.thanks')}
                        </p>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default Phase2Home;
