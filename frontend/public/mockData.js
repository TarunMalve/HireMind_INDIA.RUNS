// High-fidelity pre-seeded data for the HireMind AI platform

const initialJobs = [
  {
    job_id: "job-1",
    title: "Senior Frontend Architect",
    department: "Engineering",
    active_candidates: 8,
    match_health: 94,
    required_skills: ["React", "TypeScript", "TailwindCSS", "AWS Cloud", "Next.js"]
  },
  {
    job_id: "job-2",
    title: "Distributed Systems Engineer",
    department: "Platform Core",
    active_candidates: 12,
    match_health: 87,
    required_skills: ["Go", "Kubernetes", "Microservices", "gRPC", "AWS"]
  },
  {
    job_id: "job-3",
    title: "AI Research Scientist",
    department: "HireMind AI Lab",
    active_candidates: 6,
    match_health: 91,
    required_skills: ["Python", "TensorFlow", "NLP", "PyTorch", "Transformers"]
  },
  {
    job_id: "job-4",
    title: "Lead DevOps Specialist",
    department: "Operations",
    active_candidates: 5,
    match_health: 82,
    required_skills: ["Terraform", "Docker", "AWS", "CI/CD", "Python"]
  }
];

const authenticityQuestionDb = {
  "React": [
    {
      id: "react-1",
      question: "What is the primary purpose of the Virtual DOM in React?",
      options: [
        "To directly manipulate the browser HTML for speed",
        "To store data in a secure browser database",
        "To keep a lightweight representation of the UI in memory and sync it with the real DOM via reconciliation",
        "To enable server-side database connections"
      ],
      correct: 2,
      explanation: "The Virtual DOM is a programming concept where an ideal, or 'virtual', representation of a UI is kept in memory and synced with the 'real' DOM by a library such as ReactDOM (reconciliation)."
    },
    {
      id: "react-2",
      question: "What is the key difference between State and Props in React?",
      options: [
        "State is managed within the component and can change; Props are passed to the component and are read-only",
        "State is read-only; Props can be modified by the child component",
        "Props are stored on the server; State is stored on the client",
        "There is no difference; they are aliases for the same object"
      ],
      correct: 0,
      explanation: "Props (short for properties) are passed into a component by its parent and are immutable inside that component. State is local state variables managed within the component itself and can be updated."
    },
    {
      id: "react-3",
      question: "When does the callback function of useEffect run by default if no dependency array is provided?",
      options: [
        "Only once when the component mounts",
        "After every render cycle of the component",
        "Only when the component unmounts",
        "Only when a state variable changes"
      ],
      correct: 1,
      explanation: "If no dependency array is passed to useEffect, it runs after the first render and after every single update/render cycle."
    }
  ],
  "AWS": [
    {
      id: "aws-1",
      question: "What does Amazon S3 stand for and what is it primarily used for?",
      options: [
        "Simple Database Service; relational databases",
        "Simple Storage Service; scalable object storage",
        "System Security Shield; network firewalling",
        "Server Side Sync; load balancing"
      ],
      correct: 1,
      explanation: "Amazon S3 stands for Simple Storage Service. It is object storage built to store and retrieve any amount of data from anywhere on the web."
    },
    {
      id: "aws-2",
      question: "What is a major architectural difference between EC2 and AWS Lambda?",
      options: [
        "EC2 is serverless; Lambda requires managing virtual machines",
        "EC2 provides virtual servers that run continuously; Lambda is serverless and executes code only in response to events, scaling automatically",
        "EC2 only supports Windows; Lambda only supports Linux"
      ],
      correct: 1,
      explanation: "EC2 provides persistent virtual machines (IaaS) where you pay for uptime. Lambda is a Serverless FaaS (Function as a Service) where you pay only for compute time consumed per invocation."
    },
    {
      id: "aws-3",
      question: "What is the purpose of Auto Scaling in AWS?",
      options: [
        "To increase the size of S3 buckets automatically",
        "To automatically adjust the number of EC2 instances to handle load changes",
        "To speed up the network latency between regions",
        "To encrypt all database tables automatically"
      ],
      correct: 1,
      explanation: "AWS Auto Scaling monitors your applications and automatically adjusts capacity (adding or removing EC2 instances) to maintain steady, predictable performance at the lowest possible cost."
    }
  ],
  "REST API": [
    {
      id: "rest-1",
      question: "What does REST stand for in API design?",
      options: [
        "Remote Encryption Security Transfer",
        "Representational State Transfer",
        "Request Response Standard Template",
        "Routing Engine for Socket Transmission"
      ],
      correct: 1,
      explanation: "REST stands for Representational State Transfer. It is an architectural style for providing standards between computer systems on the web, making it easier for systems to communicate."
    },
    {
      id: "rest-2",
      question: "In REST, what is the main difference between HTTP PUT and POST methods?",
      options: [
        "PUT is for deleting data; POST is for fetching it",
        "POST is idempotent; PUT is not",
        "PUT is idempotent (repeated requests yield the same state); POST is typically used to create new resources and is not idempotent",
        "POST can only send plain text; PUT can send JSON"
      ],
      correct: 2,
      explanation: "PUT is idempotent, meaning calling it multiple times with the same data will produce the same result (usually updating a resource). POST is not idempotent, as calling it multiple times will create multiple new resources."
    },
    {
      id: "rest-3",
      question: "When should a REST API return an HTTP 404 Status Code?",
      options: [
        "When the server encounters an internal server error",
        "When the requested resource could not be found on the server",
        "When the request was successful and data was returned",
        "When the client is not authenticated to access the resource"
      ],
      correct: 1,
      explanation: "The HTTP 404 Not Found response status code indicates that the server cannot find the requested resource. This can mean the endpoint exists but the specific resource does not, or the URL itself is invalid."
    }
  ]
};

const candidates = [
  {
    id: "cand-1",
    name: "Helena Rostova",
    title: "Senior UI Developer",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80",
    experience: 6,
    overall_score: 80,
    categories: ["hidden_gem", "fast_learner"],
    skill_match_score: 91,
    experience_score: 88,
    potential_score: 96,
    intent_score: 92,
    alignment_score: 90,
    skills: [
      { name: "Vue.js", level: 95, matchType: "adjacent", equivalentTo: "React" },
      { name: "TypeScript", level: 90, matchType: "exact" },
      { name: "Sass/CSS", level: 92, matchType: "adjacent", equivalentTo: "TailwindCSS" },
      { name: "GCP (Cloud)", level: 85, matchType: "adjacent", equivalentTo: "AWS Cloud" },
      { name: "Next.js", level: 88, matchType: "exact" }
    ],
    why_selected: "Helena is a textbook Hidden Gem. While the role lists React & AWS, she is an expert in Vue.js and GCP, demonstrating identical architectural knowledge in single-page apps and serverless environments. Her high potential score (96) is backed by her rapid transition from designer to lead UI architect in just 4 years.",
    strengths: [
      "Deep understanding of frontend state-management paradigms",
      "Exceptional visual aesthetics and component design principles",
      "Demonstrated ability to master new frameworks within weeks"
    ],
    risks: [
      "No direct production experience with AWS (primarily GCP native)",
      "Minimal experience working in massive monorepos"
    ],
    predicted_role_2yr: "Principal UI Architect",
    prediction_confidence: "91%",
    prediction_rationale: "Given her technical growth velocity and strong communication scores, Helena is on track to lead enterprise frontend architectures within 24 months.",
    readiness: { technical: 92, communication: 95, domain: 88, culture: 93 },
    target_job_id: "job-1",
    authenticity_score: 0,
    knowledge_confidence_score: 0,
    authenticity_status: "pending",
    authenticity_challenge: {
      topic: "React",
      questions_answered: 0,
      score: 0
    },
    learning_roadmap: {
      missing_skills: ["AWS Cloud Infrastructure", "GraphQL Engine", "CI/CD Orchestration"],
      certifications: ["AWS Certified Developer - Associate", "HashiCorp Terraform Associate"],
      timeline: [
        { term: "Month 1-3", goal: "Complete AWS Cloud Foundations and Serverless Deployment", completed: false },
        { term: "Month 4-6", goal: "Implement Apollo GraphQL Federation on Kubernetes", completed: false },
        { term: "Month 7-9", goal: "Secure CI/CD Pipelines via Terraform & GitHub Actions", completed: false }
      ]
    },
    active_opportunities: [
      { role: "Senior Frontend Architect", match: 93, status: "Under Review", job_id: "job-1" },
      { role: "Full Stack Engineer", match: 86, status: "Nurturing Pipeline", job_id: "none" }
    ],
    candidate_dna: {
      technical_fit: 91,
      experience_fit: 88,
      career_trajectory: 96,
      behavioral_intent: 92,
      credibility: 90,
      hidden_gem_score: 95
    },
    hire_probability: {
      qualified: 0.94,
      available: 0.95,
      engageable: 0.98,
      legitimate: 1.00,
      growth: 0.96,
      scrappiness: 0.95,
      hire_score: 80
    },
    hidden_gem: true,
    honeypot_risk: false,
    reasoning: "Helena is a textbook Hidden Gem. While the role lists React & AWS, she is an expert in Vue.js and GCP, demonstrating identical architectural knowledge in single-page apps and serverless environments. Her high potential score (96) is backed by her rapid transition from designer to lead UI architect in just 4 years."
  },
  {
    id: "cand-2",
    name: "Marcus Vance",
    title: "Backend Engineer",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    experience: 4,
    overall_score: 65,
    categories: ["hidden_gem", "high_intent"],
    skill_match_score: 85,
    experience_score: 80,
    potential_score: 92,
    intent_score: 95,
    alignment_score: 91,
    skills: [
      { name: "Docker", level: 90, matchType: "adjacent", equivalentTo: "Kubernetes" },
      { name: "Distributed Systems", level: 88, matchType: "exact" },
      { name: "Python", level: 92, matchType: "adjacent", equivalentTo: "Go" },
      { name: "gRPC", level: 82, matchType: "exact" },
      { name: "AWS Cloud", level: 85, matchType: "exact" }
    ],
    why_selected: "Marcus has built complex data pipelines and microservices using Python and Docker, proving he can handle distributed architectures. Although the job requires Go & Kubernetes, his underlying network, messaging (gRPC), and distributed system skills are directly adjacent. His high intent score comes from active open-source contributions in container runtimes.",
    strengths: [
      "Strong grasp of concurrency, networking sockets, and message queues",
      "Highly proactive self-learner; actively contributes to CNCF projects",
      "Excellent systems-level debugging capabilities"
    ],
    risks: [
      "Will require a short ramp-up phase to write production-grade Go code",
      "Kubernetes experience is mostly local/dev, not production scale"
    ],
    predicted_role_2yr: "Senior Core Infrastructure Lead",
    prediction_confidence: "86%",
    prediction_rationale: "His intense interest in container internals and infrastructure makes him a natural fit for infrastructure engineering and platform lead roles.",
    readiness: { technical: 86, communication: 90, domain: 89, culture: 92 },
    target_job_id: "job-2",
    authenticity_score: 95,
    knowledge_confidence_score: 92,
    authenticity_status: "verified",
    authenticity_challenge: {
      topic: "REST API",
      questions_answered: 3,
      score: 100
    },
    learning_roadmap: {
      missing_skills: ["Go Concurrency Models", "Production Kubernetes Operations", "Istio Service Mesh"],
      certifications: ["Certified Kubernetes Administrator (CKA)", "Go Programming Specialist"],
      timeline: [
        { term: "Month 1-2", goal: "Go routines, channel patterns, and garbage collector tuning", completed: true },
        { term: "Month 3-4", goal: "Deploying multi-tenant Kubernetes clusters with CKA guidelines", completed: false },
        { term: "Month 5-6", goal: "Set up Istio service meshes for microservice security", completed: false }
      ]
    },
    active_opportunities: [
      { role: "Distributed Systems Engineer", match: 89, status: "Pre-Screened", job_id: "job-2" }
    ],
    candidate_dna: {
      technical_fit: 85,
      experience_fit: 80,
      career_trajectory: 92,
      behavioral_intent: 95,
      credibility: 95,
      hidden_gem_score: 90
    },
    hire_probability: {
      qualified: 0.88,
      available: 0.92,
      engageable: 0.95,
      legitimate: 0.95,
      growth: 0.92,
      scrappiness: 0.96,
      hire_score: 65
    },
    hidden_gem: true,
    honeypot_risk: false,
    reasoning: "Marcus has built complex data pipelines and microservices using Python and Docker, proving he can handle distributed architectures. Although the job requires Go & Kubernetes, his underlying network, messaging (gRPC), and distributed system skills are directly adjacent."
  },
  {
    id: "cand-3",
    name: "Dr. Kenji Tanaka",
    title: "Machine Learning Engineer",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
    experience: 7,
    overall_score: 64,
    categories: ["high_intent", "future_leader"],
    skill_match_score: 97,
    experience_score: 94,
    potential_score: 93,
    intent_score: 98,
    alignment_score: 92,
    skills: [
      { name: "Python", level: 98, matchType: "exact" },
      { name: "PyTorch", level: 95, matchType: "exact" },
      { name: "Transformers", level: 92, matchType: "exact" },
      { name: "TensorFlow", level: 85, matchType: "exact" },
      { name: "NLP", level: 94, matchType: "exact" }
    ],
    why_selected: "Kenji is an exceptional applicant who perfectly matches our AI Research role. He has published 3 papers on Transformer efficiency and maintains a widely used NLP toolkit. His intent score is nearly perfect, showcasing long-term domain investment and a deep alignment with HireMind's research objectives.",
    strengths: [
      "PhD-level researcher with practical software engineering skills",
      "Pioneer in custom attention-mechanism optimizations",
      "Excellent technical writing and communication"
    ],
    risks: [
      "Prefers research environments; might find pure product engineering cycles constraining",
      "Expects high degree of scientific autonomy"
    ],
    predicted_role_2yr: "Director of AI Research",
    prediction_confidence: "89%",
    prediction_rationale: "Kenji demonstrates natural academic leadership and team mentorship, positioning him well to run a modern AI laboratory.",
    readiness: { technical: 98, communication: 92, domain: 96, culture: 89 },
    target_job_id: "job-3",
    authenticity_score: 100,
    knowledge_confidence_score: 98,
    authenticity_status: "verified",
    authenticity_challenge: {
      topic: "React",
      questions_answered: 3,
      score: 100
    },
    learning_roadmap: {
      missing_skills: ["Production LLM Serving", "Distributed Training Scales (Megatron-LM)", "CUDA Programming"],
      certifications: ["NVIDIA CUDA Programming Specialist"],
      timeline: [
        { term: "Month 1-3", goal: "Optimize Triton Inference Server configurations for NLP pipelines", completed: true },
        { term: "Month 4-6", goal: "Implement Megatron-LM tensor parallelisms across 128 GPUs", completed: false }
      ]
    },
    active_opportunities: [
      { role: "AI Research Scientist", match: 95, status: "Interview Scheduled", job_id: "job-3" }
    ],
    candidate_dna: {
      technical_fit: 97,
      experience_fit: 94,
      career_trajectory: 93,
      behavioral_intent: 98,
      credibility: 100,
      hidden_gem_score: 45
    },
    hire_probability: {
      qualified: 0.98,
      available: 0.90,
      engageable: 0.92,
      legitimate: 1.00,
      growth: 0.93,
      scrappiness: 0.85,
      hire_score: 64
    },
    hidden_gem: false,
    honeypot_risk: false,
    reasoning: "Kenji is an exceptional applicant who perfectly matches our AI Research role. He has published 3 papers on Transformer efficiency and maintains a widely used NLP toolkit. Trajectory and intent scores indicate high readiness for this role."
  },
  {
    id: "cand-4",
    name: "Aisha Patel",
    title: "React Developer",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
    experience: 3,
    overall_score: 61,
    categories: ["fast_learner", "high_intent"],
    skill_match_score: 88,
    experience_score: 75,
    potential_score: 94,
    intent_score: 96,
    alignment_score: 88,
    skills: [
      { name: "React", level: 90, matchType: "exact" },
      { name: "TypeScript", level: 85, matchType: "exact" },
      { name: "TailwindCSS", level: 95, matchType: "exact" },
      { name: "Next.js", level: 80, matchType: "exact" },
      { name: "AWS Cloud", level: 60, matchType: "gap", equivalentTo: "N/A" }
    ],
    why_selected: "Aisha is a highly motivated mid-level developer. She possesses strong React, Next.js, and TypeScript skills. While she has a minor gap in cloud infrastructure (AWS), her intense open-source commitment and rapid promotion history (True Potential: 94) make her an outstanding growth hire who will easily transition into an architectural role.",
    strengths: [
      "Clean code advocate; strong semantic HTML and accessibility practices",
      "High participation in regional WebDev meetups and hackathons",
      "Thrives in collaborative, fast-paced agile settings"
    ],
    risks: [
      "Requires mentorship on serverless architecture and cloud deployments",
      "Has not managed project builds from scratch previously"
    ],
    predicted_role_2yr: "Senior Full Stack Engineer",
    prediction_confidence: "87%",
    prediction_rationale: "Aisha's rapid technology adoption curves suggest that adding cloud backend capabilities to her frontend mastery will make her a strong full-stack dev inside 2 years.",
    readiness: { technical: 83, communication: 92, domain: 85, culture: 91 },
    target_job_id: "job-1",
    authenticity_score: 0,
    knowledge_confidence_score: 0,
    authenticity_status: "pending",
    authenticity_challenge: {
      topic: "React",
      questions_answered: 0,
      score: 0
    },
    learning_roadmap: {
      missing_skills: ["AWS Serverless Architectures", "Docker Containerizations", "Next.js SSR Cache Optimizations"],
      certifications: ["AWS Certified Developer"],
      timeline: [
        { term: "Month 1-2", goal: "Understand static and dynamic server configurations in Next.js", completed: true },
        { term: "Month 3-5", goal: "Complete AWS Developer Course and build serverless apps", completed: false }
      ]
    },
    active_opportunities: [
      { role: "Senior Frontend Architect", match: 87, status: "Under Review", job_id: "job-1" }
    ],
    candidate_dna: {
      technical_fit: 88,
      experience_fit: 75,
      career_trajectory: 94,
      behavioral_intent: 96,
      credibility: 88,
      hidden_gem_score: 52
    },
    hire_probability: {
      qualified: 0.82,
      available: 0.95,
      engageable: 0.96,
      legitimate: 0.95,
      growth: 0.94,
      scrappiness: 0.92,
      hire_score: 61
    },
    hidden_gem: false,
    honeypot_risk: false,
    reasoning: "Aisha is a highly motivated mid-level developer. She possesses strong React, Next.js, and TypeScript skills. While she has a minor gap in cloud infrastructure (AWS), her intense open-source commitment and rapid promotion history make her an outstanding growth hire."
  },
  {
    id: "cand-5",
    name: "Liam O'Connor",
    title: "Infrastructure Lead",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80",
    experience: 8,
    overall_score: 48,
    categories: ["future_leader"],
    skill_match_score: 93,
    experience_score: 92,
    potential_score: 88,
    intent_score: 87,
    alignment_score: 95,
    skills: [
      { name: "Terraform", level: 95, matchType: "exact" },
      { name: "Docker", level: 92, matchType: "exact" },
      { name: "AWS", level: 94, matchType: "exact" },
      { name: "CI/CD", level: 90, matchType: "exact" },
      { name: "Python", level: 82, matchType: "exact" }
    ],
    why_selected: "Liam is an experienced Infrastructure Lead who perfectly satisfies our DevOps requirements. He has successfully designed multi-region cloud setups. His leadership score stands out, indicating he can manage small groups and lead key transition strategies.",
    strengths: [
      "Extensive experience with high-availability disaster recovery models",
      "Natural mentor who aligns operational goals with product cycles",
      "Expertise in cost-optimization pipelines"
    ],
    risks: [
      "Relatively conservative regarding experimental tools; prefers proven architectures",
      "Coding limits: relies mostly on scripts rather than software engineering practices"
    ],
    predicted_role_2yr: "VP of Cloud Operations",
    prediction_confidence: "85%",
    prediction_rationale: "His maturity, systems thinking, and leadership capabilities make Liam the ideal candidate to scale infrastructure divisions.",
    readiness: { technical: 92, communication: 90, domain: 91, culture: 94 },
    target_job_id: "job-4",
    authenticity_score: 90,
    knowledge_confidence_score: 88,
    authenticity_status: "verified",
    authenticity_challenge: {
      topic: "AWS",
      questions_answered: 3,
      score: 100
    },
    learning_roadmap: {
      missing_skills: ["Python Microservices", "Security & Encryption at Scale", "Multi-cloud Architectures"],
      certifications: ["AWS Certified Security - Specialty"],
      timeline: [
        { term: "Month 1-3", goal: "Design secure cross-account role configurations in AWS Organizations", completed: true },
        { term: "Month 4-6", goal: "Automate SOC2 compliance checks using Terraform scripts", completed: false }
      ]
    },
    active_opportunities: [
      { role: "Lead DevOps Specialist", match: 91, status: "Under Review", job_id: "job-4" }
    ],
    candidate_dna: {
      technical_fit: 93,
      experience_fit: 92,
      career_trajectory: 88,
      behavioral_intent: 87,
      credibility: 90,
      hidden_gem_score: 40
    },
    hire_probability: {
      qualified: 0.93,
      available: 0.88,
      engageable: 0.87,
      legitimate: 0.95,
      growth: 0.88,
      scrappiness: 0.80,
      hire_score: 48
    },
    hidden_gem: false,
    honeypot_risk: false,
    reasoning: "Liam is an experienced Infrastructure Lead who perfectly satisfies our DevOps requirements. He has successfully designed multi-region cloud setups. Trajectory and intent scores indicate high readiness for this role."
  },
  {
    id: "cand-6",
    name: "Elena Rostova",
    title: "Senior Node/Svelte Developer",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80",
    experience: 5,
    overall_score: 54,
    categories: ["hidden_gem", "fast_learner"],
    skill_match_score: 84,
    experience_score: 85,
    potential_score: 93,
    intent_score: 90,
    alignment_score: 87,
    skills: [
      { name: "Svelte", level: 92, matchType: "adjacent", equivalentTo: "React" },
      { name: "Node.js", level: 90, matchType: "exact" },
      { name: "TailwindCSS", level: 88, matchType: "exact" },
      { name: "Express", level: 85, matchType: "exact" },
      { name: "Azure Services", level: 75, matchType: "adjacent", equivalentTo: "AWS" }
    ],
    why_selected: "Currently stored in the Talent Marketplace. Elena was a runner-up for our Frontend Opening. She possesses massive Svelte capabilities. If a Svelte/Node role opens up, she will be our absolute top match.",
    strengths: [
      "Highly responsive reactive state models in Svelte",
      "Exceptional API server layout patterns",
      "Very fast coding execution cycles"
    ],
    risks: [
      "Mainly worked in smaller startup squads, needs corporate alignment"
    ],
    predicted_role_2yr: "Full Stack Team Lead",
    prediction_confidence: "88%",
    prediction_rationale: "Has natural technical coaching qualities and handles full-stack architectures fluently.",
    readiness: { technical: 86, communication: 89, domain: 82, culture: 88 },
    target_job_id: "none",
    authenticity_score: 0,
    knowledge_confidence_score: 0,
    authenticity_status: "pending",
    authenticity_challenge: {
      topic: "React",
      questions_answered: 0,
      score: 0
    },
    learning_roadmap: {
      missing_skills: ["React Core Architecture", "SvelteKit SSR Implementations", "WebSockets Scalability"],
      certifications: ["Svelte Core Specialist Certificate"],
      timeline: [
        { term: "Month 1-3", goal: "Review React virtual reconciliation and build comparative hooks in Svelte", completed: false },
        { term: "Month 4-6", goal: "Complete WebSockets node clustering architecture courses", completed: false }
      ]
    },
    active_opportunities: [
      { role: "Full Stack Team Lead", match: 88, status: "Stored in Talent Pool", job_id: "none" }
    ],
    candidate_dna: {
      technical_fit: 84,
      experience_fit: 85,
      career_trajectory: 93,
      behavioral_intent: 90,
      credibility: 87,
      hidden_gem_score: 88
    },
    hire_probability: {
      qualified: 0.85,
      available: 0.90,
      engageable: 0.90,
      legitimate: 0.95,
      growth: 0.93,
      scrappiness: 0.88,
      hire_score: 54
    },
    hidden_gem: true,
    honeypot_risk: false,
    reasoning: "Elena is a strong Svelte and Node developer. While not an exact match for React, her reactive component architecture experience translates perfectly. This adjacent stack capability makes her a prime Hidden Gem candidate."
  },
  {
    id: "cand-7",
    name: "Vikram Sharma",
    title: "Senior Frontend Architect",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80",
    experience: 10,
    overall_score: 5,
    categories: ["honeypot_risk"],
    skill_match_score: 100,
    experience_score: 95,
    potential_score: 90,
    intent_score: 85,
    alignment_score: 30,
    skills: [
      { name: "React", level: 100, matchType: "exact" },
      { name: "TypeScript", level: 100, matchType: "exact" },
      { name: "TailwindCSS", level: 100, matchType: "exact" },
      { name: "AWS Cloud", level: 100, matchType: "exact" },
      { name: "Next.js", level: 100, matchType: "exact" }
    ],
    why_selected: "Vikram's profile matches the job requirements perfectly word-for-word, which triggered our Honeypot Detection. His summary matches our job description verbatim, indicating automated profile generation.",
    strengths: [
      "Claimed 100% mastery in React, TypeScript, TailwindCSS, AWS, and Next.js"
    ],
    risks: [
      "CRITICAL: High probability of resume stuffing / Honeypot profile",
      "Verbatim job description overlap detected in profile summary",
      "Suspicious 100% score alignment across all requirement fields"
    ],
    predicted_role_2yr: "Unknown",
    prediction_confidence: "10%",
    prediction_rationale: "Confidence is extremely low due to profile authenticity warning flags.",
    readiness: { technical: 10, communication: 10, domain: 10, culture: 10 },
    target_job_id: "job-1",
    authenticity_score: 20,
    knowledge_confidence_score: 10,
    authenticity_status: "failed",
    authenticity_challenge: {
      topic: "React",
      questions_answered: 3,
      score: 20
    },
    learning_roadmap: {
      missing_skills: ["Ethical Profile Representation"],
      certifications: [],
      timeline: [
        { term: "Month 1-3", goal: "Complete verification challenges and re-submit genuine work history", completed: false }
      ]
    },
    active_opportunities: [
      { role: "Senior Frontend Architect", match: 35, status: "Flagged - Under Review", job_id: "job-1" }
    ],
    candidate_dna: {
      technical_fit: 100,
      experience_fit: 95,
      career_trajectory: 90,
      behavioral_intent: 85,
      credibility: 30,
      hidden_gem_score: 30
    },
    hire_probability: {
      qualified: 0.95,
      available: 0.85,
      engageable: 0.85,
      legitimate: 0.10,
      growth: 0.90,
      scrappiness: 0.85,
      hire_score: 5
    },
    hidden_gem: false,
    honeypot_risk: true,
    reasoning: "Honeypot Alert: This candidate's profile matches the job requirements perfectly without any adjacent or outside skills, indicating automated keyword stuffing. Scoring was penalized accordingly."
  }
];

const rematches = [
  {
    id: "rematch-1",
    candidateName: "Helena Rostova",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80",
    previousRole: "Rejected for React Developer (2mo ago)",
    newMatchRole: "Senior Frontend Architect",
    score: 93
  },
  {
    id: "rematch-2",
    candidateName: "Marcus Vance",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    previousRole: "Rejected for Systems Admin (1mo ago)",
    newMatchRole: "Distributed Systems Engineer",
    score: 89
  }
];

const initialNotifications = [
  {
    id: "notif-1",
    type: "rematch",
    title: "AI Ecosystem Match Found",
    body: "Helena Rostova (previously applied for UI Developer) was automatically matched to the new 'Senior Frontend Architect' opening. Match Score: 93% (Hidden Gem).",
    time: "2 hours ago",
    unread: true,
    actionLink: "#candidates"
  },
  {
    id: "notif-2",
    type: "growth",
    title: "Candidate DNA Threshold Met",
    body: "Marcus Vance has updated his GitHub portfolio with 3 new Rust networking repositories. True Potential score increased to 92.",
    time: "5 hours ago",
    unread: true,
    actionLink: "#dna"
  },
  {
    id: "notif-3",
    type: "pipeline",
    title: "Succession Alert",
    body: "Aisha Patel's projected 2-year path to 'Senior Full Stack' has reached 87% confidence based on recent Node.js certification uploads.",
    time: "1 day ago",
    unread: false,
    actionLink: "#pipeline"
  }
];
