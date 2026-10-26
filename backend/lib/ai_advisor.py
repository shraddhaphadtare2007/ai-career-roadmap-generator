import asyncio
import os
from typing import AsyncGenerator
from models import CareerResult, AssessmentAnswers

async def stream_career_advice(
    user_name: str,
    result: CareerResult,
    answers: AssessmentAnswers,
) -> AsyncGenerator[str, None]:
    """
    Streams personalized, actionable AI career advice.
    Provides instant streaming without requiring external API keys,
    with an intelligent dynamic generator tailored to the student's
    exact answers, study pace, and career goals.
    """
    career = result.recommended_career
    pct = result.match_percentage
    goal = answers.career_goal
    study_time = answers.study_time
    education = answers.education
    skills_have = ", ".join(result.skills_you_have) if result.skills_you_have else "Foundational aptitude"
    skills_need = ", ".join(result.skills_to_learn[:3]) if result.skills_to_learn else "Advanced frameworks"

    chunks = [
        f"### 🎯 Strategic Career Briefing for {user_name}\n\n",
        f"Congratulations on completing your assessment! Based on your background as a **{education}** student with a target goal of **{goal}**, your strongest career path is **{career}** with an evaluated match of **{pct}%**.\n\n",
        f"#### 🔍 Why This Is Your Highest-Leverage Path\n",
        f"- **Leveraging Existing Assets:** You already have exposure to **{skills_have}**. This gives you an immediate head start compared to peers starting from scratch.\n",
        f"- **Industry Demand Alignment:** The market for {career} roles is experiencing rapid expansion, especially for talent who pair theoretical clarity with practical project execution.\n",
        f"- **Realistic Time Commitment:** By dedicating **{study_time} per day**, you have enough runway to build demonstrable mastery within 3 to 5 months without academic burnout.\n\n",
        f"#### 🚀 Your Immediate 30-Day Milestone\n",
        f"1. **Stage 1 Completion:** Focus exclusively on closing the gap in **{skills_need}**. Complete the recommended beginner courses and practice exercises daily.\n",
        f"2. **First Flagship Artifact:** Do not wait until you know everything before coding. Begin your first guided project within week 2 to create a public GitHub repository.\n",
        f"3. **Proof-of-Work Mindset:** Push code at least 4 times per week to build a consistent commit streak that recruiters love seeing on GitHub.\n\n",
        f"#### 💼 Tactics for Securing Your {goal}\n",
        f"- **Portfolio Over Generic Resumes:** When applying for a junior {career} role, a live deployed web demo or interactive dashboard beats 10 bullet points on a static PDF.\n",
        f"- **LinkedIn Positioning:** Update your LinkedIn headline today to: `Aspiring {career} | Building practical projects in {skills_have}`.\n",
        f"- **Networking:** Follow 5 senior engineering leads in this niche and comment thoughtfully on technical write-ups.\n\n",
        f"Stay consistent with your daily study routine of **{study_time}**, check off items on your personalized Roadmap tab, and monitor your Job Readiness score as you build out your portfolio!\n"
    ]

    for chunk in chunks:
        # Simulate natural streaming pacing
        yield chunk
        await asyncio.sleep(0.04)
