import { useMemo, useState } from "react";
import { isMobile } from "react-device-detect";
import ProjectTile from "./ProjectTile";

import { PROJECTS } from "@constants";
import { usePortalStore } from "@stores";

const ProjectsCarousel = () => {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const isActive = usePortalStore((state) => state.activePortalId === "projects");
  const activeId = isActive ? selectedId : null;

  const onClick = (id: number) => {
    if (!isMobile) return;
    setSelectedId(id === selectedId ? null : id);
  };
  const tiles = useMemo(() => {
    const cardWidth = 5.4;
    const gap = 0.8;
    const rowWidth = PROJECTS.length * cardWidth + (PROJECTS.length - 1) * gap;
    const startX = -rowWidth / 2 + cardWidth / 2;

    return PROJECTS.map((project, i) => {
      const x = startX + i * (cardWidth + gap);

      return (
        <ProjectTile
          key={i}
          project={project}
          index={i}
          position={[x, 2.1, -8]}
          rotation={[0, 0, 0]}
          activeId={activeId}
          onClick={() => onClick(i)}
        />
      );
    });
  }, [activeId, isActive]);

  return (
    <group rotation={[0, -Math.PI / 12, 0]}>
      {tiles}
    </group>
  );
};

export default ProjectsCarousel;
