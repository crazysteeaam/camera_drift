import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getAllExtraGroups } from '../config/extraData';
import ExtraFeaturedRail from '../components/extra/ExtraFeaturedRail';
import { splitFeaturedAndArchive } from '../utils/extraGlobeMarkers';
import { useTranslation } from '../i18n/hooks';

const ExtraEditorialPage: React.FC = () => {
  const navigate = useNavigate();
  const { t, language } = useTranslation();
  const isZh = language === 'zh-CN';
  const groups = getAllExtraGroups();
  const { featured } = useMemo(() => splitFeaturedAndArchive(groups, 3), [groups]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-[#040b17] to-black text-slate-50">
      <div className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/70 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-5 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => navigate('/extra')}
            className="inline-flex items-center gap-2 text-slate-200 transition hover:text-white"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="text-sm font-medium">
              {t('extra.editorial.backToExtra') as string}
            </span>
          </button>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="text-right"
          >
            <p className="text-[0.65rem] uppercase tracking-[0.28em] text-slate-400">
              {t('extra.editorial.eyebrow') as string}
            </p>
            <p className="mt-1 text-sm text-slate-200">
              {isZh ? '番外篇专题阅读页' : 'Extra editorial reading mode'}
            </p>
          </motion.div>
        </div>
      </div>

      <ExtraFeaturedRail groups={featured} darkMode />
    </div>
  );
};

export default ExtraEditorialPage;
