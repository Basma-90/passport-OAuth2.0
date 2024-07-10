import express from 'express';
import bodyParser from 'body-parser';
import session from 'express-session';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import MongoStore from 'connect-mongo';
import { Request, Response } from 'express';
import { dbConnect } from './config/db.config';
import userModel, { IUser } from './models/user.model';
import authRouter from './routes/auth.routes'
import {passport} from './config/passport.config';
import rateLimit from 'express-rate-limit';



dotenv.config();

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


dbConnect();

app.use(rateLimit({
    windowMs: 15 * 60 * 1000,  
    max: 100, 
}));

app.use(session({
    secret: process.env.SESSION_SECRET || 'yoursecret',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({
        mongoUrl: process.env.MONGO_URI || 'mongodb://localhost:27017/yourdbname',
        collectionName: 'sessions',
    }),
    cookie: {
        maxAge: 1000 * 60 * 60 * 24,
    },
}));


app.use(passport.initialize());
app.use(passport.session());


app.get('/', (req: Request, res: Response) => {
    res.send('Home');
});


app.get('/logout', (req: Request, res: Response) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).send('Error logging out');
        }
        //console.log('Logged out');
        res.redirect('/');
    });
});

app.get('/success', (req: Request, res: Response) => {
    res.send('Success');
});

app.use('/auth', authRouter);

app.get('/profile', (req, res) => { // Protected route
    if (!req.isAuthenticated || !req.isAuthenticated()) {
        return res.redirect('/');
    }
    console.log(req.user);
    const user = req.user as IUser;
    res.send(`Hello ${user.displayName}`);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
