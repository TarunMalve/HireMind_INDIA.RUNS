# Recruiter Sourcing Manual — HireMind Elite

This guide explains how recruiters use the HireMind platform to source, rank, and hire candidate talent.

---

## 1. Paste & Upload Job Descriptions

To begin sourcing candidates for a new role:
1.  Click **Upload Job Description** (or **Plus Icon**) in the header.
2.  Paste the raw JD text into the input field or drag-and-drop a document file.
3.  Click **Analyze with HireMind AI**.
4.  The backend parser will extract required skills, experience parameters, and map adjacent technologies.
5.  The new job ad record is added to your active pipeline list.

---

## 2. Sifting through Candidate Shortlists

1.  Navigate to the **Candidate Intelligence** dashboard.
2.  Select your target role from the dropdown selector.
3.  The list will automatically sort candidates by their overall **Hire Probability** score.
4.  Columns explained:
    - **Hire Prob**: The final multiplicative score ($0-100\%$).
    - **Qualified**: $P(Q)$ score representing skills matching.
    - **Available**: $P(A)$ score indicating readiness to switch.
5.  Check the **Hidden Gems Only** checkbox to hide pedigree candidates and reveal developers with transferable skills.

---

## 3. Explaining LLM Score Decisions

If a candidate's score looks unusual:
1.  Click on the candidate's name to open the **Explainable AI Match Matrix**.
2.  View the **Scoring Chain**:
    $$P(Qualified) \times P(Available) \times P(Engageable) \times P(Legitimate) \times P(Growth) \times P(Scrappiness) = Score$$
3.  Review the **P-Factor Detail Cards** to see the concrete evidence (such as GitHub velocity or stable job tenure) that influenced each score.
4.  Look for **Zero-Killer Alerts**: If a candidate has a warning banner, it means a critical factor (e.g. legitimacy or availability) is near zero, collapsing their final ranking score.