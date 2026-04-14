/**
 * 旅行的意义（Meaning）长期篇章数据
 *
 * 目标：让“每个月运营”尽量只改数据、不改组件逻辑。
 * 后续扩展月份时，只需要新增 monthId 对应的配置对象即可。
 */

export type MeaningMonthStage = 'recruiting' | 'inProgress' | 'developing' | 'published';

export type MeaningLangText = {
  zh: string;
  en: string;
};

export interface MeaningVideoSelfHosted {
  src: string; // mp4/webm
  poster?: string; // 可选封面
}

export interface MeaningVideoEmbed {
  embedUrl: string; // 已处理好的 iframe 地址
  title?: string;
}

export type MeaningVideoSource =
  | { kind: 'selfHosted'; selfHosted: MeaningVideoSelfHosted }
  | { kind: 'embed'; embed: MeaningVideoEmbed };

export type MeaningMomentType = 'photo' | 'video' | 'text';

export interface MeaningMomentBase {
  id: string;
  type: MeaningMomentType;
  tags: string[]; // 用于 Moments Mosaic 筛选
  source?: MeaningLangText; // 轻量来源标记：如“4月 · 广州”
}

export interface MeaningPhotoMoment extends MeaningMomentBase {
  type: 'photo';
  photoSrc: string;
  zhCaption?: string;
  enCaption?: string;
}

export interface MeaningVideoMoment extends MeaningMomentBase {
  type: 'video';
  // 支持混合来源：自托管/平台嵌入
  videoSources: MeaningVideoSource[];
}

export interface MeaningTextMoment extends MeaningMomentBase {
  type: 'text';
  zhText: string;
  enText: string;
}

export type MeaningMoment = MeaningPhotoMoment | MeaningVideoMoment | MeaningTextMoment;

export interface MeaningFilmPack {
  id: string;
  title: MeaningLangText;
  photos: string[];
}

export interface MeaningShowcaseVideo {
  id: string;
  title: MeaningLangText;
  sources: MeaningVideoSource[]; // 混排：自托管 + 嵌入
}

export interface MeaningShowcaseMessage {
  id: string;
  content: MeaningLangText;
}

export interface MeaningHero {
  heroVideoSources?: MeaningVideoSource[]; // 可选：没有视频也能正常渲染
  posterImageSrc?: string; // 可选：用于没有视频时的封面
}

export type MeaningMemberStatus = 'preparing' | 'traveling' | 'returned' | 'published';

export interface MeaningMember {
  id: string;
  name: string;
  avatar?: string;
  city: string;
  keyword: MeaningLangText;
  tagline: MeaningLangText;
  status: MeaningMemberStatus;
  submissions: MeaningMoment[];
}

export interface MeaningRecruitContent {
  title: MeaningLangText;
  subtitle: MeaningLangText;
  narrativeParagraphs: MeaningLangText[];
  processSteps: MeaningLangText[];
  registrationParagraph: MeaningLangText;
  sponsor: MeaningLangText;
}

/** 问卷 URL（篇章首页与活动说明页共用） */
export const MEANING_SURVEY_URL = 'https://wj.qq.com/s2/23193149/e58c/';

/**
 * 活动说明页 · 直联报名（沪粤）
 * - 将小红书二维码 PNG 放入 `frontend/public/...` 后填写 `qrImageSrc`
 * - `profileUrl` 可选：点击「打开小红书主页」跳转
 */
export const meaningRecruitDirectSignup = {
  qrImageSrc: '' as string,
  profileUrl: '' as string,
  handleLine: { zh: '小红书账号（请在 meaningData 中填写）', en: 'Xiaohongshu handle (set in meaningData.ts)' },
};

export const meaningRecruitContent: MeaningRecruitContent = {
  title: { zh: '胶片漂流 ·「旅行的意义」篇章', en: 'Film Drift · “The Meaning of Travel” Chapter' },
  subtitle: { zh: '路书与招募', en: 'Playbook & how to join' },
  narrativeParagraphs: [
    {
      zh: '旅行归来以后，人常常会站在原地发问：这一路，对我究竟意味着什么？',
      en: 'After a journey ends, we often stand still and ask: what did this road mean to me?'
    },
    {
      zh: '未必是打卡式的名胜，也未必张张锐利清晰；更多时候，是风掠过发梢的触感、偶然抬头的天色、同行人的侧脸，与车窗里一掠而过的街景。',
      en: 'Not always famous checkpoints or razor-sharp frames—more often, wind at your hair, a sky you did not plan, the profile beside you, and a street scene half-seen from a window.'
    },
    {
      zh: '「旅行的意义」是一条按月延展的胶片支线：每期寄出一次性相机，你在路上诚实按下快门；除胶片外，也欢迎文字、静照与短片与旅途互文。寄回后统一冲洗与编排，汇成当月成册。',
      en: '“The Meaning of Travel” is a monthly film thread: each round we mail a disposable camera—you press the shutter honestly on the road. Beyond film, words, stills, and short clips may answer the journey. After return, we develop and curate into that month’s chapter.'
    },
  ],
  processSteps: [
    {
      zh: '寄来一卷光：确认同行后，一次性相机抵达掌心，像一封未拆的信。',
      en: 'A roll arrives: once you join, a disposable camera reaches your hands like an unopened letter.'
    },
    {
      zh: '把路途折进快门：海、山、或陌生街巷，只取那些心里一动的瞬间。',
      en: 'Fold the road into the shutter—sea, hills, or unfamiliar streets—only the instants that quietly insist.'
    },
    {
      zh: '以文字与影像互文：胶片之外，亦可用字句、静照或短片与旅途对谈。',
      en: 'Let words answer images: beyond film, lines, stills, or short clips may speak back to the journey.'
    },
    {
      zh: '送回暗房与册页：底片归位冲洗，再汇成当月《旅行的意义》一卷。',
      en: 'Return to the darkroom and the page: negatives come home for developing, then gather into this month’s chapter.'
    }
  ],
  registrationParagraph: {
    zh: '若你正预备一场出发，愿以一卷胶片把脚步放慢：在沪粤可直联小红书报名；其他城市请填写问卷，便于我们统一排期与寄送。',
    en: 'If you are about to leave and would slow down with one roll: in Shanghai or Guangdong, reach us on Xiaohongshu; elsewhere, use the survey so we can schedule and ship cleanly.'
  },
  sponsor: { zh: '承蒙「换个研究」襄助胶片之器。', en: 'With gratitude to “Another Research” for the cameras.' }
};

export interface MeaningMonth {
  id: string; // e.g. 2026-04
  stage: MeaningMonthStage; // 当前阶段（用于页面主 CTA / 显示不同模块）

  navLabel: MeaningLangText; // 月份标签：4月/April

  /**
   * 月详情页专用文案（不重复招募页长文）
   * 篇章首页 / 招募页写统一规则；这里只写「这个月在看什么」
   */
  monthPage: {
    chip: MeaningLangText;
    title: MeaningLangText;
    subline: MeaningLangText;
    /** 归档卡片上的一句话预告（替代全文标题） */
    cardTeaser: MeaningLangText;
    /** 可选：覆盖月页「同行者」导语（不写则用 i18n 默认） */
    participantsIntroOverride?: MeaningLangText;
  };

  hero: MeaningHero;
  sponsor: MeaningLangText & { linkUrl?: string };

  // 招募文案（“旅行的意义”这条主线）
  intro: {
    lead: MeaningLangText; // 背景小标题（如“4月招募正式开启”）
    title: MeaningLangText; // 如“胶片漂流 ·「旅行的意义」篇章”
    narrativeParagraphs: MeaningLangText[]; // 2-3 段主叙事
    registrationParagraph: MeaningLangText; // “立即报名”引导
  };

  // 参与方式（四步）
  processSteps: MeaningLangText[]; // 领取/记录/多维创作/共同冲洗

  // 立即报名链接（招募期 CTA 用）
  surveyUrl?: string;

  // 阶段化展示（可选：冲洗中/已发布）
  stageTimeline: Array<{
    stage: MeaningMonthStage;
    // 用于页面展示：例如“4月01日-4月30日”
    rangeLabel?: MeaningLangText;
  }>;

  // 进行中动态墙（可选）
  moments?: MeaningMoment[];

  // 成果展（可选）
  showcase?: {
    films?: MeaningFilmPack[];
    videos?: MeaningShowcaseVideo[];
    messages?: MeaningShowcaseMessage[];
  };

  // 每月参与者（核心变化层）
  members: MeaningMember[];

  /** 尚无成员时，展示「胶片格」占位数量（如三条路对应三格） */
  participantSlotCount?: number;
}

export type MeaningTimelineState = 'current' | 'next' | 'past';

/** 2026-04：三卷分别从广州、扬州、宜春上路（影像待补） */
const aprilCityLanes: MeaningMember[] = [
  {
    id: 'lane-guangzhou',
    name: '广州',
    city: '广东 · 广州',
    keyword: { zh: '珠江畔的南风与夜色', en: 'South wind and night along the Pearl River' },
    tagline: {
      zh: '这一卷从文庙与骑楼之间借路，把市井与江面折进同一格光里。',
      en: 'This roll borrows a path between old lanes and arcades—market light and river surface folded into one frame.'
    },
    status: 'traveling',
    submissions: []
  },
  {
    id: 'lane-yangzhou',
    name: '扬州',
    city: '江苏 · 扬州',
    keyword: { zh: '运河慢板与灯影', en: 'Canal adagio, lantern shadows' },
    tagline: {
      zh: '瘦西湖外，桨声把时辰摇得很轻，像未冲扫的底片。',
      en: 'Beyond Slender West Lake, oars rock the hours gently—like negatives not yet washed.'
    },
    status: 'traveling',
    submissions: []
  },
  {
    id: 'lane-yichun',
    name: '宜春',
    city: '江西 · 宜春',
    keyword: { zh: '山城与温泉雾', en: 'Hill town, mist over hot springs' },
    tagline: {
      zh: '温泉的汽里藏着晨昏；这一卷写给起伏的岭线与慢下来的呼吸。',
      en: 'Morning and dusk hide in spring mist—this roll is for ridgelines and a slower breath.'
    },
    status: 'traveling',
    submissions: []
  }
];

// -----------------------------
// 示例数据：当前先落地 2026-04
// -----------------------------

export const meaningMonths: MeaningMonth[] = [
  {
    id: '2026-04',
    stage: 'inProgress',
    navLabel: { zh: '4月', en: 'April' },
    monthPage: {
      chip: { zh: '2026 · 四月企划', en: 'April 2026' },
      title: { zh: '三条胶片，三种路途', en: 'Three rolls, three paths' },
      subline: {
        zh: '这一页只收三行尚未干透的足迹：各自的路、各自的窗，以及快门里不肯轻易交卷的那一瞬。若要落款同行，细则写在路书；更习惯在卷首提笔的人，那里也留了薄边。',
        en:
          'This page keeps three footprints still wet—each road, each window, and one instant the shutter refuses to rush. How to walk with us is written in the playbook; if you would rather sign at the chapter’s opening, a margin waits there, too.'
      },
      cardTeaser: {
        zh: '三格胶片在路上慢慢显影；名字与故事，等冲洗后再与你相见。',
        en: 'Three frames are slowly developing on the road—names and stories will meet you after the wash.'
      },
      participantsIntroOverride: {
        zh: '这一月三卷胶片分别从广州、扬州、宜春上路；画格与字札归来后，会在下面三页里徐徐摊开。',
        en: 'This month three rolls leave from Guangzhou, Yangzhou, and Yichun—once frames and notes return, they will open across the three pages below.'
      }
    },
    hero: {
      // 暂未提供实际视频地址时，先让页面正常工作（后续只改数据）
      heroVideoSources: [],
      posterImageSrc: undefined,
    },
    sponsor: {
      zh: '换个研究',
      en: 'Another Research',
      linkUrl: undefined,
    },
    intro: {
      title: meaningRecruitContent.title,
      lead: meaningRecruitContent.subtitle,
      narrativeParagraphs: meaningRecruitContent.narrativeParagraphs,
      registrationParagraph: meaningRecruitContent.registrationParagraph,
    },
    processSteps: meaningRecruitContent.processSteps,
    surveyUrl: undefined,
    stageTimeline: [
      { stage: 'recruiting', rangeLabel: { zh: '4月招募', en: 'Recruitment in April' } },
      { stage: 'inProgress', rangeLabel: { zh: '旅程记录进行中', en: 'Journey submissions in progress' } },
      { stage: 'developing', rangeLabel: { zh: '冲洗与整理', en: 'Developing & curating' } },
      { stage: 'published', rangeLabel: { zh: '成果展发布', en: 'Showcase published' } },
    ],
    moments: [
      {
        id: 'april-jing-photo-1',
        type: 'photo',
        tags: ['风景', '海边'],
        source: { zh: '4月 · 广州', en: 'April · Guangzhou' },
        photoSrc: '/photos/meaning/2026-04/jing/000001.jpg',
        zhCaption: '海边傍晚，风从耳边穿过去。',
        enCaption: 'Evening by the sea, with wind brushing past my ears.'
      },
      {
        id: 'april-chen-note-1',
        type: 'text',
        tags: ['情绪', '车窗'],
        source: { zh: '4月 · 扬州', en: 'April · Yangzhou' },
        zhText: '窗外的站牌一闪而过，我突然觉得，旅行是和自己慢慢和解。',
        enText: 'Station signs flashed by outside the window; suddenly I felt travel is a slow reconciliation with myself.'
      },
      {
        id: 'april-an-video-1',
        type: 'video',
        tags: ['路上声音', '城市'],
        source: { zh: '4月 · 宜春', en: 'April · Yichun' },
        videoSources: [
          {
            kind: 'embed',
            embed: {
              embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
              title: 'City walk snippet'
            }
          }
        ]
      }
    ],
    showcase: {
      films: [],
      videos: [],
      messages: [],
    },
    members: aprilCityLanes
  },
  {
    id: '2026-05',
    stage: 'recruiting',
    navLabel: { zh: '5月', en: 'May' },
    monthPage: {
      chip: { zh: '2026 · 五月招募', en: 'May 2026 Recruitment' },
      title: { zh: '下一卷，留给即将出发的人', en: 'The next roll is for those about to depart' },
      subline: {
        zh: '五月的风口尚未合拢，路线仍在雾中；你的那一笔，或许正该落下。',
        en: 'May\'s window is still open; routes stay veiled in mist—perhaps your line is ready to fall.'
      },
      cardTeaser: {
        zh: '五月：新机、新旅伴、尚未写下的答案。',
        en: 'May—new cameras, new companions, answers not yet written.'
      }
    },
    hero: {
      heroVideoSources: [],
      posterImageSrc: undefined,
    },
    sponsor: {
      zh: '换个研究',
      en: 'Another Research',
      linkUrl: undefined,
    },
    intro: {
      title: meaningRecruitContent.title,
      lead: { zh: '五月风口未合', en: 'May\'s window still open' },
      narrativeParagraphs: meaningRecruitContent.narrativeParagraphs,
      registrationParagraph: meaningRecruitContent.registrationParagraph,
    },
    processSteps: meaningRecruitContent.processSteps,
    surveyUrl: undefined,
    stageTimeline: [
      { stage: 'recruiting', rangeLabel: { zh: '5月招募', en: 'Recruitment in May' } },
      { stage: 'inProgress', rangeLabel: { zh: '旅程记录进行中', en: 'Journey submissions in progress' } },
      { stage: 'developing', rangeLabel: { zh: '冲洗与整理', en: 'Developing & curating' } },
      { stage: 'published', rangeLabel: { zh: '成果展发布', en: 'Showcase published' } },
    ],
    moments: [],
    showcase: {
      films: [],
      videos: [],
      messages: [],
    },
    members: []
  },
];

export const getMeaningMonths = (): MeaningMonth[] => meaningMonths;

export const getMeaningMonthById = (monthId: string): MeaningMonth | undefined =>
  meaningMonths.find((m) => m.id === monthId);

export const getMeaningMemberById = (monthId: string, memberId: string): MeaningMember | undefined => {
  const month = getMeaningMonthById(monthId);
  return month?.members.find((m) => m.id === memberId);
};

export const getMeaningTimelineState = (month: MeaningMonth): MeaningTimelineState => {
  if (month.stage === 'published') return 'past';
  if (month.stage === 'recruiting') return 'next';
  return 'current';
};

