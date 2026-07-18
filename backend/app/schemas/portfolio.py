from __future__ import annotations

from pydantic import BaseModel


class SocialLinks(BaseModel):
    github: str | None = None
    linkedin: str | None = None
    twitter: str | None = None
    website: str | None = None


class Stat(BaseModel):
    label: str
    value: str


class SeoMeta(BaseModel):
    metaDescription: str = ""
    keywords: list[str] = []
    ogImage: str | None = None


class Profile(BaseModel):
    name: str = ""
    title: str = ""
    tagline: str = ""
    bio: str = ""
    location: str = ""
    email: str = ""
    phone: str | None = None
    photoUrl: str | None = None
    links: SocialLinks = SocialLinks()
    stats: list[Stat] = []
    seo: SeoMeta = SeoMeta()


class AudiencePitch(BaseModel):
    id: str
    label: str
    headline: str
    pitch: str
    valueProps: list[str] = []
    ctaLabel: str = ""
    ctaHref: str = ""


class Testimonial(BaseModel):
    id: str
    quote: str
    author: str
    role: str = ""
    rating: int | None = None


class Service(BaseModel):
    id: str
    title: str
    emoji: str = ""
    summary: str = ""
    description: str = ""
    deliverables: list[str] = []
    tech: list[str] = []


class PricingPlan(BaseModel):
    id: str
    name: str
    price: str = ""
    unit: str = ""
    features: list[str] = []
    highlighted: bool = False


class BlogPost(BaseModel):
    id: str
    slug: str
    title: str
    excerpt: str = ""
    content: str = ""
    date: str = ""
    tags: list[str] = []
    coverUrl: str | None = None


class Venture(BaseModel):
    id: str
    title: str
    emoji: str = ""
    tagline: str = ""
    description: str = ""
    live: bool = False
    url: str | None = None


class ContactMessage(BaseModel):
    id: str
    name: str
    email: str
    phone: str | None = None
    interest: str | None = None
    budget: str | None = None
    message: str
    sentAt: str
    read: bool


class Skill(BaseModel):
    id: str
    name: str
    category: str = ""
    level: int = 0
    emoji: str | None = None


class Experience(BaseModel):
    id: str
    company: str
    role: str
    period: str = ""
    location: str = ""
    highlights: list[str] = []
    tech: list[str] = []


class Project(BaseModel):
    id: str
    title: str
    tag: str = ""
    description: str = ""
    details: str | None = None
    tech: list[str] = []
    liveUrl: str | None = None
    repoUrl: str | None = None
    coverUrl: str | None = None


class Education(BaseModel):
    id: str
    institution: str
    degree: str
    period: str = ""
    detail: str | None = None


class Achievement(BaseModel):
    id: str
    title: str
    description: str = ""
    year: str = ""


class FaqEntry(BaseModel):
    id: str
    question: str
    answer: str


class PortfolioData(BaseModel):
    profile: Profile
    audiences: list[AudiencePitch] = []
    services: list[Service] = []
    pricing: list[PricingPlan] = []
    testimonials: list[Testimonial] = []
    skills: list[Skill] = []
    experiences: list[Experience] = []
    projects: list[Project] = []
    blogPosts: list[BlogPost] = []
    ventures: list[Venture] = []
    education: list[Education] = []
    achievements: list[Achievement] = []
    faqs: list[FaqEntry] = []


class UnansweredQuestion(BaseModel):
    id: str
    question: str
    askedAt: str
    status: str = "open"
    answer: str | None = None


SECTION_KEYS = [
    "profile", "audiences", "services", "pricing", "testimonials",
    "skills", "experiences", "projects", "blogPosts", "ventures",
    "education", "achievements", "faqs",
]


class SectionUpdateRequest(BaseModel):
    section: str
    value: dict | list


class AnswerQuestionRequest(BaseModel):
    answer: str
    addToFaq: bool = False
