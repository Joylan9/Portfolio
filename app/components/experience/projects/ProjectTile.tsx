import { Edges, Text, TextProps } from "@react-three/drei";
import { ThreeEvent } from "@react-three/fiber";
import gsap from "gsap";
import { useEffect, useMemo, useRef, useState } from "react";
import { isMobile } from "react-device-detect";
import * as THREE from "three";

import { usePortalStore } from "@stores";
import { Project } from "@types";

const CARD_WIDTH = 5.4;
const CARD_HEIGHT = 2.45;
const CARD_PADDING_X = 0.28;
const TITLE_MAX_WIDTH = CARD_WIDTH - CARD_PADDING_X * 2;
const TITLE_BOX_HEIGHT = 0.82;

interface ProjectTileProps {
  project: Project;
  index: number;
  position: [number, number, number];
  rotation: [number, number, number];
  activeId: number | null;
  onClick: () => void;
}

const getTitleFontSize = (title: string) => {
  if (title.length > 34) return 0.22;
  if (title.length > 28) return 0.25;
  if (title.length > 22) return 0.29;
  return 0.36;
};

const ProjectTile = ({ project, index, position, rotation, activeId, onClick }: ProjectTileProps) => {
  const projectRef = useRef<THREE.Group>(null);
  const cardMeshRef = useRef<THREE.Mesh>(null);
  const titleRef = useRef<THREE.Object3D>(null);
  const dateGroupRef = useRef<THREE.Group>(null);
  const subtextRef = useRef<THREE.Object3D>(null);
  const buttonRef = useRef<THREE.Group>(null);
  const hoverAnimRef = useRef<gsap.core.Timeline | null>(null);
  const [desktopHovered, setDesktopHovered] = useState(false);
  const isProjectSectionActive = usePortalStore((state) => state.activePortalId === "projects");
  const hovered = isMobile ? activeId === index : desktopHovered;
  const titleFontSize = getTitleFontSize(project.title);

  const titleProps: Partial<TextProps> = useMemo(() => ({
    font: "./soria-font.ttf",
    color: "black",
    anchorX: "left",
    anchorY: "middle",
    maxWidth: TITLE_MAX_WIDTH,
    whiteSpace: "nowrap" as const,
    overflowWrap: "normal" as const,
  }), []);

  const subtitleProps: Partial<TextProps> = useMemo(() => ({
    font: "./Vercetti-Regular.woff",
    color: "black",
    anchorX: "left",
    anchorY: "top",
  }), []);

  useEffect(() => {
    if (!projectRef.current || !cardMeshRef.current || !titleRef.current || !dateGroupRef.current || !subtextRef.current) return;
    hoverAnimRef.current?.kill();

    hoverAnimRef.current = gsap.timeline();
    hoverAnimRef.current
      .to(projectRef.current.position, { z: hovered ? 1 : 0, duration: 0.2 }, 0)
      .to(projectRef.current.scale, {
        x: hovered ? 1.12 : 1,
        y: hovered ? 1.12 : 1,
        z: hovered ? 1.12 : 1,
      }, 0)
      .to(titleRef.current.position, { y: hovered ? 0.32 : 0.02 }, 0)
      .to(subtextRef.current.position, { y: hovered ? -0.1 : -0.98 }, 0)
      .to(subtextRef.current, { fillOpacity: hovered ? 1 : 0, duration: 0.4 }, 0)
      .to(dateGroupRef.current.position, { y: hovered ? 0.9 : 0.82 }, 0)
      .to(cardMeshRef.current.scale, { y: hovered ? 1.35 : 1 }, 0)
      .to(cardMeshRef.current.material, { opacity: hovered ? 0.95 : 0.3 }, 0)
      .to(cardMeshRef.current.position, { y: hovered ? 0.25 : 0 }, 0);

    if (project.url && buttonRef.current) {
      hoverAnimRef.current
        .to(buttonRef.current.scale, { y: hovered ? 1 : 0, x: hovered ? 1 : 0 }, 0)
        .to(buttonRef.current.position, { z: hovered ? 0.3 : -1 }, 0);
    }
  }, [hovered]);

  useEffect(() => {
    if (projectRef.current) {
      gsap.to(projectRef.current.position, {
        y: isProjectSectionActive ? 0 : -11,
        duration: 1,
        delay: isProjectSectionActive ? index * 0.1 : 0,
      });
    }
  }, [isProjectSectionActive]);

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    if (!project.url) return;
    const button = e.eventObject;
    gsap.to(button.position, { z: 0, duration: 0.1 })
      .then(() => gsap.to(button.position, { z: 0.3, duration: 0.3 }));
    setTimeout(() => window.open(project.url, '_blank'), 50);
  };

  const handlePointerOver = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    if (!isMobile && isProjectSectionActive) {
      setDesktopHovered(true);
    }
  };

  return (
    <group
      position={position}
      rotation={rotation}
      onClick={onClick}
      onPointerOver={handlePointerOver}
      onPointerOut={() => !isMobile && isProjectSectionActive && setDesktopHovered(false)}>
      <group ref={projectRef}>
        <mesh ref={cardMeshRef}>
          <planeGeometry args={[CARD_WIDTH, CARD_HEIGHT, 1]} />
          <meshBasicMaterial color="#FFF" transparent opacity={0.3}/>
          {/* <meshPhysicalMaterial transmission={1} roughness={0.3} /> */}
          <Edges color="black" lineWidth={1.5} />
        </mesh>
        <mesh position={[0, 0.02, 0.09]}>
          <planeGeometry args={[CARD_WIDTH - 0.28, TITLE_BOX_HEIGHT, 1]} />
          <meshBasicMaterial color="#FFF" transparent opacity={0} />
          <Edges color="black" lineWidth={1} />
        </mesh>
        <Text
          ref={titleRef}
          {...titleProps}
          position={[-TITLE_MAX_WIDTH / 2, 0.02, 0.101]}
          fontSize={titleFontSize}>
          {project.title}
        </Text>
        <group ref={dateGroupRef} position={[1.62, 0.82, 0.12]}>
          <mesh>
            <planeGeometry args={[1.1, 0.34, 1]} />
            <meshBasicMaterial color="#777" opacity={0} wireframe />
            <Edges color="black" lineWidth={1} />
          </mesh>
          <Text
            {...subtitleProps}
            position={[-0.43, 0.13, 0]}
            fontSize={0.22}>
            {project.date.toUpperCase()}
          </Text>
        </group>
        <Text
          ref={subtextRef}
          {...subtitleProps}
          maxWidth={TITLE_MAX_WIDTH}
          overflowWrap="break-word"
          position={[-TITLE_MAX_WIDTH / 2, -0.98, 0.1]}
          fontSize={0.2}>
          {project.subtext}
        </Text>
        {project.url && (
          <group
            ref={buttonRef}
            position={[1.3, -0.6, -1]}
            scale={[0, 0, 1]}
            onClick={handleClick}
            onPointerOver={() => document.body.style.cursor = 'pointer'}
            onPointerOut={() => document.body.style.cursor = 'auto'}>
            <mesh>
              <boxGeometry args={[1.1, 0.4, 0.2]} />
              <meshBasicMaterial color="#222" />
              <Edges color="white" lineWidth={1} />
            </mesh>
            <Text
              {...subtitleProps}
              color="white"
              position={[-0.4, 0.15, 0.2]}
              fontSize={0.25}>
              VIEW ↗
            </Text>
          </group>
        )}
      </group>
    </group>
  );
};

export default ProjectTile;
