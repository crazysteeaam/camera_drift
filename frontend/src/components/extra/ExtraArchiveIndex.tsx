import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from '../../i18n/hooks';
import type { ExtraGroupSummary } from '../../utils/extraGlobeMarkers';
import { getExtraDisplayCountryName } from '../../utils/extraCountryNames';

export interface ExtraArchiveIndexProps {
  groups: ExtraGroupSummary[];
}

const ExtraArchiveIndex: React.FC<ExtraArchiveIndexProps> = ({ groups }) => {
  const { t, language } = useTranslation();
  const isZh = language === 'zh-CN';

  return (
    <section className="relative py-20 md:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="mb-10 flex flex-col gap-4 md:mb-12 md:flex-row md:items-end md:justify-between"
        >
          <div className="max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[0.68rem] uppercase tracking-[0.28em] text-slate-400 shadow-[0_12px_35px_rgba(2,6,23,0.2)]">
              <span className="inline-flex h-1.5 w-1.5 rounded-full bg-slate-500" />
              {t('extra.archive.chip') as string}
            </div>
            <h2 className="text-3xl font-semibold tracking-[-0.03em] text-slate-50 md:text-4xl">
              {t('extra.archive.title') as string}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-300/80 md:text-base">
              {t('extra.archive.description') as string}
            </p>
          </div>

          <div className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.22em] text-slate-400 shadow-[0_12px_35px_rgba(2,6,23,0.2)]">
            {groups.length} {t('extra.timeline.groupLabel') as string}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {groups.map((group, index) => (
            <Link key={group.id} to={`/extra/group/${group.id}`} className="block h-full">
              <motion.article
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: index * 0.03 }}
                className="group relative flex h-full flex-col overflow-hidden rounded-[1.7rem] border border-white/10 bg-white/[0.04] p-5 shadow-[0_18px_48px_rgba(2,6,23,0.22)] backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-cyan-300/20 hover:shadow-[0_28px_70px_rgba(2,6,23,0.32)]"
              >
                <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-sky-400 via-cyan-400 to-indigo-400 opacity-70" />

                <div className="mb-5 flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[0.65rem] uppercase tracking-[0.26em] text-slate-500">
                      {t('extra.timeline.groupLabel') as string}
                    </p>
                    <p className="mt-2 text-sm font-semibold text-slate-50">{group.code}</p>
                  </div>
                  <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[0.68rem] uppercase tracking-[0.22em] text-slate-400">
                    {group.activeCount} / {group.members.length} {t('extra.archive.status.active') as string}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold tracking-[-0.03em] text-slate-50">
                      {isZh ? group.zhTitle : group.enTitle}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-300/75">
                      {isZh ? group.zhTagline : group.enTagline}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {group.countries.map((country, countryIndex) => (
                      <span
                        key={`${group.id}-${country}-${countryIndex}`}
                        className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-200/85"
                      >
                        {getExtraDisplayCountryName(
                          group.countryCodes[countryIndex] || 'ZZ',
                          country,
                          language
                        )}
                      </span>
                    ))}
                    {Array.from({ length: group.reservedCount }).map((_, reservedIndex) => (
                      <span
                        key={`${group.id}-archive-reserved-${reservedIndex}`}
                        className="rounded-full border border-dashed border-white/15 bg-transparent px-3 py-1 text-xs font-medium text-slate-500"
                      >
                        {t('extra.archive.status.reserved') as string}
                      </span>
                    ))}
                  </div>

                  <div className="grid grid-cols-3 gap-3 rounded-[1.35rem] border border-white/8 bg-white/[0.03] px-4 py-4">
                    <div>
                      <p className="text-[0.65rem] uppercase tracking-[0.22em] text-slate-500">
                        {t('extra.workbench.stats.members') as string}
                      </p>
                      <p className="mt-2 text-lg font-semibold text-slate-50">{group.members.length}</p>
                    </div>
                    <div>
                      <p className="text-[0.65rem] uppercase tracking-[0.22em] text-slate-500">
                        {t('extra.workbench.stats.frames') as string}
                      </p>
                      <p className="mt-2 text-lg font-semibold text-slate-50">{group.frameCount}</p>
                    </div>
                    <div>
                      <p className="text-[0.65rem] uppercase tracking-[0.22em] text-slate-500">
                        {t('extra.workbench.stats.notes') as string}
                      </p>
                      <p className="mt-2 text-lg font-semibold text-slate-50">{group.messageCount}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 border-t border-white/8 pt-4">
                  <div className="mb-3 text-[0.65rem] uppercase tracking-[0.22em] text-slate-500">
                    {t('extra.archive.currentStops') as string}
                  </div>
                  <p className="line-clamp-2 text-sm leading-6 text-slate-200/85">{group.cities.join(' / ')}</p>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-white/8 pt-4">
                  <span className="text-xs uppercase tracking-[0.2em] text-slate-500">
                    {t('extra.archive.status.active') as string}
                  </span>
                  <span className="inline-flex items-center rounded-full bg-cyan-400/90 px-3 py-1.5 text-[0.68rem] uppercase tracking-[0.22em] text-slate-950">
                    {t('extra.archive.actions.openGroup') as string}
                  </span>
                </div>
              </motion.article>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExtraArchiveIndex;
