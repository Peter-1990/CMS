import mongoose from "mongoose";

const connectDB = async () => {
    try {
        console.log('Attempting to connect to MongoDB...');
        console.log('Connection string:', process.env.MONGODB_URI);

        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 30000, // Increase to 30 seconds
            socketTimeoutMS: 45000,
        });

        console.log(`MongoDB Connected: ${conn.connection.host}`);

    } catch (error) {
        console.error('MongoDB connection error:', error.message);
        console.error('Error details:', error);

        // More specific error handling
        if (error.name === 'MongoNetworkError') {
            console.error('Network error - check your internet connection and MongoDB URI');
        } else if (error.name === 'MongoServerSelectionError') {
            console.error('Cannot connect to MongoDB server - check if server is running');
        }

        process.exit(1);
    }
}

export default connectDB;