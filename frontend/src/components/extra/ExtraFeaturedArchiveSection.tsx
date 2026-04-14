import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { ExtraGroup } from '../../config/extraData';
import { splitFeaturedAndArchive } from '../../utils/extraGlobeMarkers';
import ExtraArchiveIndex from './ExtraArchiveIndex';
import { useTranslation } from '../../i18n/hooks';

export interface ExtraFeaturedArchiveSectionProps {
  groups: ExtraGroup[];
}

const ExtraFeaturedArchiveSection: React.FC<ExtraFeaturedArchiveSectionProps> = ({ groups }) => {
  const { archive } = useMemo(() => splitFeaturedAndArchive(groups, 3), [groups]);
  const { t } = useTranslation();

  return (
    <section className="relative bg-gradient-to-b from-slate-950 via-[#050c17] to-black">
      <div className="mx-auto max-w-6xl px-4 pt-8 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(15,23,42,0.92),rgba(12,18,32,0.84))] p-6 shadow-[0_28px_90px_rgba(2,6,23,0.45)] md:p-8"
        >
          <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-1.5 text-[0.68rem] uppercase tracking-[0.3em] text-cyan-100/80">
                <span className="inline-flex h-1.5 w-1.5 rounded-full bg-cyan-400" />
                {t('extra.editorial.entryChip') as string}
              </div>
              <h2 className="text-2xl font-semibold tracking-[-0.03em] text-slate-50 md:text-4xl">
                {t('extra.editorial.entryTitle') as string}
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-300/80 md:text-base">
                {t('extra.editorial.entryDescription') as string}
              </p>
            </div>

            <div className="md:text-right">
              <Link
                to="/extra/editorial"
                className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-5 py-2.5 text-sm font-medium text-white transition hover:border-cyan-300/40 hover:bg-cyan-400/10"
              >
                {t('extra.editorial.openEditorial') as string}
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
      <ExtraArchiveIndex groups={archive} />
    </section>
  );
};

export default ExtraFeaturedArchiveSection;
