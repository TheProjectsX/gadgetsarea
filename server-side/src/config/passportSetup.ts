/* eslint-disable @typescript-eslint/no-explicit-any */

import passport from "passport";
import { Strategy as GoogleStrategy, Profile } from "passport-google-oauth20";
import prisma from "../shared/prisma";
import { User } from "@prisma/client";

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            callbackURL: "/api/auth/google/callback",
            scope: ["profile", "email"],
            passReqToCallback: false,
        },
        async (
            accessToken: string,
            refreshToken: string,
            profile: Profile,
            done: (err: any, user?: User | false) => void,
        ) => {
            try {
                const email = profile.emails?.[0]?.value;
                if (!email) return done(new Error("No email found"), false);

                let user = await prisma.user.findUnique({ where: { email } });

                if (!user) {
                    user = await prisma.user.create({
                        data: {
                            email,
                            profile: {
                                create: {
                                    name: profile.displayName,
                                    avatar: profile.photos?.[0]?.value,
                                },
                            },
                        },
                    });
                }

                return done(null, user);
            } catch (err) {
                return done(err, false);
            }
        },
    ),
);

export { passport };
