# REST API Reference Manual — HireMind Elite

All network communications between the HireMind frontend client and backend Express server utilize standard REST endpoints returning JSON responses.

---

## 1. Authentication APIs

### POST `/api/auth/login`
Authenticates a recruiter or candidate and returns session details.
- **Request Headers**: `Content-Type: application/json`
- **Request Body**:
```json
{
  "email": "priya.sharma@company.com",
  "password": "securepassword123",
  "userType": "recruiter"
}
```
- **Response (200 OK)**:
```json
{
  "success": true,
  "token": "jwt_session_token_here",
  "user": {
    "email": "priya.sharma@company.com",
    "name": "Priya Sharma",
    "role": "recruiter"
  }
}
```

### POST `/api/auth/register`
Creates a new account and initializes onboarding parameters.
- **Request Body**:
```json
{
  "firstName": "Alex",
  "lastName": "Johnson",
  "email": "alex.johnson@company.com",
  "password": "securepassword123",
  "userType": "recruiter",
  "company": "Acme Corp",
  "title": "Senior Technical Recruiter",
  "teamSize": "2-10 people"
}
```
- **Response (201 Created)**:
```json
{
  "success": true,
  "message": "Account created successfully",
  "userId": "usr_98242"
}
```

---

## 2. Recruiter Sourcing APIs

### GET `/api/candidates`
Fetch the complete list of ranked candidates for a specific job filter.
- **Query Parameters**:
  - `jobId` (string, required): e.g. `job-1`
  - `sortBy` (string, optional): `score` | `potential` | `intent`
  - `gemsOnly` (boolean, optional): `true` | `false`
- **Response (200 OK)**:
```json
{
  "success": true,
  "jobId": "job-1",
  "candidates": [
    {
      "candidateId": "cand-1",
      "name": "Helena Rostova",
      "title": "Senior UI Engineer",
      "experienceYears": 6,
      "overallScore": 80,
      "isGem": true,
      "pFactors": {
        "qualified": 0.95,
        "available": 0.90,
        "engageable": 0.88,
        "legitimate": 1.00,
        "growth": 0.92,
        "scrappiness": 0.94
      }
    }
  ]
}
```

### POST `/api/jobs/upload`
Upload a new job description for parsing.
- **Request Body**:
```json
{
  "title": "Senior Frontend Architect",
  "jdText": "We are seeking a React expert with AWS cloud experience..."
}
```
- **Response (200 OK)**:
```json
{
  "success": true,
  "jobId": "job-14",
  "extractedSkills": ["React", "AWS", "CSS Architecture", "TypeScript"],
  "recruiterBrief": "Extracted key targets: 5+ years experience, architectural patterns, state management."
}
```

---

## 3. Candidate Workspace APIs

### GET `/api/candidates/dashboard`
Fetches match statistics, notifications, and verification challenges for the logged-in candidate.
- **Response (200 OK)**:
```json
{
  "success": true,
  "candidateId": "cand-1",
  "overallProbability": 80,
  "roadmap": {
    "status": "in-progress",
    "completedSteps": 2,
    "nextStep": "Complete AWS Certification Quiz"
  },
  "matchingJobsCount": 8
}
```

### POST `/api/candidates/verify`
Submit answers to the automated verification challenges.
- **Request Body**:
```json
{
  "candidateId": "cand-1",
  "quizId": "quiz-tech-react",
  "answers": [
    { "questionId": "q1", "selectedOption": 2 },
    { "questionId": "q2", "selectedOption": 0 }
  ]
}
```
- **Response (200 OK)**:
```json
{
  "success": true,
  "correctCount": 2,
  "totalCount": 2,
  "verificationPassed": true,
  "newIntegrityScore": 1.00,
  "newOverallScore": 80
}
```