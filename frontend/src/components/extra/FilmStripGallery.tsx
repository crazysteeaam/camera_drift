import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import SmartImage from '../SmartImage';
import { useTranslation } from '../../i18n/hooks';
import { resolveImageAssetUrl, type ImageAsset } from '../../types/imageAsset';

export interface FilmStripGalleryProps {
  photos: ImageAsset[];
  accentColor?: string;
  mode?: 'full' | 'preview';
  showHint?: boolean;
  layout?: 'strip' | 'stage';
}

/**
 * 以“胶片带”方式展示 12 张照片（每张是一个胶片框，带两侧穿孔的视觉）。
 * 目标：让番外篇在细节上像你给的图二那种“胶片展带”气质。
 */
export const FilmStripGallery: React.FC<FilmStripGalleryProps> = ({
  photos,
  accentColor,
  mode = 'full',
  showHint = true,
  layout = 'strip'
}) => {
  const { t, language } = useTranslation();
  const isZh = language === 'zh-CN';
  const isPreview = mode === 'preview';
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartXRef = useRef<number | null>(null);

  useEffect(() => {
    setActiveIndex(0);
  }, [photos]);

  const visibleIndices = useMemo(() => {
    const indices: number[] = [];
    for (let index = Math.max(0, activeIndex - 2); index <= Math.min(photos.length - 1, activeIndex + 2); index += 1) {
      indices.push(index);
    }
    return indices;
  }, [activeIndex, photos.length]);

  const goTo = (nextIndex: number) => {
    if (nextIndex < 0 || nextIndex >= photos.length) return;
    setActiveIndex(nextIndex);
  };

  if (!photos || photos.length === 0) return null;

  if (!isPreview && layout === 'stage') {
    return (
      <div className="relative mt-2 overflow-hidden rounded-[2rem] border border-slate-800/80 bg-slate-950 shadow-[0_26px_65px_rgba(15,23,42,0.85)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_20%,rgba(56,189,248,0.12),transparent_40%),radial-gradient(circle_at_90%_80%,rgba(236,72,153,0.12),transparent_42%)]" />
        <div className="relative z-10 p-4 md:p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <p className="text-[0.68rem] uppercase tracking-[0.22em] text-slate-400">
              {isZh ? '胶卷舞台' : 'Film Stage'}
            </p>
            <div className="text-[0.68rem] text-slate-500">
              {String(activeIndex + 1).padStart(2, '0')} / {String(photos.length).padStart(2, '0')}
            </div>
          </div>

          <div
            className="relative overflow-hidden rounded-[1.6rem] border border-white/10 bg-slate-950/70 px-3 py-5 md:px-4 [touch-action:pan-x]"
            style={{ minHeight: 430 }}
            onTouchStart={(event) => {
              touchStartXRef.current = event.touches[0]?.clientX ?? null;
            }}
            onTouchEnd={(event) => {
              const startX = touchStartXRef.current;
              const endX = event.changedTouches[0]?.clientX ?? null;
              if (startX === null || endX === null) return;
              const delta = endX - startX;
              if (Math.abs(delta) < 40) return;
              goTo(activeIndex + (delta < 0 ? 1 : -1));
            }}
          >
            <div className="pointer-events-none absolute inset-x-6 top-0 h-2 rounded-full bg-gradient-to-r from-white/10 via-white/0 to-white/10" />
            <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-slate-950 to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-slate-950 to-transparent" />
            <div className="pointer-events-none absolute inset-x-8 bottom-6 h-20 rounded-full bg-cyan-400/8 blur-3xl" />

            <div className="relative flex min-h-[350px] items-center justify-center gap-3 md:min-h-[380px] md:gap-4">
              <button
                type="button"
                onClick={() => goTo(activeIndex - 1)}
                disabled={activeIndex === 0}
                className="z-10 hidden h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-200 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30 md:inline-flex"
              >
                ‹
              </button>

              <div className="relative flex min-w-0 flex-1 items-center justify-center [perspective:1600px] [transform-style:preserve-3d]">
                {visibleIndices.map((photoIndex) => {
                  const distance = Math.abs(photoIndex - activeIndex);
                  const isActive = photoIndex === activeIndex;
                  const direction = photoIndex < activeIndex ? -1 : photoIndex > activeIndex ? 1 : 0;
                  const widthClass =
                    distance === 0
                      ? 'w-[58vw] max-w-[420px] md:w-[360px] lg:w-[420px]'
                      : distance === 1
                        ? 'w-[22vw] max-w-[136px] md:w-[126px] lg:w-[142px]'
                        : 'hidden md:block md:w-[92px] lg:w-[102px]';
                  const xOffset =
                    distance === 0 ? 0 : distance === 1 ? direction * 150 : direction * 250;
                  const rotateY = distance === 0 ? 0 : direction * -52;
                  const zOffset = distance === 0 ? 130 : distance === 1 ? 10 : -120;
                  const yOffset = distance === 0 ? 0 : distance === 1 ? 8 : 18;

                  return (
                    <motion.button
                      key={`${resolveImageAssetUrl(photos[photoIndex])}-${photoIndex}`}
                      type="button"
                      onClick={() => goTo(photoIndex)}
                      animate={{
                        x: xOffset,
                        y: yOffset,
                        rotateY,
                        z: zOffset,
                        scale: distance === 0 ? 1 : distance === 1 ? 0.84 : 0.7,
                        opacity: distance === 0 ? 1 : distance === 1 ? 0.82 : 0.38
                      }}
                      transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
                      style={{ transformStyle: 'preserve-3d', transformOrigin: direction < 0 ? 'right center' : 'left center' }}
                      className={`group relative ${widthClass} aspect-[3/4] flex-shrink-0 overflow-hidden rounded-2xl border transition-all duration-300 ${
                        isActive
                          ? 'border-white/20 shadow-[0_18px_55px_rgba(15,23,42,0.55)]'
                          : 'border-white/10 opacity-75 hover:opacity-100'
                      }`}
                    >
                      <div className="absolute left-0 top-1/2 z-10 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border border-slate-700/80 bg-slate-950" />
                      <div className="absolute right-0 top-1/2 z-10 h-4 w-4 translate-x-1/2 -translate-y-1/2 rounded-full border border-slate-700/80 bg-slate-950" />
                      <SmartImage
                        asset={photos[photoIndex]}
                        variant={isActive ? 'preview' : 'thumbnail'}
                        alt={t('extra.member.miniCaption', { index: photoIndex + 1 }) as string}
                        className={`h-full w-full object-cover transition-transform duration-500 ${
                          isActive ? 'scale-[1.02]' : 'scale-100'
                        }`}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                      <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                        <span className="rounded-full bg-black/55 px-2 py-[2px] text-[0.65rem] text-white/90">
                          {String(photoIndex + 1).padStart(2, '0')}
                        </span>
                        {isActive ? (
                          <span className="rounded-full border border-white/10 bg-black/45 px-2 py-[2px] text-[0.58rem] uppercase tracking-[0.16em] text-slate-100/85">
                            {isZh ? '当前主片' : 'Center Frame'}
                          </span>
                        ) : null}
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => goTo(activeIndex + 1)}
                disabled={activeIndex === photos.length - 1}
                className="z-10 hidden h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-200 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30 md:inline-flex"
              >
                ›
              </button>
            </div>
          </div>

          <div className="mt-4 overflow-x-auto pb-2">
            <div className="flex min-w-max gap-2">
              {photos.map((path, index) => (
                <button
                  key={`${resolveImageAssetUrl(path)}-index-${index}`}
                  type="button"
                  onClick={() => goTo(index)}
                  className={`relative h-16 w-10 flex-shrink-0 overflow-hidden rounded-lg border transition ${
                    index === activeIndex
                      ? 'border-cyan-300/60 bg-cyan-300/10 shadow-[0_0_0_1px_rgba(103,232,249,0.2)]'
                      : 'border-white/10 bg-white/[0.03] hover:border-white/20'
                  }`}
                >
                  <div className="absolute left-0 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-slate-700/80 bg-slate-950" />
                  <div className="absolute right-0 top-1/2 h-2.5 w-2.5 translate-x-1/2 -translate-y-1/2 rounded-full border border-slate-700/80 bg-slate-950" />
                  <SmartImage
                    asset={path}
                    variant="thumbnail"
                    alt={t('extra.member.miniCaption', { index: index + 1 }) as string}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-black/55 py-[2px] text-center text-[0.55rem] text-white/85">
                    {String(index + 1).padStart(2, '0')}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {showHint ? (
            <p className="mt-2 text-[0.68rem] text-slate-400/90">
              {isZh ? '点击左右侧胶片或滑动切换，中间照片为当前主片' : 'Tap side frames or swipe to move the centered frame'}
            </p>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative mt-1 overflow-hidden border border-slate-800/80 shadow-[0_26px_65px_rgba(15,23,42,0.85)] ${
        isPreview ? 'rounded-2xl' : 'rounded-3xl'
      }`}
    >
      {/* 胶片带底色 */}
      <div className="absolute inset-0 bg-slate-900">
        <div className="absolute inset-0 opacity-90 bg-[radial-gradient(circle_at_10%_20%,rgba(56,189,248,0.16),transparent_45%),radial-gradient(circle_at_90%_80%,rgba(236,72,153,0.14),transparent_50%)]" />
      </div>

      <div className={`relative z-10 p-4 md:p-5 ${isPreview ? '' : 'transform -rotate-2'}`}>
        {/* 轻微“胶带/固定器”提示 */}
        {!isPreview && (
          <div className="absolute left-6 right-6 top-0 h-2 rounded-full bg-gradient-to-r from-white/10 via-white/0 to-white/10 blur-[0.2px]" />
        )}

        <div className="relative flex gap-3 overflow-x-auto pb-4">
              {photos.map((path, i) => (
            <motion.div
              key={resolveImageAssetUrl(path)}
              initial={{ opacity: 0, y: 16, rotate: (i % 3) - 1 }}
              whileInView={{ opacity: 1, y: 0, rotate: (i % 3) - 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: 0.02 * i }}
                  className={`group relative flex-shrink-0 aspect-[3/4] ${
                    isPreview ? 'w-16 md:w-16' : 'w-20 md:w-24'
                  } rounded-xl overflow-hidden bg-black/70 border border-white/10 shadow-[0_10px_25px_rgba(0,0,0,0.55)] ${
                i % 4 === 0 ? '-rotate-3' : i % 4 === 2 ? 'rotate-2' : ''
              }`}
            >
              {/* 两侧穿孔视觉 */}
              <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-slate-950 border border-slate-700/80" />
              <div className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-slate-950 border border-slate-700/80" />

              <SmartImage
                asset={path}
                variant="thumbnail"
                alt={t('extra.member.miniCaption', { index: i + 1 }) as string}
                className="w-full h-full object-cover"
              />

              {/* 框内微高光 */}
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-85" />

              <div className="absolute bottom-1 left-1 right-1 flex items-end justify-between gap-2">
                <span className="px-1.5 py-[2px] rounded-full bg-black/60 backdrop-blur-sm border border-white/10 text-[0.65rem] text-white/90">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="text-[0.55rem] uppercase tracking-[0.16em] text-slate-200/70">
                  {t('extra.member.miniCaption', { index: i + 1 }) as string}
                </span>
              </div>

              {/* hover 边缘强化 */}
              <div
                className="absolute inset-0 pointer-events-none border-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100 border-white/10"
              />
            </motion.div>
          ))}
        </div>

        {/* 翻页/展示提示（可选） */}
        {showHint && (
          <p className="mt-2 text-[0.65rem] text-slate-400/90">
            {isZh ? '拖动查看全部帧' : 'Scroll to view frames'}
          </p>
        )}
      </div>
    </div>
  );
};

export default FilmStripGallery;

