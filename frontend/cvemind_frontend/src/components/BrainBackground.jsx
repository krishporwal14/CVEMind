import { Canvas } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import * as THREE from "three";

function Brain() {
  // Placeholder: Replace with a real 3D brain model for production
  return (
    <mesh>
      <sphereGeometry args={[2, 32, 32]} />
      <meshStandardMaterial color="#5F6FFF" wireframe opacity={0.3} transparent />
    </mesh>
  );
}

export default function BrainBackground() {
  return (
    <div style={{
      position: "fixed",
      inset: 0,
      zIndex: -1,
      width: "100vw",
      height: "100vh",
      background: "radial-gradient(ellipse at center, #23272F 0%, #181A20 100%)"
    }}>
      <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <Brain />
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
      </Canvas>
    </div>
  );
}
