from __future__ import annotations

from datetime import datetime, timezone

from app.database import get_supabase
from app.schemas.portfolio import (
    Achievement,
    AudiencePitch,
    BlogPost,
    Education,
    Experience,
    FaqEntry,
    PortfolioData,
    PricingPlan,
    Profile,
    Project,
    Service,
    Skill,
    SeoMeta,
    SocialLinks,
    Stat,
    Testimonial,
    Venture,
)

TABLE_MAP = {
    "audiences": "audiences",
    "services": "services",
    "pricing": "pricing_plans",
    "testimonials": "testimonials",
    "skills": "skills",
    "experiences": "experiences",
    "projects": "projects",
    "blogPosts": "blog_posts",
    "ventures": "ventures",
    "education": "education",
    "achievements": "achievements",
    "faqs": "faqs",
}


def _row_id(row: dict) -> str:
    return str(row["id"])


def _build_profile(db) -> Profile:
    row = db.table("profile").select("*").limit(1).execute().data
    if not row:
        return Profile()
    p = row[0]
    stats_rows = (
        db.table("stats")
        .select("*")
        .eq("profile_id", p["id"])
        .order("sort_order")
        .execute()
        .data
    )
    return Profile(
        name=p.get("name", ""),
        title=p.get("title", ""),
        tagline=p.get("tagline", ""),
        bio=p.get("bio", ""),
        location=p.get("location", ""),
        email=p.get("email", ""),
        phone=p.get("phone"),
        photoUrl=p.get("photo_url"),
        links=SocialLinks(
            github=p.get("github"),
            linkedin=p.get("linkedin"),
            twitter=p.get("twitter"),
            website=p.get("website"),
        ),
        stats=[Stat(label=s["label"], value=s["value"]) for s in stats_rows],
        seo=SeoMeta(
            metaDescription=p.get("meta_description", ""),
            keywords=p.get("keywords", []),
            ogImage=p.get("og_image"),
        ),
    )


def _build_audiences(db) -> list[AudiencePitch]:
    rows = db.table("audiences").select("*").order("sort_order").execute().data
    return [
        AudiencePitch(
            id=r["audience_key"],
            label=r["label"],
            headline=r["headline"],
            pitch=r["pitch"],
            valueProps=r.get("value_props", []),
            ctaLabel=r.get("cta_label", ""),
            ctaHref=r.get("cta_href", ""),
        )
        for r in rows
    ]


def _build_services(db) -> list[Service]:
    rows = db.table("services").select("*").order("sort_order").execute().data
    return [
        Service(
            id=_row_id(r),
            title=r["title"],
            emoji=r.get("emoji", ""),
            summary=r.get("summary", ""),
            description=r.get("description", ""),
            deliverables=r.get("deliverables", []),
            tech=r.get("tech", []),
        )
        for r in rows
    ]


def _build_pricing(db) -> list[PricingPlan]:
    rows = db.table("pricing_plans").select("*").order("sort_order").execute().data
    return [
        PricingPlan(
            id=_row_id(r),
            name=r["name"],
            price=r.get("price", ""),
            unit=r.get("unit", ""),
            features=r.get("features", []),
            highlighted=r.get("highlighted", False),
        )
        for r in rows
    ]


def _build_testimonials(db) -> list[Testimonial]:
    rows = db.table("testimonials").select("*").order("sort_order").execute().data
    return [
        Testimonial(
            id=_row_id(r),
            quote=r["quote"],
            author=r["author"],
            role=r.get("role", ""),
            rating=r.get("rating"),
        )
        for r in rows
    ]


def _build_skills(db) -> list[Skill]:
    rows = db.table("skills").select("*").order("sort_order").execute().data
    return [
        Skill(
            id=_row_id(r),
            name=r["name"],
            category=r.get("category", ""),
            level=r.get("level", 0),
            emoji=r.get("emoji"),
        )
        for r in rows
    ]


def _build_experiences(db) -> list[Experience]:
    rows = db.table("experiences").select("*").order("sort_order").execute().data
    return [
        Experience(
            id=_row_id(r),
            company=r["company"],
            role=r["role"],
            period=r.get("period", ""),
            location=r.get("location", ""),
            highlights=r.get("highlights", []),
            tech=r.get("tech", []),
        )
        for r in rows
    ]


def _build_projects(db) -> list[Project]:
    rows = (
        db.table("projects")
        .select("*")
        .eq("is_public", True)
        .order("sort_order")
        .execute()
        .data
    )
    return [
        Project(
            id=_row_id(r),
            title=r["title"],
            tag=r.get("tag", ""),
            description=r.get("description", ""),
            details=r.get("details"),
            tech=r.get("tech", []),
            liveUrl=r.get("live_url"),
            repoUrl=r.get("repo_url"),
        )
        for r in rows
    ]


def _build_blog_posts(db) -> list[BlogPost]:
    rows = (
        db.table("blog_posts")
        .select("*")
        .eq("is_published", True)
        .order("published_at", desc=True)
        .execute()
        .data
    )
    return [
        BlogPost(
            id=_row_id(r),
            slug=r["slug"],
            title=r["title"],
            excerpt=r.get("excerpt", ""),
            content=r.get("content", ""),
            date=(r.get("published_at") or r.get("created_at", ""))[:10],
            tags=r.get("tags", []),
            coverUrl=r.get("cover_url"),
        )
        for r in rows
    ]


def _build_ventures(db) -> list[Venture]:
    rows = db.table("ventures").select("*").order("sort_order").execute().data
    return [
        Venture(
            id=_row_id(r),
            title=r["title"],
            emoji=r.get("emoji", ""),
            tagline=r.get("tagline", ""),
            description=r.get("description", ""),
            live=r.get("live", False),
            url=r.get("url"),
        )
        for r in rows
    ]


def _build_education(db) -> list[Education]:
    rows = db.table("education").select("*").order("sort_order").execute().data
    return [
        Education(
            id=_row_id(r),
            institution=r["institution"],
            degree=r["degree"],
            period=r.get("period", ""),
            detail=r.get("detail"),
        )
        for r in rows
    ]


def _build_achievements(db) -> list[Achievement]:
    rows = db.table("achievements").select("*").order("sort_order").execute().data
    return [
        Achievement(
            id=_row_id(r),
            title=r["title"],
            description=r.get("description", ""),
            year=r.get("year", ""),
        )
        for r in rows
    ]


def _build_faqs(db) -> list[FaqEntry]:
    rows = db.table("faqs").select("*").order("sort_order").execute().data
    return [
        FaqEntry(id=_row_id(r), question=r["question"], answer=r["answer"])
        for r in rows
    ]


def get_portfolio() -> PortfolioData:
    db = get_supabase()
    return PortfolioData(
        profile=_build_profile(db),
        audiences=_build_audiences(db),
        services=_build_services(db),
        pricing=_build_pricing(db),
        testimonials=_build_testimonials(db),
        skills=_build_skills(db),
        experiences=_build_experiences(db),
        projects=_build_projects(db),
        blogPosts=_build_blog_posts(db),
        ventures=_build_ventures(db),
        education=_build_education(db),
        achievements=_build_achievements(db),
        faqs=_build_faqs(db),
    )


def _update_profile(profile_data: dict) -> None:
    db = get_supabase()
    links = profile_data.pop("links", {}) or {}
    seo = profile_data.pop("seo", {}) or {}
    stats_list = profile_data.pop("stats", []) or []

    update = {
        "name": profile_data.get("name", ""),
        "title": profile_data.get("title", ""),
        "tagline": profile_data.get("tagline", ""),
        "bio": profile_data.get("bio", ""),
        "location": profile_data.get("location", ""),
        "email": profile_data.get("email", ""),
        "phone": profile_data.get("phone"),
        "photo_url": profile_data.get("photoUrl"),
        "github": links.get("github"),
        "linkedin": links.get("linkedin"),
        "twitter": links.get("twitter"),
        "website": links.get("website"),
        "meta_description": seo.get("metaDescription", ""),
        "keywords": seo.get("keywords", []),
        "og_image": seo.get("ogImage"),
        "updated_at": datetime.now(timezone.utc).isoformat(),
    }
    db.table("profile").update(update).eq("id", 1).execute()

    db.table("stats").delete().eq("profile_id", 1).execute()
    for i, s in enumerate(stats_list):
        db.table("stats").insert(
            {"profile_id": 1, "label": s["label"], "value": s["value"], "sort_order": i}
        ).execute()


_SECTION_COLUMN_MAPS: dict[str, dict[str, str]] = {
    "audiences": {
        "id": "audience_key",
        "valueProps": "value_props",
        "ctaLabel": "cta_label",
        "ctaHref": "cta_href",
    },
    "services": {},
    "pricing": {"highlighted": "highlighted"},
    "testimonials": {},
    "skills": {},
    "experiences": {},
    "projects": {"liveUrl": "live_url", "repoUrl": "repo_url"},
    "blogPosts": {"coverUrl": "cover_url"},
    "ventures": {},
    "education": {},
    "achievements": {},
    "faqs": {},
}


def _camel_to_snake_row(row: dict, section: str) -> dict:
    col_map = _SECTION_COLUMN_MAPS.get(section, {})
    result = {}
    for k, v in row.items():
        if k == "id" and section != "audiences":
            continue
        col = col_map.get(k, k)
        result[col] = v
    return result


def _blog_post_to_db(row: dict) -> dict:
    result = {
        "slug": row.get("slug", ""),
        "title": row.get("title", ""),
        "excerpt": row.get("excerpt", ""),
        "content": row.get("content", ""),
        "cover_url": row.get("coverUrl"),
        "tags": row.get("tags", []),
        "is_published": True,
        "published_at": row.get("date"),
    }
    return result


def update_section(section: str, value) -> PortfolioData:
    db = get_supabase()

    if section == "profile":
        _update_profile(value if isinstance(value, dict) else value)
        return get_portfolio()

    table_name = TABLE_MAP.get(section)
    if not table_name:
        raise ValueError(f"Unknown section: {section}")

    db.table(table_name).delete().neq("id", -1).execute()

    items = value if isinstance(value, list) else []
    for i, item in enumerate(items):
        raw = item if isinstance(item, dict) else item
        if section == "blogPosts":
            db_row = _blog_post_to_db(raw)
        elif section == "audiences":
            db_row = _camel_to_snake_row(raw, section)
            db_row["audience_key"] = raw.get("id", f"audience-{i}")
        else:
            db_row = _camel_to_snake_row(raw, section)
        db_row["sort_order"] = i
        db.table(table_name).insert(db_row).execute()

    return get_portfolio()
