import React from 'react';
import { motion } from 'framer-motion';
import { ExtraGroup } from '../../config/extraData';
import ExtraMemberPreviewCard from './ExtraMemberPreviewCard';
import { useTranslation } from '../../i18n/hooks';
import { getExtraDisplayPlace } from '../../utils/extraPlaceNames';

export interface ExtraGroupSectionProps {
  group: ExtraGroup;
  index: number;
}

const ExtraGroupSection: React.FC<ExtraGroupSectionProps> = ({ group, index }) => {
  const { t, language } = useTranslation();
  const isZh = language === 'zh-CN';

  const members = group.members || [];
  const activeMembers = members.filter((member) => !member.isPlaceholder);
  const totalPhotos = activeMembers.reduce((sum, m) => sum + (m.photos?.length || 0), 0);
  const totalMessages = activeMembers.reduce((sum, m) => sum + (m.messageBook?.length || 0), 0);
  const locationLabel = activeMembers
    .map((member) => getExtraDisplayPlace(member.countryCode, member.country, member.city, language))
    .join(isZh ? ' / ' : ' / ');

  return (
    <section className="py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 md:space-y-14">
        {/* 顶部：行李牌 + 段落 */}
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)] gap-8 md:gap-12 items-start">
          {/* 行李牌 */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="relative"
          >
            <div className="absolute -top-8 left-10 h-10 w-1 bg-gradient-to-b from-slate-700 to-slate-500 rounded-full" />
            <div className="absolute -top-9 left-8 h-10 w-10 rounded-full border border-slate-300/80 bg-white/80 shadow-md" />

            <div className="relative mt-4 rounded-3xl bg-gradient-to-br from-slate-50 via-white to-slate-100 border border-slate-200/90 shadow-[0_22px_55px_rgba(15,23,42,0.28)] px-6 py-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-baseline gap-2">
                  <span className="text-xs uppercase tracking-[0.3em] text-slate-400">
                    {t('extra.timeline.groupLabel') as string}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-slate-900 text-slate-50 text-xs font-semibold">
                    {group.code}
                  </span>
                </div>
                <span className="text-[0.65rem] text-slate-400 uppercase tracking-[0.16em]">
                  {isZh ? 'EXTRA CHAPTER' : 'EXTRA CHAPTER'}
                </span>
              </div>

              <div>
                <p className="text-xs text-slate-500 mb-1">
                  {t('extra.group.luggageTag.place') as string}
                </p>
                <p className="text-sm font-semibold text-slate-900">
                  {locationLabel}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-500 mb-1">
                  {t('extra.group.luggageTag.theme') as string}
                </p>
                <p className="text-sm font-semibold text-slate-900">
                  {isZh ? group.zhTitle : group.enTitle}
                </p>
                <p className="mt-1 text-xs text-slate-600">
                  {isZh ? group.zhTagline : group.enTagline}
                </p>
              </div>
            </div>
          </motion.div>

          {/* 文案说明 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 + index * 0.12 }}
            className="space-y-4"
          >
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-slate-900">
              {isZh ? group.zhTitle : group.enTitle}
            </h2>
            <p className="text-sm md:text-base text-slate-700 leading-relaxed max-w-xl">
              {isZh ? group.zhTagline : group.enTagline}
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              <span className="px-3 py-1 rounded-full bg-slate-900/80 border border-white/10 text-xs text-slate-50/90">
                {isZh ? `${totalPhotos} 张底片` : `${totalPhotos} frames`}
              </span>
              <span className="px-3 py-1 rounded-full bg-slate-900/80 border border-white/10 text-xs text-slate-50/90">
                {isZh ? `${totalMessages} 页留言` : `${totalMessages} note pages`}
              </span>
            </div>
          </motion.div>
        </div>

        {/* 成员预览卡：点击进入“成员详情页”（胶片带 + 留言翻页本） */}
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400 font-medium">
            {t('extra.group.membersPreviewTitle') as string}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {members.map((member, memberIndex) => (
              <ExtraMemberPreviewCard
                key={member.id}
                groupId={group.id}
                member={member}
                accentColor={group.color}
                index={memberIndex}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExtraGroupSection;

