import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import connectDB from "./config/dbconnection.js";
import authRoutes from "./routes/authRoute.js";
import flightRoutes from "./routes/flightRoute.js";
import bookingRoutes from "./routes/bookingRoute.js";

dotenv.config();
const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use(express.json());
app.use(morgan('dev'));

connectDB();

app.get('/', (req, res) => res.json({ status: 'OK', service: 'FlightDeck360 API' }));

app.use('/api/auth', authRoutes);
app.use('/api/flights', flightRoutes);
app.use('/api/bookings', bookingRoutes);

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`API running on :${port}`));
