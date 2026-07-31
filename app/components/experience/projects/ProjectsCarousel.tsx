import { useRef, useMemo, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { isMobile } from "react-device-detect";
import * as THREE from "three";
import ProjectTile from "./ProjectTile";

import { PROJECTS } from "@constants";
import { usePortalStore } from "@stores";

/**
 * Card dimensions from ProjectTile.tsx:
 *   CARD_WIDTH = 5.4 units
 *   CARD_HEIGHT = 2.45 units
 *
 * We need each adjacent pair of cards to have enough chord-distance
 * so they never overlap. Minimum chord = CARD_WIDTH + gap.
 *
 * chord = 2 * R * sin(angleStep / 2)
 * We want chord >= 5.4 + 1.2 (gap) = 6.6
 *
 * With 4 cards and a comfortable arc, we use:
 *   R = 18, totalArc = 100° (1.745 rad)
 *   angleStep = 100° / 3 = 33.3°
 *   chord = 2 * 18 * sin(16.67°) = 36 * 0.287 = 10.33 ✓ (well spaced)
 */

const CARD_WIDTH = 5.4;
const GAP = 1.2;
const ARC_RADIUS = 18;

const ProjectsCarousel = () => {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const isActive = usePortalStore((state) => state.activePortalId === "projects");
  const activeId = isActive ? selectedId : null;
  const groupRef = useRef<THREE.Group>(null);
  const { camera } = useThree();

  const onClick = (id: number) => {
    if (!isMobile) return;
    setSelectedId(id === selectedId ? null : id);
  };

  // Calculate the minimum angular step needed so cards don't overlap
  const arcData = useMemo(() => {
    const count = PROJECTS.length;
    const minChord = CARD_WIDTH + GAP; // 6.6
    // angleStep = 2 * arcsin(minChord / (2 * R))
    const angleStep = 2 * Math.asin(minChord / (2 * ARC_RADIUS));
    // Center the cards around angle=0
    const totalArc = angleStep * (count - 1);
    const startAngle = -totalArc / 2;

    return PROJECTS.map((_, i) => {
      const angle = startAngle + i * angleStep;
      // Position on the arc — arc center is behind the camera
      // Camera is at roughly z=11.5, so place arc center at z = 11.5 + R
      // and cards at z = center - R*cos(angle)
      const x = Math.sin(angle) * ARC_RADIUS;
      const z = ARC_RADIUS * (1 - Math.cos(angle)) - 8; // offset to keep cards in view

      return {
        position: [x, 2.1, z] as [number, number, number],
        angle,
      };
    });
  }, []);

  // Billboard: update each ProjectTile's parent rotation to face camera
  useFrame(() => {
    if (!isActive || !groupRef.current) return;

    groupRef.current.children.forEach((child) => {
      if (!child) return;
      // Get world position of this card group
      const cardWorldPos = new THREE.Vector3();
      child.getWorldPosition(cardWorldPos);

      // Calculate angle to camera (Y-axis only to keep card upright)
      const dx = camera.position.x - cardWorldPos.x;
      const dz = camera.position.z - cardWorldPos.z;
      const angleToCamera = Math.atan2(dx, dz);

      // Get parent's world rotation to compensate
      const parentWorldQuat = new THREE.Quaternion();
      if (child.parent) {
        child.parent.getWorldQuaternion(parentWorldQuat);
      }
      const parentWorldEuler = new THREE.Euler().setFromQuaternion(parentWorldQuat);

      // Set local Y rotation = desired world rotation - parent's world rotation
      child.rotation.set(0, angleToCamera - parentWorldEuler.y, 0);
    });
  });

  const tiles = useMemo(() => {
    return PROJECTS.map((project, i) => (
      <group
        key={i}
        position={arcData[i].position}
        rotation={[0, arcData[i].angle, 0]}
      >
        <ProjectTile
          project={project}
          index={i}
          position={[0, 0, 0]}
          rotation={[0, 0, 0]}
          activeId={activeId}
          onClick={() => onClick(i)}
        />
      </group>
    ));
  }, [activeId, isActive, arcData]);

  return (
    <group ref={groupRef}>
      {tiles}
    </group>
  );
};

export default ProjectsCarousel;
