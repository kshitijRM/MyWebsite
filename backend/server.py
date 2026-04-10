from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import asyncio
import httpx
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Resend setup
try:
    import resend
    RESEND_API_KEY = os.environ.get('RESEND_API_KEY')
    if RESEND_API_KEY:
        resend.api_key = RESEND_API_KEY
    SENDER_EMAIL = os.environ.get('SENDER_EMAIL', 'onboarding@resend.dev')
    SUPPORT_EMAIL = os.environ.get('SUPPORT_EMAIL', 'eng.ufoo@gmail.com')
except ImportError:
    resend = None
    RESEND_API_KEY = None
    SENDER_EMAIL = None
    SUPPORT_EMAIL = None

# GitHub token
GITHUB_TOKEN = os.environ.get('GITHUB_TOKEN')
GITHUB_USERNAME = 'kshitijRM'

# Create the main app
app = FastAPI()
api_router = APIRouter(prefix="/api")

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Models
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

class ContactForm(BaseModel):
    name: str
    email: EmailStr
    message: str

class ContactResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    name: str
    email: str
    message: str
    created_at: str
    email_sent: bool

class GitHubRepo(BaseModel):
    id: int
    name: str
    full_name: str
    description: Optional[str] = None
    html_url: str
    stargazers_count: int
    forks_count: int
    language: Optional[str] = None
    topics: List[str] = []
    created_at: str
    updated_at: str
    homepage: Optional[str] = None

# Routes
@api_router.get("/")
async def root():
    return {"message": "Kshitij Dinni Portfolio API"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    _ = await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    return status_checks

@api_router.post("/contact", response_model=ContactResponse)
async def submit_contact(form: ContactForm):
    """Submit contact form and send email notification"""
    contact_id = str(uuid.uuid4())
    created_at = datetime.now(timezone.utc).isoformat()
    
    # Save to database
    doc = {
        "id": contact_id,
        "name": form.name,
        "email": form.email,
        "message": form.message,
        "created_at": created_at,
        "email_sent": False
    }
    
    await db.contacts.insert_one(doc)
    
    # Send email notification
    email_sent = False
    if resend and RESEND_API_KEY:
        try:
            html_content = f"""
            <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #f2f2f2; padding: 40px; border: 1px solid rgba(224, 255, 0, 0.3);">
                <h1 style="color: #E0FF00; margin-bottom: 30px; font-size: 24px;">New Contact Form Submission</h1>
                <div style="background: rgba(255,255,255,0.05); padding: 20px; margin-bottom: 20px;">
                    <p style="margin: 0 0 10px 0;"><strong style="color: #E0FF00;">Name:</strong> {form.name}</p>
                    <p style="margin: 0 0 10px 0;"><strong style="color: #E0FF00;">Email:</strong> {form.email}</p>
                </div>
                <div style="background: rgba(255,255,255,0.05); padding: 20px;">
                    <p style="margin: 0 0 10px 0;"><strong style="color: #E0FF00;">Message:</strong></p>
                    <p style="margin: 0; white-space: pre-wrap;">{form.message}</p>
                </div>
                <p style="margin-top: 30px; color: #8a8a8a; font-size: 12px;">Submitted from Kshitij Dinni Portfolio</p>
            </div>
            """
            
            params = {
                "from": SENDER_EMAIL,
                "to": [SUPPORT_EMAIL or os.environ.get('NOTIFICATION_EMAIL', 'eng.ufoo@gmail.com')],
                "subject": f"Portfolio Contact: {form.name}",
                "html": html_content,
                "reply_to": form.email
            }
            
            await asyncio.to_thread(resend.Emails.send, params)
            email_sent = True
            
            # Update database
            await db.contacts.update_one(
                {"id": contact_id},
                {"$set": {"email_sent": True}}
            )
            logger.info(f"Email sent for contact {contact_id}")
        except Exception as e:
            logger.error(f"Failed to send email: {str(e)}")
    
    return ContactResponse(
        id=contact_id,
        name=form.name,
        email=form.email,
        message=form.message,
        created_at=created_at,
        email_sent=email_sent
    )

@api_router.get("/github/repos", response_model=List[GitHubRepo])
async def get_github_repos():
    """Fetch GitHub repositories for the portfolio"""
    headers = {
        "Accept": "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28"
    }
    
    if GITHUB_TOKEN:
        headers["Authorization"] = f"Bearer {GITHUB_TOKEN}"
    
    try:
        async with httpx.AsyncClient() as client:
            # Fetch repos
            response = await client.get(
                f"https://api.github.com/users/{GITHUB_USERNAME}/repos",
                headers=headers,
                params={"sort": "updated", "per_page": 30, "type": "owner"}
            )
            
            if response.status_code != 200:
                logger.error(f"GitHub API error: {response.status_code}")
                raise HTTPException(status_code=response.status_code, detail="Failed to fetch repos")
            
            repos_data = response.json()
            
            # Transform and return
            repos = []
            for repo in repos_data:
                if not repo.get('fork', False):  # Skip forks
                    repos.append(GitHubRepo(
                        id=repo['id'],
                        name=repo['name'],
                        full_name=repo['full_name'],
                        description=repo.get('description'),
                        html_url=repo['html_url'],
                        stargazers_count=repo.get('stargazers_count', 0),
                        forks_count=repo.get('forks_count', 0),
                        language=repo.get('language'),
                        topics=repo.get('topics', []),
                        created_at=repo['created_at'],
                        updated_at=repo['updated_at'],
                        homepage=repo.get('homepage')
                    ))
            
            return repos
            
    except httpx.RequestError as e:
        logger.error(f"Request error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to connect to GitHub")

@api_router.get("/contacts", response_model=List[ContactResponse])
async def get_contacts():
    """Get all contact submissions (admin endpoint)"""
    contacts = await db.contacts.find({}, {"_id": 0}).to_list(1000)
    return contacts

# Include router and middleware
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
