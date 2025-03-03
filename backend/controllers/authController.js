// authController.js
import bcrypt from "bcrypt";
import {
  forgotPassword,
  resetPassword,
} from "../controllers/forgotAuthController.js";
import { pool } from "../database.js";
import {
  createUser,
  findUserById,
  findUserByUsername,
} from "../models/authModel.js";
import { createNotification } from "../models/notificationModel.js";
import {
  addOrganizationMember,
  createOrganization,
  getOrganizationById,
  requestOrganizationJoin,
} from "../models/organizationModel.js";

import passport from "../passport-config.js";

export const handleRegister = async (req, res) => {
  const {
    username,
    email,
    password,
    organization_id,
    org_code,
    organization_name,
    requestJoin,
  } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const userRole = organization_name ? "admin" : "submitter";
    const user = await createUser(username, email, hashedPassword, userRole);

    if (user.error) return res.status(400).json({ error: user.error });

    // 1. Organization Creation Flow
    if (organization_name) {
      const organization = await createOrganization(organization_name, user.id);
      await addOrganizationMember(user.id, organization.id, "approved");
      user.organization_id = organization.id;
    }
    // 2. Join with Code Flow
    else if (org_code) {
      try {
        // First get organization by code to find the ID
        const orgByCode = await pool.query(
          "SELECT * FROM organizations WHERE org_code = $1",
          [org_code]
        );

        if (orgByCode.rows.length === 0) {
          return res.status(400).json({ error: "Invalid organization code" });
        }

        const organization = orgByCode.rows[0];
        const organization_id = organization.id;

        // Then validate using the found ID
        // if (new Date(organization.code_expiration) < new Date()) {
        //   return res.status(400).json({ error: "Organization code has expired" });
        // }

        // Add as approved member using the organization ID
        await addOrganizationMember(user.id, organization_id, "approved");

        // Update user's organization reference
        await pool.query(
          "UPDATE users SET organization_id = $1 WHERE id = $2",
          [organization_id, user.id]
        );
      } catch (error) {
        console.error("Error processing organization code:", error);
        return res
          .status(500)
          .json({ error: "Failed to process organization code" });
      }
    }
    // 3. Request to Join Flow
    else if (organization_id && requestJoin) {
      const organization = await getOrganizationById(organization_id);
      if (!organization) {
        return res.status(404).json({ error: "Organization not found" });
      }
      await requestOrganizationJoin(user.id, organization_id);
      await createNotification(
        organization.admin_id,
        `New join request from ${user.username}`
      );
      return res.status(201).json({
        message: "Registration successful. Awaiting approval.",
        user,
      });
    }

    return res.status(201).json(user);
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Registration failed" });
  }
};

export const handleLogin = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({ error: "Invalid username or password" });
    }
    const { password, ...userWithoutPassword } = user;
    req.logIn(userWithoutPassword, (err) => {
      if (err) {
        return next(err);
      }
      res.json(req.user);
    });
  })(req, res, next);
};

export const handleLogout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: "Failed to destroy session" });
      }
      res.clearCookie("my_session_cookie"); // Ensure this matches the name of your session cookie
      res.json({ message: "Logged out" });
    });
  });
};

export const handleGetUser = (req, res) => {
  if (req.isAuthenticated()) {
    res.json(req.user);
  } else {
    res.status(401).json({ error: "Unauthorized" });
  }
};

// function to check username availability
export const handleCheckUsername = async (req, res) => {
  const { username } = req.query;
  if (!username) {
    return res
      .status(400)
      .json({ error: "Username query parameter is required." });
  }
  try {
    const user = await findUserByUsername(username);
    if (user) {
      // Username exists in the database
      return res.json({ exists: true });
    } else {
      // Username is available
      return res.json({ exists: false });
    }
  } catch (error) {
    console.error("Error checking username:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

export const handleCheckEmail = async (req, res) => {
  const { email } = req.query;
  if (!email) {
    return res
      .status(400)
      .json({ error: "Email query parameter is required." });
  }
  try {
    const { rows } = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    return res.json({ exists: !!rows[0] });
  } catch (error) {
    console.error("Error checking email:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

export const handleForgotPassword = forgotPassword;
export const handleResetPassword = resetPassword;
