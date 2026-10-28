import { folder, useControls } from 'leva'

export function useSceneControls() {
  return useControls({
    材质: folder({
      color: { value: '#79bfa6', label: '颜色' },
      metalness: { value: 0.25, min: 0, max: 1, step: 0.01, label: '金属感' },
      roughness: { value: 0.3, min: 0, max: 1, step: 0.01, label: '粗糙度' },
      wireframe: { value: false, label: '线框' },
    }),
    灯光: folder({
      lightIntensity: { value: 4, min: 0, max: 10, step: 0.1, label: '主灯强度' },
      ambientIntensity: { value: 1.1, min: 0, max: 3, step: 0.1, label: '环境亮度' },
    }),
    动画: folder({
      autoRotate: { value: true, label: '自动旋转' },
      speed: { value: 0.45, min: 0, max: 2, step: 0.05, label: '旋转速度' },
    }),
  })
}

export type SceneControls = ReturnType<typeof useSceneControls>
