import React, { useMemo, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { buildMuseumLayout, PLAYER_EYE_HEIGHT, CURATOR_POSITION } from './museumLayout';
import { useMuseumMaterials } from './useMuseumMaterials';
import {
  RoomSurface,
  WallSegment,
  CorridorArch,
  PictureFrame,
  Pedestal,
  CeilingFluorescent,
  EmergencyBeacon,
  CeilingConduit,
  DoorwaySpotlight,
  WallInscription,
} from './ArchitecturalParts';
import PlayerController from './PlayerController';
import TheCurator from './TheCurator';

const MuseumWorld = ({
  activeTerminalRoom,
  isDialogueOpen,
  touchMoveRef,
  onZoneChange,
  onTerminalRoomChange,
  onPointerLockChange,
  onCuratorNearChange,
  onCuratorInteract,
}) => {
  const layout = useMemo(() => buildMuseumLayout(), []);
  const materials = useMuseumMaterials();
  const curatorPosRef = useRef({ x: CURATOR_POSITION.x, z: CURATOR_POSITION.z });

  return (
    <>
      <color attach="background" args={['#140F0E']} />
      <fogExp2 attach="fog" args={['#140F0E', 0.045]} />

      {/* Low Dark Ambient + Subtle Cool/Warm Occlusion Fill */}
      <ambientLight intensity={0.1} color="#7A7670" />
      <hemisphereLight args={['#3A3A36', '#161010', 0.18]} />

      {/* Soft Grazing Architectural Fill */}
      <directionalLight
        position={[12, 24, 14]}
        intensity={0.22}
        color="#B8B4AC"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0005}
        shadow-camera-left={-45}
        shadow-camera-right={45}
        shadow-camera-top={45}
        shadow-camera-bottom={-45}
      />

      {/* Rich Red Doorway Lights & Warm-White Fluorescent Contrast */}
      {layout.lights.map((light, idx) => (
        <pointLight
          key={`light-${idx}`}
          position={[light.x, light.y, light.z]}
          color={light.color}
          intensity={light.intensity}
          distance={light.distance || 16}
          decay={light.decay || 1.4}
        />
      ))}

      {/* Connected Floors & Ceilings */}
      {layout.slabs.map((slab, idx) => (
        <RoomSurface
          key={`slab-${idx}`}
          {...slab}
          floorMaterial={materials.floorMaterial}
          ceilingMaterial={materials.ceilingMaterial}
        />
      ))}

      {/* Walls & Doorway Headers */}
      {layout.walls.map((wall, idx) => (
        <WallSegment
          key={`wall-${idx}`}
          {...wall}
          material={materials.wallMaterial}
        />
      ))}

      {/* Repeating Architectural Elements (Left Corridor) */}
      {layout.arches.map((arch, idx) => (
        <CorridorArch
          key={`arch-${idx}`}
          {...arch}
          wallMaterial={materials.wallMaterial}
          borderMaterial={materials.frameBorderMaterial}
        />
      ))}

      {/* Picture Frames + Dedicated Ceiling Spotlights */}
      {layout.frames.map((frame, idx) => (
        <PictureFrame
          key={`frame-${idx}`}
          {...frame}
          borderMaterial={materials.frameBorderMaterial}
          canvasMaterial={materials.frameCanvasMaterial}
          spotLensMaterial={materials.warmEmissiveMaterial}
        />
      ))}

      {/* Gallery Plinths & Terminal Pedestals */}
      {layout.pedestals.map((ped, idx) => (
        <Pedestal
          key={`ped-${idx}`}
          {...ped}
          material={materials.detailMaterial}
        />
      ))}

      {/* Recessed Red Fluorescent Fixtures */}
      {layout.fluorescents.map((fix, idx) => (
        <CeilingFluorescent
          key={`fluo-${idx}`}
          {...fix}
          housingMaterial={materials.frameBorderMaterial}
          emissiveMaterial={materials.redEmissiveMaterial}
        />
      ))}

      {/* Red Emergency Doorway & Corner Beacons */}
      {layout.beacons.map((beacon, idx) => (
        <EmergencyBeacon
          key={`beacon-${idx}`}
          {...beacon}
          housingMaterial={materials.frameBorderMaterial}
          emissiveMaterial={materials.redEmissiveMaterial}
        />
      ))}

      {/* Ceiling-Mounted Red Doorway Spotlights */}
      {layout.doorwaySpots.map((spot, idx) => (
        <DoorwaySpotlight
          key={`door-spot-${idx}`}
          {...spot}
          housingMaterial={materials.frameBorderMaterial}
          emissiveMaterial={materials.redEmissiveMaterial}
        />
      ))}

      {/* Overhead Brutalist Ceiling Conduits */}
      {layout.conduits.map((pipe, idx) => (
        <CeilingConduit
          key={`pipe-${idx}`}
          {...pipe}
          material={materials.pipeMaterial}
        />
      ))}

      {/* Physical 3D Wall Inscriptions (404 revealed upon entering terminal room) */}
      {layout.inscriptions.map((insc, idx) => (
        <WallInscription
          key={`insc-${idx}`}
          {...insc}
          revealed={activeTerminalRoom === insc.roomId}
        />
      ))}

      {/* Procedural 3D NPC: The Curator */}
      <TheCurator
        position={[CURATOR_POSITION.x, 0, CURATOR_POSITION.z]}
        colliders={layout.colliders}
        curatorPosRef={curatorPosRef}
        isTalking={isDialogueOpen}
        onNearChange={onCuratorNearChange}
        onInteract={onCuratorInteract}
      />

      {/* First-Person Movement & Collision (Preserved) */}
      <PlayerController
        colliders={layout.colliders}
        curatorPosRef={curatorPosRef}
        isPaused={isDialogueOpen}
        touchMoveRef={touchMoveRef}
        onZoneChange={onZoneChange}
        onTerminalRoomChange={onTerminalRoomChange}
        onPointerLockChange={onPointerLockChange}
      />
    </>
  );
};

const MuseumScene = ({
  activeTerminalRoom,
  isDialogueOpen = false,
  touchMoveRef = null,
  onSceneReady,
  onZoneChange,
  onTerminalRoomChange,
  onPointerLockChange,
  onCuratorNearChange,
  onCuratorInteract,
}) => (
  <Canvas
    shadows
    dpr={[1, 1.25]}
    camera={{
      position: [0, PLAYER_EYE_HEIGHT, 3.0],
      fov: 65,
      near: 0.1,
      far: 90,
    }}
    onCreated={() => onSceneReady?.()}
  >
    <MuseumWorld
      activeTerminalRoom={activeTerminalRoom}
      isDialogueOpen={isDialogueOpen}
      touchMoveRef={touchMoveRef}
      onZoneChange={onZoneChange}
      onTerminalRoomChange={onTerminalRoomChange}
      onPointerLockChange={onPointerLockChange}
      onCuratorNearChange={onCuratorNearChange}
      onCuratorInteract={onCuratorInteract}
    />
  </Canvas>
);

export default MuseumScene;
