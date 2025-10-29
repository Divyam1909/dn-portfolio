import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const CosmosBackground: React.FC = () => {
  const galaxyRef = useRef<THREE.Points>(null);
  const nebula1Ref = useRef<THREE.Points>(null);
  const nebula2Ref = useRef<THREE.Points>(null);
  const dustRef = useRef<THREE.Points>(null);

  // Create spiral galaxy
  const galaxyGeometry = useMemo(() => {
    const count = 15000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const colorInside = new THREE.Color('#ff6030');
    const colorMiddle = new THREE.Color('#4a90e2');
    const colorOutside = new THREE.Color('#1b3984');

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      const radius = Math.random() * 150 + 80;
      const spinAngle = radius * 0.015;
      const branchAngle = ((i % 5) / 5) * Math.PI * 2;
      
      const randomX = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 4;
      const randomY = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 4;
      const randomZ = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 4;

      positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
      positions[i3 + 1] = randomY;
      positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;

      // Color gradient
      const mixedColor = colorInside.clone();
      if (radius < 100) {
        mixedColor.lerp(colorMiddle, radius / 100);
      } else {
        mixedColor.copy(colorMiddle);
        mixedColor.lerp(colorOutside, (radius - 100) / 150);
      }

      colors[i3] = mixedColor.r;
      colors[i3 + 1] = mixedColor.g;
      colors[i3 + 2] = mixedColor.b;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    return geometry;
  }, []);

  // Create nebula clouds
  const nebulaGeometry = useMemo(() => {
    const count = 5000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const nebulaColors = [
      new THREE.Color('#ff6b9d'), // Pink
      new THREE.Color('#4a90e2'), // Blue
      new THREE.Color('#9b59b6'), // Purple
      new THREE.Color('#1abc9c'), // Cyan
    ];

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      // Create cloud-like clusters
      const clusterX = (Math.random() - 0.5) * 60;
      const clusterY = (Math.random() - 0.5) * 40;
      const clusterZ = (Math.random() - 0.5) * 60;
      
      const spread = 15;
      positions[i3] = clusterX + (Math.random() - 0.5) * spread + 100;
      positions[i3 + 1] = clusterY + (Math.random() - 0.5) * spread;
      positions[i3 + 2] = clusterZ + (Math.random() - 0.5) * spread;

      const color = nebulaColors[Math.floor(Math.random() * nebulaColors.length)];
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    return geometry;
  }, []);

  // Create second nebula
  const nebula2Geometry = useMemo(() => {
    const count = 5000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const nebulaColors = [
      new THREE.Color('#ff9ff3'), // Light pink
      new THREE.Color('#54a0ff'), // Sky blue
      new THREE.Color('#5f27cd'), // Deep purple
    ];

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      const clusterX = (Math.random() - 0.5) * 50;
      const clusterY = (Math.random() - 0.5) * 35;
      const clusterZ = (Math.random() - 0.5) * 50;
      
      const spread = 12;
      positions[i3] = clusterX + (Math.random() - 0.5) * spread - 100;
      positions[i3 + 1] = clusterY + (Math.random() - 0.5) * spread + 20;
      positions[i3 + 2] = clusterZ + (Math.random() - 0.5) * spread;

      const color = nebulaColors[Math.floor(Math.random() * nebulaColors.length)];
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    return geometry;
  }, []);

  // Create cosmic dust
  const dustGeometry = useMemo(() => {
    const count = 8000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const dustColor = new THREE.Color('#444466');

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      positions[i3] = (Math.random() - 0.5) * 200;
      positions[i3 + 1] = (Math.random() - 0.5) * 200;
      positions[i3 + 2] = (Math.random() - 0.5) * 200;

      colors[i3] = dustColor.r + Math.random() * 0.1;
      colors[i3 + 1] = dustColor.g + Math.random() * 0.1;
      colors[i3 + 2] = dustColor.b + Math.random() * 0.2;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    return geometry;
  }, []);

  useFrame((state) => {
    if (galaxyRef.current) {
      galaxyRef.current.rotation.y = state.clock.elapsedTime * 0.008;
    }
    if (nebula1Ref.current) {
      nebula1Ref.current.rotation.y = state.clock.elapsedTime * 0.005;
      nebula1Ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.003) * 0.1;
    }
    if (nebula2Ref.current) {
      nebula2Ref.current.rotation.y = -state.clock.elapsedTime * 0.004;
      nebula2Ref.current.rotation.z = Math.cos(state.clock.elapsedTime * 0.003) * 0.1;
    }
    if (dustRef.current) {
      dustRef.current.rotation.y = state.clock.elapsedTime * 0.002;
    }
  });

  return (
    <>
      {/* Spiral Galaxy */}
      <points ref={galaxyRef} geometry={galaxyGeometry}>
        <pointsMaterial
          size={0.25}
          sizeAttenuation={true}
          depthWrite={false}
          vertexColors={true}
          blending={THREE.AdditiveBlending}
          transparent
          opacity={0.35}
        />
      </points>

      {/* Nebula Cloud 1 */}
      <points ref={nebula1Ref} geometry={nebulaGeometry}>
        <pointsMaterial
          size={1.2}
          sizeAttenuation={true}
          depthWrite={false}
          vertexColors={true}
          blending={THREE.AdditiveBlending}
          transparent
          opacity={0.25}
        />
      </points>

      {/* Nebula Cloud 2 */}
      <points ref={nebula2Ref} geometry={nebula2Geometry}>
        <pointsMaterial
          size={1.0}
          sizeAttenuation={true}
          depthWrite={false}
          vertexColors={true}
          blending={THREE.AdditiveBlending}
          transparent
          opacity={0.22}
        />
      </points>

      {/* Cosmic Dust */}
      <points ref={dustRef} geometry={dustGeometry}>
        <pointsMaterial
          size={0.15}
          sizeAttenuation={true}
          depthWrite={false}
          vertexColors={true}
          blending={THREE.AdditiveBlending}
          transparent
          opacity={0.3}
        />
      </points>
    </>
  );
};

export default CosmosBackground;

