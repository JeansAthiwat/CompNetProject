import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:39189/auth/google/callback"
}, 
async (accessToken, refreshToken, profile, done) => {
    try {
        console.log("📥 Google OAuth Profile:", profile);

        let user = await User.findOne({ email: profile.emails[0].value });

        if (!user) {
            console.log("✅ Creating new Google user:", profile.emails[0].value);
            user = new User({
                email: profile.emails[0].value,
                password: null,  // ✅ No password stored for Google users
                firstname: profile.name?.givenName || "",  
                lastname: profile.name?.familyName || "",  
                profilePicture: profile.photos[0]?.value || "",
                role: "google_user",
                isGoogleUser: true
            });
        
            await user.save();
        } else {
            console.log("🔍 Google user found in DB:", user.email);
        }
        

        done(null, user);
    } catch (error) {
        console.error("❌ Error in Google OAuth Strategy:", error);
        done(error, null);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

export default passport;
