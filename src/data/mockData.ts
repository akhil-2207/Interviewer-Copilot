import type { LucideIcon } from "lucide-react"
import { CalendarDays, CircleCheckBig, Clock3, WandSparkles } from "lucide-react"

export type InterviewStatus = "Needs preparation" | "Guide ready"

export interface Interview {
  id: string
  name: string
  initials: string
  role: string
  time: string
  duration: string
  status: InterviewStatus
  insight: string
  prominent?: boolean
  avatarTone: string
}

export const stats: Array<{
  label: string
  value: string
  detail: string
  icon: LucideIcon
  tone: string
}> = [
  { label: "Interviews today", value: "3", detail: "Across 3 roles", icon: CalendarDays, tone: "bg-info-soft text-info" },
  { label: "Guides ready", value: "2", detail: "Ready to review", icon: CircleCheckBig, tone: "bg-brand-soft text-[#4B9D30]" },
  { label: "Needs preparation", value: "1", detail: "Akhil · 10:30 AM", icon: WandSparkles, tone: "bg-warning-soft text-warning" },
  { label: "Next interview", value: "10:30", detail: "In 1 hour 12 min", icon: Clock3, tone: "bg-subtle text-secondary" },
]

export const interviews: Interview[] = [
  {
    id: "akhil-mathew",
    name: "Akhil Mathew",
    initials: "AM",
    role: "Graduate Software Engineer",
    time: "10:30 AM",
    duration: "45 min",
    status: "Needs preparation",
    insight: "Strong backend and React experience. Cloud depth needs validation.",
    prominent: true,
    avatarTone: "bg-[#DFF1FF] text-[#23638A]",
  },
  {
    id: "sarah-chen",
    name: "Sarah Chen",
    initials: "SC",
    role: "Frontend Engineer",
    time: "1:00 PM",
    duration: "60 min",
    status: "Guide ready",
    insight: "Strong React and design system experience.",
    avatarTone: "bg-[#F1E8FF] text-[#7451A0]",
  },
  {
    id: "james-lee",
    name: "James Lee",
    initials: "JL",
    role: "Junior DevOps Engineer",
    time: "3:30 PM",
    duration: "45 min",
    status: "Guide ready",
    insight: "Good AWS exposure. Limited production Kubernetes evidence.",
    avatarTone: "bg-[#FFECD8] text-[#996126]",
  },
]

export const candidate = {
  id: "akhil-mathew",
  name: "Akhil Mathew",
  initials: "AM",
  role: "Graduate Software Engineer",
  time: "10:30 AM",
  summary:
    "Akhil is a Master of Information Technology student at the University of Auckland with hands-on experience across backend development, full-stack applications, databases and cloud deployment. He has developed REST APIs, worked with React and TypeScript, used relational and NoSQL databases, and has practical AWS exposure through S3 and CloudFront.",
  experience: [
    { title: "Backend Developer Intern", period: "2025", body: "REST APIs, MySQL, authentication, debugging and testing", icon: "code" },
    { title: "Full-stack / Frontend Projects", period: "2024–25", body: "React, TypeScript, Firebase and Node.js", icon: "layout" },
    { title: "Cloud Experience", period: "Project based", body: "AWS S3 and CloudFront", icon: "cloud" },
  ],
  skills: ["React", "TypeScript", "Node.js", "Express", "Python", "C++", "MySQL", "MongoDB", "AWS"],
  strengths: [
    "REST API development",
    "React and TypeScript",
    "Database experience",
    "Software project delivery",
    "Communication and teamwork",
  ],
  validations: ["Production AWS experience", "Kubernetes exposure", "System design depth"],
  focus: [
    { title: "Backend design", body: "API structure and edge cases", icon: "braces" },
    { title: "Cloud experience", body: "Depth beyond static hosting", icon: "cloud" },
    { title: "Problem solving", body: "Reasoning through ambiguity", icon: "bulb" },
  ],
}

export type EvidenceStrength = "Strong" | "Good" | "Partial"

export const strongAreas: Array<{
  title: string
  requirement: string
  evidence: string
  strength: EvidenceStrength
}> = [
  {
    title: "REST API development",
    requirement: "Build and maintain backend services",
    evidence: "Developed REST APIs for users, books, borrowing and return workflows during a backend internship.",
    strength: "Strong",
  },
  {
    title: "React / TypeScript",
    requirement: "Contribute across the product stack",
    evidence: "Delivered multiple frontend projects using React, TypeScript and Firebase.",
    strength: "Strong",
  },
  {
    title: "Database design",
    requirement: "Work confidently with application data",
    evidence: "Practical project experience with MySQL, MongoDB and data modelling.",
    strength: "Good",
  },
]

export const validationAreas = [
  {
    requirement: "Production cloud experience",
    evidence: "Worked with AWS S3 and CloudFront, but limited evidence of production backend deployment.",
    objective: "Determine depth of cloud architecture knowledge.",
  },
  {
    requirement: "Container orchestration",
    evidence: "Kubernetes is not referenced in the CV or listed projects.",
    objective: "Understand conceptual knowledge and ability to learn unfamiliar infrastructure.",
  },
]

export interface InterviewQuestion {
  id: number
  category: string
  categoryTone: "info" | "warning" | "success" | "neutral"
  requirement: string
  evidence: string
  question: string
  why: string
}

export const questions: InterviewQuestion[] = [
  {
    id: 1,
    category: "Technical",
    categoryTone: "info",
    requirement: "REST API development",
    evidence: "Developed REST APIs for users, books, borrowing and returning functionality during a backend internship.",
    question: "You built REST APIs for a library management system during your internship. How did you structure the borrow and return workflow, and what edge cases did you have to handle?",
    why: "Validates whether Akhil understands API design beyond simply listing REST on his CV.",
  },
  {
    id: 2,
    category: "Cloud validation",
    categoryTone: "warning",
    requirement: "Cloud deployment experience",
    evidence: "Experience using AWS S3 and CloudFront for project delivery.",
    question: "You’ve worked with AWS S3 and CloudFront. What responsibilities did those services have in your architecture, and how would your approach change if you also needed to deploy a backend API?",
    why: "Tests the depth of cloud knowledge where the CV provides only partial evidence.",
  },
  {
    id: 3,
    category: "Technical",
    categoryTone: "info",
    requirement: "React and TypeScript",
    evidence: "Built frontend and full-stack projects with React, TypeScript, Firebase and Node.js.",
    question: "In your React projects, where did TypeScript catch a real issue or change how you designed a component? Walk me through the trade-off you made.",
    why: "Reveals whether TypeScript was used meaningfully and how Akhil reasons about component design.",
  },
  {
    id: 4,
    category: "Data",
    categoryTone: "success",
    requirement: "Relational and NoSQL databases",
    evidence: "Worked with MySQL and MongoDB across internship and academic projects.",
    question: "You’ve used both MySQL and MongoDB. Pick one project and explain why its data model suited that database. What would become harder if you switched?",
    why: "Assesses data modelling judgment rather than surface-level familiarity with database tools.",
  },
  {
    id: 5,
    category: "Problem solving",
    categoryTone: "neutral",
    requirement: "Debug and improve software",
    evidence: "Lists debugging and testing as core responsibilities during his backend internship.",
    question: "Tell me about the most difficult bug you encountered during your backend internship. How did you narrow down the cause, and what did you change to prevent it recurring?",
    why: "Explores structured problem solving and whether learning was converted into a durable engineering improvement.",
  },
  {
    id: 6,
    category: "Collaboration",
    categoryTone: "success",
    requirement: "Communicate and work effectively in a team",
    evidence: "Highlights teamwork across university and software project delivery.",
    question: "Describe a time a teammate disagreed with your technical approach. How did you reach a decision, and what did you learn from the outcome?",
    why: "Gives concrete evidence of communication, openness to feedback and team decision making.",
  },
]

export const loadingSteps = [
  "Reading candidate profile",
  "Matching job requirements",
  "Identifying evidence gaps",
  "Creating personalised questions",
  "Finalising interview guide",
]
