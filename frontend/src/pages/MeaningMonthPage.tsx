import React from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, PlayCircle } from 'lucide-react';
import { getMeaningMonthById, MEANING_SURVEY_URL, type MeaningVideoSource, type MeaningMonthStage } from '../config/meaningData';
import { useTranslation } from '../i18n/hooks';
import ProgressFilmstrip from '../components/meaning/ProgressFilmstrip';
import MeaningVideoPlayer from '../components/meaning/MeaningVideoPlayer';
import MeaningMemberCard from '../components/meaning/MeaningMemberCard';
import MeaningShowcaseSection from '../components/meaning/MeaningShowcaseSection';
import { resolveImageAssetUrl, type ImageAsset } from '../types/imageAsset';

const MeaningVideoHero: React.FC<{ sources: MeaningVideoSource[]; posterImage?: ImageAsset; videoSlot: string; videoPlaceholder: string }> = ({
  sources,
  posterImage,
  videoSlot,
  videoPlaceholder,
}) => {
  const hasHeroVideo = sources && sources.length > 0;
  const first = hasHeroVideo ? sources[0] : undefined;

  if (!hasHeroVideo) {
    return (
      <div className="relative w-full aspect-[16/10] md:aspect-[16/9] rounded-3xl overflow-hidden border border-emerald-100/60 bg-gradient-to-br from-emerald-50 via-sky-50 to-indigo-50 shadow-[0_30px_90px_rgba(2,132,199,0.12)]">
        <div className="absolute inset-0 opacity-90 bg-[radial-gradient(circle_at_20%_20%,rgba(16,185,129,0.18),transparent_45%),radial-gradient(circle_at_80%_0%,rgba(59,130,246,0.16),transparent_50%),radial-gradient(circle_at_90%_80%,rgba(99,102,241,0.18),transparent_50%)]" />
        {posterImage ? (
          <img src={resolveImageAssetUrl(posterImage)} alt="Hero poster" className="absolute inset-0 w-full h-full object-cover opacity-70" />
        ) : null}
        <div className="absolute inset-0 flex items-center justify-center text-center px-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/60 border border-white/70 text-xs font-medium text-slate-700">
              <PlayCircle className="h-4 w-4 text-emerald-600" />
              {videoSlot}
            </div>
            <p className="text-sm text-slate-600">
              {videoPlaceholder}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!first) return null;

  return (
    <div className="relative w-full aspect-[16/10] md:aspect-[16/9] rounded-3xl overflow-hidden border border-emerald-100/60 bg-white/70 shadow-[0_30px_90px_rgba(2,132,199,0.12)]">
      <MeaningVideoPlayer source={first} variant="hero" className="w-full h-full object-cover" />
    </div>
  );
};

const MeaningMonthPage: React.FC = () => {
  const navigate = useNavigate();
  const { monthId } = useParams<{ monthId: string }>();
  const { language, isLoading, t } = useTranslation();
  const isZh = language === 'zh-CN';

  const month = monthId ? getMeaningMonthById(monthId) : undefined;
  const stageLabel = (s: MeaningMonthStage) => t(`meaning.stages.${s}`) as string;
  const isRecruitingMonth = month?.stage === 'recruiting';

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-sky-50 to-indigo-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mb-4" />
          <p className="text-gray-600">{t('meaning.month.loading') as string}</p>
        </div>
      </div>
    );
  }

  if (!month) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-sky-50 to-indigo-50 text-slate-900">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl bg-white/70 border border-white/80 shadow-[0_25px_70px_rgba(2,132,199,0.10)] p-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <button
                type="button"
                onClick={() => navigate('/meaning')}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/70 hover:bg-white transition border border-slate-200"
              >
                <ArrowLeft className="h-4 w-4" />
                {t('meaning.member.back') as string}
              </button>
            </div>
            <h1 className="text-2xl font-bold">{t('meaning.month.notFoundTitle') as string}</h1>
            <p className="mt-3 text-slate-600">{t('meaning.month.notFoundBody') as string}</p>
          </motion.div>
        </div>
      </div>
    );
  }

  const mp = month.monthPage;

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-sky-50 to-indigo-50 text-slate-900">
      <section className="pt-10 md:pt-14 pb-16 md:pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => navigate('/meaning')}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white/60 hover:bg-white transition border border-slate-200"
            >
              <ArrowLeft className="h-4 w-4" />
              {t('meaning.month.backHub') as string}
            </button>
            <span className="px-3 py-1 rounded-full bg-white/70 border border-white/80 text-xs font-semibold text-emerald-700 whitespace-nowrap">
              {stageLabel(month.stage)}
            </span>
          </div>

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] gap-8 md:gap-10 items-start">
            <div className="space-y-6">
              <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                <div className="relative overflow-hidden rounded-[1.9rem] border border-white/80 bg-white/55 px-6 py-7 shadow-[0_25px_70px_rgba(2,132,199,0.08)] backdrop-blur-md">
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-2 bg-[repeating-linear-gradient(90deg,rgba(255,255,255,0.9)_0_16px,rgba(16,185,129,0.18)_16px_22px,rgba(255,255,255,0.9)_22px_38px)]" />
                  <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200/70 bg-white/60 px-4 py-2 text-xs md:text-sm font-medium">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    {mp.chip[isZh ? 'zh' : 'en']}
                  </div>
                  <h1 className="mt-4 text-[2.1rem] md:text-[2.95rem] font-black tracking-tight leading-[1.05] drop-shadow-[0_18px_45px_rgba(16,185,129,0.15)]">
                    {mp.title[isZh ? 'zh' : 'en']}
                  </h1>
                  <p className="mt-4 text-sm md:text-[0.95rem] text-slate-600 leading-[1.9] max-w-xl tracking-wide">
                    {mp.subline[isZh ? 'zh' : 'en']}
                  </p>
                </div>
              </motion.div>

              <div className="max-w-xl border-l-2 border-emerald-200/70 pl-4 py-0.5">
                <p className="text-sm text-slate-600 leading-relaxed">
                  {t('meaning.month.navBeforeHub') as string}
                  <Link to="/meaning#meaning-entry" className="font-semibold text-emerald-800/90 hover:underline decoration-emerald-600/40 underline-offset-4">
                    {t('meaning.month.navHub') as string}
                  </Link>
                  {t('meaning.month.navMid') as string}
                  <Link to="/meaning/recruit#signup" className="font-semibold text-emerald-800/90 hover:underline decoration-emerald-600/40 underline-offset-4">
                    {t('meaning.month.navPlaybook') as string}
                  </Link>
                  {t('meaning.month.navAfter') as string}
                </p>
              </div>

              <div id="month-participants" className="pt-2">
                <div className="flex items-center justify-between gap-4">
                  <h2 className="text-lg md:text-xl font-bold">{t('meaning.month.participantsTitle') as string}</h2>
                  <span className="hidden md:inline text-[0.65rem] uppercase tracking-[0.22em] text-slate-400 font-semibold">
                    {month.members.length}
                  </span>
                </div>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  {mp.participantsIntroOverride
                    ? mp.participantsIntroOverride[isZh ? 'zh' : 'en']
                    : month.members.length > 0
                      ? (t('meaning.month.participantsIntro') as string)
                      : month.participantSlotCount
                        ? (t('meaning.month.participantsIntroSlots') as string)
                        : (t('meaning.month.participantsIntroEmpty') as string)}
                </p>
                <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4">
                  {month.members.map((member, idx) => (
                    <MeaningMemberCard
                      key={member.id}
                      monthId={month.id}
                      member={member}
                      isZh={isZh}
                      index={idx}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <MeaningVideoHero
                sources={month.hero.heroVideoSources || []}
                posterImage={month.hero.posterImage}
                videoSlot={t('meaning.month.videoSlot') as string}
                videoPlaceholder={t('meaning.month.videoPlaceholder') as string}
              />

              <ProgressFilmstrip
                stage={month.stage}
                stages={['recruiting', 'inProgress', 'developing', 'published']}
                labelForStage={stageLabel}
                rangeLabel={month.stageTimeline.reduce((acc, item) => {
                  acc[item.stage] = item.rangeLabel ? item.rangeLabel[isZh ? 'zh' : 'en'] : '';
                  return acc;
                }, {} as Partial<Record<MeaningMonthStage, string>>)}
              />

              <div className="relative overflow-hidden rounded-3xl border border-emerald-100/70 bg-gradient-to-br from-white/75 via-white/60 to-emerald-50/35 backdrop-blur p-6 shadow-[0_22px_60px_rgba(16,185,129,0.08)]">
                <div className="pointer-events-none absolute right-4 top-4 h-16 w-16 rounded-full border border-emerald-100/80 opacity-60" />
                <div className="pointer-events-none absolute left-4 top-0 h-1.5 w-24 bg-[repeating-linear-gradient(90deg,rgba(16,185,129,0.18)_0_8px,transparent_8px_14px)]" />
                <p className="text-[0.65rem] uppercase tracking-[0.28em] text-emerald-800/60 font-semibold">
                  {t(isRecruitingMonth ? 'meaning.month.signUpEyebrowCurrent' : 'meaning.month.signUpEyebrowNext') as string}
                </p>
                <h3 className="mt-2 text-base font-bold text-slate-900">
                  {t(isRecruitingMonth ? 'meaning.month.signUpTitleCurrent' : 'meaning.month.signUpTitleNext') as string}
                </h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  {t(isRecruitingMonth ? 'meaning.month.signUpLeadCurrent' : 'meaning.month.signUpLeadNext') as string}
                </p>
                <ul className="mt-4 space-y-2.5 text-sm text-slate-600 leading-relaxed list-none">
                  <li className="flex gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-400/90" aria-hidden />
                    <span>{t('meaning.month.signUpDirect') as string}</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400/90" aria-hidden />
                    <span>{t('meaning.month.signUpSurvey') as string}</span>
                  </li>
                </ul>
                <div className="mt-5 flex flex-col sm:flex-row gap-2.5">
                  <Link
                    to="/meaning/recruit#signup"
                    className="inline-flex flex-1 items-center justify-center rounded-2xl bg-emerald-700 px-4 py-3 text-sm font-semibold text-white shadow-[0_14px_36px_rgba(5,150,105,0.22)] hover:bg-emerald-800 transition text-center"
                  >
                    {t(isRecruitingMonth ? 'meaning.month.signUpCtaPlaybookCurrent' : 'meaning.month.signUpCtaPlaybookNext') as string}
                  </Link>
                  <a
                    href={MEANING_SURVEY_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex flex-1 items-center justify-center rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm font-semibold text-slate-800 hover:bg-white transition text-center"
                  >
                    {t(isRecruitingMonth ? 'meaning.month.signUpCtaSurveyCurrent' : 'meaning.month.signUpCtaSurveyNext') as string}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {month.stage === 'published' ? <MeaningShowcaseSection isZh={isZh} showcase={month.showcase} /> : null}
        </div>
      </section>
    </div>
  );
};

export default MeaningMonthPage;
