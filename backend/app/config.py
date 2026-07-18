from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    supabase_url: str = ""
    supabase_key: str = ""

    admin_password: str = "change-me"
    session_secret: str = "dev-secret-change-in-production"

    openai_api_key: str = ""
    openai_model: str = "gpt-4o-mini"

    smtp_host: str = ""
    smtp_port: int = 587
    smtp_user: str = ""
    smtp_pass: str = ""
    notify_to: str = "utsavranjan.sk@gmail.com"

    site_url: str = "https://utsavranjan.info"
    cors_origins: str = "http://localhost:5173,https://utsavranjan.info"

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8"}


settings = Settings()
