from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter
from slowapi.util import get_remote_address
from slowapi.middleware import SlowAPIMiddleware

from app.routers import admin, auth, blogs, clients, messages, projects, public, questions, resume

limiter = Limiter(key_func=get_remote_address)

app = FastAPI(title="utsavranjan.info API", version="1.0.0")

app.state.limiter = limiter
app.add_middleware(SlowAPIMiddleware)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "https://utsavranjan.info"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(public.router)
app.include_router(auth.router)
app.include_router(admin.router)
app.include_router(questions.router)
app.include_router(messages.router)
app.include_router(resume.router)
app.include_router(clients.router)
app.include_router(projects.router)
app.include_router(blogs.router)


@app.get("/")
def root():
    return {"status": "ok", "app": "utsavranjan.info"}
