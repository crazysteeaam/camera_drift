import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ClipboardList, ExternalLink, MessageCircle } from 'lucide-react';
import { meaningRecruitContent, MEANING_SURVEY_URL, meaningRecruitDirectSignup } from '../config/meaningData';
import { useTranslation } from '../i18n/hooks';

const MeaningRecruitPage: React.FC = () => {
  const navigate = useNavigate();
  const { language, t } = useTranslation();
  const isZh = language === 'zh-CN';
  const qrSrc = meaningRecruitDirectSignup.qrImageSrc?.trim();
  const profileUrl = meaningRecruitDirectSignup.profileUrl?.trim();
  const handleLine = meaningRecruitDirectSignup.handleLine[isZh ? 'zh' : 'en'];

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-sky-50 to-indigo-50 text-slate-900">
      <section className="py-10 md:py-14">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => navigate('/meaning')}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white/60 hover:bg-white transition border border-slate-200"
          >
            <ArrowLeft className="h-4 w-4" />
            {t('meaning.recruit.backHub') as string}
          </button>

          <motion.article
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative mt-8 overflow-hidden rounded-[1.8rem] border border-emerald-100/80 bg-white/70 backdrop-blur-md px-6 py-9 md:px-10 md:py-11 shadow-[0_28px_80px_rgba(2,132,199,0.08)]"
          >
            <div className="pointer-events-none absolute inset-x-0 top-0 h-2 bg-[repeating-linear-gradient(90deg,rgba(16,185,129,0.15)_0_14px,rgba(255,255,255,0.85)_14px_26px)]" />
            <header className="border-b border-emerald-100/90 pb-8">
              <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_220px] gap-6 items-start">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200/80 bg-emerald-50/70 px-3 py-1 text-xs font-semibold text-emerald-800">
                    {meaningRecruitContent.subtitle[isZh ? 'zh' : 'en']}
                  </div>
                  <h1 className="mt-4 text-[1.85rem] md:text-[2.35rem] font-black tracking-tight text-slate-900 leading-tight">
                    {meaningRecruitContent.title[isZh ? 'zh' : 'en']}
                  </h1>
                  <p className="mt-5 text-sm md:text-base text-slate-600 leading-[1.8]">
                    {t('meaning.recruit.activityLead') as string}
                  </p>
                </div>
                <div className="rounded-[1.6rem] border border-emerald-100/90 bg-gradient-to-br from-emerald-50/90 via-white/75 to-sky-50/75 px-5 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.85)]">
                  <p className="text-[0.65rem] uppercase tracking-[0.22em] text-emerald-800/70 font-semibold">
                    {isZh ? '卷边批注' : 'Margin note'}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">
                    {meaningRecruitContent.registrationParagraph[isZh ? 'zh' : 'en']}
                  </p>
                </div>
              </div>
            </header>

            <div className="mt-8 space-y-5 text-sm md:text-[0.95rem] text-slate-700 leading-[1.85]">
              {meaningRecruitContent.narrativeParagraphs.map((p, idx) => (
                <p key={idx}>{p[isZh ? 'zh' : 'en']}</p>
              ))}
            </div>

            <section className="mt-10 pt-10 border-t border-slate-200/80">
              <h2 className="text-lg md:text-xl font-bold text-slate-900">{t('meaning.recruit.sectionHow') as string}</h2>
              <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {meaningRecruitContent.processSteps.map((step, idx) => (
                  <div key={idx} className="rounded-2xl border border-slate-200/90 bg-white/75 p-4 shadow-sm">
                    <div className="text-[0.7rem] font-semibold tracking-[0.18em] text-emerald-700/90">
                      {String(idx + 1).padStart(2, '0')}
                    </div>
                    <p className="mt-2 text-sm text-slate-700 leading-relaxed">{step[isZh ? 'zh' : 'en']}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="mt-12 pt-10 border-t border-slate-200/80" id="signup">
              <div className="flex items-center gap-2 text-slate-900">
                <MessageCircle className="h-5 w-5 text-emerald-600 shrink-0" />
                <h2 className="text-lg md:text-xl font-bold">{t('meaning.recruit.sectionSignUp') as string}</h2>
              </div>
              <p className="mt-3 text-sm text-slate-600 leading-relaxed">{meaningRecruitContent.registrationParagraph[isZh ? 'zh' : 'en']}</p>

              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="rounded-2xl border border-rose-100/90 bg-gradient-to-br from-rose-50/80 to-white/90 p-5 md:p-6 shadow-sm">
                  <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-rose-700/90">
                    {t('meaning.recruit.directRegionLabel') as string}
                  </p>
                  <h3 className="mt-2 text-base font-bold text-slate-900">{t('meaning.recruit.xhsTitle') as string}</h3>
                  <p className="mt-2 text-sm text-slate-600 leading-relaxed">{t('meaning.recruit.directRegionBody') as string}</p>
                  <p className="mt-3 text-sm text-slate-600 leading-relaxed">{t('meaning.recruit.xhsBody') as string}</p>

                  <div className="mt-6 flex flex-col items-center">
                    {qrSrc ? (
                      <img
                        src={qrSrc}
                        alt={t('meaning.recruit.qrAlt') as string}
                        className="w-44 h-44 md:w-48 md:h-48 rounded-2xl border border-slate-200 bg-white object-cover shadow-inner"
                      />
                    ) : (
                      <div className="flex h-44 w-44 md:h-48 md:w-48 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-rose-200/80 bg-rose-50/40 px-4 text-center">
                        <p className="text-xs font-semibold text-rose-800/90">{t('meaning.recruit.qrPlaceholderTitle') as string}</p>
                        <p className="mt-2 text-[0.7rem] text-slate-500 leading-relaxed">{t('meaning.recruit.qrPlaceholderBody') as string}</p>
                      </div>
                    )}
                    <p className="mt-3 text-xs font-medium text-slate-500">{handleLine}</p>
                    {profileUrl ? (
                      <a
                        href={profileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-rose-700 hover:text-rose-900"
                      >
                        {t('meaning.recruit.openXhsProfile') as string}
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    ) : null}
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200/90 bg-slate-50/50 p-5 md:p-6 shadow-sm">
                  <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-slate-500">
                    {t('meaning.recruit.surveyRegionLabel') as string}
                  </p>
                  <h3 className="mt-2 text-base font-bold text-slate-900">{t('meaning.recruit.surveyCardTitle') as string}</h3>
                  <p className="mt-2 text-sm text-slate-600 leading-relaxed">{t('meaning.recruit.surveyRegionBody') as string}</p>
                  <ul className="mt-4 space-y-2 text-xs text-slate-600 leading-relaxed list-disc pl-4">
                    <li>{t('meaning.recruit.surveyBullet1') as string}</li>
                    <li>{t('meaning.recruit.surveyBullet2') as string}</li>
                  </ul>
                  <button
                    type="button"
                    onClick={() => window.open(MEANING_SURVEY_URL, '_blank', 'noopener,noreferrer')}
                    className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-3.5 text-sm font-semibold text-white shadow-[0_16px_40px_rgba(15,23,42,0.28)] transition hover:bg-slate-800"
                  >
                    <ClipboardList className="h-4 w-4 opacity-90" />
                    {t('meaning.recruit.ctaSurvey') as string}
                  </button>
                </div>
              </div>
            </section>

            <p className="mt-12 text-center text-sm text-slate-500 font-serif italic tracking-wide">
              {t('meaning.recruit.letterClosing') as string}
            </p>
          </motion.article>
        </div>
      </section>
    </div>
  );
};

export default MeaningRecruitPage;
