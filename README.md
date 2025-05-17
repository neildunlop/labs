# Burendo Labs Website

A modern web application for managing and showcasing Burendo Labs projects. Built with React, TypeScript, and Python FastAPI.

## Features

- Welcome page with Burendo Labs ethos and principles
- Project listing and detailed project pages
- User sign-up functionality
- Project suggestion submission
- Clean and modern UI with responsive design
- RESTful API backend with FastAPI
- User authentication and authorization
- Project management endpoints

## Tech Stack

### Frontend
- React 18
- TypeScript
- Tailwind CSS
- React Router DOM
- Vite

### Backend
- Python 3.11+
- FastAPI
- SQLAlchemy
- Pydantic
- Alembic for database migrations
- JWT for authentication

## Getting Started

### Frontend Setup
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:5173](http://localhost:5173) in your browser

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   # Windows
   python -m venv venv
   .\venv\Scripts\activate

   # macOS/Linux
   python3 -m venv venv
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Set up environment variables:
   ```bash
   # Copy the example env file
   cp .env.example .env
   # Edit .env with your configuration
   ```
5. Run database migrations:
   ```bash
   alembic upgrade head
   ```
6. Start the development server:
   ```bash
   uvicorn app.main:app --reload
   ```
7. The API will be available at [http://localhost:8000](http://localhost:8000)
8. API documentation is available at [http://localhost:8000/docs](http://localhost:8000/docs)

## Project Structure

```
burendo-labs/
├── src/              # Frontend source code
│   ├── components/   # Reusable UI components
│   ├── pages/       # Page components
│   ├── App.tsx      # Main application component
│   └── main.tsx     # Application entry point
│
├── backend/         # Backend source code
│   ├── app/        # Main application code
│   │   ├── api/    # API endpoints
│   │   ├── core/   # Core functionality
│   │   ├── db/     # Database models and migrations
│   │   └── main.py # Application entry point
│   ├── tests/      # Backend tests
│   └── alembic/    # Database migrations
```

## Development

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Backend
- `uvicorn app.main:app --reload` - Start development server
- `pytest` - Run tests
- `alembic upgrade head` - Apply database migrations
- `alembic revision --autogenerate -m "description"` - Generate new migration

## Environment Variables

### Frontend
- `VITE_API_URL` - Backend API URL (default: http://localhost:8000)

### Backend
- `DATABASE_URL` - PostgreSQL database URL
- `SECRET_KEY` - JWT secret key
- `ALGORITHM` - JWT algorithm (default: HS256)
- `ACCESS_TOKEN_EXPIRE_MINUTES` - JWT token expiration time

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Submit a pull request

## License

This project is proprietary and confidential.
