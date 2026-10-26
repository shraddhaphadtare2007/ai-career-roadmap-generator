from typing import List, Dict, Any, Tuple
from models import AssessmentAnswers, CareerMatch, CareerResult

CAREERS_META = {
    "AI/ML Engineer": {
        "tagline": "Build intelligent systems that learn from data",
        "description": "Design, build, and deploy machine learning models and intelligent algorithms into production systems.",
        "required_skills": {
            "Python": 90,
            "Machine Learning": 85,
            "Mathematics": 80,
            "Statistics": 75,
            "Deep Learning": 70,
            "SQL": 65,
        },
    },
    "Data Scientist": {
        "tagline": "Turn raw data into decisions and predictions",
        "description": "Analyze complex data sets to discover patterns, train predictive models, and provide strategic business insights.",
        "required_skills": {
            "Python": 85,
            "Statistics": 90,
            "Machine Learning": 75,
            "Mathematics": 85,
            "SQL": 80,
            "Data Visualization": 70,
        },
    },
    "Data Analyst": {
        "tagline": "Find the story hiding in spreadsheets and dashboards",
        "description": "Collect, clean, and visualize data to help stakeholders make informed business decisions through reports and BI tools.",
        "required_skills": {
            "SQL": 90,
            "Statistics": 75,
            "Mathematics": 65,
            "Python": 60,
            "Data Visualization": 85,
            "HTML/CSS": 40,
        },
    },
    "Generative AI Developer": {
        "tagline": "Ship apps powered by LLMs and generative models",
        "description": "Create modern AI applications utilizing Large Language Models, prompt engineering, RAG architectures, and fine-tuning.",
        "required_skills": {
            "Python": 90,
            "Machine Learning": 75,
            "JavaScript": 70,
            "SQL": 65,
            "Deep Learning": 65,
            "HTML/CSS": 50,
        },
    },
    "Software Developer": {
        "tagline": "Design and build the software people use every day",
        "description": "Engineer full-stack web and backend applications, write scalable code, and collaborate in modern software development teams.",
        "required_skills": {
            "JavaScript": 85,
            "Python": 75,
            "Java": 70,
            "C/C++": 65,
            "SQL": 75,
            "HTML/CSS": 80,
        },
    },
    "UI/UX Designer": {
        "tagline": "Craft interfaces people love to use",
        "description": "Research user behaviors, design wireframes and high-fidelity interactive prototypes, and create accessible user experiences.",
        "required_skills": {
            "Figma/UI Design": 95,
            "HTML/CSS": 70,
            "JavaScript": 50,
            "Problem solving": 80,
            "Design Research": 85,
            "Prototyping": 90,
        },
    },
    "Cybersecurity Analyst": {
        "tagline": "Defend systems and data against real attackers",
        "description": "Monitor networks, identify system vulnerabilities, respond to security breaches, and safeguard sensitive digital assets.",
        "required_skills": {
            "C/C++": 70,
            "Python": 75,
            "Networking": 90,
            "Linux": 85,
            "SQL": 65,
            "Problem solving": 85,
        },
    },
}

def evaluate_assessment(answers: AssessmentAnswers) -> CareerResult:
    scores = {c: 10 for c in CAREERS_META.keys()}  # base score
    reasons_map: Dict[str, List[str]] = {c: [] for c in CAREERS_META.keys()}

    interests = answers.interests
    skills = answers.skills
    enjoyment = answers.enjoyment

    # AI/ML Engineer
    if "Artificial Intelligence" in interests:
        scores["AI/ML Engineer"] += 6
        reasons_map["AI/ML Engineer"].append("You selected Artificial Intelligence as a primary interest.")
    if "Machine Learning" in interests:
        scores["AI/ML Engineer"] += 6
        reasons_map["AI/ML Engineer"].append("You have strong interest in Machine Learning algorithms.")
    if "Programming" in interests:
        scores["AI/ML Engineer"] += 3
    if "Python" in skills:
        scores["AI/ML Engineer"] += 4
        reasons_map["AI/ML Engineer"].append("You already have Python programming knowledge.")
    if "Mathematics" in skills or "Mathematics and analysis" in enjoyment:
        scores["AI/ML Engineer"] += 4
        reasons_map["AI/ML Engineer"].append("You enjoy mathematics, which is foundational for ML.")
    if "Problem solving" in enjoyment:
        scores["AI/ML Engineer"] += 3
        reasons_map["AI/ML Engineer"].append("You thrive on solving complex algorithmic problems.")
    if "Generative AI" in interests:
        scores["AI/ML Engineer"] += 2

    # Data Scientist
    if "Data Science" in interests:
        scores["Data Scientist"] += 7
        reasons_map["Data Scientist"].append("Data Science is one of your key selected interests.")
    if "Statistics" in skills:
        scores["Data Scientist"] += 5
        reasons_map["Data Scientist"].append("You already possess background in statistics.")
    if "Mathematics" in skills or "Mathematics and analysis" in enjoyment:
        scores["Data Scientist"] += 5
        reasons_map["Data Scientist"].append("You enjoy analyzing mathematical and quantitative patterns.")
    if "Python" in skills:
        scores["Data Scientist"] += 4
        reasons_map["Data Scientist"].append("Your Python proficiency matches modern data science stacks.")
    if "Machine Learning" in interests:
        scores["Data Scientist"] += 4

    # Data Analyst
    if "Data Science" in interests:
        scores["Data Analyst"] += 6
    if "SQL" in skills:
        scores["Data Analyst"] += 6
        reasons_map["Data Analyst"].append("You have SQL database skills, which is the core of data analytics.")
    if "Statistics" in skills:
        scores["Data Analyst"] += 4
        reasons_map["Data Analyst"].append("Your statistical foundation will help formulate actionable insights.")
    if "Mathematics and analysis" in enjoyment:
        scores["Data Analyst"] += 5
        reasons_map["Data Analyst"].append("You love analyzing information and discovering business stories.")
    if "Business/Product" in interests or "Business and management" in enjoyment:
        scores["Data Analyst"] += 5
        reasons_map["Data Analyst"].append("You have strong appreciation for product and business impact.")

    # Generative AI Developer
    if "Generative AI" in interests:
        scores["Generative AI Developer"] += 8
        reasons_map["Generative AI Developer"].append("You are excited about building Generative AI and LLM apps.")
    if "Artificial Intelligence" in interests:
        scores["Generative AI Developer"] += 5
    if "Python" in skills:
        scores["Generative AI Developer"] += 4
        reasons_map["Generative AI Developer"].append("You know Python, the primary language for LangChain and AI APIs.")
    if "Programming" in interests or "Coding" in enjoyment:
        scores["Generative AI Developer"] += 4
        reasons_map["Generative AI Developer"].append("You love hands-on software development.")

    # Software Developer
    if "Programming" in interests:
        scores["Software Developer"] += 7
        reasons_map["Software Developer"].append("Programming and building software is your top interest.")
    dev_langs = [l for l in ["C/C++", "Java", "JavaScript"] if l in skills]
    if dev_langs:
        scores["Software Developer"] += 3 * len(dev_langs)
        reasons_map["Software Developer"].append(f"You already know core languages ({', '.join(dev_langs)}).")
    if "Coding" in enjoyment:
        scores["Software Developer"] += 5
        reasons_map["Software Developer"].append("Coding is what you enjoy doing most every day.")
    if "Problem solving" in enjoyment:
        scores["Software Developer"] += 4

    # UI/UX Designer
    if "Design" in interests:
        scores["UI/UX Designer"] += 8
        reasons_map["UI/UX Designer"].append("You have a natural passion for visual design and user experience.")
    if "Figma/UI Design" in skills:
        scores["UI/UX Designer"] += 8
        reasons_map["UI/UX Designer"].append("You already use Figma for interface design and wireframing.")
    if "Designing" in enjoyment:
        scores["UI/UX Designer"] += 6
        reasons_map["UI/UX Designer"].append("Creating intuitive interfaces is what you enjoy the most.")
    if "HTML/CSS" in skills:
        scores["UI/UX Designer"] += 4
        reasons_map["UI/UX Designer"].append("Knowing HTML/CSS gives you an advantage in design-to-code execution.")

    # Cybersecurity Analyst
    if "Cybersecurity" in interests:
        scores["Cybersecurity Analyst"] += 9
        reasons_map["Cybersecurity Analyst"].append("You are passionate about cybersecurity and defensive systems.")
    if "C/C++" in skills or "Python" in skills:
        scores["Cybersecurity Analyst"] += 4
        reasons_map["Cybersecurity Analyst"].append("You know systems-level programming languages.")
    if "Problem solving" in enjoyment or "Research" in enjoyment:
        scores["Cybersecurity Analyst"] += 5
        reasons_map["Cybersecurity Analyst"].append("Investigative research and troubleshooting suit security analysis.")

    # Bonus based on study time and goals
    study_bonus = 2 if answers.study_time in ["2 hours", "3+ hours"] else 1
    for c in scores:
        scores[c] += study_bonus

    # Normalize scores into percentages (typically between 60% and 95%)
    max_score = max(scores.values())
    ranked = sorted(scores.items(), key=lambda x: x[1], reverse=True)

    top_career, top_score = ranked[0]
    
    # Calculate percentage scale where top is 85-96%
    top_percentage = min(96, max(75, int((top_score / 35.0) * 100)))

    top_matches: List[CareerMatch] = []
    for career, score in ranked[:3]:
        pct = min(98, max(50, int((score / top_score) * top_percentage)))
        top_matches.append(
            CareerMatch(
                career=career,
                percentage=pct,
                tagline=CAREERS_META[career]["tagline"]
            )
        )

    # Determine skills you have vs skills to learn
    required = CAREERS_META[top_career]["required_skills"]
    user_skills_set = set(skills)
    
    skills_you_have = [s for s in required.keys() if s in user_skills_set]
    skills_to_learn = [s for s in required.keys() if s not in user_skills_set]

    # Generate personalized reasons
    reasons = reasons_map[top_career]
    if len(reasons) < 3:
        reasons.append(f"Your commitment to study {answers.study_time} per day fits this roadmap's pacing.")
        reasons.append(f"Your goal to pursue a {answers.career_goal} aligns with junior hiring demand.")

    return CareerResult(
        recommended_career=top_career,
        match_percentage=top_matches[0].percentage,
        top_matches=top_matches,
        reasons=reasons[:4],
        skills_you_have=skills_you_have,
        skills_to_learn=skills_to_learn,
    )

SKILL_CATEGORIES = {
    "Python": "Programming & Languages",
    "C/C++": "Programming & Languages",
    "Java": "Programming & Languages",
    "JavaScript": "Programming & Languages",
    "SQL": "Data & Databases",
    "HTML/CSS": "Web Fundamentals",
    "Mathematics": "Mathematics & Theory",
    "Statistics": "Mathematics & Theory",
    "Machine Learning": "AI & Modeling",
    "Deep Learning": "AI & Modeling",
    "Data Visualization": "Data & Analytics",
    "Figma/UI Design": "Design & UX",
    "Networking": "Security & Systems",
    "Linux": "Security & Systems",
    "Problem solving": "Analytical Thinking",
}

def compute_skills_gap(career: str, user_skills: List[str], skill_level: str) -> SkillsGapResponse:
    from models import SkillGapItem, SkillsGapResponse
    
    meta = CAREERS_META.get(career, CAREERS_META["AI/ML Engineer"])
    reqs = meta["required_skills"]
    user_skills_set = set(user_skills)
    
    level_multiplier = {
        "Advanced": 0.90,
        "Intermediate": 0.70,
        "Beginner": 0.45,
        "Complete Beginner": 0.25,
    }.get(skill_level, 0.50)

    items: List[SkillGapItem] = []
    for skill, required_val in reqs.items():
        category = SKILL_CATEGORIES.get(skill, "Core Technical")
        if skill in user_skills_set:
            current_val = int(required_val * level_multiplier)
            current_val = max(30, min(current_val, 95))
        else:
            current_val = 10 if skill_level in ["Intermediate", "Advanced"] else 0

        if current_val >= required_val:
            status = "Proficient"
        elif current_val >= 35:
            status = "In Progress"
        else:
            status = "Needs Learning"

        items.append(
            SkillGapItem(
                skill=skill,
                category=category,
                current=current_val,
                required=required_val,
                status=status,
            )
        )

    return SkillsGapResponse(career=career, skills=items)

