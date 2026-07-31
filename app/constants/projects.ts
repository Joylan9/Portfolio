import { Project } from "../types";

export const PROJECTS: Project[] = [
  {
    title: 'Enterprise Agentic AI Platform',
    date: '2026',
    subtext: 'Agentic AI backend with goal decomposition, tool routing, and plan execution using local LLM (LLaMA3). Features RAG pipeline with sentence-transformer embeddings, enterprise patterns, and Docker deployment.',
    urls: [
      { text: 'GitHub', url: 'https://github.com/Joylan9/genai-agent-sprint' },
    ],
  },
  {
    title: 'Web Portal for Sovir Technologies',
    date: '2025',
    subtext: 'Full-stack web application serving as the company\'s digital front and admin management system. Built with React, Node.js, Express.js, and MongoDB with JWT-based dual authentication.',
    urls: [
      { text: 'Live', url: 'https://www.sovirtechnologies.in/' },
      { text: 'GitHub', url: 'https://github.com/Joylan9' },
    ],
  },
  {
    title: 'Sovir Full-Stack Training Platform',
    date: '2025',
    subtext: 'Production-grade training platform for language and industrial courses with 19 data models, role-based dashboards, JWT sessions, Google OAuth 2.0 SSO, and batch scheduling with Google Calendar integration.',
    urls: [
      { text: 'Live', url: 'https://training.sovirtechnologies.in/' },
      { text: 'GitHub', url: 'https://github.com/Joylan9' },
    ],
  },
  {
    title: 'Examination Portal',
    date: '2025',
    subtext: 'Full-stack online exam management for institutions, trainers, and candidates. Features dynamic exam engine with timed assessments, auto-submission, response tracking, and result generation.',
    urls: [
      { text: 'Live', url: 'https://examportal.sovirakademie.com/' },
      { text: 'GitHub', url: 'https://github.com/Joylan9' },
    ],
  },
];
