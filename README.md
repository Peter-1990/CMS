🏥 Clinic Management System (CMS)
A comprehensive full-stack clinic management system built with the MERN stack, designed to streamline healthcare operations with separate interfaces for patients, doctors, and administrators.

https://img.shields.io/badge/React-18.2.0-blue
https://img.shields.io/badge/Node.js-16.0+-green
https://img.shields.io/badge/MongoDB-Atlas-success
https://img.shields.io/badge/Deployed-Vercel-black
https://img.shields.io/badge/Auth-JWT-orange

🌟 Live Demos
Frontend (Patients): https://cms-frontend-zeta-plum.vercel.app

Admin Dashboard: https://cms-admin-one-sigma.vercel.app

Backend API: https://cms-backend-gold.vercel.app

✨ Features
👥 Multi-Role Authentication
Patients: User registration and profile management

Doctors: Secure access to patient records and appointments

Administrators: Complete system management and analytics

JWT-based authentication with custom token headers for each role

🏥 Core Functionality
Appointment Management: Schedule, reschedule, and track appointments

Patient Records: Secure medical history and treatment plans

Doctor Profiles: Specialist information and availability

Billing & Payments: Integrated payment processing

Analytics Dashboard: Real-time clinic performance metrics

💻 Technical Features
Responsive Design: Works seamlessly on desktop, tablet, and mobile

Real-time Updates: Live notifications and status updates

File Uploads: Medical reports and document management via Cloudinary

Secure API: Robust authentication and authorization system

🛠️ Technology Stack
Frontend
React 18 with modern hooks and functional components

Material-UI for responsive and accessible UI components

Axios for API communication

React Router for navigation

Context API for state management

Backend
Node.js with Express.js server

MongoDB Atlas cloud database with Mongoose ODM

JWT Authentication with role-based access control

Cloudinary for file and image management

CORS configured for multiple origins and custom headers

Deployment
Vercel for frontend and backend deployment

MongoDB Atlas for database hosting

Cloudinary for media storage and management

🚀 Quick Start
Prerequisites
Node.js 16.0 or higher

MongoDB Atlas account

Cloudinary account

Vercel account (for deployment)

Installation
Clone the repository

bash
git clone https://github.com/your-username/clinic-management-system.git
cd clinic-management-system
Backend Setup

bash
cd backend
npm install
Create a .env file:

env
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
PORT=4000
NODE_ENV=development
Frontend Setup

bash
cd frontend
npm install
Create a .env file:

env
VITE_API_URL=https://cms-backend-gold.vercel.app
Run Development Servers

bash
# Backend (from /backend directory)
npm run dev

# Frontend (from /frontend directory)  
npm run dev
📁 Project Structure
text
clinic-management-system/
├── backend/
│   ├── config/
│   │   ├── mongodb.js
│   │   └── cloudinary.js
│   ├── controllers/
│   │   ├── adminController.js
│   │   ├── doctorController.js
│   │   ├── userController.js
│   │   └── paymentController.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Doctor.js
│   │   ├── Appointment.js
│   │   └── Payment.js
│   ├── routes/
│   │   ├── adminRoute.js
│   │   ├── doctorRoute.js
│   │   ├── userRoute.js
│   │   └── paymentRoutes.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── validation.js
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── contexts/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── styles/
│   └── public/
└── README.md
🌐 API Endpoints
Authentication
POST /api/user/register - Patient registration

POST /api/user/login - User login

POST /api/doctor/login - Doctor login

POST /api/admin/login - Admin login

Appointments
GET /api/appointments - Get all appointments

POST /api/appointments - Create new appointment

PUT /api/appointments/:id - Update appointment

DELETE /api/appointments/:id - Delete appointment

Patients
GET /api/patients - Get all patients

GET /api/patients/:id - Get patient details

PUT /api/patients/:id - Update patient information

Doctors
GET /api/doctors - Get all doctors

POST /api/doctors - Add new doctor

PUT /api/doctors/:id - Update doctor information

🔧 Configuration
Environment Variables
Backend requires:

MONGODB_URI: MongoDB Atlas connection string

JWT_SECRET: Secret key for JWT tokens

CLOUDINARY_*: Cloudinary configuration for file uploads

NODE_ENV: Environment (development/production)

CORS Configuration
System supports multiple custom token headers:

token - For patient frontend

atoken - For admin dashboard

dtoken - For doctor dashboard

🚀 Deployment
Frontend (Vercel)
bash
npm run build
vercel --prod
Backend (Vercel)
bash
vercel --prod
Environment Variables on Vercel
Set all environment variables in Vercel dashboard for both frontend and backend deployments.

🤝 Contributing
Fork the project

Create your feature branch (git checkout -b feature/AmazingFeature)

Commit your changes (git commit -m 'Add some AmazingFeature')

Push to the branch (git push origin feature/AmazingFeature)

Open a Pull Request

📄 License
This project is licensed under the MIT License - see the LICENSE.md file for details.

🆘 Support
If you have any questions or issues, please open an issue on GitHub or contact at harip3279@gmail.com

🙏 Acknowledgments
Material-UI for amazing React components

MongoDB Atlas for reliable database hosting

Vercel for seamless deployment

Cloudinary for media management

React community for excellent documentation

⭐ Star this repo if you found it helpful!

Built with ❤️ using the MERN stack
