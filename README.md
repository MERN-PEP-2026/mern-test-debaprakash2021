# TaskManager - MERN Stack Application

A full-stack task management application built with the MERN stack (MongoDB, Express, React, Node.js). Manage your tasks efficiently with features like user authentication, task prioritization, and user profiles.

![React](https://img.shields.io/badge/React-19.2-blue?logo=react)
![Express](https://img.shields.io/badge/Express-5.2-green?logo=express)
![Node.js](https://img.shields.io/badge/Node.js-LTS-green?logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Latest-green?logo=mongodb)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.2-blue?logo=tailwindcss)

---

## Features

- **User Authentication**
  - Sign up with email OTP verification
  - Secure login with JWT tokens
  - Password encryption with bcryptjs
  
- **Task Management**
  - Create, read, update, and delete tasks
  - Set task status (pending/completed)
  - Prioritize tasks (low, medium, high)
  - Add optional due dates
  
- **User Profiles**
  - View and edit user information
  - Upload profile pictures (via Cloudinary)
  - Store mobile number and bio
  - Email verification system
  
- **User Experience**
  - Light/dark theme toggle
  - Responsive design with Tailwind CSS
  - Real-time toast notifications
  - Protected routes and authentication checks

---

## Tech Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **Nodemon** - Auto-restart during development
- **Cloudinary** - Image hosting service

### Frontend
- **React** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Tailwind CSS** - Utility-first CSS framework
- **react-hot-toast** - Notifications
- **ESLint** - Code linting

---

## Project Structure

```
mern-test-debaprakash2021/
├── backend/
│   ├── config/           # Database configuration
│   ├── controllers/       # Request handlers for routes
│   ├── middleware/        # Custom middleware (auth, uploads)
│   ├── models/           # MongoDB schemas (User, Task)
│   ├── routes/           # API route definitions
│   ├── services/         # Business logic
│   ├── utils/            # Helper functions (OTP, tokens, email)
│   ├── app.js            # Express app setup
│   ├── server.js         # Server entry point
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── api/          # Axios instance and API calls
    │   ├── components/   # Reusable React components
    │   ├── context/      # React Context (Auth, Theme)
    │   ├── pages/        # Page components (routes)
    │   ├── App.jsx       # Main app component
    │   ├── main.jsx      # React entry point
    │   └── index.css
    ├── vite.config.js    # Vite configuration
    └── package.json
```

---

## Prerequisites

Before getting started, ensure you have installed:
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **MongoDB** (local instance or MongoDB Atlas account)
- **Git**

---

## Installation

### 1. Clone the Repository
```bash
git clone https://github.com/debaprakash2021/mern-test-debaprakash2021.git
cd mern-test-debaprakash2021
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create a .env file in the backend directory
cat > .env << EOF
MONGO_URI=your_mongodb_connection_string
PORT=5000
JWT_SECRET=your_jwt_secret_key
OTP_EXPIRY=6
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_email_password
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
EOF

# Start the development server
npm run dev
```

The backend will run on `http://localhost:5000`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will run on `http://localhost:5173` (Vite default)

---

## Environment Variables

### Backend (.env)

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGO_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/dbname` |
| `PORT` | Server port | `5000` |
| `JWT_SECRET` | Secret key for JWT tokens | Any random string |
| `OTP_EXPIRY` | OTP validity in minutes | `6` |
| `SMTP_USER` | Email for OTP sending | `your_email@gmail.com` |
| `SMTP_PASS` | Email password or app password | Your email password |
| `CLOUDINARY_NAME` | Cloudinary account name | Your cloudinary name |
| `CLOUDINARY_API_KEY` | Cloudinary API key | Your API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | Your API secret |

---

## API Endpoints

### Authentication Routes (`/api/auth`)

| Method | Endpoint | Description | Body |
|--------|----------|-------------|------|
| POST | `/register` | Initiate signup, send OTP to email | `{ name, email, password }` |
| POST | `/verify-signup` | Verify OTP and create account | `{ email, otp }` |
| POST | `/login` | Login with email and password | `{ email, password }` |

### Task Routes (`/api/tasks`) 
*Requires authentication*

| Method | Endpoint | Description | Body |
|--------|----------|-------------|------|
| POST | `/` | Create a new task | `{ title, description, priority, dueDate }` |
| GET | `/` | Get all tasks for logged-in user | - |
| PUT | `/:id` | Update a task | `{ title, description, status, priority, dueDate }` |
| DELETE | `/:id` | Delete a task | - |

### User Routes (`/api/user`)
*Requires authentication*

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/profile` | Get user profile |
| PUT | `/profile` | Update user profile |
| POST | `/upload-image` | Upload profile picture |

---

## Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

Visit `http://localhost:5173` in your browser.

### Production Mode

**Backend:**
```bash
cd backend
npm start
```

**Frontend:**
```bash
cd frontend
npm run build
npm run preview
```

---

## Key Features Explained

### 1. Two-Step Email Verification
- Users sign up with name, email, and password
- An OTP is sent to their email address
- Users verify their account using the OTP within 6 minutes
- Account is activated only after verification

### 2. Task Management
- Create tasks with title, description, priority level, and due date
- Mark tasks as pending or completed
- Update task details anytime
- Delete completed or unwanted tasks

### 3. Protected Routes
- All task and user routes require authentication
- JWT token validation on every request
- Unauthorized users are redirected to login

### 4. Theme Support
- Toggle between light and dark themes
- Theme preference is persisted in React Context
- UI automatically adapts to selected theme

### 5. Profile Management
- Edit user information (name, email, mobile, bio)
- Upload profile picture with image validation
- View complete user profile

---

## Available Scripts

### Backend
```bash
npm start    # Run production server
npm run dev  # Run development server with auto-reload
npm test     # Run tests (not yet configured)
```

### Frontend
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run lint     # Run ESLint
npm run preview  # Preview production build
```

---

## Error Handling

The application includes comprehensive error handling:
- Custom error messages for validation failures
- JWT token expiration handling
- OTP expiry validation
- MongoDB connection error logging
- CORS configuration for frontend-backend communication
- HTTP status codes for different error scenarios

---

## Security Features

- **Password Hashing**: Passwords are encrypted using bcryptjs
- **JWT Authentication**: Secure token-based authentication
- **OTP Verification**: Email-based account verification
- **CORS Protection**: Restricted to frontend origin
- **Email Validation**: OTP sent to email for verification
- **Protected Routes**: Backend routes require valid JWT token

---

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running and MONGO_URI is correct
- Check network access if using MongoDB Atlas

### Port Already in Use
```bash
# Change port in backend/server.js or use environment variable
PORT=5001 npm run dev
```

### CORS Errors
- Ensure backend CORS origin matches your frontend URL
- Update `origin` in `app.js` if frontend runs on different port

### OTP Not Received
- Check SMTP_USER and SMTP_PASS in .env
- Ensure Gmail app password is used (not regular password)
- Check spam folder

### Image Upload Issues
- Verify Cloudinary credentials are correct
- Check API rate limits on Cloudinary

---

## Future Enhancements

- [ ] Task filtering and sorting
- [ ] Task categories/tags
- [ ] Collaborative task sharing
- [ ] Task reminders and notifications
- [ ] Dark mode persistence
- [ ] Mobile app version
- [ ] Unit and integration tests
- [ ] API documentation with Swagger

---

## Contributing

Feel free to fork this repository and submit pull requests to improve the project.

---

## License

ISC License - See LICENSE file for details

---

## Contact & Support

For issues, questions, or suggestions, please open an issue on GitHub or contact the project maintainer.

**Project Repository**: [mern-test-debaprakash2021](https://github.com/debaprakash2021/mern-test-debaprakash2021)

---

**Happy Task Managing! 🚀**

**THANK YOU**
