export type ThemeColor = 'gargantua' | 'cygnus' | 'ultraviolet' | 'supernova';

export interface ThemeConfig {
  id: ThemeColor;
  name: string;
  diskColor1: string; // Inner accretion disk
  diskColor2: string; // Outer accretion disk
  accentColor: string; // UI accent
  bgGlow: string;
  description: string;
}

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  category: '3D / Graphics' | 'AI & Systems' | 'FinTech & Web3' | 'Creative Tech';
  description: string;
  longDescription: string;
  metrics: { label: string; value: string }[];
  technologies: string[];
  githubUrl: string;
  liveUrl: string;
  image: string;
  featured: boolean;
  gravityIndex: number;
}

export interface SkillCategory {
  title: string;
  badge: string;
  skills: {
    name: string;
    level: number;
    description: string;
    icon: string;
  }[];
}

export interface FlightLogEntry {
  stardate: string;
  role: string;
  organization: string;
  location: string;
  missionSummary: string;
  keyAchievements: string[];
  telemetry: string;
}

export interface TelemetryData {
  fps: number;
  scrollVelocity: number;
  warpSpeed: number; // 0 to 1
  eventHorizonDistance: number; // in AU
  relativisticGamma: number;
  anomalyDetected: boolean;
  isWarpJumping: boolean;
}
