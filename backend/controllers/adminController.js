import validator from "validator"
import bcrypt from "bcrypt"
import { v2 as cloudinary } from "cloudinary"
import doctorModel from "../models/doctorModel.js"
import jwt from "jsonwebtoken"
import appointementModel from "../models/appointmentModel.js"
import userModel from "../models/userModel.js"

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

// API for admin login
const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Email and password are required" })
        }

        // Check admin credentials
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            // Create JWT token that matches your middleware expectation
            const token = jwt.sign(
                { 
                    email: email,
                    role: 'admin',
                    timestamp: Date.now()
                }, 
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            )
            
            res.json({ 
                success: true, 
                message: "Login successful",
                token: token
            })
        } else {
            res.status(401).json({ success: false, message: "Invalid credentials" })
        }

    } catch (error) {
        console.log('Login error:', error)
        res.status(500).json({ success: false, message: "Internal server error" })
    }
}

// API for add doctor (protected)
const addDoctor = async (req, res) => {
    try {
        const { name, email, password, speciality, degree, experience, about, fees, address } = req.body
        const imageFile = req.files?.image || req.file

        if (!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address) {
            return res.status(400).json({ success: false, message: "All fields are required" })
        }

        // Check if doctor already exists
        const existingDoctor = await doctorModel.findOne({ email })
        if (existingDoctor) {
            return res.status(400).json({ success: false, message: "Doctor already exists with this email" })
        }

        // Validating email
        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: "Please enter a valid email" })
        }

        // Validating password
        if (password.length < 6) {
            return res.status(400).json({ success: false, message: "Password must be at least 6 characters" })
        }

        let imageUrl = ''
        // Upload image to cloudinary if provided
        if (imageFile) {
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, { 
                folder: 'doctors',
                resource_type: "image" 
            })
            imageUrl = imageUpload.secure_url
        }

        // Hashing doctor password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const doctorData = {
            name,
            email,
            image: imageUrl || 'https://placehold.co/300x300/3b82f6/white?text=Doctor',
            password: hashedPassword,
            speciality,
            degree,
            experience,
            about,
            fees: Number(fees),
            address: typeof address === 'string' ? JSON.parse(address) : address,
            availability: true,
            date: new Date() // ADD THIS LINE - required field
        }

        const newDoctor = new doctorModel(doctorData)
        await newDoctor.save()

        res.status(201).json({ success: true, message: "Doctor Added Successfully" })

    } catch (error) {
        console.log('Add doctor error:', error)
        res.status(500).json({ success: false, message: "Internal server error" })
    }
}

// API to get all doctors (protected)
const allDoctors = async (req, res) => {
    try {
        const doctors = await doctorModel.find({}).select('-password').sort({ createdAt: -1 })
        res.json({ success: true, doctors: doctors })

    } catch (error) {
        console.log('Get doctors error:', error)
        res.status(500).json({ success: false, message: "Failed to fetch doctors" })
    }
}


const appointmentsAdmin = async (req, res) => {
    
    try {
        const appointments = await appointementModel.find({})
        res.json({success:true, appointments})
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message });
    }

}



//api to cancel appointment(admin)
const appointmentCancel = async (req, res) => {
    
    try {
        
        const { appointmentId } = req.body;

        const appointmentData = await appointementModel.findById(appointmentId)

        await appointementModel.findByIdAndUpdate(appointmentId, { cancelled: true });

        //release slot
        const { docId, slotDate, slotTime } = appointmentData
        
        const doctorData = await doctorModel.findById(docId)

        let slots_booked = doctorData.slots_booked

        slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime)


        await doctorModel.findByIdAndUpdate(docId, { slots_booked });

        res.json({ success: true, message: "Appointment Cancelled" });

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message });
    }

}



//api t get dashboard data for admin panel
const adminDashboard = async (req, res) => {
    
    try {
        
        const doctors = await doctorModel.find({})

        const users = await userModel.find({})

        const appointments = await appointementModel.find({})

        const dashData = {
            doctors: doctors.length,
            appointments: appointments.length,
            patients: users.length,
            latestAppointments: appointments.reverse().slice(0,5)
        }

        res.json({success: true, dashData})

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message });
    }

}



export { addDoctor, loginAdmin, allDoctors, appointmentsAdmin, appointmentCancel, adminDashboard };