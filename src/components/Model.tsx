import { useMemo, useRef } from "react";
// 恢复下方自动旋转代码时，也需要恢复这行导入。
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { Box3, Vector3, type Group } from "three";
import type { SceneControls } from "../hooks/useSceneControls";

export type Shape = "knot" | "cube" | "sphere";

function ImportedModel({ url }: { url: string }) {
  // 关闭自动 Draco 解码器下载；入门模板使用未压缩、资源内嵌的 GLB。
  const { scene } = useGLTF(url, false);
  const { object, scale, position } = useMemo(() => {
    const object = scene.clone(true);
    object.traverse((child) => {
      child.castShadow = true;
      child.receiveShadow = true;
    });
    const box = new Box3().setFromObject(object);
    const size = box.getSize(new Vector3());
    const center = box.getCenter(new Vector3());
    const scale = 2 / (Math.max(size.x, size.y, size.z) || 1);
    return {
      object,
      scale,
      position: center.multiplyScalar(-scale),
    };
  }, [scene]);

  // useGLTF 缓存拥有模型资源，primitive 卸载时不自动销毁共享资源。
  return (
    <primitive
      object={object}
      scale={scale}
      position={position}
      dispose={null}
    />
  );
}

export function Model({
  // 内置形状："knot" 扭结、"cube" 立方体、"sphere" 球体。
  // 只有没有导入模型时，才根据这个值选择形状。
  shape,
  // 导入模型的加载地址（本地文件通常是 blob: 地址）。
  // null 表示使用内置形状；有地址时优先展示导入模型。
  modelUrl,
  // 参数面板提供的设置：颜色、金属感、粗糙度、线框、旋转开关和速度等。
  // 当前颜色等材质设置用于内置形状；导入模型保留自身材质。
  controls,
}: {
  shape: Shape;
  modelUrl: string | null;
  controls: SceneControls;
}) {
  const group = useRef<Group>(null);

  // 自动旋转：每帧修改物体的角度，不使用 setState。
  // 注释掉后，物体不再自动转；鼠标拖动仍由 Scene.tsx 的 OrbitControls 移动相机。
  useFrame((_state, delta) => {
    if (group.current && controls.autoRotate) {
      group.current.rotation.y += Math.min(delta, 0.1) * controls.speed;
    }
  });

  return (
    <group ref={group} position={[0, 1.45, 0]}>
      {modelUrl ? (
        <ImportedModel url={modelUrl} />
      ) : (
        // rotation 是固定的初始倾斜（绕 x 轴 0.15 弧度），不是持续旋转。
        <mesh castShadow receiveShadow rotation={[0.15, 0, 0]}>
          {shape === "knot" && (
            <torusKnotGeometry args={[0.65, 0.23, 160, 24]} />
          )}
          {shape === "cube" && <boxGeometry args={[1.45, 1.45, 1.45]} />}
          {shape === "sphere" && <sphereGeometry args={[0.95, 48, 32]} />}
          <meshStandardMaterial
            color={controls.color}
            metalness={controls.metalness}
            roughness={controls.roughness}
            wireframe={controls.wireframe}
          />
        </mesh>
      )}
    </group>
  );
}
