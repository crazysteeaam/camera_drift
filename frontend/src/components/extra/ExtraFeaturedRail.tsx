import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from '../../i18n/hooks';
import type { ExtraGroupSummary } from '../../utils/extraGlobeMarkers';

export interface ExtraFeaturedRailProps {
  groups: ExtraGroupSummary[];
  darkMode?: boolean;
}

const ExtraFeaturedRail: React.FC<ExtraFeaturedRailProps> = ({ groups, darkMode = false }) => {
  const { t, language } = useTranslation();
  const isZh = language === 'zh-CN';

  return (
    <section
      className={`relative overflow-hidden py-24 md:py-28 ${
        darkMode
          ? 'bg-[linear-gradient(180deg,#020617_0%,#081120_42%,#020617_100%)]'
          : 'bg-[linear-gradient(180deg,#f8fafc_0%,#eef2ff_48%,#f8fafc_100%)]'
      }`}
    >
      <div className={`absolute inset-0 ${darkMode ? 'opacity-45' : 'opacity-80'}`}>
        <div className={`absolute left-[5%] top-16 h-56 w-56 rounded-full blur-3xl ${darkMode ? 'bg-sky-500/20' : 'bg-sky-200/40'}`} />
        <div className={`absolute right-[8%] top-24 h-72 w-72 rounded-full blur-3xl ${darkMode ? 'bg-fuchsia-500/14' : 'bg-fuchsia-200/30'}`} />
        <div className={`absolute bottom-0 left-1/2 h-52 w-52 -translate-x-1/2 rounded-full blur-3xl ${darkMode ? 'bg-indigo-500/16' : 'bg-indigo-200/30'}`} />
      </div>
      <div className={`absolute inset-0 ${darkMode ? 'opacity-[0.08]' : 'opacity-[0.18]'}`}>
        <div className={`absolute left-[8%] top-24 h-px w-40 ${darkMode ? 'bg-slate-600/80' : 'bg-slate-400/80'}`} />
        <div className={`absolute right-[10%] top-40 h-px w-52 ${darkMode ? 'bg-slate-600/70' : 'bg-slate-400/70'}`} />
        <div className={`absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-gradient-to-b from-transparent ${darkMode ? 'via-slate-700/80' : 'via-slate-300/80'} to-transparent`} />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative mb-12 text-center md:mb-16"
        >
          <div className={`mb-5 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[0.68rem] uppercase tracking-[0.32em] shadow-[0_16px_40px_rgba(15,23,42,0.08)] ${
            darkMode
              ? 'border border-white/10 bg-white/5 text-slate-400'
              : 'border border-slate-200/80 bg-white/85 text-slate-500'
          }`}>
            <span className={`inline-flex h-1.5 w-1.5 rounded-full ${darkMode ? 'bg-cyan-400' : 'bg-sky-400'}`} />
            {t('extra.featured.chip') as string}
          </div>
          <h2 className={`mb-4 text-3xl font-semibold tracking-[-0.03em] md:text-5xl ${darkMode ? 'text-slate-50' : 'text-slate-900'}`}>
            {t('extra.featured.title') as string}
          </h2>
          <p className={`mx-auto max-w-2xl text-sm leading-relaxed md:text-base ${darkMode ? 'text-slate-300/80' : 'text-slate-600'}`}>
            {t('extra.featured.description') as string}
          </p>
        </motion.div>

        <div className="space-y-8 lg:space-y-12">
          {groups.map((group, index) => {
            const alignRight = index % 2 === 1;

            return (
              <Link key={group.id} to={`/extra/group/${group.id}`} className="block">
                <motion.article
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.55, delay: index * 0.06 }}
                  className={`group relative grid gap-5 lg:grid-cols-[120px_minmax(0,1fr)] lg:gap-10 ${
                    alignRight ? 'lg:ml-auto lg:max-w-[84%]' : 'lg:max-w-[84%]'
                  }`}
                >
                  <div className="relative flex items-start lg:justify-center">
                    <div className="relative pl-2 lg:pl-0">
                      <div className={`text-[3.8rem] font-semibold leading-none tracking-[-0.08em] md:text-[5.5rem] ${darkMode ? 'text-slate-700/80' : 'text-slate-300/85'}`}>
                        {String(index + 1).padStart(2, '0')}
                      </div>
                      <div className="absolute left-0 top-12 h-2.5 w-2.5 rounded-full bg-sky-400 shadow-[0_0_0_10px_rgba(56,189,248,0.16)] lg:left-1/2 lg:-translate-x-1/2" />
                      <div className={`mt-3 text-[0.68rem] uppercase tracking-[0.28em] ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                        {group.code}
                      </div>
                    </div>
                  </div>

                  <div className={`relative overflow-hidden rounded-[2rem] p-6 backdrop-blur-md transition duration-300 group-hover:-translate-y-1.5 md:p-8 ${
                    darkMode
                      ? 'border border-white/10 bg-white/[0.04] shadow-[0_28px_90px_rgba(2,6,23,0.34)] group-hover:shadow-[0_38px_110px_rgba(2,6,23,0.45)]'
                      : 'border border-white/80 bg-white/82 shadow-[0_28px_90px_rgba(15,23,42,0.10)] group-hover:shadow-[0_38px_110px_rgba(15,23,42,0.14)]'
                  }`}>
                    <div className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent ${darkMode ? 'via-slate-700/80' : 'via-slate-300/80'} to-transparent`} />
                    <div className={`absolute -right-12 top-0 h-36 w-36 rounded-full blur-3xl transition duration-300 ${darkMode ? 'bg-sky-500/10 group-hover:bg-sky-500/15' : 'bg-sky-100/70 group-hover:bg-sky-200/75'}`} />
                    <div className={`absolute -left-12 bottom-0 h-32 w-32 rounded-full blur-3xl ${darkMode ? 'bg-indigo-500/10' : 'bg-indigo-100/50'}`} />

                    <div className="relative">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className={`rounded-full px-3 py-1 text-[0.68rem] uppercase tracking-[0.26em] ${darkMode ? 'bg-white/10 text-white' : 'bg-slate-950 text-white'}`}>
                          {t('extra.timeline.groupLabel') as string} {group.code}
                        </span>
                        <span className={`text-[0.72rem] uppercase tracking-[0.24em] ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                          {group.countries.join(' / ')}
                        </span>
                      </div>

                      <div className="mt-5 grid gap-5 md:grid-cols-[minmax(0,1.1fr)_minmax(220px,0.9fr)] md:gap-8">
                        <div>
                          <p className={`mb-2 text-xs uppercase tracking-[0.28em] ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                            {group.enTitle}
                          </p>
                          <h3 className={`max-w-xl text-[1.75rem] font-semibold leading-[1.05] tracking-[-0.04em] md:text-[2.2rem] ${darkMode ? 'text-slate-50' : 'text-slate-900'}`}>
                            {isZh ? group.zhTitle : group.enTitle}
                          </h3>
                          <p className={`mt-4 max-w-xl text-sm leading-7 md:text-[0.96rem] ${darkMode ? 'text-slate-300/80' : 'text-slate-600'}`}>
                            {isZh ? group.zhTagline : group.enTagline}
                          </p>
                        </div>

                        <div className={`rounded-[1.5rem] px-4 py-4 ${darkMode ? 'border border-white/8 bg-white/[0.03]' : 'border border-slate-100 bg-slate-50/85'}`}>
                          <p className={`text-[0.68rem] uppercase tracking-[0.24em] ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                            {t('extra.featured.currentStops') as string}
                          </p>
                          <p className={`mt-3 text-sm leading-7 ${darkMode ? 'text-slate-200/90' : 'text-slate-700'}`}>
                            {group.cities.join(' / ')}
                          </p>
                          <div className={`mt-4 flex items-center gap-3 text-xs ${darkMode ? 'text-slate-500' : 'text-slate-500'}`}>
                            <span>{group.activeCount} {t('extra.archive.status.active') as string}</span>
                            <span>{group.reservedCount} {t('extra.archive.status.reserved') as string}</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex flex-wrap gap-2.5">
                          {group.countries.map((country) => (
                            <span
                              key={`${group.id}-${country}`}
                              className={`rounded-full px-3.5 py-1.5 text-xs font-medium ${darkMode ? 'border border-white/10 bg-white/5 text-slate-200/85' : 'border border-slate-200 bg-white text-slate-600 shadow-[0_10px_24px_rgba(15,23,42,0.04)]'}`}
                            >
                              {country}
                            </span>
                          ))}
                          {Array.from({ length: group.reservedCount }).map((_, reservedIndex) => (
                            <span
                              key={`${group.id}-reserved-${reservedIndex}`}
                              className={`rounded-full px-3.5 py-1.5 text-xs font-medium ${darkMode ? 'border border-dashed border-white/15 bg-transparent text-slate-500' : 'border border-dashed border-slate-300 bg-white/70 text-slate-400'}`}
                            >
                              {isZh ? '预留席位' : 'Reserved Slot'}
                            </span>
                          ))}
                        </div>

                        <span className={`inline-flex items-center rounded-full px-4 py-2 text-xs font-medium uppercase tracking-[0.24em] ${darkMode ? 'bg-cyan-400/90 text-slate-950' : 'bg-slate-950 text-white'}`}>
                          {t('extra.featured.openGroup') as string}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.article>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ExtraFeaturedRail;
