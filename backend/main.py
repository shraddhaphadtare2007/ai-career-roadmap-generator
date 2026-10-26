import os
from typing import Optional, List
from fastapi import FastAPI, Depends, HTTPException, status, Response, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse

from models import (
    UserCreate,
    UserLogin,
    UserOut,
    AssessmentAnswers,
    CareerResult,
    RoadmapStep,
    RoadmapItemToggleReq,
    SkillsGapResponse,
    CoursesResponse,
    CourseCompleteReq,
    ProjectsResponse,
    ProjectStatusReq,
    ReadinessResponse,
    ReadinessItem,
    ReadinessToggleReq,
    DashboardData,
    Project,
)
import database as db
from lib.careers import evaluate_assessment, compute_skills_gap
from lib.roadmaps import generate_roadmap_steps
from lib.courses_data import ALL_COURSES
from lib.projects_data import ALL_PROJECTS
from lib.readiness_data import READINESS_ITEMS_SPEC, SAMPLE_OPPORTUNITIES
from lib.ai_advisor import stream_career_advice

app = FastAPI(title="AI Career Roadmap API", version="1.0.0")

# Enable CORS for frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

COOKIE_NAME = "session_id"

def get_current_user(request: Request) -> UserOut:
    token = request.cookies.get(COOKIE_NAME)
    if not token:
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            token = auth_header.split(" ", 1)[1]
    
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required",
        )
    
    user = db.get_user_by_session(token)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Session expired or invalid",
        )
    return user

def set_auth_cookie(response: Response, session_id: str):
    response.set_cookie(
        key=COOKIE_NAME,
        value=session_id,
        httponly=True,
        samesite="lax",
        secure=False,
        path="/",
        max_age=30 * 24 * 3600,
    )

# ----------------- Auth Routes -----------------

@app.post("/api/auth/register", response_model=UserOut)
def register(req: UserCreate, response: Response):
    existing = db.get_user_by_email(req.email)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email already exists",
        )
    user = db.create_user(
        name=req.name,
        email=req.email,
        password=req.password,
        education=req.education,
    )
    session_id = db.create_session(user.id)
    set_auth_cookie(response, session_id)
    return user

@app.post("/api/auth/login", response_model=UserOut)
def login(req: UserLogin, response: Response):
    user = db.authenticate_user(req.email, req.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )
    session_id = db.create_session(user.id)
    set_auth_cookie(response, session_id)
    return user

@app.post("/api/auth/logout")
def logout(request: Request, response: Response):
    token = request.cookies.get(COOKIE_NAME)
    if token:
        db.delete_session(token)
    response.delete_cookie(key=COOKIE_NAME, path="/")
    return {"ok": True}

@app.get("/api/auth/me", response_model=UserOut)
def me(current_user: UserOut = Depends(get_current_user)):
    return current_user

# ----------------- Demo Seeder -----------------

@app.post("/api/demo/{key}")
def switch_demo(key: str, response: Response):
    user = db.seed_demo_user(key)
    session_id = db.create_session(user.id)
    set_auth_cookie(response, session_id)
    return {"ok": True, "user": user}

# ----------------- Assessment & Results -----------------

@app.post("/api/assessment")
def submit_assessment(
    answers: AssessmentAnswers,
    current_user: UserOut = Depends(get_current_user),
):
    result = evaluate_assessment(answers)
    db.save_assessment(current_user.id, answers, result)

    # Initialize personalized roadmap steps
    steps = generate_roadmap_steps(result.recommended_career)
    db.save_user_roadmap(current_user.id, steps)

    return {"result": result}

@app.get("/api/assessment/latest")
def get_latest_assessment(current_user: UserOut = Depends(get_current_user)):
    answers, result = db.get_latest_assessment(current_user.id)
    if not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No assessment completed yet",
        )
    return {"result": result, "answers": answers}

# ----------------- Dashboard -----------------

@app.get("/api/dashboard", response_model=DashboardData)
def get_dashboard(current_user: UserOut = Depends(get_current_user)):
    answers, result = db.get_latest_assessment(current_user.id)
    roadmap = db.get_user_roadmap(current_user.id)

    # Total skills completed vs required
    skills_completed = 0
    skills_total = 6
    if result:
        skills_completed = len(result.skills_you_have)
        skills_total = max(1, len(result.skills_you_have) + len(result.skills_to_learn))

    # Courses
    completed_course_ids = db.get_user_courses_progress(current_user.id)
    career = result.recommended_career if result else "AI/ML Engineer"
    relevant_courses = [c for c in ALL_COURSES if c.career == career]
    courses_total = max(1, len(relevant_courses))
    courses_completed = len(completed_course_ids)

    # Projects
    project_status_map = db.get_user_projects_status(current_user.id)
    relevant_projects = [p for p in ALL_PROJECTS if p.career == career]
    projects_total = max(1, len(relevant_projects))
    projects_completed = sum(1 for st in project_status_map.values() if st == "completed")

    # Readiness
    readiness_map = db.get_user_readiness(current_user.id)
    job_readiness = sum(item["weight"] for item in READINESS_ITEMS_SPEC if readiness_map.get(item["key"], False))

    # Next actionable step
    next_step = None
    for step in roadmap:
        if step.status == "in_progress":
            next_step = f"Stage {step.stage}: {step.title}"
            break
    if not next_step and roadmap and all(s.status == "done" for s in roadmap):
        next_step = "All stages completed! Apply for internships & jobs."

    return DashboardData(
        user=current_user,
        career_result=result,
        roadmap=roadmap,
        skills_completed=skills_completed,
        skills_total=skills_total,
        courses_completed=courses_completed,
        courses_total=courses_total,
        projects_completed=projects_completed,
        projects_total=projects_total,
        job_readiness=min(100, job_readiness),
        next_step=next_step,
    )

# ----------------- Roadmap -----------------

@app.get("/api/roadmap", response_model=List[RoadmapStep])
def get_roadmap(current_user: UserOut = Depends(get_current_user)):
    steps = db.get_user_roadmap(current_user.id)
    if not steps:
        _, result = db.get_latest_assessment(current_user.id)
        career = result.recommended_career if result else "AI/ML Engineer"
        steps = generate_roadmap_steps(career)
        db.save_user_roadmap(current_user.id, steps)
    return steps

@app.patch("/api/roadmap/steps/{step_id}/items")
def toggle_roadmap_item(
    step_id: str,
    req: RoadmapItemToggleReq,
    current_user: UserOut = Depends(get_current_user),
):
    db.update_roadmap_item(current_user.id, step_id, req.label, req.done)
    return {"ok": True}

@app.post("/api/roadmap/steps/{step_id}/complete")
def complete_step(
    step_id: str,
    current_user: UserOut = Depends(get_current_user),
):
    db.complete_roadmap_step(current_user.id, step_id)
    return {"ok": True}

# ----------------- Skills Gap -----------------

@app.get("/api/skills/gap", response_model=SkillsGapResponse)
def get_skills_gap(current_user: UserOut = Depends(get_current_user)):
    answers, result = db.get_latest_assessment(current_user.id)
    if not answers or not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Assessment required to generate skill gap matrix",
        )
    return compute_skills_gap(
        career=result.recommended_career,
        user_skills=answers.skills,
        skill_level=answers.skill_level,
    )

# ----------------- Courses -----------------

@app.get("/api/courses", response_model=CoursesResponse)
def get_courses(current_user: UserOut = Depends(get_current_user)):
    completed_ids = db.get_user_courses_progress(current_user.id)
    _, result = db.get_latest_assessment(current_user.id)
    target_career = result.recommended_career if result else None

    # Sort courses so that matching target career courses appear first
    def sort_key(c):
        return (0 if c.career == target_career else 1, c.career, c.title)

    sorted_courses = sorted(ALL_COURSES, key=sort_key)
    return CoursesResponse(courses=sorted_courses, completed_ids=completed_ids)

@app.post("/api/courses/{course_id}/complete")
def toggle_course_completion(
    course_id: str,
    req: CourseCompleteReq,
    current_user: UserOut = Depends(get_current_user),
):
    db.set_course_completion(current_user.id, course_id, req.completed)
    return {"ok": True}

# ----------------- Projects -----------------

@app.get("/api/projects", response_model=ProjectsResponse)
def get_projects(current_user: UserOut = Depends(get_current_user)):
    _, result = db.get_latest_assessment(current_user.id)
    target_career = result.recommended_career if result else None

    status_map = db.get_user_projects_status(current_user.id)
    projects_out: List[Project] = []

    # Sort target career projects first
    sorted_all = sorted(
        ALL_PROJECTS,
        key=lambda p: (0 if p.career == target_career else 1, p.career, p.difficulty)
    )

    for p in sorted_all:
        user_status = status_map.get(p.id, "not_started")
        projects_out.append(
            Project(
                id=p.id,
                title=p.title,
                description=p.description,
                career=p.career,
                difficulty=p.difficulty,
                tech_stack=p.tech_stack,
                status=user_status,
            )
        )

    return ProjectsResponse(projects=projects_out)

@app.post("/api/projects/{project_id}/status")
def update_project_status(
    project_id: str,
    req: ProjectStatusReq,
    current_user: UserOut = Depends(get_current_user),
):
    db.set_project_status(current_user.id, project_id, req.status)
    return {"ok": True}

# ----------------- Readiness & Internships -----------------

@app.get("/api/readiness", response_model=ReadinessResponse)
def get_readiness(current_user: UserOut = Depends(get_current_user)):
    readiness_map = db.get_user_readiness(current_user.id)
    items: List[ReadinessItem] = []
    total_score = 0

    for spec in READINESS_ITEMS_SPEC:
        done = readiness_map.get(spec["key"], False)
        if done:
            total_score += spec["weight"]
        items.append(
            ReadinessItem(
                key=spec["key"],
                label=spec["label"],
                done=done,
                weight=spec["weight"],
            )
        )

    _, result = db.get_latest_assessment(current_user.id)
    target_career = result.recommended_career if result else None

    # Filter/sort opportunities
    sorted_opps = sorted(
        SAMPLE_OPPORTUNITIES,
        key=lambda o: (0 if o.career == target_career else 1, o.role)
    )

    return ReadinessResponse(
        percentage=min(100, total_score),
        items=items,
        opportunities=sorted_opps,
    )

@app.post("/api/readiness/{key}/toggle")
def toggle_readiness(
    key: str,
    req: ReadinessToggleReq,
    current_user: UserOut = Depends(get_current_user),
):
    db.set_readiness_item(current_user.id, key, req.done)
    return {"ok": True}

# ----------------- AI Career Advisor (Streaming) -----------------

@app.post("/api/ai/advice")
async def get_ai_advice(current_user: UserOut = Depends(get_current_user)):
    answers, result = db.get_latest_assessment(current_user.id)
    if not answers or not result:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Please complete the career assessment first to receive personalized AI advice.",
        )

    return StreamingResponse(
        stream_career_advice(
            user_name=current_user.name,
            result=result,
            answers=answers,
        ),
        media_type="text/plain",
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8001, reload=True)
