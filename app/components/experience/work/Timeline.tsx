import { Box, Edges, Line, Text, TextProps } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { usePortalStore } from "@stores";
import gsap from "gsap";
import { useEffect, useMemo, useRef, useState } from "react";
import { isMobile } from "react-device-detect";
import * as THREE from "three";

import { WORK_TIMELINE } from "@constants";
import { WorkTimelinePoint } from "@types";

/**
 * Layout constants for timeline entries.
 *
 * Vertical stack from top of text group:
 *   YEAR_Y        = 0      (year badge, top of stack)
 *   TITLE_Y       = -0.55  (title, below year with gap)
 *   SUBTITLE_Y    = title bottom + SUBTITLE_GAP (calculated from title height)
 *
 * Horizontal offset from curve point:
 *   TEXT_OFFSET_X  = 0.5 (left or right, enough to clear the box marker)
 *
 * Z-layering:
 *   Line:    z = -0.3 (behind everything)
 *   Marker:  z = -0.1 (middle layer)
 *   Text:    z = 0.05 (front, always readable)
 */
const TEXT_OFFSET_X = 0.5;
const YEAR_Y = 0;
const TITLE_Y = -0.4;
const TITLE_FONT_SIZE = 0.55;
const TITLE_MAX_WIDTH = 3.2;
const SUBTITLE_FONT_SIZE = 0.2;
const YEAR_FONT_SIZE = 0.3;
const TEXT_Z = 0.05;       // Text layer — in front
const MARKER_Z = -0.1;     // Marker layer — middle
const LINE_Z = -0.3;       // Line layer — behind everything

const TimelinePoint = ({ point, diff }: { point: WorkTimelinePoint, diff: number }) => {
  const isLeft = point.position === 'left';
  const textAlign = isLeft ? 'right' : 'left';
  const xOffset = isLeft ? -TEXT_OFFSET_X : TEXT_OFFSET_X;

  // Estimate title height for subtitle positioning
  // Title wraps at TITLE_MAX_WIDTH; estimate lines from title length
  const titleCharsPerLine = Math.floor(TITLE_MAX_WIDTH / (TITLE_FONT_SIZE * 0.55));
  const titleLines = Math.ceil(point.title.length / Math.max(titleCharsPerLine, 1));
  const titleHeight = titleLines * TITLE_FONT_SIZE * 1.2; // 1.2 = line height factor
  const subtitleY = TITLE_Y - titleHeight - 0.12; // 0.12 gap between title and subtitle

  const fillOpacity = 2 - 2 * diff;

  const textProps: Partial<TextProps> = useMemo(() => ({
    font: "./Vercetti-Regular.woff",
    color: "white",
    anchorX: textAlign,
    fillOpacity,
    outlineWidth: 0.015,
    outlineColor: "black",
    outlineOpacity: Math.min(fillOpacity, 0.7),
  }), [textAlign, fillOpacity]);

  const titleProps = useMemo(() => ({
    ...textProps,
    font: "./soria-font.ttf",
    fontSize: TITLE_FONT_SIZE,
    maxWidth: TITLE_MAX_WIDTH,
    anchorY: 'top' as const,
    outlineWidth: 0.02,
  }), [textProps]);

  return (
    <group position={point.point} scale={isMobile ? 0.35 : 0.6}>
      {/* Marker box — middle z-layer */}
      <Box args={[0.2, 0.2, 0.2]} position={[0, 0, MARKER_Z]} scale={[1 - diff, 1 - diff, 1 - diff]}>
        <meshBasicMaterial color="white" wireframe />
        <Edges color="white" lineWidth={1.5} />
      </Box>

      {/* Text container — front z-layer, offset left or right */}
      <group position={[xOffset, 0, TEXT_Z]}>
        {/* Semi-transparent backdrop for readability */}
        <mesh
          position={[
            isLeft ? -TITLE_MAX_WIDTH / 2 : TITLE_MAX_WIDTH / 2,
            (YEAR_Y + subtitleY) / 2,
            -0.02,
          ]}
          renderOrder={-1}
        >
          <planeGeometry args={[TITLE_MAX_WIDTH + 0.4, Math.abs(subtitleY - YEAR_Y) + 0.8]} />
          <meshBasicMaterial color="black" transparent opacity={Math.min(fillOpacity * 0.15, 0.15)} />
        </mesh>

        {/* Year badge — top of stack */}
        <Text
          {...textProps}
          fontSize={YEAR_FONT_SIZE}
          position={[0, YEAR_Y, 0]}
        >
          {point.year}
        </Text>

        {/* Title — below year with clear gap */}
        <Text
          {...titleProps}
          position={[0, TITLE_Y, 0]}
        >
          {point.title}
        </Text>

        {/* Subtitle — below title, dynamically positioned based on estimated title height */}
        {point.subtitle && (
          <Text
            {...textProps}
            fontSize={SUBTITLE_FONT_SIZE}
            maxWidth={TITLE_MAX_WIDTH}
            overflowWrap="break-word"
            position={[0, subtitleY, 0]}
          >
            {point.subtitle}
          </Text>
        )}
      </group>
    </group>
  );
};

const Timeline = ({ progress }: { progress: number }) => {
  const { camera } = useThree();
  const isActive = usePortalStore((state) => state.activePortalId === 'work');
  const timeline = useMemo(() => WORK_TIMELINE, []);

  const curve = useMemo(() => new THREE.CatmullRomCurve3(timeline.map(p => p.point), false), [timeline]);
  const curvePoints = useMemo(() => curve.getPoints(500), [curve]);
  const visibleCurvePoints = useMemo(() => curvePoints.slice(0, Math.max(1, Math.ceil(progress * curvePoints.length))), [curvePoints, progress]);
  const visibleTimelinePoints = useMemo(() => timeline.slice(0, Math.max(1, Math.round(progress * (timeline.length - 1) + 1))), [timeline, progress]);

  const [visibleDashedCurvePoints, setVisibleDashedCurvePoints] = useState<THREE.Vector3[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useFrame((_, delta) => {
    if (isActive) {
      const position = curve.getPoint(progress);
      camera.position.x = THREE.MathUtils.damp(camera.position.x, (isMobile ? -1 : -2) + position.x, 4, delta);
      camera.position.y = THREE.MathUtils.damp(camera.position.y, -39 + position.z, 4, delta);
      camera.position.z = THREE.MathUtils.damp(camera.position.z, 13 - position.y, 4, delta);
    }
  });

  const groupRef = useRef<THREE.Group>(null);

  useEffect(() => {
    const tl = gsap.timeline();
    if (groupRef.current) {
      tl.to(groupRef.current.scale, {
        x: isActive ? 1 : 0,
        y: isActive ? 1 : 0,
        z: isActive ? 1 : 0,
        duration: 1,
        delay: isActive ? 0.4 : 0,
      });
      tl.to(groupRef.current.position, {
        y: isActive ? 0 : -2,
        duration: 1,
        delay: isActive ? 0.4 : 0,
      }, 0);
    }

    if (isActive) {
      let i = 0;
      clearInterval(intervalRef.current!);
      setTimeout(() => {
        intervalRef.current = setInterval(() => {
          const p = i++ / 100;
          setVisibleDashedCurvePoints(curvePoints.slice(0, Math.max(1, Math.ceil(p * curvePoints.length))));
          if (i > 100 && intervalRef.current) clearInterval(intervalRef.current);
        }, 10);
      }, 1000);
    } else {
      // Reset alongside interval cleanup; this state mirrors the timer.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setVisibleDashedCurvePoints([]);
      clearInterval(intervalRef.current!);
    }

    return () => clearInterval(intervalRef.current!);
  }, [isActive]);

  return (
    <group position={[0, -0.1, LINE_Z]}>
      {/* Connector lines — at LINE_Z, behind all text */}
      <Line points={visibleCurvePoints} color="white" lineWidth={3} />
      {visibleDashedCurvePoints.length > 0 && (
        <Line
          points={visibleDashedCurvePoints}
          color="white"
          lineWidth={0.5}
          dashed
          dashSize={0.25}
          gapSize={0.25}
        />
      )}
      {/* Timeline entries — text is at TEXT_Z (in front of line) */}
      <group ref={groupRef}>
        {visibleTimelinePoints.map((point, i) => {
          const diff = Math.min(2 * Math.max(i - (progress * (timeline.length - 1)), 0), 1);
          return <TimelinePoint point={point} key={i} diff={diff} />;
        })}
      </group>
    </group>
  );
};

export default Timeline;
