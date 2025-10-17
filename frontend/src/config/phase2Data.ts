// 第二期数据配置文件 - 点亮中国 胶片漂流计划
export interface Phase2Relay {
    id: number;
    name: string;
    participant: string;
    location: string;
    province: string;
    city: string;
    date: string;
    time: string;
    weather: string;
    camera: string;
    film: string;
    photos: string[];
    message: string;
    messageImages?: string[]; // 新增：留言图片
    coordinates: { lat: number; lng: number };
    tags: string[];
    nextLocation: string;
    nextParticipant: string;
}

export interface Phase2Group {
    id: string;
    name: string;
    description: string;
    province: string;
    startLocation: string;
    endLocation: string;
    color: string;
    bgColor: string;
    relays: Phase2Relay[];
    status: 'planning' | 'active' | 'completed';
    participantCount: number;
    currentRelay: number;
    planningStartDate?: string; // 计划开启时间
    progress?: number; // 进度百分比
}

export interface Phase2Province {
    id: string;
    name: string;
    shortName: string;
    description: string;
    color: string;
    bgColor: string;
    groups: Phase2Group[];
    totalGroups: number;
    activeGroups: number;
    completedGroups: number;
    coordinates: { lat: number; lng: number };
    boundary?: number[][]; // 省份边界坐标
    planningStartDate?: string; // 省份计划开启时间
}

// 第二期省份数据
export const phase2Provinces: Phase2Province[] = [
    {
        id: 'zhejiang',
        name: '浙江省',
        shortName: '浙',
        description: '江南水乡，诗画浙江',
        color: 'from-blue-500 to-blue-600',
        bgColor: 'from-blue-50 to-blue-100',
        groups: [
            {
                id: 'A',
                name: 'A组',
                description: '衢州-丽水-金华-温州-台州-舟山线',
                province: '浙江省',
                startLocation: '衢州市',
                endLocation: '舟山市',
                color: 'from-blue-500 to-blue-600',
                bgColor: 'from-blue-50 to-blue-100',
                status: 'completed',
                participantCount: 6,
                currentRelay: 6,
                progress: 100, // 100% 进度
                relays: [
                    {
                        id: 1,
                        name: '第一棒',
                        participant: '衢州记录者',
                        location: '浙江省衢州市',
                        province: '浙江省',
                        city: '衢州市',
                        date: '2024-04-01',
                        time: '09:00',
                        weather: '晴',
                        camera: '富士一次性胶片机',
                        film: 'C400',
                        photos: [
                            '/photos/phase2/zhejiang/A/A1/photos/000001.JPG',
                            '/photos/phase2/zhejiang/A/A1/photos/000002.JPG',
                            '/photos/phase2/zhejiang/A/A1/photos/000003.JPG',
                            '/photos/phase2/zhejiang/A/A1/photos/000004.JPG',
                            '/photos/phase2/zhejiang/A/A1/photos/000005.JPG',
                            '/photos/phase2/zhejiang/A/A1/photos/000006.JPG'
                        ],
                        message: '衢州古城的巷子里，有最温柔的风。',
                        messageImages: [
                            '/photos/phase2/zhejiang/A/A1/message/1774e17c03e3efb4a2c70c7734f60de5.jpg',
                            '/photos/phase2/zhejiang/A/A1/message/970d6e7d62e40e045f54e6393317bddb.jpg',
                            '/photos/phase2/zhejiang/A/A1/message/a8c2e43757eee71d713600f7e08b7c4a.jpg',
                            '/photos/phase2/zhejiang/A/A1/message/c6008cda639e47d72a4df6b3590fc0ce.jpg',
                            '/photos/phase2/zhejiang/A/A1/message/c9f773b6f0bb6f91603bab07b8b3e05d.jpg'
                        ],
                        coordinates: { lat: 28.9701, lng: 118.8593 },
                        tags: ['古城', '巷子', '人间烟火'],
                        nextLocation: '浙江省丽水市',
                        nextParticipant: '丽水记录者'
                    },
                    {
                        id: 2,
                        name: '第二棒',
                        participant: '丽水记录者',
                        location: '浙江省丽水市',
                        province: '浙江省',
                        city: '丽水市',
                        date: '2024-04-04',
                        time: '10:00',
                        weather: '多云',
                        camera: '富士一次性胶片机',
                        film: 'C400',
                        photos: [
                            '/photos/phase2/zhejiang/A/A2/photos/000007.JPG',
                            '/photos/phase2/zhejiang/A/A2/photos/000008.JPG',
                            '/photos/phase2/zhejiang/A/A2/photos/000009.JPG',
                            '/photos/phase2/zhejiang/A/A2/photos/000034.JPG'
                        ],
                        message: '山水之城，绿意漫过了春天。',
                        messageImages: [
                            '/photos/phase2/zhejiang/A/A2/message/0ddcab47a2337753cbe3de1e7958cb42.jpg'
                        ],
                        coordinates: { lat: 28.4676, lng: 119.9229 },
                        tags: ['山水', '绿意', '春天'],
                        nextLocation: '浙江省金华市',
                        nextParticipant: '金华记录者'
                    },
                    {
                        id: 3,
                        name: '第三棒',
                        participant: '金华记录者',
                        location: '浙江省金华市',
                        province: '浙江省',
                        city: '金华市',
                        date: '2024-04-07',
                        time: '15:20',
                        weather: '阴',
                        camera: '富士一次性胶片机',
                        film: 'C400',
                        photos: [
                            '/photos/phase2/zhejiang/A/A3/photos/000011.JPG',
                            '/photos/phase2/zhejiang/A/A3/photos/000013.JPG',
                            '/photos/phase2/zhejiang/A/A3/photos/000014.JPG',
                            '/photos/phase2/zhejiang/A/A3/photos/000015.JPG',
                            '/photos/phase2/zhejiang/A/A3/photos/000016.JPG',
                            '/photos/phase2/zhejiang/A/A3/photos/000035.JPG'
                        ],
                        message: '城里的味道，是火腿与烟火。',
                        messageImages: [
                            '/photos/phase2/zhejiang/A/A3/message/6f3fb03b150d09c974b6390035717eda.jpg'
                        ],
                        coordinates: { lat: 29.0791, lng: 119.6474 },
                        tags: ['火腿', '市井', '人情'],
                        nextLocation: '浙江省温州市',
                        nextParticipant: '温州记录者'
                    },
                    {
                        id: 4,
                        name: '第四棒',
                        participant: '温州记录者',
                        location: '浙江省温州市',
                        province: '浙江省',
                        city: '温州市',
                        date: '2024-04-10',
                        time: '11:40',
                        weather: '晴',
                        camera: '富士一次性胶片机',
                        film: 'C400',
                        photos: [
                            '/photos/phase2/zhejiang/A/A4/photos/000017.JPG',
                            '/photos/phase2/zhejiang/A/A4/photos/000018.JPG',
                            '/photos/phase2/zhejiang/A/A4/photos/000019.JPG',
                            '/photos/phase2/zhejiang/A/A4/photos/000036.JPG',
                            '/photos/phase2/zhejiang/A/A4/photos/000037.JPG'
                        ],
                        message: '海风吹过瓯越，灯塔在等晚潮。',
                        messageImages: [
                            '/photos/phase2/zhejiang/A/A4/message/306f3b3af2dada74fb53789cdba5b47f.jpg'
                        ],
                        coordinates: { lat: 27.9949, lng: 120.6993 },
                        tags: ['海风', '灯塔', '晚潮'],
                        nextLocation: '浙江省台州市',
                        nextParticipant: '台州记录者'
                    },
                    {
                        id: 5,
                        name: '第五棒',
                        participant: '台州记录者',
                        location: '浙江省台州市',
                        province: '浙江省',
                        city: '台州市',
                        date: '2024-04-13',
                        time: '14:00',
                        weather: '晴',
                        camera: '富士一次性胶片机',
                        film: 'C400',
                        photos: [
                            '/photos/phase2/zhejiang/A/A5/photos/000022.JPG',
                            '/photos/phase2/zhejiang/A/A5/photos/000023.JPG',
                            '/photos/phase2/zhejiang/A/A5/photos/000024.JPG',
                            '/photos/phase2/zhejiang/A/A5/photos/000025.JPG',
                            '/photos/phase2/zhejiang/A/A5/photos/000026.JPG',
                            '/photos/phase2/zhejiang/A/A5/photos/000027.JPG'
                        ],
                        message: '海岸线像一首舒展的歌。',
                        messageImages: [
                            '/photos/phase2/zhejiang/A/A5/message/bbf79bc4bf65e3ef36f4ae6fa8d77199.jpg'
                        ],
                        coordinates: { lat: 28.6614, lng: 121.4330 },
                        tags: ['海岸线', '礁石', '浪花'],
                        nextLocation: '浙江省舟山市',
                        nextParticipant: '舟山记录者'
                    },
                    {
                        id: 6,
                        name: '第六棒',
                        participant: '舟山记录者',
                        location: '浙江省舟山市',
                        province: '浙江省',
                        city: '舟山市',
                        date: '2024-04-16',
                        time: '17:00',
                        weather: '多云',
                        camera: '富士一次性胶片机',
                        film: 'C400',
                        photos: [
                            '/photos/phase2/zhejiang/A/A6/photos/000028.JPG',
                            '/photos/phase2/zhejiang/A/A6/photos/000030.JPG',
                            '/photos/phase2/zhejiang/A/A6/photos/000031.JPG',
                            '/photos/phase2/zhejiang/A/A6/photos/000032.JPG',
                            '/photos/phase2/zhejiang/A/A6/photos/000033.JPG',
                            '/photos/phase2/zhejiang/A/A6/photos/000038.JPG'
                        ],
                        message: '群岛与渔火，收尾于大海。',
                        messageImages: [
                            '/photos/phase2/zhejiang/A/A6/message/07caf3ecbcf3d99d3cb583ead26bb2eb.jpg',
                            '/photos/phase2/zhejiang/A/A6/message/bef01e9690ea06ede4f0d07c9c773e5a.jpg'
                        ],
                        coordinates: { lat: 29.9856, lng: 122.2070 },
                        tags: ['群岛', '渔火', '大海'],
                        nextLocation: '终点',
                        nextParticipant: '完成'
                    }
                ]
            },
            {
                id: 'B',
                name: 'B组',
                description: '宁波-绍兴-嘉兴-杭州-湖州-嘉兴线',
                province: '浙江省',
                startLocation: '宁波市',
                endLocation: '嘉兴市',
                color: 'from-green-500 to-green-600',
                bgColor: 'from-green-50 to-green-100',
                status: 'completed',
                participantCount: 6,
                currentRelay: 6,
                progress: 100,
                relays: [
                    {
                        id: 1,
                        name: '第一棒',
                        participant: '宁波记录者',
                        location: '浙江省宁波市',
                        province: '浙江省',
                        city: '宁波市',
                        date: '2024-04-01',
                        time: '09:30',
                        weather: '晴',
                        camera: '富士一次性胶片机',
                        film: 'C400',
                        photos: [
                            '/photos/phase2/zhejiang/B/B1/photos/000001.JPG',
                            '/photos/phase2/zhejiang/B/B1/photos/000002.JPG',
                            '/photos/phase2/zhejiang/B/B1/photos/000003.JPG',
                            '/photos/phase2/zhejiang/B/B1/photos/000004.JPG'
                        ],
                        message: '海港与风帆，启程的方向。',
                        messageImages: [
                            '/photos/phase2/zhejiang/B/B1/message/微信图片_20250926103104_240_38.jpg',
                            '/photos/phase2/zhejiang/B/B1/message/微信图片_20250926103104_241_38.jpg',
                            '/photos/phase2/zhejiang/B/B1/message/微信图片_20250926133747_250_38.jpg',
                            '/photos/phase2/zhejiang/B/B1/message/微信图片_20250926133751_251_38.jpg',
                            '/photos/phase2/zhejiang/B/B1/message/微信图片_20250926133754_252_38.jpg',
                            '/photos/phase2/zhejiang/B/B1/message/微信图片_20250926133756_253_38.jpg',
                            '/photos/phase2/zhejiang/B/B1/message/微信图片_20250926133759_254_38.jpg',
                            '/photos/phase2/zhejiang/B/B1/message/微信图片_20250926133802_255_38.jpg',
                            '/photos/phase2/zhejiang/B/B1/message/微信图片_20250926133806_256_38.jpg'
                        ],
                        coordinates: { lat: 29.8683, lng: 121.5440 },
                        tags: ['海港', '风帆'],
                        nextLocation: '浙江省绍兴市',
                        nextParticipant: '绍兴记录者'
                    },
                    {
                        id: 2,
                        name: '第二棒',
                        participant: '绍兴记录者',
                        location: '浙江省绍兴市',
                        province: '浙江省',
                        city: '绍兴市',
                        date: '2024-04-04',
                        time: '10:20',
                        weather: '多云',
                        camera: '富士一次性胶片机',
                        film: 'C400',
                        photos: [
                            '/photos/phase2/zhejiang/B/B2/photos/000006.JPG',
                            '/photos/phase2/zhejiang/B/B2/photos/000008.JPG',
                            '/photos/phase2/zhejiang/B/B2/photos/000009.JPG',
                            '/photos/phase2/zhejiang/B/B2/photos/000010.JPG',
                            '/photos/phase2/zhejiang/B/B2/photos/000036.JPG'
                        ],
                        message: '黄酒与乌篷船，摇过水乡。',
                        messageImages: [
                            '/photos/phase2/zhejiang/B/B2/message/微信图片_20250926133809_257_38.jpg',
                            '/photos/phase2/zhejiang/B/B2/message/微信图片_20250926133813_258_38.jpg',
                            '/photos/phase2/zhejiang/B/B2/message/微信图片_20250926133816_259_38.jpg',
                            '/photos/phase2/zhejiang/B/B2/message/微信图片_20250926133819_260_38.jpg',
                            '/photos/phase2/zhejiang/B/B2/message/微信图片_20250926133822_261_38.jpg'
                        ],
                        coordinates: { lat: 30.0044, lng: 120.5853 },
                        tags: ['乌篷船', '黄酒'],
                        nextLocation: '浙江省嘉兴市',
                        nextParticipant: '嘉兴记录者'
                    },
                    {
                        id: 3,
                        name: '第三棒',
                        participant: '嘉兴记录者',
                        location: '浙江省嘉兴市',
                        province: '浙江省',
                        city: '嘉兴市',
                        date: '2024-04-07',
                        time: '11:00',
                        weather: '阴',
                        camera: '富士一次性胶片机',
                        film: 'C400',
                        photos: [
                            '/photos/phase2/zhejiang/B/B3/photos/000011.JPG',
                            '/photos/phase2/zhejiang/B/B3/photos/000012.JPG',
                            '/photos/phase2/zhejiang/B/B3/photos/000013.JPG',
                            '/photos/phase2/zhejiang/B/B3/photos/000014.JPG',
                            '/photos/phase2/zhejiang/B/B3/photos/000015.JPG',
                            '/photos/phase2/zhejiang/B/B3/photos/000016.JPG'
                        ],
                        message: '南湖映红船，故事在继续。',
                        messageImages: [
                            '/photos/phase2/zhejiang/B/B3/message/微信图片_20250926133825_262_38.jpg',
                            '/photos/phase2/zhejiang/B/B3/message/微信图片_20250926133828_263_38.jpg',
                            '/photos/phase2/zhejiang/B/B3/message/微信图片_20250926133831_264_38.jpg'
                        ],
                        coordinates: { lat: 30.7461, lng: 120.7540 },
                        tags: ['南湖', '红船'],
                        nextLocation: '浙江省杭州市',
                        nextParticipant: '杭州记录者'
                    },
                    {
                        id: 4,
                        name: '第四棒',
                        participant: '杭州记录者',
                        location: '浙江省杭州市',
                        province: '浙江省',
                        city: '杭州市',
                        date: '2024-04-10',
                        time: '14:10',
                        weather: '晴',
                        camera: '富士一次性胶片机',
                        film: 'C400',
                        photos: [
                            '/photos/phase2/zhejiang/B/B4/photos/000017.JPG',
                            '/photos/phase2/zhejiang/B/B4/photos/000018.JPG',
                            '/photos/phase2/zhejiang/B/B4/photos/000019.JPG',
                            '/photos/phase2/zhejiang/B/B4/photos/000020.JPG',
                            '/photos/phase2/zhejiang/B/B4/photos/000021.JPG',
                            '/photos/phase2/zhejiang/B/B4/photos/000022.JPG'
                        ],
                        message: '湖山如画，城在诗里。',
                        messageImages: [
                            '/photos/phase2/zhejiang/B/B4/message/微信图片_20250926133833_265_38.jpg',
                            '/photos/phase2/zhejiang/B/B4/message/微信图片_20250926133836_266_38.jpg',
                            '/photos/phase2/zhejiang/B/B4/message/微信图片_20250926133838_267_38.jpg',
                            '/photos/phase2/zhejiang/B/B4/message/微信图片_20250926133841_268_38.jpg',
                            '/photos/phase2/zhejiang/B/B4/message/微信图片_20250926133844_269_38.jpg',
                            '/photos/phase2/zhejiang/B/B4/message/微信图片_20250926133848_270_38.jpg'
                        ],
                        coordinates: { lat: 30.2741, lng: 120.1551 },
                        tags: ['西湖', '诗画'],
                        nextLocation: '浙江省湖州市',
                        nextParticipant: '湖州记录者'
                    },
                    {
                        id: 5,
                        name: '第五棒',
                        participant: '湖州记录者',
                        location: '浙江省湖州市',
                        province: '浙江省',
                        city: '湖州市',
                        date: '2024-04-13',
                        time: '15:00',
                        weather: '多云',
                        camera: '富士一次性胶片机',
                        film: 'C400',
                        photos: [
                            '/photos/phase2/zhejiang/B/B5/photos/000023.JPG',
                            '/photos/phase2/zhejiang/B/B5/photos/000024.JPG',
                            '/photos/phase2/zhejiang/B/B5/photos/000025.JPG',
                            '/photos/phase2/zhejiang/B/B5/photos/000026.JPG',
                            '/photos/phase2/zhejiang/B/B5/photos/000027.JPG'
                        ],
                        message: '太湖之滨，风拂苇荡。',
                        messageImages: [
                            '/photos/phase2/zhejiang/B/B5/message/微信图片_20250926133851_271_38.jpg',
                            '/photos/phase2/zhejiang/B/B5/message/微信图片_20250926133854_272_38.jpg'
                        ],
                        coordinates: { lat: 30.8944, lng: 120.0869 },
                        tags: ['太湖', '苇荡'],
                        nextLocation: '浙江省嘉兴市',
                        nextParticipant: '嘉兴完成者'
                    },
                    {
                        id: 6,
                        name: '第六棒',
                        participant: '嘉兴完成者',
                        location: '浙江省嘉兴市',
                        province: '浙江省',
                        city: '嘉兴市',
                        date: '2024-04-16',
                        time: '16:20',
                        weather: '晴',
                        camera: '富士一次性胶片机',
                        film: 'C400',
                        photos: [
                            '/photos/phase2/zhejiang/B/B6/photos/微信图片_20250926133321_242_38.jpg',
                            '/photos/phase2/zhejiang/B/B6/photos/微信图片_20250926133326_243_38.jpg',
                            '/photos/phase2/zhejiang/B/B6/photos/微信图片_20250926133332_244_38.jpg',
                            '/photos/phase2/zhejiang/B/B6/photos/微信图片_20250926133339_245_38.jpg',
                            '/photos/phase2/zhejiang/B/B6/photos/微信图片_20250926133346_246_38.jpg',
                            '/photos/phase2/zhejiang/B/B6/photos/微信图片_20250926133354_247_38.jpg',
                            '/photos/phase2/zhejiang/B/B6/photos/微信图片_20250926133358_248_38.jpg',
                            '/photos/phase2/zhejiang/B/B6/photos/微信图片_20250926133359_249_38.jpg'
                        ],
                        message: '回到起点，故事圆满。',
                        messageImages: [
                            '/photos/phase2/zhejiang/B/B6/message/微信图片_20250926133856_273_38.jpg',
                            '/photos/phase2/zhejiang/B/B6/message/微信图片_20250926133859_274_38.jpg'
                        ],
                        coordinates: { lat: 30.7461, lng: 120.7540 },
                        tags: ['圆满', '归来'],
                        nextLocation: '终点',
                        nextParticipant: '完成'
                    }
                ]
            }
        ],
        totalGroups: 2,
        activeGroups: 0,
        completedGroups: 2,
        coordinates: { lat: 30.2741, lng: 120.1551 },
        boundary: [
            [118.0, 27.0], [121.0, 27.0], [121.0, 31.0], [118.0, 31.0]
        ]
    },
    {
        id: 'guangdong',
        name: '广东省',
        shortName: '粤',
        description: '改革开放前沿，活力广东',
        color: 'from-red-500 to-red-600',
        bgColor: 'from-red-50 to-red-100',
        groups: [
            {
                id: 'C',
                name: 'C组',
                description: '云浮-广州-佛山-中山-珠海-江门线',
                province: '广东省',
                startLocation: '云浮市',
                endLocation: '江门市',
                color: 'from-red-500 to-red-600',
                bgColor: 'from-red-50 to-red-100',
                status: 'active',
                participantCount: 6,
                currentRelay: 6,
                progress: 100,
                relays: [
                    {
                        id: 1,
                        name: '第一棒',
                        participant: '云浮记录者',
                        location: '广东省云浮市',
                        province: '广东省',
                        city: '云浮市',
                        date: '2025-09-10',
                        time: '09:00',
                        weather: '晴',
                        camera: '富士一次性胶片机',
                        film: 'C400',
                        photos: [
                            "/photos/phase2/guangdong/C/C1/photos/000001.JPG",
                            "/photos/phase2/guangdong/C/C1/photos/000002.JPG",
                            "/photos/phase2/guangdong/C/C1/photos/000003.JPG",
                            "/photos/phase2/guangdong/C/C1/photos/000004.JPG",
                        ],
                        message: '云浮的山石间，清风带来玉都的回响。',
                        messageImages: [
                            "/photos/phase2/guangdong/C/C1/message/微信图片_20251010174339_339_38.jpg",
                            "/photos/phase2/guangdong/C/C1/message/微信图片_20251010174358_340_38.jpg",
                            "/photos/phase2/guangdong/C/C1/message/微信图片_20251010174415_341_38.jpg",
                        ],
                        coordinates: { lat: 22.9156, lng: 112.0444 },
                        tags: ['玉都', '山风', '宁静'],
                        nextLocation: '广东省广州市',
                        nextParticipant: '广州记录者'
                    },
                    {
                        id: 2,
                        name: '第二棒',
                        participant: '广州记录者',
                        location: '广东省广州市',
                        province: '广东省',
                        city: '广州市',
                        date: '2025-09-11',
                        time: '10:00',
                        weather: '多云',
                        camera: '富士一次性胶片机',
                        film: 'C400',
                        photos: [
                            "/photos/phase2/guangdong/C/C2/photos/000005.JPG",
                            "/photos/phase2/guangdong/C/C2/photos/000006.JPG",
                            "/photos/phase2/guangdong/C/C2/photos/000007.JPG",
                            "/photos/phase2/guangdong/C/C2/photos/000009.JPG",
                            "/photos/phase2/guangdong/C/C2/photos/000010.JPG",
                            "/photos/phase2/guangdong/C/C2/photos/000035.JPG",
                        ],
                        message: '珠江畔的天际线，在晨光中慢慢苏醒。',
                        messageImages: [
                            "/photos/phase2/guangdong/C/C2/message/微信图片_20251010174433_342_38.jpg",
                            "/photos/phase2/guangdong/C/C2/message/微信图片_20251010174450_343_38.jpg",
                            "/photos/phase2/guangdong/C/C2/message/微信图片_20251010174504_344_38.jpg",
                        ],
                        coordinates: { lat: 23.1291, lng: 113.2644 },
                        tags: ['珠江', '晨光', '城市节奏'],
                        nextLocation: '广东省佛山市',
                        nextParticipant: '佛山记录者'
                    },
                    {
                        id: 3,
                        name: '第三棒',
                        participant: '佛山记录者',
                        location: '广东省佛山市',
                        province: '广东省',
                        city: '佛山市',
                        date: '2025-09-12',
                        time: '15:20',
                        weather: '阴',
                        camera: '富士一次性胶片机',
                        film: 'C400',
                        photos: [
                            "/photos/phase2/guangdong/C/C3/photos/000015.JPG",
                            "/photos/phase2/guangdong/C/C3/photos/000016.JPG",
                            "/photos/phase2/guangdong/C/C3/photos/000036.JPG",
                            "/photos/phase2/guangdong/C/C3/photos/000037.JPG",
                            "/photos/phase2/guangdong/C/C3/photos/000038.JPG",
                            "/photos/phase2/guangdong/C/C3/photos/000039.JPG",
                        ],
                        message: '龙狮在古庙边起舞，烟火里是岭南手艺。',
                        messageImages: [
                            "/photos/phase2/guangdong/C/C3/message/微信图片_20251010174521_345_38.jpg",
                        ],
                        coordinates: { lat: 23.0215, lng: 113.1214 },
                        tags: ['岭南', '龙狮', '手艺'],
                        nextLocation: '广东省中山市',
                        nextParticipant: '中山记录者'
                    },
                    {
                        id: 4,
                        name: '第四棒',
                        participant: '中山记录者',
                        location: '广东省中山市',
                        province: '广东省',
                        city: '中山市',
                        date: '2025-09-13',
                        time: '11:40',
                        weather: '晴',
                        camera: '富士一次性胶片机',
                        film: 'C400',
                        photos: [
                            "/photos/phase2/guangdong/C/C4/photos/000017.JPG",
                            "/photos/phase2/guangdong/C/C4/photos/000018.JPG",
                            "/photos/phase2/guangdong/C/C4/photos/000019.JPG",
                            "/photos/phase2/guangdong/C/C4/photos/000020.JPG",
                            "/photos/phase2/guangdong/C/C4/photos/000021.JPG",
                            "/photos/phase2/guangdong/C/C4/photos/000022.JPG",
                        ],
                        message: '香山古韵与现代街区交织出温度。',
                        messageImages: [
                            "/photos/phase2/guangdong/C/C4/message/微信图片_20251010174537_346_38.jpg",
                            "/photos/phase2/guangdong/C/C4/message/微信图片_20251010174552_347_38.jpg",
                        ],
                        coordinates: { lat: 22.5160, lng: 113.3926 },
                        tags: ['香山', '街巷', '人情'],
                        nextLocation: '广东省珠海市',
                        nextParticipant: '珠海记录者'
                    },
                    {
                        id: 5,
                        name: '第五棒',
                        participant: '珠海记录者',
                        location: '广东省珠海市',
                        province: '广东省',
                        city: '珠海市',
                        date: '2025-09-14',
                        time: '14:00',
                        weather: '晴',
                        camera: '富士一次性胶片机',
                        film: 'C400',
                        photos: [
                            "/photos/phase2/guangdong/C/C5/photos/000023.JPG",
                            "/photos/phase2/guangdong/C/C5/photos/000024.JPG",
                            "/photos/phase2/guangdong/C/C5/photos/000025.JPG",
                            "/photos/phase2/guangdong/C/C5/photos/000026.JPG",
                            "/photos/phase2/guangdong/C/C5/photos/000027.JPG",
                            "/photos/phase2/guangdong/C/C5/photos/000028.JPG",
                        ],
                        message: '情侣路的海风，让浪花唱起舒展的歌。',
                        messageImages: [
                            "/photos/phase2/guangdong/C/C5/message/微信图片_20251010174608_348_38.jpg",
                            "/photos/phase2/guangdong/C/C5/message/微信图片_20251010174624_349_38.jpg",
                            "/photos/phase2/guangdong/C/C5/message/微信图片_20251010174637_350_38.jpg",
                        ],
                        coordinates: { lat: 22.2707, lng: 113.5767 },
                        tags: ['情侣路', '海风', '浪花'],
                        nextLocation: '广东省江门市',
                        nextParticipant: '江门记录者'
                    },
                    {
                        id: 6,
                        name: '第六棒',
                        participant: '江门记录者',
                        location: '广东省江门市',
                        province: '广东省',
                        city: '江门市',
                        date: '2025-09-15',
                        time: '17:00',
                        weather: '多云',
                        camera: '富士一次性胶片机',
                        film: 'C400',
                        photos: [
                            "/photos/phase2/guangdong/C/C6/photos/000029.JPG",
                            "/photos/phase2/guangdong/C/C6/photos/000030.JPG",
                            "/photos/phase2/guangdong/C/C6/photos/000040.JPG",
                            "/photos/phase2/guangdong/C/C6/photos/000041.JPG",
                            "/photos/phase2/guangdong/C/C6/photos/000042.JPG"
                        ],
                        message: '侨乡江海交汇，渔火为旅程写下尾声。',
                        messageImages: [
                            "/photos/phase2/guangdong/C/C6/message/微信图片_20251010174657_351_38.jpg",
                            "/photos/phase2/guangdong/C/C6/message/微信图片_20251010174719_352_38.jpg",
                            "/photos/phase2/guangdong/C/C6/message/微信图片_20251010174734_353_38.jpg",
                        ],
                        coordinates: { lat: 22.5787, lng: 113.0810 },
                        tags: ['侨乡', '江海', '渔火'],
                        nextLocation: '终点',
                        nextParticipant: '完成'
                    }
                ]
            },
            {
                id: 'D',
                name: 'D组',
                description: '惠州-深圳-东莞-佛山-清远-韶关线',
                province: '广东省',
                startLocation: '惠州市',
                endLocation: '韶关市',
                color: 'from-pink-500 to-pink-600',
                bgColor: 'from-pink-50 to-pink-100',
                status: 'completed',
                participantCount: 6,
                currentRelay: 6,
                progress: 100,
                relays: [
                    {
                        id: 1,
                        name: '第一棒',
                        participant: '惠州记录者',
                        location: '广东省惠州市',
                        province: '广东省',
                        city: '惠州市',
                        date: '2025-10-17',
                        time: '19:48',
                        weather: '晴',
                        camera: '富士一次性胶片机',
                        film: 'C400',
                        photos: [
                            "/photos/phase2/guangdong/D/D1/photos/000001.JPG",
                            "/photos/phase2/guangdong/D/D1/photos/000002.JPG",
                            "/photos/phase2/guangdong/D/D1/photos/000003.JPG",
                            "/photos/phase2/guangdong/D/D1/photos/000004.JPG",
                            "/photos/phase2/guangdong/D/D1/photos/000005.JPG",
                            "/photos/phase2/guangdong/D/D1/photos/000006.JPG",
                            "/photos/phase2/guangdong/D/D1/photos/000007.JPG"
                        ],
                        message: '东江与西湖交汇，惠州的夜风轻拂胶片里的光。',
                        messageImages: [
                            "/photos/phase2/guangdong/D/D1/message/微信图片_20251017194838_378_38.jpg"
                        ],
                        coordinates: { lat: 23.1107, lng: 114.4168 },
                        tags: ['惠州', '东江', '夜色'],
                        nextLocation: '广东省深圳市',
                        nextParticipant: '深圳记录者'
                    },
                    {
                        id: 2,
                        name: '第二棒',
                        participant: '深圳记录者',
                        location: '广东省深圳市',
                        province: '广东省',
                        city: '深圳市',
                        date: '2025-10-17',
                        time: '19:49',
                        weather: '多云',
                        camera: '富士一次性胶片机',
                        film: 'C400',
                        photos: [
                            "/photos/phase2/guangdong/D/D2/photos/000007.JPG",
                            "/photos/phase2/guangdong/D/D2/photos/000008.JPG",
                            "/photos/phase2/guangdong/D/D2/photos/000009.JPG",
                            "/photos/phase2/guangdong/D/D2/photos/000010.JPG",
                            "/photos/phase2/guangdong/D/D2/photos/000011.JPG",
                            "/photos/phase2/guangdong/D/D2/photos/000012.JPG"
                        ],
                        message: '摩天楼与海风交织，深圳的夜幕充满律动。',
                        messageImages: [
                            "/photos/phase2/guangdong/D/D2/message/微信图片_20251017194853_379_38.jpg"
                        ],
                        coordinates: { lat: 22.5431, lng: 114.0579 },
                        tags: ['深圳', '都市', '海风'],
                        nextLocation: '广东省东莞市',
                        nextParticipant: '东莞记录者'
                    },
                    {
                        id: 3,
                        name: '第三棒',
                        participant: '东莞记录者',
                        location: '广东省东莞市',
                        province: '广东省',
                        city: '东莞市',
                        date: '2025-10-17',
                        time: '19:49',
                        weather: '晴',
                        camera: '富士一次性胶片机',
                        film: 'C400',
                        photos: [
                            "/photos/phase2/guangdong/D/D3/photos/000014.JPG",
                            "/photos/phase2/guangdong/D/D3/photos/000015.JPG",
                            "/photos/phase2/guangdong/D/D3/photos/000016.JPG",
                            "/photos/phase2/guangdong/D/D3/photos/000017.JPG",
                            "/photos/phase2/guangdong/D/D3/photos/000018.JPG"
                        ],
                        message: '松山湖畔灯火点点，东莞的工业城也有温柔一面。',
                        messageImages: [
                            "/photos/phase2/guangdong/D/D3/message/微信图片_20251017194911_380_38.jpg"
                        ],
                        coordinates: { lat: 23.0207, lng: 113.7518 },
                        tags: ['东莞', '松山湖', '灯火'],
                        nextLocation: '广东省佛山市',
                        nextParticipant: '佛山记录者'
                    },
                    {
                        id: 4,
                        name: '第四棒',
                        participant: '佛山记录者',
                        location: '广东省佛山市',
                        province: '广东省',
                        city: '佛山市',
                        date: '2025-10-17',
                        time: '19:50',
                        weather: '多云',
                        camera: '富士一次性胶片机',
                        film: 'C400',
                        photos: [
                            "/photos/phase2/guangdong/D/D4/photos/000019.JPG",
                            "/photos/phase2/guangdong/D/D4/photos/000020.JPG",
                            "/photos/phase2/guangdong/D/D4/photos/000021.JPG",
                            "/photos/phase2/guangdong/D/D4/photos/000022.JPG",
                            "/photos/phase2/guangdong/D/D4/photos/000023.JPG"
                        ],
                        message: '岭南古韵与珠水交织，佛山的夜晚沉淀着烟火。',
                        messageImages: [
                            "/photos/phase2/guangdong/D/D4/message/微信图片_20251017194928_381_38.jpg"
                        ],
                        coordinates: { lat: 23.0218, lng: 113.1214 },
                        tags: ['佛山', '岭南', '烟火气'],
                        nextLocation: '广东省清远市',
                        nextParticipant: '清远记录者'
                    },
                    {
                        id: 5,
                        name: '第五棒',
                        participant: '清远记录者',
                        location: '广东省清远市',
                        province: '广东省',
                        city: '清远市',
                        date: '2025-10-17',
                        time: '19:50',
                        weather: '多云',
                        camera: '富士一次性胶片机',
                        film: 'C400',
                        photos: [
                            "/photos/phase2/guangdong/D/D5/photos/000024.JPG",
                            "/photos/phase2/guangdong/D/D5/photos/000025.JPG",
                            "/photos/phase2/guangdong/D/D5/photos/000026.JPG",
                            "/photos/phase2/guangdong/D/D5/photos/000027.JPG",
                            "/photos/phase2/guangdong/D/D5/photos/000028.JPG",
                            "/photos/phase2/guangdong/D/D5/photos/000029.JPG"
                        ],
                        message: '北江岸边雾气升腾，清远的山水让夜色更显灵动。',
                        messageImages: [
                            "/photos/phase2/guangdong/D/D5/message/微信图片_20251017194949_382_38.jpg",
                            "/photos/phase2/guangdong/D/D5/message/微信图片_20251017195007_383_38.jpg",
                            "/photos/phase2/guangdong/D/D5/message/微信图片_20251017195023_384_38.jpg"
                        ],
                        coordinates: { lat: 23.682, lng: 113.056 },
                        tags: ['清远', '北江', '山水'],
                        nextLocation: '广东省韶关市',
                        nextParticipant: '韶关记录者'
                    },
                    {
                        id: 6,
                        name: '第六棒',
                        participant: '韶关记录者',
                        location: '广东省韶关市',
                        province: '广东省',
                        city: '韶关市',
                        date: '2025-10-17',
                        time: '19:51',
                        weather: '晴',
                        camera: '富士一次性胶片机',
                        film: 'C400',
                        photos: [
                            "/photos/phase2/guangdong/D/D6/photos/000030.JPG",
                            "/photos/phase2/guangdong/D/D6/photos/000031.JPG",
                            "/photos/phase2/guangdong/D/D6/photos/000033.JPG",
                            "/photos/phase2/guangdong/D/D6/photos/000034.JPG",
                            "/photos/phase2/guangdong/D/D6/photos/000035.JPG"
                        ],
                        message: '丹霞脚下灯火点亮，韶关为这段旅程写下尾声。',
                        messageImages: [
                            "/photos/phase2/guangdong/D/D6/message/微信图片_20251017195040_385_38.jpg",
                            "/photos/phase2/guangdong/D/D6/message/微信图片_20251017195100_386_38.jpg",
                            "/photos/phase2/guangdong/D/D6/message/微信图片_20251017195118_387_38.jpg",
                            "/photos/phase2/guangdong/D/D6/message/微信图片_20251017195138_388_38.jpg",
                            "/photos/phase2/guangdong/D/D6/message/微信图片_20251017195150_389_38.jpg"
                        ],
                        coordinates: { lat: 24.8104, lng: 113.597 },
                        tags: ['韶关', '丹霞', '旅程'],
                        nextLocation: '终点',
                        nextParticipant: '完成'
                    }
                ]
            },
            {
                id: 'E',
                name: 'E组',
                description: '汕头-潮州-揭阳线',
                province: '广东省',
                startLocation: '汕头市',
                endLocation: '揭阳市',
                color: 'from-rose-500 to-rose-600',
                bgColor: 'from-rose-50 to-rose-100',
                status: 'active',
                participantCount: 6,
                currentRelay: 1,
                progress: 17,
                relays: []
            },
            {
                id: 'F',
                name: 'F组',
                description: '湛江-茂名-阳江线',
                province: '广东省',
                startLocation: '湛江市',
                endLocation: '阳江市',
                color: 'from-indigo-500 to-indigo-600',
                bgColor: 'from-indigo-50 to-indigo-100',
                status: 'active',
                participantCount: 6,
                currentRelay: 4,
                progress: 67,
                relays: []
            }
        ],
        totalGroups: 4,
        activeGroups: 4,
        completedGroups: 0,
        coordinates: { lat: 23.1291, lng: 113.2644 },
        boundary: [
            [109.0, 20.0], [117.0, 20.0], [117.0, 25.0], [109.0, 25.0]
        ]
    },
    {
        id: 'jiangsu',
        name: '江苏省',
        shortName: '苏',
        description: '鱼米之乡，文化江苏',
        color: 'from-emerald-500 to-emerald-600',
        bgColor: 'from-emerald-50 to-emerald-100',
        groups: [
            {
                id: 'G',
                name: 'G组',
                description: '南京-苏州-无锡线',
                province: '江苏省',
                startLocation: '南京市',
                endLocation: '无锡市',
                color: 'from-emerald-500 to-emerald-600',
                bgColor: 'from-emerald-50 to-emerald-100',
                status: 'active',
                participantCount: 6,
                currentRelay: 2,
                progress: 33,
                relays: []
            },
            {
                id: 'H',
                name: 'H组',
                description: '常州-镇江-扬州线',
                province: '江苏省',
                startLocation: '常州市',
                endLocation: '扬州市',
                color: 'from-teal-500 to-teal-600',
                bgColor: 'from-teal-50 to-teal-100',
                status: 'active',
                participantCount: 6,
                currentRelay: 1,
                progress: 17,
                relays: []
            },
            {
                id: 'I',
                name: 'I组',
                description: '徐州-淮安-宿迁线',
                province: '江苏省',
                startLocation: '徐州市',
                endLocation: '宿迁市',
                color: 'from-sky-500 to-sky-600',
                bgColor: 'from-sky-50 to-sky-100',
                status: 'active',
                participantCount: 6,
                currentRelay: 1,
                progress: 17,
                relays: []
            }
        ],
        totalGroups: 3,
        activeGroups: 3,
        completedGroups: 0,
        coordinates: { lat: 32.0603, lng: 118.7969 },
        boundary: [
            [116.0, 30.0], [122.0, 30.0], [122.0, 35.0], [116.0, 35.0]
        ]
    },
    {
        id: 'shanghai',
        name: '上海市',
        shortName: '沪',
        description: '东方明珠，国际都市',
        color: 'from-purple-500 to-purple-600',
        bgColor: 'from-purple-50 to-purple-100',
        groups: [
            {
                id: 'J',
                name: 'J组',
                description: '上海全境线',
                province: '上海市',
                startLocation: '浦东新区',
                endLocation: '黄浦区',
                color: 'from-purple-500 to-purple-600',
                bgColor: 'from-purple-50 to-purple-100',
                status: 'active',
                participantCount: 6,
                currentRelay: 4,
                progress: 67,
                relays: []
            }
        ],
        totalGroups: 1,
        activeGroups: 1,
        completedGroups: 0,
        coordinates: { lat: 31.2304, lng: 121.4737 },
        boundary: [
            [120.8, 30.7], [122.0, 30.7], [122.0, 31.9], [120.8, 31.9]
        ]
    },
    // 其他省份（暂时只有基本信息）
    {
        id: 'beijing',
        name: '北京市',
        shortName: '京',
        description: '首都北京，历史文化名城',
        color: 'from-gray-500 to-gray-600',
        bgColor: 'from-gray-50 to-gray-100',
        groups: [],
        totalGroups: 0,
        activeGroups: 0,
        completedGroups: 0,
        coordinates: { lat: 39.9042, lng: 116.4074 }
    },
    {
        id: 'tianjin',
        name: '天津市',
        shortName: '津',
        description: '海河之滨，北方重镇',
        color: 'from-gray-500 to-gray-600',
        bgColor: 'from-gray-50 to-gray-100',
        groups: [],
        totalGroups: 0,
        activeGroups: 0,
        completedGroups: 0,
        coordinates: { lat: 39.3434, lng: 117.3616 }
    },
    {
        id: 'chongqing',
        name: '重庆市',
        shortName: '渝',
        description: '山城重庆，火锅之都',
        color: 'from-gray-500 to-gray-600',
        bgColor: 'from-gray-50 to-gray-100',
        groups: [],
        totalGroups: 0,
        activeGroups: 0,
        completedGroups: 0,
        coordinates: { lat: 29.4316, lng: 106.9123 }
    },
    {
        id: 'hebei',
        name: '河北省',
        shortName: '冀',
        description: '燕赵大地，历史悠长',
        color: 'from-gray-500 to-gray-600',
        bgColor: 'from-gray-50 to-gray-100',
        groups: [],
        totalGroups: 0,
        activeGroups: 0,
        completedGroups: 0,
        coordinates: { lat: 38.0428, lng: 114.5149 }
    },
    {
        id: 'shanxi',
        name: '山西省',
        shortName: '晋',
        description: '表里山河，煤炭之乡',
        color: 'from-gray-500 to-gray-600',
        bgColor: 'from-gray-50 to-gray-100',
        groups: [],
        totalGroups: 0,
        activeGroups: 0,
        completedGroups: 0,
        coordinates: { lat: 37.8706, lng: 112.5489 }
    },
    {
        id: 'liaoning',
        name: '辽宁省',
        shortName: '辽',
        description: '东北门户，工业重镇',
        color: 'from-gray-500 to-gray-600',
        bgColor: 'from-gray-50 to-gray-100',
        groups: [],
        totalGroups: 0,
        activeGroups: 0,
        completedGroups: 0,
        coordinates: { lat: 41.8057, lng: 123.4315 }
    },
    {
        id: 'jilin',
        name: '吉林省',
        shortName: '吉',
        description: '白山黑水，汽车之城',
        color: 'from-gray-500 to-gray-600',
        bgColor: 'from-gray-50 to-gray-100',
        groups: [],
        totalGroups: 0,
        activeGroups: 0,
        completedGroups: 0,
        coordinates: { lat: 43.8171, lng: 125.3235 }
    },
    {
        id: 'heilongjiang',
        name: '黑龙江省',
        shortName: '黑',
        description: '北国风光，冰雪世界',
        color: 'from-gray-500 to-gray-600',
        bgColor: 'from-gray-50 to-gray-100',
        groups: [],
        totalGroups: 0,
        activeGroups: 0,
        completedGroups: 0,
        coordinates: { lat: 45.8038, lng: 126.5350 }
    },
    {
        id: 'anhui',
        name: '安徽省',
        shortName: '皖',
        description: '江淮大地，徽商故里',
        color: 'from-gray-500 to-gray-600',
        bgColor: 'from-gray-50 to-gray-100',
        groups: [],
        totalGroups: 0,
        activeGroups: 0,
        completedGroups: 0,
        coordinates: { lat: 31.8612, lng: 117.2831 }
    },
    {
        id: 'fujian',
        name: '福建省',
        shortName: '闽',
        description: '八闽大地，海上丝路',
        color: 'from-gray-500 to-gray-600',
        bgColor: 'from-gray-50 to-gray-100',
        groups: [
            {
                id: 'N',
                name: 'N组',
                description: '福州-莆田-泉州线',
                province: '福建省',
                startLocation: '福州市',
                endLocation: '泉州市',
                color: 'from-lime-500 to-lime-600',
                bgColor: 'from-lime-50 to-lime-100',
                status: 'planning',
                participantCount: 6,
                currentRelay: 0,
                progress: 0,
                relays: []
            },
            {
                id: 'O',
                name: 'O组',
                description: '厦门-漳州-龙岩线',
                province: '福建省',
                startLocation: '厦门市',
                endLocation: '龙岩市',
                color: 'from-amber-500 to-amber-600',
                bgColor: 'from-amber-50 to-amber-100',
                status: 'planning',
                participantCount: 6,
                currentRelay: 0,
                progress: 0,
                relays: []
            }
        ],
        totalGroups: 2,
        activeGroups: 0,
        completedGroups: 0,
        coordinates: { lat: 26.0745, lng: 119.2965 }
    },
    {
        id: 'jiangxi',
        name: '江西省',
        shortName: '赣',
        description: '赣江之滨，红色摇篮',
        color: 'from-gray-500 to-gray-600',
        bgColor: 'from-gray-50 to-gray-100',
        groups: [],
        totalGroups: 0,
        activeGroups: 0,
        completedGroups: 0,
        coordinates: { lat: 28.6765, lng: 115.8922 }
    },
    {
        id: 'shandong',
        name: '山东省',
        shortName: '鲁',
        description: '齐鲁大地，孔孟之乡',
        color: 'from-gray-500 to-gray-600',
        bgColor: 'from-gray-50 to-gray-100',
        groups: [],
        totalGroups: 0,
        activeGroups: 0,
        completedGroups: 0,
        coordinates: { lat: 36.6512, lng: 117.1201 }
    },
    {
        id: 'henan',
        name: '河南省',
        shortName: '豫',
        description: '中原大地，华夏之源',
        color: 'from-gray-500 to-gray-600',
        bgColor: 'from-gray-50 to-gray-100',
        groups: [],
        totalGroups: 0,
        activeGroups: 0,
        completedGroups: 0,
        coordinates: { lat: 34.7566, lng: 113.6254 }
    },
    {
        id: 'hubei',
        name: '湖北省',
        shortName: '鄂',
        description: '荆楚大地，千湖之省',
        color: 'from-gray-500 to-gray-600',
        bgColor: 'from-gray-50 to-gray-100',
        groups: [],
        totalGroups: 0,
        activeGroups: 0,
        completedGroups: 0,
        coordinates: { lat: 30.5928, lng: 114.3055 }
    },
    {
        id: 'hunan',
        name: '湖南省',
        shortName: '湘',
        description: '潇湘大地，伟人故里',
        color: 'from-gray-500 to-gray-600',
        bgColor: 'from-gray-50 to-gray-100',
        groups: [],
        totalGroups: 0,
        activeGroups: 0,
        completedGroups: 0,
        coordinates: { lat: 28.2278, lng: 112.9388 }
    },
    {
        id: 'neimenggu',
        name: '内蒙古自治区',
        shortName: '蒙',
        description: '草原明珠，马背上的民族',
        color: 'from-gray-500 to-gray-600',
        bgColor: 'from-gray-50 to-gray-100',
        groups: [],
        totalGroups: 0,
        activeGroups: 0,
        completedGroups: 0,
        coordinates: { lat: 40.818233, lng: 111.765226 }
    },
    {
        id: 'guangxi',
        name: '广西壮族自治区',
        shortName: '桂',
        description: '八桂大地，山水甲天下',
        color: 'from-gray-500 to-gray-600',
        bgColor: 'from-gray-50 to-gray-100',
        groups: [],
        totalGroups: 0,
        activeGroups: 0,
        completedGroups: 0,
        coordinates: { lat: 22.8170, lng: 108.3665 }
    },
    {
        id: 'hainan',
        name: '海南省',
        shortName: '琼',
        description: '天涯海角，椰风海韵',
        color: 'from-gray-500 to-gray-600',
        bgColor: 'from-gray-50 to-gray-100',
        groups: [
            {
                id: 'M',
                name: 'M组',
                description: '海口-三亚环岛线',
                province: '海南省',
                startLocation: '海口市',
                endLocation: '三亚市',
                color: 'from-orange-500 to-orange-600',
                bgColor: 'from-orange-50 to-orange-100',
                status: 'planning',
                participantCount: 6,
                currentRelay: 0,
                progress: 0,
                relays: []
            }
        ],
        totalGroups: 1,
        activeGroups: 0,
        completedGroups: 0,
        coordinates: { lat: 20.0311, lng: 110.3312 }
    },
    {
        id: 'sichuan',
        name: '四川省',
        shortName: '川',
        description: '天府之国，熊猫故乡',
        color: 'from-gray-500 to-gray-600',
        bgColor: 'from-gray-50 to-gray-100',
        groups: [],
        totalGroups: 0,
        activeGroups: 0,
        completedGroups: 0,
        coordinates: { lat: 30.5728, lng: 104.0668 }
    },
    {
        id: 'guizhou',
        name: '贵州省',
        shortName: '贵',
        description: '多彩贵州，山地公园',
        color: 'from-gray-500 to-gray-600',
        bgColor: 'from-gray-50 to-gray-100',
        groups: [],
        totalGroups: 0,
        activeGroups: 0,
        completedGroups: 0,
        coordinates: { lat: 26.6470, lng: 106.6302 }
    },
    {
        id: 'yunnan',
        name: '云南省',
        shortName: '滇',
        description: '彩云之南，四季如春',
        color: 'from-gray-500 to-gray-600',
        bgColor: 'from-gray-50 to-gray-100',
        groups: [],
        totalGroups: 0,
        activeGroups: 0,
        completedGroups: 0,
        coordinates: { lat: 25.0389, lng: 102.7183 }
    },
    {
        id: 'tibet',
        name: '西藏自治区',
        shortName: '藏',
        description: '雪域高原，世界屋脊',
        color: 'from-gray-500 to-gray-600',
        bgColor: 'from-gray-50 to-gray-100',
        groups: [],
        totalGroups: 0,
        activeGroups: 0,
        completedGroups: 0,
        coordinates: { lat: 29.6465, lng: 91.1172 }
    },
    {
        id: 'shaanxi',
        name: '陕西省',
        shortName: '陕',
        description: '三秦大地，古都西安',
        color: 'from-gray-500 to-gray-600',
        bgColor: 'from-gray-50 to-gray-100',
        groups: [],
        totalGroups: 0,
        activeGroups: 0,
        completedGroups: 0,
        coordinates: { lat: 34.2658, lng: 108.9540 }
    },
    {
        id: 'gansu',
        name: '甘肃省',
        shortName: '甘',
        description: '陇原大地，丝路重镇',
        color: 'from-gray-500 to-gray-600',
        bgColor: 'from-gray-50 to-gray-100',
        groups: [],
        totalGroups: 0,
        activeGroups: 0,
        completedGroups: 0,
        coordinates: { lat: 36.0611, lng: 103.8343 }
    },
    {
        id: 'qinghai',
        name: '青海省',
        shortName: '青',
        description: '大美青海，三江之源',
        color: 'from-gray-500 to-gray-600',
        bgColor: 'from-gray-50 to-gray-100',
        groups: [],
        totalGroups: 0,
        activeGroups: 0,
        completedGroups: 0,
        coordinates: { lat: 36.6232, lng: 101.7782 }
    },
    {
        id: 'ningxia',
        name: '宁夏回族自治区',
        shortName: '宁',
        description: '塞上江南，回族之乡',
        color: 'from-gray-500 to-gray-600',
        bgColor: 'from-gray-50 to-gray-100',
        groups: [],
        totalGroups: 0,
        activeGroups: 0,
        completedGroups: 0,
        coordinates: { lat: 38.4872, lng: 106.2782 }
    },
    {
        id: 'xinjiang',
        name: '新疆维吾尔自治区',
        shortName: '新',
        description: '天山南北，瓜果之乡',
        color: 'from-gray-500 to-gray-600',
        bgColor: 'from-gray-50 to-gray-100',
        groups: [],
        totalGroups: 0,
        activeGroups: 0,
        completedGroups: 0,
        coordinates: { lat: 43.8256, lng: 87.6168 }
    },
    {
        id: 'taiwan',
        name: '台湾省',
        shortName: '台',
        description: '宝岛台湾，美丽之岛',
        color: 'from-gray-500 to-gray-600',
        bgColor: 'from-gray-50 to-gray-100',
        groups: [],
        totalGroups: 0,
        activeGroups: 0,
        completedGroups: 0,
        coordinates: { lat: 23.9739, lng: 120.9820 }
    },
    {
        id: 'hongkong',
        name: '香港特别行政区',
        shortName: '港',
        description: '东方之珠，国际金融中心',
        color: 'from-gray-500 to-gray-600',
        bgColor: 'from-gray-50 to-gray-100',
        groups: [
            {
                id: 'L',
                name: 'L组',
                description: '香港全境线',
                province: '香港特别行政区',
                startLocation: '中环',
                endLocation: '尖沙咀',
                color: 'from-gray-500 to-gray-600',
                bgColor: 'from-gray-50 to-gray-100',
                status: 'active',
                participantCount: 6,
                currentRelay: 2,
                progress: 33,
                relays: []
            }
        ],
        totalGroups: 1,
        activeGroups: 1,
        completedGroups: 0,
        coordinates: { lat: 22.3193, lng: 114.1694 },
        boundary: [
            [113.8, 22.1], [114.4, 22.1], [114.4, 22.6], [113.8, 22.6]
        ]
    },
    {
        id: 'macau',
        name: '澳门特别行政区',
        shortName: '澳',
        description: '莲花宝地，中西合璧',
        color: 'from-gray-500 to-gray-600',
        bgColor: 'from-gray-50 to-gray-100',
        groups: [
            {
                id: 'K',
                name: 'K组',
                description: '澳门全境线',
                province: '澳门特别行政区',
                startLocation: '澳门半岛',
                endLocation: '路氹城',
                color: 'from-gray-500 to-gray-600',
                bgColor: 'from-gray-50 to-gray-100',
                status: 'active',
                participantCount: 6,
                currentRelay: 1,
                progress: 17,
                relays: []
            }
        ],
        totalGroups: 1,
        activeGroups: 1,
        completedGroups: 0,
        coordinates: { lat: 22.1987, lng: 113.5439 },
        boundary: [
            [113.5, 22.1], [113.6, 22.1], [113.6, 22.3], [113.5, 22.3]
        ]
    }
];

// 获取所有省份
export const getAllProvinces = () => phase2Provinces;

// 根据ID获取省份
export const getProvinceById = (id: string) =>
    phase2Provinces.find(province => province.id === id);

// 根据省份ID和小组ID获取小组
export const getGroupById = (provinceId: string, groupId: string) => {
    const province = getProvinceById(provinceId);
    return province?.groups.find(group => group.id === groupId);
};

// 获取所有活跃的小组
export const getActiveGroups = () => {
    return phase2Provinces.flatMap(province =>
        province.groups.filter(group => group.status === 'active')
    );
};

// 获取所有已完成的小组
export const getCompletedGroups = () => {
    return phase2Provinces.flatMap(province =>
        province.groups.filter(group => group.status === 'completed')
    );
};
