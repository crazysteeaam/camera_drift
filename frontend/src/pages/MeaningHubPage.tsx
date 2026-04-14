import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { ClipboardList, BookOpenCheck, HeartHandshake, ArrowRight } from 'lucide-react';
import { useTranslation } from '../i18n/hooks';
import {
  getMeaningMonths,
  getMeaningTimelineState,
  MEANING_SURVEY_URL,
  meaningRecruitContent,
  type MeaningMonthStage
} from '../config/meaningData';
import MeaningMomentsMosaic from '../components/meaning/MeaningMomentsMosaic';

const laneGlowStyle = `
@keyframes meaning-lane-sweep {
  0% { transform: translateX(-42%) skewX(-12deg); opacity: 0; }
  18% { opacity: 0.28; }
  52% { opacity: 0.2; }
  100% { transform: translateX(145%) skewX(-12deg); opacity: 0; }
}
`;

const MeaningHubPage: React.FC = () => {
  const { t, language } = useTranslation();
  const location = useLocation();
  const months = getMeaningMonths();
  const isZh = language === 'zh-CN';
  const allMoments = months.flatMap((month) => month.moments || []);
  const sponsors = Array.from(
    new Map(
      months.map((month) => [month.sponsor[isZh ? 'zh' : 'en'], month.sponsor[isZh ? 'zh' : 'en']])
    ).values()
  );

  const getStageLabel = (stage: MeaningMonthStage) => t(`meaning.stages.${stage}`) as string;
  useEffect(() => {
    if (location.hash !== '#meaning-entry') return;
    const el = document.getElementById('meaning-entry');
    if (el) {
      requestAnimationFrame(() => {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  }, [location.hash, location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-sky-50 to-indigo-50 text-slate-900">
      <section className="relative overflow-hidden pt-16 md:pt-20 pb-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_15%,rgba(16,185,129,0.35),transparent_45%),radial-gradient(circle_at_85%_10%,rgba(59,130,246,0.25),transparent_50%),radial-gradient(circle_at_75%_85%,rgba(99,102,241,0.22),transparent_55%)]" />
        <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-emerald-500/15 blur-3xl" />
        <div className="absolute -right-40 -bottom-40 h-96 w-96 rounded-full bg-indigo-500/15 blur-3xl" />
        <style>{laneGlowStyle}</style>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 md:pb-16">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-5xl mx-auto"
          >
            <div className="relative overflow-hidden rounded-[2.15rem] border border-white/80 bg-white/42 px-6 py-8 md:px-10 md:py-10 shadow-[0_30px_95px_rgba(2,132,199,0.10)] backdrop-blur-md text-center">
              <div className="pointer-events-none absolute inset-x-0 top-0 h-2 bg-[repeating-linear-gradient(90deg,rgba(255,255,255,0.8)_0_18px,rgba(16,185,129,0.16)_18px_24px,rgba(255,255,255,0.8)_24px_42px)] opacity-80" />
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200/70 bg-white/65 px-4 py-2 text-xs md:text-sm font-medium">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                {t('meaning.hub.heroEyebrow') as string}
              </div>
              <h1 className="mt-6 text-[2.2rem] md:text-[3.35rem] font-black tracking-tight leading-[1.04] drop-shadow-[0_18px_45px_rgba(16,185,129,0.25)]">
                {t('meaning.hub.heroTitle') as string}
              </h1>
              <div className="mt-5 space-y-3 text-sm md:text-base text-slate-600 leading-[1.85] max-w-2xl mx-auto">
                <p>{t('meaning.hub.heroLead') as string}</p>
                <p>{t('meaning.hub.heroLead2') as string}</p>
                <p>{t('meaning.hub.heroLead3') as string}</p>
              </div>
              <div className="mt-8 flex justify-center">
                <Link
                  to="/meaning/recruit"
                  className="inline-flex items-center gap-2 rounded-full border border-emerald-200/90 bg-white/78 px-5 py-2.5 text-sm font-semibold text-emerald-800 shadow-sm hover:bg-white transition"
                >
                  <BookOpenCheck className="h-4 w-4" />
                  {t('meaning.hub.fullPlaybookLink') as string}
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-emerald-200/80 bg-white/90">
                    <ArrowRight className="h-3.5 w-3.5 text-emerald-700" />
                  </span>
                </Link>
              </div>
            </div>

            <div className="mt-10 max-w-3xl mx-auto border-t border-emerald-200/35 pt-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
                {meaningRecruitContent.processSteps.slice(0, 4).map((step, idx) => (
                  <div key={idx} className="rounded-2xl border border-white/70 bg-white/45 backdrop-blur-sm px-4 py-3">
                    <p className="text-[0.68rem] uppercase tracking-[0.2em] text-emerald-700/80 font-semibold">
                      {String(idx + 1).padStart(2, '0')}
                    </p>
                    <p className="mt-1 text-xs text-slate-600 leading-relaxed line-clamp-3">{step[isZh ? 'zh' : 'en']}</p>
                  </div>
                ))}
              </div>

              <div className="mt-7 text-center">
                <p className="text-sm text-slate-500">
                  {t('meaning.hub.processNote') as string}
                </p>
                <div className="mt-3 flex items-center justify-center gap-4 text-sm font-semibold">
                  <a href="#meaning-months" className="text-emerald-700 hover:text-emerald-800 transition">
                    {t('meaning.hub.processLinkMonths') as string}
                  </a>
                  <span className="text-slate-300" aria-hidden="true">/</span>
                  <Link to="/meaning/recruit" className="text-emerald-700 hover:text-emerald-800 transition">
                    {t('meaning.hub.processLinkPlaybook') as string}
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-16"
            id="meaning-months"
          >
            <div className="flex items-center justify-between gap-4 mb-5">
              <div>
                <h2 className="text-xl md:text-2xl font-bold">{t('meaning.hub.timelineTitle') as string}</h2>
                <p className="mt-1 text-sm text-slate-600">{t('meaning.hub.timelineSub') as string}</p>
              </div>
              <div className="hidden md:flex items-center gap-2 rounded-full border border-emerald-200 bg-white/70 px-3 py-1 text-[0.68rem] font-semibold tracking-[0.16em] uppercase text-emerald-700">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                {t('meaning.hub.journeyPulse') as string}
              </div>
            </div>
            <div className="relative overflow-hidden rounded-[1.8rem]">
              <div
                className="pointer-events-none absolute inset-y-0 left-[-20%] w-[42%] bg-gradient-to-r from-transparent via-white/45 to-transparent"
                style={{ animation: 'meaning-lane-sweep 5.6s ease-in-out infinite' }}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {months.map((month, idx) => {
                  const timelineState = getMeaningTimelineState(month);
                  const isCurrent = timelineState === 'current';
                  const isFuture = timelineState === 'next';
                  const statusChip = isCurrent
                    ? (t('meaning.hub.timelineStatusCurrent') as string)
                    : isFuture
                    ? (t('meaning.hub.timelineStatusNext') as string)
                    : (t('meaning.hub.timelineStatusPast') as string);

                  return (
                    <motion.div
                      key={month.id}
                      initial={{ opacity: 0, y: 22, scale: 0.985 }}
                      whileInView={{ opacity: 1, y: 0, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.52, delay: 0.05 * idx }}
                    >
                      <Link
                        to={`/meaning/${month.id}`}
                        className={`group relative block rounded-3xl backdrop-blur-sm border overflow-hidden p-6 transition-all ${
                          isCurrent
                            ? 'bg-white/88 border-emerald-200/80 shadow-[0_35px_95px_rgba(16,185,129,0.22)]'
                            : isFuture
                            ? 'bg-white/78 border-sky-100/80 shadow-[0_22px_62px_rgba(2,132,199,0.10)] hover:shadow-[0_30px_75px_rgba(2,132,199,0.16)]'
                            : 'bg-white/65 border-white/80 shadow-[0_18px_52px_rgba(15,23,42,0.08)] hover:shadow-[0_24px_65px_rgba(15,23,42,0.12)]'
                        }`}
                        style={{ transitionDelay: `${idx * 40}ms` }}
                      >
                        <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-[radial-gradient(circle_at_25%_15%,rgba(16,185,129,0.18),transparent_36%),radial-gradient(circle_at_95%_10%,rgba(59,130,246,0.13),transparent_36%)]" />
                        <div
                          className={`absolute left-6 top-0 bottom-0 w-[2px] ${
                            isCurrent
                              ? 'bg-gradient-to-b from-emerald-400/0 via-emerald-500 to-emerald-400/0'
                              : isFuture
                              ? 'bg-gradient-to-b from-sky-300/0 via-sky-400/70 to-sky-300/0'
                              : 'bg-gradient-to-b from-slate-300/0 via-slate-300/70 to-slate-300/0'
                          }`}
                        />
                        <div className="relative pl-5">
                          <motion.div
                            animate={isCurrent ? { scale: [1, 1.1, 1], opacity: [1, 0.85, 1] } : undefined}
                            transition={isCurrent ? { duration: 1.8, repeat: Infinity, ease: 'easeInOut' } : undefined}
                            className={`absolute left-[-3px] top-1.5 h-3.5 w-3.5 rounded-full ${
                              isCurrent ? 'bg-emerald-500 ring-4 ring-emerald-100' : isFuture ? 'bg-sky-500 ring-4 ring-sky-100' : 'bg-slate-400 ring-4 ring-slate-100'
                            }`}
                          />
                          <div className="inline-flex items-center rounded-full border px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-slate-600 bg-white/80 border-slate-200">
                            {statusChip}
                          </div>
                          <div className="mt-3 flex items-center justify-between gap-4">
                            <div className="flex flex-col">
                              <span className="text-xs uppercase tracking-[0.22em] text-emerald-700/80">
                                {t('meaning.hub.monthEyebrow') as string}
                              </span>
                              <h3 className="mt-1 text-2xl font-bold">{isZh ? month.navLabel.zh : month.navLabel.en}</h3>
                            </div>
                            <div
                              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                                isCurrent
                                  ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                                  : isFuture
                                  ? 'bg-sky-50 border border-sky-200 text-sky-800'
                                  : 'bg-slate-100 border border-slate-200 text-slate-700'
                              }`}
                            >
                              {getStageLabel(month.stage)}
                            </div>
                          </div>
                          <p className="mt-4 text-sm text-slate-700 leading-relaxed line-clamp-3">
                            {isZh ? month.monthPage.cardTeaser.zh : month.monthPage.cardTeaser.en}
                          </p>
                          <div className="mt-6 flex items-center justify-between">
                            <span className="text-xs text-slate-500">{t('meaning.hub.monthCardHint') as string}</span>
                            <span className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700">
                              {t('meaning.hub.monthOpen') as string} <span aria-hidden="true">→</span>
                            </span>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-12"
          >
            <MeaningMomentsMosaic moments={allMoments} />
          </motion.div>

          <motion.div
            id="meaning-entry"
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.12 }}
            className="mt-12 max-w-2xl mx-auto"
          >
            <div className="rounded-3xl border border-slate-200/80 bg-white/80 backdrop-blur p-6 text-center shadow-[0_20px_55px_rgba(2,132,199,0.10)]">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-500 font-semibold">{t('meaning.hub.surveyEyebrow') as string}</p>
              <h3 className="mt-2 text-lg font-bold text-slate-900">{t('meaning.hub.surveyTitle') as string}</h3>
              <p className="mt-2 text-sm text-slate-600">{t('meaning.hub.surveyNote') as string}</p>
              <button
                type="button"
                onClick={() => window.open(MEANING_SURVEY_URL, '_blank', 'noopener,noreferrer')}
                className="mt-5 inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-[0_16px_40px_rgba(15,23,42,0.35)] transition hover:bg-slate-800"
              >
                <ClipboardList className="h-4 w-4 opacity-90" />
                {t('meaning.hub.surveyCta') as string}
              </button>
            </div>
          </motion.div>

          <div className="mt-10 text-center text-xs text-slate-500">{t('meaning.hub.hint') as string}</div>
        </div>

        <footer className="relative mt-14 w-full border-t border-slate-200/90 bg-gradient-to-r from-slate-900/[0.04] via-emerald-950/[0.06] to-slate-900/[0.04] backdrop-blur-md">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/25 to-transparent" />
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5 md:py-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 text-rose-600/90 shrink-0">
                <HeartHandshake className="h-4 w-4 shrink-0" />
                <span className="text-xs font-semibold tracking-[0.22em] uppercase text-slate-600">
                  {t('meaning.hub.thanksTitle') as string}
                </span>
                <span className="hidden md:inline text-slate-300" aria-hidden="true">
                  |
                </span>
                <span className="hidden md:inline text-[0.65rem] tracking-[0.18em] uppercase text-slate-500">
                  {t('meaning.hub.thanksPartner') as string}
                </span>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed md:flex-1 md:px-6">
                <span className="text-slate-500">{t('meaning.hub.footerThanksLine') as string}</span>
                <span className="mx-2 text-slate-300">·</span>
                <span className="text-slate-700">{meaningRecruitContent.sponsor[isZh ? 'zh' : 'en']}</span>
              </p>
              <div className="flex flex-wrap items-center justify-center md:justify-end gap-2 shrink-0">
                {sponsors.map((name) => (
                  <span
                    key={name}
                    className="inline-flex items-center rounded-full border border-white/60 bg-white/50 px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm"
                  >
                    {name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </footer>
      </section>
    </div>
  );
};

export default MeaningHubPage;
