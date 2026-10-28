import { useMemo, useRef } from "react";
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
  shape,
  modelUrl,
  controls,
}: {
  shape: Shape;
  modelUrl: string | null;
  controls: SceneControls;
}) {
  const group = useRef<Group>(null);

  // 每帧直接修改 Three.js 对象，不使用 setState。
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
