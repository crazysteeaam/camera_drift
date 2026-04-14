import React from 'react';
import type { MeaningMonth } from '../../config/meaningData';
import MeaningMomentsMosaic from './MeaningMomentsMosaic';
import MeaningShowcaseSection from './MeaningShowcaseSection';

export interface MeaningStageRendererProps {
  month: MeaningMonth;
  isZh: boolean;
}

const MeaningStageRenderer: React.FC<MeaningStageRendererProps> = ({ month, isZh }) => {
  return (
    <div>
      {/* 动态墙（招募阶段也可以占位，便于结构固定） */}
      <div id="moments">
        <MeaningMomentsMosaic moments={month.moments || []} />
      </div>

      {/* 成果展只在发布后展示 */}
      {month.stage === 'published' ? <MeaningShowcaseSection isZh={isZh} showcase={month.showcase} /> : null}
    </div>
  );
};

export default MeaningStageRenderer;

