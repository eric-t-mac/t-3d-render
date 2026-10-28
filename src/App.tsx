import { useEffect, useState, type ChangeEvent } from 'react'
import { Leva } from 'leva'
import { useGLTF } from '@react-three/drei'
import { Scene } from './components/Scene'
import type { Shape } from './components/Model'
import { useSceneControls } from './hooks/useSceneControls'

const shapes: { id: Shape; label: string; description: string }[] = [
  { id: 'knot', label: '环面结', description: 'Torus knot' },
  { id: 'cube', label: '立方体', description: 'Box' },
  { id: 'sphere', label: '球体', description: 'Sphere' },
]

export default function App() {
  const controls = useSceneControls()
  const [shape, setShape] = useState<Shape>('knot')
  const [model, setModel] = useState<{ url: string; name: string } | null>(null)
  const [showPerf, setShowPerf] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [cameraKey, setCameraKey] = useState(0)
  const [fileError, setFileError] = useState('')

  useEffect(() => {
    if (!model) return
    return () => {
      URL.revokeObjectURL(model.url)
      useGLTF.clear(model.url)
    }
  }, [model])

  function importModel(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    if (!file.name.toLowerCase().endsWith('.glb')) {
      setFileError('请选择 .glb 格式的模型。')
      return
    }
    if (file.size > 30 * 1024 * 1024) {
      setFileError('入门示例限制模型大小为 30 MB，请选择较小的模型。')
      return
    }
    setFileError('')
    setModel({ url: URL.createObjectURL(file), name: file.name })
  }

  return (
    <div className="app">
      <header className="header">
        <a className="brand" href="/" aria-label="Three Lab 首页">
          <span className="brand-icon" aria-hidden="true">◇</span>
          <span>three<span className="brand-light">lab</span><span className="brand-dot">.</span></span>
        </a>
        <span className="header-caption">你的第一个 React 三维实验室</span>
        <a className="docs-link" href="https://r3f.docs.pmnd.rs/getting-started/introduction" target="_blank" rel="noreferrer">
          R3F 文档 ↗
        </a>
      </header>

      <main>
        <div className="intro">
          <div>
            <p className="eyebrow">REACT THREE FIBER STARTER</p>
            <h1>把想法，放进三维空间。</h1>
            <p className="intro-description">从一个几何体开始，探索材质、灯光与交互。</p>
          </div>
          <span className="stack-tag"><span className="status-dot" /> Vite + React + TypeScript</span>
        </div>

        <div className="workspace">
          <aside className="sidebar" aria-label="场景设置">
            <div className="section-label"><span>01 / 场景对象</span><span>3D</span></div>
            <div className="shape-list">
              {shapes.map((item) => (
                <button
                  key={item.id}
                  className={`shape-button ${!model && shape === item.id ? 'active' : ''}`}
                  aria-pressed={!model && shape === item.id}
                  onClick={() => { setShape(item.id); setModel(null); setFileError('') }}
                >
                  <span className={`shape-symbol ${item.id}`} aria-hidden="true">{item.id === 'knot' ? '◎' : item.id === 'cube' ? '◇' : '○'}</span>
                  <span><strong>{item.label}</strong><small>{item.description}</small></span>
                  {!model && shape === item.id && <span className="selected-dot" />}
                </button>
              ))}
            </div>
            <label className="upload-button">
              <span aria-hidden="true">＋</span> 导入本地 GLB
              <input type="file" role="button" accept=".glb" aria-label="导入本地 GLB 模型" onChange={importModel} />
            </label>
            <p className="helper">{model ? `当前模型：${model.name}` : '模型仅在本机读取，最大 30 MB。'}</p>
            {fileError && <p className="file-error" role="alert">{fileError}</p>}
            {model && <p className="helper">导入模型保留原始材质；右侧材质参数用于内置几何体。</p>}

            <div className="section-label second-section"><span>02 / 开发工具</span></div>
            <label className="toggle-row">
              <span>参数面板 <small>Leva</small></span>
              <input type="checkbox" checked={showControls} onChange={(e) => setShowControls(e.target.checked)} />
            </label>
            <label className="toggle-row">
              <span>性能面板 <small>r3f-perf</small></span>
              <input type="checkbox" checked={showPerf} onChange={(e) => setShowPerf(e.target.checked)} />
            </label>
            <button className="reset-button" onClick={() => setCameraKey((key) => key + 1)}>↺ 重置视角</button>
            <div className="sidebar-tip"><span>TRY THIS</span><p>拖动右侧参数，看看同一个物体如何变成塑料或金属。</p></div>
          </aside>

          <section className="viewport" aria-label="三维预览">
            <div className="viewport-label"><span className="status-dot" /> 实时场景 <span className="viewport-backend">WebGL</span></div>
            <Scene shape={shape} modelUrl={model?.url ?? null} controls={controls} showPerf={showPerf} cameraKey={cameraKey} />
            <div className="viewport-help">拖动旋转 <span>·</span> 滚轮缩放 <span>·</span> 右键平移</div>
          </section>

          <aside className="control-sidebar" aria-label="实时参数">
            <div className="section-label"><span>03 / 实时参数</span><span>LIVE</span></div>
            <p className="control-description">调整一下，即刻看见变化。</p>
            <Leva
              fill
              flat
              titleBar={false}
              hidden={!showControls}
              theme={{
                sizes: { controlWidth: '105px' },
                colors: {
                  elevation1: '#f7f9f7',
                  elevation2: '#f7f9f7',
                  elevation3: '#e7eee8',
                  accent1: '#356749',
                  accent2: '#508567',
                  accent3: '#6f9c7b',
                  highlight1: '#a8b5ac',
                  highlight2: '#6d8073',
                  highlight3: '#3a5343',
                  folderTextColor: '#3a5343',
                  folderWidgetColor: '#6d8073',
                },
              }}
            />
            {!showControls && <p className="helper">参数面板已隐藏，可在左侧重新打开。</p>}
          </aside>
        </div>

        <div className="learning-strip">
          <div><span className="lesson-number">01</span><p><strong>形状 × 材质</strong><small>Geometry + Material = Mesh</small></p></div>
          <div><span className="lesson-number">02</span><p><strong>相机 × 灯光</strong><small>决定怎么看、如何照亮</small></p></div>
          <div><span className="lesson-number">03</span><p><strong>逐帧更新</strong><small>useFrame 驱动旋转动画</small></p></div>
        </div>
      </main>
      <footer><span>从熟悉的 React，走进 Three.js。</span><span>BUILD · EXPLORE · PLAY</span></footer>
    </div>
  )
}
