# Portfolio Website

A modern, full-stack interactive portfolio website with an admin panel for easy content management. Built with React, TypeScript, Material UI, Express.js, and MongoDB.

## Features

### Public Features
- **🌌 Realistic Solar System View**: Immersive 3D solar system where each planet represents a portfolio section
  - Multi-layered sun with corona effects
  - Atmospheric planet glows
  - Saturn-style rings
  - Interactive orbit controls
  - Bloom post-processing effects
  - Nebula background
- **Interactive UI**: Background particles, 3D confetti effects, and animated characters
- **Responsive Design**: Fully responsive layout that works on all device sizes
- **Dark/Light Mode**: Toggle between dark and light themes with persistence
- **Dynamic Content**: All content is fetched from MongoDB database
- **Contact Form**: Submit inquiries that are stored in the database
- **SEO Optimized**: Configured for search engine visibility
- **Keyboard Navigation**: Shortcuts for improved accessibility (Alt+1 through Alt+5)
- **Smooth Animations**: Framer Motion powered transitions

### Admin Panel Features
- **Secure Login**: JWT-based authentication with account lockout protection
- **CRUD Operations**: Full Create, Read, Update, Delete for all portfolio content
- **Rich Text Editor**: Format descriptions with Quill editor
- **Drag & Drop Reordering**: Reorder projects and certifications
- **Skeleton Loaders**: Better loading UX
- **Mobile Optimized**: Admin panel works great on mobile
- **Personal Info Management**: Update bio, contact details, social links
- **Project Management**: Add, edit, delete projects with featured flag
- **Experience Management**: Manage work history and achievements
- **Education Management**: Update educational background
- **Skills Management**: Add technical skills, soft skills, and languages
- **Certifications**: Full certification CRUD with expiry tracking
- **Contact Messages**: View and manage contact form submissions
- **Real-time Updates**: Changes reflect immediately on the public site

## Tech Stack

### Frontend
- React 19.0.0
- TypeScript
- Material UI 6.4.8
- Axios for API calls
- React Query for API caching
- Three.js + React Three Fiber for 3D solar system
- @react-three/drei for 3D helpers
- @react-three/postprocessing for visual effects
- Framer Motion for animations
- React Router for navigation
- React Quill for rich text editing
- @dnd-kit for drag & drop

### Backend
- Express.js
- Node.js 18+
- MongoDB with Mongoose
- JWT Authentication
- bcryptjs for password hashing
- express-validator for input validation
- Helmet for security
- Rate limiting

## Getting Started

### Prerequisites
- Node.js 18.x or higher
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn

### Installation

#### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file from `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Update `.env` with your configuration:
   - Add your MongoDB connection string
   - Generate a strong JWT secret
   - Set admin credentials
   - Configure CORS origins

5. Initialize the admin user:
   ```bash
   node src/scripts/setupAdmin.js
   ```

6. Start the backend server:
   ```bash
   npm run dev
   ```

   Backend will run on http://localhost:5000

#### Frontend Setup

1. Navigate to the frontend directory (project root):
   ```bash
   cd ..
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env.local` from `.env.example`:
   ```bash
   cp .env.example .env.local
   ```

4. Update `.env.local`:
   - Set `REACT_APP_API_URL` to your backend URL
   - Set custom admin path and password

5. Start the development server:
   ```bash
   npm start
   ```

   Frontend will run on http://localhost:3000

## Project Structure

```
Portfolio/
├── backend/                    # Express.js API
│   ├── src/
│   │   ├── config/            # Database configuration
│   │   ├── models/            # Mongoose models
│   │   ├── routes/            # API routes
│   │   ├── middleware/        # Auth & validation middleware
│   │   ├── controllers/       # Business logic
│   │   ├── scripts/           # Utility scripts
│   │   └── server.js          # Entry point
│   ├── .env.example           # Environment variables template
│   ├── package.json
│   └── railway.json           # Railway deployment config
│
├── src/                        # React frontend
│   ├── components/            # Reusable UI components
│   ├── contexts/              # React context providers
│   │   ├── DataContext.tsx   # Portfolio data management
│   │   └── AdminContext.tsx  # Admin authentication
│   ├── data/                  # Static data structure
│   │   └── portfolioData.ts  # Data template (fallback)
│   ├── hooks/                 # Custom React hooks
│   ├── pages/                 # Page components
│   │   ├── Admin/            # Admin panel pages
│   │   │   ├── AdminLogin.tsx
│   │   │   ├── AdminDashboard.tsx
│   │   │   └── components/   # Admin CRUD components
│   │   ├── Home.tsx
│   │   ├── About.tsx
│   │   ├── Resume.tsx
│   │   ├── Projects.tsx
│   │   └── Contact.tsx
│   ├── services/              # API services
│   │   ├── api.ts            # Axios instance & API calls
│   │   └── database.ts       # Local storage service
│   └── utils/                 # Utility functions
│
├── public/                     # Static assets
├── .env.local                  # Frontend environment variables
├── .env.example               # Environment variables template
├── vercel.json                # Vercel deployment config
├── package.json
└── README.md
```

## Admin Panel Access

The admin panel is accessible at a secret URL for security:

**URL Pattern:** `https://yourdomain.com/{ADMIN_PATH}/{ADMIN_PASSWORD_PATH}`

**Example:** If your `.env.local` has:
```
REACT_APP_ADMIN_PATH=divyam
REACT_APP_ADMIN_PASSWORD_PATH=pswd
```

Then access the admin login at: `http://localhost:3000/divyam/pswd`

**Security Note:** Change these values in production for better security!

### Default Admin Credentials

After running the setup script, use the credentials you set in `backend/.env`:
- Username: From `ADMIN_USERNAME`
- Password: From `ADMIN_PASSWORD`

⚠️ **Important:** Change the default password immediately after first login!

## Deployment

### Frontend (Vercel)

1. Push your code to GitHub

2. Import project in Vercel dashboard

3. Configure environment variables:
   - `REACT_APP_API_URL`: Your Railway backend URL
   - `REACT_APP_ADMIN_PATH`: Your custom admin path
   - `REACT_APP_ADMIN_PASSWORD_PATH`: Your custom password path

4. Deploy automatically

### Backend (Railway)

1. Push your code to GitHub

2. Create new project in Railway

3. Connect your GitHub repository

4. Add environment variables from `backend/.env.example`:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: Strong random secret
   - `ADMIN_USERNAME`: Admin username
   - `ADMIN_PASSWORD`: Strong password
   - `CORS_ORIGIN`: Your Vercel frontend URL
   - All other variables from `.env.example`

5. Deploy automatically

6. After deployment, run the admin setup script in Railway's console:
   ```bash
   node src/scripts/setupAdmin.js
   ```

## API Documentation

### Public Endpoints

- `GET /api/portfolio` - Get all portfolio data
- `GET /api/personal-info` - Get personal information  
- `GET /api/projects` - Get all active projects
- `GET /api/experience` - Get work experience
- `GET /api/education` - Get education history
- `GET /api/skills` - Get skills (technical, soft, languages)
- `POST /api/contact` - Submit contact form

### Admin Endpoints (Requires Authentication)

**Authentication:**
- `POST /api/admin/login` - Login with username/password
- `GET /api/admin/me` - Get current admin info
- `PUT /api/admin/password` - Update password

**Content Management:**
- Personal Info: `PUT /api/admin/personal-info`
- Projects: `GET, POST, PUT, DELETE /api/admin/projects`
- Experience: `POST, PUT, DELETE /api/admin/experience/:id`
- Education: `POST, PUT, DELETE /api/admin/education/:id`
- Skills: `POST, PUT, DELETE /api/admin/skills/:id`
- Contacts: `GET, PUT, DELETE /api/admin/contacts/:id`

## Prize-Worthy Features & Suggestions

### Current Features
✅ Full-stack architecture with separation of concerns
✅ JWT authentication with security best practices
✅ RESTful API design
✅ Responsive UI with Material UI
✅ Dark/Light theme with persistence
✅ Smooth animations with Framer Motion
✅ 3D effects with Three.js
✅ Admin panel for easy content management
✅ Rate limiting and security headers
✅ Input validation
✅ Error handling
✅ MongoDB database with Mongoose ORM

### Potential Enhancements
- **Analytics Dashboard**: Track visitor stats, popular projects
- **Image Upload**: Cloudinary/AWS S3 integration for project images
- **Blog Section**: Add blogging capability with rich text editor
- **Email Notifications**: SendGrid/Nodemailer for contact form
- **SEO Enhancements**: React Helmet for dynamic meta tags
- **PWA Support**: Service workers for offline functionality
- **Testimonials Section**: Client/colleague testimonials with CRUD
- **Resume Generator**: Auto-generate PDF from database content
- **Multi-language Support**: i18n for international audience
- **Real-time Chat**: Live chat widget for visitors
- **Version Control**: Track content changes with timestamps
- **Backup/Export**: Export portfolio data as JSON
- **Advanced Filtering**: Filter projects by technology, date, etc.
- **Search Functionality**: Search across all portfolio content

## License

MIT

## 🌌 Universe View Feature

Experience your portfolio in a whole new dimension! The Universe View presents your portfolio as a realistic 3D solar system:

### How to Access
- Click the **"🌌 Universe View"** button on the home page
- Or navigate to `/universe`

### Features
- **Interactive 3D Solar System**: Each planet represents a different section
- **Realistic Visuals**: Multi-layered sun corona, atmospheric glows, bloom effects
- **Intuitive Navigation**: Click planets to navigate, drag to rotate, scroll to zoom
- **Auto-Rotate**: Gentle automatic rotation for dynamic presentation
- **Mobile Friendly**: Full touch control support

### Planet Map
- ☀️ **Sun (Center)**: Portfolio Home
- 🔵 **Blue Planet**: About Me
- 🔴 **Red Planet with Rings**: Projects
- 🟠 **Orange Planet**: Experience
- 🟣 **Purple Planet**: Education
- 🟢 **Teal Planet**: Skills
- ⚫ **Gray Planet**: Contact

For detailed customization and technical details, see [REALISTIC_SOLAR_SYSTEM.md](./REALISTIC_SOLAR_SYSTEM.md)

## Author

Divyam Navin

## Support

For issues or questions:
- Create an issue on GitHub
- Email: divyamnavin@gmail.com

---

**Built with ❤️ using React, TypeScript, Express.js, MongoDB, and Three.js** 🚀✨ 