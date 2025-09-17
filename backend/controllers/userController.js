import validator from 'validator'
import bcrypt from 'bcrypt';
import userModel from '../models/userModel.js';
import jwt from 'jsonwebtoken'
import {v2 as cloudinary} from 'cloudinary'
import doctorModel from '../models/doctorModel.js';
import appointementModel from '../models/appointmentModel.js';


//api to register user
const registerUser = async (req, res) => {
    
    try {
        
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.json({ success: false, message: "Missing Details" })
        }

        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Enter a valid email" });
        }

        if (password.length < 8) {
            return res.json({ success: false, message: "Enter a strong password" })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)
        
        const userData = {
            name,
            email,
            password: hashedPassword
        }

        const newUser = new userModel(userData)
        const user = await newUser.save()

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
        
        res.json({ success: true, token })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
};


const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Check if email and password are provided
        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email and password are required' });
        }

        const user = await userModel.findOne({ email });
        
        if (!user) {
            return res.status(404).json({ success: false, message: 'User does not exist' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        
        if (isMatch) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
            res.json({ success: true, token, message: 'Login successful' });
        } else {
            // FIXED: Changed error.message to a string message
            res.status(401).json({ success: false, message: 'Invalid password' });
        }

    } catch (error) {
        console.log('Login error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}


// API to get user profile data
const getProfile = async (req, res) => {
    try {
        // Get userId from req.user (set by auth middleware)
        const { userId } = req.user;
        
        if (!userId) {
            return res.status(400).json({ success: false, message: "User ID not found" });
        }

        const userData = await userModel.findById(userId).select('-password');

        if (!userData) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.json({ success: true, userData });

    } catch (error) {
        console.log('Get profile error:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};


// API to update user profile
const updateProfile = async (req, res) => {
    try {
        // Get userId from req.user (set by auth middleware) - NOT req.body
        const { userId } = req.user;
        const { name, phone, address, dob, gender } = req.body;
        const imageFile = req.file;

        if (!name || !phone || !dob || !gender) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        // Prepare update data
        const updateData = {
            name,
            phone,
            dob,
            gender
        };

        // Parse address if provided as string
        if (address) {
            try {
                updateData.address = typeof address === 'string' ? JSON.parse(address) : address;
            } catch (parseError) {
                return res.status(400).json({ success: false, message: "Invalid address format" });
            }
        }

        // Handle image upload if provided
        if (imageFile) {
            try {
                const imageUpload = await cloudinary.uploader.upload(imageFile.path, { 
                    resource_type: 'image',
                    folder: 'user-profiles' // Optional: add folder for organization
                });
                updateData.image = imageUpload.secure_url;
            } catch (uploadError) {
                console.log('Image upload error:', uploadError);
                return res.status(500).json({ success: false, message: "Failed to upload image" });
            }
        }

        // Single database operation to update all fields
        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            updateData,
            { 
                new: true, // Return the updated document
                runValidators: true // Run schema validators
            }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.json({ 
            success: true, 
            message: "Profile Updated Successfully",
            userData: updatedUser // Return updated user data
        });

    } catch (error) {
        console.log('Update profile error:', error);
        
        // Handle validation errors
        if (error.name === 'ValidationError') {
            return res.status(400).json({ 
                success: false, 
                message: error.message 
            });
        }
        
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};


const bookAppointment = async (req, res) => {
    try {
        // Get userId from authenticated user (req.user), NOT from req.body
        const { userId } = req.user; // Changed from req.body to req.user
        const { docId, slotDate, slotTime } = req.body;

        // Validate required fields
        if (!docId || !slotDate || !slotTime) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields: docId, slotDate, or slotTime"
            });
        }

        const docData = await doctorModel.findById(docId).select('-password');
        
        // Check if doctor exists
        if (!docData) {
            return res.json({ success: false, message: "Doctor not found" });
        }

        if (!docData.available) {
            return res.json({ success: false, message: "Doctor not Available" });
        }

        let slots_booked = docData.slots_booked || {};

        // Checking for slot availability
        if (slots_booked[slotDate]) {
            if (slots_booked[slotDate].includes(slotTime)) {
                return res.json({ success: false, message: "Slot not available" });
            } else {
                slots_booked[slotDate].push(slotTime);
            }
        } else {
            slots_booked[slotDate] = [slotTime];
        }

        const userData = await userModel.findById(userId).select('-password');
        
        // Check if user exists
        if (!userData) {
            return res.json({ success: false, message: "User not found" });
        }

        // Create a clean copy of docData without slots_booked
        const cleanDocData = { ...docData.toObject() };
        delete cleanDocData.slots_booked;
        delete cleanDocData.password;

        const appointmentData = {
            userId,
            docId,
            userData: userData.toObject(), // Convert to plain object
            docData: cleanDocData,         // Include the required docData
            amount: docData.fees,
            slotTime,
            slotDate,
            date: Date.now()
        };

        const newAppointment = new appointementModel(appointmentData);
        await newAppointment.save();

        // Save new slots data in docData
        await doctorModel.findByIdAndUpdate(docId, { slots_booked });
        
        res.json({ success: true, message: "Appointment Booked" });

    } catch (error) {
        console.log("Appointment booking error:", error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};


//api to get user appointments in frontend
const listAppointment = async (req, res) => {
    
    try {
        
        const { userId } = req.user
        const appointments = await appointementModel.find({ userId })
        
        res.json({ success: true, appointments });

    } catch (error) {
        console.log("Get Appointments error:", error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }

};


//api to cancel appointment
const cancelAppointment = async (req, res) => {
    try {
        // Get userId from authenticated user
        const { userId } = req.user; // This should come from your auth middleware
        
        // Get appointmentId from request body or params, NOT from req.user
        const { appointmentId } = req.body; // Changed from req.user to req.body

        // Validate required fields
        if (!appointmentId) {
            return res.status(400).json({
                success: false,
                message: "Appointment ID is required"
            });
        }

        const appointmentData = await appointementModel.findById(appointmentId);

        // Check if appointment exists
        if (!appointmentData) {
            return res.json({ success: false, message: "Appointment not found" });
        }

        // Verify appointment user
        if (appointmentData.userId.toString() !== userId.toString()) {
            return res.json({ success: false, message: "Unauthorized action" });
        }

        // Check if already cancelled
        if (appointmentData.cancelled) {
            return res.json({ success: false, message: "Appointment is already cancelled" });
        }

        await appointementModel.findByIdAndUpdate(appointmentId, { cancelled: true });

        // Releasing doctor slot
        const { docId, slotDate, slotTime } = appointmentData;
        
        const doctorData = await doctorModel.findById(docId);

        // Check if doctor exists and has slots_booked
        if (!doctorData || !doctorData.slots_booked) {
            return res.json({ success: false, message: "Doctor data not found" });
        }

        let slots_booked = doctorData.slots_booked;

        // Safely remove the time slot
        if (slots_booked[slotDate]) {
            slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime);
            
            // Remove the date entry if no slots left
            if (slots_booked[slotDate].length === 0) {
                delete slots_booked[slotDate];
            }
        }
        
        await doctorModel.findByIdAndUpdate(docId, { slots_booked });
        
        res.json({ success: true, message: "Appointment Cancelled" });

    } catch (error) {
        console.log("Cancel Appointments error:", error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};


export {registerUser, loginUser, getProfile, updateProfile, bookAppointment, listAppointment, cancelAppointment}