import passport from 'passport';
import { Profile as GoogleProfile } from 'passport-google-oauth20';
import {  Profile as GitHubProfile } from 'passport-github';
import userModel, { IUser } from '../models/user.model';
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy= require('passport-github').Strategy;


passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL: 'http://localhost:3000/auth/google/callback',
    passReqToCallback: true,
}, async (req: any, accessToken: string, refreshToken: string, profile: GoogleProfile, done: any) => {
    try {
        let user = await userModel.findOne({ googleId: profile.id });
        if (user) {
            return done(null, user);
        } else {
            const newUser = new userModel({
                googleId: profile.id,
                displayName: profile.displayName,
                email: profile.emails ? profile.emails[0].value : undefined,
            });
            await newUser.save();
            return done(null, newUser);
        }
    } catch (error) {
        return done(error);
    }
}));


passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID!,
    clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    callbackURL: 'http://localhost:3000/auth/github/callback',
    passReqToCallback: true,
}, async (req: any, accessToken: string, refreshToken: string, profile: GitHubProfile, done: any) => {
    try {
        let user = await userModel.findOne({ githubId: profile.id });
        if (user) {
            return done(null, user);
        } else {
            const newUser = new userModel({
                githubId: profile.id,
                displayName: profile.displayName,
                email: profile.emails ? profile.emails[0].value : undefined,
            });
            await newUser.save();
            return done(null, newUser);
        }
    } catch (error) {
        return done(error);
    }
}));

passport.serializeUser((user, done) => {
    done(null, (user as IUser).id);
});

passport.deserializeUser((id, done) => {
    userModel.findById(id)
        .then((user: IUser | null) => {
            if (user) {
                done(null, user);
            } else {
                done(new Error('User not found'));
            }
        })
        .catch((err: any) => {
            done(err);
        });
});

export { passport, GoogleStrategy, GitHubStrategy };