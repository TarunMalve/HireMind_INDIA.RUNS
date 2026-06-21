# Deep Dive: The AI Intelligence Engine — HireMind Elite

This document details the LLM integrations, prompt engineering models, and semantic processing pipelines that power HireMind Elite.

---

## 1. Role Parsing & Attribute Ingestion

When a new Job Description (JD) is uploaded, the backend calls our parsing pipeline:
-  **Semantic Extraction**: Rather than searching for static string keywords, our models parse the semantic meaning of sentences.
-  **Adjacent Mapping**: The engine identifies equivalent frameworks. If a JD requests "AWS", the model checks if the candidate has strong "GCP" or "Azure" experience and calculates a transferable competency score.

---

## 2. ETV-RAVE Framework

To structure the LLM evaluation of candidates, we enforce the **ETV-RAVE** evaluation pipeline:
-  **E**xecution Competency ($P(Qualified)$)
-  **T**enure & Stability ($P(Available)$)
-  **V**elocity & Growth ($P(Growth)$)
-  **R**esponsiveness ($P(Engageable)$)
-  **A**uthenticity & Integrity ($P(Legitimate)$)
-  **V**ariety & Scrappiness ($P(Scrappiness)$)
-  **E**xplainable AI reasoning

---

## 3. Prompt Engineering Design

Our LLM instructions are strictly structured in prompt templates using XML formats to enforce strict JSON schemas.

### Example JD Extraction Prompt
```text
You are an Elite Recruiting Analyst. Extract the core requirements from the following Job Description.
Return raw JSON ONLY. Follow this schema exactly:
{
  "title": "Job Title",
  "experienceYears": 5,
  "requiredSkills": ["React", "TypeScript"],
  "adjacentSkills": ["Vue", "Angular"],
  "seniority": "Senior"
}

JD TEXT:
[JD Text here]
```

---

## 4. Explainable AI & Reasoning Generation

Rather than returning a black-box ranking number:
1.  The LLM evaluates the candidate's career data against target job criteria.
2.  It generates a concise **Recruiter Brief** summarizing core strengths.
3.  It lists distinct **Risk Factors** (e.g. frequent job hops, long career gaps).
4.  It identifies **Hidden Gems** based on growth velocity, independent of high-pedigree company tags.