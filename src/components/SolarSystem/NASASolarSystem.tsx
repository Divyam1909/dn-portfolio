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
  const cleanupRef = useRef<(() => void) | null>(null);

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
      toneMapped: false,
      color: new THREE.Color(1.5, 1.2, 0.9)
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
      { name: 'Mercury', label: 'About', size: 0.5, dist: 8, speed: 0.0041, texture: 'mercury.jpg', route: '/about', initialAngle: 2.1, moons: [] },
      { name: 'Venus', label: 'Resume', size: 0.9, dist: 11, speed: 0.0016, texture: 'venus.jpg', route: '/resume', initialAngle: 4.8, moons: [] },
      { name: 'Earth', label: 'Projects', size: 1, dist: 15, speed: 0.001, texture: 'earth.jpg', route: '/projects', initialAngle: 3.45, moons: [{ size: 0.27, dist: 2, speed: 0.037 }] },
      { name: 'Mars', label: 'Experience', size: 0.8, dist: 19, speed: 0.00053, texture: 'mars.jpg', route: '/resume#experience', initialAngle: 0.9, moons: [{ size: 0.1, dist: 1.5, speed: 0.05 }, { size: 0.08, dist: 2, speed: 0.03 }] },
      { name: 'Jupiter', label: 'Education', size: 2, dist: 25, speed: 0.000084, texture: 'jupiter.jpg', route: '/resume#education', initialAngle: 2.7, moons: [{ size: 0.15, dist: 3, speed: 0.02 }, { size: 0.13, dist: 3.5, speed: 0.015 }, { size: 0.2, dist: 4, speed: 0.01 }, { size: 0.18, dist: 4.5, speed: 0.008 }] },
      { name: 'Saturn', label: 'Skills', size: 1.7, dist: 31, speed: 0.000034, texture: 'saturn.jpg', route: '/resume#skills', initialAngle: 5.8, hasRings: true, moons: [{ size: 0.12, dist: 3, speed: 0.015 }, { size: 0.1, dist: 3.5, speed: 0.012 }, { size: 0.15, dist: 4, speed: 0.01 }] },
      { name: 'Uranus', label: 'Certifications', size: 1.2, dist: 37, speed: 0.000012, texture: 'uranus.jpg', route: '/resume#certifications', initialAngle: 1.2, moons: [{ size: 0.1, dist: 2.5, speed: 0.018 }, { size: 0.09, dist: 3, speed: 0.015 }] },
      { name: 'Neptune', label: 'Contact', size: 1.15, dist: 43, speed: 0.000006, texture: 'neptune.jpg', route: '/contact', initialAngle: 4.3, moons: [{ size: 0.11, dist: 2.8, speed: 0.016 }] }
    ];

    const planets: Planet[] = [];
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const planetLabels: any[] = [];
    const moonGroups: any[] = [];

    planetsData.forEach((data, index) => {
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
      planetMesh.userData = { label: data.label, name: data.name };
      orbitGroup.add(planetMesh);
      orbitGroup.rotation.y = data.initialAngle;
      
      // Add rings for Saturn
      if (data.hasRings) {
        const ringTexture = loader.load('/textures/saturn_ring.png');
        ringTexture.rotation = Math.PI / 2;
        const ringGeometry = new THREE.RingGeometry(data.size * 1.4, data.size * 2.3, 64);
        const ringMaterial = new THREE.MeshStandardMaterial({
          map: ringTexture,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.7,
          roughness: 0.8,
        });
        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        ring.rotation.x = -Math.PI / 2.5;
        planetMesh.add(ring);
      }

      // Add moons
      if (data.moons && data.moons.length > 0) {
        const moonGroup = new THREE.Group();
        data.moons.forEach((moonData: any, moonIndex: number) => {
          const moonGeometry = new THREE.SphereGeometry(moonData.size, 16, 16);
          const moonMaterial = new THREE.MeshStandardMaterial({
            color: 0xaaaaaa,
            roughness: 0.9,
            metalness: 0.1,
          });
          const moonMesh = new THREE.Mesh(moonGeometry, moonMaterial);
          moonMesh.position.x = moonData.dist;
          moonGroup.add(moonMesh);
          
          moonGroups.push({
            group: moonGroup,
            mesh: moonMesh,
            speed: moonData.speed,
            dist: moonData.dist,
            angle: (moonIndex / data.moons.length) * Math.PI * 2
          });
        });
        planetMesh.add(moonGroup);
      }

      // Create text label (will be positioned in DOM)
      planetLabels.push({
        planet: planetMesh,
        label: data.label,
        name: data.name
      });

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
          const geometry = planet.mesh.geometry as THREE.SphereGeometry;
          const distance = (geometry.parameters?.radius || 1) * 5;
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

    // Create DOM labels container
    const labelsContainer = document.createElement('div');
    labelsContainer.style.position = 'absolute';
    labelsContainer.style.top = '0';
    labelsContainer.style.left = '0';
    labelsContainer.style.width = '100%';
    labelsContainer.style.height = '100%';
    labelsContainer.style.pointerEvents = 'none';
    container.appendChild(labelsContainer);

    const labelElements: any[] = [];
    planetLabels.forEach(labelData => {
      const labelDiv = document.createElement('div');
      labelDiv.textContent = labelData.label;
      labelDiv.style.position = 'absolute';
      labelDiv.style.color = '#FFD60A';
      labelDiv.style.fontFamily = '"Orbitron", monospace';
      labelDiv.style.fontSize = '12px';
      labelDiv.style.fontWeight = '700';
      labelDiv.style.textTransform = 'uppercase';
      labelDiv.style.letterSpacing = '1px';
      labelDiv.style.padding = '4px 8px';
      labelDiv.style.background = 'rgba(11, 61, 145, 0.8)';
      labelDiv.style.borderRadius = '4px';
      labelDiv.style.border = '1px solid rgba(255, 214, 10, 0.5)';
      labelDiv.style.backdropFilter = 'blur(5px)';
      labelDiv.style.whiteSpace = 'nowrap';
      labelsContainer.appendChild(labelDiv);
      labelElements.push({ div: labelDiv, planet: labelData.planet });
    });

    // Animation loop
    let speed = 0.4;
    const animate = () => {
      animationId = requestAnimationFrame(animate);

      // Rotate planets and orbits
      planets.forEach(planet => {
        planet.orbitGroup.rotation.y += planet.orbitSpeed * speed;
        planet.mesh.rotation.y += planet.rotationSpeed;
      });

      // Animate moons
      moonGroups.forEach(moonData => {
        moonData.angle += moonData.speed;
        moonData.mesh.position.x = Math.cos(moonData.angle) * moonData.dist;
        moonData.mesh.position.z = Math.sin(moonData.angle) * moonData.dist;
      });

      // Update label positions
      labelElements.forEach(labelData => {
        const pos = new THREE.Vector3();
        labelData.planet.getWorldPosition(pos);
        pos.y += labelData.planet.geometry.parameters.radius + 0.8;
        pos.project(camera);

        const x = (pos.x * 0.5 + 0.5) * window.innerWidth;
        const y = (pos.y * -0.5 + 0.5) * window.innerHeight;

        labelData.div.style.transform = `translate(-50%, -100%) translate(${x}px, ${y}px)`;
        labelData.div.style.opacity = pos.z < 1 ? '1' : '0';
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
      
      // Remove labels
      if (container.contains(labelsContainer)) {
        container.removeChild(labelsContainer);
      }
      
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

