import mongoose from "mongoose";



const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            ssl: true,
            tlsAllowInvalidCertificates: false,
        });
        console.log('DB connected');
    } catch (e) {
        console.error('DB connection failed', e.message);
        process.exit(1);
    }
};

export default connectDB;

