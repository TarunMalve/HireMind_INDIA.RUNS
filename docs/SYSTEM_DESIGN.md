# Deep System Design — HireMind Elite

This document details the systems engineering patterns, caching strategies, search engine indexes, and performance optimizations implemented to scale HireMind Elite to 100K+ candidate profiles.

---

## 1. System Scalability Strategy

To handle high throughput workloads (e.g. bulk CSV uploads, database queries across large talent pools, concurrent AI scans), HireMind structures operations asynchronously:
- **Offloaded Tasks**: File extraction, parsing, and LLM text formatting are processed via an asynchronous job worker queue (Redis + BullMQ).
- **Non-blocking Controller**: The main Express server returns a job ID to the frontend client immediately, allowing the UI to render a loading skeleton while the background queue parses the document.

---

## 2. DB Caching & Indexing

To maintain sub-100ms query responses on candidate shortlists, we implement the following database optimization schema:

### Indexing Mappings
```sql
-- Index on Candidate Skills JSONB column for fast keyword parsing
CREATE INDEX idx_candidate_skills ON "CandidateProfile" USING gin (skills);

-- Relational indexes on foreign keys
CREATE INDEX idx_shortlist_job_candidate ON "Shortlist" (job_id, candidate_id);
CREATE INDEX idx_candidate_gem_flag ON "CandidateProfile" (is_gem) WHERE is_gem = true;
```

### Redis Caching Layer
For candidate listings and dashboard statistics that do not change frequently:
- **Read Cache**: Sourced listings (`/api/candidates?jobId=X`) are cached in Redis with a Time-To-Live (TTL) of 15 minutes.
- **Cache Invalidation**: Any profile updates, new JD uploads, or verification quiz submissions trigger automatic cache invalidation for affected shortlist keys.

---

## 3. Multiplicative Scoring Optimization

The multiplicative scoring model ($Score = \prod P_i$) presents a unique mathematical constraint: calculating this in SQL is complex.
- **Caching Calculations**: P-factors and overall scores are computed inside the Node server runtime using fast float math and persisted back to the PostgreSQL database table.
- **SQL Sorting**: Sorting candidates by overall score is fast since the final score is pre-computed and stored in a indexed column (`overall_score`), avoiding on-the-fly math compilation on large queries.

---

## 4. Rate Limiting & API Security

To protect API endpoints from excessive script scraping and LLM API cost spikes, we enforce rate-limiting rules at the gateway level:
- **Standard APIs**: 100 requests per 15 minutes per IP.
- **AI Upload/Analysis APIs**: 10 requests per hour per user account (prevening excessive token expenditure).
- **Honeypot Quizzes**: Candidates are allowed maximum 2 validation attempts per day; failures trigger manual profile lock.