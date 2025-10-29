import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const ShootingStars: React.FC = () => {
  const starsRef = useRef<THREE.Group>(null);

  // Create multiple shooting stars
  const shootingStars = useMemo(() => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push({
        id: i,
        startPosition: new THREE.Vector3(
          (Math.random() - 0.5) * 200,
          Math.random() * 100 + 50,
          (Math.random() - 0.5) * 200
        ),
        direction: new THREE.Vector3(
          (Math.random() - 0.5) * 2,
          -Math.random() * 2 - 1,
          (Math.random() - 0.5) * 2
        ).normalize(),
        speed: Math.random() * 0.5 + 0.3,
        delay: Math.random() * 10,
        length: Math.random() * 3 + 2,
      });
    }
    return stars;
  }, []);

  useFrame((state) => {
    if (!starsRef.current) return;

    starsRef.current.children.forEach((star, index) => {
      const data = shootingStars[index];
      const time = state.clock.elapsedTime;
      
      // Calculate position with delay
      const activeTime = (time - data.delay) % 10; // Reset every 10 seconds
      
      if (activeTime > 0 && activeTime < 3) {
        // Star is active
        const distance = activeTime * data.speed * 50;
        star.position.copy(data.startPosition).add(
          data.direction.clone().multiplyScalar(distance)
        );
        star.visible = true;
        
        // Fade in/out
        const material = (star as THREE.Line).material as THREE.LineBasicMaterial;
        if (activeTime < 0.2) {
          material.opacity = activeTime / 0.2;
        } else if (activeTime > 2.8) {
          material.opacity = (3 - activeTime) / 0.2;
        } else {
          material.opacity = 0.8;
        }
      } else {
        star.visible = false;
      }
    });
  });

  return (
    <group ref={starsRef}>
      {shootingStars.map((star) => {
        const points = [];
        points.push(new THREE.Vector3(0, 0, 0));
        points.push(star.direction.clone().multiplyScalar(-star.length));
        
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        
        return (
          <primitive key={star.id} object={new THREE.Line(geometry, new THREE.LineBasicMaterial({
            color: '#FFFFFF',
            transparent: true,
            opacity: 0.8,
          }))} />
        );
      })}
    </group>
  );
};

export default ShootingStars;

