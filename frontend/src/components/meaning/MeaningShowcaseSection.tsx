import React from 'react';
import { PlayCircle } from 'lucide-react';
import FilmStripGallery from '../extra/FilmStripGallery';
import type { MeaningFilmPack, MeaningShowcaseMessage, MeaningShowcaseVideo } from '../../config/meaningData';
import { useTranslation } from '../../i18n/hooks';
import MeaningVideoPlayer from './MeaningVideoPlayer';

export interface MeaningShowcaseSectionProps {
  isZh: boolean;
  showcase?: {
    films?: MeaningFilmPack[];
    videos?: MeaningShowcaseVideo[];
    messages?: MeaningShowcaseMessage[];
  };
}

const MeaningShowcaseSection: React.FC<MeaningShowcaseSectionProps> = ({ isZh, showcase }) => {
  const { t } = useTranslation();
  const films = showcase?.films || [];
  const videos = showcase?.videos || [];
  const messages = showcase?.messages || [];

  const totalFilmPhotos = films.reduce((sum, f) => sum + (f.photos?.length || 0), 0);
  const hasAny = totalFilmPhotos > 0 || videos.length > 0 || messages.length > 0;

  if (!showcase || !hasAny) {
    return (
      <div id="showcase" className="mt-16">
        <h2 className="text-xl font-bold">{t('meaning.showcase.title') as string}</h2>
        <p className="mt-2 text-sm text-slate-600">{t('meaning.showcase.empty') as string}</p>
      </div>
    );
  }

  return (
    <div id="showcase" className="mt-16">
      <h2 className="text-xl font-bold">{t('meaning.showcase.titleFull') as string}</h2>
      <p className="mt-2 text-sm text-slate-600">{t('meaning.showcase.subtitle') as string}</p>

      {/* Films */}
      {films.length > 0 ? (
        <section className="mt-8">
          <h3 className="text-lg font-bold">{t('meaning.showcase.filmPacks') as string}</h3>
          <div className="mt-5 space-y-6">
            {films.map((f) => (
              <div key={f.id} className="rounded-3xl border border-slate-200 bg-white/60 backdrop-blur p-6">
                <div className="flex items-center justify-between gap-4 mb-4">
                  <div>
                    <div className="text-xs uppercase tracking-[0.22em] text-slate-500 font-semibold">
                      {t('meaning.showcase.filmLabel') as string}
                    </div>
                    <div className="mt-1 text-sm font-bold text-slate-800">{isZh ? f.title.zh : f.title.en}</div>
                  </div>
                  <div className="text-xs text-slate-500">{f.photos?.length || 0} frames</div>
                </div>
                {f.photos && f.photos.length > 0 ? (
                  <div>
                    {/* FilmStripGallery 对空数组会直接返回 null，这里做了保护 */}
                    <FilmStripGallery photos={f.photos} mode="full" showHint={false} />
                  </div>
                ) : (
                  <div className="text-sm text-slate-500">{t('meaning.showcase.noPhotos') as string}</div>
                )}
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {/* Videos */}
      {videos.length > 0 ? (
        <section className="mt-12">
          <h3 className="text-lg font-bold">{t('meaning.showcase.videoMoments') as string}</h3>
          <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-5">
            {videos.map((v) => {
              const first = v.sources[0];
              return (
                <div key={v.id} className="rounded-3xl border border-slate-200 bg-white/60 backdrop-blur p-6">
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <div className="text-sm font-bold text-slate-800">{isZh ? v.title.zh : v.title.en}</div>
                    <div className="inline-flex items-center gap-2 text-xs text-slate-500">
                      <PlayCircle className="h-4 w-4 text-emerald-600" />
                      {v.sources.length}
                    </div>
                  </div>
                  <div className="aspect-video rounded-2xl overflow-hidden border border-slate-200 bg-slate-50">
                    {first ? (
                      <MeaningVideoPlayer
                        source={first}
                        variant="card"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="p-5 text-sm text-slate-500">{t('meaning.showcase.noVideo') as string}</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ) : null}

      {/* Messages */}
      {messages.length > 0 ? (
        <section className="mt-12">
          <h3 className="text-lg font-bold">{t('meaning.showcase.textExcerpts') as string}</h3>
          <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-5">
            {messages.map((m) => (
              <div key={m.id} className="rounded-3xl border border-slate-200 bg-white/60 backdrop-blur p-6">
                <p className="text-sm text-slate-800 leading-relaxed whitespace-pre-line">
                  {isZh ? m.content.zh : m.content.en}
                </p>
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
};

export default MeaningShowcaseSection;

