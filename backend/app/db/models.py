from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Enum, Table
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
import enum

Base = declarative_base()

class UserRole(str, enum.Enum):
    ADMIN = "admin"
    USER = "user"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)
    role = Column(Enum(UserRole), default=UserRole.USER)
    
    # Relationships
    project_assignments = relationship("ProjectAssignment", back_populates="user")

class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(String)
    status = Column(String)
    technologies = Column(String)  # Stored as comma-separated values
    required_team_size = Column(Integer)
    created_by = Column(Integer, ForeignKey("users.id"))
    
    # Relationships
    assignments = relationship("ProjectAssignment", back_populates="project")
    creator = relationship("User", foreign_keys=[created_by])

class ProjectAssignment(Base):
    __tablename__ = "project_assignments"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    role = Column(String)  # e.g., "developer", "designer", "project_manager"
    
    # Relationships
    project = relationship("Project", back_populates="assignments")
    user = relationship("User", back_populates="project_assignments") 