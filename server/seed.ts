import type { PortfolioData } from '../shared/types';

// Initial content — written as marketing copy that answers the questions every
// visitor arrives with: who is he, what does he do, why him and not someone
// else. Everything here is editable at runtime through the admin dialogs; this
// only seeds data/db.json on first boot.
//
// Copy guidelines when editing:
//   - Lead with outcomes, not duties ("Cut checkout time 40%", not "worked on checkout").
//   - Write for the visitor's question, not your job description.
//   - The FAQ feeds BOTH the chat assistant and Google's FAQ rich results —
//     phrase questions the way people actually search ("Who is Utsav Ranjan?").
export const seedData: PortfolioData = {
  profile: {
    name: 'Utsav Ranjan',
    title: 'Full Stack Developer & Software Engineer',
    tagline: 'Engineering products people pay for.',
    bio:
      "I'm Utsav Ranjan, a full-stack software engineer and freelance developer. I design, build and ship " +
      'complete products — web applications, AI tools and data platforms — using React, TypeScript, Node.js ' +
      'and Python. Teams and founders hire me when they need someone who owns a problem end-to-end: from ' +
      'ambiguous requirement to a production system that users love and businesses profit from.',
    location: 'India · working remotely worldwide',
    email: 'utsavranjan.sk@gmail.com',
    links: {
      github: 'https://github.com/uranjan21',
      linkedin: '',
    },
    stats: [
      { label: 'Years of experience', value: '5+' },
      { label: 'Projects shipped', value: '20+' },
      { label: 'Technologies mastered', value: '12' },
    ],
    seo: {
      metaDescription:
        'Utsav Ranjan is a full-stack software engineer and freelance developer specialising in React, ' +
        'TypeScript, Node.js, Python and AI tools. Hire Utsav Ranjan to design, build and ship production ' +
        'web applications end-to-end.',
      keywords: [
        'Utsav Ranjan',
        'Utsav Ranjan portfolio',
        'Utsav Ranjan software engineer',
        'Utsav Ranjan developer',
        'hire full stack developer',
        'freelance web developer',
        'React developer',
        'TypeScript developer',
        'Node.js developer',
        'Python developer',
        'AI application developer',
      ],
    },
  },
  audiences: [
    {
      id: 'recruiter',
      label: 'HIRING FOR A TEAM',
      headline: 'The senior engineer who raises your whole team’s bar.',
      pitch:
        'You’re not just filling a seat — you’re buying outcomes. I take features from ambiguous ticket to ' +
        'monitored production code, communicate in trade-offs instead of jargon, and leave every codebase and ' +
        'every teammate better than I found them. Day-one productive, week-one shipping.',
      valueProps: [
        'End-to-end ownership — from requirement to deploy to on-call; I don’t hand half-finished work over the wall.',
        'Force multiplier — reviews, mentoring and docs that speed up the whole team, not just my own commits.',
        'Business fluency — I speak outcomes with stakeholders and trade-offs with engineers, so nothing is lost in translation.',
        'Full-stack in practice — React/TypeScript frontends, Node.js/Python backends, SQL/NoSQL data, cloud deploys.',
      ],
      ctaLabel: '↓ Download my resume',
      ctaHref: '/api/resume.pdf',
    },
    {
      id: 'client',
      label: 'NEED SOMETHING BUILT',
      headline: 'Your product, shipped — without hiring a whole team.',
      pitch:
        'One senior engineer who covers what usually takes three hires: design, build, deploy. I start from ' +
        'what moves your revenue or saves your time — not from the shiniest framework — and you get weekly ' +
        'demos, plain-English updates, and estimates you can actually plan around.',
      valueProps: [
        'One hire, full coverage — frontend, backend, database, deployment and AI integrations from a single accountable partner.',
        'Business-first engineering — every technical decision traced back to your revenue, your costs, or your users.',
        'Transparent process — weekly demos, honest estimates, no surprise invoices and no disappearing acts.',
        'Built to last — clean, documented code your future team can take over without archaeology.',
      ],
      ctaLabel: 'Start a project →',
      ctaHref: '/contact',
    },
    {
      id: 'engineer',
      label: 'FELLOW ENGINEER',
      headline: 'I build things that survive contact with production.',
      pitch:
        'Typed end-to-end, deployed with boring reliability, measured before optimised. This site is a working ' +
        'sample: React + TypeScript client, Express API, shared type contracts, an AI assistant grounded in ' +
        'its own content, and live-generated PDF resumes. Poke around — the source is on GitHub.',
      valueProps: [
        'Typed end-to-end — shared TypeScript contracts between client and server, because runtime surprises are a choice.',
        'Pragmatic architecture — boring technology where possible, novel technology only where it earns its keep.',
        'Automation bias — anything done twice becomes a script, a pipeline, or a bot.',
        'Always shipping — side projects, experiments and open source; the commit graph doesn’t lie.',
      ],
      ctaLabel: 'View my GitHub ↗',
      ctaHref: 'https://github.com/uranjan21',
    },
  ],
  services: [
    {
      id: 'svc-webapp',
      title: 'Web Application Development',
      emoji: '🖥️',
      summary:
        'Complete web applications with React and TypeScript — fast, responsive, and built to convert visitors into customers.',
      description:
        'A website that just exists is a cost; a web application that works for your business is an asset. I build ' +
        'complete web products: marketing sites that rank, dashboards your team actually uses, and customer-facing ' +
        'apps that feel instant.\n\nEvery build is typed end-to-end with TypeScript, responsive by default, and ' +
        'measured against real performance budgets — because a beautiful app nobody waits for beats a beautiful app ' +
        'nobody waits on.',
      deliverables: [
        'Responsive React + TypeScript frontend',
        'Production deployment with CI',
        'Performance and SEO baked in',
        'Documentation and handover walkthrough',
      ],
      tech: ['React', 'TypeScript', 'Vite', 'Node.js'],
    },
    {
      id: 'svc-backend',
      title: 'Backend & API Development',
      emoji: '⚙️',
      summary:
        'Reliable Node.js and Python backends — REST APIs, authentication, integrations and databases that scale with you.',
      description:
        'The backend is where products win or lose trust: it either stays up, stays fast and keeps data safe — or it ' +
        "doesn't. I design and build APIs with Node.js and Python that do the boring things brilliantly: " +
        'authentication, payments, third-party integrations, background jobs and clean data models.\n\nYou get an API ' +
        'your frontend team enjoys consuming and your next engineer can extend without a guided tour.',
      deliverables: [
        'REST API with authentication and validation',
        'Database schema design (SQL or NoSQL)',
        'Third-party integrations (payments, email, …)',
        'API documentation',
      ],
      tech: ['Node.js', 'Python', 'PostgreSQL', 'MongoDB'],
    },
    {
      id: 'svc-ai',
      title: 'AI Integrations & Tools',
      emoji: '🤖',
      summary:
        'Practical AI features for your product — assistants, content pipelines and automations grounded in your own data.',
      description:
        'AI features fail when they are bolted on for the demo. I build AI that earns its place in your product: ' +
        'assistants grounded in your real content, document and data pipelines, and automations that remove hours of ' +
        'manual work per week.\n\nCost-aware prompt design, sensible fallbacks when the model is unsure, and ' +
        'measurable outcomes — the assistant on this very site is a working example.',
      deliverables: [
        'LLM-powered features (OpenAI / Claude APIs)',
        'Retrieval grounded in your own content',
        'Cost-aware prompt pipelines with fallbacks',
        'Usage monitoring and guardrails',
      ],
      tech: ['OpenAI API', 'Python', 'Node.js', 'FastAPI'],
    },
    {
      id: 'svc-dashboards',
      title: 'Dashboards & Data Visualisation',
      emoji: '📊',
      summary:
        'Real-time dashboards that turn your data into decisions — interactive charts, filters and exportable reports.',
      description:
        'Data teams drown in ad-hoc requests because decision-makers cannot answer their own questions. I build ' +
        'dashboards that fix that: real-time metrics, interactive charts, custom date ranges and exports — designed ' +
        'around the decisions people actually make, not around the tables you happen to have.\n\nBuilt with ' +
        'TypeScript and D3 or your charting stack of choice, on top of clean, fast queries.',
      deliverables: [
        'Interactive charts and filters',
        'Real-time or scheduled data refresh',
        'Exportable reports (CSV / PDF)',
        'Role-based access when needed',
      ],
      tech: ['TypeScript', 'D3.js', 'PostgreSQL'],
    },
    {
      id: 'svc-mvp',
      title: 'MVP Development for Startups',
      emoji: '🚀',
      summary:
        'From idea to launched product in weeks — one senior engineer covering design, build and deploy.',
      description:
        'Speed is a startup’s only unfair advantage, and committees are slow. I take founders from napkin sketch to ' +
        'a launched, testable product: scoping what actually needs to exist for v1, building it end-to-end, and ' +
        'shipping it on infrastructure that won’t fall over on launch day.\n\nWeekly demos keep you in control; ' +
        'honest scoping keeps the budget predictable. When you raise or grow, the codebase is ready for the team ' +
        'you hire next.',
      deliverables: [
        'Ruthless v1 scoping session',
        'Full-stack build: frontend, backend, database',
        'Production deployment and analytics',
        'Weekly demos and a launch checklist',
      ],
      tech: ['React', 'TypeScript', 'Node.js', 'Python'],
    },
    {
      id: 'svc-rescue',
      title: 'Code Rescue & Modernisation',
      emoji: '🛠️',
      summary:
        'Stalled project? Legacy codebase? I diagnose, stabilise and modernise so you can ship again.',
      description:
        'Some of my favourite work starts with “our last developer disappeared”. I take over stalled or legacy ' +
        'codebases, map what exists, stabilise what is breaking, and modernise incrementally — no risky big-bang ' +
        'rewrites, no hostage-taking.\n\nYou get an honest technical assessment first, then a prioritised plan: what ' +
        'to fix now, what can wait, and what should never be touched again.',
      deliverables: [
        'Technical audit with prioritised findings',
        'Critical fixes and stabilisation',
        'Incremental modernisation plan',
        'Tests and docs where they pay off most',
      ],
      tech: ['JavaScript', 'TypeScript', 'Python', 'SQL'],
    },
  ],
  // Hidden until you publish real rates from admin mode — visitors should
  // never see invented pricing.
  pricing: [],
  // Hidden until real quotes are added from admin mode — never fabricate these.
  testimonials: [],
  skills: [
    { id: 'sk-react', name: 'React', category: 'Frontend', level: 90, emoji: '⚛️' },
    { id: 'sk-js', name: 'JavaScript / TypeScript', category: 'Frontend', level: 92, emoji: '🟨' },
    { id: 'sk-python', name: 'Python', category: 'Backend', level: 85, emoji: '🐍' },
    { id: 'sk-node', name: 'Node.js', category: 'Backend', level: 80, emoji: '🟢' },
    { id: 'sk-db', name: 'Databases (SQL / NoSQL)', category: 'Data', level: 78, emoji: '🗄️' },
    { id: 'sk-cloud', name: 'Cloud / DevOps', category: 'Infrastructure', level: 72, emoji: '☁️' },
  ],
  experiences: [
    {
      id: 'exp-1',
      company: 'Your Current Company',
      role: 'Software Engineer',
      period: '2021 — Present',
      location: 'Remote',
      highlights: [
        'Placeholder — swap in your real wins from admin mode.',
        'Lead every bullet with a measurable outcome (“Cut page load 40%…”), not a duty (“worked on frontend”).',
      ],
      tech: ['React', 'Node.js', 'TypeScript'],
    },
  ],
  projects: [
    {
      id: 'prj-ecommerce',
      title: 'E-Commerce Platform',
      tag: 'Web App',
      description:
        'Full-stack commerce engine with real-time inventory, integrated payments and an admin dashboard ' +
        'that lets non-technical staff run the store — no developer on call required.',
      tech: ['React', 'Node.js', 'MongoDB'],
      liveUrl: '',
      repoUrl: '',
    },
    {
      id: 'prj-ai-content',
      title: 'AI Content Generator',
      tag: 'AI Tool',
      description:
        'AI writing assistant that turns a product brief into blog posts, social copy and product ' +
        'descriptions in seconds — FastAPI + OpenAI with cost-aware prompt pipelines.',
      tech: ['Python', 'FastAPI', 'OpenAI'],
      liveUrl: '',
      repoUrl: '',
    },
    {
      id: 'prj-analytics',
      title: 'Analytics Dashboard',
      tag: 'Dashboard',
      description:
        'Real-time analytics with interactive D3 charts, custom date ranges and exportable reports — built ' +
        'so decision-makers answer their own questions instead of filing data requests.',
      tech: ['TypeScript', 'D3.js', 'PostgreSQL'],
      liveUrl: '',
      repoUrl: '',
    },
  ],
  blogPosts: [
    {
      id: 'post-1',
      slug: 'idea-to-production',
      title: 'How I take a product from idea to production',
      excerpt:
        'The exact process I use on every freelance build — from ruthless v1 scoping to the launch checklist — and why weekly demos are non-negotiable.',
      content:
        'Every stalled project I have ever rescued died the same death: it tried to be everything before it was ' +
        'anything. So the first thing I do with a new product is not code — it is subtraction.\n\n' +
        '## Step 1: Scope the smallest thing worth launching\n\n' +
        'We list everything the product could do, then cut until removing one more thing would make it pointless. ' +
        'That is v1. Everything else goes on a roadmap where it can no longer delay the launch.\n\n' +
        '## Step 2: Build the walking skeleton\n\n' +
        'Before any feature gets polish, I build the thinnest possible end-to-end slice: one screen, one API call, ' +
        'one database table, deployed to production infrastructure from day one. Deployment problems found in week ' +
        'one cost an afternoon; found in week eight, they cost the launch date.\n\n' +
        '## Step 3: Demo every week, no exceptions\n\n' +
        'Weekly demos are not a status ritual — they are how estimates stay honest. Working software cannot ' +
        'exaggerate. If a week produced nothing demoable, we both learn that immediately, while it is still cheap ' +
        'to fix.\n\n' +
        '## Step 4: Launch with a checklist, not a prayer\n\n' +
        '- Error tracking wired up and tested\n' +
        '- Analytics answering the one question that matters: are people using it?\n' +
        '- Backups verified by actually restoring one\n' +
        '- A rollback path that takes minutes, not meetings\n\n' +
        'None of this is glamorous. All of it is why the products I ship stay shipped. If you have an idea that ' +
        'deserves this treatment, my inbox is open.',
      date: '2026-07-01',
      tags: ['Process', 'Freelancing', 'Shipping'],
    },
  ],
  education: [
    {
      id: 'edu-1',
      institution: 'Your University',
      degree: 'B.Tech in Computer Science',
      period: '2016 — 2020',
      detail: 'Placeholder — edit from admin mode.',
    },
  ],
  achievements: [
    {
      id: 'ach-1',
      title: 'Placeholder achievement',
      description: 'Edit this from admin mode — hackathon wins, certifications, talks, publications.',
      year: '2024',
    },
  ],
  faqs: [
    {
      id: 'faq-who',
      question: 'Who is Utsav Ranjan?',
      answer:
        "I'm Utsav Ranjan — a full-stack software engineer and freelance developer based in India, working " +
        'remotely with teams worldwide. I build complete web products end-to-end with React, TypeScript, ' +
        'Node.js and Python.',
    },
    {
      id: 'faq-what',
      question: 'What does Utsav Ranjan do?',
      answer:
        'I design, build and ship production software: web applications, AI-powered tools, dashboards and ' +
        'APIs. I cover the whole stack — frontend, backend, database and deployment — so a product can go ' +
        'from idea to launch with a single engineer.',
    },
    {
      id: 'faq-why-hire',
      question: 'Why should I hire you instead of another developer?',
      answer:
        'Three reasons: I own outcomes end-to-end instead of handing off half-finished work; I make ' +
        'technical decisions from your business goals, not framework fashion; and I communicate clearly — ' +
        'weekly demos, honest estimates, and code your future team can maintain without me.',
    },
    {
      id: 'faq-freelance',
      question: 'Are you available for freelance or contract work?',
      answer:
        'Yes — I take on freelance and contract projects: new builds, AI integrations, rescues of stalled ' +
        'codebases, and ongoing product development. Email me at utsavranjan.sk@gmail.com with a short ' +
        "description of what you need, and I'll reply with questions and an honest estimate.",
    },
    {
      id: 'faq-open',
      question: 'Are you open to full-time opportunities?',
      answer:
        "Yes — I'm open to senior full-stack roles with teams that ship. The fastest way to start the " +
        'conversation is to email me at utsavranjan.sk@gmail.com; you can also download my one-page resume ' +
        'right from this site.',
    },
    {
      id: 'faq-stack',
      question: 'What is your main tech stack?',
      answer:
        'I work primarily with React, TypeScript and Node.js on the web side, and Python for backend and AI ' +
        'tooling, backed by SQL/NoSQL databases and cloud infrastructure.',
    },
    {
      id: 'faq-remote',
      question: 'Where are you based and do you work remotely?',
      answer:
        "I'm based in India and I work remotely with clients and teams worldwide. I'm used to async " +
        'collaboration across time zones — clear written updates, recorded demos, and overlap hours when it matters.',
    },
    {
      id: 'faq-contact',
      question: 'How can I contact you?',
      answer:
        'The best way to reach me is by email at utsavranjan.sk@gmail.com — my inbox is always open. For a ' +
        'freelance project, include a one-paragraph description and your timeline and I’ll get back to you quickly.',
    },
  ],
};
