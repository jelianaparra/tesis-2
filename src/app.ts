// modules importation
import express from 'express';
import cors from 'cors';
import passport from 'passport';
import passportMiddleware from './middlewares/passport';
const app = express();

import authRoutes from './routes/auth';
import userRoutes from './routes/user';
import requestRoutes from './routes/request';

// middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());
passport.use(passportMiddleware);

// routes
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/request', requestRoutes);

// settings
app.set('port', process.env.PORT || 3000);

export default app;