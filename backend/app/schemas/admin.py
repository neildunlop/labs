from pydantic import BaseModel, EmailStr
from typing import List, Optional
from ..db.models import UserRole

# User Schemas
class UserBase(BaseModel):
    email: EmailStr
    is_active: bool = True
    role: UserRole = UserRole.USER

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    is_active: Optional[bool] = None
    role: Optional[UserRole] = None
    password: Optional[str] = None

class UserResponse(UserBase):
    id: int

    class Config:
        orm_mode = True

# Project Schemas
class ProjectBase(BaseModel):
    title: str
    description: str
    status: str
    technologies: str
    required_team_size: int

class ProjectCreate(ProjectBase):
    pass

class ProjectUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    technologies: Optional[str] = None
    required_team_size: Optional[int] = None

class ProjectResponse(ProjectBase):
    id: int
    created_by: int

    class Config:
        orm_mode = True

# Assignment Schemas
class AssignmentBase(BaseModel):
    project_id: int
    user_id: int
    role: str

class AssignmentCreate(AssignmentBase):
    pass

class AssignmentUpdate(BaseModel):
    project_id: Optional[int] = None
    user_id: Optional[int] = None
    role: Optional[str] = None

class AssignmentResponse(AssignmentBase):
    id: int

    class Config:
        orm_mode = True 