# Three Lab · React 三维入门模板

Vite + React + TypeScript + React Three Fiber（R3F，React 的 Three.js 渲染器）+ Drei（常用三维辅助组件库）+ Leva（参数面板）+ r3f-perf（性能面板）。

从零开始学习和每天复习，请看 [学习笔记](learning-notes.md)。笔记按学习日期持续追加，包含通俗解释、代码对应位置、小实验和复习题。

## 启动

Node.js 要求：20.19 及以上的 20.x，或 22.12 及以上。推荐使用当前受支持的 LTS（长期支持）版本。

```bash
npm install
npm run dev
```

以终端打印的本地地址为准，默认 http://127.0.0.1:5173。依赖安装完成后，也可以使用 TRAE 的 Run 按钮。

```bash
npm run typecheck   # TypeScript 类型检查
npm run build       # 类型检查和生产构建
npm run preview     # 预览 dist 内的生产构建
```

## 可以做什么

- 切换环面结、立方体、球体。
- 拖动旋转、滚轮缩放、右键平移；触屏使用 OrbitControls 的手势。
- 使用 Leva 实时调颜色、金属感、粗糙度、线框、灯光和旋转速度。
- 显示或隐藏性能面板；帧率受设备、窗口活动状态及场景复杂度影响。
- 重置相机视角；不会重置参数面板。
- 导入本地 `.glb` 文件，自动居中和缩放；文件不上传服务器。切换内置对象可退出导入模式。

导入示例支持不超过 30 MB、资源内嵌、未使用 Draco 压缩的 GLB。模型保留原始材质，因此材质面板只作用于内置几何体。这里展示静态模型；GLB 自带动画不会自动播放。无效或不兼容模型会显示错误提示。大小限制不是资源复杂度保证，大模型仍可能影响帧率。

默认场景不需要外部模型、纹理或 HDR（高动态范围环境贴图）。Canvas 使用 WebGL；本模板未启用 WebGPU。

## 从哪里开始改

```text
src/
├── main.tsx                     React 入口
├── App.tsx                      页面、对象切换、模型文件导入
├── styles.css                   页面布局与样式
├── hooks/useSceneControls.ts    Leva 参数定义
└── components/
    ├── Scene.tsx                画布、相机、灯光、地面、鼠标控制
    ├── Model.tsx                几何体、材质、GLB、逐帧旋转
    └── ErrorBoundary.tsx        渲染与模型加载错误兜底
```

建议依次完成：

1. 修改 `Model.tsx` 的 `boxGeometry` 尺寸，理解 Geometry（形状）。
2. 修改 `useSceneControls.ts` 的默认颜色和粗糙度，理解 Material（材质）。
3. 修改 `Scene.tsx` 的相机位置与主灯位置，观察光照变化。
4. 在 `Model.tsx` 中加入点击事件，实现点击暂停或更换颜色。
5. 导出一个自己的 GLB，再了解 `useAnimations` 播放模型动画。

`useFrame` 的回调每帧执行，通过 `delta`（本帧间隔秒数）控制旋转，避免不同帧率产生不同速度。高频动画直接修改 Three.js 对象；对象选择和界面开关使用 React state。

`Canvas` 内的 JSX 是三维对象，如 `mesh`、`ambientLight`。普通网页元素放在 Canvas 外；需要把文字放在场景中时使用 Drei 的 `Html`。

## 调试与边界

- React DevTools：检查 React 状态和组件更新。
- 浏览器 Console / Network：检查报错、模块及模型加载。
- r3f-perf：观察 FPS（每秒帧数）、绘制调用和渲染资源统计。
- Leva：反复调试材质、灯光和动画参数。

`r3f-perf@7.2.3` 自带的 Drei 依赖范围属于 React 18 时代。`package.json` 使用针对该包的 `overrides`，让它复用项目的 Drei 10，避免同时安装旧版 Drei 与 React 渲染器。升级性能工具时应复查此覆盖是否仍需要，并验证打开面板后的运行表现。

不要在组件 render 中重复创建材质、几何体或加载模型；使用 JSX 对象声明及 Drei 加载器。模板限制 DPR（设备像素比）到 1–2，以平衡清晰度和性能。

普通 JSX 创建的几何体和材质由 R3F 管理销毁；`useGLTF` 的缓存和 `primitive` 资源需要自行管理。模板切换本地文件时会撤销 object URL、清除加载缓存，但不会深度销毁 GLB 共享资源。若产品需要频繁导入大量模型，应实现明确的 GPU 资源释放策略。

生产构建可能提示三维依赖包体较大。实际产品可按路由动态加载三维模块，压缩模型与纹理，并根据场景测量性能。本入门模板优先保持结构清晰。

## 接到 Next.js

保留 `Scene`、`Model` 与参数 hook，把页面放入客户端组件（`'use client'`）。如果某个模块在导入时访问 `window`，在客户端组件中使用 `next/dynamic` 并设置 `{ ssr: false }`。无需迁移 Vite 配置。

## 文档

以下链接标明文档语言和来源。优先阅读中文资料；社区翻译用于理解概念，安装、版本兼容和具体参数以官方文档为准。

| 技术 | 文档与语言 | 来源 / 适合看什么 |
|---|---|---|
| Three.js | [基础教程【中文】](https://threejs.org/manual/zh/fundamentals.html) | 官方站点中文手册；理解场景、相机、几何体和材质 |
| R3F | [安装与入门【中文，部分标题英文】](https://fiber.framer.wiki/installation) | 社区翻译；部分示例偏旧，版本信息需对照官方 |
| R3F | [入门介绍【英文】](https://r3f.docs.pmnd.rs/getting-started/introduction) | 官方文档；理解怎样用 React 写三维对象 |
| R3F | [安装与版本兼容【英文】](https://r3f.docs.pmnd.rs/getting-started/installation) | 官方文档；核对 React 与 R3F 的版本配对 |
| Drei | [组件文档【英文】](https://drei.docs.pmnd.rs/) | 官方文档；查询鼠标控制、模型加载等辅助组件 |
| Leva | [使用说明【英文】](https://github.com/pmndrs/leva#readme) | 官方仓库；学习参数面板 |
| r3f-perf | [使用说明【英文】](https://github.com/utsuboco/r3f-perf#readme) | 官方仓库；查询性能面板参数 |
| WebGL | [WebGL 教程【中文】](https://developer.mozilla.org/zh-CN/docs/Web/API/WebGL_API/Tutorial) | MDN；学习底层绘制原理 |
| WebGPU | [WebGPU 介绍【中文】](https://developer.mozilla.org/zh-CN/docs/Web/API/WebGPU_API) | MDN；了解现代图形与计算接口，部分关联页面为英文 |
| React | [学习 React【中文】](https://zh-hans.react.dev/learn) | 官方中文文档 |
| Vite | [开始使用【中文】](https://cn.vite.dev/guide/) | 官方中文文档 |

截至本次核实（2026-10-27），R3F、Drei、Leva、r3f-perf 的官方资料查到的是英文，没有找到可确认的官方中文版本。R3F 有上面列出的社区中文翻译。中文资料的覆盖和更新进度可能与英文原文不同。

### 建议阅读顺序

1. **先读 Three.js《基础》【中文】**：把场景想成摄影棚，物体是拍摄对象，相机决定从哪里看，灯光决定怎么照，渲染器负责生成画面。先理解这些概念，再对照 `Scene.tsx` 和 `Model.tsx`。
2. **再读 R3F《入门介绍》【英文】**：把 Three.js 对象对应到 React JSX。原生 Three.js 的 `new THREE.Mesh(...)`，在 R3F 中可以通过 `<mesh>` 声明；R3F 帮你管理对象的创建和更新。英文可配合浏览器翻译阅读，代码标识符保留原样。
3. **Drei、Leva、r3f-perf 按需查【英文】**：用到鼠标控制、模型加载、调参或性能统计时，再查对应组件和参数。
4. **最后学习 WebGL、WebGPU【中文入口】**：在场景、相机、材质和动画概念清楚后，再深入底层绘制与计算。

Three.js 中文基础教程使用原生 Three.js 写法；本项目使用 R3F 的 React JSX 写法。两者描述的是相同的三维概念，教程代码需要转换成组件结构后才能用于本项目。
