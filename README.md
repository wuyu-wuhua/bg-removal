# 背景移除 - AI驱动的图像处理平台

这是一个使用 Next.js 14、TypeScript、Tailwind CSS 和 Shadcn UI 构建的现代化图像处理应用。

## 🚀 技术栈

- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **UI组件**: Shadcn UI + Radix UI
- **图标**: Lucide React
- **状态管理**: React Hooks
- **构建工具**: Next.js (内置)

## ✨ 功能特性

- 🎨 **智能抠图**: 使用AI算法精确识别并分离前景与背景
- 🚀 **批量处理**: 支持同时处理多张图片
- 📱 **响应式设计**: 完美适配桌面端和移动端
- 🎯 **拖拽上传**: 支持拖拽文件上传
- 📊 **实时进度**: 显示处理进度和状态
- 🎭 **对比预览**: 原图与处理后图片对比功能
- 💾 **多格式支持**: 支持JPG、PNG、WebP等格式

## 🛠️ 开发环境设置

### 前置要求

- Node.js 18+ 
- npm 或 yarn

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

### 构建生产版本

```bash
npm run build
```

### 启动生产服务器

```bash
npm start
```

## 📁 项目结构

```
src/
├── app/                    # Next.js App Router
│   ├── globals.css        # 全局样式
│   ├── layout.tsx         # 根布局
│   └── page.tsx           # 主页面
├── components/            # React组件
│   └── ui/               # Shadcn UI组件
│       ├── button.tsx
│       ├── card.tsx
│       └── progress.tsx
├── lib/                  # 工具函数
│   └── utils.ts
└── types/                # TypeScript类型定义
    └── index.ts
```

## 🎨 设计特点

- **深色主题**: 采用现代化的深色主题设计
- **渐变效果**: 使用CSS渐变增强视觉效果
- **动画过渡**: 流畅的动画和过渡效果
- **玻璃拟态**: 现代化的毛玻璃效果
- **响应式布局**: 移动优先的响应式设计

## 🔧 自定义配置

### Tailwind CSS

项目使用Tailwind CSS进行样式设计，配置文件位于 `tailwind.config.js`。

### TypeScript

TypeScript配置位于 `tsconfig.json`，包含路径别名配置。

### Next.js

Next.js配置位于 `next.config.js`，包含图片优化等设置。

## 📝 开发规范

- 使用函数式组件和Hooks
- 遵循TypeScript严格模式
- 使用描述性变量名
- 组件采用命名导出
- 使用Tailwind CSS进行样式设计

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- [Next.js](https://nextjs.org/) - React框架
- [Tailwind CSS](https://tailwindcss.com/) - CSS框架
- [Shadcn UI](https://ui.shadcn.com/) - UI组件库
- [Lucide](https://lucide.dev/) - 图标库 