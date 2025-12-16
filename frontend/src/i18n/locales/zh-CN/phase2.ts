/**
 * 中文翻译 - 第二期相关页面
 * 
 * 包含 Phase2Home、Phase2Province、Phase2RelayDetail 等页面的翻译
 */

export default {
  // 首页（Phase2Home）
  home: {
    title: '点亮中国 · 胶片相机漂流',
    subtitle: '100 台胶片机，让 300+ 座城市的生活持续发光',
    description: '一台相机、六张胶片、一册留言本。我们邀请热爱记录的人，与城市对话，与远方的陌生人交换故事，让生活的温度沿着影像继续漂流。',
    
    // 首页按钮
    buttons: {
      viewGallery: '浏览作品集',
      viewProgress: '查看城市进度'
    },
    
    // 首页各个区块
    sections: {
      // 地图区块
      map: {
        title: '全国地图',
        description: '点亮中国每一座城市，查看胶片漂流计划的全国分布',
        statistics: {
          title: '省份统计',
          totalProvinces: '总省份数',
          status: {
            label: '状态',
            completed: '已完成',
            active: '进行中',
            planning: '计划中',
            completedTime: '已完成时间',
            currentTime: '当前时间',
            planningStart: '计划开启'
          }
        }
      },
      
      // 省份区块
      provinces: {
        title: '参与省份',
        description: '点亮中国每一座城市，每个省份的小组数量不同，每个小组由6位参与者组成接力棒'
      },
      
      // 活动说明区块
      activity: {
        title: '活动说明',
        process: {
          title: '参与流程',
          steps: [
            '每位参与者会收到 1 台一次性胶片相机（24 张底片）+ 1 本漂流笔记本',
            '你只需拍摄 6 张，并写点想说的话',
            '最多保留 5 天，拍完后联系发起人',
            '我们会告诉你下一个人的地址，你只需要付一点邮费即可',
            '最终我们会冲洗这些照片，扫描留言，在小红书发布完整展览'
          ]
        },
        conditions: {
          title: '参与条件',
          description: '我们想点亮中国的每一座城市。不论你是：',
          roles: ['初中生', '大学生', '社畜', '骑手', '店主', '程序员', '作家'],
          conclusion: '来自都市的高楼，也好，来自县城的小街巷，也好\n你都值得拥有 1 次，属于自己的快门故事。'
        },
        xiaohongshu: {
          title: '关注我的小红书账号',
          account: '7527914100',
          description: '后续推进进度和活动更新',
          scan: '扫码关注'
        }
      },
      
      // 报名区块
      registration: {
        title: '报名通道现已开启',
        description: '请认真填写以下信息，我们会根据时间、城市、节奏合理安排漂流路线。',
        notice: '如果你被选中，我们会在半个月内联系你。',
        button: '立即报名',
        thanks: '感谢你，让一台相机，看到世界。'
      }
    },
    
    // 筛选器
    filters: {
      status: {
        all: '全部',
        active: '进行中',
        planning: '计划中',
        completed: '已完成'
      },
      province: '省份筛选',
      group: '组数筛选'
    }
  },
  
  // 省份页面（Phase2Province）
  province: {
    notFound: '省份不存在',
    back: '返回首页',
    
    // 统计信息
    stats: {
      totalGroups: '总小组数',
      active: '进行中',
      completed: '已完成',
      totalParticipants: '总参与者'
    },
    
    // 地图
    map: {
      title: '地级市分布图',
      description: '探索{{province}}内各城市的接力情况，点击标记查看详细信息'
    },
    
    // 搜索和筛选
    search: {
      placeholder: '搜索小组...',
      noResults: {
        title: '没有找到匹配的小组',
        description: '请尝试调整搜索条件或筛选器'
      }
    },
    
    // 小组列表
    groups: {
      title: '小组列表',
      route: '{{start}} → {{end}}',
      participants: '{{count}} 位参与者',
      relay: '{{current}}/{{total}} 棒',
      progress: '进度',
      viewDetails: '查看详情'
    },
    
    // 省份特色
    features: {
      title: '{{province}}特色',
      culture: {
        title: '文化特色',
        tags: ['历史文化', '自然风光', '现代发展', '人文风情']
      },
      shooting: {
        title: '拍摄建议',
        tips: [
          '记录当地的历史建筑和文化遗迹',
          '捕捉自然风光和季节变化',
          '展现现代城市的发展面貌',
          '记录当地人的日常生活'
        ]
      }
    }
  },
  
  // 组详情页面（Phase2Group）
  group: {
    notFound: '小组不存在',
    back: '返回省份',
    backToHome: '返回首页',
    
    // 统计信息
    stats: {
      totalParticipants: '总参与者',
      currentRelay: '当前棒次',
      progress: '完成进度',
      status: '状态'
    },
    
    // 路线信息
    route: {
      start: '起点：{{location}}',
      end: '终点：{{location}}',
      progress: '接力进度',
      relay: '{{current}}/{{total}} 棒'
    },
    
    // 接力棒列表
    relays: {
      title: '接力棒详情',
      description: '每一棒都承载着独特的视角和故事',
      noPhoto: '无照片',
      photoCount: '📸 {{count}} 张照片',
      viewDetails: '查看详情',
      notStarted: {
        title: '小组尚未开始',
        description: '该小组的接力活动还未开始，请耐心等待'
      }
    },
    
    // 组特色
    features: {
      title: '{{group}}特色',
      route: {
        title: '路线特色'
      },
      participation: {
        title: '参与说明',
        tips: [
          '每位参与者拍摄6张照片',
          '在留言本上写下想说的话',
          '最多保留5天，然后传递给下一位',
          '记录当地的风土人情和特色文化'
        ]
      }
    }
  },
  
  // 接力棒详情页面（Phase2RelayDetail）
  relay: {
    notFound: '接力棒不存在',
    back: '返回小组',
    
    // 信息区块标题
    info: {
      relay: '接力信息',
      nextStop: '下一站',
      nextParticipant: '下一位参与者',
      shooting: '拍摄信息',
      camera: '相机型号',
      film: '胶片类型',
      message: '留言信息',
      messageCount: '留言数量',
      messageType: '留言类型',
      messageTypeValue: '手写留言',
      location: '拍摄位置',
      viewFullRoute: '查看完整路线 →',
      coordinates: '坐标: {{lat}}, {{lng}}',
      participantMessage: '参与者留言'
    },
    
    // 照片相关
    photos: {
      title: '所有照片',
      current: '当前照片',
      noPhoto: '暂无照片',
      clickToView: '点击查看大图',
      alt: '{{name}} - 照片 {{index}}',
      thumbnailAlt: '照片 {{index}}'
    },
    
    // 留言图片相关
    messageImages: {
      title: '留言图片',
      all: '所有留言图片',
      noImages: '暂无留言图片',
      count: '{{count}} 张',
      type: '手写留言',
      alt: '留言图片 {{index}}',
      thumbnailAlt: '留言 {{index}}'
    },
    
    // 下载相关
    download: {
      title: '下载照片',
      all: '下载全部照片 ({{count}}张)',
      current: '下载当前照片',
      downloading: '下载中... {{progress}}%',
      notice: '批量下载将逐张下载所有照片，每张间隔0.5秒',
      messageTitle: '下载留言图片',
      messageAll: '下载全部留言图片 ({{count}}张)',
      messageCurrent: '下载当前留言图片',
      messageNotice: '批量下载将逐张下载所有留言图片，每张间隔0.5秒'
    }
  }
};

