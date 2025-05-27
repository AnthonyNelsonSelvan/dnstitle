import passport from "passport";
import {Strategy as GoogleStrategy} from "passport-google-oauth2";
import User from "../model/user.js"

passport.use(
  new GoogleStrategy(
    {
      clientID : process.env.GOOGLE_CLIENT_ID,
      clientSecret : process.env.GOOGLE_CLIENT_SECRET,
      callbackURL : "/api/auth/google/callback",
      passReqToCallback : true
    },
    async (request, accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({authId : profile.id, authType : "google"});

        if(!user){
          user = await User.findOne({email : profile.email})

        if(user){
          user.authId = profile.id;
          user.authType = "google";
          await user.save();
        }else{
          user = await User.create({
            authId : profile.id,
            authType : "google",
            email : profile.email,
          })
        }
      }
        return done(null, user);
      }catch (error) {
        return done(error,user)
      }
    }
  )
)

export default passport;