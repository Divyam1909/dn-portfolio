# Portfolio Backend API

Express + MongoDB backend for the portfolio website with admin panel and CRUD operations.

## Features

- RESTful API for portfolio data
- JWT-based authentication
- Admin CRUD operations
- Contact form handling
- Rate limiting and security
- MongoDB database
- Organized with MVC pattern

## Setup

### Prerequisites

- Node.js 18+ 
- MongoDB (local or Atlas)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

3. Update `.env` with your configuration:
   - MongoDB connection string
   - JWT secret
   - Admin credentials
   - CORS origins

4. Create admin user:
```bash
node src/scripts/setupAdmin.js
```

5. Start development server:
```bash
npm run dev
```

The API will be available at `http://localhost:5000`

## API Endpoints

### Public Routes

- `GET /api/portfolio` - Get all portfolio data
- `GET /api/personal-info` - Get personal information
- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get single project
- `GET /api/experience` - Get work experience
- `GET /api/education` - Get education
- `GET /api/skills` - Get skills
- `POST /api/contact` - Submit contact form

### Admin Auth Routes

- `POST /api/admin/login` - Admin login
- `GET /api/admin/me` - Get current admin
- `PUT /api/admin/password` - Update password

### Admin CRUD Routes (Protected)

**Personal Info:**
- `PUT /api/admin/personal-info` - Update personal info

**Projects:**
- `GET /api/admin/projects` - Get all projects (including drafts)
- `POST /api/admin/projects` - Create project
- `PUT /api/admin/projects/:id` - Update project
- `DELETE /api/admin/projects/:id` - Delete project

**Experience:**
- `POST /api/admin/experience` - Create experience
- `PUT /api/admin/experience/:id` - Update experience
- `DELETE /api/admin/experience/:id` - Delete experience

**Education:**
- `POST /api/admin/education` - Create education
- `PUT /api/admin/education/:id` - Update education
- `DELETE /api/admin/education/:id` - Delete education

**Skills:**
- `POST /api/admin/skills` - Create skill
- `PUT /api/admin/skills/:id` - Update skill
- `DELETE /api/admin/skills/:id` - Delete skill

**Contact Messages:**
- `GET /api/admin/contacts` - Get all contact messages
- `PUT /api/admin/contacts/:id` - Update contact status
- `DELETE /api/admin/contacts/:id` - Delete contact message

## Deployment to Railway

1. Push code to GitHub

2. Create new project on Railway

3. Connect GitHub repository

4. Add environment variables in Railway dashboard

5. Deploy automatically

## Environment Variables

See `.env.example` for all required variables.

## Security Features

- Helmet for security headers
- CORS protection
- Rate limiting
- JWT authentication
- Password hashing with bcrypt
- Account lockout after failed attempts
- Input validation

## License

MIT

