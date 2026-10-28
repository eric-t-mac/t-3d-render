import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { ContactShadows, Grid, Html, OrbitControls } from "@react-three/drei";
import { Perf } from "r3f-perf";
import { ErrorBoundary } from "./ErrorBoundary";
import { Model, type Shape } from "./Model";
import type { SceneControls } from "../hooks/useSceneControls";

export function Scene({
  shape,
  modelUrl,
  controls,
  showPerf,
  cameraKey,
}: {
  shape: Shape;
  modelUrl: string | null;
  controls: SceneControls;
  showPerf: boolean;
  cameraKey: number;
}) {
  return (
    <ErrorBoundary
      fallback={() => (
        <div className="canvas-fallback" role="alert">
          无法创建三维画布。请检查浏览器硬件加速和 WebGL 支持，然后刷新页面。
        </div>
      )}
    >
      <Canvas
        key={cameraKey}
        shadows
        dpr={[1, 2]}
        camera={{ position: [4, 3.4, 5], fov: 42 }}
        fallback={<div className="canvas-fallback">浏览器不支持 WebGL。</div>}
        aria-label="可拖动旋转和缩放的三维场景"
      >
        <color attach="background" args={["#edf1ef"]} />
        <ambientLight intensity={controls.ambientIntensity} />
        <directionalLight
          position={[3, 6, 4]}
          intensity={controls.lightIntensity}
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        <directionalLight
          position={[-4, 3, -2]}
          intensity={1.8}
          color="#b7d9ff"
        />
        <ErrorBoundary
          key={modelUrl ?? shape}
          fallback={() => (
            <Html center>
              <div className="model-message" role="alert">
                模型加载失败，请选择资源内嵌、未使用 Draco 压缩的
                GLB，或切换回内置几何体。
              </div>
            </Html>
          )}
        >
          <Suspense
            fallback={
              <Html center>
                <div className="model-message">正在加载模型…</div>
              </Html>
            }
          >
            <Model shape={shape} modelUrl={modelUrl} controls={controls} />
          </Suspense>
        </ErrorBoundary>
        <mesh position={[0, -0.12, 0]} receiveShadow>
          <cylinderGeometry args={[1.5, 1.5, 0.24, 64]} />
          <meshStandardMaterial color="#f9fbfa" roughness={0.8} />
        </mesh>
        <ContactShadows
          position={[0, 0.015, 0]}
          opacity={0.35}
          scale={8}
          blur={2.5}
          far={4}
        />
        <Grid
          position={[0, -0.245, 0]}
          args={[20, 20]}
          cellSize={0.5}
          sectionSize={2.5}
          cellColor="#ced8d2"
          sectionColor="#b0c0b7"
          fadeDistance={18}
          fadeStrength={1.5}
        />
        {/* 鼠标拖动时移动相机，像围着商品拍照；与 Model 的自动旋转是两套操作。
            注释 Model 的 useFrame 后，这里的拖动观察仍然可用。
            若要禁止拖动旋转，可加 enableRotate={false}；滚轮缩放仍可用。 */}
        <OrbitControls
          makeDefault
          target={[0, 1, 0]}
          minDistance={2.8}
          maxDistance={12}
          maxPolarAngle={Math.PI / 2}
        />
        {showPerf && (
          <Perf
            position="top-left"
            style={{ position: "absolute", top: 50, left: 12 }}
          />
        )}
      </Canvas>
    </ErrorBoundary>
  );
}
