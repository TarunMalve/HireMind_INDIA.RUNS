# The Scoring & Ranking Engine — HireMind Elite

This document explains the mathematical formulations and evaluation parameters behind the **Multiplicative Hire Probability Engine**.

---

## 1. The Multiplicative Probability Model

Traditional Applicant Tracking Systems (ATS) rank candidates using linear weighted additions:
$$\text{Score} = w_1 \cdot P(Qualified) + w_2 \cdot P(Available) + \dots + w_6 \cdot P(Scrappiness)$$

### The Linear Flaw
Under a linear model, a candidate with perfect technical credentials ($P(Qualified) = 1.0$) but zero intention of switching jobs ($P(Available) = 0.0$) can still score $85\%$, wasting recruiter effort.

### Our Multiplicative Solution
HireMind Elite implements a product-based formulation:
$$\text{Final Score} = \text{round}(P(Qualified) \times P(Available) \times P(Engageable) \times P(Legitimate) \times P(Growth) \times P(Scrappiness) \times 100)$$

If **any** key dimension collapses to near-zero, the overall match score collapses, filtering the candidate out automatically.

---

## 2. Factor Metrics Breakdown

| Factor | Metric Name | Assessment Logic | Value Range |
|---|---|---|---|
| **$P(Qualified)$** | Qualification | Semantic match between candidate skills and JD requirements. | $0.05$ – $1.00$ |
| **$P(Available)$** | Availability | Job change frequency, tenure stability, and LinkedIn change flags. | $0.05$ – $1.00$ |
| **$P(Engageable)$** | Engagement | Portfolio activity rate, resume updates frequency. | $0.05$ – $1.00$ |
| **$P(Legitimate)$** | Legitimacy | Identity check, resume timeline consistency, and quiz verifications. | $0.10$ – $1.00$ |
| **$P(Growth)$** | Growth | Career trajectory speed, role promotion timeline acceleration. | $0.05$ – $1.00$ |
| **$P(Scrappiness)$** | Scrappiness | Open-source (GitHub commit frequency), hackathons, certifications. | $0.05$ – $1.00$ |

---

## 3. The Zero-Killer Constraint & Honeypots

### Honeypot Penalty
If the validation scan detects suspicious resume claims, or if the candidate fails multiple inline credibility quizzes, the system triggers the **Honeypot Flag**:
-  **Integrity Override**: $P(Legitimate)$ is collapsed to $0.10$.
-  **Impact**: The candidate's score drops to $5\%$ regardless of skills, and a red alert banner is displayed to the recruiter.

---

## 4. Worked Calculation Example

### Candidate A (Highly Qualified, But Unstable)
-  $P(Q) = 0.95$ (GCP Cloud Architect)
-  $P(A) = 0.20$ (Recently joined new firm 2 months ago)
-  $P(E) = 0.80$
-  $P(L) = 1.00$
-  $P(G) = 0.90$
-  $P(S) = 0.85$
-  **Final Match Score**: $0.95 \times 0.20 \times 0.80 \times 1.00 \times 0.90 \times 0.85 = 11.6\%$ (Ranked Low)

### Candidate B (Medium Skills, High Intent & Verified)
-  $P(Q) = 0.75$ (Transferable Vue.js skills)
-  $P(A) = 0.95$ (Unemployed or actively seeking)
-  $P(E) = 0.90$
-  $P(L) = 1.00$ (Passed verification quiz)
-  $P(G) = 0.85$
-  $P(S) = 0.90$
-  **Final Match Score**: $0.75 \times 0.95 \times 0.90 \times 1.00 \times 0.85 \times 0.90 = 49.0\%$ (Ranked High)