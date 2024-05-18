import bcrypt from "bcrypt";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { pool } from "./database.js";

// Serialize user into the session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from the session
passport.deserializeUser((id, done) => {
  pool.query("SELECT * FROM users WHERE id = $1", [id], (err, result) => {
    if (err) {
      return done(err);
    }
    return done(null, result.rows[0]);
  });
});

// Define the local strategy for Passport
passport.use(
  new LocalStrategy(
    { usernameField: "username", passwordField: "password" },
    (username, password, done) => {
      pool.query(
        "SELECT * FROM users WHERE username = $1",
        [username],
        (err, result) => {
          if (err) {
            return done(err);
          }
          if (result.rows.length === 0) {
            return done(null, false, { message: "Incorrect username." });
          }

          const user = result.rows[0];

          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
              return done(err);
            }
            if (isMatch) {
              return done(null, user);
            } else {
              return done(null, false, { message: "Incorrect password." });
            }
          });
        }
      );
    }
  )
);

export default passport;
