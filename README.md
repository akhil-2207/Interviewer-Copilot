# Interviewer Copilot

Interviewer Copilot turns a candidate resume and job description into an evidence-grounded interview preparation guide for a human interviewer.

The product philosophy is simple:

> AI should help the interviewer ask better questions, not make the hiring decision.

The application never scores, ranks, recommends hiring, or rejects a candidate. It connects job requirements to resume evidence, identifies gaps that need validation, and generates personalised questions with a reason for asking each one.

## The problem

Interviewers often prepare shortly before an interview. They need to understand a candidate's relevant experience, identify what is missing from the resume, and turn both into useful questions quickly.

Generic question generators lose the connection between the role and the candidate. Interviewer Copilot keeps that connection visible:

```text
Candidate resume PDF or pasted resume text
                    +
             Job description
                    |
                    v
              Gemini analysis
                    |
                    v
Evidence-backed summary, requirement matches,
validation areas, and personalised questions
```

## What works

- A recruiter dashboard shows today's scheduled interview, preparation status, next interview time, and guide readiness.
- The candidate page shows the resume submitted with the application and the associated job description.
- Following the dashboard workflow automatically loads the submitted resume PDF—no manual re-upload is required.
- Recruiters can also use **Generate Guide** directly with either:
  - **Upload PDF**
  - **Paste Text**
- The backend sends the actual PDF bytes to Gemini as `application/pdf` multimodal input.
- Gemini returns a structured interview guide containing:
  - candidate and role summary
  - resume-grounded strengths
  - areas requiring validation
  - requirement-to-evidence matches
  - five to seven personalised interview questions
  - candidate evidence, linked requirement, and reason for every question
- The frontend renders only validated structured data; it never renders raw model output.
- Guide readiness and the generated briefing update on the dashboard for the current browser session.

## Main workflows

### Scheduled interview

```text
Dashboard
  -> Candidate details
  -> Submitted PDF and applied role are preloaded
  -> Generate interview guide
  -> Gemini analyses the PDF itself
  -> Live interview guide
  -> Dashboard changes to Guide ready
```

### Standalone preparation

```text
Generate Guide
  -> Upload another PDF or paste resume text
  -> Add job description
  -> Generate live guide
```

## Gemini integration

The backend uses the official [`@google/genai`](https://www.npmjs.com/package/@google/genai) SDK and the model:

```text
gemini-flash-latest
```

For PDF mode, the server:

1. receives `multipart/form-data`;
2. validates PDF type, extension, signature, and the 4 MB deployment-safe limit;
3. keeps the uploaded file in memory;
4. creates an inline `application/pdf` Gemini part from the original bytes;
5. sends that document and the job description in one `generateContent` request;
6. validates the returned JSON before responding to the browser.

The normal PDF path does **not** use OCR, `pdf-parse`, or local text extraction. If Gemini cannot analyse the PDF, the user receives an explicit error and can retry or switch to Paste Text. Uploaded files are not permanently stored.

The API key is read only on the server from:

```text
GEMINI_API_KEY
```

It is never sent to React, logged, hard-coded, or committed.

## ZEIL challenge evidence

| Challenge | Evidence in this project |
|---|---|
| **Built for hiring** | Solves a real recruiter and hiring-manager preparation task while keeping the decision human. |
| **Strict shapes** | Gemini uses a response JSON schema, followed by server-side parsing, one safe JSON recovery attempt, and field-level validation. |
| **Eyes and ears** | Gemini receives and analyses the actual resume PDF as multimodal document input—not locally extracted text. |

The guide page displays **PDF analysed by Gemini** only when the backend confirms that the PDF path was used.

## Structured output

Gemini is constrained to the following shape:

```json
{
  "candidateName": "string",
  "role": "string",
  "summary": "string",
  "strengths": [
    {
      "area": "string",
      "evidence": "string",
      "source": "resume"
    }
  ],
  "areasToValidate": [
    {
      "requirement": "string",
      "reason": "string",
      "candidateEvidence": "string"
    }
  ],
  "requirementMatches": [
    {
      "requirement": "string",
      "candidateEvidence": "string",
      "evidenceLevel": "strong | moderate | weak | missing"
    }
  ],
  "questions": [
    {
      "id": "string",
      "category": "technical | behavioural | experience | validation",
      "requirement": "string",
      "candidateEvidence": "string",
      "question": "string",
      "reason": "string"
    }
  ]
}
```

## Technology

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Express 5
- `@google/genai`
- Multer with in-memory storage
- Node's built-in test runner

## Local setup

### Prerequisites

- Node.js 20 or newer
- A Gemini API key

### Install

```bash
git clone https://github.com/akhil-2207/Zeil-Hackathon.git
cd Zeil-Hackathon
npm install
```

### Configure the API key

Copy `.env.example` to `.env` and add the key:

```env
GEMINI_API_KEY=your_gemini_api_key
```

`.env` and `.env.*` are ignored by Git, while `.env.example` is safe to commit.

### Run frontend and backend

```bash
npm run dev
```

Default local services:

- Web application: `http://localhost:5173`
- API: `http://127.0.0.1:3001`

Vite proxies `/api` requests to the Express server during development.

## Deploy to Vercel

This repository includes a Vercel configuration for the Vite SPA and two thin serverless entry points for the existing Express API. Gemini still runs only on the server.

1. Import the GitHub repository into Vercel or run `npx vercel link` from the project root.
2. Add `GEMINI_API_KEY` in **Project Settings -> Environment Variables** for Production and Preview. Do not prefix it with `VITE_`.
3. Deploy with `npx vercel --prod`, or push to the production branch after connecting the Git repository.
4. Verify `/api/health`, then generate a guide from the seeded candidate flow.

Vercel Functions currently limit request bodies to 4.5 MB. The app therefore accepts PDFs up to 4 MB, leaving room for multipart form metadata. The seeded resume is well below this limit.

## Commands

```bash
npm run dev          # Run Vite and Express together
npm test             # Run response-validation and Gemini request tests
npm run build        # Type-check frontend/backend and create production build
npm run test:gemini  # Make a small live Gemini connectivity check
```

## API

### `POST /api/generate-guide`

Content type: `multipart/form-data`

| Field | Required | Description |
|---|---|---|
| `jobDescription` | Yes | Role responsibilities and requirements |
| `resumePdf` | One resume source required | PDF file, maximum 4 MB |
| `resumeText` | One resume source required | Pasted resume text |

If both resume sources arrive, the backend prefers the PDF.

Successful responses contain the validated guide plus backend-confirmed source metadata:

```json
{
  "success": true,
  "guide": {},
  "source": {
    "resumeSource": "pdf",
    "resumeFileName": "AkhilMATHEW.pdf"
  }
}
```

## Reliability and safety

- One Gemini generation request per guide—no duplicate model calls.
- Controlled handling for missing inputs, invalid types, files over 4 MB, corrupt PDFs, password-protected PDFs, API failures, rate limits, network failures, empty responses, and malformed JSON.
- Prompt-injection resistance: the resume and job description are treated as untrusted source documents, not instructions.
- Missing job evidence is explicitly marked for validation rather than invented.
- The candidate remains unranked; the interviewer remains responsible for the decision.

## Verification completed

- Valid candidate resume PDF
- Pasted-text resume mode
- Invalid file type
- PDF over 4 MB
- Corrupt PDF
- Password-protected PDF
- Missing job description
- Gemini API and network error mapping
- Structured response validation and recovery
- Production TypeScript/Vite build
- Full browser flow from dashboard to live PDF-backed guide

## Project structure

```text
server/
  app.ts                   Shared Express app for local and Vercel runtimes
  routes/guide.ts          Multipart API and validation
  services/gemini.ts      Gemini prompt, PDF input and schema
  utils/validateGuide.ts  Runtime response validation
shared/
  guide.ts                 Shared guide types
src/
  data/                    Seeded candidate application record
  lib/                     API client and session guide state
  pages/                   Dashboard, candidate, generator and guide
output/pdf/                Candidate-submitted PDF used by the prototype
api/                       Vercel Function entry points
```

## Prototype scope

This one-day hackathon build intentionally does not include authentication, a database, calendar integration, automatic hiring recommendations, candidate ranking, OCR, or additional AI agents.

The repository includes one seeded candidate application so judges can follow the scheduled-interview workflow immediately. In production, resumes would be stored behind authenticated access rather than committed as a public asset.
