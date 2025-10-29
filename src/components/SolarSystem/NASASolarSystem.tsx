import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { Lensflare, LensflareElement } from 'three/examples/jsm/objects/Lensflare.js';

interface Planet {
  mesh: THREE.Mesh;
  orbitGroup: THREE.Group;
  orbitSpeed: number;
  rotationSpeed: number;
  angle: number;
  route: string;
}

const NASASolarSystem: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const cleanupRef = useRef<() => void>();

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    let animationId: number;

    // Scene and Camera Setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000814);
    scene.fog = new THREE.Fog(0x000814, 180, 250);

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 20, 40);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.rotateSpeed = 0.3;
    controls.zoomSpeed = 0.8;
    controls.panSpeed = 0.5;

    // Texture Loader
    const loader = new THREE.TextureLoader();

    // Lighting
    const ambientLight = new THREE.AmbientLight(new THREE.Color(0.13, 0.13, 0.13), 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(new THREE.Color(1.0, 1.0, 1.0), 10.0, 1000, 0.5);
    pointLight.position.set(0, 0, 0);
    scene.add(pointLight);

    // Starfield
    const starTexture = loader.load('/textures/8k_stars.jpg');
    const starGeo = new THREE.SphereGeometry(200, 64, 64);
    const starMat = new THREE.MeshBasicMaterial({
      map: starTexture,
      side: THREE.BackSide,
      toneMapped: false,
      color: new THREE.Color(1.2, 1.2, 1.2),
    });
    const starfield = new THREE.Mesh(starGeo, starMat);
    scene.add(starfield);

    // Sun
    const sunMaterial = new THREE.MeshBasicMaterial({
      map: loader.load('/textures/sun.jpg'),
      emissive: new THREE.Color(1.5, 1.2, 0.8),
      emissiveIntensity: 1.8,
      toneMapped: false,
      color: new THREE.Color(1.2, 1.1, 0.9)
    });
    const sun = new THREE.Mesh(new THREE.SphereGeometry(5, 64, 64), sunMaterial);
    scene.add(sun);

    // Lens flare
    const textureFlare0 = loader.load('/textures/lensflare0.png');
    const textureFlare2 = loader.load('/textures/lensflare2.png');
    const lensflare = new Lensflare();
    lensflare.addElement(new LensflareElement(textureFlare0, 512, 0, new THREE.Color(1, 0.9, 0.8)));
    lensflare.addElement(new LensflareElement(textureFlare2, 128, 0.2, new THREE.Color(1, 1, 0.6)));
    sun.add(lensflare);

    // Planets with portfolio routes
    const planetsData = [
      { name: 'Mercury', size: 0.5, dist: 8, speed: 0.0041, texture: 'mercury.jpg', route: '/about', initialAngle: 2.1 },
      { name: 'Venus', size: 0.9, dist: 11, speed: 0.0016, texture: 'venus.jpg', route: '/resume', initialAngle: 4.8 },
      { name: 'Earth', size: 1, dist: 15, speed: 0.001, texture: 'earth.jpg', route: '/projects', initialAngle: 3.45 },
      { name: 'Mars', size: 0.8, dist: 19, speed: 0.00053, texture: 'mars.jpg', route: '/resume#experience', initialAngle: 0.9 },
      { name: 'Jupiter', size: 2, dist: 25, speed: 0.000084, texture: 'jupiter.jpg', route: '/resume#education', initialAngle: 2.7 },
      { name: 'Saturn', size: 1.7, dist: 31, speed: 0.000034, texture: 'saturn.jpg', route: '/resume#skills', initialAngle: 5.8, hasRings: true },
      { name: 'Uranus', size: 1.2, dist: 37, speed: 0.000012, texture: 'uranus.jpg', route: '/resume#certifications', initialAngle: 1.2 },
      { name: 'Neptune', size: 1.15, dist: 43, speed: 0.000006, texture: 'neptune.jpg', route: '/contact', initialAngle: 4.3 }
    ];

    const planets: Planet[] = [];
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    planetsData.forEach(data => {
      const orbitGroup = new THREE.Group();
      const planetGeometry = new THREE.SphereGeometry(data.size, 64, 64);
      const planetMaterial = new THREE.MeshStandardMaterial({
        map: loader.load(`/textures/${data.texture}`),
        roughness: 0.7,
        metalness: 0.05,
      });
      const planetMesh = new THREE.Mesh(planetGeometry, planetMaterial);
      
      // Position planet
      planetMesh.position.x = data.dist;
      orbitGroup.add(planetMesh);
      orbitGroup.rotation.y = data.initialAngle;
      
      // Add rings for Saturn
      if (data.hasRings) {
        const ringTexture = loader.load('/textures/saturn_ring.png');
        const ringGeometry = new THREE.RingGeometry(data.size * 1.3, data.size * 2.2, 64);
        const ringMaterial = new THREE.MeshBasicMaterial({
          map: ringTexture,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.8
        });
        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        ring.rotation.x = Math.PI / 2;
        planetMesh.add(ring);
      }

      // Orbit line
      const orbitGeometry = new THREE.BufferGeometry();
      const orbitPoints = [];
      for (let i = 0; i <= 100; i++) {
        const angle = (i / 100) * Math.PI * 2;
        orbitPoints.push(new THREE.Vector3(
          Math.cos(angle) * data.dist,
          0,
          Math.sin(angle) * data.dist
        ));
      }
      orbitGeometry.setFromPoints(orbitPoints);
      const orbitMaterial = new THREE.LineBasicMaterial({
        color: 0x4cc9f0,
        transparent: true,
        opacity: 0.3
      });
      const orbitLine = new THREE.Line(orbitGeometry, orbitMaterial);
      scene.add(orbitLine);
      
      scene.add(orbitGroup);
      
      planets.push({
        mesh: planetMesh,
        orbitGroup: orbitGroup,
        orbitSpeed: data.speed,
        rotationSpeed: 0.01,
        angle: data.initialAngle,
        route: data.route
      });
    });

    // Post-processing
    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      0.5,
      0.4,
      0.85
    );
    composer.addPass(bloomPass);

    const outputPass = new OutputPass();
    composer.addPass(outputPass);

    // Click handling
    const onMouseClick = (event: MouseEvent) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(planets.map(p => p.mesh));

      if (intersects.length > 0) {
        const planet = planets.find(p => p.mesh === intersects[0].object);
        if (planet) {
          // Smooth camera animation before navigating
          const targetPos = planet.mesh.getWorldPosition(new THREE.Vector3());
          const direction = camera.position.clone().sub(targetPos).normalize();
          const distance = planet.mesh.geometry.parameters.radius * 5;
          const newPos = targetPos.clone().add(direction.multiplyScalar(distance));
          
          const startPos = camera.position.clone();
          const duration = 1000;
          const startTime = Date.now();
          
          const animateCamera = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = progress < 0.5
              ? 4 * progress * progress * progress
              : 1 - Math.pow(-2 * progress + 2, 3) / 2;
            
            camera.position.lerpVectors(startPos, newPos, eased);
            camera.lookAt(targetPos);
            controls.target.copy(targetPos);
            controls.update();
            
            if (progress < 1) {
              requestAnimationFrame(animateCamera);
            } else {
              setTimeout(() => navigate(planet.route), 200);
            }
          };
          
          animateCamera();
        }
      }
    };

    window.addEventListener('click', onMouseClick);

    // Animation loop
    let speed = 0.4;
    const animate = () => {
      animationId = requestAnimationFrame(animate);

      // Rotate planets and orbits
      planets.forEach(planet => {
        planet.orbitGroup.rotation.y += planet.orbitSpeed * speed;
        planet.mesh.rotation.y += planet.rotationSpeed;
      });

      // Rotate starfield
      starfield.rotation.y += 0.0001;

      controls.update();
      composer.render();
    };

    animate();

    // Resize handler
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      composer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    cleanupRef.current = () => {
      window.removeEventListener('click', onMouseClick);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
      
      // Dispose
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          if (object.material instanceof THREE.Material) {
            object.material.dispose();
          }
        }
      });
      
      renderer.dispose();
      composer.dispose();
      
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };

    return () => {
      if (cleanupRef.current) {
        cleanupRef.current();
      }
    };
  }, [navigate]);

  return <div ref={containerRef} style={{ width: '100%', height: '100vh', overflow: 'hidden' }} />;
};

export default NASASolarSystem;

