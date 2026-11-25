import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { PLAYER_EYE_HEIGHT, PLAYER_RADIUS, getZoneName, getTerminalRoomId } from './museumLayout';

const MOVE_SPEED = 5.2;
const LOOK_SENSITIVITY = 0.0022;

const collidesWithWalls = (x, z, radius, colliders) => {
  for (let i = 0; i < colliders.length; i += 1) {
    const box = colliders[i];
    const closestX = Math.max(box.minX, Math.min(x, box.maxX));
    const closestZ = Math.max(box.minZ, Math.min(z, box.maxZ));
    const dx = x - closestX;
    const dz = z - closestZ;
    if (dx * dx + dz * dz < radius * radius) {
      return true;
    }
  }
  return false;
};

const NPC_INTERACT_RADIUS = 4.2;

const PlayerController = ({
  colliders,
  npcPosition,
  isChatOpen = false,
  onZoneChange,
  onTerminalRoomChange,
  onPointerLockChange,
  onNearNpcChange,
}) => {
  const { camera, gl } = useThree();
  const keysRef = useRef({});
  const yawRef = useRef(0);
  const pitchRef = useRef(0);
  const draggingRef = useRef(false);
  const lastZoneRef = useRef('');
  const lastRoomRef = useRef(null);
  const lastNearNpcRef = useRef(null);
  const isChatOpenRef = useRef(isChatOpen);

  const forwardVec = useRef(new THREE.Vector3());
  const rightVec = useRef(new THREE.Vector3());
  const moveVec = useRef(new THREE.Vector3());

  useEffect(() => {
    isChatOpenRef.current = isChatOpen;
    if (isChatOpen) {
      keysRef.current = {};
      draggingRef.current = false;
      if (document.pointerLockElement === gl.domElement && document.exitPointerLock) {
        document.exitPointerLock();
      }
    }
  }, [isChatOpen, gl]);

  useEffect(() => {
    camera.position.set(0, PLAYER_EYE_HEIGHT, 3.0);
    camera.rotation.order = 'YXZ';
    camera.rotation.set(0, 0, 0);
  }, [camera]);

  useEffect(() => {
    const dom = gl.domElement;

    const handleKeyDown = (e) => {
      if (isChatOpenRef.current) return;
      keysRef.current[e.code] = true;
    };

    const handleKeyUp = (e) => {
      keysRef.current[e.code] = false;
    };

    const handleMouseDown = () => {
      if (isChatOpenRef.current) return;
      draggingRef.current = true;
      if (document.pointerLockElement !== dom && dom.requestPointerLock) {
        try {
          dom.requestPointerLock();
        } catch (err) {
          // Pointer lock may be blocked in some contexts; drag-to-look remains active
        }
      }
    };

    const handleMouseUp = () => {
      draggingRef.current = false;
    };

    const handleMouseMove = (e) => {
      if (isChatOpenRef.current) return;
      const isLocked = document.pointerLockElement === dom;
      if (!isLocked && !draggingRef.current) return;

      yawRef.current -= e.movementX * LOOK_SENSITIVITY;
      pitchRef.current = Math.max(
        -Math.PI / 2.3,
        Math.min(Math.PI / 2.3, pitchRef.current - e.movementY * LOOK_SENSITIVITY)
      );
    };

    const handlePointerLockChange = () => {
      onPointerLockChange?.(document.pointerLockElement === dom);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('mouseup', handleMouseUp);
    dom.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('pointerlockchange', handlePointerLockChange);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('mouseup', handleMouseUp);
      dom.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('pointerlockchange', handlePointerLockChange);
      if (document.pointerLockElement === dom && document.exitPointerLock) {
        document.exitPointerLock();
      }
    };
  }, [gl, onPointerLockChange]);

  useFrame((_, rawDelta) => {
    const delta = Math.min(rawDelta, 0.05);

    // Apply camera look rotation
    camera.rotation.y = yawRef.current;
    camera.rotation.x = pitchRef.current;

    if (npcPosition) {
      const dx = camera.position.x - npcPosition.x;
      const dz = camera.position.z - npcPosition.z;
      const isNear = dx * dx + dz * dz <= NPC_INTERACT_RADIUS * NPC_INTERACT_RADIUS;
      if (isNear !== lastNearNpcRef.current) {
        lastNearNpcRef.current = isNear;
        onNearNpcChange?.(isNear);
      }
    }

    if (isChatOpenRef.current) return;

    const keys = keysRef.current;
    const forwardInput = (keys.KeyW || keys.ArrowUp ? 1 : 0) - (keys.KeyS || keys.ArrowDown ? 1 : 0);
    const strafeInput = (keys.KeyD || keys.ArrowRight ? 1 : 0) - (keys.KeyA || keys.ArrowLeft ? 1 : 0);

    if (forwardInput !== 0 || strafeInput !== 0) {
      forwardVec.current.set(-Math.sin(yawRef.current), 0, -Math.cos(yawRef.current)).normalize();
      rightVec.current.set(Math.cos(yawRef.current), 0, -Math.sin(yawRef.current)).normalize();

      moveVec.current
        .set(0, 0, 0)
        .addScaledVector(forwardVec.current, forwardInput)
        .addScaledVector(rightVec.current, strafeInput)
        .normalize()
        .multiplyScalar(MOVE_SPEED * delta);

      // Axis-separated sliding collision resolution
      const nextX = camera.position.x + moveVec.current.x;
      if (!collidesWithWalls(nextX, camera.position.z, PLAYER_RADIUS, colliders)) {
        camera.position.x = nextX;
      }

      const nextZ = camera.position.z + moveVec.current.z;
      if (!collidesWithWalls(camera.position.x, nextZ, PLAYER_RADIUS, colliders)) {
        camera.position.z = nextZ;
      }

      const zone = getZoneName(camera.position.x, camera.position.z);
      if (zone !== lastZoneRef.current) {
        lastZoneRef.current = zone;
        onZoneChange?.(zone);
      }

      const terminalRoom = getTerminalRoomId(camera.position.x, camera.position.z);
      if (terminalRoom !== lastRoomRef.current) {
        lastRoomRef.current = terminalRoom;
        onTerminalRoomChange?.(terminalRoom);
      }
    }
  });

  return null;
};

export default PlayerController;
