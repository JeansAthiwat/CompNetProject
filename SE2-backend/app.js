import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import MongoStore from 'connect-mongo';
import cors from 'cors';
import session from 'express-session';
import path from 'path';
import cookieParser from 'cookie-parser';
import { createServer } from "http";
import setupSwagger from "./swagger.js";

import passport from './config/passport.js';
import router from './routes/router.js';
import courseRoutes from './routes/courseRouter.js';
import enrollmentRoutes from './routes/enrollmentRouter.js';
import profileRoutes from './routes/profileRouter.js';
import userRouter from './routes/userRouter.js';
import adminRouter from './routes/adminRouter.js';
import searchRouter from './routes/searchRouter.js';
import authRoutes from './routes/authRouter.js';
import reservationRoute from './routes/reservationRouter.js';
import reviewRouter from './routes/reviewRouter.js';
import notificationRouter from './routes/notificationRouter.js';
import conversationRouter from './routes/conversationRouter.js';
import messageRouter from './routes/messageRouter.js';
import './services/payment.js';
import './services/reminder.js'
import { setUpSocket } from'./services/socket.js'
const app = express();

// ✅ CORS Configuration
app.use(cors({
    origin: 'http://localhost:3000', // Allow frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// not secure, but easier for developers
// app.use(cors());



// ✅ Express Session Middleware (MUST BE BEFORE PASSPORT)
app.use(session({
    secret: process.env.SESSION_SECRET || 'your_secret_key',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI, // Store sessions in MongoDB
        collectionName: 'sessions'
    }),
    cookie: { secure: false } // Set to `true` if using HTTPS
}));

// ✅ Initialize Passport Middleware
app.use(passport.initialize());
app.use(passport.session()); // ✅ REQUIRED for login sessions

// ✅ Middleware
app.use(express.json({ limit: '50mb' })); // Adjust limit
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());

// ✅ Trust Proxy (If using Reverse Proxy like Heroku, Vercel)
app.set('trust proxy', 1);

// ✅ Static Files & View Engine
app.set('views', path.join(process.cwd(), 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(process.cwd(), 'public')));

// ✅ Set Up Routes
app.use(router);
app.use('/course', courseRoutes);
app.use('/api/profile', profileRoutes);
app.use('/admin', adminRouter);
app.use('/user', userRouter);
app.use('/search', searchRouter);
app.use('/auth', authRoutes); // ✅ Add Authentication Routes
app.use('/enrollment', enrollmentRoutes);
app.use('/reservation', reservationRoute);
app.use('/review', reviewRouter);
app.use('/auth', authRoutes); // ✅ Add Authentication Routes   
app.use('/enrollment', enrollmentRoutes);
app.use('/reservation', reservationRoute);
app.use('/notification', notificationRouter);
app.use('/conversation', conversationRouter);
app.use('/message', messageRouter);


// Load Swagger
setupSwagger(app);

const server = createServer(app); // ✅ Create the server after middleware

setUpSocket(server);

// ✅ Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        server.listen(process.env.PORT, "0.0.0.0", () => {
            console.log("✅ Connected to DB & listening on port", process.env.PORT);
        });
    })
    .catch((error) => {
        console.error('❌ MongoDB Connection Error:', error);
    });
