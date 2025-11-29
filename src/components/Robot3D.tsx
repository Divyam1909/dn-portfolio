import React, { useEffect, useRef, useState, useCallback, forwardRef, useImperativeHandle } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

interface Robot3DProps {
  onRobotClick: () => void;
  isDarkMode?: boolean;
}

export interface Robot3DHandle {
  playAnimation: (name: string) => void;
}

// Random idle animations - weighted towards more interesting ones (NO Sitting)
const IDLE_ANIMATIONS = [
  'Walking', 'Walking', 'Walking',  // 3x weight
  'Death', 'Death',                  // 2x weight (dramatic!)
  'Running', 'Running',              // 2x weight
  'Standing',                        // 1x weight
  'Dance',                           // 1x weight
];
const IDLE_ANIMATION_INTERVAL = 10000; // Play random animation every 10 seconds

// Animation configs - NATURAL speeds (0.8-1.0 for smooth motion)
// NOTE: Model only has 3 expressions: 'Angry', 'Surprised', 'Sad'
const ANIMATION_CONFIG: { [key: string]: { speed?: number; loops?: number; expression?: string | null } } = {
  'Punch': { speed: 0.7, loops: 2, expression: 'Angry' },
  'No': { speed: 0.8, loops: 2, expression: 'Sad' },
  'Yes': { speed: 0.9, loops: 2, expression: 'Surprised' },
  'ThumbsUp': { speed: 0.9, loops: 1, expression: 'Surprised' },
  'Wave': { speed: 0.9, loops: 1, expression: 'Surprised' },
  'Jump': { speed: 1.0, loops: 1, expression: 'Surprised' },
  'Dance': { speed: 0.9, loops: 1, expression: 'Surprised' },
  'Death': { speed: 0.6, loops: 1, expression: 'Sad' },
  'Walking': { speed: 0.9, loops: 1, expression: null },
  'Running': { speed: 0.9, loops: 1, expression: null },
  'Standing': { speed: 0.8, loops: 1, expression: null },
};

const Robot3D = forwardRef<Robot3DHandle, Robot3DProps>(({ onRobotClick, isDarkMode = true }, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modelLoaded, setModelLoaded] = useState(false);
  const hasInitialized = useRef(false); // Prevent multiple initializations
  
  // Store references to Three.js objects
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const robotModelRef = useRef<THREE.Group | null>(null);
  const mixerRef = useRef<THREE.AnimationMixer | null>(null);
  const actionsRef = useRef<{ [key: string]: THREE.AnimationAction }>({});
  const activeActionRef = useRef<THREE.AnimationAction | null>(null);
  const clockRef = useRef<THREE.Clock>(new THREE.Clock());
  const raycasterRef = useRef<THREE.Raycaster>(new THREE.Raycaster());
  const mouseRef = useRef<THREE.Vector2>(new THREE.Vector2());
  const isHoveringRef = useRef<boolean>(false);
  const animationIdRef = useRef<number | null>(null);
  const idleIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isPlayingOneShotRef = useRef<boolean>(false);
  const faceMeshRef = useRef<THREE.Mesh | null>(null);
  const currentExpressionRef = useRef<string>('');

  // Expression morph targets available in RobotExpressive (NO Happy!)
  const EXPRESSIONS = ['Angry', 'Sad', 'Surprised'];

  // Reset all expressions to neutral
  const resetExpression = useCallback(() => {
    if (!faceMeshRef.current) return;
    
    const morphTargetInfluences = faceMeshRef.current.morphTargetInfluences;
    const morphTargetDictionary = faceMeshRef.current.morphTargetDictionary;
    
    if (!morphTargetInfluences || !morphTargetDictionary) return;

    // Set all expressions to 0 (neutral face)
    Object.keys(morphTargetDictionary).forEach((key) => {
      const index = morphTargetDictionary[key];
      if (index !== undefined && morphTargetInfluences[index] !== undefined) {
        morphTargetInfluences[index] = 0;
      }
    });
    currentExpressionRef.current = '';
  }, []);

  // Set facial expression using morph targets
  const setExpression = useCallback((expressionName: string | null) => {
    if (!expressionName) {
      resetExpression();
      return;
    }
    
    if (!faceMeshRef.current) return;
    
    const mesh = faceMeshRef.current;
    const morphTargetInfluences = mesh.morphTargetInfluences;
    const morphTargetDictionary = mesh.morphTargetDictionary;
    
    if (!morphTargetInfluences || !morphTargetDictionary) return;

    // Reset all expressions to 0 first
    for (let i = 0; i < morphTargetInfluences.length; i++) {
      morphTargetInfluences[i] = 0;
    }

    // Set the new expression to 1
    if (morphTargetDictionary[expressionName] !== undefined) {
      const index = morphTargetDictionary[expressionName];
      morphTargetInfluences[index] = 1;
      currentExpressionRef.current = expressionName;
    }
  }, [resetExpression]);

  useEffect(() => {
    // CRITICAL: Only initialize ONCE - check if container already has canvas
    if (!containerRef.current) return;

    // Check if we already have a canvas child (prevents double init in StrictMode)
    if (containerRef.current.querySelector('canvas')) return;

    if (hasInitialized.current) return;

    hasInitialized.current = true;

    // Scene Setup
    const scene = new THREE.Scene();
    // TRANSPARENT background - no colored boxes!
    scene.background = null;
    sceneRef.current = scene;

    // Camera - positioned to show robot centered in canvas viewport
    const camera = new THREE.PerspectiveCamera(
      45,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      100
    );
    // Position camera directly in front, centered on robot - adjusted for larger scale
    camera.position.set(0, 1.4, 4.2);
    camera.lookAt(0, 1.1, 0);
    cameraRef.current = camera;

    // Renderer with ALPHA for transparency
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      premultipliedAlpha: false
    });
    renderer.setClearColor(0x000000, 0); // Fully transparent
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit for performance
    renderer.shadowMap.enabled = true;
    
    // Style the canvas element directly
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.outline = 'none';
    renderer.domElement.style.touchAction = 'none'; // Better touch handling
    
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting - Enhanced for better visibility
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1.5);
    hemiLight.position.set(0, 20, 0);
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(5, 10, 7);
    dirLight.castShadow = true;
    scene.add(dirLight);

    const dirLight2 = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight2.position.set(-5, 10, -7);
    scene.add(dirLight2);

    // Add a stronger ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    // Controls - IMPORTANT: Don't block page scroll!
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enablePan = false;
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 3;
    controls.maxDistance = 10;
    controls.target.set(0, 1.1, 0);
    controls.enableZoom = true;
    controls.zoomSpeed = 0.5;
    // This prevents the controls from blocking page scroll
    controls.listenToKeyEvents(window);
    controls.update();
    controlsRef.current = controls;

    // Load Robot Model
    const loader = new GLTFLoader();
    
    loader.load(
      'https://threejs.org/examples/models/gltf/RobotExpressive/RobotExpressive.glb',
      (gltf) => {
        const robotModel = gltf.scene;
        
        // Scale the robot to 65% of original size for better visibility
        robotModel.scale.set(0.55, 0.55, 0.55);
        
        // Position robot at origin - the model's center point
        robotModel.position.set(0, 0, 0);
        
        // Setup Shadows
        robotModel.traverse((object) => {
          if ((object as THREE.Mesh).isMesh) {
            (object as THREE.Mesh).castShadow = true;
          }
        });
        
        // Find face mesh by exact name 'Head_4' (from Three.js official example)
        const face = robotModel.getObjectByName('Head_4') as THREE.Mesh;
        if (face && face.morphTargetDictionary && face.morphTargetInfluences) {
          faceMeshRef.current = face;
        }

        scene.add(robotModel);
        robotModelRef.current = robotModel;
        setModelLoaded(true);

        // Setup Animation Mixer
        const mixer = new THREE.AnimationMixer(robotModel);
        mixerRef.current = mixer;
        
        const animations = gltf.animations;
        const actions: { [key: string]: THREE.AnimationAction } = {};

        // Store actions for easy access
        animations.forEach((clip) => {
          actions[clip.name] = mixer.clipAction(clip);
        });
        actionsRef.current = actions;

        // Start with Idle animation
        if (actions['Idle']) {
          activeActionRef.current = actions['Idle'];
          activeActionRef.current.play();
        }

        setLoading(false);
        setModelLoaded(true);
        animate();
      },
      undefined,
      () => {
        setError('Failed to load Pixel. Please check your internet connection.');
        setLoading(false);
      }
    );

    // Animation Loop
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);

      const delta = clockRef.current.getDelta();

      if (mixerRef.current) {
        mixerRef.current.update(delta);
      }

      if (controlsRef.current) {
        controlsRef.current.update();
      }

      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };

    // Mouse move handler
    const handleMouseMove = (event: MouseEvent) => {
      if (!containerRef.current || !robotModelRef.current || !cameraRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);
      const intersects = raycasterRef.current.intersectObjects(robotModelRef.current.children, true);

      if (intersects.length > 0) {
        if (!isHoveringRef.current) {
          containerRef.current.style.cursor = 'pointer';
          isHoveringRef.current = true;
        }
      } else {
        if (isHoveringRef.current) {
          containerRef.current.style.cursor = 'default';
          isHoveringRef.current = false;
        }
      }
    };

    // Click handler - simplified
    const handleClick = (event: MouseEvent) => {
      if (!robotModelRef.current || !cameraRef.current || !containerRef.current) {
        onRobotClick();
        return;
      }

      // Calculate mouse position
      const rect = containerRef.current.getBoundingClientRect();
      mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      // Raycast to check if robot was clicked
      raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);
      const intersects = raycasterRef.current.intersectObjects(robotModelRef.current.children, true);
      
      event.stopPropagation();
      event.preventDefault();
      
      if (intersects.length > 0) {
        playOneShot('Wave');
      }
      
      onRobotClick();
    };

    // Add event listeners - wait for model to load
    const container = containerRef.current;
    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('click', handleClick);

    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;

      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;

      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      if (animationIdRef.current !== null) {
        cancelAnimationFrame(animationIdRef.current);
      }
      
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('click', handleClick);
      window.removeEventListener('resize', handleResize);
      
      if (controlsRef.current) {
        controlsRef.current.dispose();
      }
      
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
      
      if (containerRef.current && rendererRef.current?.domElement) {
        try {
          containerRef.current.removeChild(rendererRef.current.domElement);
        } catch (e) {
          // Silently ignore cleanup errors
        }
      }
      
      hasInitialized.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // EMPTY DEPENDENCIES - only run once on mount!

  // Animation control functions
  const fadeToAction = (name: string, duration: number) => {
    const actions = actionsRef.current;
    if (!actions[name]) return;

    const previousAction = activeActionRef.current;
    const activeAction = actions[name];

    if (previousAction && previousAction !== activeAction) {
      previousAction.fadeOut(duration);
    }

    activeAction
      .reset()
      .setEffectiveTimeScale(1)
      .setEffectiveWeight(1)
      .fadeIn(duration)
      .play();

    activeActionRef.current = activeAction;
  };

  const playOneShot = useCallback((name: string) => {
    const actions = actionsRef.current;
    if (!actions[name] || !mixerRef.current) return;
    
    // Prevent interrupting important animations
    if (isPlayingOneShotRef.current) return;
    isPlayingOneShotRef.current = true;
    
    // Get animation config (or defaults)
    const config = ANIMATION_CONFIG[name] || { speed: 1, loops: 1 };
    const speed = config.speed || 1;
    const loops = config.loops || 1;
    const expression = config.expression;
    
    // Set expression if specified
    if (expression) {
      setExpression(expression);
    }
    
    const action = actions[name];
    action.reset();
    action.setLoop(THREE.LoopRepeat, loops);
    action.setEffectiveTimeScale(speed);
    action.clampWhenFinished = true;
    
    const previousAction = activeActionRef.current;
    activeActionRef.current = action;
    
    if (previousAction) {
      previousAction.fadeOut(0.2);
    }
    action.fadeIn(0.2).play();

    // Track loop count for multi-loop animations
    let loopCount = 0;
    
    const handleLoop = () => {
      loopCount++;
      if (loopCount >= loops) {
        mixerRef.current?.removeEventListener('loop', handleLoop);
        action.setLoop(THREE.LoopOnce, 1);
      }
    };
    
    if (loops > 1) {
      mixerRef.current.addEventListener('loop', handleLoop);
    }

    // Return to idle after animation finishes
    const restoreIdle = () => {
      mixerRef.current?.removeEventListener('finished', restoreIdle);
      mixerRef.current?.removeEventListener('loop', handleLoop);
      isPlayingOneShotRef.current = false;
      
      // Reset expression to neutral (clear all)
      resetExpression();
      
      fadeToAction('Idle', 0.2);
    };
    
    mixerRef.current.addEventListener('finished', restoreIdle);
  }, [setExpression, resetExpression]);

  // Expose playAnimation method to parent via ref
  useImperativeHandle(ref, () => ({
    playAnimation: (name: string) => {
      playOneShot(name);
    }
  }), [playOneShot]);

  // Random idle animations
  useEffect(() => {
    if (!modelLoaded) return;
    
    const playRandomIdleAnimation = () => {
      // Only play random animation if not already playing something
      if (isPlayingOneShotRef.current) return;
      
      const randomAnim = IDLE_ANIMATIONS[Math.floor(Math.random() * IDLE_ANIMATIONS.length)];
      playOneShot(randomAnim);
    };

    // Start random idle animations after a delay
    idleIntervalRef.current = setInterval(playRandomIdleAnimation, IDLE_ANIMATION_INTERVAL);

    return () => {
      if (idleIntervalRef.current) {
        clearInterval(idleIntervalRef.current);
      }
    };
  }, [modelLoaded, playOneShot]);

  return (
    <div
      ref={containerRef}
      onClick={(e) => {
        e.stopPropagation();
        if (robotModelRef.current) {
          playOneShot('Wave');
        }
        onRobotClick();
      }}
      style={{
        width: '100%',
        height: '100%',
        minHeight: '500px',
        position: 'absolute',
        top: 0,
        left: 0,
        pointerEvents: 'auto',
        touchAction: 'pan-y',
        cursor: 'pointer',
        zIndex: 5,
      }}
    >
      {loading && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            zIndex: 10,
            color: isDarkMode ? '#90CAF9' : '#5C6BC0',
            pointerEvents: 'none',
          }}
        >
          <div
            style={{
              width: '50px',
              height: '50px',
              border: '5px solid rgba(144, 202, 249, 0.2)',
              borderTop: `5px solid ${isDarkMode ? '#90CAF9' : '#5C6BC0'}`,
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 20px',
            }}
          />
          <p style={{ fontWeight: 500, fontSize: '14px', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
            Loading AI Assistant...
          </p>
          <style>
            {`
              @keyframes spin {
                100% { transform: rotate(360deg); }
              }
            `}
          </style>
        </div>
      )}
      {error && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            color: '#ff6b6b',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            padding: '20px',
            borderRadius: '8px',
            maxWidth: '300px',
          }}
        >
          <p style={{ margin: 0, fontSize: '14px' }}>❌ {error}</p>
          <p style={{ margin: '10px 0 0 0', fontSize: '12px', opacity: 0.7 }}>
            Check console for details
          </p>
        </div>
      )}
    </div>
  );
});

Robot3D.displayName = 'Robot3D';

export default Robot3D;

