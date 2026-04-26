# 图床上传规范

## 目标
保持业务配置里的图片路径继续使用 `/photos/...` 相对路径，不在配置文件里手写完整图床 URL。

前端运行时会自动：

1. 用 `REACT_APP_IMAGE_BASE_URL` 给相对路径拼上域名
2. 用同目录后缀规则推导图片变体：
   - `_thumb`
   - `_preview`

## 图床域名配置
在本地或生产环境中配置：

```env
REACT_APP_IMAGE_BASE_URL=https://your-image-cdn.example.com
```

示例文件见：

- `frontend/.env.example`

推荐做法：

- 本地开发调图床：`frontend/.env.local`
- 线上部署：`frontend/.env.production.local`

不要在值末尾加 `/`。

## 最终上传目录
建议统一上传：

```txt
frontend/public/photos/
```

也就是说，图床上的资源根目录应该对齐成：

```txt
photos/
  A1/
  A2/
  ...
  phase2/
  extra/
  meaning/
```

## 统一变体规则
所有篇章尽量采用“原图同目录 + 文件名后缀”的方式：

```txt
000001.JPG
000001_thumb.JPG
000001_preview.JPG
```

这样上传、排查、替换都最方便。

## 各篇章目录约定

### 一期
原图源目录：

```txt
frontend/photos/A1/
frontend/photos/A2/
...
```

生成后产物目录：

```txt
frontend/public/photos/A1/
frontend/public/photos/A2/
...
```

示例：

```txt
public/photos/A1/000001.JPG
public/photos/A1/000001_thumb.JPG
public/photos/A1/000001_preview.JPG
```

### 二期
原图源目录：

```txt
frontend/photos/phase2/zhejiang/A/A1/photos/
frontend/photos/phase2/zhejiang/A/A1/message/
```

生成后产物目录：

```txt
frontend/public/photos/phase2/zhejiang/A/A1/photos/
frontend/public/photos/phase2/zhejiang/A/A1/message/
```

示例：

```txt
public/photos/phase2/zhejiang/A/A1/photos/000001.JPG
public/photos/phase2/zhejiang/A/A1/photos/000001_thumb.JPG
public/photos/phase2/zhejiang/A/A1/photos/000001_preview.JPG

public/photos/phase2/zhejiang/A/A1/message/000001.JPG
public/photos/phase2/zhejiang/A/A1/message/000001_thumb.JPG
public/photos/phase2/zhejiang/A/A1/message/000001_preview.JPG
```

### 番外
番外原图统一维护在：

```txt
frontend/photos/extra/
```

每个成员固定两类目录：

```txt
photos/extra/G1/G1-1/photos/
photos/extra/G1/G1-1/message/
```

生成后产物目录：

```txt
frontend/public/photos/extra/
```

示例：

```txt
public/photos/extra/G1/G1-1/photos/000001.jpg
public/photos/extra/G1/G1-1/photos/000001_thumb.jpg
public/photos/extra/G1/G1-1/photos/000001_preview.jpg
```

### 旅行的意义
建议统一放在：

```txt
frontend/photos/meaning/
```

生成后产物目录：

```txt
frontend/public/photos/meaning/
```

例如：

```txt
public/photos/meaning/2026-04/jing/000001.jpg
public/photos/meaning/2026-04/jing/000001_thumb.jpg
public/photos/meaning/2026-04/jing/000001_preview.jpg
```

## 日常操作

### 推荐总流程
执行：

```bash
npm run prepare-image-upload
```

这个命令会按顺序处理：

1. 一期变体生成
2. 二期变体生成
3. 二期配置同步
4. 番外从 `photos/extra/` 生成产物并同步 manifest
5. meaning 从 `photos/meaning/` 递归生成到 `public/photos/meaning/`

如果这些上传产物目录不存在，脚本会先自动创建，再继续执行，不会因为目录缺失直接跳过。

完成后，直接上传：

```txt
frontend/public/photos/
```

### 单独命令

```bash
npm run generate-variants
npm run generate-phase2-variants
npm run update-photos
npm run update-extra-photos
npm run generate-meaning-variants
```

## 配置文件维护原则
以下配置继续保留 `/photos/...` 相对路径，不直接写完整图床 URL：

- `frontend/src/config/photoConfig.ts`
- `frontend/src/config/phase2Data.ts`
- `frontend/src/config/extraPhotoManifest.ts`
- `frontend/src/config/meaningData.ts`

例如继续写：

```ts
'/photos/phase2/zhejiang/A/A1/photos/000001.JPG'
```

前端会自动解析成：

```txt
https://你的图床域名/photos/phase2/zhejiang/A/A1/photos/000001.JPG
https://你的图床域名/photos/phase2/zhejiang/A/A1/photos/000001_thumb.JPG
https://你的图床域名/photos/phase2/zhejiang/A/A1/photos/000001_preview.JPG
```

## 维护建议

1. 配置文件只维护相对路径，不维护域名。
2. 所有原图统一维护在 `photos/`，图床目录始终保持和 `public/photos/` 一致。
3. 所有变体与原图尽量放在同目录。
4. 上传时尽量整棵上传 `public/photos/`，不要零散传文件。
