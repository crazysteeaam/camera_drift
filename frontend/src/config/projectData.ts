// 导入图片路径自动生成工具
import { getAllPhotoConfig } from './photoConfig';

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
    subtitle: "第二期招募中",
    description: "继第一期成功举办后，我们正在招募第二期胶片漂流计划的参与者。这一次，我们的目标是点亮全国所有地级市，让胶片摄影的魅力传遍神州大地。",
    goal: "点亮全国所有地级市，记录每一个城市的独特魅力",
    features: [
        "覆盖全国333个地级市",
        "不限参与者身份，欢迎所有热爱摄影的朋友",
        "记录城市变迁与人文风情",
        "建立全国胶片摄影爱好者社区",
        "举办线下交流活动与展览"
    ],
    startDate: "2024年3月",
    status: "招募中 - 浙江站已启动，广东站和江苏站即将启动"
};

// 图片路径配置 - 自动生成，无需手动配置
const PHOTO_PATHS = getAllPhotoConfig();

// 留言内容配置
const MESSAGES = {
    A: {
        1: '2025.7.3日\n今天的我刚忙完自己的事情.希望我可以有更多面对困难和生活的勇气，要顺顺利利\n不管是学业、事业、人际关系、爱好, 家庭...\n都要一帆风顺!!',
        2: '2025.7.13\n哈喽.陌生的朋友们你们好, 这里是好不好怪colorful oli.不知你们那边天气如何, 心情如何、我在或近或远的浙H祝好.\n希望大家都有美好的未来.',
        3: '2025.7.16\n你好呀之后接力的选手啊, 这里是胶片漂流的第一期A组第三棒, 我拍的第一张是"捕蝉"用胶片定格童稚回忆; 第二张是光影很好的汽车标志牌; 第三张是路边树荫下的升降机.第四张是薄雾中的赤城山(地方有名的小景), 以上就是我简需要概括拍摄的内容.\n之后接力的选手都可以拍出有趣的故事, 日常生活中她开开心心快快乐乐\n--普通喜欢胶片的人',
        4: '下一位小伙伴以及其它的朋友们,周末好.很高兴向你们分享我的生活碎片 自从上班以后,每个周末都弥足珍贵,想尽可能的多做一些事,更能让自己感觉活着.这段时间有些浮躁,过多的把期望放在了他人身上,所以这周想试试和自己约会,\n第一张照片是常去的胶片冲洗店的一角, 外面下起了暴雨, 便和老板闲聊了起来.每次取底片的时候总是最惊喜的, 这个月竟然拍了5卷胶卷, 又重温了一遍记录的美好.\n第二张照片是我第一次尝试攀岩, 并让路人小哥帮我记录了这一瞬间.从一开始的胆怯, 慢慢发现了其中的乐趣, 怎么读浅、思考下一步落脚点, 每个人都在解自己的题.同时别人的解题思路也能让你有所启发.之后应该还会尝试这项运动.\n第三张拍摄于鄞州公园, 一对老夫老妻在享受他们的"公国十分钟效应", 路的中间像一道彩, 他们各走一边.\n第四张, 也是最后一张, 是宁波最近很火的桨板, 出发前在码头拍下了这张, 今天看到绝美夕阳, 划着小船慢慢漂向夕阳, 放空了很久, 可惜怕相机进水, 并没有带上船.\n所有片刻都值得记录, 正是那些看似不起眼的瞬间, 构成了我们生命中的宝贵部分.希望接下来的一年, 不否定自己的感受, 尊重他人的感受.也是祝愿你们能够天天开心',
        5: '七月已经出了梅雨,但每天依旧会不时阴雨阵阵,天空睛了又阴,明了又暗,不像去年七月的燥热难耐,\n周末到上影SHO看了最新的《德国电影大师展》, 在领票根的等待间隙拍下了第一张照片.没有什么特别, 只是和我一样在等待开场的人们.\n隔天转到黄浦滨江步道, 这里离我家还蛮近, 可以在这里散步, 看桥, 看船.还可以远眺远处的陆家嘴三件套.我喜欢在这里看船来来往往, 呜隆隆的.引擎声远远传来又不知被风吹到哪去, 抬起手咔嚓一张杨浦大桥与货船的合影.\n自从工作后总觉得时间过得飞快, 总觉得周末可以双休还算幸运, 但又总觉得不够.工作日午饭时间和朋友一起到公司旁的无花果树找有无熟了的果子从六月找到七月, 大部分的无花果还是青涩的, 极少有一两个已红透但被鸟吃掉大半.幸运的找到一个开始变黄的无花果, 记录下这一瞬间。\n午饭后的时间免不了散步消食, 上海没有午休的习惯.我想散步也算另一种平替了.公司圆区有很多流浪猫, 做为爱猫人士, 不免要拍猫猫的, 奢侈一点, 那就拍两张吧\n趁着下班前的时间偷偷摸鱼写上这些文字, 许久未提笔感觉文字如此陌生.过两天台风就要来了, 希望可以居家办公, 这样就能在家撸猫了.嘻嘻\n现在属于个人的时间越来越少, 愿所有快乐的时光都可以记录下来, 也都值得被记录下来',
        6: '8.18上海\n收到相机的那天是台风过后的第一天.偶尔会下的点小雨, 整天都阴阴的.好想赶紧大晴天，出门扫街, 夏季的阳光一方面赋予万物无法言语的兴影之美, 所谓阳光下拍什么都不会出错, 另一方面如箭矢般射向每一寸肌肤, 仿佛置身子巨大的烤箱之中.对夏季晴空真是又爱又恨呢!\n虽然市面上有不少胶片模拟滤镜app.可以马上显影, 让出片无需等待.但胶片细腻的颗粒感, 色彩层次, 不可预贝的偶然性是数码摄影天法替代的.就连带拍摄, 洗片.显影的等待都添上了份时光的沉淀.这也是为什么胶片没有被时代淘汰的原因吧!\nNo.1.上海书城\n小时候没事就喜欢往福州路上跑。可以逛文具店、书店, 消磨时光.记得一推开门桌上, 架上摆的都是书, 也有几间卖文具的店, 有很多人坐在地上捧着书看, 前几年, 23岁的书城闭店重装, 全场书目6折出售, 前来迭购的人多了起来.再次开业后, 书店大变样了.推开门最先看到的是文创, 潮玩、奶茶店.看不到堆成小山的书籍.还有星巴克, jelly cat.音像店, 快闪, 二次元谷子.IP特展.....留给书的空间越来越少.几乎全塑封的书, 无法翻开即阅，还是怀念, 书本被翻阅后翘起的卷边.现在的书城比起看书买书, 更适合逛展买谷打卡, 理解顺应时代作出的改变, 但想念, 以书为主的书店氛围.\nNo.2\n福州路上的墙绘.好久没来了, 墙上画着的上海书城, 天蟾逸夫、南京路步行街......都是小时候爱逛的地方, 拯救了我天数个暑假, 满满的回忆.\nN0.3 支付宝大楼\n晚八九点的支付宝大楼有很多亮着灯的办公室。工作后真的会变得无趣吗?八九点依旧在工作的话又有多少时间留给自己呢!不要被工作来缚, 那怕每天挤出个十五分钟去做你喜欢的事.\nN0.4东南大学南大门\n时隔两个月左右再次回到学校, 已是校友的身份了.前几个月为毕业而担忧, 为工作而烦恼, 忽视了很多的美好.如今再看, 尘埃落地, 未必是最佳的答案, 走一步, 得一步, 继续前进.\nNO.5紫峰大厦、国子监、四牌楼\n鸡鸣寺6号口出, 对面望去明朝国子监所在地, 曾是六朝宫苑遗址, 后面是东南大学四牌楼校区.坐落于市中心, 钟山, 鼓楼、玄武湖, 山湖相映.春季, 登上高一点的楼层可以直接望到开满樱花的鸡鸣寺.旁边可以望到南京第一高楼, 紫峰大厦.一个路口可以看到国子监的历史底蕴, 也可看到紫峰大厦的现代摩登。'
    },
    B: {
        1: '哈喽.大家好,这里是b组相机漂流的第一站.很开心可以和大家共同参与一个有趣的活动.祝愿大家玩的开心,玩的高兴同时也欢迎大家来我的家乡,"四面荷花三面柳,一城山色半城湖"的济南!此致!',
        2: '哈喽!大家好呀,很高兴能和大家一起参加这个有意义的活动祝大家都能玩得开心.\n有机会来长春玩呦!\nby你小徐哥\n后面夹了几张戳卡, 喜欢的自取哦!',
        3: 'DAY 1.BY YOUNG.\n刚收到相机就迫不及待地打开了.谢谢小徐哥的戳卡!有机会一定会去长春的.昨天和朋友聊天时说到这样一个话题:\n我喜欢回忆, 回忆是幸福的.因为记下来的往往是好事."\n所以这次我准备拍一些记忆里的东西.像老工厂, 旧学校什么的.虽然我也不知道为什么我一个00后会对这些东西感兴趣.hhh...不管了, 先期待一下吧.\nDAY3.BY YOUNG.\n很遗憾这几天一直在下雨, 拖到最后一天才拍, 拒下来的都是一些恬静的画面, 我觉得很温暖.\n此外山西真的很凉快!欢迎大家来避暑!\n这么近, 那么凉、夏天到山西!',
        4: '哈喽,很高兴能参加这个活动,谢谢小徐哥的戳卡!收到相机后的第二天马上带着去了北海公园,这是我在北京最喜欢的公园,也喜欢波光粼粼的湖面上倒映的白塔.期待成片,也期待其他小伙伴记录的视角。',
        5: 'By9yisx2\n收到相机就带出了青岛的太平角公园.下午的晚霞很漂亮.\n很高兴能和大家一起参与这个有意义的活动!!!谢谢小徐哥的戳卡!\n第三天去看了孙燕姿的演唱会、多多非常幸福的一个晚上.\n我会在沉海地带.等着潮汐更改送你回来."\n-9yisx2',
        6: '嗨!大家好!这里是第六棒小肥!刚刚看完前面大家写的内容,发现和9yisx2老师去了同一场演唱会!听到了现场版的《我怀念的》,真的特别幸福!我们这一组可以看到济南、长春、山西、北京、青岛的美丽风景,很期待大家最终的成片!!!\n2025、7.26一会准备去波螺油子艺术谷玩,正好带着这台相机去拍点东西.一会回家再给大家汇报拍了什么吧!\n①拍下了"二手之王"市集的巷子②拍下了一点建筑一点夕阳一点蓝天, 一点树.③拍下了特别美丽的小花园和贝壳墙④然后我去了龙江路附近, 一开始想拍下那一队飞翔的鸽子, 等了很久也没有成功转身发现夕阳中的那个红色的房子很美⑤其实27张已经拍完了, 好像这种相机可以多拍一张, 在回家出地铁口的位置, 拍下了一点点夜景...\n最后感谢安宁老师举办的这此活动, 能让我们产生一点点联系!期待大家最后的成片!\n- 青岛小肥2025、7.26'
    },
    C: {
        1: '不知道写些什么好呢,总之,天天开心啦我的朋友.',
        2: '或许有天你会明白,有些东西值得失去,因为我们会永遠记得.有些烦恼丢掉了,才有云淡风清的机会,能治愈我的从不是时间,而是追求美真善.	"祝你在未来的日子里,继续怀抱梦想,持	续努力,成长进化,在人生的每个阶段充分发挥自己的潜能."	\n--大同\n希望你健康, 在只活一次的人生里玩的痛快!\n2025.7.5',
        3: '色彩在头脑中,真理在心中\n2025.7.17.柒',
        4: '留住瞬间的美......\n一个喜欢胶片的老者\n川三甲\n2025.7.22',
        5: '无论你手上用的是哪一台相机,我都由衷的建议你走出去,去看看这个美丽的世界,欣赏久未凝视过的日出和日落,还有城市里难能一见的满天星河,按下快门,去拍下你眼中看到的曼妙风景,去记录你所在乎的人和事,只有这样,相机的参数才被真正赋予了意义\n- Links\n(一个小白的座右铭)\n2025.7.25\n花卷',
        6: '自从去年11月份旅行拍了第一卷胶卷,从此打开新世界的大门,独特的色彩和质感令人着迷.时光在胶卷里发酵,按下快门的瞬间,故事已经开始,等冲洗后拆盲盒的惊喜那些褪色噪点与漏光是机械与光影的浪漫情书...祝朋友们天天开心!	--雪橇(后驱者)'
    },
    D: {
        1: '大连',
        2: 'Hi!我是D组2棒莳六--\n很开心参与此次漂流计划。这些天呢我去了沈阳、大连\n7.5我在沈阳看capper演出有些遗憾没能带相机去现场给大家看看, 那一天我真的很幸福.~听了这么久耳机里的歌终于走到了现实\n7.6我去了沈阳西塔.在相机中有两张西塔的影相, 不出意外, 应该还不错~西塔有好多美食!棒棒的.\n7.7就是今天, 我从沈阳回到我的家乡大连, 要说在大连拍些什么我想应该就是大海今天我的朋友从海南上学回来, 我们一起去了海边, 相机中拍了3张大海.这片海在大连开发区泊石湾浴场, 水很清, 天也很蓝.欢迎大家来大连一游~是一座很漂亮的城市\n最近我的生活过的还不错下一位朋友, 你呢 ?\n莳六, 写于2025、7、7大连 \n(无论怎样, 祝大家生活愉快, 身体健康.天天开心, 赚大钱!) ',
        3: '我是D组三棒哈尔滨 GONE\n放假了.但是还留校比赛没回家，最近哈尔滨很热、我会记录比赛过程.',
        4: '黄石',
        5: '南宁',
        6: '收到相机已是立秋之后啦!\n本来是想拍新疆的雪山.草原各种美景, 可最近没机会上山, 就把我普通的日常拍下来了.\n从小长到大最爱去的公园我上班的咖啡店, 路边的小吃.\n从沿海城市待了八年回到这里好安逸说实话我也不知道拍的效果会怎样, 希望大家都能天天开心.\n正是喜怒哀乐的共存才造就了生命的鲜活!\n2025.8.11乌鲁木齐 fedat'
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
        description: '从江南水乡出发，记录诗意生活的点点滴滴',
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
                date: '2025-07-15',
                time: '06:30',
                weather: '晴朗',
                camera: '富士一次性胶片机',
                film: 'C400',
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
                date: '2025-07-18',
                time: '07:15',
                weather: '多云',
                camera: '富士一次性胶片机',
                film: 'C400',
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
                date: '2025-07-21',
                time: '16:45',
                weather: '阴天',
                camera: '富士一次性胶片机',
                film: 'C400',
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
                date: '2025-07-24',
                time: '08:20',
                weather: '晴朗',
                camera: '富士一次性胶片机',
                film: 'C400',
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
                date: '2025-07-27',
                time: '19:30',
                weather: '晴朗',
                camera: '富士一次性胶片机',
                film: 'C400',
                photos: PHOTO_PATHS.A[5],
                message: MESSAGES.A[5],
                coordinates: COORDINATES.A[5],
                tags: TAGS.A[5],
                nextLocation: '上海',
                nextParticipant: '秋天'
            },
            {
                id: 6,
                name: '第六棒',
                participant: '秋天',
                location: '上海',
                province: '上海',
                city: '上海',
                date: '2025-07-30',
                time: '14:15',
                weather: '多云',
                camera: '富士一次性胶片机',
                film: 'C400',
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
                date: '2025-07-16',
                time: '07:00',
                weather: '晴朗',
                camera: '富士一次性胶片机',
                film: 'C400',
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
                date: '2025-07-19',
                time: '08:30',
                weather: '雪天',
                camera: '富士一次性胶片机',
                film: 'C400',
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
                date: '2025-07-22',
                time: '09:15',
                weather: '晴朗',
                camera: '富士一次性胶片机',
                film: 'C400',
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
                date: '2025-07-25',
                time: '06:45',
                weather: '晴朗',
                camera: '富士一次性胶片机',
                film: 'C400',
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
                date: '2025-07-28',
                time: '17:30',
                weather: '多云',
                camera: '富士一次性胶片机',
                film: 'C400',
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
                date: '2025-07-31',
                time: '15:45',
                weather: '晴朗',
                camera: '富士一次性胶片机',
                film: 'C400',
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
                date: '2025-07-17',
                time: '08:00',
                weather: '晴朗',
                camera: '富士一次性胶片机',
                film: 'C400',
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
                date: '2025-07-20',
                time: '19:30',
                weather: '多云',
                camera: '富士一次性胶片机',
                film: 'C400',
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
                date: '2025-07-23',
                time: '16:00',
                weather: '晴朗',
                camera: '富士一次性胶片机',
                film: 'C400',
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
                date: '2025-07-26',
                time: '09:30',
                weather: '阴天',
                camera: '富士一次性胶片机',
                film: 'C400',
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
                date: '2025-07-29',
                time: '07:15',
                weather: '晴朗',
                camera: '富士一次性胶片机',
                film: 'C400',
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
                camera: '富士一次性胶片机',
                film: 'C400',
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
                date: '2025-07-18',
                time: '06:30',
                weather: '晴朗',
                camera: '富士一次性胶片机',
                film: 'C400',
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
                date: '2025-07-21',
                time: '08:45',
                weather: '多云',
                camera: '富士一次性胶片机',
                film: 'C400',
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
                date: '2025-07-24',
                time: '10:15',
                weather: '雪天',
                camera: '富士一次性胶片机',
                film: 'C400',
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
                date: '2025-07-27',
                time: '09:00',
                weather: '晴朗',
                camera: '富士一次性胶片机',
                film: 'C400',
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
                date: '2025-07-30',
                time: '07:30',
                weather: '多云',
                camera: '富士一次性胶片机',
                film: 'C400',
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
                camera: '富士一次性胶片机',
                film: 'C400',
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
