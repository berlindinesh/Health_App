const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github').Strategy;
const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;  // Make sure to import this
const User = require('../models/User');
const axios = require('axios');
require('dotenv').config();
const FacebookStrategy = require('passport-facebook').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;

// Serialize and Deserialize User
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

// Google Strategy
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "/api/auth/google/callback",
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const { email, name, picture } = profile._json;

                // Find or Create User
                let user = await User.findOne({ email });
                if (!user) {
                    user = await User.create({ email, name, profilePicture: picture, provider: 'google' });
                }
                return done(null, user);
            } catch (error) {
                console.error('Error during Google authentication:', error.message);
                return done(error, null);
            }
        }
    )
);

// GitHub Strategy
passport.use(
    new GitHubStrategy(
        {
            clientID: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            callbackURL: "http://localhost:5000/api/auth/github/callback" || '/api/auth/github/callback',
            scope: ['user:email'],
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                let email = null;

                // If emails field is undefined, fetch it from the GitHub API
                if (profile.emails && profile.emails.length > 0) {
                    email = profile.emails[0].value;
                } else {
                    const { data } = await axios.get('https://api.github.com/user/emails', {
                        headers: { Authorization: `Bearer ${accessToken}` },
                    });
                    const primaryEmail = data.find((emailObj) => emailObj.primary);
                    email = primaryEmail ? primaryEmail.email : null;
                }

                if (!email) {
                    return done(new Error('Email not available in GitHub profile'), null);
                }

                const name = profile.displayName || profile.username;

                // Find or Create User
                let user = await User.findOne({ email });
                if (!user) {
                    user = await User.create({ email, name, provider: 'github' });
                }
                return done(null, user);
            } catch (error) {
                console.error('Error during GitHub authentication:', error.message);
                return done(error, null);
            }
        }
    )
);

// LinkedIn Strategy
passport.use(
    new LinkedInStrategy(
        {
            clientID: process.env.LINKEDIN_CLIENT_ID,
            clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
            callbackURL: process.env.LINKEDIN_CALLBACK_URL || "/api/auth/linkedin/callback",
            scope: ['openid', 'profile', 'email'],
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const email = profile.emails[0].value;
                const name = profile.displayName;

                // Find or Create User
                let user = await User.findOne({ email });
                if (!user) {
                    user = await User.create({ email, name, provider: 'linkedin' });
                }
                return done(null, user);
            } catch (error) {
                console.error('Error during LinkedIn authentication:', error.message);
                return done(error, null);
            }
        }
    )
);

// Facebook Strategy
passport.use(
    new FacebookStrategy(
        {
            clientID: process.env.FACEBOOK_CLIENT_ID,
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
            callbackURL: '/api/auth/facebook/callback',
            profileFields: ['id', 'emails', 'name', 'picture.type(large)'],
        },
        async (accessToken, refreshToken, profile, done) => {
            const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
            const name = `${profile.name.givenName} ${profile.name.familyName}`;
            const picture = profile.photos && profile.photos[0] ? profile.photos[0].value : null;

            if (!email) {
                return done(new Error('Email not available in Facebook profile'));
            }

            // Find or Create User
            let user = await User.findOne({ email });
            if (!user) {
                user = await User.create({ email, name, profilePicture: picture, provider: 'facebook' });
            }
            done(null, user);
        }
    )
);

// Twitter Strategy
passport.use(new TwitterStrategy({
    consumerKey: process.env.TWITTER_CONSUMER_KEY,
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
    callbackURL: process.env.TWITTER_CALLBACK_URL,
    includeEmail: true
}, async (token, tokenSecret, profile, done) => {
    try {
        let user = await User.findOne({ twitterId: profile.id });
        if (!user) {
            user = new User({
                twitterId: profile.id,
                name: profile.displayName,
                email: profile.emails[0].value
            });
            await user.save();
        }
        done(null, user);
    } catch (error) {
        done(error, null);
    }
}
)
);


module.exports = passport;
