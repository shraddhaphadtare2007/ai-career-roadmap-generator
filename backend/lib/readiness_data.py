from typing import List
from models import ReadinessItem, Opportunity

READINESS_ITEMS_SPEC = [
    {
        "key": "resume",
        "label": "ATS-Optimized Tech Resume tailored to target role",
        "weight": 15,
    },
    {
        "key": "github",
        "label": "Active GitHub profile with 3+ documented repositories & clear READMEs",
        "weight": 15,
    },
    {
        "key": "portfolio",
        "label": "Live portfolio website showcasing flagship projects with demo links",
        "weight": 20,
    },
    {
        "key": "linkedin",
        "label": "Polished LinkedIn profile with complete headline, skills & summary",
        "weight": 15,
    },
    {
        "key": "technical",
        "label": "Practiced 40+ LeetCode / core technical questions and system concepts",
        "weight": 15,
    },
    {
        "key": "mock_interview",
        "label": "Completed at least 2 mock technical & behavioral interviews",
        "weight": 10,
    },
    {
        "key": "applications",
        "label": "Sent out first wave of 10 targeted internship or entry-level applications",
        "weight": 10,
    },
]

SAMPLE_OPPORTUNITIES: List[Opportunity] = [
    # AI/ML Engineer
    Opportunity(
        id="opp-aiml-1",
        role="Machine Learning Research Intern",
        company="Cognitive Dynamics Labs",
        location="Bengaluru, Karnataka (Hybrid)",
        type="Internship (6 Months)",
        stipend="₹35,000 / month",
        career="AI/ML Engineer",
        requirements=["Python", "PyTorch or TensorFlow", "Linear Algebra", "Git"],
    ),
    Opportunity(
        id="opp-aiml-2",
        role="Junior Computer Vision Engineer",
        company="VisionFlow Robotics",
        location="Remote (India)",
        type="Full-time",
        stipend="₹8.5 - 12 LPA",
        career="AI/ML Engineer",
        requirements=["OpenCV", "PyTorch", "Model Quantization", "Docker"],
    ),

    # Data Scientist
    Opportunity(
        id="opp-ds-1",
        role="Data Science Intern",
        company="UrbanPulse Analytics",
        location="Hyderabad, Telangana (Hybrid)",
        type="Internship (3 Months)",
        stipend="₹30,000 / month",
        career="Data Scientist",
        requirements=["Python", "Pandas", "Hypothesis Testing", "SQL"],
    ),
    Opportunity(
        id="opp-ds-2",
        role="Associate Data Scientist",
        company="QuantEdge Financial",
        location="Mumbai, Maharashtra",
        type="Full-time",
        stipend="₹9.0 - 13 LPA",
        career="Data Scientist",
        requirements=["Machine Learning", "Scikit-Learn", "PostgreSQL", "Time Series"],
    ),

    # Data Analyst
    Opportunity(
        id="opp-da-1",
        role="Business Intelligence Intern",
        company="Zomato Growth Ops",
        location="Gurugram / Remote",
        type="Internship (6 Months)",
        stipend="₹28,000 / month",
        career="Data Analyst",
        requirements=["Advanced SQL", "Tableau / Power BI", "Excel Pivot Tables"],
    ),
    Opportunity(
        id="opp-da-2",
        role="Junior Product Data Analyst",
        company="Razorpay Core Payments",
        location="Bengaluru, Karnataka",
        type="Full-time",
        stipend="₹7.0 - 10 LPA",
        career="Data Analyst",
        requirements=["SQL Window Functions", "Data Modeling", "Cohort Analysis", "Metabase"],
    ),

    # Generative AI Developer
    Opportunity(
        id="opp-genai-1",
        role="Generative AI & LLM Intern",
        company="Synthetix AI Studio",
        location="Remote (Global)",
        type="Internship (4 Months)",
        stipend="₹40,000 / month",
        career="Generative AI Developer",
        requirements=["LangChain", "Vector Databases", "Prompt Engineering", "FastAPI"],
    ),
    Opportunity(
        id="opp-genai-2",
        role="Junior AI Solutions Engineer",
        company="HyperScale Cloud Systems",
        location="Bengaluru, Karnataka (Hybrid)",
        type="Full-time",
        stipend="₹10.0 - 14 LPA",
        career="Generative AI Developer",
        requirements=["Python", "RAG Pipelines", "Chroma / Pinecone", "FastAPI / Docker"],
    ),

    # Software Developer
    Opportunity(
        id="opp-swe-1",
        role="Full Stack Engineering Intern",
        company="Nexus Cloud Platforms",
        location="Pune, Maharashtra (Hybrid)",
        type="Internship (6 Months)",
        stipend="₹25,000 / month",
        career="Software Developer",
        requirements=["React", "TypeScript", "Node.js / Express", "PostgreSQL"],
    ),
    Opportunity(
        id="opp-swe-2",
        role="Junior Backend Software Engineer",
        company="FinServe Technologies",
        location="Bengaluru, Karnataka",
        type="Full-time",
        stipend="₹8.0 - 11 LPA",
        career="Software Developer",
        requirements=["REST APIs", "Data Structures", "Docker", "Database Design"],
    ),

    # UI/UX Designer
    Opportunity(
        id="opp-uiux-1",
        role="Product Design Intern",
        company="Swiggy Design Labs",
        location="Bengaluru, Karnataka",
        type="Internship (6 Months)",
        stipend="₹30,000 / month",
        career="UI/UX Designer",
        requirements=["Figma Components", "User Journey Mapping", "Wireframing", "Portfolio"],
    ),
    Opportunity(
        id="opp-uiux-2",
        role="Junior UX / Interaction Designer",
        company="CraftCode Digital",
        location="Remote (India)",
        type="Full-time",
        stipend="₹6.5 - 9.5 LPA",
        career="UI/UX Designer",
        requirements=["Design Systems", "Prototyping", "Usability Testing", "HTML/CSS basics"],
    ),

    # Cybersecurity Analyst
    Opportunity(
        id="opp-cyber-1",
        role="Security Operations Center (SOC) Intern",
        company="SecureSphere Cyber Defense",
        location="Chennai, Tamil Nadu",
        type="Internship (6 Months)",
        stipend="₹25,000 / month",
        career="Cybersecurity Analyst",
        requirements=["Networking (TCP/IP)", "Linux Command Line", "Log Analysis", "SIEM basics"],
    ),
    Opportunity(
        id="opp-cyber-2",
        role="Associate Security Analyst",
        company="TCS Cyber Security Practice",
        location="Hyderabad, Telangana (Hybrid)",
        type="Full-time",
        stipend="₹7.0 - 9 LPA",
        career="Cybersecurity Analyst",
        requirements=["CompTIA Security+ knowledge", "Vulnerability Scanning", "Wireshark", "Python"],
    ),
]
