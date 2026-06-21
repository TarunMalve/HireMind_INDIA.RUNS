# Security & Privacy Standards — HireMind Elite

We prioritize candidate data protection and API security on HireMind Elite. This guide details our compliance standards and coding practices.

---

## 1. Authentication & Authorization

-  **Secure Sessions**: All API endpoints behind `/api/protected/*` require a valid JSON Web Token (JWT) passed in the `Authorization: Bearer <token>` header.
-  **Role-Based Access Control (RBAC)**: User roles are verified in JWT payloads, preventing candidates from calling recruiter sourcing endpoints (such as `POST /api/jobs/upload`).

---

## 2. Data Encryption

-  **In-Transit**: All API requests utilize HTTPS / TLS 1.3 protocol.
-  **At-Rest**: Candidate databases, password hashes, and profile records are encrypted using AES-256 standard on AWS RDS / Supabase volumes.

---

## 3. Privacy & GDPR Compliance

HireMind is designed to align with strict EU GDPR policies:
-  **Consent Checkbox**: Candidates must explicitly consent to profile parsing during onboarding.
-  **Right to Be Forgotten**: Candidates can delete their account from the dashboard settings panel, which triggers cascade deletions of their resume files and database profile.
-  **Anonymization Mode**: Recruiters can toggle "Blind Sourcing Mode," which masks candidate names, genders, avatars, and schools, preventing hiring bias.