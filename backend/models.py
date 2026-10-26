from typing import List, Optional, Literal
from pydantic import BaseModel, Field

class UserBase(BaseModel):
    name: str
    email: str
    education: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class UserOut(UserBase):
    id: str
    created_at: Optional[str] = None

class AssessmentAnswers(BaseModel):
    education: str
    interests: List[str]
    skills: List[str]
    skill_level: str
    enjoyment: List[str]
    study_time: str
    career_goal: str
    learning_style: str

class CareerMatch(BaseModel):
    career: str
    percentage: int
    tagline: Optional[str] = None

class CareerResult(BaseModel):
    recommended_career: str
    match_percentage: int
    top_matches: List[CareerMatch]
    reasons: List[str]
    skills_you_have: List[str]
    skills_to_learn: List[str]

class RoadmapItem(BaseModel):
    id: str
    label: str
    done: bool = False

class RoadmapStep(BaseModel):
    id: str
    stage: int
    title: str
    description: str
    status: Literal["done", "in_progress", "locked"]
    items: List[RoadmapItem]
    project: Optional[str] = None
    estimated_weeks: Optional[str] = None

class SkillGapItem(BaseModel):
    skill: str
    category: str
    current: int
    required: int
    status: Literal["Proficient", "In Progress", "Needs Learning"]

class SkillsGapResponse(BaseModel):
    career: str
    skills: List[SkillGapItem]

class Course(BaseModel):
    id: str
    title: str
    platform: str
    duration: str
    level: str
    url: str
    career: str
    tags: List[str]
    free: bool = False

class CoursesResponse(BaseModel):
    courses: List[Course]
    completed_ids: List[str]

class CourseCompleteReq(BaseModel):
    completed: bool

class Project(BaseModel):
    id: str
    title: str
    description: str
    career: str
    difficulty: Literal["Beginner", "Intermediate", "Advanced"]
    tech_stack: List[str]
    status: Literal["not_started", "in_progress", "completed"] = "not_started"

class ProjectsResponse(BaseModel):
    projects: List[Project]

class ProjectStatusReq(BaseModel):
    status: Literal["not_started", "in_progress", "completed"]

class ReadinessItem(BaseModel):
    key: str
    label: str
    done: bool = False
    weight: int = 10

class Opportunity(BaseModel):
    id: str
    role: str
    company: str
    location: str
    type: str
    stipend: Optional[str] = None
    career: str
    requirements: List[str]

class ReadinessResponse(BaseModel):
    percentage: int
    items: List[ReadinessItem]
    opportunities: List[Opportunity]

class ReadinessToggleReq(BaseModel):
    done: bool

class RoadmapItemToggleReq(BaseModel):
    label: str
    done: bool

class DashboardData(BaseModel):
    user: UserOut
    career_result: Optional[CareerResult] = None
    roadmap: Optional[List[RoadmapStep]] = None
    skills_completed: int = 0
    skills_total: int = 0
    courses_completed: int = 0
    courses_total: int = 0
    projects_completed: int = 0
    projects_total: int = 0
    job_readiness: int = 0
    next_step: Optional[str] = None
