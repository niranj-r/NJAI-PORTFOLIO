'use client';
import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame, extend, useThree } from '@react-three/fiber';
import { MathUtils, Vector3, Color } from 'three';
import * as THREE from 'three';
import { Environment, Lightformer, Text } from '@react-three/drei';

// Extend the geometry to resolve the R3F warning
extend({ IcosahedronGeometry: THREE.IcosahedronGeometry });

const vertexShader = `
uniform float u_intensity;
uniform float u_time;

varying vec2 vUv;
varying float vDisplacement;

// Classic Perlin 3D Noise functions
vec4 permute(vec4 x) {
    return mod(((x*34.0)+1.0)*x, 289.0);
}

vec4 taylorInvSqrt(vec4 r) {
    return 1.79284291400159 - 0.85373472095314 * r;
}

vec3 fade(vec3 t) {
    return t*t*t*(t*(t*6.0-15.0)+10.0);
}

float cnoise(vec3 P) {
    vec3 Pi0 = floor(P);
    vec3 Pi1 = Pi0 + vec3(1.0);
    Pi0 = mod(Pi0, 289.0);
    Pi1 = mod(Pi1, 289.0);
    vec3 Pf0 = fract(P);
    vec3 Pf1 = Pf0 - vec3(1.0);
    vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
    vec4 iy = vec4(Pi0.yy, Pi1.yy);
    vec4 iz0 = Pi0.zzzz;
    vec4 iz1 = Pi1.zzzz;

    vec4 ixy = permute(permute(ix) + iy);
    vec4 ixy0 = permute(ixy + iz0);
    vec4 ixy1 = permute(ixy + iz1);

    vec4 gx0 = ixy0 / 7.0;
    vec4 gy0 = fract(floor(gx0) / 7.0) - 0.5;
    gx0 = fract(gx0);
    vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
    vec4 sz0 = step(gz0, vec4(0.0));
    gx0 -= sz0 * (step(0.0, gx0) - 0.5);
    gy0 -= sz0 * (step(0.0, gy0) - 0.5);

    vec4 gx1 = ixy1 / 7.0;
    vec4 gy1 = fract(floor(gx1) / 7.0) - 0.5;
    gx1 = fract(gx1);
    vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
    vec4 sz1 = step(gz1, vec4(0.0));
    gx1 -= sz1 * (step(0.0, gx1) - 0.5);
    gy1 -= sz1 * (step(0.0, gy1) - 0.5);

    vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
    vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
    vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
    vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
    vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
    vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
    vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
    vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

    vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
    g000 *= norm0.x;
    g010 *= norm0.y;
    g100 *= norm0.z;
    g110 *= norm0.w;
    vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
    g001 *= norm1.x;
    g011 *= norm1.y;
    g101 *= norm1.z;
    g111 *= norm1.w;

    float n000 = dot(g000, Pf0);
    float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
    float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
    float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
    float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
    float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
    float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
    float n111 = dot(g111, Pf1);

    vec3 fade_xyz = fade(Pf0);
    vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
    vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
    float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x); 
    return 2.2 * n_xyz;
}

void main() {
    vUv = uv;
    vDisplacement = cnoise(position + vec3(2.0 * u_time));
    vec3 newPosition = position + normal * (u_intensity * vDisplacement);
    vec4 modelPosition = modelMatrix * vec4(newPosition, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;
}
`;

const fragmentShader = `
uniform float u_intensity;
uniform float u_time;
uniform vec3 u_color;

varying vec2 vUv;
varying float vDisplacement;

void main() {
    float distort = 2.0 * vDisplacement * u_intensity * sin(vUv.y * 10.0 + u_time);
    vec3 color = mix(u_color, vec3(1.0, 1.0, 1.0), distort);
    gl_FragColor = vec4(color, 1.0);
}
`;

const Blob = () => {
  const mesh = useRef(null);

  const material = useMemo(() => {
    const mat = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        u_time: { value: 0 },
        u_intensity: { value: 0.3 },
        u_color: { value: new THREE.Color('#FF4D00') }, // Orange
      },
    });
    mat.stencilWrite = true;
    mat.stencilRef = 1;
    mat.stencilZPass = THREE.ReplaceStencilOp;
    return mat;
  }, []);

  const targetNorm = useRef(new Vector3(0, 0, 0));
  const currentPosition = useRef(new Vector3(0, 0, 0));

  // Track scale for showing/hiding on inactivity
  const targetScale = useRef(0);
  const currentScale = useRef(0);
  const timeoutRef = useRef(null);

  React.useEffect(() => {
    const handleMouseMove = (e) => {
      // Convert to -1 to 1
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = -(e.clientY / window.innerHeight) * 2 + 1;
      targetNorm.current.set(nx, ny, 0);

      // Show blob on movement
      targetScale.current = 1.0;

      // Hide blob after 3 seconds of inactivity
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        targetScale.current = 0;
      }, 3000);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  useFrame((state) => {
    const { clock, viewport } = state;

    if (mesh.current) {
      material.uniforms.u_time.value = 0.4 * clock.getElapsedTime();

      // Smoothly scale the blob (appear/disappear)
      currentScale.current = MathUtils.lerp(currentScale.current, targetScale.current, 0.05);
      mesh.current.scale.setScalar(currentScale.current);

      // Update target position based on normalized mouse over full screen
      const x = (targetNorm.current.x * viewport.width) / 2;
      const y = (targetNorm.current.y * viewport.height) / 2;

      const targetPos = new Vector3(x, y, 0);
      currentPosition.current.lerp(targetPos, 0.1);

      mesh.current.position.copy(currentPosition.current);
    }
  });

  return (
    <mesh
      ref={mesh}
      scale={1.0}
      position={[0, 0, 0]}
      renderOrder={1}
      material={material}
    >
      <icosahedronGeometry args={[1, 30]} />
    </mesh>
  );
};

const MaskedText = () => {
  const { viewport } = useThree();

  const textMaterial = useMemo(() => {
    const mat = new THREE.MeshBasicMaterial({ color: '#FFFCFA' });
    mat.stencilWrite = true;
    mat.stencilRef = 1;
    mat.stencilFunc = THREE.EqualStencilFunc;
    return mat;
  }, []);

  const isMobile = viewport.width < 5;
  
  // Responsive font size
  const fontSize = isMobile ? 0.2 : Math.max(0.18, viewport.width * 0.013);
  
  // Desktop: 32% max width to leave center space. Mobile: 80% to ensure 10% vw margins on both sides.
  const maxWidth = isMobile ? viewport.width * 0.80 : viewport.width * 0.32;

  // Bricolage Grotesque Light (300 weight)
  const fontUrl = "https://cdn.jsdelivr.net/npm/@fontsource/bricolage-grotesque/files/bricolage-grotesque-latin-300-normal.woff";

  return (
    <group>
      {/* Left Text Block */}
      <Text
        font={fontUrl}
        fontStyle="italic"
        position={isMobile 
          ? [0, viewport.height * 0.25, 1] 
          : [-viewport.width / 2 + viewport.width * 0.10, -viewport.height * 0.05, 1]}
        fontSize={fontSize}
        maxWidth={maxWidth}
        anchorX={isMobile ? "center" : "left"}
        anchorY="middle"
        textAlign={isMobile ? "center" : "left"}
        lineHeight={1.5}
        material={textMaterial}
        renderOrder={2}
      >
        {`Hey, I'm Niranj R.\n\nI'm a Computer Science student and a UI/UX Developer who enjoys creating digital experiences from both sides of the screen—designing how they feel and engineering how they work.\n\nOver the years, what started as curiosity turned into two separate brands that represent different parts of my journey.\n\nNjAi Designs is where I explore creativity. It's dedicated to UI/UX design, branding, visual identity, and crafting experiences that feel intuitive and memorable.`}
      </Text>
      
      {/* Right Text Block */}
      <Text
        font={fontUrl}
        fontStyle="italic"
        position={isMobile 
          ? [0, -viewport.height * 0.25, 1] 
          : [viewport.width / 2 - viewport.width * 0.10, -viewport.height * 0.25, 1]}
        fontSize={fontSize}
        maxWidth={maxWidth}
        anchorX={isMobile ? "center" : "right"}
        anchorY="middle"
        textAlign={isMobile ? "center" : "left"}
        lineHeight={1.5}
        material={textMaterial}
        renderOrder={2}
      >
        {`Code Infinity, on the other hand, is my development brand. It's where I build software, develop web applications, experiment with new technologies, and transform ideas into fully functional products.\n\nWhile both brands have different identities, they're connected by one purpose—creating products that people genuinely enjoy using.\n\nBeyond my personal work, I've been fortunate to contribute to communities like CSI, IEEE, IET, and Catalyst IEDC, where I've learned that the best ideas come from collaboration, curiosity, and continuous learning.\n\nWhether I'm sketching wireframes, designing interfaces, or writing thousands of lines of code, I'm always chasing the same goal: building products that solve real problems and leave a lasting impression.`}
      </Text>
    </group>
  );
};

export default function FluidBlobScene() {
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 10 }}>
      <Canvas camera={{ position: [0.0, 0.0, 8.0] }} gl={{ stencil: true }}>
        <Environment preset='studio' environmentIntensity={0.5} />
        <Blob />
        <MaskedText />
        <Environment
          files='https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/dancing_hall_1k.hdr'
          resolution={1024}
        >
          <group rotation={[-Math.PI / 3, 0, 0]}>
            <Lightformer
              intensity={4}
              rotation-x={Math.PI / 2}
              position={[0, 5, -9]}
              scale={[10, 10, 1]}
            />
            {[2, 0, 2, 0, 2, 0, 2, 0].map((x, i) => (
              <Lightformer
                key={i}
                form='circle'
                intensity={4}
                rotation={[Math.PI / 2, 0, 0]}
                position={[x, 4, i * 4]}
                scale={[4, 1, 1]}
              />
            ))}
            <Lightformer
              intensity={2}
              rotation-y={Math.PI / 2}
              position={[-5, 1, -1]}
              scale={[50, 2, 1]}
            />
            <Lightformer
              intensity={2}
              rotation-y={-Math.PI / 2}
              position={[10, 1, 0]}
              scale={[50, 2, 1]}
            />
          </group>
        </Environment>
      </Canvas>
    </div>
  );
}
