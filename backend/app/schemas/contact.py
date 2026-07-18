from pydantic import BaseModel, EmailStr


class ContactPayload(BaseModel):
    name: str
    email: EmailStr
    phone: str | None = None
    interest: str | None = None
    budget: str | None = None
    message: str


class FollowUpPayload(BaseModel):
    note: str


class StatusUpdatePayload(BaseModel):
    status: str


class ClientCreate(BaseModel):
    name: str
    email: str | None = None
    phone: str | None = None
    company: str | None = None
    notes: str | None = None
    source: str | None = None


class ClientUpdate(BaseModel):
    name: str | None = None
    email: str | None = None
    phone: str | None = None
    company: str | None = None
    notes: str | None = None
    source: str | None = None


class ProjectCreate(BaseModel):
    title: str
    tag: str = ""
    description: str = ""
    details: str | None = None
    tech: list[str] = []
    live_url: str | None = None
    repo_url: str | None = None
    cover_url: str | None = None
    status: str = "received"
    client_id: int | None = None
    budget: str | None = None
    start_date: str | None = None
    end_date: str | None = None
    notes: str | None = None
    is_public: bool = True


class ProjectUpdate(BaseModel):
    title: str | None = None
    tag: str | None = None
    description: str | None = None
    details: str | None = None
    tech: list[str] | None = None
    live_url: str | None = None
    repo_url: str | None = None
    cover_url: str | None = None
    status: str | None = None
    client_id: int | None = None
    budget: str | None = None
    start_date: str | None = None
    end_date: str | None = None
    notes: str | None = None
    is_public: bool | None = None


class BlogCreate(BaseModel):
    slug: str
    title: str
    excerpt: str = ""
    content: str = ""
    cover_url: str | None = None
    tags: list[str] = []
    is_published: bool = False


class BlogUpdate(BaseModel):
    slug: str | None = None
    title: str | None = None
    excerpt: str | None = None
    content: str | None = None
    cover_url: str | None = None
    tags: list[str] | None = None
    is_published: bool | None = None
