
export type UserRole = 'Alumno' | 'Mentor' | 'Maestro' | 'Creador';

export enum MathTab {
  FRACTIONS = 'fracciones',
  MATH_ADV = 'matematicas-avanzadas',
  PHYSICS_BMU = 'fisica-bmu',
  CHEMISTRY_BMU = 'quimica-bmu',
  CIRCUITS = 'circuitos-mecatronica',
  ENGINEERING = 'ingenieria-control',
  COGNITION = 'cognicion',
  AI_TUTOR = 'tutor-ia',
  ROADMAP = 'roadmap',
  TELEMETRIA = 'telemetria',
  EVALUATION = 'evaluacion',
  TRICKS = 'trucos-mamba',
  MASTERY_MAP = 'mapa-maestria',
  CLASSROOM = 'salon-clases'
}

export interface MasteryNode {
  id: string;
  label: string;
  category: string;
  level: number;
  status: 'locked' | 'learning' | 'mastered';
  icon: string;
  coordinates: { x: number, y: number };
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: UserRole;
  domainPoints: number;
  masteryLevels: Record<string, number>; // nodeID -> level
  lastLogin: number;
  rank: string;
  preferences: {
    rotationDuration: number;
    themeIdx: number;
  };
}

export interface BMU_Theme {
  name: string;
  accent: string;
  secondary: string;
  highlight: string;
}

export interface VisualData {
  type: 'pie' | 'bar' | 'scale' | 'none' | 'function' | 'vector';
  value: number;
  total: number;
  label: string;
}

export interface MathResponse {
  answer: string;
  explanation: string;
  visualData: VisualData;
}

export interface MathTrick {
  title: string;
  description: string;
  example: string;
  visualHint: string;
}

export interface StudyTask {
  id: string;
  subject: string;
  topic: string;
  status: 'pending' | 'completed';
  difficulty: 'easy' | 'medium' | 'hard';
}
