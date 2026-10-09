export interface CandidateApplication {
  id: string
  name: string
  initials: string
  role: string
  interviewTime: string
  interviewDuration: string
  resumeFileName: string
  resumeUrl: string
  jobDescription: string
}

export const candidateApplication: CandidateApplication = {
  id: "akhil-mathew",
  name: "Akhil Mathew",
  initials: "AM",
  role: "Graduate Software Engineer",
  interviewTime: "10:30 AM",
  interviewDuration: "45 min",
  resumeFileName: "AkhilMATHEW.pdf",
  resumeUrl: "/AkhilMATHEW.pdf",
  jobDescription: `Graduate Software Engineer

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
- Exposure to Docker or Kubernetes is useful but not essential.`,
}
