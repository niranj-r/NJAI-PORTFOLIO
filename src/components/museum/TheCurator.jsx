import React, { useMemo, useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { CURATOR_INTERACT_RADIUS, CURATOR_RADIUS, collidesWithWalls } from './museumLayout';

const HEAD_TRACK_RADIUS = 8.0;
const CURATOR_WALK_SPEED = 3.7;
const STOP_DISTANCE = 1.65;
const RESUME_DISTANCE = 1.75;
const WAYPOINT_SPACING = 0.65;
const MAX_WAYPOINTS = 80;

const normalizeAngle = (angle) => {
  let a = angle;
  while (a > Math.PI) a -= Math.PI * 2;
  while (a < -Math.PI) a += Math.PI * 2;
  return a;
};

/**
 * Checks whether the straight line between (x0, z0) and (x1, z1) is free of walls/obstacles.
 */
const hasLineOfSight = (x0, z0, x1, z1, colliders) => {
  const dx = x1 - x0;
  const dz = z1 - z0;
  const dist = Math.hypot(dx, dz);
  if (dist < 0.2) return true;

  const steps = Math.ceil(dist / 0.35);
  for (let i = 1; i <= steps; i += 1) {
    const t = i / steps;
    if (collidesWithWalls(x0 + dx * t, z0 + dz * t, CURATOR_RADIUS * 0.9, colliders)) {
      return false;
    }
  }
  return true;
};

/**
 * Procedurally generated 1.9m angular PS1-style humanoid NPC ("The Curator").
 * Moves toward the player along unobstructed sightlines or the player's breadcrumb trail
 * ONLY while the player is moving, stopping cleanly right before the player.
 */
const TheCurator = ({
  position = [2.2, 0, -2.0],
  defaultYaw = -0.68,
  colliders = [],
  curatorPosRef = null,
  isTalking = false,
  onNearChange,
  onInteract,
}) => {
  const { camera } = useThree();
  const rootRef = useRef(null);
  const pelvisRef = useRef(null);
  const torsoRef = useRef(null);
  const headRef = useRef(null);
  const leftShoulderRef = useRef(null);
  const leftElbowRef = useRef(null);
  const rightShoulderRef = useRef(null);
  const rightElbowRef = useRef(null);
  const leftHipRef = useRef(null);
  const leftKneeRef = useRef(null);
  const rightHipRef = useRef(null);
  const rightKneeRef = useRef(null);

  const wasNearRef = useRef(false);
  const bodyYawRef = useRef(defaultYaw);
  const posRef = useRef({ x: position[0], z: position[2] });
  const prevPlayerRef = useRef(null);
  const trailRef = useRef([]);
  const lastSightPosRef = useRef({ x: position[0], z: position[2] });
  const hasStoppedBeforePlayerRef = useRef(false);
  const walkBlendRef = useRef(0);
  const walkPhaseRef = useRef(0);

  // Low-poly faceted materials tuned for dark brutalist red lighting
  const materials = useMemo(() => {
    const suit = new THREE.MeshStandardMaterial({
      color: '#232327',
      roughness: 0.86,
      metalness: 0.08,
      flatShading: true,
    });
    const suitDark = new THREE.MeshStandardMaterial({
      color: '#17171A',
      roughness: 0.82,
      metalness: 0.12,
      flatShading: true,
    });
    const shirt = new THREE.MeshStandardMaterial({
      color: '#E2DDD3',
      roughness: 0.78,
      metalness: 0.04,
      flatShading: true,
    });
    const tie = new THREE.MeshStandardMaterial({
      color: '#111114',
      roughness: 0.56,
      metalness: 0.15,
      flatShading: true,
    });
    const shoe = new THREE.MeshStandardMaterial({
      color: '#121214',
      roughness: 0.45,
      metalness: 0.22,
      flatShading: true,
    });
    const mask = new THREE.MeshStandardMaterial({
      color: '#EFEAE0',
      emissive: '#1D1816',
      emissiveIntensity: 0.18,
      roughness: 0.3,
      metalness: 0.06,
      flatShading: true,
    });
    const hand = new THREE.MeshStandardMaterial({
      color: '#DCD6CA',
      roughness: 0.6,
      metalness: 0.05,
      flatShading: true,
    });
    return { suit, suitDark, shirt, tie, shoe, mask, hand };
  }, []);

  useEffect(() => {
    return () => {
      Object.values(materials).forEach((mat) => mat.dispose());
    };
  }, [materials]);

  useFrame(({ clock }, rawDelta) => {
    if (!rootRef.current) return;
    const delta = Math.min(rawDelta, 0.05);
    const t = clock.getElapsedTime();

    const px = camera.position.x;
    const pz = camera.position.z;

    if (!prevPlayerRef.current) {
      prevPlayerRef.current = { x: px, z: pz };
    }

    // Detect if the player moved in XZ this frame
    const pMoveDist = Math.hypot(px - prevPlayerRef.current.x, pz - prevPlayerRef.current.z);
    const playerIsMoving = !isTalking && delta > 0 && pMoveDist / delta > 0.05;
    prevPlayerRef.current.x = px;
    prevPlayerRef.current.z = pz;

    // Record breadcrumb trail whenever player advances cleanly
    if (playerIsMoving) {
      const trail = trailRef.current;
      const lastPt = trail[trail.length - 1];
      if (!lastPt || Math.hypot(px - lastPt.x, pz - lastPt.z) >= WAYPOINT_SPACING) {
        trail.push({ x: px, z: pz });
        if (trail.length > MAX_WAYPOINTS) {
          trail.shift();
        }
      }
    }

    const cx = posRef.current.x;
    const cz = posRef.current.z;
    const dx = px - cx;
    const dz = pz - cz;
    const dist = Math.hypot(dx, dz);

    const isNear = dist <= CURATOR_INTERACT_RADIUS;
    if (isNear !== wasNearRef.current) {
      wasNearRef.current = isNear;
      onNearChange?.(isNear);
    }

    // Hysteresis around STOP_DISTANCE so the Curator stops cleanly before the player
    if (dist <= STOP_DISTANCE) {
      hasStoppedBeforePlayerRef.current = true;
    } else if (dist >= RESUME_DISTANCE) {
      hasStoppedBeforePlayerRef.current = false;
    }

    let isWalking = false;
    let moveTargetX = px;
    let moveTargetZ = pz;

    const directSight = hasLineOfSight(cx, cz, px, pz, colliders);
    if (directSight) {
      lastSightPosRef.current.x = px;
      lastSightPosRef.current.z = pz;
    }

    if (playerIsMoving && !hasStoppedBeforePlayerRef.current) {
      const trail = trailRef.current;
      while (trail.length > 0 && Math.hypot(trail[0].x - cx, trail[0].z - cz) < 0.45) {
        trail.shift();
      }

      if (directSight) {
        moveTargetX = px;
        moveTargetZ = pz;
      } else if (trail.length > 0) {
        // Shortcut to the furthest visible breadcrumb so turns stay smooth
        let bestIdx = 0;
        for (let i = trail.length - 1; i >= 1; i -= 1) {
          if (hasLineOfSight(cx, cz, trail[i].x, trail[i].z, colliders)) {
            bestIdx = i;
            break;
          }
        }
        if (bestIdx > 0) {
          trail.splice(0, bestIdx);
        }
        moveTargetX = trail[0].x;
        moveTargetZ = trail[0].z;
      } else {
        moveTargetX = lastSightPosRef.current.x;
        moveTargetZ = lastSightPosRef.current.z;
      }

      const tx = moveTargetX - cx;
      const tz = moveTargetZ - cz;
      const targetDist = Math.hypot(tx, tz);

      if (targetDist > 0.01) {
        // Never step closer than STOP_DISTANCE to the player
        const maxStep =
          moveTargetX === px && moveTargetZ === pz
            ? Math.max(0, dist - STOP_DISTANCE)
            : CURATOR_WALK_SPEED * delta;
        const step = Math.min(CURATOR_WALK_SPEED * delta, maxStep);

        if (step > 0.001) {
          const dirX = tx / targetDist;
          const dirZ = tz / targetDist;
          const nextX = cx + dirX * step;
          const nextZ = cz + dirZ * step;

          let moved = false;
          if (!collidesWithWalls(nextX, posRef.current.z, CURATOR_RADIUS, colliders)) {
            posRef.current.x = nextX;
            moved = true;
          }
          if (!collidesWithWalls(posRef.current.x, nextZ, CURATOR_RADIUS, colliders)) {
            posRef.current.z = nextZ;
            moved = true;
          }
          isWalking = moved;
        }
      }
    }

    rootRef.current.position.set(posRef.current.x, 0, posRef.current.z);
    if (curatorPosRef?.current) {
      curatorPosRef.current.x = posRef.current.x;
      curatorPosRef.current.z = posRef.current.z;
    }

    // Smoothly blend walking stride in/out so stops look grounded and immediate
    walkBlendRef.current = THREE.MathUtils.lerp(
      walkBlendRef.current,
      isWalking ? 1 : 0,
      Math.min(1, delta * (isWalking ? 9.0 : 12.0))
    );
    if (walkBlendRef.current > 0.01) {
      walkPhaseRef.current += delta * 6.8;
    }

    const wb = walkBlendRef.current;
    const stride = Math.sin(walkPhaseRef.current) * wb;
    const bob = Math.abs(Math.cos(walkPhaseRef.current)) * wb;

    // 1. Body yaw: turn towards movement target while walking, or towards player when facing them
    const faceDx = isWalking ? moveTargetX - posRef.current.x : px - posRef.current.x;
    const faceDz = isWalking ? moveTargetZ - posRef.current.z : pz - posRef.current.z;
    const angleToTarget = Math.atan2(faceDx, faceDz);
    const angleToPlayer = Math.atan2(px - posRef.current.x, pz - posRef.current.z);
    const yawDiff = normalizeAngle(angleToTarget - bodyYawRef.current);
    bodyYawRef.current += yawDiff * Math.min(1, delta * (isWalking ? 6.0 : isTalking ? 4.0 : 2.6));
    rootRef.current.rotation.y = bodyYawRef.current;

    // 2. Breathing, stride bob & leg articulation
    const breath = Math.sin(t * 1.65);
    const slowShift = Math.sin(t * 0.65) * (1 - wb);

    if (pelvisRef.current) {
      pelvisRef.current.position.y = 0.94 + bob * 0.026 + breath * 0.006 * (1 - wb);
      pelvisRef.current.rotation.z = slowShift * 0.014;
    }

    if (torsoRef.current) {
      torsoRef.current.rotation.x = 0.02 + wb * 0.05 + breath * 0.012;
      torsoRef.current.scale.set(1 + breath * 0.01, 1, 1 + breath * 0.014);
    }

    if (leftHipRef.current && rightHipRef.current && leftKneeRef.current && rightKneeRef.current) {
      leftHipRef.current.rotation.x = -stride * 0.42;
      rightHipRef.current.rotation.x = stride * 0.42;
      leftHipRef.current.rotation.z = -slowShift * 0.015;
      rightHipRef.current.rotation.z = -slowShift * 0.015;
      leftKneeRef.current.rotation.x = Math.max(0, stride) * 0.46;
      rightKneeRef.current.rotation.x = Math.max(0, -stride) * 0.46;
    }

    // 3. Head tracking towards player eye height
    if (headRef.current) {
      let targetHeadYaw = 0;
      let targetHeadPitch = 0;

      if (dist < HEAD_TRACK_RADIUS || isTalking) {
        const relYaw = normalizeAngle(angleToPlayer - bodyYawRef.current);
        targetHeadYaw = THREE.MathUtils.clamp(relYaw, -0.68, 0.68);
        const eyeDeltaY = camera.position.y - 1.76;
        targetHeadPitch = THREE.MathUtils.clamp(-Math.atan2(eyeDeltaY, Math.max(0.8, dist)), -0.3, 0.25);
      } else {
        targetHeadYaw = Math.sin(t * 0.42) * 0.1 * (1 - wb);
      }

      headRef.current.rotation.y = THREE.MathUtils.lerp(
        headRef.current.rotation.y,
        targetHeadYaw,
        Math.min(1, delta * 5.0)
      );
      headRef.current.rotation.x = THREE.MathUtils.lerp(
        headRef.current.rotation.x,
        targetHeadPitch + breath * 0.015,
        Math.min(1, delta * 5.0)
      );
    }

    // 4. Arm swing while walking + idle/talking docent gestures when stopped
    const gestureCycle = (t * 0.55) % (Math.PI * 2);
    const idlePulse = Math.max(0, Math.sin(t * 0.58 - 0.8));
    const gestureWeight =
      (isTalking ? 0.45 + 0.35 * Math.sin(t * 1.9) : Math.pow(idlePulse, 4) * 0.85) * (1 - wb);

    if (rightShoulderRef.current && rightElbowRef.current) {
      const idleRShoulderX = -0.06 - gestureWeight * 0.34 + breath * 0.015;
      const walkRShoulderX = -stride * 0.3;
      const targetRShoulderX = THREE.MathUtils.lerp(idleRShoulderX, walkRShoulderX, wb);
      const targetRShoulderZ = -0.08 - gestureWeight * 0.08;
      const idleRElbowX = -0.18 - gestureWeight * 0.72 + Math.sin(gestureCycle) * gestureWeight * 0.1;
      const walkRElbowX = -0.22 - Math.max(0, stride) * 0.2;
      const targetRElbowX = THREE.MathUtils.lerp(idleRElbowX, walkRElbowX, wb);

      rightShoulderRef.current.rotation.x = THREE.MathUtils.lerp(
        rightShoulderRef.current.rotation.x,
        targetRShoulderX,
        Math.min(1, delta * 5.5)
      );
      rightShoulderRef.current.rotation.z = THREE.MathUtils.lerp(
        rightShoulderRef.current.rotation.z,
        targetRShoulderZ,
        Math.min(1, delta * 4.5)
      );
      rightElbowRef.current.rotation.x = THREE.MathUtils.lerp(
        rightElbowRef.current.rotation.x,
        targetRElbowX,
        Math.min(1, delta * 5.5)
      );
    }

    if (leftShoulderRef.current && leftElbowRef.current) {
      const talkLeft = isTalking ? 0.25 + 0.2 * Math.cos(t * 1.45) : 0;
      const idleLShoulderX = 0.04 - talkLeft * 0.22 - breath * 0.015;
      const walkLShoulderX = stride * 0.3;
      const idleLElbowX = -0.14 - talkLeft * 0.48;
      const walkLElbowX = -0.22 - Math.max(0, -stride) * 0.2;

      leftShoulderRef.current.rotation.x = THREE.MathUtils.lerp(
        leftShoulderRef.current.rotation.x,
        THREE.MathUtils.lerp(idleLShoulderX, walkLShoulderX, wb),
        Math.min(1, delta * 5.5)
      );
      leftShoulderRef.current.rotation.z = 0.07 + breath * 0.008;
      leftElbowRef.current.rotation.x = THREE.MathUtils.lerp(
        leftElbowRef.current.rotation.x,
        THREE.MathUtils.lerp(idleLElbowX, walkLElbowX, wb),
        Math.min(1, delta * 5.5)
      );
    }
  });

  const handlePointerInteract = (e) => {
    e.stopPropagation();
    if (wasNearRef.current) {
      onInteract?.();
    }
  };

  // Total height ~1.90m: Pelvis pivot at y=0.94 -> Torso/Neck/Head reach y≈1.90
  return (
    <group
      ref={rootRef}
      position={position}
      rotation={[0, defaultYaw, 0]}
      onClick={handlePointerInteract}
    >
      {/* Pelvis Root (y = 0.94m) */}
      <group ref={pelvisRef} position={[0, 0.94, 0]}>
        {/* Tailored Suit Waist / Pelvis */}
        <mesh position={[0, 0, 0]} scale={[1.0, 1.0, 0.62]} material={materials.suit} castShadow>
          <cylinderGeometry args={[0.145, 0.135, 0.15, 8]} />
        </mesh>

        {/* Left Leg (0.94 -> 0.00m) */}
        <group ref={leftHipRef} position={[-0.088, -0.04, 0]}>
          {/* Thigh */}
          <mesh position={[0, -0.22, 0]} scale={[1.0, 1.0, 0.94]} material={materials.suit} castShadow>
            <cylinderGeometry args={[0.076, 0.058, 0.44, 7]} />
          </mesh>
          {/* Articulated Knee -> Shin + Formal Dress Shoe */}
          <group ref={leftKneeRef} position={[0, -0.44, 0]}>
            <mesh position={[0, -0.2, 0]} material={materials.suit} castShadow>
              <cylinderGeometry args={[0.057, 0.042, 0.42, 7]} />
            </mesh>
            <mesh position={[0, -0.425, 0.045]} material={materials.shoe} castShadow>
              <boxGeometry args={[0.086, 0.07, 0.22]} />
            </mesh>
          </group>
        </group>

        {/* Right Leg (0.94 -> 0.00m) */}
        <group ref={rightHipRef} position={[0.088, -0.04, 0]}>
          {/* Thigh */}
          <mesh position={[0, -0.22, 0]} scale={[1.0, 1.0, 0.94]} material={materials.suit} castShadow>
            <cylinderGeometry args={[0.076, 0.058, 0.44, 7]} />
          </mesh>
          {/* Articulated Knee -> Shin + Formal Dress Shoe */}
          <group ref={rightKneeRef} position={[0, -0.44, 0]}>
            <mesh position={[0, -0.2, 0]} material={materials.suit} castShadow>
              <cylinderGeometry args={[0.057, 0.042, 0.42, 7]} />
            </mesh>
            <mesh position={[0, -0.425, 0.045]} material={materials.shoe} castShadow>
              <boxGeometry args={[0.086, 0.07, 0.22]} />
            </mesh>
          </group>
        </group>

        {/* Articulated Upper Torso / Formal Suit Jacket (y = 0.99 -> 1.56m) */}
        <group ref={torsoRef} position={[0, 0.07, 0]}>
          {/* Suit Coat Skirt / Lower Jacket */}
          <mesh position={[0, -0.05, -0.005]} scale={[1.0, 1.0, 0.56]} material={materials.suit} castShadow>
            <cylinderGeometry args={[0.145, 0.16, 0.2, 8]} />
          </mesh>

          {/* Tapered Ribcage & Broad Shoulders */}
          <mesh position={[0, 0.26, 0]} scale={[1.0, 1.0, 0.52]} material={materials.suit} castShadow>
            <cylinderGeometry args={[0.215, 0.142, 0.52, 8]} />
          </mesh>

          {/* White Dress Shirt V-Front */}
          <mesh position={[0, 0.35, 0.078]} rotation={[0.08, 0, 0]} material={materials.shirt}>
            <coneGeometry args={[0.078, 0.34, 4]} />
          </mesh>

          {/* White Shirt Collar */}
          <mesh position={[0, 0.525, 0.012]} material={materials.shirt}>
            <cylinderGeometry args={[0.064, 0.07, 0.05, 8]} />
          </mesh>

          {/* Suit Jacket Lapels (Left & Right) */}
          <mesh
            position={[-0.062, 0.35, 0.088]}
            rotation={[0.08, 0.18, -0.22]}
            material={materials.suitDark}
          >
            <boxGeometry args={[0.045, 0.34, 0.025]} />
          </mesh>
          <mesh
            position={[0.062, 0.35, 0.088]}
            rotation={[0.08, -0.18, 0.22]}
            material={materials.suitDark}
          >
            <boxGeometry args={[0.045, 0.34, 0.025]} />
          </mesh>

          {/* Black Tie Knot & Narrow Blade */}
          <mesh position={[0, 0.485, 0.102]} material={materials.tie}>
            <octahedronGeometry args={[0.024, 0]} />
          </mesh>
          <mesh position={[0, 0.32, 0.104]} rotation={[0.07, 0, 0]} material={materials.tie}>
            <boxGeometry args={[0.032, 0.3, 0.016]} />
          </mesh>

          {/* Neck & Faceted Head + Porcelain Mask (y = 1.56 -> 1.90m) */}
          <group position={[0, 0.54, 0]}>
            <mesh position={[0, 0.045, 0]} material={materials.suitDark}>
              <cylinderGeometry args={[0.046, 0.054, 0.1, 7]} />
            </mesh>

            <group ref={headRef} position={[0, 0.185, 0.01]}>
              {/* Dark Charcoal Low-Poly Cranium */}
              <mesh scale={[0.88, 1.15, 0.96]} material={materials.suitDark} castShadow>
                <icosahedronGeometry args={[0.115, 1]} />
              </mesh>

              {/* Featureless Off-White Porcelain Mask */}
              <mesh position={[0, -0.005, 0.046]} scale={[0.84, 1.12, 0.58]} material={materials.mask} castShadow>
                <icosahedronGeometry args={[0.112, 1]} />
              </mesh>
              {/* Chin Taper Accent on Mask */}
              <mesh
                position={[0, -0.075, 0.058]}
                rotation={[Math.PI, 0, 0]}
                scale={[0.82, 1.0, 0.55]}
                material={materials.mask}
              >
                <coneGeometry args={[0.07, 0.09, 6]} />
              </mesh>
            </group>
          </group>

          {/* Left Articulated Arm */}
          <group ref={leftShoulderRef} position={[-0.228, 0.47, 0]}>
            <mesh material={materials.suit} castShadow>
              <icosahedronGeometry args={[0.056, 0]} />
            </mesh>
            {/* Upper Arm */}
            <mesh position={[0, -0.155, 0]} material={materials.suit} castShadow>
              <cylinderGeometry args={[0.052, 0.042, 0.31, 7]} />
            </mesh>
            {/* Forearm + Cuff + Hand */}
            <group ref={leftElbowRef} position={[0, -0.31, 0]}>
              <mesh position={[0, -0.14, 0]} material={materials.suit} castShadow>
                <cylinderGeometry args={[0.041, 0.032, 0.28, 7]} />
              </mesh>
              {/* White Shirt Cuff */}
              <mesh position={[0, -0.285, 0]} material={materials.shirt}>
                <cylinderGeometry args={[0.034, 0.031, 0.025, 7]} />
              </mesh>
              {/* Tapered Hand */}
              <mesh position={[0, -0.345, 0.01]} scale={[0.65, 1.3, 0.9]} material={materials.hand}>
                <octahedronGeometry args={[0.042, 0]} />
              </mesh>
            </group>
          </group>

          {/* Right Articulated Arm */}
          <group ref={rightShoulderRef} position={[0.228, 0.47, 0]}>
            <mesh material={materials.suit} castShadow>
              <icosahedronGeometry args={[0.056, 0]} />
            </mesh>
            {/* Upper Arm */}
            <mesh position={[0, -0.155, 0]} material={materials.suit} castShadow>
              <cylinderGeometry args={[0.052, 0.042, 0.31, 7]} />
            </mesh>
            {/* Forearm + Cuff + Hand */}
            <group ref={rightElbowRef} position={[0, -0.31, 0]}>
              <mesh position={[0, -0.14, 0]} material={materials.suit} castShadow>
                <cylinderGeometry args={[0.041, 0.032, 0.28, 7]} />
              </mesh>
              {/* White Shirt Cuff */}
              <mesh position={[0, -0.285, 0]} material={materials.shirt}>
                <cylinderGeometry args={[0.034, 0.031, 0.025, 7]} />
              </mesh>
              {/* Tapered Hand */}
              <mesh position={[0, -0.345, 0.01]} scale={[0.65, 1.3, 0.9]} material={materials.hand}>
                <octahedronGeometry args={[0.042, 0]} />
              </mesh>
            </group>
          </group>
        </group>
      </group>
    </group>
  );
};

export default TheCurator;
