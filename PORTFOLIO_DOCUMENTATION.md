# 🎨 Portfolio Website - Complete Documentation

> A modern, full-stack interactive portfolio website with 3D Universe View, admin panel, and rich features.

---

## 📑 Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Tech Stack](#tech-stack)
4. [Getting Started](#getting-started)
5. [Project Structure](#project-structure)
6. [Universe View](#universe-view)
7. [Admin Panel](#admin-panel)
8. [API Documentation](#api-documentation)
9. [Customization Guide](#customization-guide)
10. [Deployment](#deployment)
11. [Troubleshooting](#troubleshooting)

---

## 🌟 Overview

A cutting-edge portfolio website built with React, TypeScript, and Three.js featuring:
- **Traditional Navigation**: Standard navbar and routing
- **3D Universe View**: Interactive solar system where planets represent portfolio sections
- **Admin Panel**: Full CRUD operations for all content
- **Modern UI/UX**: Material UI with dark/light themes and smooth animations

**Built by:** Divyam Navin  
**Stack:** React 19, TypeScript, Express.js, MongoDB, Three.js

---

## ✨ Features

### Public Features

#### 🌌 **Universe View (3D Solar System)**
- Immersive 3D solar system navigation
- Each planet represents a portfolio section
- Interactive controls (drag, zoom, click)
- Multi-layered sun with corona effects
- 5000+ twinkling stars background
- Atmospheric planet glows and bloom effects
- Mobile-optimized touch controls
- Auto-rotation mode

#### 🎨 **Modern UI/UX**
- Responsive design for all devices
- Dark/Light mode toggle with persistence
- Smooth animations powered by Framer Motion
- Background particles and 3D confetti effects
- Flowing header design that blends with theme
- Interactive planet character guide
- Skeleton loaders for better loading UX

#### 📊 **Dynamic Content**
- All content fetched from MongoDB
- Real-time updates from admin changes
- React Query API caching (5-minute cache)
- Contact form with database storage
- SEO optimized with meta tags
- Keyboard navigation shortcuts (Alt+1 to Alt+5)

### Admin Panel Features

#### 🔐 **Security**
- JWT-based authentication
- Account lockout protection
- Rate limiting
- Bcrypt password hashing
- Secure admin URL pattern
- Input validation on all forms

#### ✏️ **Content Management**
- **Personal Info**: Bio, contact, social links
- **Projects**: Full CRUD with rich text descriptions
- **Experience**: Work history management
- **Education**: Academic background editor
- **Skills**: Technical, soft skills, and languages
- **Certifications**: Complete cert management with expiry tracking
- **Quotes**: Universe-themed quotes for Universe View
- **Contact Messages**: View and manage submissions

#### 🎯 **Advanced Features**
- **Rich Text Editor**: Quill editor for formatted descriptions
- **Drag & Drop**: Reorder projects and certifications
- **Mobile Optimized**: Fullscreen dialogs, touch-friendly
- **Image Support**: Upload and display project images
- **Validation**: Real-time form validation
- **Auto-save**: Changes save automatically

---

## 🛠️ Tech Stack

### Frontend
```
React               19.0.0
TypeScript          4.9.5
Material UI         6.4.8
Three.js            Latest
@react-three/fiber  8.x
@react-three/drei   9.x
@react-three/postprocessing  Latest
Framer Motion       11.x
React Router        6.x
React Query         5.x
React Quill         2.x
@dnd-kit            Latest
Axios               1.x
```

### Backend
```
Express.js          4.x
Node.js             18+
MongoDB             Latest
Mongoose            8.x
JWT                 9.x
bcryptjs            2.x
express-validator   7.x
Helmet              7.x
CORS                2.x
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18.x or higher
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. **Navigate to backend:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file:**
   ```bash
   cp .env.example .env
   ```

4. **Configure `.env`:**
   ```env
   MONGODB_URI=mongodb://localhost:27017/portfolio
   JWT_SECRET=your-super-secret-jwt-key-change-this
   JWT_EXPIRE=7d
   
   ADMIN_USERNAME=divyamnavin
   ADMIN_PASSWORD=SecurePassword123!
   
   PORT=5000
   NODE_ENV=development
   
   CORS_ORIGIN=http://localhost:3000
   
   MAX_LOGIN_ATTEMPTS=5
   LOCK_TIME=15
   RATE_LIMIT_WINDOW=15
   RATE_LIMIT_MAX=100
   ```

5. **Initialize admin user:**
   ```bash
   node src/scripts/setupAdmin.js
   ```

6. **Start backend:**
   ```bash
   npm run dev
   ```
   Backend runs on `http://localhost:5000`

### Frontend Setup

1. **Navigate to project root:**
   ```bash
   cd ..
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file:**
   ```bash
   cp .env.example .env.local
   ```

4. **Configure `.env.local`:**
   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   REACT_APP_ADMIN_PATH=divyam
   REACT_APP_ADMIN_PASSWORD_PATH=pswd
   ```

5. **Start frontend:**
   ```bash
   npm start
   ```
   Frontend runs on `http://localhost:3000`

### Access Admin Panel
**URL Pattern:** `http://localhost:3000/{ADMIN_PATH}/{ADMIN_PASSWORD_PATH}`

**Example:** `http://localhost:3000/divyam/pswd`

**Credentials:**
- Username: `divyamnavin` (from backend .env)
- Password: `SecurePassword123!` (from backend .env)

⚠️ **Change these in production!**

---

## 📁 Project Structure

```
Portfolio/
├── backend/                    # Express.js API
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js    # MongoDB connection
│   │   ├── controllers/
│   │   │   ├── adminController.js    # Admin CRUD logic
│   │   │   ├── authController.js     # Authentication
│   │   │   └── portfolioController.js # Public API logic
│   │   ├── middleware/
│   │   │   ├── auth.js        # JWT verification
│   │   │   ├── errorHandler.js
│   │   │   └── validation.js  # Input validation
│   │   ├── models/
│   │   │   ├── Admin.js
│   │   │   ├── Certification.js
│   │   │   ├── Contact.js
│   │   │   ├── Education.js
│   │   │   ├── Experience.js
│   │   │   ├── PersonalInfo.js
│   │   │   ├── Project.js
│   │   │   ├── Quote.js
│   │   │   └── Skill.js
│   │   ├── routes/
│   │   │   ├── admin.js       # Admin routes
│   │   │   ├── auth.js        # Auth routes
│   │   │   └── portfolio.js   # Public routes
│   │   ├── scripts/
│   │   │   └── setupAdmin.js  # Admin setup script
│   │   └── server.js          # Entry point
│   ├── .env.example
│   ├── package.json
│   └── railway.json           # Railway deployment config
│
├── src/                        # React frontend
│   ├── components/
│   │   ├── SolarSystem/       # Universe View components
│   │   │   ├── AudioManager.tsx
│   │   │   ├── CosmosBackground.tsx
│   │   │   ├── EnhancedComet.tsx
│   │   │   ├── EnhancedPlanet.tsx
│   │   │   ├── EnhancedSun.tsx
│   │   │   ├── PlanetInfoCard.tsx
│   │   │   ├── ShootingStars.tsx
│   │   │   └── UltimateSolarSystem.tsx
│   │   ├── BackgroundParticles.tsx
│   │   ├── CelebrationEffects.tsx
│   │   ├── Enhanced3DConfetti.tsx
│   │   ├── FlowingHeader.tsx
│   │   ├── Layout.tsx
│   │   ├── PixelGuide.tsx
│   │   └── UniverseQuote.tsx
│   ├── contexts/
│   │   ├── AdminContext.tsx   # Admin auth state
│   │   └── DataContext.tsx    # Portfolio data state
│   ├── data/
│   │   └── portfolioData.ts   # Fallback data structure
│   ├── hooks/
│   │   └── useThemeToggle.ts
│   ├── pages/
│   │   ├── Admin/
│   │   │   ├── AdminDashboard.tsx
│   │   │   ├── AdminLogin.tsx
│   │   │   └── components/   # CRUD editors
│   │   ├── About.tsx
│   │   ├── Contact.tsx
│   │   ├── Home.tsx
│   │   ├── Projects.tsx
│   │   ├── Resume.tsx
│   │   └── UniverseView.tsx   # 3D Solar System page
│   ├── services/
│   │   └── api.ts             # API client
│   ├── types/
│   │   └── three.d.ts         # Three.js type definitions
│   ├── utils/
│   │   └── storage.ts
│   ├── App.tsx
│   └── index.tsx
│
├── public/
│   ├── uploads/               # Resume PDFs
│   └── images/                # Project images
│
├── .env.local                 # Frontend environment variables
├── .env.example
├── package.json
├── tsconfig.json
├── vercel.json                # Vercel deployment config
└── PORTFOLIO_DOCUMENTATION.md # This file
```

---

## 🌌 Universe View

### Overview
The Universe View is a fully interactive 3D solar system where each planet represents a section of your portfolio.

### Access
- **Button:** Click "🌌 Universe View" on home page
- **Direct URL:** `http://localhost:3000/universe`

### Planet Map

| Planet | Section | Description | Color |
|--------|---------|-------------|-------|
| ☀️ Sun | Home | Divyam's Portfolio | Golden |
| 🪐 Mercury | About | Personal information | Gray-Brown |
| 🌕 Venus | Resume | Professional resume | Golden Yellow |
| 🌍 Earth | Projects | Your projects | Blue |
| 🔴 Mars | Experience | Work history | Red-Orange |
| 🪐 Jupiter | Education | Academic background | Tan-Orange |
| 🪐 Saturn | Skills | Technical skills | Pale Yellow |
| 🔵 Uranus | Certifications | Certificates | Cyan |
| 🔵 Neptune | Contact | Contact form | Deep Blue |

### Controls

#### Desktop
- **Rotate Camera:** Click + Drag
- **Zoom:** Scroll wheel
- **Navigate:** Click planet
- **Return Home:** Home button (top right)
- **Toggle Info:** Info button (top right)
- **Enable Sound:** Audio button (bottom right)

#### Mobile/Tablet
- **Rotate Camera:** Swipe
- **Zoom:** Pinch
- **Navigate:** Tap planet
- **Same buttons as desktop**

### Features

#### Visual Effects
- **Sun:**
  - Multi-layer corona with glow
  - Smooth pulsing solar flares
  - Radiates light to planets
  - Labeled "Divyam's Portfolio"

- **Planets:**
  - Realistic atmospheres
  - Hover glow effects (multi-layer)
  - Rotation on own axis
  - Orbital revolution
  - Saturn has rings
  - Moons for some planets
  - Always-facing labels (billboarding)
  - Random starting positions each load

- **Space Environment:**
  - 14,000 twinkling stars
  - Nebula cloud particles (5,000+)
  - Purple/blue/cyan nebula colors
  - Realistic depth and distance

- **Animations:**
  - Shooting stars
  - Comet with particle tail
  - Planet rotation particles
  - Smooth camera transitions
  - Click to zoom before navigate

#### Audio Features
- **Ambient Sound:** 
  - Multi-layer space atmosphere
  - Deep rumble (40Hz)
  - Harmonic layers (80Hz, 120Hz, 200Hz)
  - Very subtle and immersive
  
- **Click Sounds:**
  - Pleasant "whoosh" on planet click
  - Dual-tone harmonic
  - Toggle on/off button

- **Controls:**
  - Audio button (bottom right)
  - Enable to hear sounds
  - Persistent across navigation

#### Universe Quotes
- Random tech/universe-themed quotes
- Displayed at top center
- Floating animation
- Auto-refresh button
- Fetched from database or fallback hardcoded

### Customization

#### Change Planet Colors
```typescript
// In UltimateSolarSystem.tsx
{
  color: '#4A90E2',  // Change to any hex color
  atmosphereColor: '#87CEEB',  // Atmosphere glow
}
```

#### Adjust Orbit Speeds
```typescript
{
  orbitSpeed: 0.001,  // Higher = faster orbit
  rotationSpeed: 0.01,  // Planet's own rotation
}
```

#### Modify Planet Sizes
```typescript
{
  size: 1,  // Radius in scene units
}
```

#### Add/Remove Planets
Edit the `planets` array in `UltimateSolarSystem.tsx`:
```typescript
{
  name: 'Pluto',
  size: 0.2,
  color: '#8B7355',
  orbitRadius: 65,
  orbitSpeed: 0.000004,
  rotationSpeed: 0.005,
  route: '/blog',
  description: 'Blog',
  orbitPeriod: '248 Earth years',
  rotationPeriod: '6.4 Earth days',
  features: ['Dwarf planet', 'Frozen surface'],
  startAngle: Math.random() * Math.PI * 2,
}
```

---

## 👨‍💼 Admin Panel

### Features Overview

#### Tabs Available:
1. **Personal Info** - Update bio, contact details, social links
2. **Projects** - Add/edit/delete/reorder projects
3. **Experience** - Manage work history
4. **Education** - Update academic background
5. **Skills** - Add technical skills, soft skills, languages
6. **Certifications** - Full certification CRUD with drag-drop reorder
7. **Quotes** - Manage universe quotes
8. **Contacts** - View contact form submissions

### Rich Text Editor

Available in:
- Project descriptions
- Certification descriptions
- Experience descriptions

**Features:**
- Bold, Italic, Underline
- Headers (H1, H2)
- Ordered & Bullet lists
- Hyperlinks
- Clean formatting option
- Mobile-optimized toolbar

**Keyboard Shortcuts:**
- `Ctrl/Cmd + B` - Bold
- `Ctrl/Cmd + I` - Italic
- `Ctrl/Cmd + U` - Underline

### Drag & Drop Reordering

Available in:
- Projects
- Certifications

**How to Use:**
1. Look for 🔹 drag handle icon
2. Click and hold the handle
3. Drag up or down
4. Release to drop
5. Order saves automatically

**Mobile:**
- Press and hold handle
- Drag with finger
- Visual feedback while dragging

### Mobile Optimization

All admin dialogs are:
- Fullscreen on mobile
- Touch-friendly buttons
- Optimized form layouts
- Easy scrolling
- Quick navigation

### Skeleton Loaders

Professional loading states that:
- Match actual content structure
- Pulse animation
- Better UX than spinners
- Shown while fetching data

---

## 📡 API Documentation

### Public Endpoints

#### Portfolio Data
```
GET  /api/portfolio          - Get all portfolio data
GET  /api/personal-info      - Get personal information
GET  /api/projects           - Get all projects
GET  /api/projects/:id       - Get single project
GET  /api/experience         - Get work experience
GET  /api/education          - Get education history
GET  /api/skills             - Get all skills
GET  /api/certifications     - Get all certifications
GET  /api/quotes/random      - Get random quote (optional ?category=)
GET  /api/quotes             - Get all quotes (optional ?category=)
POST /api/contact            - Submit contact form
```

### Admin Endpoints (Requires Authentication)

#### Authentication
```
POST /api/admin/login        - Login (returns JWT token)
GET  /api/admin/me           - Get current admin info
PUT  /api/admin/password     - Update admin password
```

#### Personal Info
```
GET  /api/admin/personal-info
PUT  /api/admin/personal-info
```

#### Projects
```
GET    /api/admin/projects
POST   /api/admin/projects
PUT    /api/admin/projects/:id
DELETE /api/admin/projects/:id
PUT    /api/admin/projects/reorder  - Bulk reorder
```

#### Experience
```
GET    /api/admin/experience
POST   /api/admin/experience
PUT    /api/admin/experience/:id
DELETE /api/admin/experience/:id
```

#### Education
```
GET    /api/admin/education
POST   /api/admin/education
PUT    /api/admin/education/:id
DELETE /api/admin/education/:id
```

#### Skills
```
GET    /api/admin/skills
POST   /api/admin/skills
PUT    /api/admin/skills/:id
DELETE /api/admin/skills/:id
```

#### Certifications
```
GET    /api/admin/certifications
POST   /api/admin/certifications
PUT    /api/admin/certifications/:id
DELETE /api/admin/certifications/:id
PUT    /api/admin/certifications/reorder  - Bulk reorder
```

#### Quotes
```
GET    /api/admin/quotes
POST   /api/admin/quotes
PUT    /api/admin/quotes/:id
DELETE /api/admin/quotes/:id
```

#### Contacts
```
GET    /api/admin/contacts
GET    /api/admin/contacts/:id
PUT    /api/admin/contacts/:id  - Mark as read
DELETE /api/admin/contacts/:id
```

### Authentication

Include JWT token in headers:
```javascript
headers: {
  'Authorization': `Bearer ${token}`
}
```

Token expires in 7 days (configurable in backend .env)

---

## 🎨 Customization Guide

### Theme Colors

Edit `src/index.css`:
```css
:root {
  --primary-color: #667eea;
  --secondary-color: #764ba2;
  --accent-color: #f093fb;
}
```

### Add New Portfolio Section

1. **Create page component:**
   ```typescript
   // src/pages/Blog.tsx
   export const Blog = () => {
     return <div>Blog Page</div>;
   };
   ```

2. **Add route in App.tsx:**
   ```typescript
   <Route path="/blog" element={<Blog />} />
   ```

3. **Add to navigation:**
   Update `src/components/Layout.tsx`

4. **Add planet in Universe View:**
   Update `src/components/SolarSystem/UltimateSolarSystem.tsx`

5. **Create backend model** (if needed)

6. **Add admin editor** (if needed)

### Change Admin URL

Update `.env.local`:
```env
REACT_APP_ADMIN_PATH=secretadmin
REACT_APP_ADMIN_PASSWORD_PATH=supersecret
```

New URL: `http://localhost:3000/secretadmin/supersecret`

### Add Custom Fonts

1. Add font to `public/index.html`:
   ```html
   <link href="https://fonts.googleapis.com/css2?family=YourFont&display=swap" rel="stylesheet">
   ```

2. Use in components:
   ```css
   fontFamily: 'YourFont', sans-serif
   ```

---

## 🚀 Deployment

### Frontend (Vercel)

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin your-repo-url
   git push -u origin main
   ```

2. **Import in Vercel:**
   - Go to vercel.com
   - Import your GitHub repository
   - Select the project

3. **Configure Environment Variables:**
   ```
   REACT_APP_API_URL=https://your-railway-app.railway.app/api
   REACT_APP_ADMIN_PATH=your-custom-path
   REACT_APP_ADMIN_PASSWORD_PATH=your-custom-password-path
   ```

4. **Deploy:** Vercel deploys automatically

### Backend (Railway)

1. **Push to GitHub** (same as above)

2. **Create Railway Project:**
   - Go to railway.app
   - Create new project
   - Connect GitHub repository

3. **Add Environment Variables:**
   ```
   MONGODB_URI=your-mongodb-atlas-connection-string
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRE=7d
   ADMIN_USERNAME=your-admin-username
   ADMIN_PASSWORD=your-strong-password
   PORT=5000
   NODE_ENV=production
   CORS_ORIGIN=https://your-vercel-app.vercel.app
   ```

4. **Deploy:** Railway deploys automatically

5. **Initialize Admin:**
   - Go to Railway dashboard
   - Open terminal for your service
   - Run: `node src/scripts/setupAdmin.js`

### MongoDB Atlas Setup

1. **Create cluster** at mongodb.com
2. **Create database user**
3. **Whitelist IP** (0.0.0.0/0 for all or specific IPs)
4. **Get connection string**
5. **Add to Railway environment variables**

---

## 🐛 Troubleshooting

### Common Issues

#### "Cannot connect to MongoDB"
**Solution:**
- Check MongoDB is running (if local)
- Verify connection string in `.env`
- Check IP whitelist in MongoDB Atlas
- Ensure network connection

#### "Universe View is blank"
**Solution:**
- Check browser console for errors
- Ensure WebGL is enabled
- Try different browser
- Update graphics drivers
- Check if Three.js packages installed

#### "Admin login not working"
**Solution:**
- Verify admin setup script was run
- Check credentials in backend `.env`
- Clear browser cache
- Check backend is running
- Verify JWT_SECRET is set

#### "API calls failing"
**Solution:**
- Check backend is running on correct port
- Verify CORS_ORIGIN in backend `.env`
- Check REACT_APP_API_URL in frontend `.env.local`
- Look at browser Network tab for errors
- Check backend console for errors

#### "Drag & drop not working"
**Solution:**
- Click and hold the 🔹 handle icon (not the card)
- On touch: press and hold, then drag
- Check browser console for errors
- Try refreshing the page

#### "Rich text editor not showing"
**Solution:**
- Scroll down in the dialog
- Editor appears below basic fields
- Check if react-quill is installed
- Clear browser cache

#### "Low FPS in Universe View"
**Solution:**
- Reduce star count in `CosmosBackground.tsx`
- Close other browser tabs
- Disable auto-rotate
- Update graphics drivers
- Use a more powerful device

#### "Audio not working"
**Solution:**
- Click the audio button to enable
- Check browser allows autoplay
- Verify AudioContext is supported
- Check browser console for errors
- Try refreshing the page

### Error Messages

#### "Network Error"
- Backend not running
- Wrong API_URL in frontend
- CORS not configured properly

#### "Unauthorized" / 401
- JWT token expired (login again)
- Token not sent in request headers
- Admin not set up correctly

#### "Validation Error" / 400
- Check required fields are filled
- Verify data format (dates, emails, etc.)
- Check character limits

#### "Not Found" / 404
- Route doesn't exist
- Check URL spelling
- Resource deleted

### Debug Tips

1. **Check Browser Console** (F12)
   - Look for errors
   - Check network requests
   - Verify API responses

2. **Check Backend Logs**
   - Look at terminal running backend
   - Check for error messages
   - Verify requests are arriving

3. **Verify Environment Variables**
   - Print them (don't commit!)
   - Check spelling
   - Restart servers after changes

4. **Clear Cache**
   - Browser cache
   - React Query cache (refresh page)
   - MongoDB cache (restart)

5. **Test in Incognito Mode**
   - Rules out cache issues
   - Fresh JWT tokens
   - Clean state

---

## 📚 Additional Resources

### Learning Materials
- **React:** https://react.dev
- **TypeScript:** https://www.typescriptlang.org/docs/
- **Material UI:** https://mui.com/material-ui/getting-started/
- **Three.js:** https://threejs.org/docs/
- **React Three Fiber:** https://docs.pmnd.rs/react-three-fiber
- **Express.js:** https://expressjs.com/
- **MongoDB:** https://www.mongodb.com/docs/
- **Mongoose:** https://mongoosejs.com/docs/

### Useful Commands

```bash
# Frontend
npm start              # Start development server
npm run build          # Production build
npm test               # Run tests
npm run lint           # Check linting

# Backend
npm run dev            # Start with nodemon
npm start              # Start production
node src/scripts/setupAdmin.js  # Setup admin

# Both
npm install            # Install dependencies
npm update             # Update dependencies
```

---

## 🎉 Summary

Your portfolio features:

### ✅ **Built:**
- Modern React frontend with TypeScript
- Express.js backend with MongoDB
- 3D interactive Universe View
- Full admin panel with CRUD
- Rich text editing
- Drag & drop reordering
- Mobile-optimized UI
- API caching with React Query
- JWT authentication
- Production-ready deployment configs

### ✅ **Ready For:**
- Professional deployment
- Sharing with employers
- Showcasing in interviews
- Adding to resume
- Social media sharing
- Impressing recruiters

### 🌟 **Unique Features:**
- 3D Solar System portfolio navigation
- Universe-themed quotes
- Ambient space audio
- Realistic planet animations
- Shooting stars and comets
- Nebula background effects
- Multi-layer visual effects

---

## 💼 Interview Talking Points

*"I built a full-stack portfolio website featuring:*

- *A unique 3D Solar System navigation using Three.js and React Three Fiber*
- *RESTful API with Express.js and MongoDB for dynamic content*
- *Secure admin panel with JWT authentication and CRUD operations*
- *React Query for intelligent API caching and optimized performance*
- *Rich text editing, drag-and-drop reordering, and mobile-optimized UI*
- *Deployed on Vercel (frontend) and Railway (backend) with CI/CD*

*The 3D Universe View demonstrates proficiency in:*
- *Advanced React patterns (Suspense, lazy loading, custom hooks)*
- *3D graphics and WebGL rendering*
- *Performance optimization for smooth 60 FPS animations*
- *Responsive design from mobile to desktop*
- *Creative problem-solving and attention to detail"*

---

## 📞 Support

**For issues or questions:**
- Create an issue on GitHub
- Email: divyamnavin@gmail.com

---

## 📄 License

MIT

---

**Built with ❤️ using React, TypeScript, Express.js, MongoDB, and Three.js** 🚀✨🌌

---

*Last Updated: October 2025*
*Version: 2.0.0*

