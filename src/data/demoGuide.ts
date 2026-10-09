import type { InterviewGuide } from "@shared/guide"

export const demoResumeText = `Akhil Mathew
Auckland, New Zealand

EDUCATION
Master of Information Technology, University of Auckland
Bachelor of Engineering in Computer Science

EXPERIENCE
Backend Developer Intern
- Built REST APIs for users, books, borrowing and return workflows in a library management system.
- Implemented authentication and integrated MySQL data storage.
- Debugged API behaviour, wrote tests and worked with teammates to resolve defects.

PROJECTS
- Built full-stack applications using React, TypeScript, Node.js and Express.
- Designed data models using MySQL and MongoDB.
- Deployed frontend assets using AWS S3 and CloudFront.
- Delivered software projects in collaborative university teams.

ADDITIONAL EXPERIENCE
- Customer-facing work requiring clear communication, active listening and problem resolution.

SKILLS
JavaScript, TypeScript, React, Node.js, Express, Python, C++, MySQL, MongoDB, AWS S3, CloudFront, Git, testing and debugging.`

export const demoJobDescription = `Graduate Software Engineer

We are looking for a curious graduate engineer to join our product development team.

Responsibilities and requirements:
- Build accessible user interfaces using JavaScript or TypeScript and React.
- Develop and maintain backend APIs.
- Work with relational or NoSQL databases.
- Debug, test and improve application reliability.
- Contribute to cloud-hosted software and learn modern deployment practices.
- Collaborate effectively with engineers, product partners and customers.
- Communicate technical ideas clearly.
- Show a strong willingness to learn and respond to feedback.
- Exposure to Docker or Kubernetes is useful but not essential.`

export const demoGuide: InterviewGuide = {
  candidateName: "Akhil Mathew",
  role: "Graduate Software Engineer",
  summary: "Akhil is a Master of Information Technology student at the University of Auckland with hands-on experience across backend development, full-stack applications, databases and cloud delivery. He has built REST APIs, worked with React and TypeScript, used relational and NoSQL databases, and deployed frontend assets through AWS S3 and CloudFront. The interview should explore the depth of his API design decisions and validate his production cloud and container knowledge.",
  strengths: [
    { area: "Backend API development", evidence: "Built REST endpoints for users, books, borrowing and return workflows during a backend internship.", source: "resume" },
    { area: "React and TypeScript", evidence: "Delivered full-stack and frontend projects using React and TypeScript.", source: "resume" },
    { area: "Database experience", evidence: "Used MySQL and MongoDB across internship and project work.", source: "resume" },
    { area: "Communication", evidence: "Customer-facing experience required active listening, clear communication and problem resolution.", source: "resume" },
  ],
  areasToValidate: [
    { requirement: "Production cloud deployment", reason: "The role needs cloud exposure, but the resume only demonstrates static asset delivery.", candidateEvidence: "Used AWS S3 and CloudFront; no production backend deployment is described." },
    { requirement: "Docker or Kubernetes", reason: "Container experience is useful for the role and is not mentioned in the resume.", candidateEvidence: "No Docker or Kubernetes evidence provided in the resume." },
  ],
  requirementMatches: [
    { requirement: "JavaScript / TypeScript and React", candidateEvidence: "Built frontend and full-stack projects using React and TypeScript.", evidenceLevel: "strong" },
    { requirement: "Backend API development", candidateEvidence: "Developed REST APIs for a library management workflow during an internship.", evidenceLevel: "strong" },
    { requirement: "Database experience", candidateEvidence: "Worked with MySQL and MongoDB in practical projects.", evidenceLevel: "moderate" },
    { requirement: "Cloud exposure", candidateEvidence: "Deployed frontend assets with AWS S3 and CloudFront.", evidenceLevel: "weak" },
    { requirement: "Docker or Kubernetes", candidateEvidence: "No container tooling is mentioned.", evidenceLevel: "missing" },
  ],
  questions: [
    {
      id: "api-workflow",
      category: "technical",
      requirement: "Backend API development",
      candidateEvidence: "Developed REST APIs for users, books, borrowing and returning functionality during a backend internship.",
      question: "You built REST APIs for a library management system during your internship. How did you structure the borrow and return workflow, and what edge cases did you have to handle?",
      reason: "Validates whether Akhil understands API design beyond simply listing REST on his resume.",
    },
    {
      id: "cloud-depth",
      category: "validation",
      requirement: "Cloud deployment experience",
      candidateEvidence: "Used AWS S3 and CloudFront for frontend asset delivery.",
      question: "You’ve worked with AWS S3 and CloudFront. What responsibilities did those services have in your architecture, and how would your approach change if you also needed to deploy a backend API?",
      reason: "Tests the depth of cloud knowledge where the resume provides only partial evidence.",
    },
    {
      id: "typescript",
      category: "technical",
      requirement: "React and TypeScript",
      candidateEvidence: "Built frontend and full-stack projects with React, TypeScript, Firebase and Node.js.",
      question: "In your React projects, where did TypeScript catch a real issue or change how you designed a component? Walk me through the trade-off you made.",
      reason: "Reveals whether TypeScript was used meaningfully and how Akhil reasons about component design.",
    },
    {
      id: "database-choice",
      category: "experience",
      requirement: "Relational and NoSQL databases",
      candidateEvidence: "Worked with MySQL and MongoDB across internship and academic projects.",
      question: "You’ve used both MySQL and MongoDB. Pick one project and explain why its data model suited that database. What would become harder if you switched?",
      reason: "Assesses data-modelling judgment rather than surface-level familiarity with database tools.",
    },
    {
      id: "debugging",
      category: "experience",
      requirement: "Debug and improve software",
      candidateEvidence: "Lists debugging and testing as core responsibilities during his backend internship.",
      question: "Tell me about the most difficult bug you encountered during your backend internship. How did you narrow down the cause, and what did you change to prevent it recurring?",
      reason: "Explores structured problem solving and whether learning became a durable engineering improvement.",
    },
    {
      id: "collaboration",
      category: "behavioural",
      requirement: "Communication and teamwork",
      candidateEvidence: "Highlights teamwork across university projects and customer-facing experience.",
      question: "Describe a time a teammate disagreed with your technical approach. How did you reach a decision, and what did you learn from the outcome?",
      reason: "Provides concrete evidence of communication, openness to feedback and team decision making.",
    },
  ],
}
