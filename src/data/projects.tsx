import React from 'react';
import { Terminal, Code, Database, Globe } from 'lucide-react';

export interface Project {
  id: string;
  name: string;
  icon: JSX.Element;
  description: string;
  technologies: string[];
  features: string[];
  githubUrl: string;
  demoUrl: string;
}

export const projects: Project[] = [
  {
    id: 'zenify',
    name: 'Zenify',
    icon: <Terminal size={32} />,
    description: 'A premium music streaming and player application with advanced audio processing.',
    technologies: ['React', 'Flutter', 'Web Audio API'],
    features: ['8D audio processing', 'Real-time Equalizer', 'Reverb effects', 'Crossfade', 'Offline playback support'],
    githubUrl: '#',
    demoUrl: '#',
  },
  {
    id: 'lorin',
    name: 'Lorin',
    icon: <Code size={32} />,
    description: 'An elegant e-commerce platform for high-end fashion with seamless checkout.',
    technologies: ['React', 'Next.js', 'Stripe'],
    features: ['Dynamic cart', 'Product filtering', 'Secure checkout', 'Admin dashboard'],
    githubUrl: '#',
    demoUrl: '#',
  },
  {
    id: 'formora',
    name: 'Formora',
    icon: <Database size={32} />,
    description: 'A powerful form building tool for businesses to collect and analyze data efficiently.',
    technologies: ['Vue.js', 'Firebase', 'Tailwind'],
    features: ['Drag & drop builder', 'Analytics dashboard', 'Export to CSV', 'Custom themes'],
    githubUrl: '#',
    demoUrl: '#',
  },
  {
    id: 'bus',
    name: 'Bus Tracker',
    icon: <Globe size={32} />,
    description: 'Real-time bus tracking application for local transit systems.',
    technologies: ['React Native', 'Node.js', 'MongoDB', 'Google Maps API'],
    features: ['Live GPS tracking', 'Route calculation', 'Arrival estimations', 'Push notifications'],
    githubUrl: '#',
    demoUrl: '#',
  },
];
