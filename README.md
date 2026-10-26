# AI Career Roadmap 🚀

> **College Entrepreneurship Project MVP Prototype**  
> *"Discover the right career path. Learn the right skills. Build your future."*

AI Career Roadmap is a full-stack, personalized web platform that guides college students, fresh graduates, and career switchers toward suitable AI and technology careers. Based on an 8-question diagnostic assessment, the engine computes career match percentages and generates a step-by-step 7-stage roadmap, skill gap analysis, curated courses, portfolio project recommendations, and internship readiness tracking.

---

## 🌟 Key Features

1. **Persistent Relational Database & Authentication**
   - Full email/password registration, login, logout, and protected sessions.
   - Persistent SQLite database storing users, assessments, roadmap milestones, course completions, project statuses, and readiness metrics.

2. **Personalized Recommendation Engine**
   - Evaluates student interest, current skills, skill level, daily study time, enjoyment, and career goals.
   - Accurately scores and ranks **7 distinct high-demand career paths**:
     1. AI/ML Engineer
     2. Data Scientist
     3. Data Analyst
     4. Generative AI Developer
     5. Software Developer
     6. UI/UX Designer
     7. Cybersecurity Analyst
   - Returns top matches, match percentage, and customized "Why this career?" reasoning.

3. **7-Stage Actionable Career Roadmap**
   - Stage 1: Foundation
   - Stage 2: Core Skills
   - Stage 3: Intermediate Skills
   - Stage 4: Advanced Skills
   - Stage 5: Flagship Projects
   - Stage 6: Portfolio & Profiles
   - Stage 7: Job & Internship Preparation
   - Live interactive checkboxes and stage-unlocking logic.

4. **Skill Gap Analysis**
   - Compares student's current proficiency against junior hiring baselines.
   - Dual-progress visual bars highlighting remaining gaps with direct course links.

5. **Curated Course Library & Project Tracking**
   - 30+ categorized free and professional courses (Coursera, edX, fast.ai, freeCodeCamp, Udemy).
   - Flagship portfolio projects from Beginner to Advanced with tech stacks.
   - Mark courses completed and update project statuses (*Not Started*, *In Progress*, *Completed*).

6. **Internship & Job Readiness Checklist**
   - 7 core career readiness metrics (ATS Resume, GitHub portfolio, LinkedIn, LeetCode, Mock interviews).
   - Dynamic readiness score calculation and sample internship listings.

7. **Real-Time Streaming AI Career Advisor**
   - Streams personalized strategic briefings, 30-day action plans, and portfolio advice tailored to the student's profile.

8. **1-Click Demo Profiles (For Instant Live Presentation)**
   - Pre-loaded with realistic profiles so you can present immediately without typing:
     - **Alex Chen** (3rd Year) ➔ *AI/ML Engineer* (87% Match)
     - **Priya Sharma** (Final Year) ➔ *Generative AI Developer* (92% Match)
     - **Rohan Patel** (2nd Year) ➔ *Data Analyst* (84% Match)
     - **Sam Taylor** (Graduate) ➔ *Cybersecurity Analyst* (89% Match)

---

## 🛠️ Tech Stack

- **Frontend:**
  - React 19 + TypeScript
  - Vite
  - Tailwind CSS v4
  - Lucide React Icons
  - TanStack React Query (Server State Management)
  - React Router v7
  - Sonner Toast Notifications

- **Backend:**
  - FastAPI (Python)
  - Pydantic v2
  - Uvicorn (ASGI Server)
  - RESTful API with cookie session management

- **Database:**
  - SQLite3 (Persistent with WAL journal mode, zero external configuration required)

---

## 📂 Project Structure

```
ai-career-roadmap/
├── run.bat                 # One-click Windows launch batch script
├── run.ps1                 # One-click PowerShell launch script
├── README.md               # Project documentation
├── .gitignore
│
├── backend/
│   ├── main.py             # FastAPI server & route handlers
│   ├── database.py         # SQLite schema, session handling & persistence
│   ├── models.py           # Pydantic data schemas
│   ├── requirements.txt    # Python dependencies
│   └── lib/
│       ├── careers.py      # Scoring engine & skill gap rules
│       ├── roadmaps.py     # 7-stage roadmap templates for all 7 careers
│       ├── courses_data.py # Curated courses catalog
│       ├── projects_data.py# Portfolio projects library
│       ├── readiness_data.py# Job readiness checklist & opportunities
│       └── ai_advisor.py   # Streaming AI career advice generator
│
└── frontend/
    ├── package.json        # Frontend dependencies & scripts
    ├── vite.config.ts      # Vite config with /api proxy to backend:8001
    ├── tsconfig.json
    ├── index.html
    └── src/
        ├── App.tsx         # Route configuration
        ├── main.tsx
        ├── index.css       # Tailwind CSS v4 setup
        ├── components/
        │   ├── AppShell.tsx# Navigation bar, mobile drawer & footer
        │   ├── Progress.tsx# Match Donut, DualBar, ProgressBar
        │   ├── RequireAuth.tsx
        │   └── ui/         # Modern UI primitives (buttons, cards, badges, tabs)
        ├── lib/
        │   ├── api.ts      # API fetch client & streaming helper
        │   ├── auth.ts     # User authentication hooks
        │   ├── questions.ts# 8 assessment questions & options
        │   └── types.ts    # TypeScript interfaces
        └── pages/
            ├── Landing.tsx     # Homepage with hero, features & demo cards
            ├── Assessment.tsx  # Multi-step 8-question assessment flow
            ├── Results.tsx     # Career recommendation & streaming AI advice
            ├── Dashboard.tsx   # Student progress command center
            ├── Roadmap.tsx     # Interactive 7-stage career checklist
            ├── Skills.tsx      # Skill gap matrix
            ├── Courses.tsx     # Recommended courses catalog
            ├── Projects.tsx    # Guided portfolio projects
            ├── Internships.tsx # Job readiness checklist & opportunities
            ├── Profile.tsx     # Student profile & career summary
            ├── Demo.tsx        # Persona selector
            ├── Login.tsx       # Account authentication
            └── Register.tsx    # Student account creation
```

---

## 🚀 How to Run Locally

### Option 1: Automatic 1-Click Launch (Recommended on Windows)
Simply double-click `run.bat` or run PowerShell:
```powershell
.\run.ps1
```
This automatically installs dependencies and opens both the backend server on `http://127.0.0.1:8001` and the frontend application on `http://localhost:5173`.

---

### Option 2: Manual Terminal Launch

#### Step 1: Start Backend (FastAPI)
Open a terminal in the `backend/` folder:
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn main:app --host 127.0.0.1 --port 8001 --reload
```
*Backend API interactive documentation will be live at: [http://127.0.0.1:8001/docs](http://127.0.0.1:8001/docs)*

#### Step 2: Start Frontend (React + Vite)
Open a second terminal in the `frontend/` folder:
```bash
cd frontend
npm install
npm run dev
```
*Frontend will be live at: [http://localhost:5173](http://localhost:5173)*

---

## 🎯 Presentation & Demo Script (For Tomorrow)

1. **Landing Page:**
   - Open [http://localhost:5173](http://localhost:5173).
   - Highlight the value proposition: *"Bridging the gap between college education and industry requirements through data-driven career roadmaps."*
   - Show the 4 persona quick-login cards at the bottom of the landing page.

2. **Instant Demo Persona Test:**
   - Click **"Demo as Alex (AI/ML)"** or go to the `/demo` page.
   - Point out that Alex is already loaded with real persistent progress (32% complete, Stage 1 finished, 1 course completed, 1 project in progress).

3. **Fresh Student Assessment Flow:**
   - Click **Log Out**, then click **"Get Started"** or **"Sign Up"**.
   - Create a new account with your own name.
   - Click **"Take Assessment"** and answer the 8 interactive questions.
   - Watch the recommendation engine instantly evaluate your answers and display:
     - Recommended Career (*e.g., Generative AI Developer*)
     - Evaluated Match Percentage (*e.g., 91%*)
     - Specific personalized reasons based on the answers given.
   - Click **"Generate AI Advice"** to show real-time streaming guidance.

4. **Deep Dive into Features:**
   - **Roadmap:** Show how checking off items saves persistently to the database and unlocking the next stage.
   - **Skill Gap:** Show the visual gap between student knowledge and employer expectations.
   - **Projects & Courses:** Toggle a course as complete, update a project to "In Progress", and show the Dashboard counters update in real time.
   - **Internship Readiness:** Check off resume and GitHub items to see the readiness percentage climb.

---

## 📤 How to Push to GitHub

To publish this project to your GitHub account:

1. Open a terminal in the root directory:
```bash
cd C:\Users\Lenovo\.gemini\antigravity\scratch\ai-career-roadmap
```

2. Initialize git and commit:
```bash
git init
git add .
git commit -m "feat: complete AI Career Roadmap full-stack prototype"
```

3. Create a new repository on [GitHub](https://github.com/new) named `ai-career-roadmap`.

4. Link and push:
```bash
git branch -M main
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/ai-career-roadmap.git
git push -u origin main
```

---

## 📄 License
MIT License - Created for College Entrepreneurship Prototype Demonstration.
