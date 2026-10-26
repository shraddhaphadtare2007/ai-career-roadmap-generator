export interface User {
  id: string;
  name: string;
  email: string;
  education?: string;
  created_at?: string;
}

export interface CareerMatch {
  career: string;
  percentage: number;
  tagline?: string;
}

export interface CareerResult {
  recommended_career: string;
  match_percentage: number;
  top_matches: CareerMatch[];
  reasons: string[];
  skills_you_have: string[];
  skills_to_learn: string[];
}

export interface RoadmapItem {
  id: string;
  label: string;
  done: boolean;
}

export interface RoadmapStep {
  id: string;
  stage: number;
  title: string;
  description: string;
  status: "done" | "in_progress" | "locked";
  items: RoadmapItem[];
  project?: string;
  estimated_weeks?: string;
}

export interface SkillGapItem {
  skill: string;
  category: string;
  current: number;
  required: number;
  status: "Proficient" | "In Progress" | "Needs Learning";
}

export interface SkillsGapResponse {
  career: string;
  skills: SkillGapItem[];
}

export interface Course {
  id: string;
  title: string;
  platform: string;
  duration: string;
  level: string;
  url: string;
  career: string;
  tags: string[];
  free?: boolean;
}

export interface CoursesResponse {
  courses: Course[];
  completed_ids: string[];
}

export interface Project {
  id: string;
  title: string;
  description: string;
  career: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  tech_stack: string[];
  status: "not_started" | "in_progress" | "completed";
}

export interface ProjectsResponse {
  projects: Project[];
}

export interface ReadinessItem {
  key: string;
  label: string;
  done: boolean;
  weight: number;
}

export interface Opportunity {
  id: string;
  role: string;
  company: string;
  location: string;
  type: string;
  stipend?: string;
  career: string;
  requirements: string[];
}

export interface ReadinessResponse {
  percentage: number;
  items: ReadinessItem[];
  opportunities: Opportunity[];
}

export interface DashboardData {
  user: User;
  career_result: CareerResult | null;
  roadmap: RoadmapStep[] | null;
  skills_completed: number;
  skills_total: number;
  courses_completed: number;
  courses_total: number;
  projects_completed: number;
  projects_total: number;
  job_readiness: number;
  next_step: string | null;
}
