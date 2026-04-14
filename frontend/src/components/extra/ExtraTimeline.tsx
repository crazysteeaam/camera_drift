import React from 'react';
import { motion } from 'framer-motion';
import { ExtraGroup } from '../../config/extraData';
import { useTranslation } from '../../i18n/hooks';
import { Link } from 'react-router-dom';

export interface ExtraTimelineProps {
  groups: ExtraGroup[];
}

const ExtraTimeline: React.FC<ExtraTimelineProps> = ({ groups }) => {
  const { t, language } = useTranslation();
  const isZh = language === 'zh-CN';
  const getActiveMembers = (group: ExtraGroup) => group.members.filter((member) => !member.isPlaceholder);

  return (
    <section className="relative overflow-hidden bg-[linear-gradient(180deg,#f8fafc_0%,#eef2ff_46%,#f8fafc_100%)] py-24 md:py-28">
      <div className="absolute inset-0 opacity-80">
        <div className="absolute left-[5%] top-16 h-56 w-56 rounded-full bg-sky-200/40 blur-3xl" />
        <div className="absolute right-[8%] top-24 h-72 w-72 rounded-full bg-fuchsia-200/30 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-52 w-52 -translate-x-1/2 rounded-full bg-indigo-200/30 blur-3xl" />
      </div>
      <div className="absolute inset-0 opacity-[0.18]">
        <div className="absolute left-[8%] top-24 h-px w-40 bg-slate-400/80" />
        <div className="absolute right-[10%] top-40 h-px w-52 bg-slate-400/70" />
        <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-slate-300/80 to-transparent" />
      </div>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative text-center mb-12 md:mb-16"
        >
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/85 px-4 py-1.5 text-[0.68rem] uppercase tracking-[0.32em] text-slate-500 shadow-[0_16px_40px_rgba(15,23,42,0.08)]">
            <span className="inline-flex h-1.5 w-1.5 rounded-full bg-sky-400" />
            Drift Timeline
          </div>
          <h2 className="text-3xl md:text-5xl font-semibold tracking-[-0.03em] text-slate-900 mb-4">
            {t('extra.timeline.title') as string}
          </h2>
          <p className="text-sm md:text-base leading-relaxed text-slate-600 max-w-2xl mx-auto">
            {t('extra.timeline.description') as string}
          </p>
        </motion.div>

        <div className="relative">
          <div className="space-y-8 lg:space-y-12">
            {groups.map((group, index) => {
              const activeMembers = getActiveMembers(group);
              const countries = activeMembers.map((member) => member.country);
              const cities = activeMembers.map((member) => member.city);
              const reservedCount = group.members.length - activeMembers.length;
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
                        <div className="text-[3.8rem] font-semibold leading-none tracking-[-0.08em] text-slate-300/85 md:text-[5.5rem]">
                          {String(index + 1).padStart(2, '0')}
                        </div>
                        <div className="absolute left-0 top-12 h-2.5 w-2.5 rounded-full bg-sky-400 shadow-[0_0_0_10px_rgba(56,189,248,0.16)] lg:left-1/2 lg:-translate-x-1/2" />
                        <div className="mt-3 text-[0.68rem] uppercase tracking-[0.28em] text-slate-400">
                          {group.code}
                        </div>
                      </div>
                    </div>

                    <div className="relative overflow-hidden rounded-[2rem] border border-white/80 bg-white/82 p-6 shadow-[0_28px_90px_rgba(15,23,42,0.10)] backdrop-blur-md transition duration-300 group-hover:-translate-y-1.5 group-hover:shadow-[0_38px_110px_rgba(15,23,42,0.14)] md:p-8">
                      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-slate-300/80 to-transparent" />
                      <div className="absolute -right-12 top-0 h-36 w-36 rounded-full bg-sky-100/70 blur-3xl transition duration-300 group-hover:bg-sky-200/75" />
                      <div className="absolute -left-12 bottom-0 h-32 w-32 rounded-full bg-indigo-100/50 blur-3xl" />

                      <div className="relative">
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="rounded-full bg-slate-950 px-3 py-1 text-[0.68rem] uppercase tracking-[0.26em] text-white">
                            {t('extra.timeline.groupLabel') as string} {group.code}
                          </span>
                          <span className="text-[0.72rem] uppercase tracking-[0.24em] text-slate-400">
                            {countries.join(' / ')}
                          </span>
                        </div>

                        <div className="mt-5 grid gap-5 md:grid-cols-[minmax(0,1.1fr)_minmax(220px,0.9fr)] md:gap-8">
                          <div>
                            <h3 className="max-w-xl text-[1.75rem] font-semibold leading-[1.05] tracking-[-0.04em] text-slate-900 md:text-[2.2rem]">
                              {isZh ? group.zhTitle : group.enTitle}
                            </h3>
                            <p className="mt-4 max-w-xl text-sm leading-7 text-slate-600 md:text-[0.96rem]">
                              {isZh ? group.zhTagline : group.enTagline}
                            </p>
                          </div>

                          <div className="rounded-[1.5rem] border border-slate-100 bg-slate-50/85 px-4 py-4">
                            <p className="text-[0.68rem] uppercase tracking-[0.24em] text-slate-400">
                              {isZh ? '当前落点' : 'Current Stops'}
                            </p>
                            <p className="mt-3 text-sm leading-7 text-slate-700">
                              {cities.join(' / ')}
                            </p>
                          </div>
                        </div>

                        <div className="mt-6 flex flex-wrap gap-2.5">
                          {countries.map((country) => (
                            <span
                              key={`${group.id}-${country}`}
                              className="rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-medium text-slate-600 shadow-[0_10px_24px_rgba(15,23,42,0.04)]"
                            >
                              {country}
                            </span>
                          ))}
                          {Array.from({ length: reservedCount }).map((_, reservedIndex) => (
                            <span
                              key={`${group.id}-reserved-${reservedIndex}`}
                              className="rounded-full border border-dashed border-slate-300 bg-white/70 px-3.5 py-1.5 text-xs font-medium text-slate-400"
                            >
                              {isZh ? '预留席位' : 'Reserved Slot'}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.article>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExtraTimeline;

