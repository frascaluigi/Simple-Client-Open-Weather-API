import express, { Request, Response } from 'express'
import passport from 'passport';
const FacebookStrategy = require('passport-facebook').Strategy;
const {URL} = require('url');
import {config} from '../loadConfiguration';
const router = express.Router();

//Passport Authentication
passport.serializeUser((profile:any, done) => done(null, {
    id: profile.id,
    provider: profile.provider
}))
passport.deserializeUser((user, done) => done(null, user));

//Facebook Strategy
passport.use(new FacebookStrategy({
    clientID: config.get('server:auth:facebook:appID'),
    clientSecret: config.get('server:auth:facebook:appSecret'),
    callbackURL: new URL('/auth/facebook/callback', new URL('/api', config.get('server').service_url)).href,
}, (accessToken, refreshToken, profile, done) => done(null, profile)))

router.get('/facebook/', passport.authenticate('facebook'));

router.get('/facebook/callback', passport.authenticate('facebook', {
     successRedirect: '/',
     failureRedirect: '/'
}))

router.get('/session', (req:Request, res:Response) => {
    const session = {auth: req.isAuthenticated()}
    res.status(200).send(session)
})

router.get('/signout', (req:Request, res:Response) => {
    req.logout();
})

export default router