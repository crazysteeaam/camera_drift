/**
 * 省份卡片组件
 * 
 * 用于显示省份信息卡片，支持多语言
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Phase2Province } from '../config/phase2Data';
import { useTranslation } from '../i18n/hooks';

interface ProvinceCardProps {
  province: Phase2Province;
  index: number;
}

const ProvinceCard: React.FC<ProvinceCardProps> = ({ province, index }) => {
  const { t } = useTranslation();

  return (
    <motion.div
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
                {t('common.status.active')}
              </span>
            ) : province.completedGroups > 0 ? (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                {t('common.status.completed')}
              </span>
            ) : (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                <div className="w-2 h-2 bg-gray-400 rounded-full mr-1"></div>
                {t('common.status.planning')}
              </span>
            )}
          </div>
          
          {/* 省份标识 - 颜色与状态一致 */}
          <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center text-white text-xl font-bold ${
            province.completedGroups > 0
              ? 'bg-green-500'
              : province.activeGroups > 0
                ? 'bg-orange-500'
                : 'bg-gray-400'
          }`}>
            {province.shortName}
          </div>

          {/* 省份信息 */}
          <h3 className="text-xl font-semibold text-gray-900 mb-2 text-center">
            {t(`provinces.${province.id}.name`) as string || province.name}
          </h3>
          <p className="text-gray-600 text-sm mb-4 text-center flex-grow">
            {t(`provinces.${province.id}.description`) as string || province.description}
          </p>

          {/* 统计信息 */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900">{province.totalGroups}</div>
              <div className="text-xs text-gray-500">{t('common.labels.totalGroups')}</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-orange-600">{province.activeGroups}</div>
              <div className="text-xs text-gray-500">{t('common.labels.activeGroups')}</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">{province.completedGroups}</div>
              <div className="text-xs text-gray-500">{t('common.labels.completedGroups')}</div>
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
              {t('common.buttons.viewDetails')}
              <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProvinceCard;


