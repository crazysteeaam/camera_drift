import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ExtraMember } from '../../config/extraData';
import { useTranslation } from '../../i18n/hooks';
import MessageFlipBook from './MessageFlipBook';
import FilmStripGallery from './FilmStripGallery';
import SmartImage from '../SmartImage';
import { getExtraDisplayPlace } from '../../utils/extraPlaceNames';

export interface ExtraMemberTrackProps {
  member: ExtraMember;
  accentColor: string;
  index: number;
}

const ExtraMemberTrack: React.FC<ExtraMemberTrackProps> = ({ member, accentColor, index }) => {
  const { t, language } = useTranslation();
  const isZh = language === 'zh-CN';

  const messagePages = useMemo(() => member.messageBook || [], [member.messageBook]);
  const [activeMessageIndex, setActiveMessageIndex] = useState(0);

  useEffect(() => {
    setActiveMessageIndex(0);
  }, [member.id]);

  const filmFromFirstNote = useMemo(() => {
    const first = messagePages[0];
    return first?.film || '';
  }, [messagePages]);

  return (
    <div className="flex flex-col gap-6">
      {/* 个人铭牌 */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: index * 0.08 }}
        className="relative overflow-hidden rounded-[1.8rem] border border-white/60 bg-white/85 shadow-[0_20px_45px_rgba(15,23,42,0.22)]"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-white/80 via-slate-50/90 to-slate-100/80" />
        <div className="absolute -right-12 -top-10 w-32 h-32 rounded-full bg-gradient-to-br from-slate-200/70 to-slate-50/10" />
        <div className="absolute -left-10 -bottom-16 w-36 h-36 rounded-full bg-gradient-to-tr from-sky-200/55 to-cyan-100/40" />

        <div className="relative z-10 p-5 md:p-6 flex items-center gap-4">
          <div
            className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${accentColor} text-white font-semibold text-lg shadow-lg`}
          >
            {member.name.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <div className="flex items-baseline gap-2">
              <h3 className="text-base md:text-lg font-semibold text-slate-900">{member.name}</h3>
              <span className="text-[0.7rem] uppercase tracking-[0.2em] text-slate-400">
                {t('extra.memberRole') as string}
              </span>
            </div>
            <p className="mt-1 text-[0.7rem] text-slate-600 font-medium">
              {getExtraDisplayPlace(member.countryCode, member.country, member.city, language)}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {isZh ? member.zhKeyword : member.enKeyword}
            </p>
            <p className="mt-2 text-xs md:text-sm text-slate-700">
              {isZh ? member.zhTagline : member.enTagline}
            </p>
          </div>
        </div>
      </motion.div>

      {/* 12 张照片：胶卷风格胶片带 */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.1 + index * 0.08 }}
        className="relative"
      >
        <div className="flex flex-col gap-4">
          <div className="flex items-baseline justify-between gap-2">
            <h4 className="text-xs md:text-sm font-medium tracking-[0.22em] uppercase text-slate-300">
              {t('extra.member.photosTitle', { name: member.name }) as string}
            </h4>
            <span className="text-[0.65rem] text-slate-500">
              12 EXP • ISO 400
            </span>
          </div>

          <FilmStripGallery photos={member.photos} accentColor={accentColor} layout="stage" />
        </div>
      </motion.section>

      {/* 留言缩略定位 + 翻页本 */}
      {messagePages && messagePages.length > 0 && (
        <section className="space-y-4">
          <div className="rounded-[1.8rem] border border-white/10 bg-white/5 px-4 py-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs uppercase tracking-[0.22em] text-slate-400 font-semibold">
                  {t('extra.group.messageBookTitle') as string}
                </p>
                <p className="mt-1 text-sm text-slate-200/90">
                  {messagePages.length}{' '}
                  {isZh
                    ? '页留言'
                    : 'note pages'}
                  {filmFromFirstNote ? (
                    <span className="text-slate-300/80 ml-2">
                      · {filmFromFirstNote}
                    </span>
                  ) : null}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">
                  {isZh ? '点击纸页缩略图定位到对应手记' : 'Tap a paper thumb to jump'}
                </span>
              </div>
            </div>

            <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
              {messagePages.map((p, i) => (
                <button
                  type="button"
                  key={p.id}
                  onClick={() => setActiveMessageIndex(i)}
                  className={[
                    'relative flex-shrink-0 overflow-hidden rounded-2xl border transition-all',
                    i === activeMessageIndex
                      ? 'border-[#e6d2aa]/80 bg-[#f9f0dc] shadow-[0_18px_45px_rgba(15,23,42,0.22)]'
                      : 'border-white/10 bg-white/[0.03] opacity-90 hover:opacity-100'
                  ].join(' ')}
                  style={{ width: 126, height: 158 }}
                  aria-label={`${isZh ? '留言' : 'Note'} ${i + 1}`}
                >
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,#fffdf7_0%,#f5ebd9_100%)]" />
                  <div className="relative flex h-full flex-col p-2">
                    <div className="overflow-hidden rounded-xl border border-[#e7d6b6] bg-[#f7eedf]">
                      <SmartImage
                        asset={p.photo}
                        variant="thumbnail"
                        alt={isZh ? `留言 ${i + 1}` : `Note ${i + 1}`}
                        className="h-[104px] w-full object-cover"
                      />
                    </div>
                    <div className="mt-2 flex items-center justify-between px-1 text-left">
                      <div>
                        <div className="text-[0.58rem] uppercase tracking-[0.18em] text-[#8e7d63]">
                          {isZh ? '留言页' : 'Note'}
                        </div>
                        <div className="mt-1 text-[0.72rem] text-[#3d3024]">
                          {String(i + 1).padStart(2, '0')}
                        </div>
                      </div>
                      <span className="rounded-full bg-[#2f2417]/85 px-2 py-[2px] text-[0.58rem] text-white">
                        {isZh ? '查看' : 'Open'}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <MessageFlipBook
            pages={messagePages}
            accentColor={accentColor}
            pageIndex={activeMessageIndex}
            onPageChange={setActiveMessageIndex}
          />
        </section>
      )}
    </div>
  );
};

export default ExtraMemberTrack;

