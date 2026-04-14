import React from 'react';
import { motion } from 'framer-motion';
import type { MeaningMonthStage } from '../../config/meaningData';
import { useTranslation } from '../../i18n/hooks';

export interface ProgressFilmstripProps {
  stage: MeaningMonthStage;
  stages: MeaningMonthStage[];
  labelForStage: (stage: MeaningMonthStage) => string;
  // 可选：用于展示阶段时间范围的小字
  rangeLabel?: Partial<Record<MeaningMonthStage, string>>;
}

const ProgressFilmstrip: React.FC<ProgressFilmstripProps> = ({ stage, stages, labelForStage, rangeLabel }) => {
  const { t } = useTranslation();
  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/80 bg-white/60 backdrop-blur px-4 py-4 shadow-[0_25px_70px_rgba(2,132,199,0.08)]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-2 bg-[repeating-linear-gradient(90deg,rgba(255,255,255,0.9)_0_16px,rgba(16,185,129,0.14)_16px_24px,rgba(255,255,255,0.9)_24px_40px)]" />
      <div className="flex items-center justify-between gap-3">
        <div className="text-sm font-bold text-slate-800">{t('meaning.filmstrip.title') as string}</div>
        <div className="text-xs text-slate-500">{t('meaning.filmstrip.phases') as string}</div>
      </div>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
        {stages.map((s, idx) => {
          const active = s === stage;
          return (
            <motion.div
              key={s}
              initial={false}
              animate={{
                scale: active ? 1.02 : 1,
                boxShadow: active ? '0 18px 45px rgba(16,185,129,0.25)' : 'none',
              }}
              transition={{ duration: 0.25, delay: 0.02 * idx }}
              className={`relative rounded-2xl border px-3 py-3 overflow-hidden ${
                active
                  ? 'bg-emerald-600 border-emerald-600 text-white'
                  : 'bg-white/50 border-slate-200 text-slate-700'
              }`}
            >
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_20%_20%,rgba(16,185,129,0.35),transparent_45%),radial-gradient(circle_at_80%_0%,rgba(59,130,246,0.25),transparent_50%)]" />
              <div className="relative">
                <div className="text-[0.7rem] uppercase tracking-[0.22em] font-semibold opacity-90">
                  {active ? (t('meaning.filmstrip.now') as string) : (t('meaning.filmstrip.phase') as string)}
                </div>
                <div className="mt-1 text-sm font-bold">{labelForStage(s)}</div>
                {rangeLabel && rangeLabel[s] ? (
                  <div className={`mt-1 text-[0.7rem] ${active ? 'text-white/90' : 'text-slate-500'}`}>{rangeLabel[s]}</div>
                ) : null}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressFilmstrip;

