import sqlite3
import json
import uuid
import hashlib
import os
from datetime import datetime, timezone
from typing import Optional, List, Dict, Tuple, Any

from models import (
    UserOut,
    UserCreate,
    AssessmentAnswers,
    CareerResult,
    RoadmapStep,
    RoadmapItem,
)
from lib.careers import evaluate_assessment
from lib.roadmaps import generate_roadmap_steps

DB_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "career_roadmap.db")

def get_connection() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL;")
    return conn

def hash_password(password: str) -> str:
    # Deterministic salted SHA-256 hash for robust zero-dependency password security
    salt = "ai_career_roadmap_salt_2026"
    return hashlib.sha256(f"{salt}_{password}".encode("utf-8")).hexdigest()

def init_db():
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        education TEXT,
        created_at TEXT NOT NULL
    );
    """)

    cur.execute("""
    CREATE TABLE IF NOT EXISTS sessions (
        session_id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        created_at TEXT NOT NULL,
        FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    );
    """)

    cur.execute("""
    CREATE TABLE IF NOT EXISTS assessments (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        answers_json TEXT NOT NULL,
        result_json TEXT NOT NULL,
        created_at TEXT NOT NULL,
        FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    );
    """)

    cur.execute("""
    CREATE TABLE IF NOT EXISTS user_roadmap_steps (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        step_id TEXT NOT NULL,
        stage INTEGER NOT NULL,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        status TEXT NOT NULL,
        items_json TEXT NOT NULL,
        project TEXT,
        estimated_weeks TEXT,
        FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    );
    """)

    cur.execute("""
    CREATE TABLE IF NOT EXISTS user_course_progress (
        user_id TEXT NOT NULL,
        course_id TEXT NOT NULL,
        completed INTEGER DEFAULT 0,
        PRIMARY KEY (user_id, course_id),
        FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    );
    """)

    cur.execute("""
    CREATE TABLE IF NOT EXISTS user_project_status (
        user_id TEXT NOT NULL,
        project_id TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'not_started',
        PRIMARY KEY (user_id, project_id),
        FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    );
    """)

    cur.execute("""
    CREATE TABLE IF NOT EXISTS user_readiness (
        user_id TEXT NOT NULL,
        key TEXT NOT NULL,
        done INTEGER DEFAULT 0,
        PRIMARY KEY (user_id, key),
        FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    );
    """)

    conn.commit()
    conn.close()

# ----------------- User & Auth Management -----------------

def create_user(name: str, email: str, password: str, education: Optional[str] = None) -> UserOut:
    user_id = f"usr_{uuid.uuid4().hex[:12]}"
    created_at = datetime.now(timezone.utc).isoformat()
    pwd_hash = hash_password(password)

    conn = get_connection()
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO users (id, name, email, password_hash, education, created_at) VALUES (?, ?, ?, ?, ?, ?)",
        (user_id, name, email.lower().strip(), pwd_hash, education, created_at)
    )
    conn.commit()
    conn.close()

    return UserOut(id=user_id, name=name, email=email.lower().strip(), education=education, created_at=created_at)

def get_user_by_email(email: str) -> Optional[dict]:
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT * FROM users WHERE email = ?", (email.lower().strip(),))
    row = cur.fetchone()
    conn.close()
    if row:
        return dict(row)
    return None

def get_user_by_id(user_id: str) -> Optional[UserOut]:
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT id, name, email, education, created_at FROM users WHERE id = ?", (user_id,))
    row = cur.fetchone()
    conn.close()
    if row:
        return UserOut(
            id=row["id"],
            name=row["name"],
            email=row["email"],
            education=row["education"],
            created_at=row["created_at"],
        )
    return None

def authenticate_user(email: str, password: str) -> Optional[UserOut]:
    user = get_user_by_email(email)
    if not user:
        return None
    if user["password_hash"] != hash_password(password):
        return None
    return UserOut(
        id=user["id"],
        name=user["name"],
        email=user["email"],
        education=user["education"],
        created_at=user["created_at"],
    )

def create_session(user_id: str) -> str:
    session_id = f"sess_{uuid.uuid4().hex}"
    created_at = datetime.now(timezone.utc).isoformat()
    conn = get_connection()
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO sessions (session_id, user_id, created_at) VALUES (?, ?, ?)",
        (session_id, user_id, created_at)
    )
    conn.commit()
    conn.close()
    return session_id

def get_user_by_session(session_id: str) -> Optional[UserOut]:
    if not session_id:
        return None
    conn = get_connection()
    cur = conn.cursor()
    cur.execute(
        "SELECT u.id, u.name, u.email, u.education, u.created_at FROM users u JOIN sessions s ON u.id = s.user_id WHERE s.session_id = ?",
        (session_id,)
    )
    row = cur.fetchone()
    conn.close()
    if row:
        return UserOut(
            id=row["id"],
            name=row["name"],
            email=row["email"],
            education=row["education"],
            created_at=row["created_at"],
        )
    return None

def delete_session(session_id: str):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("DELETE FROM sessions WHERE session_id = ?", (session_id,))
    conn.commit()
    conn.close()

# ----------------- Assessment & Career Result -----------------

def save_assessment(user_id: str, answers: AssessmentAnswers, result: CareerResult):
    assessment_id = f"asm_{uuid.uuid4().hex[:12]}"
    created_at = datetime.now(timezone.utc).isoformat()
    answers_json = json.dumps(answers.model_dump())
    result_json = json.dumps(result.model_dump())

    conn = get_connection()
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO assessments (id, user_id, answers_json, result_json, created_at) VALUES (?, ?, ?, ?, ?)",
        (assessment_id, user_id, answers_json, result_json, created_at)
    )
    conn.commit()
    conn.close()

def get_latest_assessment(user_id: str) -> Tuple[Optional[AssessmentAnswers], Optional[CareerResult]]:
    conn = get_connection()
    cur = conn.cursor()
    cur.execute(
        "SELECT answers_json, result_json FROM assessments WHERE user_id = ? ORDER BY created_at DESC LIMIT 1",
        (user_id,)
    )
    row = cur.fetchone()
    conn.close()
    if not row:
        return None, None
    
    answers = AssessmentAnswers(**json.loads(row["answers_json"]))
    result = CareerResult(**json.loads(row["result_json"]))
    return answers, result

# ----------------- Personalized Roadmap Steps -----------------

def save_user_roadmap(user_id: str, steps: List[RoadmapStep]):
    conn = get_connection()
    cur = conn.cursor()
    # Delete old steps if any
    cur.execute("DELETE FROM user_roadmap_steps WHERE user_id = ?", (user_id,))
    for step in steps:
        step_pk = f"{user_id}_{step.id}"
        items_json = json.dumps([item.model_dump() for item in step.items])
        cur.execute(
            """
            INSERT INTO user_roadmap_steps 
            (id, user_id, step_id, stage, title, description, status, items_json, project, estimated_weeks)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                step_pk,
                user_id,
                step.id,
                step.stage,
                step.title,
                step.description,
                step.status,
                items_json,
                step.project,
                step.estimated_weeks,
            )
        )
    conn.commit()
    conn.close()

def get_user_roadmap(user_id: str) -> List[RoadmapStep]:
    conn = get_connection()
    cur = conn.cursor()
    cur.execute(
        "SELECT step_id, stage, title, description, status, items_json, project, estimated_weeks FROM user_roadmap_steps WHERE user_id = ? ORDER BY stage ASC",
        (user_id,)
    )
    rows = cur.fetchall()
    conn.close()

    if not rows:
        return []

    steps: List[RoadmapStep] = []
    for r in rows:
        raw_items = json.loads(r["items_json"])
        items = [RoadmapItem(**item) for item in raw_items]
        steps.append(
            RoadmapStep(
                id=r["step_id"],
                stage=r["stage"],
                title=r["title"],
                description=r["description"],
                status=r["status"],
                items=items,
                project=r["project"],
                estimated_weeks=r["estimated_weeks"],
            )
        )
    return steps

def update_roadmap_item(user_id: str, step_id: str, label: str, done: bool):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute(
        "SELECT items_json FROM user_roadmap_steps WHERE user_id = ? AND step_id = ?",
        (user_id, step_id)
    )
    row = cur.fetchone()
    if not row:
        conn.close()
        return

    items = json.loads(row["items_json"])
    for item in items:
        if item.get("label") == label or item.get("id") == label:
            item["done"] = done

    # If all items done, can mark in_progress or leave as is
    cur.execute(
        "UPDATE user_roadmap_steps SET items_json = ? WHERE user_id = ? AND step_id = ?",
        (json.dumps(items), user_id, step_id)
    )
    conn.commit()
    conn.close()

def complete_roadmap_step(user_id: str, step_id: str):
    conn = get_connection()
    cur = conn.cursor()
    # Mark current step as 'done'
    cur.execute(
        "UPDATE user_roadmap_steps SET status = 'done' WHERE user_id = ? AND step_id = ?",
        (user_id, step_id)
    )
    # Find current stage number
    cur.execute(
        "SELECT stage FROM user_roadmap_steps WHERE user_id = ? AND step_id = ?",
        (user_id, step_id)
    )
    row = cur.fetchone()
    if row:
        current_stage = row["stage"]
        # Unlock next step
        cur.execute(
            "UPDATE user_roadmap_steps SET status = 'in_progress' WHERE user_id = ? AND stage = ? AND status = 'locked'",
            (user_id, current_stage + 1)
        )
    conn.commit()
    conn.close()

# ----------------- Courses Progress -----------------

def get_user_courses_progress(user_id: str) -> List[str]:
    conn = get_connection()
    cur = conn.cursor()
    cur.execute(
        "SELECT course_id FROM user_course_progress WHERE user_id = ? AND completed = 1",
        (user_id,)
    )
    rows = cur.fetchall()
    conn.close()
    return [r["course_id"] for r in rows]

def set_course_completion(user_id: str, course_id: str, completed: bool):
    val = 1 if completed else 0
    conn = get_connection()
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO user_course_progress (user_id, course_id, completed) VALUES (?, ?, ?) ON CONFLICT(user_id, course_id) DO UPDATE SET completed = ?",
        (user_id, course_id, val, val)
    )
    conn.commit()
    conn.close()

# ----------------- Project Status -----------------

def get_user_projects_status(user_id: str) -> Dict[str, str]:
    conn = get_connection()
    cur = conn.cursor()
    cur.execute(
        "SELECT project_id, status FROM user_project_status WHERE user_id = ?",
        (user_id,)
    )
    rows = cur.fetchall()
    conn.close()
    return {r["project_id"]: r["status"] for r in rows}

def set_project_status(user_id: str, project_id: str, status: str):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO user_project_status (user_id, project_id, status) VALUES (?, ?, ?) ON CONFLICT(user_id, project_id) DO UPDATE SET status = ?",
        (user_id, project_id, status, status)
    )
    conn.commit()
    conn.close()

# ----------------- Job Readiness Checklist -----------------

def get_user_readiness(user_id: str) -> Dict[str, bool]:
    conn = get_connection()
    cur = conn.cursor()
    cur.execute(
        "SELECT key, done FROM user_readiness WHERE user_id = ?",
        (user_id,)
    )
    rows = cur.fetchall()
    conn.close()
    return {r["key"]: bool(r["done"]) for r in rows}

def set_readiness_item(user_id: str, key: str, done: bool):
    val = 1 if done else 0
    conn = get_connection()
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO user_readiness (user_id, key, done) VALUES (?, ?, ?) ON CONFLICT(user_id, key) DO UPDATE SET done = ?",
        (user_id, key, val, val)
    )
    conn.commit()
    conn.close()

# ----------------- Demo Personas Seeder -----------------

DEMO_PROFILES = {
    "alex": {
        "name": "Alex Chen",
        "email": "alex@demo.ai",
        "password": "password123",
        "education": "Third Year College",
        "answers": AssessmentAnswers(
            education="Third Year College",
            interests=["Artificial Intelligence", "Machine Learning", "Programming"],
            skills=["Python", "Mathematics", "SQL"],
            skill_level="Intermediate",
            enjoyment=["Coding", "Mathematics and analysis", "Problem solving"],
            study_time="2 hours",
            career_goal="Internship",
            learning_style="Hands-on projects",
        ),
        "courses_done": ["c-aiml-1"],
        "projects_progress": {"p-aiml-1": "completed", "p-aiml-2": "in_progress"},
        "readiness_done": ["resume", "github", "linkedin"],
    },
    "priya": {
        "name": "Priya Sharma",
        "email": "priya@demo.ai",
        "password": "password123",
        "education": "Final Year College",
        "answers": AssessmentAnswers(
            education="Final Year College",
            interests=["Generative AI", "Artificial Intelligence", "Programming"],
            skills=["Python", "JavaScript", "HTML/CSS"],
            skill_level="Intermediate",
            enjoyment=["Coding", "Problem solving"],
            study_time="3+ hours",
            career_goal="Job",
            learning_style="Combination",
        ),
        "courses_done": ["c-genai-2", "c-genai-4"],
        "projects_progress": {"p-genai-1": "completed"},
        "readiness_done": ["resume", "github", "portfolio"],
    },
    "rohan": {
        "name": "Rohan Patel",
        "email": "rohan@demo.ai",
        "password": "password123",
        "education": "Second Year College",
        "answers": AssessmentAnswers(
            education="Second Year College",
            interests=["Data Science", "Business/Product"],
            skills=["SQL", "Statistics", "Python"],
            skill_level="Beginner",
            enjoyment=["Mathematics and analysis", "Business and management"],
            study_time="1 hour",
            career_goal="Internship",
            learning_style="Courses",
        ),
        "courses_done": ["c-da-2"],
        "projects_progress": {"p-da-1": "in_progress"},
        "readiness_done": ["resume", "linkedin"],
    },
    "sam": {
        "name": "Sam Taylor",
        "email": "sam@demo.ai",
        "password": "password123",
        "education": "Working Professional",
        "answers": AssessmentAnswers(
            education="Working Professional",
            interests=["Cybersecurity", "Programming"],
            skills=["Python", "C/C++"],
            skill_level="Intermediate",
            enjoyment=["Problem solving", "Research"],
            study_time="2 hours",
            career_goal="Career Exploration",
            learning_style="Practice exercises",
        ),
        "courses_done": ["c-cyber-3"],
        "projects_progress": {"p-cyber-1": "completed"},
        "readiness_done": ["resume", "github", "technical"],
    },
}

def seed_demo_user(key: str) -> UserOut:
    prof = DEMO_PROFILES.get(key.lower(), DEMO_PROFILES["alex"])
    user = get_user_by_email(prof["email"])
    if not user:
        user_out = create_user(
            name=prof["name"],
            email=prof["email"],
            password=prof["password"],
            education=prof["education"],
        )
    else:
        user_out = UserOut(
            id=user["id"],
            name=user["name"],
            email=user["email"],
            education=user["education"],
            created_at=user["created_at"],
        )

    # Evaluate answers & save assessment
    answers: AssessmentAnswers = prof["answers"]
    result = evaluate_assessment(answers)
    save_assessment(user_out.id, answers, result)

    # Generate & save roadmap steps
    steps = generate_roadmap_steps(result.recommended_career)
    # Alex and Priya have first stage done, second in progress
    if len(steps) > 1:
        steps[0].status = "done"
        for item in steps[0].items:
            item.done = True
        steps[1].status = "in_progress"
        if len(steps[1].items) > 0:
            steps[1].items[0].done = True
    save_user_roadmap(user_out.id, steps)

    # Seed course progress
    for cid in prof.get("courses_done", []):
        set_course_completion(user_out.id, cid, True)

    # Seed projects
    for pid, st in prof.get("projects_progress", {}).items():
        set_project_status(user_out.id, pid, st)

    # Seed readiness
    for rkey in prof.get("readiness_done", []):
        set_readiness_item(user_out.id, rkey, True)

    return user_out

# Initialize database schema on load
init_db()
