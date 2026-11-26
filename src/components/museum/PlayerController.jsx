import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import {
  PLAYER_EYE_HEIGHT,
  PLAYER_RADIUS,
  CURATOR_RADIUS,
  collidesWithWalls,
  getZoneName,
  getTerminalRoomId,
} from './museumLayout';

const MOVE_SPEED = 5.2;
const LOOK_SENSITIVITY = 0.0022;
const TOUCH_LOOK_SENSITIVITY = 0.0042;

const collidesWithScene = (x, z, radius, colliders, curatorPosRef) => {
  if (collidesWithWalls(x, z, radius, colliders)) {
    return true;
  }
  if (curatorPosRef?.current) {
    const dx = x - curatorPosRef.current.x;
    const dz = z - curatorPosRef.current.z;
    const minSep = radius + CURATOR_RADIUS;
    if (dx * dx + dz * dz < minSep * minSep) {
      return true;
    }
  }
  return false;
};

const PlayerController = ({
  colliders,
  curatorPosRef = null,
  isPaused = false,
  touchMoveRef = null,
  onZoneChange,
  onTerminalRoomChange,
  onPointerLockChange,
}) => {
  const { camera, gl } = useThree();
  const keysRef = useRef({});
  const yawRef = useRef(0);
  const pitchRef = useRef(0);
  const draggingRef = useRef(false);
  const touchLookRef = useRef(null);
  const isPausedRef = useRef(isPaused);
  const lastZoneRef = useRef('');
  const lastRoomRef = useRef(null);

  const forwardVec = useRef(new THREE.Vector3());
  const rightVec = useRef(new THREE.Vector3());
  const moveVec = useRef(new THREE.Vector3());

  useEffect(() => {
    isPausedRef.current = isPaused;
    if (isPaused) {
      keysRef.current = {};
      draggingRef.current = false;
      touchLookRef.current = null;
      if (document.pointerLockElement === gl.domElement && document.exitPointerLock) {
        document.exitPointerLock();
      }
    }
  }, [isPaused, gl]);

  useEffect(() => {
    camera.position.set(0, PLAYER_EYE_HEIGHT, 3.0);
    camera.rotation.order = 'YXZ';
    camera.rotation.set(0, 0, 0);
  }, [camera]);

  useEffect(() => {
    const dom = gl.domElement;

    const handleKeyDown = (e) => {
      if (isPausedRef.current) return;
      keysRef.current[e.code] = true;
    };

    const handleKeyUp = (e) => {
      keysRef.current[e.code] = false;
    };

    const handleMouseDown = (e) => {
      if (isPausedRef.current) return;
      // Skip mouse pointer-lock when touching or on coarse-pointer mobile screens
      if (touchLookRef.current || window.matchMedia?.('(pointer: coarse)').matches) return;
      if (e.button !== 0) return;
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
      if (isPausedRef.current) return;
      const isLocked = document.pointerLockElement === dom;
      if (!isLocked && !draggingRef.current) return;

      yawRef.current -= e.movementX * LOOK_SENSITIVITY;
      pitchRef.current = Math.max(
        -Math.PI / 2.3,
        Math.min(Math.PI / 2.3, pitchRef.current - e.movementY * LOOK_SENSITIVITY)
      );
    };

    const handleTouchStart = (e) => {
      if (isPausedRef.current || touchLookRef.current) return;
      draggingRef.current = false;
      const touch = e.changedTouches[0];
      if (!touch) return;
      touchLookRef.current = {
        id: touch.identifier,
        x: touch.clientX,
        y: touch.clientY,
      };
    };

    const handleTouchMove = (e) => {
      if (isPausedRef.current || !touchLookRef.current) return;
      for (let i = 0; i < e.changedTouches.length; i += 1) {
        const touch = e.changedTouches[i];
        if (touch.identifier === touchLookRef.current.id) {
          const dx = touch.clientX - touchLookRef.current.x;
          const dy = touch.clientY - touchLookRef.current.y;
          touchLookRef.current.x = touch.clientX;
          touchLookRef.current.y = touch.clientY;

          yawRef.current -= dx * TOUCH_LOOK_SENSITIVITY;
          pitchRef.current = Math.max(
            -Math.PI / 2.3,
            Math.min(Math.PI / 2.3, pitchRef.current - dy * TOUCH_LOOK_SENSITIVITY)
          );
          break;
        }
      }
    };

    const handleTouchEnd = (e) => {
      if (!touchLookRef.current) return;
      for (let i = 0; i < e.changedTouches.length; i += 1) {
        if (e.changedTouches[i].identifier === touchLookRef.current.id) {
          touchLookRef.current = null;
          break;
        }
      }
    };

    const handlePointerLockChange = () => {
      onPointerLockChange?.(document.pointerLockElement === dom);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('mouseup', handleMouseUp);
    dom.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    dom.addEventListener('touchstart', handleTouchStart, { passive: true });
    dom.addEventListener('touchmove', handleTouchMove, { passive: true });
    dom.addEventListener('touchend', handleTouchEnd, { passive: true });
    dom.addEventListener('touchcancel', handleTouchEnd, { passive: true });
    document.addEventListener('pointerlockchange', handlePointerLockChange);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('mouseup', handleMouseUp);
      dom.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      dom.removeEventListener('touchstart', handleTouchStart);
      dom.removeEventListener('touchmove', handleTouchMove);
      dom.removeEventListener('touchend', handleTouchEnd);
      dom.removeEventListener('touchcancel', handleTouchEnd);
      document.removeEventListener('pointerlockchange', handlePointerLockChange);
      if (document.pointerLockElement === dom && document.exitPointerLock) {
        document.exitPointerLock();
      }
    };
  }, [gl, onPointerLockChange]);

  useFrame((_, rawDelta) => {
    if (isPausedRef.current) return;

    const delta = Math.min(rawDelta, 0.05);

    // Apply camera look rotation
    camera.rotation.y = yawRef.current;
    camera.rotation.x = pitchRef.current;

    const keys = keysRef.current;
    const touchMove = touchMoveRef?.current;
    const keyForward = (keys.KeyW || keys.ArrowUp ? 1 : 0) - (keys.KeyS || keys.ArrowDown ? 1 : 0);
    const keyStrafe = (keys.KeyD || keys.ArrowRight ? 1 : 0) - (keys.KeyA || keys.ArrowLeft ? 1 : 0);
    const forwardInput = keyForward + (touchMove?.forward || 0);
    const strafeInput = keyStrafe + (touchMove?.strafe || 0);

    if (forwardInput !== 0 || strafeInput !== 0) {
      const inputMagnitude = Math.min(1, Math.hypot(forwardInput, strafeInput));
      forwardVec.current.set(-Math.sin(yawRef.current), 0, -Math.cos(yawRef.current)).normalize();
      rightVec.current.set(Math.cos(yawRef.current), 0, -Math.sin(yawRef.current)).normalize();

      moveVec.current
        .set(0, 0, 0)
        .addScaledVector(forwardVec.current, forwardInput)
        .addScaledVector(rightVec.current, strafeInput)
        .normalize()
        .multiplyScalar(MOVE_SPEED * inputMagnitude * delta);

      // Axis-separated sliding collision resolution (walls + live Curator)
      const nextX = camera.position.x + moveVec.current.x;
      if (!collidesWithScene(nextX, camera.position.z, PLAYER_RADIUS, colliders, curatorPosRef)) {
        camera.position.x = nextX;
      }

      const nextZ = camera.position.z + moveVec.current.z;
      if (!collidesWithScene(camera.position.x, nextZ, PLAYER_RADIUS, colliders, curatorPosRef)) {
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
