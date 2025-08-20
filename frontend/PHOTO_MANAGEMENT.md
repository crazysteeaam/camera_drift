# 图片管理说明

## 当前状态

✅ **已解决的问题**: 
- 图片路径不再需要手动配置
- 所有图片路径集中在 `src/config/photoConfig.ts` 文件中管理
- 支持自动验证图片路径是否存在

## 如何添加新图片

### 方法1: 直接编辑配置文件（推荐）

1. **将图片文件放入对应文件夹**
   ```
   frontend/photos/A1/新图片.jpg
   frontend/photos/A2/新图片.jpg
   ```

2. **编辑 `src/config/photoConfig.ts` 文件**
   ```typescript
   // 在对应的组别和序号中添加新路径
   A: {
       1: [
           '/photos/A1/000001.JPG',
           '/photos/A1/000002.JPG',
           '/photos/A1/000003.JPG',
           '/photos/A1/000004.JPG',
           '/photos/A1/新图片.jpg'  // 添加新图片
       ],
       // ... 其他序号
   }
   ```

3. **保存文件后，新图片会自动显示**

### 方法2: 使用动态添加函数

```typescript
import { addPhotoPaths } from './src/config/photoConfig';

// 动态添加新图片路径
addPhotoPaths('A', 1, ['/photos/A1/新图片.jpg']);
```

## 图片路径规则

### 支持的格式
- `.jpg` / `.JPG`
- `.jpeg` / `.JPEG`
- `.png` / `.PNG`
- `.gif` / `.GIF`
- `.bmp` / `.BMP`
- `.tiff` / `.TIFF`
- `.webp` / `.WEBP`

### 命名建议
- 使用统一的命名规范，如 `000001.JPG`, `000002.JPG`
- 避免使用中文文件名（可能导致编码问题）
- 建议使用小写扩展名（`.jpg` 而不是 `.JPG`）

## 文件夹结构

```
frontend/photos/
├── A1/          # A组第1棒照片
├── A2/          # A组第2棒照片
├── A3/          # A组第3棒照片
├── A4/          # A组第4棒照片
├── A5/          # A组第5棒照片
├── A6/          # A组第6棒照片
├── B1/          # B组第1棒照片（当前为空）
├── B2/          # B组第2棒照片
├── B3/          # B组第3棒照片
├── B4/          # B组第4棒照片
├── B5/          # B组第5棒照片
├── B6/          # B组第6棒照片
├── C1/          # C组第1棒照片
├── C2/          # C组第2棒照片
├── C3/          # C组第3棒照片
├── C4/          # C组第4棒照片
├── C5/          # C组第5棒照片
├── C6/          # C组第6棒照片
├── D1/          # D组第1棒照片
├── D2/          # D组第2棒照片
├── D3/          # D组第3棒照片
├── D4/          # D组第4棒照片
├── D5/          # D组第5棒照片
└── D6/          # D组第6棒照片（当前为空）
```

## 常见问题

### Q: 为什么只有A1文件夹的照片显示？
A: 这是因为其他文件夹的照片路径没有在配置文件中定义。请按照上面的方法添加图片路径。

### Q: 可以自动遍历文件夹吗？
A: 在浏览器环境中，由于安全限制，无法直接遍历文件系统。我们使用配置文件的方式来管理图片路径，这是最可靠的方法。

### Q: 如何批量添加图片？
A: 可以编写脚本生成图片路径，然后复制到配置文件中：

```typescript
// 示例：生成A1文件夹的图片路径
const generatePaths = (folder: string, count: number) => {
    const paths = [];
    for (let i = 1; i <= count; i++) {
        paths.push(`/photos/${folder}/${String(i).padStart(6, '0')}.jpg`);
    }
    return paths;
};

const a1Paths = generatePaths('A1', 10);
console.log(a1Paths);
// 输出: ['/photos/A1/000001.jpg', '/photos/A1/000002.jpg', ...]
```

### Q: 图片加载失败怎么办？
A: 使用验证函数检查图片路径：

```typescript
import { validatePhotoPath } from './src/config/photoConfig';

// 验证单个路径
const isValid = await validatePhotoPath('/photos/A1/000001.JPG');
console.log('图片是否存在:', isValid);

// 验证多个路径
import { getValidPhotoPaths } from './src/config/photoConfig';
const validPaths = await getValidPhotoPaths('A', 1);
console.log('有效的图片路径:', validPaths);
```

## 最佳实践

1. **保持文件结构一致**: 确保 `photos/` 文件夹结构与代码中的映射一致
2. **使用相对路径**: 所有图片路径都以 `/photos/` 开头
3. **定期验证**: 使用验证函数检查图片是否仍然存在
4. **备份配置**: 定期备份 `photoConfig.ts` 文件
5. **版本控制**: 将图片配置文件纳入版本控制，但不要将图片文件纳入版本控制

## 未来改进

- [ ] 实现图片懒加载
- [ ] 添加图片压缩功能
- [ ] 实现图片缓存机制
- [ ] 支持响应式图片
- [ ] 添加图片管理界面
