import React from 'react';
import type { MeaningMoment } from '../../config/meaningData';
import { PlayCircle } from 'lucide-react';
import MeaningVideoPlayer from './MeaningVideoPlayer';
import { useTranslation } from '../../i18n/hooks';

export interface MeaningMomentsMosaicProps {
  moments: MeaningMoment[];
}

const MeaningMomentCard: React.FC<{ moment: MeaningMoment; isZh: boolean; clipLabel: string }> = ({
  moment,
  isZh,
  clipLabel,
}) => {
  const source = moment.source ? moment.source[isZh ? 'zh' : 'en'] : '';

  if (moment.type === 'photo') {
    return (
      <div className="relative h-full rounded-2xl overflow-hidden border border-slate-200 bg-slate-50">
        <img src={moment.photoSrc} alt={isZh ? moment.zhCaption || 'photo' : moment.enCaption || 'photo'} className="w-full h-full object-cover opacity-90" />
        <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/60 via-black/0 to-transparent">
          {source ? <p className="mb-1 text-[0.65rem] uppercase tracking-[0.16em] text-white/70">{source}</p> : null}
          <p className="text-xs text-white/90 line-clamp-2">{isZh ? moment.zhCaption || '' : moment.enCaption || ''}</p>
        </div>
      </div>
    );
  }

  if (moment.type === 'text') {
    return (
      <div className="h-full rounded-2xl overflow-hidden border border-slate-200 bg-white/70 backdrop-blur-sm p-5 flex items-center">
        <div>
          {source ? <p className="mb-3 text-[0.65rem] uppercase tracking-[0.16em] text-emerald-700/80 font-semibold">{source}</p> : null}
          <p className="text-sm text-slate-800 leading-relaxed">{isZh ? moment.zhText : moment.enText}</p>
        </div>
      </div>
    );
  }

  const src = moment.videoSources[0];
  return (
    <div className="relative h-full rounded-2xl overflow-hidden border border-slate-200 bg-slate-50">
      {src ? <MeaningVideoPlayer source={src} className="w-full h-full object-cover" variant="inline" /> : null}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/70 border border-white/80 text-xs font-medium text-slate-700">
          <PlayCircle className="h-4 w-4 text-emerald-600" />
          {clipLabel}
        </div>
      </div>
      {source ? (
        <div className="absolute left-3 top-3 rounded-full bg-black/45 px-2.5 py-1 text-[0.65rem] uppercase tracking-[0.16em] text-white/85 backdrop-blur-sm">
          {source}
        </div>
      ) : null}
    </div>
  );
};

const MeaningMomentsMosaic: React.FC<MeaningMomentsMosaicProps> = ({ moments }) => {
  const { t, language } = useTranslation();
  const isZh = language === 'zh-CN';
  const clipLabel = t('meaning.mosaic.clipLabel') as string;

  const tags = React.useMemo(() => {
    const s = new Set<string>();
    for (const m of moments || []) {
      for (const tag of m.tags || []) s.add(tag);
    }
    return Array.from(s).sort();
  }, [moments]);

  const [activeTag, setActiveTag] = React.useState<string>('all');

  React.useEffect(() => {
    setActiveTag('all');
  }, [moments]);

  const filtered = React.useMemo(() => {
    if (!moments || moments.length === 0) return [];
    if (activeTag === 'all') return moments;
    return moments.filter((m) => (m.tags || []).includes(activeTag));
  }, [moments, activeTag]);

  const renderEmpty = () => {
    return Array.from({ length: 6 }).map((_, i) => (
      <div key={`empty-mosaic-${i}`} className="rounded-2xl border border-slate-200 bg-white/55 p-6 text-sm text-slate-500">
        {t('meaning.mosaic.empty') as string}
      </div>
    ));
  };

  return (
    <div className="mt-12">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold">{t('meaning.mosaic.title') as string}</h2>
          <p className="mt-2 text-sm text-slate-600">{t('meaning.mosaic.subtitle') as string}</p>
        </div>
        <div className="text-xs text-slate-500 whitespace-nowrap">{moments?.length ? `${moments.length}` : '0'}</div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setActiveTag('all')}
          className={`px-3 py-1.5 rounded-full border text-xs font-semibold transition ${
            activeTag === 'all' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white/60 border-slate-200 hover:bg-white'
          }`}
        >
          {t('meaning.mosaic.all') as string}
        </button>
        {tags.slice(0, 6).map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => setActiveTag(tag)}
            className={`px-3 py-1.5 rounded-full border text-xs font-semibold transition ${
              activeTag === tag ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white/60 border-slate-200 hover:bg-white'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        {(filtered && filtered.length > 0 ? filtered : null) ? (
          filtered.map((m) => <MeaningMomentCard key={m.id} moment={m} isZh={isZh} clipLabel={clipLabel} />)
        ) : (
          renderEmpty()
        )}
      </div>
    </div>
  );
};

export default MeaningMomentsMosaic;
