// 番外篇（全球胶片漂流）数据模型与示例数据
// 仅作为结构示例，后续可按实际拍摄结果扩展或替换
import { EXTRA_PHOTO_MANIFEST } from './extraPhotoManifest';
import { createRemoteImageAsset, type ImageAsset } from '../types/imageAsset';

export interface ExtraMessagePage {
  id: string;
  photo: ImageAsset;
  place: {
    city: string;
    country: string;
    countryCode: string;
  };
  film: string;
  date?: string;
  zhText: string;
  enText: string;
}

export interface ExtraMember {
  id: string;
  name: string;
  avatar?: string;
  country: string;
  countryCode: string;
  city: string;
  lat: number;
  lng: number;
  isPlaceholder?: boolean;
  zhKeyword: string;
  enKeyword: string;
  zhTagline: string;
  enTagline: string;
  photos: ImageAsset[]; // 建议 12 张，为番外规则：每人 12 张
  messageBook: ExtraMessagePage[];
}

export interface ExtraGroup {
  id: string;
  code: string; // 如 G1、G2
  zhTitle: string;
  enTitle: string;
  zhTagline: string;
  enTagline: string;
  color: string; // tailwind 渐变色，如 'from-sky-400 to-cyan-500'
  members: ExtraMember[];
}

const buildDefaultPhotos = (folder: string) =>
  Array.from({ length: 12 }).map(
    (_, index) => createRemoteImageAsset(`/photos/extra/${folder}/photos/${String(index + 1).padStart(6, '0')}.jpg`)
  );

const buildDefaultMessagePhoto = (folder: string) =>
  createRemoteImageAsset(`/photos/extra/${folder}/message/000001.jpg`);

const getExtraPhotoEntry = (folder: string) => {
  return (
    EXTRA_PHOTO_MANIFEST[folder] || {
      photos: [],
      messagePhotos: []
    }
  );
};

const buildPhotos = (folder: string) => {
  const scannedPhotos = getExtraPhotoEntry(folder).photos;
  return scannedPhotos.length > 0 ? scannedPhotos : buildDefaultPhotos(folder);
};

const buildMessageBook = (
  folder: string,
  member: Omit<ExtraMember, 'photos' | 'messageBook'> & {
    note: {
      id: string;
      film: string;
      date: string;
      zhText: string;
      enText: string;
      photo?: ImageAsset;
    };
  }
): ExtraMessagePage[] => {
  const scannedMessagePhotos = getExtraPhotoEntry(folder).messagePhotos;
  const messagePhotos =
    scannedMessagePhotos.length > 0
      ? scannedMessagePhotos
      : [member.note.photo || buildDefaultMessagePhoto(folder)];

  return messagePhotos.map((photo, index) => ({
    id: index === 0 ? member.note.id : `${member.note.id}-${index + 1}`,
    photo,
    place: {
      city: member.city,
      country: member.country,
      countryCode: member.countryCode
    },
    film: member.note.film,
    date: member.note.date,
    zhText: member.note.zhText,
    enText: member.note.enText
  }));
};

const createMember = (
  member: Omit<ExtraMember, 'photos' | 'messageBook'> & {
    folder: string;
    note: {
      id: string;
      film: string;
      date: string;
      zhText: string;
      enText: string;
      photo?: ImageAsset;
    };
  }
): ExtraMember => ({
  id: member.id,
  name: member.name,
  country: member.country,
  countryCode: member.countryCode,
  city: member.city,
  lat: member.lat,
  lng: member.lng,
  zhKeyword: member.zhKeyword,
  enKeyword: member.enKeyword,
  zhTagline: member.zhTagline,
  enTagline: member.enTagline,
  photos: buildPhotos(member.folder),
  messageBook: buildMessageBook(member.folder, member)
});

const createPlaceholderMember = (
  id: string,
  country: string,
  city: string,
  countryCode = 'ZZ'
): ExtraMember => ({
  id,
  name: 'TBD',
  country,
  countryCode,
  city,
  lat: 0,
  lng: 0,
  isPlaceholder: true,
  zhKeyword: '预留位置',
  enKeyword: 'Reserved Slot',
  zhTagline: '这个国家的位置先留着，等下一位成员加入。',
  enTagline: 'This country slot is reserved for the next member to join.',
  photos: [],
  messageBook: []
});

export const extraGroups: ExtraGroup[] = [
  {
    id: 'east-asia-drift',
    code: 'G1',
    zhTitle: '东亚热带转运站',
    enTitle: 'East Asia Tropical Transfer',
    zhTagline: '从日本到泰国，第三站暂时留白，等下一次快门把航线补全。',
    enTagline: 'From Japan to Thailand, with the third stop left open for the next shutter click.',
    color: 'from-sky-400 to-cyan-500',
    members: [
      createMember({
        id: 'yuna',
        name: 'Yuna',
        country: 'Japan',
        countryCode: 'JP',
        city: 'Tokyo',
        lat: 35.6762,
        lng: 139.6503,
        zhKeyword: '清晨通勤者',
        enKeyword: 'Morning Commuter',
        zhTagline: '在人潮和车窗反光之间收集东京的呼吸。',
        enTagline: 'Collects the breath of Tokyo between train windows and crowds.',
        folder: 'G1/G1-1',
        note: {
          id: 'yuna-1',
          film: 'Kodak Gold 200',
          date: '2025-11-03',
          zhText: '东京的早高峰像一卷还没显影的底片，大家都在赶路，颜色却还藏在里面。',
          enText:
            'Tokyo rush hour feels like an undeveloped roll of film. Everyone is moving, but the colors are still hidden inside.'
        }
      }),
      createMember({
        id: 'niran',
        name: 'Niran',
        country: 'Thailand',
        countryCode: 'TH',
        city: 'Bangkok',
        lat: 13.7563,
        lng: 100.5018,
        zhKeyword: '夜市记录员',
        enKeyword: 'Night Market Recorder',
        zhTagline: '把潮热、灯牌和食物蒸汽一起压进底片里。',
        enTagline: 'Presses humid air, neon signs, and food steam onto the same strip of film.',
        folder: 'G1/G1-2',
        note: {
          id: 'niran-1',
          film: 'Kodak Portra 400',
          date: '2025-11-08',
          zhText: '曼谷的夜市没有真正的休息键，灯一亮，故事就开始往外冒。',
          enText:
            'Bangkok night markets never really pause. Once the lights switch on, stories begin spilling out.'
        }
      }),
      createPlaceholderMember('g1-slot-3', 'Reserved', 'Coming Soon')
    ]
  },
  {
    id: 'pacific-echo',
    code: 'G2',
    zhTitle: '太平洋回声',
    enTitle: 'Pacific Echoes',
    zhTagline: '韩国与新西兰隔海呼应，第三个坐标还在等待落点。',
    enTagline: 'Korea and New Zealand answer each other across the sea while the third coordinate waits.',
    color: 'from-fuchsia-400 to-rose-500',
    members: [
      createMember({
        id: 'seojun',
        name: 'Seo-jun',
        country: 'South Korea',
        countryCode: 'KR',
        city: 'Seoul',
        lat: 37.5665,
        lng: 126.978,
        zhKeyword: '屋顶观察者',
        enKeyword: 'Rooftop Watcher',
        zhTagline: '在首尔的楼顶风里，替城市记录下停顿的几秒钟。',
        enTagline: 'Uses Seoul rooftop wind to record the city’s rare paused seconds.',
        folder: 'G2/G2-1',
        note: {
          id: 'seojun-1',
          film: 'Fujifilm Superia 200',
          date: '2025-11-14',
          zhText: '首尔的天台像城市留给自己的喘息口，抬头看时，连霓虹也慢了一点。',
          enText:
            'Seoul rooftops feel like breathing gaps the city leaves for itself. Even the neon slows down up there.'
        }
      }),
      createMember({
        id: 'mila-nz',
        name: 'Mila',
        country: 'New Zealand',
        countryCode: 'NZ',
        city: 'Auckland',
        lat: -36.8485,
        lng: 174.7633,
        zhKeyword: '海风采样员',
        enKeyword: 'Sea Breeze Sampler',
        zhTagline: '把奥克兰海边的空白感冲洗成可触碰的图像。',
        enTagline: 'Develops Auckland’s open sea air into images you can almost touch.',
        folder: 'G2/G2-2',
        note: {
          id: 'mila-nz-1',
          film: 'Kodak Ultramax 400',
          date: '2025-11-18',
          zhText: '这里的风会先经过海，再经过人，所以照片里总有一种被吹开的空旷。',
          enText:
            'The wind reaches people only after passing over the sea, so every frame here carries a sense of opened space.'
        }
      }),
      createPlaceholderMember('g2-slot-3', 'Reserved', 'Coming Soon')
    ]
  },
  {
    id: 'southern-monologue',
    code: 'G3',
    zhTitle: '南方独白',
    enTitle: 'Southern Monologue',
    zhTagline: '印尼先落下一枚坐标，另外两个国家位置先留白，等队伍慢慢成形。',
    enTagline: 'Indonesia drops the first coordinate while two more country slots stay open for the next arrivals.',
    color: 'from-emerald-400 to-teal-500',
    members: [
      createMember({
        id: 'arya',
        name: 'Arya',
        country: 'Indonesia',
        countryCode: 'ID',
        city: 'Jakarta',
        lat: -6.2088,
        lng: 106.8456,
        zhKeyword: '雨季邮差',
        enKeyword: 'Monsoon Courier',
        zhTagline: '在雅加达的潮湿空气里传递一卷还没讲完的故事。',
        enTagline: 'Carries an unfinished roll of stories through Jakarta’s humid air.',
        folder: 'G3/G3-1',
        note: {
          id: 'arya-1',
          film: 'Kodak ColorPlus 200',
          date: '2025-11-24',
          zhText: '雨季会把声音压低，但街道的颜色反而更往外涌，好像每一滴水都在帮城市显影。',
          enText:
            'The monsoon softens the soundscape, yet the street colors surge outward as if every raindrop is helping the city develop.'
        }
      }),
      createPlaceholderMember('g3-slot-2', 'Reserved', 'Coming Soon'),
      createPlaceholderMember('g3-slot-3', 'Reserved', 'Coming Soon')
    ]
  }
];

export const getAllExtraGroups = (): ExtraGroup[] => extraGroups;

