import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { getMeaningMemberById } from '../config/meaningData';
import { useTranslation } from '../i18n/hooks';
import MeaningVideoPlayer from '../components/meaning/MeaningVideoPlayer';
import SmartImage from '../components/SmartImage';

const MeaningMemberDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { monthId, memberId } = useParams<{ monthId: string; memberId: string }>();
  const { language, t } = useTranslation();
  const isZh = language === 'zh-CN';

  const member = monthId && memberId ? getMeaningMemberById(monthId, memberId) : undefined;

  if (!member || !monthId) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-sky-50 to-indigo-50">
        <div className="max-w-4xl mx-auto px-4 py-14">
          <button
            type="button"
            onClick={() => navigate('/meaning')}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white/60 border border-slate-200"
          >
            <ArrowLeft className="h-4 w-4" />
            {t('meaning.member.back') as string}
          </button>
          <div className="mt-6 rounded-3xl border border-white/80 bg-white/65 p-8">
            <h1 className="text-xl font-bold">{t('meaning.member.notFound') as string}</h1>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-sky-50 to-indigo-50 text-slate-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <button
          type="button"
          onClick={() => navigate(`/meaning/${monthId}`)}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white/60 border border-slate-200 hover:bg-white"
        >
          <ArrowLeft className="h-4 w-4" />
          {t('meaning.member.backMonth') as string}
        </button>

        <div className="mt-6 rounded-3xl border border-white/80 bg-white/65 backdrop-blur p-6 md:p-8 shadow-[0_25px_70px_rgba(2,132,199,0.10)]">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
              {member.avatar ? (
                <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-lg font-bold text-slate-600">{member.name.slice(0, 1)}</div>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold">{member.name}</h1>
              <p className="text-sm text-slate-500 mt-1">{member.city}</p>
              <p className="text-xs text-emerald-800/75 mt-1.5 font-medium">{member.keyword[isZh ? 'zh' : 'en']}</p>
              <p className="text-sm text-slate-700 mt-2 leading-relaxed">{member.tagline[isZh ? 'zh' : 'en']}</p>
            </div>
          </div>

          <div className="mt-8">
            {member.submissions.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200/90 bg-gradient-to-br from-white/70 to-slate-50/50 px-6 py-10 text-center">
                <p className="text-sm text-slate-600 leading-relaxed max-w-md mx-auto">
                  {t('meaning.member.emptySubmissions') as string}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {member.submissions.map((item) => {
                  if (item.type === 'photo') {
                    return (
                      <div key={item.id} className="rounded-2xl overflow-hidden border border-slate-200 bg-white">
                        <SmartImage asset={item.photo} alt={item.zhCaption || item.enCaption || 'photo'} className="w-full h-64 object-cover" />
                        <div className="p-4 text-sm text-slate-700">{isZh ? item.zhCaption : item.enCaption}</div>
                      </div>
                    );
                  }

                  if (item.type === 'video') {
                    const first = item.videoSources[0];
                    return (
                      <div key={item.id} className="rounded-2xl overflow-hidden border border-slate-200 bg-white">
                        <div className="aspect-video bg-slate-100">
                          {first ? <MeaningVideoPlayer source={first} variant="card" className="w-full h-full object-cover" /> : null}
                        </div>
                        <div className="p-4 text-xs text-slate-500">{item.tags.join(' · ')}</div>
                      </div>
                    );
                  }

                  return (
                    <div key={item.id} className="rounded-2xl border border-slate-200 bg-white/75 p-5 text-sm text-slate-700 leading-relaxed">
                      {isZh ? item.zhText : item.enText}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeaningMemberDetailPage;

