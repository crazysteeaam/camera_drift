import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExtraMessagePage } from '../../config/extraData';
import SmartImage from '../SmartImage';
import { useTranslation } from '../../i18n/hooks';
import { getExtraDisplayPlace } from '../../utils/extraPlaceNames';

export interface MessageFlipBookProps {
  pages: ExtraMessagePage[];
  accentColor?: string; // tailwind gradient like 'from-sky-400 to-cyan-500'
  pageIndex: number;
  onPageChange: (nextIndex: number) => void;
}

const pageVariants = {
  enter: (direction: number) => ({
    y: direction > 0 ? 26 : -26,
    rotate: direction > 0 ? 2 : -2,
    opacity: 0
  }),
  center: {
    y: 0,
    rotate: 0,
    opacity: 1,
    transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] }
  },
  exit: (direction: number) => ({
    y: direction > 0 ? -18 : 18,
    rotate: direction > 0 ? -1.5 : 1.5,
    opacity: 0,
    transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] }
  })
};

export const MessageFlipBook: React.FC<MessageFlipBookProps> = ({
  pages,
  accentColor,
  pageIndex,
  onPageChange
}) => {
  const { t, language } = useTranslation();
  const [direction, setDirection] = useState(1);
  const pagesLength = pages?.length ?? 0;

  if (!pages || pagesLength === 0) {
    return null;
  }

  const current = pages[pageIndex];

  const goTo = (next: number) => {
    if (next < 0 || next >= pages.length) return;
    setDirection(next > pageIndex ? 1 : -1);
    onPageChange(next);
  };

  const isZh = language === 'zh-CN';

  return (
    <div className="w-full max-w-5xl">
      <div className="relative pt-4">
        <div className="pointer-events-none absolute left-8 right-8 top-8 h-[88%] rounded-[2rem] border border-[#e8dcc4]/60 bg-[#f7efd9]/55 shadow-[0_25px_55px_rgba(15,23,42,0.14)]" />
        <div className="pointer-events-none absolute left-4 right-12 top-4 h-[88%] rotate-[-1.2deg] rounded-[2rem] border border-[#eadfc9]/70 bg-[#fbf4e6]/70 shadow-[0_18px_45px_rgba(15,23,42,0.12)]" />
        <AnimatePresence custom={direction} initial={false} mode="wait">
          <motion.article
            key={current.id}
            custom={direction}
            variants={pageVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="relative rounded-[2rem] border border-[#eadfc9] bg-[linear-gradient(180deg,#fffdf7_0%,#fbf4e8_100%)] shadow-[0_30px_80px_rgba(15,23,42,0.18)]"
          >
            <div className="relative overflow-hidden rounded-[2rem]">
              <section className="relative p-4 md:p-6">
                <div
                  className={`absolute inset-0 rounded-b-[2rem] bg-gradient-to-br ${
                    accentColor || 'from-sky-200/35 via-indigo-100/35 to-pink-100/35'
                  } opacity-35`}
                />
                <div className="relative z-10">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[0.65rem] uppercase tracking-[0.28em] text-[#8e7d63]">
                        {t('extra.group.messageBookTitle') as string}
                      </p>
                      <h3 className="mt-2 text-lg font-semibold text-[#2f2417]">
                        {isZh ? `旅行手记 ${pageIndex + 1}` : `Travel Note ${pageIndex + 1}`}
                      </h3>
                    </div>
                    <span className="rounded-full border border-[#decfb3] bg-white/70 px-3 py-1 text-[0.72rem] text-[#6e5d48] shadow-sm">
                      {t('extra.messages.pageIndicator', {
                        current: pageIndex + 1,
                        total: pages.length
                      }) as string}
                    </span>
                  </div>

                  <div className="grid gap-5 rounded-[1.8rem] border border-[#eadfc9] bg-[linear-gradient(180deg,#fffaf0_0%,#f8efde_100%)] p-4 shadow-[0_20px_45px_rgba(15,23,42,0.16)] md:grid-cols-[minmax(280px,0.95fr)_minmax(260px,0.8fr)] md:p-5">
                    <div className="rounded-[1.5rem] border border-[#eadfc9] bg-[#f6ecdc] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
                      <div className="overflow-hidden rounded-[1.2rem] bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.9),rgba(245,236,220,0.92))] shadow-[0_16px_32px_rgba(15,23,42,0.1)]">
                        <SmartImage
                          originalPath={current.photo}
                          variant="preview"
                          alt={current.zhText || current.enText}
                          className="max-h-[62vh] min-h-[320px] w-full object-contain bg-transparent p-1 md:min-h-[520px]"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col justify-between rounded-[1.5rem] border border-[#e5d6bb] bg-white/72 p-5 shadow-[0_14px_30px_rgba(15,23,42,0.08)] backdrop-blur-sm md:p-6">
                      <div>
                        <div className="mb-4 flex flex-wrap items-center gap-2 text-[0.68rem] uppercase tracking-[0.18em] text-[#8e7d63]">
                          <span className="rounded-full border border-[#decfb3] bg-[#fff8eb] px-2.5 py-1">
                            {getExtraDisplayPlace(
                              current.place.countryCode,
                              current.place.country,
                              current.place.city,
                              language
                            )}
                          </span>
                          <span className="rounded-full border border-[#decfb3] bg-[#fff8eb] px-2.5 py-1">
                            {current.film}
                          </span>
                          {current.date ? (
                            <span className="rounded-full border border-[#decfb3] bg-[#fff8eb] px-2.5 py-1">
                              {current.date}
                            </span>
                          ) : null}
                        </div>

                        <div className="mb-4 rounded-[1.2rem] border border-[#eadfc9] bg-[linear-gradient(180deg,rgba(255,255,255,0.85),rgba(250,242,227,0.92))] px-4 py-3">
                          <p className="text-[0.7rem] uppercase tracking-[0.22em] text-[#9a8769]">
                            {isZh ? '留言摘录' : 'Note excerpt'}
                          </p>
                          <h4 className="mt-2 text-xl font-semibold leading-8 text-[#2f2417] md:text-[1.45rem]">
                            {isZh ? `第 ${pageIndex + 1} 页旅行手记` : `Travel note ${pageIndex + 1}`}
                          </h4>
                        </div>

                        <p
                          className={`whitespace-pre-line text-[1rem] leading-8 text-[#3c3023] md:text-[1.06rem] ${
                            isZh ? 'font-normal' : 'font-light'
                          }`}
                        >
                          {isZh ? current.zhText : current.enText}
                        </p>
                      </div>

                      <div className="mt-6 border-t border-[#eadfc9] pt-4 text-[0.74rem] uppercase tracking-[0.18em] text-[#a08e74]">
                        {isZh ? '把左侧留言图片当作原件阅读，右侧是整理后的文字记录。' : 'Read the left image as the original note, with the cleaned transcript on the right.'}
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => goTo(pageIndex - 1)}
                      disabled={pageIndex === 0}
                      className="rounded-full border border-[#decfb3] bg-white/80 px-4 py-2 text-sm text-[#5f513d] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {t('extra.messages.previous') as string}
                    </button>
                    <div className="text-[0.72rem] uppercase tracking-[0.22em] text-[#9f8d73]">
                      {isZh ? '以图片翻看每页留言' : 'Flip through image notes'}
                    </div>
                    <button
                      type="button"
                      onClick={() => goTo(pageIndex + 1)}
                      disabled={pageIndex === pages.length - 1}
                      className="rounded-full border border-[#decfb3] bg-white/80 px-4 py-2 text-sm text-[#5f513d] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {t('extra.messages.next') as string}
                    </button>
                  </div>
                </div> 
              </section>
            </div>
          </motion.article>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MessageFlipBook;

