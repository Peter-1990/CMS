import doctorModel from "../models/doctorModel.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import appointementModel from "../models/appointmentModel.js";


const changeAvailability = async (req, res) => {
    try {

        const { docId } = req.body;

        const docData = await doctorModel.findById(docId)

        await doctorModel.findByIdAndUpdate(docId, { available: !docData.available })

        res.json({ success: true, message: 'Availability Changed' })

    } catch (error) {

        console.log(error)
        res.json({ success: false, message: error.message })

    }
};


const doctorsList = async (req, res) => {
    try {

        const doctors = await doctorModel.find({}).select(['-password', '-email'])

        res.json({ success: true, doctors });

    } catch (error) {

        console.log(error)
        res.json({ success: false, message: error.message })

    }
};


//api for doctor login
const loginDoctor = async (req, res) => {

    try {

        const { email, password } = req.body

        const doctor = await doctorModel.findOne({ email })

        if (!doctor) {
            return res.json({ success: false, message: "Invalid Credentials" })
        }

        const isMatch = await bcrypt.compare(password, doctor.password)

        if (isMatch) {

            const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET)

            res.json({ success: true, message: "Login Successfull", token })

        } else {
            res.json({ success: false, message: "Invalid Credentials" })
        };

    } catch (error) {

        console.log(error)
        res.json({ success: false, message: error.message })

    }
};



//api to get doctor appointments for doctor panel
const appointmentsDoctor = async (req, res) => {

    try {

        const { docId } = req.user;

        const appointments = await appointementModel.find({ docId });

        res.json({ success: true, appointments });

    } catch (error) {

        console.log(error)
        res.json({ success: false, message: error.message });

    }

};


//api to complete appointment for doctor panel
const appointmentComplete = async (req, res) => {
    try {
        const { docId } = req.user;
        const { appointmentId } = req.body;
        const appointmentData = await appointementModel.findById(appointmentId)
        if (appointmentData && appointmentData.docId === docId) {
            await appointementModel.findByIdAndUpdate(appointmentId, { isCompleted: true })
            return res.json({ success: true, message: "Appointment Completed" });
        } else {
            return res.json({ success: false, message: "Mark Failed" })
        }
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message });
    }
};



//api to cancel appointment for doctor panel
const appointmentCancel = async (req, res) => {
    try {
        const { docId } = req.user;
        const { appointmentId } = req.body;
        const appointmentData = await appointementModel.findById(appointmentId)
        if (appointmentData && appointmentData.docId === docId) {
            await appointementModel.findByIdAndUpdate(appointmentId, { cancelled: true })
            return res.json({ success: true, message: "Appointment Cancelled" });
        } else {
            return res.json({ success: false, message: "Cancel Failed" })
        }
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message });
    }
};



//api to get doctor dashboard for doctor panel
const doctorDashboard = async (req, res) => {
    try {
        const { docId } = req.user;

        const appointments = await appointementModel.find({ docId });

        let earnings = 0

        appointments.map((item) => {
            if (item.isCompleted || item.payment) {
                earnings += item.amount
            }
        })

        let patients = []

        appointments.map((item) => {
            if (!patients.includes(item.userId)) {
                patients.push(item.userId)
            }
        })

        const dashData = {
            earnings,
            appointments: appointments.length,
            patients: patients.length,
            latestAppointments: appointments.reverse().slice(0, 5)
        }

        res.json({ success: true, dashData });
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message });
    }
};



//api to get doctor profile in doctor panel
const doctorProfile = async (req, res) => {
    try {
        const { docId } = req.user;
        const profileData = await doctorModel.findById(docId).select('-password')

        res.json({ success: true, profileData });
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message });
    }
};


//api to update doctor profile in doctor panel
const updateDoctorProfile = async (req, res) => {
    try {
        // Get data from req.body (what the frontend sends), not req.user
        const { fees, address, available } = req.body;
        const { docId } = req.user; // Get doctor ID from auth middleware

        // Update the doctor profile
        await doctorModel.findByIdAndUpdate(
            docId, 
            { 
                fees: Number(fees), // Ensure it's a number
                address: address,
                available: available 
            },
            { new: true, runValidators: true } // Return updated doc and run validators
        );

        res.json({ success: true, message: "Profile Updated" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};



export {
    changeAvailability,
    doctorsList,
    loginDoctor,
    appointmentsDoctor,
    appointmentComplete,
    appointmentCancel,
    doctorDashboard,
    doctorProfile,
    updateDoctorProfile
}