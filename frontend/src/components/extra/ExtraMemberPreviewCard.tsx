import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ExtraMember } from '../../config/extraData';
import FilmStripGallery from './FilmStripGallery';
import { useTranslation } from '../../i18n/hooks';
import { getExtraDisplayPlace } from '../../utils/extraPlaceNames';

export interface ExtraMemberPreviewCardProps {
  groupId: string;
  member: ExtraMember;
  accentColor: string;
  index: number;
  previewCount?: number;
}

const ExtraMemberPreviewCard: React.FC<ExtraMemberPreviewCardProps> = ({
  groupId,
  member,
  accentColor,
  index,
  previewCount = 3
}) => {
  const { t, language } = useTranslation();
  const isZh = language === 'zh-CN';

  const previewPhotos = (member.photos || []).slice(0, previewCount);
  const messageCount = member.messageBook?.length || 0;
  const photosCount = member.photos?.length || 0;
  const isPlaceholder = !!member.isPlaceholder;

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55, delay: index * 0.06 }}
      className="rounded-3xl bg-white/10 border border-white/10 shadow-[0_20px_60px_rgba(15,23,42,0.35)] overflow-hidden"
    >
      <div className="block p-5 md:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <div
                className={`h-12 w-12 rounded-full flex items-center justify-center font-semibold text-white bg-gradient-to-br ${accentColor} shadow-lg`}
              >
                {member.name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <div className="text-base md:text-lg font-semibold text-slate-50 truncate">
                  {isPlaceholder ? (isZh ? '预留位置' : 'Reserved Slot') : member.name}
                </div>
                <div className="text-xs text-slate-200/80 mt-1 truncate">
                  {getExtraDisplayPlace(member.countryCode, member.country, member.city, language)}
                </div>
              </div>
            </div>

            <div className="mt-3 text-sm text-slate-100/85">
              <span className="text-[0.65rem] uppercase tracking-[0.22em] text-slate-300/80 font-semibold">
                {isZh ? '关键词' : 'KEYWORD'}
              </span>
              <p className="mt-1 text-slate-50/90 font-medium">
                {isZh ? member.zhKeyword : member.enKeyword}
              </p>
              <p className="mt-1 text-[0.75rem] text-slate-200/75 leading-relaxed line-clamp-3">
                {isZh ? member.zhTagline : member.enTagline}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            <span className="px-3 py-1 rounded-full bg-white/10 border border-white/10 text-[0.7rem] text-slate-50/90">
              {t('extra.preview.photos', { count: photosCount }) as string}
            </span>
            <span className="px-3 py-1 rounded-full bg-white/10 border border-white/10 text-[0.7rem] text-slate-50/90">
              {t('extra.preview.messages', { count: messageCount }) as string}
            </span>
          </div>
        </div>

        {!isPlaceholder ? (
          <div className="mt-5">
            <FilmStripGallery photos={previewPhotos} accentColor={accentColor} mode="preview" showHint={false} />
          </div>
        ) : (
          <div className="mt-5 rounded-2xl border border-dashed border-white/15 bg-white/[0.03] px-4 py-8 text-center text-sm text-slate-300/70">
            {isZh ? '这个国家位置先预留，后续补入成员与底片。' : 'This country slot is reserved for a future member and film set.'}
          </div>
        )}

        <div className="mt-4 flex items-center justify-between gap-3">
          <span className="text-xs text-slate-200/80">
            {isPlaceholder
              ? isZh
                ? '等待成员加入后开放'
                : 'Available once a member joins'
              : isZh
                ? '打开查看底片与留言翻页本'
                : 'Open to see frames & flip notes'}
          </span>
          {isPlaceholder ? (
            <span className="inline-flex items-center justify-center px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-400">
              {isZh ? '已预留' : 'Reserved'}
            </span>
          ) : (
            <Link
              to={`/extra/group/${groupId}/member/${member.id}`}
              className="inline-flex items-center justify-center px-3 py-1 rounded-xl bg-white/10 border border-white/10 text-xs text-slate-50"
            >
              {t('extra.preview.openMember') as string}
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ExtraMemberPreviewCard;

