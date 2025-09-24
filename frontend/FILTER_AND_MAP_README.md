# 筛选和地图功能更新说明

## 更新内容

### 1. 省份筛选功能
- **新增省份筛选**：在搜索和筛选区域添加了省份筛选功能
- **筛选方式**：支持按省份名称筛选，显示所有有小组的省份
- **筛选逻辑**：与状态筛选、组数筛选、搜索功能组合使用

### 2. 分页功能
- **分页显示**：每页显示12个省份，避免页面过长
- **分页控件**：包含上一页、下一页按钮和页码按钮
- **分页信息**：显示当前页范围和总数量
- **自动重置**：筛选条件改变时自动重置到第一页

### 3. 地图功能
- **去掉按钮**：移除了"查看全国地图"按钮
- **新增地图区域**：在省份展示后添加了全国地图区域
- **地图组件**：创建了 `ChinaMap` 组件，预留地图接口
- **城市数据**：支持城市状态显示和点击跳转
- **高亮显示**：支持点亮城市的高亮显示

## 技术实现

### 筛选功能
```typescript
// 筛选状态
const [filterProvince, setFilterProvince] = useState<string>('all');
const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'planning' | 'completed'>('all');
const [filterGroup, setFilterGroup] = useState<string>('all');

// 筛选逻辑
const filteredProvinces = provinces.filter(province => {
    const matchesSearch = province.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        province.shortName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesProvince = filterProvince === 'all' || province.id === filterProvince;
    const hasMatchingGroup = filterGroup === 'all' || province.groups.some(group => group.id === filterGroup);
    
    return matchesSearch && matchesProvince && hasMatchingGroup;
});
```

### 分页功能
```typescript
// 分页状态
const [currentPage, setCurrentPage] = useState(1);
const [itemsPerPage] = useState(12);

// 分页计算
const totalPages = Math.ceil(filteredProvinces.length / itemsPerPage);
const startIndex = (currentPage - 1) * itemsPerPage;
const endIndex = startIndex + itemsPerPage;
const currentProvinces = filteredProvinces.slice(startIndex, endIndex);

// 自动重置页码
React.useEffect(() => {
    setCurrentPage(1);
}, [filterStatus, filterGroup, filterProvince, searchTerm]);
```

### 地图组件
```typescript
interface CityData {
    id: string;
    name: string;
    province: string;
    coordinates: { lat: number; lng: number };
    status: 'active' | 'planning' | 'completed';
    groupCount: number;
    activeGroups: number;
}

interface ChinaMapProps {
    cities?: CityData[];
    onCityClick?: (city: CityData) => void;
    highlightedCities?: string[];
    className?: string;
}
```

## 界面布局

### 筛选区域
1. **搜索框**：支持按省份名称搜索
2. **状态筛选**：全部、进行中、计划中、已完成
3. **省份筛选**：显示所有有小组的省份
4. **组数筛选**：A-J组筛选

### 省份展示区域
1. **网格布局**：响应式网格，最多4列
2. **省份卡片**：显示省份信息、统计、小组预览
3. **分页控件**：页码导航和分页信息

### 地图区域
1. **地图容器**：预留地图组件接口
2. **控制面板**：状态图例和统计信息
3. **城市数据**：支持城市点击和状态显示

## 使用说明

### 筛选操作
1. **搜索**：在搜索框输入省份名称
2. **状态筛选**：点击状态按钮筛选不同状态
3. **省份筛选**：点击省份名称筛选特定省份
4. **组数筛选**：点击组数按钮筛选特定组

### 分页操作
1. **翻页**：点击上一页/下一页按钮
2. **跳转**：点击页码数字直接跳转
3. **自动重置**：筛选条件改变时自动回到第一页

### 地图操作
1. **城市点击**：点击城市跳转到对应省份页面
2. **状态查看**：通过颜色区分不同状态的城市
3. **统计信息**：查看城市和小组的统计信息

## 后续扩展

### 地图集成
1. **地图库选择**：可集成 Leaflet、Mapbox 等地图库
2. **城市高亮**：实现真实的地图城市高亮效果
3. **交互功能**：支持缩放、拖拽等地图操作
4. **数据可视化**：在地图上显示活动进度和统计信息

### 功能优化
1. **筛选记忆**：记住用户的筛选偏好
2. **分页优化**：支持跳转到指定页码
3. **搜索优化**：支持模糊搜索和拼音搜索
4. **性能优化**：大量数据时的虚拟滚动

## 文件结构

```
frontend/src/
├── components/
│   └── ChinaMap.tsx          # 地图组件
├── pages/
│   └── Phase2Home.tsx        # 主页面（已更新）
└── config/
    └── phase2Data.ts         # 数据配置
```

## 注意事项

1. **地图组件**：目前是占位符，需要后续集成真实地图
2. **数据格式**：确保城市数据格式与地图组件兼容
3. **响应式设计**：分页和筛选在不同屏幕尺寸下的表现
4. **性能考虑**：大量省份数据时的渲染性能

---

**更新完成时间**：2024年12月
**版本**：2.1.0
**状态**：开发完成，待测试

