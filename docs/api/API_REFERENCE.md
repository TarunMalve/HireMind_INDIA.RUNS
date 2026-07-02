# API Reference

> **Complete HTTP API contract documentation for developers integrating with the HireMind Elite backend.**

---

## Table of Contents

- [Overview](#overview)
- [Authentication](#authentication)
- [Global Health Check](#global-health-check)
- [Candidates API](#candidates-api)
- [Jobs API](#jobs-api)
- [Applications API](#applications-api)
- [AI & Sourcing API](#ai--sourcing-api)
- [Error Codes](#error-codes)

---

## Overview

All HireMind Elite API requests must follow these rules:
- **Base URL**: `http://localhost:5000/api` (Development) or custom production domain.
- **Content-Type**: `application/json` for all POST and PUT request bodies.
- **Response Format**: Standard JSON.

---

## Authentication

All protected endpoints require a Clerk-issued JWT session token passed in the header:

```http
Authorization: Bearer <clerk_jwt_token>
```

Failure to include this header or passing an invalid/expired token returns a `401 Unauthorized` response.

---

## Global Health Check

### Health Check

Retrieve the running system status, environment type, and version.

- **Method**: `GET`
- **Path**: `/health`
- **Authentication**: None (Public)

#### Response

```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "timestamp": "2026-07-02T11:23:45.123Z",
    "uptime": 1420.5,
    "environment": "development",
    "version": "2.0.0"
  }
}
```

---

## Candidates API

All endpoints in this group require authentication.

### List Candidates

Retrieve candidate profiles.

- **Method**: `GET`
- **Path**: `/candidates`
- **Authentication**: JWT Required

---

### Get Candidate by ID

Retrieve a single candidate profile.

- **Method**: `GET`
- **Path**: `/candidates/:id`
- **Authentication**: JWT Required

---

### Create Candidate Profile

Initialize a candidate profile.

- **Method**: `POST`
- **Path**: `/candidates`
- **Authentication**: JWT Required

#### Request Body

```json
{
  "headline": "Lead Backend Developer",
  "skills": ["Go", "Kubernetes", "PostgreSQL"],
  "location": "Bengaluru",
  "linkedinUrl": "https://linkedin.com/in/anapinto",
  "githubUrl": "https://github.com/anapinto"
}
```

---

### Update Candidate Profile

Modify a candidate profile.

- **Method**: `PUT`
- **Path**: `/candidates/:id`
- **Authentication**: JWT Required

---

### Delete Candidate Profile

Fully remove candidate data. Triggers cascade deletion of applications, notifications, and DNA records.

- **Method**: `DELETE`
- **Path**: `/candidates/:id`
- **Authentication**: JWT Required

---

## Jobs API

### List Jobs

Retrieve all active job listings.

- **Method**: `GET`
- **Path**: `/jobs`
- **Authentication**: None (Public)

---

### Get Job by ID

Retrieve job requirements and description.

- **Method**: `GET`
- **Path**: `/jobs/:id`
- **Authentication**: None (Public)

---

### Create Job Posting

Post a new position.

- **Method**: `POST`
- **Path**: `/jobs`
- **Authentication**: JWT Required (`RECRUITER` or `ADMIN` roles only)

#### Request Body

```json
{
  "title": "Senior React Engineer",
  "description": "Looking for an engineer to lead frontend efforts...",
  "skills": ["React", "TypeScript", "Next.js"],
  "location": "Remote",
  "locationType": "REMOTE"
}
```

---

### Update Job Posting

Modify job requirements.

- **Method**: `PUT`
- **Path**: `/jobs/:id`
- **Authentication**: JWT Required (`RECRUITER` or `ADMIN` only)

---

### Delete Job Posting

Delete a job and its applications.

- **Method**: `DELETE`
- **Path**: `/jobs/:id`
- **Authentication**: JWT Required (`RECRUITER` or `ADMIN` only)

---

## Applications API

### Submit Application

Apply for a job. Automatically triggers the 6-factor ranking engine.

- **Method**: `POST`
- **Path**: `/applications`
- **Authentication**: JWT Required

#### Request Body

```json
{
  "jobId": "job-1",
  "candidateId": "cand-2"
}
```

---

### List Applications

Retrieve applications submitted.

- **Method**: `GET`
- **Path**: `/applications`
- **Authentication**: JWT Required

---

### Get Application Details

Retrieve application scores and stages.

- **Method**: `GET`
- **Path**: `/applications/:id`
- **Authentication**: JWT Required

---

### Update Application Status

Move candidate to next hiring stage (e.g., SCREENING, INTERVIEW, SECOND_CHANCE).

- **Method**: `PUT`
- **Path**: `/applications/:id/status`
- **Authentication**: JWT Required (`RECRUITER` or `ADMIN` only)

#### Request Body

```json
{
  "status": "INTERVIEW"
}
```

---

### Get Matches for Job

Retrieve candidates who applied to a specific job, pre-sorted by their Hire Probability score.

- **Method**: `GET`
- **Path**: `/applications/matches/:jobId`
- **Authentication**: JWT Required (`RECRUITER` or `ADMIN` only)

---

## AI & Sourcing API

AI endpoints are rate-limited.

### AI Recruiter Copilot Chat

Query the copilot regarding candidate DNA.

- **Method**: `POST`
- **Path**: `/ai/chat`
- **Authentication**: JWT Required

#### Request Body

```json
{
  "message": "Summarize Ana Pinto's qualifications for the React Engineer role.",
  "candidateId": "cand-1"
}
```

---

### Analyze Resume Text

Extract skills and experience from resume text.

- **Method**: `POST`
- **Path**: `/ai/analyze-resume`
- **Authentication**: JWT Required

#### Request Body

```json
{
  "resumeText": "Experienced engineer with 5 years React and Node..."
}
```

---

### Generate Candidate DNA

Trigger DNA calculations.

- **Method**: `POST`
- **Path**: `/ai/generate-dna`
- **Authentication**: JWT Required

---

### Evaluate Single Candidate Match

Explicitly trigger the 6-factor engine.

- **Method**: `POST`
- **Path**: `/ai/rank`
- **Authentication**: JWT Required

#### Request Body

```json
{
  "candidateId": "cand-1",
  "jobId": "job-1"
}
```

---

### Find Hidden Gems

Retrieve candidates flagged as Hidden Gems for a job.

- **Method**: `POST`
- **Path**: `/ai/hidden-gems/:jobId`
- **Authentication**: JWT Required

---

### Generate Authenticity Challenge

Create domain-specific verification questions.

- **Method**: `POST`
- **Path**: `/ai/authenticity/generate`
- **Authentication**: JWT Required

#### Request Body

```json
{
  "skills": ["React", "TypeScript"]
}
```

---

### Submit Authenticity Challenge

Submit answers to verification challenge.

- **Method**: `POST`
- **Path**: `/ai/authenticity/submit`
- **Authentication**: JWT Required

#### Request Body

```json
{
  "answers": [
    { "questionId": "react-1", "answer": "The virtual DOM stores UI state..." }
  ]
}
```

---

### Get Future Matches

Predict candidate readiness for roles in 12–24 months.

- **Method**: `GET`
- **Path**: `/ai/future-matches/:candidateId`
- **Authentication**: JWT Required

---

## Error Codes

When an error occurs, the server responds with a matching HTTP status code and a structured payload:

```json
{
  "success": false,
  "error": "Candidate not found",
  "statusCode": 404
}
```

| HTTP Status | Description | Typical Cause |
|---|---|---|
| `400 Bad Request` | Invalid payload or missing fields | Empty required skills, incorrect JSON syntax |
| `401 Unauthorized` | Missing/Invalid JWT | No Bearer token provided in header |
| `403 Forbidden` | Insufficient role permissions | Candidate trying to modify a job posting |
| `404 Not Found` | Resource missing | Incorrect ID requested |
| `429 Too Many Requests`| Rate limit exceeded | Exceeding 20 AI route calls in 15 minutes |
| `500 Server Error` | Unexpected backend crash | Database connection failure |

---

## Related Documentation

- [System Architecture](../architecture/SYSTEM_ARCHITECTURE.md) — API route diagram
- [Security](../architecture/SECURITY.md) — Auth flow details
- [Scoring Engine](../architecture/SCORING_ENGINE.md) — Scoring calculation inputs
