import express, { Router } from 'express';
import passport from 'passport';    
import { Request,Response } from 'express';
const authRouter = express.Router();

authRouter.get(
    "/github",
    passport.authenticate("github", { scope: ["user"] })
);

authRouter.get(
    "/github/callback",
    passport.authenticate("github", { failureRedirect: "/" ,successRedirect: "/success"}),
);

authRouter.get(
    "/google",
    passport.authenticate("google", { scope: ["profile"] })
);

authRouter.get(
    "/google/callback",
    passport.authenticate("google", { failureRedirect: "/", successRedirect: "/success"}),
);

export default authRouter;