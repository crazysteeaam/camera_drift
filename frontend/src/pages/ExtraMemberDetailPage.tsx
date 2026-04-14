import React, { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { getAllExtraGroups } from '../config/extraData';
import ExtraMemberTrack from '../components/extra/ExtraMemberTrack';
import { useTranslation } from '../i18n/hooks';

const ExtraMemberDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { groupId, memberId } = useParams<{ groupId: string; memberId: string }>();
  const { t, language } = useTranslation();
  const isZh = language === 'zh-CN';

  const groups = getAllExtraGroups();
  const group = groups.find((g) => g.id === groupId);
  const member = group?.members.find((m) => m.id === memberId);

  const memberIndex = useMemo(() => {
    if (!group || !member) return 0;
    return Math.max(0, group.members.findIndex((m) => m.id === member.id));
  }, [group, member]);

  if (!group || !member || member.isPlaceholder) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-black text-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="rounded-2xl border border-slate-800/70 bg-slate-900/40 p-8 shadow-lg">
            <h1 className="text-xl font-semibold mb-4">
              {member?.isPlaceholder
                ? isZh
                  ? '这个成员位置还在预留中'
                  : 'This member slot is still reserved'
                : isZh
                  ? '成员不存在'
                  : 'Member not found'}
            </h1>
            <button
              type="button"
              onClick={() => navigate(`/extra/group/${groupId}`)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 transition"
            >
              <ArrowLeft className="h-4 w-4" />
              {isZh ? '返回小组' : 'Back to group'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-black text-slate-50">
      <div className="sticky top-0 z-30 backdrop-blur bg-slate-950/60 border-b border-slate-800/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => navigate(`/extra/group/${groupId}`)}
            className="inline-flex items-center gap-2 text-slate-200 hover:text-white transition"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="text-sm font-medium">{isZh ? '返回组' : 'Back'}</span>
          </button>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3"
          >
            <span className="px-3 py-1 rounded-full bg-white/10 border border-white/10 text-xs font-semibold text-slate-50/90">
              {t('extra.timeline.groupLabel') as string} {group.code}
            </span>
            <span className="px-3 py-1 rounded-full bg-white/10 border border-white/10 text-xs font-semibold text-slate-50/90">
              {member.name}
            </span>
          </motion.div>
        </div>
      </div>

      <main>
        <ExtraMemberTrack member={member} accentColor={group.color} index={memberIndex} />
      </main>
    </div>
  );
};

export default ExtraMemberDetailPage;

