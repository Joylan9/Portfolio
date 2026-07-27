import * as THREE from "three";
import { WorkTimelinePoint } from "../types";

// TODO: Replace with your own education and work experience
export const WORK_TIMELINE: WorkTimelinePoint[] = [
  {
    point: new THREE.Vector3(0, 0, 0),
    year: '2020',
    title: 'Your University',
    subtitle: 'Your Degree',
    position: 'right',
  },
  {
    point: new THREE.Vector3(-4, -4, -3),
    year: '2022',
    title: 'Company One',
    subtitle: 'Your Role',
    position: 'left',
  },
  {
    point: new THREE.Vector3(-3, -1, -6),
    year: '2023',
    title: 'Company Two',
    subtitle: 'Your Role',
    position: 'left',
  },
  {
    point: new THREE.Vector3(0, -1, -10),
    year: '2024',
    title: 'Company Three',
    subtitle: 'Your Role',
    position: 'left',
  },
  {
    point: new THREE.Vector3(1, 1, -12),
    year: new Date().toLocaleDateString('default', { year: 'numeric' }),
    title: 'Present',
    subtitle: 'Building cool things...',
    position: 'right',
  }
]