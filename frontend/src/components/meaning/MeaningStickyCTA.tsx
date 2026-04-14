import React from 'react';
import { PlayCircle } from 'lucide-react';
import type { MeaningMonthStage } from '../../config/meaningData';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../../i18n/hooks';

export interface MeaningStickyCTAProps {
  stage: MeaningMonthStage;
  surveyUrl?: string;
  onRecruitClick?: () => void;
  scrollTargetId?: string;
  hubEntryHref?: string;
}

const MeaningStickyCTA: React.FC<MeaningStickyCTAProps> = ({
  stage,
  onRecruitClick,
  scrollTargetId,
  hubEntryHref = '/meaning/recruit',
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const label = (() => {
    if (stage === 'recruiting') return t('meaning.sticky.recruiting') as string;
    if (stage === 'inProgress') return t('meaning.sticky.inProgress') as string;
    if (stage === 'developing') return t('meaning.sticky.developing') as string;
    return t('meaning.sticky.published') as string;
  })();

  const hint = (() => {
    if (stage === 'recruiting') return t('meaning.sticky.hintRecruit') as string;
    if (stage === 'inProgress') return t('meaning.sticky.hintProgress') as string;
    if (stage === 'developing') return t('meaning.sticky.hintDevelop') as string;
    return t('meaning.sticky.hintPublished') as string;
  })();

  const handleClick = () => {
    if (stage === 'recruiting') {
      navigate(hubEntryHref);
      onRecruitClick?.();
      return;
    }

    if (scrollTargetId) {
      const el = document.getElementById(scrollTargetId);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="fixed left-0 right-0 bottom-0 z-50 pointer-events-none">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-4">
        <div className="pointer-events-auto rounded-3xl bg-white/70 backdrop-blur border border-white/80 shadow-[0_35px_120px_rgba(2,132,199,0.18)] p-4 md:p-5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex-1 text-left">
              <div className="text-xs uppercase tracking-[0.22em] text-slate-500 font-semibold">
                {t('meaning.sticky.chapter') as string}
              </div>
              <div className="mt-1 text-sm font-semibold text-slate-800">{t('meaning.sticky.subtitle') as string}</div>
            </div>

            <div className="w-full md:w-[360px] space-y-2">
              <button
                type="button"
                onClick={handleClick}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl font-semibold transition bg-emerald-600 hover:bg-emerald-700 text-white shadow-[0_18px_45px_rgba(5,150,105,0.22)]"
              >
                <PlayCircle className="h-5 w-5" />
                {label}
              </button>
              <div className="text-[0.7rem] text-slate-500">{hint}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeaningStickyCTA;
