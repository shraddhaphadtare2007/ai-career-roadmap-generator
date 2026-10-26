from typing import List, Dict, Any
from models import RoadmapStep, RoadmapItem

ROADMAP_TEMPLATES: Dict[str, List[Dict[str, Any]]] = {
    "AI/ML Engineer": [
        {
            "stage": 1,
            "title": "Foundation & Mathematics",
            "description": "Master core Python programming, data structures, and the mathematical foundations (linear algebra & calculus).",
            "items": ["Python Fundamentals & OOP", "Git & GitHub Version Control", "Linear Algebra & Matrices", "Multivariable Calculus & Gradients"],
            "project": "Algorithmic Number Guessing & Math Calculator",
            "estimated_weeks": "3 weeks"
        },
        {
            "stage": 2,
            "title": "Data Manipulation & Analytics",
            "description": "Learn to clean, manipulate, and explore real-world datasets with NumPy, Pandas, and Matplotlib.",
            "items": ["NumPy Arrays & Vectorization", "Pandas DataFrames & Aggregations", "Descriptive & Inferential Statistics", "Seaborn Data Visualizations"],
            "project": "Student Academic Performance Analyzer",
            "estimated_weeks": "4 weeks"
        },
        {
            "stage": 3,
            "title": "Classical Machine Learning",
            "description": "Build predictive models with Scikit-Learn across supervised and unsupervised learning techniques.",
            "items": ["Linear & Logistic Regression", "Decision Trees & Random Forests", "Cross-Validation & Hyperparameter Tuning", "Clustering & Dimensionality Reduction (PCA)"],
            "project": "House Price Prediction & Valuation Model",
            "estimated_weeks": "5 weeks"
        },
        {
            "stage": 4,
            "title": "Deep Learning & Neural Networks",
            "description": "Implement modern deep neural networks with PyTorch and TensorFlow for vision and language.",
            "items": ["Multi-Layer Perceptrons & Backpropagation", "Convolutional Neural Networks (CNNs)", "Transfer Learning with Pretrained Models", "Recurrent Networks & Attention Mechanism"],
            "project": "Image Classification Web App (Skin Lesion / Product Recognition)",
            "estimated_weeks": "5 weeks"
        },
        {
            "stage": 5,
            "title": "End-to-End Capstone Project",
            "description": "Develop and deploy a complete production-grade machine learning system.",
            "items": ["Model Serving with FastAPI", "Containerization with Docker", "MLflow / Weights & Biases Experiment Tracking", "Cloud Deployment on AWS or HuggingFace"],
            "project": "Automated Medical Scan Diagnostic API",
            "estimated_weeks": "4 weeks"
        },
        {
            "stage": 6,
            "title": "Portfolio & Open Source",
            "description": "Showcase your technical competence with structured repositories and technical writeups.",
            "items": ["Polished GitHub README with Architecture Diagrams", "Technical Blog Post on Medium/Dev.to", "Interactive Streamlit or Gradio Demo", "LinkedIn Profile Optimization"],
            "project": "Public Interactive Model Showcase",
            "estimated_weeks": "2 weeks"
        },
        {
            "stage": 7,
            "title": "Job & Internship Preparation",
            "description": "Practice coding interviews, machine learning systems design, and apply to target roles.",
            "items": ["LeetCode 75 Python Algorithms", "ML System Design Questions", "Targeted Resume & Cold Outreach Strategy", "Mock Technical Interviews & Salary Negotiation"],
            "project": "Mock Take-Home Technical Assessment",
            "estimated_weeks": "3 weeks"
        }
    ],

    "Data Scientist": [
        {
            "stage": 1,
            "title": "Python & Statistical Thinking",
            "description": "Establish firm grounding in Python, probability theory, hypothesis testing, and exploratory data analysis.",
            "items": ["Python for Data Science", "Probability Distributions & Bayes Theorem", "Hypothesis Testing & p-values", "SQL Queries & Relational Data"],
            "project": "Statistical Distribution Visualizer",
            "estimated_weeks": "3 weeks"
        },
        {
            "stage": 2,
            "title": "Advanced Data Wrangling & Feature Engineering",
            "description": "Transform messy raw datasets into high-signal feature vectors.",
            "items": ["Advanced Pandas & Polars", "Handling Missing Values & Outliers", "Feature Scaling, Encoding & Creation", "Interactive Dashboards with Plotly"],
            "project": "Customer Churn Feature Engineering Pipeline",
            "estimated_weeks": "4 weeks"
        },
        {
            "stage": 3,
            "title": "Applied Predictive Modeling",
            "description": "Train and evaluate statistical and machine learning models for business forecasting.",
            "items": ["Supervised Regression & Classification", "Time Series Forecasting (ARIMA/Prophet)", "Model Explainability with SHAP", "A/B Testing Experiment Design"],
            "project": "E-Commerce Revenue Forecasting System",
            "estimated_weeks": "5 weeks"
        },
        {
            "stage": 4,
            "title": "Machine Learning in Production",
            "description": "Automate data validation, pipeline orchestration, and model evaluation.",
            "items": ["Scikit-Learn Pipelines & ColumnTransformers", "Big Data Basics with PySpark", "Model Monitoring & Data Drift Detection", "Database Integration (PostgreSQL)"],
            "project": "Credit Card Fraud Detection Pipeline",
            "estimated_weeks": "4 weeks"
        },
        {
            "stage": 5,
            "title": "Data Product Capstone",
            "description": "Build an interactive data product that delivers actionable business insights.",
            "items": ["Streamlit Analytics Dashboard", "FastAPI Prediction Endpoint", "Docker Containerization", "Automated Daily Model Retraining"],
            "project": "Hospital Readmission Risk Predictor",
            "estimated_weeks": "4 weeks"
        },
        {
            "stage": 6,
            "title": "Portfolio & Business Case Studies",
            "description": "Turn your findings into executive summaries and polished GitHub repositories.",
            "items": ["Jupyter Notebooks with Executive Summaries", "Kaggle Competitions Participation", "Case Study Presentations", "LinkedIn Networking Strategy"],
            "project": "Comprehensive Market Basket Analysis Case Study",
            "estimated_weeks": "2 weeks"
        },
        {
            "stage": 7,
            "title": "Interview & Job Preparation",
            "description": "Prepare for data challenges, SQL live coding, and business case interviews.",
            "items": ["Advanced SQL LeetCode/StrataScratch", "Data Case Study Interviews", "Behavioral & Leadership Principles", "Targeted Internship Applications"],
            "project": "Live Take-Home Data Challenge Defense",
            "estimated_weeks": "3 weeks"
        }
    ],

    "Data Analyst": [
        {
            "stage": 1,
            "title": "Spreadsheets & Analytics Basics",
            "description": "Master advanced Excel/Google Sheets, business metrics, and fundamental statistical indicators.",
            "items": ["Excel Advanced Formulas & VLOOKUP/XLOOKUP", "Pivot Tables & Dynamic Charts", "Key Performance Indicators (KPIs)", "Descriptive Statistics"],
            "project": "Sales Performance Executive Spreadsheet",
            "estimated_weeks": "3 weeks"
        },
        {
            "stage": 2,
            "title": "SQL for Data Exploration",
            "description": "Query relational databases with complex joins, window functions, and aggregations.",
            "items": ["SELECT, WHERE, GROUP BY, HAVING", "INNER, LEFT, RIGHT, FULL JOINS", "Subqueries & Common Table Expressions (CTEs)", "Window Functions (RANK, ROW_NUMBER, LAG)"],
            "project": "Retail Customer Lifetime Value Queries",
            "estimated_weeks": "4 weeks"
        },
        {
            "stage": 3,
            "title": "Business Intelligence & Dashboards",
            "description": "Build interactive executive dashboards in Power BI or Tableau.",
            "items": ["Data Modeling & Star Schemas", "DAX Formulas & Calculations", "Dashboard Design & Storytelling", "Automated Report Scheduling"],
            "project": "Executive SaaS Subscription Dashboard",
            "estimated_weeks": "4 weeks"
        },
        {
            "stage": 4,
            "title": "Python for Analysts",
            "description": "Automate data cleaning and perform quick visualizations with Python.",
            "items": ["Python Basics for Automation", "Pandas Data Cleaning", "Seaborn & Plotly Charts", "Exporting Insights to Slides/PDF"],
            "project": "Automated Weekly Metrics Email Reporter",
            "estimated_weeks": "4 weeks"
        },
        {
            "stage": 5,
            "title": "End-to-End Business Analytics Project",
            "description": "Analyze an entire company dataset and deliver actionable recommendations.",
            "items": ["Define Business Problem & Stakeholder Goals", "Clean & Merge Multi-Source Data", "Synthesize Strategic Recommendations", "Create Live Dashboard"],
            "project": "Supply Chain Bottleneck Analysis & Dashboard",
            "estimated_weeks": "4 weeks"
        },
        {
            "stage": 6,
            "title": "Portfolio & Presentation",
            "description": "Document your analysis and create a portfolio that business managers can immediately appreciate.",
            "items": ["Tableau Public / Power BI Portfolio", "GitHub Documentation with PDF Reports", "Loom Video Walkthrough of Dashboards", "LinkedIn Project Showcases"],
            "project": "Public Business Intelligence Portfolio",
            "estimated_weeks": "2 weeks"
        },
        {
            "stage": 7,
            "title": "Job Hunt & Case Studies",
            "description": "Prepare for SQL live coding tests and business stakeholder presentations.",
            "items": ["50 Practice SQL Queries", "Business Metric Case Interviews", "Resume Tailoring for Analyst Roles", "Applying to 30+ Entry Roles"],
            "project": "Mock Stakeholder Presentation",
            "estimated_weeks": "3 weeks"
        }
    ],

    "Generative AI Developer": [
        {
            "stage": 1,
            "title": "Python & Modern AI APIs",
            "description": "Master Python async programming and understand foundational LLM API integration.",
            "items": ["Python Async & Type Hints", "OpenAI, Anthropic & Gemini API Integration", "Prompt Engineering Techniques", "Tokenization & Context Windows"],
            "project": "AI Smart Summarizer & Copywriting Tool",
            "estimated_weeks": "3 weeks"
        },
        {
            "stage": 2,
            "title": "Embeddings & Vector Databases",
            "description": "Harness semantic search using text embeddings and vector databases.",
            "items": ["Vector Embeddings Concepts", "ChromaDB, Pinecone & FAISS", "Semantic Search & Similarity Scores", "Data Ingestion & Chunking Strategies"],
            "project": "Personal Document Search Engine",
            "estimated_weeks": "4 weeks"
        },
        {
            "stage": 3,
            "title": "Retrieval Augmented Generation (RAG)",
            "description": "Build production-ready RAG architectures with LangChain and LlamaIndex.",
            "items": ["LangChain LCEL & Chains", "LlamaIndex Document Indexing", "Hybrid Search & Re-ranking", "Evaluation with Ragas Framework"],
            "project": "Knowledge Base Q&A Bot for Technical Manuals",
            "estimated_weeks": "5 weeks"
        },
        {
            "stage": 4,
            "title": "Autonomous AI Agents & Tool Calling",
            "description": "Construct autonomous multi-step agents that call APIs, execute code, and browse.",
            "items": ["Function Calling & Structured Outputs", "ReAct & Tool Use Patterns", "LangGraph for State Machines", "Memory & Long-term Persistence"],
            "project": "Autonomous Research & Report-Writing Agent",
            "estimated_weeks": "5 weeks"
        },
        {
            "stage": 5,
            "title": "Full-Stack GenAI Application",
            "description": "Ship an interactive web application powered by streaming generative AI.",
            "items": ["FastAPI Streaming Responses", "React & Tailwind Chat UI", "User Authentication & Rate Limiting", "Production Deployment on Vercel/Railway"],
            "project": "Full-Stack AI Code Reviewer with Instant Feedback",
            "estimated_weeks": "4 weeks"
        },
        {
            "stage": 6,
            "title": "Fine-Tuning & Open Source LLMs",
            "description": "Run and fine-tune open weights models locally with Ollama and HuggingFace.",
            "items": ["Ollama & Local Model Execution", "LoRA & QLoRA Fine-Tuning Concepts", "HuggingFace Transformers", "Guardrails & Safety Filters"],
            "project": "Specialized Customer Support Fine-Tuned Model",
            "estimated_weeks": "3 weeks"
        },
        {
            "stage": 7,
            "title": "Career Readiness & Portfolio",
            "description": "Demonstrate live generative AI systems to recruiters and engineering managers.",
            "items": ["Live Deployed Web Demos", "Architecture Diagrams on GitHub", "LLM System Design Mock Interviews", "Targeted GenAI Engineering Applications"],
            "project": "Public GenAI Production Portfolio",
            "estimated_weeks": "3 weeks"
        }
    ],

    "Software Developer": [
        {
            "stage": 1,
            "title": "Programming & CS Fundamentals",
            "description": "Learn algorithmic thinking, clean code conventions, and Git version control.",
            "items": ["Modern JavaScript/TypeScript or Python", "Data Structures (Arrays, HashMaps, Trees)", "Algorithms (Sorting, Searching)", "Git & Branching Workflows"],
            "project": "Interactive Task Manager CLI with File Persistence",
            "estimated_weeks": "4 weeks"
        },
        {
            "stage": 2,
            "title": "Frontend Development with React",
            "description": "Build responsive, accessible user interfaces with modern React.",
            "items": ["React Components, Props & State", "Hooks (useEffect, useState, useMemo)", "Tailwind CSS & Responsive Layouts", "Client-Side Routing & TanStack Query"],
            "project": "Kanban Project Management Board",
            "estimated_weeks": "4 weeks"
        },
        {
            "stage": 3,
            "title": "Backend Engineering & REST APIs",
            "description": "Build secure, resilient backend microservices with databases.",
            "items": ["Node/Express or Python FastAPI", "RESTful API Standards & Status Codes", "PostgreSQL & Relational Data Modeling", "JWT & Session-Based Authentication"],
            "project": "Multi-Tenant E-Commerce REST API",
            "estimated_weeks": "5 weeks"
        },
        {
            "stage": 4,
            "title": "Testing & Code Quality",
            "description": "Ensure reliability with automated unit, integration, and end-to-end testing.",
            "items": ["Unit Testing with Jest/PyTest", "API Integration Testing", "Input Validation & Error Handling", "Clean Architecture Principles"],
            "project": "Test-Driven Banking Transaction Service",
            "estimated_weeks": "3 weeks"
        },
        {
            "stage": 5,
            "title": "Full-Stack Production Capstone",
            "description": "Architect, build, and deploy an end-to-end web application.",
            "items": ["Full-Stack React + Node/FastAPI + Postgres", "Real-Time WebSockets or SSE", "Docker Containerization", "CI/CD Pipeline with GitHub Actions"],
            "project": "Collaborative Real-Time Workspace App",
            "estimated_weeks": "5 weeks"
        },
        {
            "stage": 6,
            "title": "Deployment, Cloud & DevOps",
            "description": "Deploy to modern cloud providers with monitoring and scalability.",
            "items": ["Cloud Deployment (Render/AWS/Vercel)", "Nginx & Reverse Proxies", "Database Migrations & Backups", "Logging & Error Monitoring"],
            "project": "Production Cloud Deployment with Custom Domain",
            "estimated_weeks": "2 weeks"
        },
        {
            "stage": 7,
            "title": "Technical Interviews & Hiring",
            "description": "Master data structures & algorithms and technical communication.",
            "items": ["LeetCode Medium Blind 75", "System Design Basics", "Mock Technical Interviews", "Software Engineering Job Applications"],
            "project": "Comprehensive Full-Stack Portfolio Website",
            "estimated_weeks": "3 weeks"
        }
    ],

    "UI/UX Designer": [
        {
            "stage": 1,
            "title": "Design Principles & Visual Fundamentals",
            "description": "Understand typography, color theory, layout hierarchy, and visual balance.",
            "items": ["Typography Scales & Pairing", "Color Harmonies & Contrast Accessibility (WCAG)", "Grid Systems & White Space", "Design Thinking Methodology"],
            "project": "Visual Style Guide & Typography Palette",
            "estimated_weeks": "3 weeks"
        },
        {
            "stage": 2,
            "title": "Figma Mastery & Component Systems",
            "description": "Master industry-standard Figma tools, Auto Layout, and design systems.",
            "items": ["Figma Auto Layout & Constraints", "Reusable Components & Variants", "Design Tokens & Styles", "Interactive Micro-Animations"],
            "project": "Comprehensive Mobile Banking UI Kit",
            "estimated_weeks": "4 weeks"
        },
        {
            "stage": 3,
            "title": "User Research & Information Architecture",
            "description": "Conduct empathetic user interviews and map intuitive user flows.",
            "items": ["User Personas & Journey Mapping", "Card Sorting & Information Architecture", "Wireframing (Low-Fidelity to High-Fidelity)", "Competitor Benchmarking Analysis"],
            "project": "Fitness App User Flow & Low-Fi Wireframes",
            "estimated_weeks": "4 weeks"
        },
        {
            "stage": 4,
            "title": "Interactive Prototyping & Usability Testing",
            "description": "Test dynamic prototypes with real users to identify usability flaws.",
            "items": ["High-Fidelity Interactive Prototypes", "Usability Testing Sessions & Metrics", "Affinity Diagrams & Iterative Refinement", "Micro-Interactions & Transitions"],
            "project": "Tested & Validated Food Delivery Prototype",
            "estimated_weeks": "4 weeks"
        },
        {
            "stage": 5,
            "title": "Design to Code & Frontend Basics",
            "description": "Learn HTML, CSS, and how developers translate designs into products.",
            "items": ["HTML5 Semantic Structure", "CSS Flexbox & Grid Layouts", "Developer Handoff Specifications", "Responsive Web Breakpoints"],
            "project": "Coded Landing Page from Personal Figma Design",
            "estimated_weeks": "4 weeks"
        },
        {
            "stage": 6,
            "title": "Case Studies & Portfolio",
            "description": "Document your problem-solving process in 3 comprehensive case studies.",
            "items": ["3 In-Depth Case Studies (Problem, Process, Solution, Impact)", "Portfolio Website (Framer / Webflow / Custom)", "Case Study Presentation Decks", "Behance & Dribbble Showcases"],
            "project": "Published UX Portfolio Website with 3 Case Studies",
            "estimated_weeks": "3 weeks"
        },
        {
            "stage": 7,
            "title": "Design Challenges & Interview Preparation",
            "description": "Prepare for whiteboard design challenges and portfolio walkthroughs.",
            "items": ["Whiteboard Design Challenge Practice", "Portfolio Walkthrough Presentations", "App Critique Exercises", "Design Agency & Tech Startup Applications"],
            "project": "Mock Whiteboard Challenge Walkthrough",
            "estimated_weeks": "3 weeks"
        }
    ],

    "Cybersecurity Analyst": [
        {
            "stage": 1,
            "title": "Computer Networking & Operating Systems",
            "description": "Understand TCP/IP, DNS, routing, Linux command line, and Windows internals.",
            "items": ["OSI Model & TCP/IP Protocols", "Linux CLI & File Permissions", "Windows Registry & Active Directory Basics", "Wireshark Packet Analysis"],
            "project": "Home Lab Network Packet Capture & Analysis",
            "estimated_weeks": "4 weeks"
        },
        {
            "stage": 2,
            "title": "Security Fundamentals & Threat Landscape",
            "description": "Learn the CIA triad, vulnerability types, malware analysis, and MITRE ATT&CK.",
            "items": ["CIA Triad & Access Controls", "Common Vulnerabilities & Exposures (CVE)", "MITRE ATT&CK Framework Mapping", "OWASP Top 10 Web Vulnerabilities"],
            "project": "OWASP Top 10 Security Audit Report",
            "estimated_weeks": "4 weeks"
        },
        {
            "stage": 3,
            "title": "Security Operations Center (SOC) Tools",
            "description": "Analyze security logs and configure SIEM and IDS/IPS systems.",
            "items": ["Splunk & Elastic SIEM Log Analysis", "Snort / Suricata IDS Configuration", "Endpoint Detection & Response (EDR)", "Incident Response Playbooks"],
            "project": "Splunk Attack Detection & Alerting Lab",
            "estimated_weeks": "5 weeks"
        },
        {
            "stage": 4,
            "title": "Ethical Hacking & Vulnerability Assessment",
            "description": "Perform legal vulnerability scans and basic penetration testing in virtual labs.",
            "items": ["Nmap Network Scanning", "Burp Suite Web Proxy Testing", "Metasploit Basics in Virtual Labs", "Vulnerability Remediation Reporting"],
            "project": "TryHackMe / HackTheBox Machine Pwn Writeup",
            "estimated_weeks": "5 weeks"
        },
        {
            "stage": 5,
            "title": "Security Automation & Python",
            "description": "Automate threat detection, port scanning, and report generation using Python.",
            "items": ["Python Socket Programming", "Log Parsing & Regex Automation", "API Security Testing", "Automated Compliance Audits"],
            "project": "Automated Port & Vulnerability Scanner Tool",
            "estimated_weeks": "4 weeks"
        },
        {
            "stage": 6,
            "title": "Certifications & Home Lab Portfolio",
            "description": "Document your virtual home lab and prepare for industry certifications.",
            "items": ["Documented Virtual Home Lab Architecture", "CompTIA Security+ or BJT Preparation", "GitHub Scripts & Attack Writeups", "LinkedIn Cyber Community Engagement"],
            "project": "Comprehensive Home Lab Documentation & SOC Setup",
            "estimated_weeks": "3 weeks"
        },
        {
            "stage": 7,
            "title": "SOC Analyst Job Preparation",
            "description": "Practice technical scenario questions and apply for SOC / Junior Security roles.",
            "items": ["Scenario-Based Incident Response Questions", "Technical Log Analysis Live Tests", "Resume Optimization for Security Clearance/Private SOC", "Security Analyst Applications"],
            "project": "Mock Incident Response Triage Challenge",
            "estimated_weeks": "3 weeks"
        }
    ]
}

def generate_roadmap_steps(career: str) -> List[RoadmapStep]:
    template = ROADMAP_TEMPLATES.get(career, ROADMAP_TEMPLATES["AI/ML Engineer"])
    steps: List[RoadmapStep] = []
    
    for i, t in enumerate(template):
        step_id = f"step_{i+1}"
        status = "in_progress" if i == 0 else "locked"
        items = [
            RoadmapItem(id=f"{step_id}_item_{j+1}", label=label, done=False)
            for j, label in enumerate(t["items"])
        ]
        steps.append(
            RoadmapStep(
                id=step_id,
                stage=t["stage"],
                title=t["title"],
                description=t["description"],
                status=status,
                items=items,
                project=t.get("project"),
                estimated_weeks=t.get("estimated_weeks")
            )
        )
    return steps
