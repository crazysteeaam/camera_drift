import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '../../i18n/hooks';
import { ExtraGroup } from '../../config/extraData';

export interface ExtraHeroProps {
  groups: ExtraGroup[];
}

const ExtraHeroDecorGlobe2D: React.FC<{ groups: ExtraGroup[] }> = ({ groups }) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="relative h-64 w-64 overflow-hidden rounded-full border border-cyan-300/15 bg-[radial-gradient(circle_at_30%_20%,rgba(248,250,252,0.14),transparent_34%),radial-gradient(circle_at_50%_50%,rgba(8,47,73,0.8),rgba(2,6,23,1)_72%)] shadow-[0_30px_80px_rgba(15,23,42,0.9)] md:h-72 md:w-72">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(103,232,249,0.02),rgba(103,232,249,0.12),rgba(103,232,249,0.02))]" />
        <div className="absolute inset-0 opacity-60">
          <div className="absolute left-[18%] top-[26%] h-[18%] w-[28%] rounded-[48%_52%_45%_55%/58%_39%_61%_42%] bg-cyan-300/16 blur-[2px]" />
          <div className="absolute left-[44%] top-[34%] h-[14%] w-[19%] rounded-[55%_45%_58%_42%/44%_53%_47%_56%] bg-cyan-200/14 blur-[1px]" />
          <div className="absolute left-[57%] top-[46%] h-[20%] w-[26%] rounded-[58%_42%_39%_61%/52%_44%_56%_48%] bg-cyan-300/14 blur-[2px]" />
          <div className="absolute left-[26%] top-[56%] h-[11%] w-[16%] rounded-[48%_52%_51%_49%/47%_39%_61%_53%] bg-cyan-200/12 blur-[1px]" />
        </div>
        <div className="absolute inset-0 bg-[repeating-linear-gradient(180deg,transparent_0,transparent_10px,rgba(103,232,249,0.05)_11px,transparent_12px)] opacity-45" />
        <div className="absolute inset-[12%] rounded-full border border-slate-300/40 border-dashed" />
        <div className="absolute inset-[22%] rounded-full border border-slate-300/30 border-dashed" />
        <div className="absolute inset-[32%] rounded-full border border-slate-300/25 border-dashed" />

        <div className="absolute inset-[18%]">
          <div className="absolute inset-0 border border-slate-300/35 rounded-full" />
          <div className="absolute inset-0 border border-slate-300/35 rounded-full rotate-45" />
          <div className="absolute inset-0 border border-slate-300/35 rounded-full -rotate-45" />
        </div>

        {groups.map((g, index) => {
          const angle = (index / Math.max(1, groups.length)) * Math.PI * 2;
          const radius = 80;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius * 0.6;
          return (
            <motion.div
              key={g.id}
              className="absolute left-1/2 top-1/2"
              style={{
                transform: `translate(${x}px, ${y}px)`
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.08 }}
            >
              <div className="relative">
                <div className="h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.9)]" />
                <motion.div
                  className="absolute inset-0 rounded-full border border-cyan-300/60"
                  initial={{ opacity: 0, scale: 0.4 }}
                  animate={{ opacity: [0, 1, 0], scale: [0.6, 1.3, 1.8] }}
                  transition={{
                    duration: 2.4,
                    repeat: Infinity,
                    delay: index * 0.3
                  }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

const ExtraHero: React.FC<ExtraHeroProps> = ({ groups }) => {
  const { t } = useTranslation();

  const totalGroups = groups.length;
  const totalParticipants = groups.reduce((sum, g) => sum + g.members.length, 0);
  const totalCities = new Set(
    groups.flatMap((g) => g.members.map((m) => m.city))
  ).size;

  return (
    <section className="relative overflow-hidden py-20 md:py-24 text-slate-50">
      <div className="absolute inset-0 bg-slate-950" />
      <div className="absolute inset-0 opacity-60">
        <div className="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-sky-500/30 blur-3xl" />
        <div className="absolute -right-40 -bottom-40 h-96 w-96 rounded-full bg-pink-500/25 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(56,189,248,0.35),transparent_55%),radial-gradient(circle_at_85%_15%,rgba(236,72,153,0.35),transparent_55%),radial-gradient(circle_at_70%_80%,rgba(129,140,248,0.35),transparent_55%)]" />
      </div>

      <div className="absolute inset-0 opacity-[0.28] mix-blend-screen">
        <div className="w-[140%] h-[140%] -left-[20%] -top-[15%] absolute bg-[radial-gradient(circle_at_50%_0,rgba(148,163,184,0.7),transparent_60%),radial-gradient(circle_at_0_100%,rgba(15,23,42,0.9),transparent_60%),radial-gradient(circle_at_100%_100%,rgba(15,23,42,0.9),transparent_60%)]" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] gap-10 md:gap-12 items-center">
          {/* 文案区 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/40 bg-slate-900/60 px-3 py-1 text-xs font-medium text-sky-100/80 shadow-[0_0_0_1px_rgba(15,23,42,0.7)]">
              <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="uppercase tracking-[0.22em] text-[0.65rem]">
                {t('extra.hero.chip') as string}
              </span>
            </div>

            <h1 className="text-[2.5rem] md:text-[3.4rem] leading-[1.05] font-black tracking-[0.06em] drop-shadow-[0_18px_45px_rgba(15,23,42,0.8)]">
              {t('extra.hero.title') as string}
            </h1>

            <p className="text-sm md:text-lg text-slate-200/85 max-w-xl leading-relaxed">
              {t('extra.hero.subtitle') as string}
            </p>

            <p className="text-[0.85rem] md:text-sm text-slate-300/85 max-w-xl leading-relaxed">
              {t('extra.hero.description') as string}
            </p>

            <div className="mt-6 flex flex-wrap gap-4">
              <div className="flex items-center gap-2 rounded-2xl bg-slate-900/70 px-4 py-3 border border-slate-700/80 shadow-[0_18px_42px_rgba(15,23,42,0.8)]">
                <div className="flex flex-col">
                  <span className="text-xs uppercase tracking-[0.22em] text-slate-500">
                    {t('extra.hero.stats.cities') as string}
                  </span>
                  <span className="text-xl md:text-2xl font-semibold text-slate-50">
                    {totalCities}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-2xl bg-slate-900/70 px-4 py-3 border border-slate-700/80 shadow-[0_18px_42px_rgba(15,23,42,0.8)]">
                <div className="flex flex-col">
                  <span className="text-xs uppercase tracking-[0.22em] text-slate-500">
                    {t('extra.hero.stats.groups') as string}
                  </span>
                  <span className="text-xl md:text-2xl font-semibold text-slate-50">
                    {totalGroups}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-2xl bg-slate-900/70 px-4 py-3 border border-slate-700/80 shadow-[0_18px_42px_rgba(15,23,42,0.8)]">
                <div className="flex flex-col">
                  <span className="text-xs uppercase tracking-[0.22em] text-slate-500">
                    {t('extra.hero.stats.participants') as string}
                  </span>
                  <span className="text-xl md:text-2xl font-semibold text-slate-50">
                    {totalParticipants}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* 右侧：轻量世界球体视觉，真正交互放到下方工作台 */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1 }}
            className="relative h-72 md:h-80 lg:h-96"
          >
            <ExtraHeroDecorGlobe2D groups={groups} />
            <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full border border-slate-700/70 bg-slate-950/70 px-4 py-1.5 text-[0.7rem] text-slate-200/75 shadow-[0_18px_42px_rgba(15,23,42,0.75)]">
              {t('extra.hero.globe.hint') as string}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ExtraHero;

