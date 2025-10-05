import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  OrbitControls, 
  Sphere, 
  Points, 
  PointMaterial,
  Html,
  Environment
} from '@react-three/drei';
import * as THREE from 'three';
import { useTheme } from '../hooks/useTheme';

// Animated particles around the globe
function Particles({ count = 1000 }) {
  const mesh = useRef();
  const { isDarkMode } = useTheme();
  
  const particlesPosition = useMemo(() => {
    const positions = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      // Create particles in a spherical distribution
      const radius = 4 + Math.random() * 4;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
    }
    
    return positions;
  }, [count]);

  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.x = state.clock.elapsedTime * 0.05;
      mesh.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <Points ref={mesh} positions={particlesPosition} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color={isDarkMode ? '#3B82F6' : '#1E40AF'}
        size={0.02}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.6}
      />
    </Points>
  );
}

// Enhanced globe with better materials and lighting
function Globe() {
  const meshRef = useRef();
  const { isDarkMode } = useTheme();
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <group>
      {/* Main globe */}
      <Sphere ref={meshRef} args={[2, 64, 64]}>
        <meshStandardMaterial
          color={isDarkMode ? '#1E293B' : '#E2E8F0'}
          transparent
          opacity={0.1}
          wireframe
        />
      </Sphere>
      
      {/* Inner core */}
      <Sphere args={[1.5, 32, 32]}>
        <meshStandardMaterial
          color={isDarkMode ? '#3B82F6' : '#1E40AF'}
          transparent
          opacity={0.05}
          emissive={isDarkMode ? '#1E40AF' : '#3B82F6'}
          emissiveIntensity={0.1}
        />
      </Sphere>
      
      {/* Outer ring */}
      <mesh>
        <ringGeometry args={[3, 3.2, 64]} />
        <meshStandardMaterial
          color={isDarkMode ? '#3B82F6' : '#1E40AF'}
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

// Connection lines between points
function Connections() {
  const { isDarkMode } = useTheme();
  
  const lines = useMemo(() => {
    const lineGeometries = [];
    const numConnections = 20;
    
    for (let i = 0; i < numConnections; i++) {
      const points = [];
      
      // Random start point on sphere
      const startTheta = Math.random() * Math.PI * 2;
      const startPhi = Math.acos(Math.random() * 2 - 1);
      const startRadius = 2.1;
      
      points.push(new THREE.Vector3(
        startRadius * Math.sin(startPhi) * Math.cos(startTheta),
        startRadius * Math.sin(startPhi) * Math.sin(startTheta),
        startRadius * Math.cos(startPhi)
      ));
      
      // Random end point on sphere
      const endTheta = Math.random() * Math.PI * 2;
      const endPhi = Math.acos(Math.random() * 2 - 1);
      const endRadius = 2.1;
      
      points.push(new THREE.Vector3(
        endRadius * Math.sin(endPhi) * Math.cos(endTheta),
        endRadius * Math.sin(endPhi) * Math.sin(endTheta),
        endRadius * Math.cos(endPhi)
      ));
      
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      lineGeometries.push(geometry);
    }
    
    return lineGeometries;
  }, []);

  return (
    <group>
      {lines.map((geometry, index) => (
        <line key={index} geometry={geometry}>
          <lineBasicMaterial
            color={isDarkMode ? '#3B82F6' : '#1E40AF'}
            transparent
            opacity={0.2}
          />
        </line>
      ))}
    </group>
  );
}

// Responsive camera setup
function ResponsiveCamera() {
  const { size, camera } = useThree();
  
  React.useEffect(() => {
    const aspect = size.width / size.height;
    
    if (size.width < 768) {
      // Mobile
      camera.position.set(0, 0, 12);
      camera.fov = 60;
    } else if (size.width < 1024) {
      // Tablet
      camera.position.set(0, 0, 10);
      camera.fov = 55;
    } else {
      // Desktop
      camera.position.set(0, 0, 8);
      camera.fov = 50;
    }
    
    camera.aspect = aspect;
    camera.updateProjectionMatrix();
  }, [size, camera]);
  
  return null;
}

export default function BrainBackground() {
  const { isDarkMode } = useTheme();
  
  return (
    <div style={{
      position: "fixed",
      inset: 0,
      zIndex: -1,
      width: "100vw",
      height: "100vh",
      background: isDarkMode 
        ? "radial-gradient(ellipse at center, #1E293B 0%, #0F172A 70%, #000000 100%)"
        : "radial-gradient(ellipse at center, #F8FAFC 0%, #E2E8F0 70%, #CBD5E1 100%)"
    }}>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.2;
        }}
      >
        <ResponsiveCamera />
        
        {/* Lighting setup */}
        <ambientLight intensity={isDarkMode ? 0.3 : 0.6} />
        <directionalLight 
          position={[5, 5, 5]} 
          intensity={isDarkMode ? 0.8 : 1.2}
          color={isDarkMode ? '#60A5FA' : '#1E40AF'} 
        />
        <pointLight 
          position={[-5, -5, 5]} 
          intensity={isDarkMode ? 0.5 : 0.8}
          color={isDarkMode ? '#3B82F6' : '#60A5FA'} 
        />
        
        {/* Environment for better reflections */}
        <Environment preset={isDarkMode ? 'night' : 'dawn'} />
        
        {/* 3D Elements */}
        <Globe />
        <Particles count={800} />
        <Connections />
        
        {/* Controls */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.3}
          maxPolarAngle={Math.PI}
          minPolarAngle={0}
          enableDamping
          dampingFactor={0.05}
        />
      </Canvas>
    </div>
  );
}
