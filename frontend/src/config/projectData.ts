// 项目数据配置文件
export interface Relay {
    id: number;
    name: string;
    participant: string; // 改为参与者，不一定是摄影师
    location: string;
    province: string;
    city: string;
    date: string;
    time: string;
    weather: string;
    camera: string;
    film: string;
    photos: string[]; // 支持多张照片
    message: string;
    coordinates: { lat: number; lng: number };
    tags: string[];
    nextLocation: string;
    nextParticipant: string; // 改为下一个参与者
}

export interface Group {
    id: string;
    name: string;
    description: string;
    startLocation: string;
    endLocation: string;
    color: string;
    bgColor: string;
    relays: Relay[];
}

// 第二期预告信息
export interface Phase2Preview {
    title: string;
    subtitle: string;
    description: string;
    goal: string;
    features: string[];
    startDate: string;
    status: string;
}

// 第二期预告数据
export const phase2Preview: Phase2Preview = {
    title: "点亮全国 胶片漂流计划",
    subtitle: "第二期即将启动",
    description: "继第一期成功举办后，我们即将启动第二期胶片漂流计划。这一次，我们的目标是点亮全国所有地级市，让胶片摄影的魅力传遍神州大地。",
    goal: "点亮全国所有地级市，记录每一个城市的独特魅力",
    features: [
        "覆盖全国333个地级市",
        "不限参与者身份，欢迎所有热爱摄影的朋友",
        "记录城市变迁与人文风情",
        "建立全国胶片摄影爱好者社区",
        "举办线下交流活动与展览"
    ],
    startDate: "2024年3月",
    status: "即将启动"
};

// 图片路径配置 - 你可以直接替换这些路径
const PHOTO_PATHS = {
    // A组照片路径
    A: {
        1: [
            '/photos/A1/000001.JPG',
            '/photos/A1/000002.JPG',
            '/photos/A1/000003.JPG'
        ],
        2: [
            '/photos/A2/photo1.jpg',
            '/photos/A2/photo2.jpg',
            '/photos/A2/photo3.jpg'
        ],
        3: [
            '/photos/A3/photo1.jpg',
            '/photos/A3/photo2.jpg',
            '/photos/A3/photo3.jpg'
        ],
        4: [
            '/photos/A4/photo1.jpg',
            '/photos/A4/photo2.jpg',
            '/photos/A4/photo3.jpg'
        ],
        5: [
            '/photos/A5/photo1.jpg',
            '/photos/A5/photo2.jpg',
            '/photos/A5/photo3.jpg'
        ],
        6: [
            '/photos/A6/photo1.jpg',
            '/photos/A6/photo2.jpg',
            '/photos/A6/photo3.jpg'
        ]
    },
    // B组照片路径
    B: {
        1: [
            '/photos/B1/photo1.jpg',
            '/photos/B1/photo2.jpg',
            '/photos/B1/photo3.jpg'
        ],
        2: [
            '/photos/B2/photo1.jpg',
            '/photos/B2/photo2.jpg',
            '/photos/B2/photo3.jpg'
        ],
        3: [
            '/photos/B3/photo1.jpg',
            '/photos/B3/photo2.jpg',
            '/photos/B3/photo3.jpg'
        ],
        4: [
            '/photos/B4/photo1.jpg',
            '/photos/B4/photo2.jpg',
            '/photos/B4/photo3.jpg'
        ],
        5: [
            '/photos/B5/photo1.jpg',
            '/photos/B5/photo2.jpg',
            '/photos/B5/photo3.jpg'
        ],
        6: [
            '/photos/B6/photo1.jpg',
            '/photos/B6/photo2.jpg',
            '/photos/B6/photo3.jpg'
        ]
    },
    // C组照片路径
    C: {
        1: [
            '/photos/C1/photo1.jpg',
            '/photos/C1/photo2.jpg',
            '/photos/C1/photo3.jpg'
        ],
        2: [
            '/photos/C2/photo1.jpg',
            '/photos/C2/photo2.jpg',
            '/photos/C2/photo3.jpg'
        ],
        3: [
            '/photos/C3/photo1.jpg',
            '/photos/C3/photo2.jpg',
            '/photos/C3/photo3.jpg'
        ],
        4: [
            '/photos/C4/photo1.jpg',
            '/photos/C4/photo2.jpg',
            '/photos/C4/photo3.jpg'
        ],
        5: [
            '/photos/C5/photo1.jpg',
            '/photos/C5/photo2.jpg',
            '/photos/C5/photo3.jpg'
        ],
        6: [
            '/photos/C6/photo1.jpg',
            '/photos/C6/photo2.jpg',
            '/photos/C6/photo3.jpg'
        ]
    },
    // D组照片路径
    D: {
        1: [
            '/photos/D1/photo1.jpg',
            '/photos/D1/photo2.jpg',
            '/photos/D1/photo3.jpg'
        ],
        2: [
            '/photos/D2/photo1.jpg',
            '/photos/D2/photo2.jpg',
            '/photos/D2/photo3.jpg'
        ],
        3: [
            '/photos/D3/photo1.jpg',
            '/photos/D3/photo2.jpg',
            '/photos/D3/photo3.jpg'
        ],
        4: [
            '/photos/D4/photo1.jpg',
            '/photos/D4/photo2.jpg',
            '/photos/D4/photo3.jpg'
        ],
        5: [
            '/photos/D5/photo1.jpg',
            '/photos/D5/photo2.jpg',
            '/photos/D5/photo3.jpg'
        ],
        6: [
            '/photos/D6/photo1.jpg',
            '/photos/D6/photo2.jpg',
            '/photos/D6/photo3.jpg'
        ]
    }
};

// 留言内容配置
const MESSAGES = {
    A: {
        1: '在杭州的西湖边，我捕捉到了这座城市的诗意。湖光山色，亭台楼阁，每一处都充满了江南的韵味。清晨的阳光洒在湖面上，波光粼粼，让人心旷神怡。',
        2: '衢州的古城墙诉说着历史的沧桑，老街上的青石板路承载着千年的记忆。在这里，我感受到了传统文化的厚重与深沉。',
        3: '台州的海岸线绵延不绝，海浪拍打着礁石，发出阵阵轰鸣。海天一色的壮美景象，让人感叹大自然的鬼斧神工。',
        4: '宁波的港口繁忙而有序，现代化的码头与古老的渔村形成鲜明对比。这里既有历史的沉淀，又有现代的活力。',
        5: '上海的外滩夜景璀璨夺目，黄浦江两岸的现代建筑群展现了这座国际大都市的繁华与活力。',
        6: '在上海的最后一站，我记录下了这座城市的现代与传统交融。从陆家嘴的摩天大楼到豫园的古典园林，上海的魅力无处不在。'
    },
    B: {
        1: '济南的泉水清澈见底，老城区的石板路承载着千年的历史，每一步都踏在时光的印记上。',
        2: '长春的伪满皇宫见证了历史的变迁，这里的建筑风格独特，让人深思那段特殊的历史时期。',
        3: '大同的云冈石窟气势恢宏，佛像雕刻精美绝伦，展现了古代工匠的卓越技艺。',
        4: '北京的天安门广场庄严肃穆，故宫的红墙黄瓦诉说着皇家的辉煌，这里是中华文明的中心。',
        5: '青岛的海滨风光令人陶醉，八大关的欧式建筑与碧海蓝天相映成趣，形成了独特的城市风貌。',
        6: '在青岛的最后一站，我记录下了这座海滨城市的美丽与宁静。海风轻拂，让人心旷神怡。'
    },
    C: {
        1: '佛山的岭南建筑独具特色，古村落保存完好，让人感受到了浓厚的岭南文化氛围。',
        2: '广州的珠江夜景美不胜收，小蛮腰塔的灯光秀让人目不暇接，这里是南方的经济中心。',
        3: '北海的银滩洁白如雪，海水清澈见底，是度假休闲的绝佳去处。',
        4: '贵阳的山城风光独特，青岩古镇的古建筑保存完好，让人感受到了历史的厚重。',
        5: '贵溪的龙虎山风景秀丽，道教文化底蕴深厚，是修身养性的好地方。',
        6: '潮州的古城墙和牌坊街展现了这座城市的古老历史，潮汕文化在这里得到了很好的传承。'
    },
    D: {
        1: '大连的海滨风光令人心旷神怡，星海广场的现代建筑与海天一色相映成趣。',
        2: '在大连的第二站，我深入探索了这座城市的工业历史，老厂房的沧桑感让人深思。',
        3: '哈尔滨的中央大街充满了异国情调，俄式建筑让人仿佛置身于欧洲小镇。',
        4: '黄冈的黄梅戏文化底蕴深厚，这里的传统艺术得到了很好的保护和传承。',
        5: '南宁的绿城风光让人印象深刻，南湖公园的湖光山色让人流连忘返。',
        6: '乌鲁木齐的天山风光壮美无比，这里的自然景观让人感叹大自然的鬼斧神工。'
    }
};

// 地图坐标配置
const COORDINATES = {
    A: {
        1: { lat: 30.2741, lng: 120.1551 }, // 杭州
        2: { lat: 28.9417, lng: 118.8743 }, // 衢州
        3: { lat: 28.6560, lng: 121.4206 }, // 台州
        4: { lat: 29.8683, lng: 121.5440 }, // 宁波
        5: { lat: 31.2304, lng: 121.4737 }, // 上海
        6: { lat: 31.2304, lng: 121.4737 }  // 上海
    },
    B: {
        1: { lat: 36.6512, lng: 117.1201 }, // 济南
        2: { lat: 43.8171, lng: 125.3235 }, // 长春
        3: { lat: 40.0768, lng: 113.2982 }, // 大同
        4: { lat: 39.9042, lng: 116.4074 }, // 北京
        5: { lat: 36.0671, lng: 120.3826 }, // 青岛
        6: { lat: 36.0671, lng: 120.3826 }  // 青岛
    },
    C: {
        1: { lat: 23.0218, lng: 113.1214 }, // 佛山
        2: { lat: 23.1291, lng: 113.2644 }, // 广州
        3: { lat: 21.4733, lng: 109.1196 }, // 北海
        4: { lat: 26.6470, lng: 106.6302 }, // 贵阳
        5: { lat: 28.2926, lng: 117.2133 }, // 贵溪
        6: { lat: 23.6571, lng: 116.6226 }  // 潮州
    },
    D: {
        1: { lat: 38.9140, lng: 121.6147 }, // 大连
        2: { lat: 38.9140, lng: 121.6147 }, // 大连
        3: { lat: 45.8038, lng: 126.5350 }, // 哈尔滨
        4: { lat: 30.4473, lng: 114.8724 }, // 黄冈
        5: { lat: 22.8170, lng: 108.3665 }, // 南宁
        6: { lat: 43.8256, lng: 87.6168 }   // 乌鲁木齐
    }
};

// 标签配置
const TAGS = {
    A: {
        1: ['西湖', '江南', '诗意', '湖光山色'],
        2: ['古城', '历史', '文化', '青石板'],
        3: ['海岸', '海浪', '礁石', '海天一色'],
        4: ['港口', '现代', '渔村', '对比'],
        5: ['外滩', '夜景', '现代', '繁华'],
        6: ['现代', '传统', '交融', '魅力']
    },
    B: {
        1: ['泉水', '古城', '历史', '石板路'],
        2: ['伪满皇宫', '历史', '建筑', '变迁'],
        3: ['云冈石窟', '佛像', '雕刻', '技艺'],
        4: ['天安门', '故宫', '皇家', '辉煌'],
        5: ['海滨', '八大关', '欧式', '海天一色'],
        6: ['海滨', '宁静', '海风', '美丽']
    },
    C: {
        1: ['岭南', '古村落', '文化', '建筑'],
        2: ['珠江', '夜景', '小蛮腰', '经济'],
        3: ['银滩', '海水', '度假', '休闲'],
        4: ['山城', '青岩古镇', '历史', '厚重'],
        5: ['龙虎山', '道教', '文化', '修身'],
        6: ['古城墙', '牌坊街', '历史', '传承']
    },
    D: {
        1: ['海滨', '星海广场', '现代', '海天一色'],
        2: ['工业', '老厂房', '沧桑', '历史'],
        3: ['中央大街', '异国情调', '俄式', '欧洲'],
        4: ['黄梅戏', '文化', '传统', '艺术'],
        5: ['绿城', '南湖公园', '湖光山色', '流连'],
        6: ['天山', '自然', '壮美', '鬼斧神工']
    }
};

// 生成完整的项目数据
export const projectData: Group[] = [
    {
        id: 'A',
        name: 'A组',
        description: '从江南水乡出发，记录诗意生活的点滴',
        startLocation: '浙江省杭州市',
        endLocation: '上海',
        color: 'from-blue-500 to-blue-600',
        bgColor: 'from-blue-50 to-blue-100',
        relays: [
            {
                id: 1,
                name: '第一棒',
                participant: '好好学习',
                location: '浙江省杭州市',
                province: '浙江省',
                city: '杭州市',
                date: '2024-01-15',
                time: '06:30',
                weather: '晴朗',
                camera: 'Leica M6',
                film: 'Kodak Portra 400',
                photos: PHOTO_PATHS.A[1],
                message: MESSAGES.A[1],
                coordinates: COORDINATES.A[1],
                tags: TAGS.A[1],
                nextLocation: '浙江省衢州市',
                nextParticipant: '好不好怪'
            },
            {
                id: 2,
                name: '第二棒',
                participant: '好不好怪',
                location: '浙江省衢州市',
                province: '浙江省',
                city: '衢州市',
                date: '2024-01-18',
                time: '07:15',
                weather: '多云',
                camera: 'Nikon F3',
                film: 'Fujifilm Pro 400H',
                photos: PHOTO_PATHS.A[2],
                message: MESSAGES.A[2],
                coordinates: COORDINATES.A[2],
                tags: TAGS.A[2],
                nextLocation: '浙江省台州市',
                nextParticipant: '桜幻'
            },
            {
                id: 3,
                name: '第三棒',
                participant: '桜幻',
                location: '浙江省台州市',
                province: '浙江省',
                city: '台州市',
                date: '2024-01-21',
                time: '16:45',
                weather: '阴天',
                camera: 'Canon AE-1',
                film: 'Ilford HP5 Plus',
                photos: PHOTO_PATHS.A[3],
                message: MESSAGES.A[3],
                coordinates: COORDINATES.A[3],
                tags: TAGS.A[3],
                nextLocation: '浙江省宁波市',
                nextParticipant: 'Rickdiculous'
            },
            {
                id: 4,
                name: '第四棒',
                participant: 'Rickdiculous',
                location: '浙江省宁波市',
                province: '浙江省',
                city: '宁波市',
                date: '2024-01-24',
                time: '08:20',
                weather: '晴朗',
                camera: 'Pentax K1000',
                film: 'Kodak Tri-X 400',
                photos: PHOTO_PATHS.A[4],
                message: MESSAGES.A[4],
                coordinates: COORDINATES.A[4],
                tags: TAGS.A[4],
                nextLocation: '上海',
                nextParticipant: 'milo'
            },
            {
                id: 5,
                name: '第五棒',
                participant: 'milo',
                location: '上海',
                province: '上海',
                city: '上海',
                date: '2024-01-27',
                time: '19:30',
                weather: '晴朗',
                camera: 'Leica M3',
                film: 'Kodak Ektar 100',
                photos: PHOTO_PATHS.A[5],
                message: MESSAGES.A[5],
                coordinates: COORDINATES.A[5],
                tags: TAGS.A[5],
                nextLocation: '上海',
                nextParticipant: '养水母的秋天'
            },
            {
                id: 6,
                name: '第六棒',
                participant: '养水母的秋天',
                location: '上海',
                province: '上海',
                city: '上海',
                date: '2024-01-30',
                time: '14:15',
                weather: '多云',
                camera: 'Hasselblad 500C/M',
                film: 'Fujifilm Velvia 50',
                photos: PHOTO_PATHS.A[6],
                message: MESSAGES.A[6],
                coordinates: COORDINATES.A[6],
                tags: TAGS.A[6],
                nextLocation: '终点',
                nextParticipant: '完成'
            }
        ]
    },
    {
        id: 'B',
        name: 'B组',
        description: '探索北方风光，捕捉历史的厚重与自然的壮美',
        startLocation: '山东省济南市',
        endLocation: '山东省青岛市',
        color: 'from-green-500 to-green-600',
        bgColor: 'from-green-50 to-green-100',
        relays: [
            {
                id: 1,
                name: '第一棒',
                participant: '岁岁平安',
                location: '山东省济南市',
                province: '山东省',
                city: '济南市',
                date: '2024-01-16',
                time: '07:00',
                weather: '晴朗',
                camera: 'Leica M6',
                film: 'Kodak Portra 400',
                photos: PHOTO_PATHS.B[1],
                message: MESSAGES.B[1],
                coordinates: COORDINATES.B[1],
                tags: TAGS.B[1],
                nextLocation: '吉林省长春市',
                nextParticipant: '你小徐哥'
            },
            {
                id: 2,
                name: '第二棒',
                participant: '你小徐哥',
                location: '吉林省长春市',
                province: '吉林省',
                city: '长春市',
                date: '2024-01-19',
                time: '08:30',
                weather: '雪天',
                camera: 'Nikon F3',
                film: 'Fujifilm Pro 400H',
                photos: PHOTO_PATHS.B[2],
                message: MESSAGES.B[2],
                coordinates: COORDINATES.B[2],
                tags: TAGS.B[2],
                nextLocation: '山西省大同市',
                nextParticipant: 'Young'
            },
            {
                id: 3,
                name: '第三棒',
                participant: 'Young',
                location: '山西省大同市',
                province: '山西省',
                city: '大同市',
                date: '2024-01-22',
                time: '09:15',
                weather: '晴朗',
                camera: 'Canon AE-1',
                film: 'Ilford HP5 Plus',
                photos: PHOTO_PATHS.B[3],
                message: MESSAGES.B[3],
                coordinates: COORDINATES.B[3],
                tags: TAGS.B[3],
                nextLocation: '北京市',
                nextParticipant: '敲冰块'
            },
            {
                id: 4,
                name: '第四棒',
                participant: '敲冰块',
                location: '北京市',
                province: '北京市',
                city: '北京市',
                date: '2024-01-25',
                time: '06:45',
                weather: '晴朗',
                camera: 'Pentax K1000',
                film: 'Kodak Tri-X 400',
                photos: PHOTO_PATHS.B[4],
                message: MESSAGES.B[4],
                coordinates: COORDINATES.B[4],
                tags: TAGS.B[4],
                nextLocation: '山东省青岛市',
                nextParticipant: '9yisx2'
            },
            {
                id: 5,
                name: '第五棒',
                participant: '9yisx2',
                location: '山东省青岛市',
                province: '山东省',
                city: '青岛市',
                date: '2024-01-28',
                time: '17:30',
                weather: '多云',
                camera: 'Leica M3',
                film: 'Kodak Ektar 100',
                photos: PHOTO_PATHS.B[5],
                message: MESSAGES.B[5],
                coordinates: COORDINATES.B[5],
                tags: TAGS.B[5],
                nextLocation: '山东省青岛市',
                nextParticipant: '小肥'
            },
            {
                id: 6,
                name: '第六棒',
                participant: '小肥',
                location: '山东省青岛市',
                province: '山东省',
                city: '青岛市',
                date: '2024-01-31',
                time: '15:45',
                weather: '晴朗',
                camera: 'Hasselblad 500C/M',
                film: 'Fujifilm Velvia 50',
                photos: PHOTO_PATHS.B[6],
                message: MESSAGES.B[6],
                coordinates: COORDINATES.B[6],
                tags: TAGS.B[6],
                nextLocation: '终点',
                nextParticipant: '完成'
            }
        ]
    },
    {
        id: 'C',
        name: 'C组',
        description: '沿海而行，记录海天一色的壮美与南方的温润',
        startLocation: '广东省佛山市',
        endLocation: '广东省潮州市',
        color: 'from-cyan-500 to-cyan-600',
        bgColor: 'from-cyan-50 to-cyan-100',
        relays: [
            {
                id: 1,
                name: '第一棒',
                participant: '想睡觉',
                location: '广东省佛山市',
                province: '广东省',
                city: '佛山市',
                date: '2024-01-17',
                time: '08:00',
                weather: '晴朗',
                camera: 'Leica M6',
                film: 'Kodak Portra 400',
                photos: PHOTO_PATHS.C[1],
                message: MESSAGES.C[1],
                coordinates: COORDINATES.C[1],
                tags: TAGS.C[1],
                nextLocation: '广东省广州市',
                nextParticipant: 'Liberase'
            },
            {
                id: 2,
                name: '第二棒',
                participant: 'Liberase',
                location: '广东省广州市',
                province: '广东省',
                city: '广州市',
                date: '2024-01-20',
                time: '19:30',
                weather: '多云',
                camera: 'Nikon F3',
                film: 'Fujifilm Pro 400H',
                photos: PHOTO_PATHS.C[2],
                message: MESSAGES.C[2],
                coordinates: COORDINATES.C[2],
                tags: TAGS.C[2],
                nextLocation: '广西省北海市',
                nextParticipant: '柒'
            },
            {
                id: 3,
                name: '第三棒',
                participant: '柒',
                location: '广西省北海市',
                province: '广西省',
                city: '北海市',
                date: '2024-01-23',
                time: '16:00',
                weather: '晴朗',
                camera: 'Canon AE-1',
                film: 'Ilford HP5 Plus',
                photos: PHOTO_PATHS.C[3],
                message: MESSAGES.C[3],
                coordinates: COORDINATES.C[3],
                tags: TAGS.C[3],
                nextLocation: '贵州省贵阳市',
                nextParticipant: '川三甲'
            },
            {
                id: 4,
                name: '第四棒',
                participant: '川三甲',
                location: '贵州省贵阳市',
                province: '贵州省',
                city: '贵阳市',
                date: '2024-01-26',
                time: '09:30',
                weather: '阴天',
                camera: 'Pentax K1000',
                film: 'Kodak Tri-X 400',
                photos: PHOTO_PATHS.C[4],
                message: MESSAGES.C[4],
                coordinates: COORDINATES.C[4],
                tags: TAGS.C[4],
                nextLocation: '江西省贵溪市',
                nextParticipant: '甜软的花卷'
            },
            {
                id: 5,
                name: '第五棒',
                participant: '甜软的花卷',
                location: '江西省贵溪市',
                province: '江西省',
                city: '贵溪市',
                date: '2024-01-29',
                time: '07:15',
                weather: '晴朗',
                camera: 'Leica M3',
                film: 'Kodak Ektar 100',
                photos: PHOTO_PATHS.C[5],
                message: MESSAGES.C[5],
                coordinates: COORDINATES.C[5],
                tags: TAGS.C[5],
                nextLocation: '广东省潮州市',
                nextParticipant: '后驱者'
            },
            {
                id: 6,
                name: '第六棒',
                participant: '后驱者',
                location: '广东省潮州市',
                province: '广东省',
                city: '潮州市',
                date: '2024-02-01',
                time: '14:30',
                weather: '多云',
                camera: 'Hasselblad 500C/M',
                film: 'Fujifilm Velvia 50',
                photos: PHOTO_PATHS.C[6],
                message: MESSAGES.C[6],
                coordinates: COORDINATES.C[6],
                tags: TAGS.C[6],
                nextLocation: '终点',
                nextParticipant: '完成'
            }
        ]
    },
    {
        id: 'D',
        name: 'D组',
        description: '穿越历史，感受古都文化的厚重与边疆的壮美',
        startLocation: '辽宁省大连市',
        endLocation: '新疆乌鲁木齐',
        color: 'from-purple-500 to-purple-600',
        bgColor: 'from-purple-50 to-purple-100',
        relays: [
            {
                id: 1,
                name: '第一棒',
                participant: '八个八个八个八个冬菇',
                location: '辽宁省大连市',
                province: '辽宁省',
                city: '大连市',
                date: '2024-01-18',
                time: '06:30',
                weather: '晴朗',
                camera: 'Leica M6',
                film: 'Kodak Portra 400',
                photos: PHOTO_PATHS.D[1],
                message: MESSAGES.D[1],
                coordinates: COORDINATES.D[1],
                tags: TAGS.D[1],
                nextLocation: '辽宁省大连市',
                nextParticipant: '莳六'
            },
            {
                id: 2,
                name: '第二棒',
                participant: '莳六',
                location: '辽宁省大连市',
                province: '辽宁省',
                city: '大连市',
                date: '2024-01-21',
                time: '08:45',
                weather: '多云',
                camera: 'Nikon F3',
                film: 'Fujifilm Pro 400H',
                photos: PHOTO_PATHS.D[2],
                message: MESSAGES.D[2],
                coordinates: COORDINATES.D[2],
                tags: TAGS.D[2],
                nextLocation: '黑龙江省哈尔滨市',
                nextParticipant: 'GONE'
            },
            {
                id: 3,
                name: '第三棒',
                participant: 'GONE',
                location: '黑龙江省哈尔滨市',
                province: '黑龙江省',
                city: '哈尔滨市',
                date: '2024-01-24',
                time: '10:15',
                weather: '雪天',
                camera: 'Canon AE-1',
                film: 'Ilford HP5 Plus',
                photos: PHOTO_PATHS.D[3],
                message: MESSAGES.D[3],
                coordinates: COORDINATES.D[3],
                tags: TAGS.D[3],
                nextLocation: '湖北省黄石市',
                nextParticipant: '桉树与棠'
            },
            {
                id: 4,
                name: '第四棒',
                participant: '桉树与棠',
                location: '湖北省黄石市',
                province: '湖北省',
                city: '黄冈市',
                date: '2024-01-27',
                time: '09:00',
                weather: '晴朗',
                camera: 'Pentax K1000',
                film: 'Kodak Tri-X 400',
                photos: PHOTO_PATHS.D[4],
                message: MESSAGES.D[4],
                coordinates: COORDINATES.D[4],
                tags: TAGS.D[4],
                nextLocation: '广西省南宁市',
                nextParticipant: '野生光合作用'
            },
            {
                id: 5,
                name: '第五棒',
                participant: '野生光合作用',
                location: '广西省南宁市',
                province: '广西省',
                city: '南宁市',
                date: '2024-01-30',
                time: '07:30',
                weather: '多云',
                camera: 'Leica M3',
                film: 'Kodak Ektar 100',
                photos: PHOTO_PATHS.D[5],
                message: MESSAGES.D[5],
                coordinates: COORDINATES.D[5],
                tags: TAGS.D[5],
                nextLocation: '新疆乌鲁木齐',
                nextParticipant: 'fedat'
            },
            {
                id: 6,
                name: '第六棒',
                participant: 'fedat',
                location: '新疆乌鲁木齐',
                province: '新疆',
                city: '乌鲁木齐',
                date: '2024-02-02',
                time: '13:45',
                weather: '晴朗',
                camera: 'Hasselblad 500C/M',
                film: 'Fujifilm Velvia 50',
                photos: PHOTO_PATHS.D[6],
                message: MESSAGES.D[6],
                coordinates: COORDINATES.D[6],
                tags: TAGS.D[6],
                nextLocation: '终点',
                nextParticipant: '完成'
            }
        ]
    }
];

// 导出照片路径配置，方便直接修改
export { PHOTO_PATHS, MESSAGES, COORDINATES, TAGS };
