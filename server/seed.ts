import type { PortfolioData } from '../shared/types';

// Initial content, migrated from the original static site. Everything here is
// editable at runtime through the admin dialogs; this only seeds data/db.json
// on first boot.
export const seedData: PortfolioData = {
  profile: {
    name: 'Utsav Ranjan',
    title: 'Full Stack Developer & Software Engineer',
    tagline: 'Turning complex problems into elegant solutions.',
    bio: 'I build clean, performant, and user-friendly web applications. Passionate about turning complex problems into elegant solutions.',
    location: 'India',
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
  },
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
        'Placeholder — edit this entry from admin mode with your real experience.',
        'Each highlight renders as a bullet on the site and in the PDF resume.',
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
        'A full-stack e-commerce solution with real-time inventory, payment integration, and an admin dashboard.',
      tech: ['React', 'Node.js', 'MongoDB'],
      liveUrl: '',
      repoUrl: '',
    },
    {
      id: 'prj-ai-content',
      title: 'AI Content Generator',
      tag: 'AI Tool',
      description:
        'An AI-powered writing assistant that helps create blog posts, social content, and product descriptions.',
      tech: ['Python', 'FastAPI', 'OpenAI'],
      liveUrl: '',
      repoUrl: '',
    },
    {
      id: 'prj-analytics',
      title: 'Analytics Dashboard',
      tag: 'Dashboard',
      description:
        'Real-time analytics dashboard with interactive charts, custom date ranges, and exportable reports.',
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
      id: 'faq-contact',
      question: 'How can I contact you?',
      answer:
        'The best way to reach me is by email at utsavranjan.sk@gmail.com — my inbox is always open.',
    },
    {
      id: 'faq-stack',
      question: 'What is your main tech stack?',
      answer:
        'I work primarily with React, TypeScript and Node.js on the web side, and Python for backend and AI tooling, backed by SQL/NoSQL databases and cloud infrastructure.',
    },
    {
      id: 'faq-open',
      question: 'Are you open to new opportunities?',
      answer:
        "Yes — I'm currently open to new opportunities. Whether you have a question or a role in mind, feel free to email me.",
    },
  ],
};
