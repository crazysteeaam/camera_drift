import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { MeaningMember, MeaningMemberStatus } from '../../config/meaningData';
import { useTranslation } from '../../i18n/hooks';

export interface MeaningMemberCardProps {
  monthId: string;
  member: MeaningMember;
  isZh: boolean;
  index?: number;
}

const initialsBackdrop = [
  'bg-gradient-to-br from-rose-50 via-amber-50/80 to-orange-100/90 text-rose-900/90 border-rose-100/80',
  'bg-gradient-to-br from-sky-50 via-cyan-50/70 to-emerald-100/80 text-sky-900/85 border-sky-100/80',
  'bg-gradient-to-br from-violet-50 via-indigo-50/70 to-slate-100/90 text-violet-900/85 border-violet-100/80',
];

const cardBackdrop = [
  'from-rose-50/80 via-white/72 to-orange-50/70',
  'from-cyan-50/80 via-white/72 to-emerald-50/70',
  'from-violet-50/75 via-white/72 to-indigo-50/70',
];

const MeaningMemberCard: React.FC<MeaningMemberCardProps> = ({ monthId, member, isZh, index = 0 }) => {
  const { t } = useTranslation();
  const statusLabel = (s: MeaningMemberStatus) => t(`meaning.memberStatus.${s}`) as string;
  const photos = member.submissions.filter((s) => s.type === 'photo').length;
  const videos = member.submissions.filter((s) => s.type === 'video').length;
  const notes = member.submissions.filter((s) => s.type === 'text').length;
  const backdrop = initialsBackdrop[index % initialsBackdrop.length];
  const surface = cardBackdrop[index % cardBackdrop.length];

  return (
    <Link to={`/meaning/${monthId}/member/${member.id}`} className="block">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45, delay: index * 0.06 }}
        className={`relative overflow-hidden rounded-3xl border border-white/80 bg-gradient-to-br ${surface} backdrop-blur p-5 shadow-[0_22px_55px_rgba(2,132,199,0.10)] hover:shadow-[0_28px_65px_rgba(2,132,199,0.18)] transition`}
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-2 bg-[repeating-linear-gradient(90deg,rgba(255,255,255,0.85)_0_16px,rgba(148,163,184,0.2)_16px_22px,rgba(255,255,255,0.85)_22px_38px)]" />
        <div className="flex items-center gap-4">
          <div
            className={`h-14 w-14 rounded-2xl overflow-hidden border shrink-0 flex items-center justify-center ${
              member.avatar ? 'bg-slate-100 border-slate-200' : `${backdrop} border font-bold text-lg tracking-tight`
            }`}
          >
            {member.avatar ? (
              <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
            ) : (
              <span aria-hidden>{member.name.slice(0, 1)}</span>
            )}
          </div>

          <div className="min-w-0">
            <h3 className="text-base font-bold text-slate-900">{member.name}</h3>
            <p className="text-xs text-slate-500 mt-1">{member.city}</p>
            <p className="text-xs text-slate-600 mt-1 line-clamp-1">{member.keyword[isZh ? 'zh' : 'en']}</p>
          </div>

          <span className="ml-auto text-[0.7rem] px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-semibold whitespace-nowrap">
            {statusLabel(member.status)}
          </span>
        </div>

        <p className="mt-4 text-sm text-slate-700">{member.tagline[isZh ? 'zh' : 'en']}</p>

        <div className="mt-4 flex items-center gap-2 text-xs text-slate-600 flex-wrap">
          <span className="px-2 py-1 rounded-full bg-slate-100 border border-slate-200">
            {t('meaning.memberCard.statPhoto') as string} {photos}
          </span>
          <span className="px-2 py-1 rounded-full bg-slate-100 border border-slate-200">
            {t('meaning.memberCard.statVideo') as string} {videos}
          </span>
          <span className="px-2 py-1 rounded-full bg-slate-100 border border-slate-200">
            {t('meaning.memberCard.statNote') as string} {notes}
          </span>
        </div>
      </motion.div>
    </Link>
  );
};

export default MeaningMemberCard;

