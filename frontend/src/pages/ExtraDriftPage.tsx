import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { getAllExtraGroups } from '../config/extraData';
import ExtraHero from '../components/extra/ExtraHero';
import ExtraGlobeWorkbench from '../components/extra/ExtraGlobeWorkbench';
import ExtraFeaturedArchiveSection from '../components/extra/ExtraFeaturedArchiveSection';
import { useTranslation } from '../i18n/hooks';

const ExtraDriftPage: React.FC = () => {
  const { t } = useTranslation();
  const groups = getAllExtraGroups();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 text-slate-50">
      <ExtraHero groups={groups} />

      <ExtraGlobeWorkbench groups={groups} />

      <ExtraFeaturedArchiveSection groups={groups} />

      <main className="bg-gradient-to-b from-slate-900 via-slate-950 to-black">
        {/* 尾声区块 */}
        <section className="py-20 md:py-24 border-t border-slate-800/70">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <motion.h2
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-2xl md:text-3xl font-semibold tracking-tight text-slate-50"
            >
              {t('extra.footer.title') as string}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-sm md:text-base text-slate-300/90 leading-relaxed max-w-2xl mx-auto"
            >
              {t('extra.footer.description') as string}
            </motion.p>
            <Link
              to="/extra/editorial"
              className="inline-flex items-center rounded-full border border-cyan-400/20 bg-cyan-400/10 px-5 py-2 text-xs md:text-sm font-medium text-cyan-100 hover:bg-cyan-400/15 transition"
            >
              {t('extra.editorial.openEditorial') as string}
            </Link>
            <motion.button
              type="button"
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.18 }}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="mt-4 inline-flex items-center gap-2 rounded-full border border-slate-600/80 bg-slate-900/80 px-6 py-2 text-xs md:text-sm font-medium text-slate-100 hover:bg-slate-800 transition shadow-[0_18px_42px_rgba(15,23,42,0.9)]"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {t('extra.footer.backToTop') as string}
            </motion.button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ExtraDriftPage;

