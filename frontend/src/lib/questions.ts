export interface AssessmentAnswers {
  education: string;
  interests: string[];
  skills: string[];
  skill_level: string;
  enjoyment: string[];
  study_time: string;
  career_goal: string;
  learning_style: string;
}

export interface Question {
  key: keyof AssessmentAnswers;
  title: string;
  help: string;
  multi: boolean;
  options: string[];
}

export const EDUCATION_OPTIONS = [
  "Diploma",
  "First Year College",
  "Second Year College",
  "Third Year College",
  "Final Year College",
  "Graduate",
  "Working Professional",
];

export const QUESTIONS: Question[] = [
  {
    key: "education",
    title: "What is your current education level?",
    help: "This helps us pace your roadmap around your graduation window.",
    multi: false,
    options: EDUCATION_OPTIONS,
  },
  {
    key: "interests",
    title: "What areas are you interested in?",
    help: "Pick everything that excites you — this weighs your career match most.",
    multi: true,
    options: [
      "Artificial Intelligence",
      "Machine Learning",
      "Data Science",
      "Programming",
      "Design",
      "Cybersecurity",
      "Generative AI",
      "Business/Product",
    ],
  },
  {
    key: "skills",
    title: "What skills do you already have?",
    help: "Be honest — the skill gap analysis depends on it. Select None if you're starting fresh.",
    multi: true,
    options: [
      "Python",
      "C/C++",
      "Java",
      "JavaScript",
      "SQL",
      "HTML/CSS",
      "Mathematics",
      "Statistics",
      "Machine Learning",
      "Figma/UI Design",
      "None",
    ],
  },
  {
    key: "skill_level",
    title: "What is your current skill level?",
    help: "A quick self-assessment — there is no wrong answer.",
    multi: false,
    options: [
      "Complete Beginner",
      "Beginner",
      "Intermediate",
      "Advanced",
    ],
  },
  {
    key: "enjoyment",
    title: "What do you enjoy most?",
    help: "Careers stick when the daily work matches what you enjoy.",
    multi: true,
    options: [
      "Coding",
      "Mathematics and analysis",
      "Designing",
      "Problem solving",
      "Research",
      "Business and management",
    ],
  },
  {
    key: "study_time",
    title: "How much time can you study per day?",
    help: "Your roadmap paces each stage around this commitment.",
    multi: false,
    options: [
      "30 minutes",
      "1 hour",
      "2 hours",
      "3+ hours",
    ],
  },
  {
    key: "career_goal",
    title: "What is your main career goal?",
    help: "Stage 7 (job/internship preparation) is tailored to this.",
    multi: false,
    options: [
      "Internship",
      "Job",
      "Freelancing",
      "Higher Studies",
      "Career Exploration",
    ],
  },
  {
    key: "learning_style",
    title: "Which learning style do you prefer?",
    help: "We match courses and resources to how you learn best.",
    multi: false,
    options: [
      "Video learning",
      "Courses",
      "Hands-on projects",
      "Practice exercises",
      "Combination",
    ],
  },
];
