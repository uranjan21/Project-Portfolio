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
      ctaHref: 'mailto:utsavranjan.sk@gmail.com?subject=Project%20inquiry',
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
  // Hidden until real quotes are added from admin mode — never fabricate these.
  testimonials: [],
  skills: [
    { id: 'sk-react', name: 'React', category: 'Frontend', level: 90 },
    { id: 'sk-js', name: 'JavaScript / TypeScript', category: 'Frontend', level: 92 },
    { id: 'sk-python', name: 'Python', category: 'Backend', level: 85 },
    { id: 'sk-node', name: 'Node.js', category: 'Backend', level: 80 },
    { id: 'sk-db', name: 'Databases (SQL / NoSQL)', category: 'Data', level: 78 },
    { id: 'sk-cloud', name: 'Cloud / DevOps', category: 'Infrastructure', level: 72 },
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
