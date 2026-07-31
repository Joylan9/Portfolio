import * as THREE from "three";
import { WorkTimelinePoint } from "../types";

export const WORK_TIMELINE: WorkTimelinePoint[] = [
  {
    point: new THREE.Vector3(0, 0, 0),
    year: '2019',
    title: 'Don Bosco School',
    subtitle: 'S.S.L.C · 56.57%',
    position: 'right',
  },
  {
    point: new THREE.Vector3(-4, -4, -3),
    year: '2020',
    title: 'Sri Venkataramana PU College',
    subtitle: 'Pre-University (PCMC) · 76.80%',
    position: 'left',
  },
  {
    point: new THREE.Vector3(-3, -1, -6),
    year: '2022',
    title: 'Canara Engineering College',
    subtitle: 'B.E. in Computer Science · CGPA: 8.14',
    position: 'left',
  },
  {
    point: new THREE.Vector3(0, -1, -10),
    year: '2025',
    title: 'SoVir Technologies LLP',
    subtitle: 'Web Developer Intern',
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