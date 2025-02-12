// authController.js
import bcrypt from "bcrypt";
import {
  forgotPassword,
  resetPassword,
} from "../controllers/forgotAuthController.js";
import {
  createUser,
  findUserById,
  findUserByUsername,
} from "../models/authModel.js";
import {
  addOrganizationMember,
  createOrganization,
  getOrganizationById,
} from "../models/organizationModel.js";
import passport from "../passport-config.js";

export const handleRegister = async (req, res) => {
  // Destructure the fields from the request body
  const {
    username,
    email,
    password,
    role,
    organization_id,
    org_code,
    organization_name,
  } = req.body;

  // Log the payload for debugging
  console.log("Register payload:", req.body);

  // Basic check for required fields
  if (!username || !email || !password) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // If an organization_name is provided, we assume the user wants to create a new organization.
    // In that case, force the user's role to "admin". Otherwise, use the provided role or default to "submitter".
    const userRole = organization_name ? "admin" : role || "submitter";

    // Create the new user
    const user = await createUser(username, email, hashedPassword, userRole);
    if (user.error) {
      return res.status(400).json({ error: user.error });
    }

    // If organization_name is provided, create a new organization.
    if (organization_name) {
      const organization = await createOrganization(organization_name, user.id);
      // Also add the user as an approved member of the new organization.
      await addOrganizationMember(user.id, organization.id, "approved");
      // Attach the organization ID to the user object.
      user.organization_id = organization.id;
      console.log("User created with new organization:", organization);
      return res.status(201).json({
        message: "Account and organization have successfully been registered",
        user,
      });
    }
    // Else, if the request includes organization join info (organization_id and org_code)
    else if (organization_id && org_code) {
      const organization = await getOrganizationById(organization_id);
      if (!organization) {
        return res.status(404).json({ error: "Organization not found" });
      }
      // Compare the provided code with the stored org_code and check expiration.
      if (
        organization.org_code !== org_code ||
        new Date(organization.code_expiration) < new Date()
      ) {
        return res
          .status(400)
          .json({ error: "Invalid or expired organization code" });
      }
      // Add the new user to the organization.
      await addOrganizationMember(user.id, organization_id, "approved");
      user.organization_id = organization_id;
      console.log("User created and joined organization:", organization);
    }

    // For a normal registration (without organization creation or join), simply return the user.
    return res.json(user);
  } catch (error) {
    console.error("Error in handleRegister:", error);
    return res.status(500).json({ error: "Server error" });
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

export const handleForgotPassword = forgotPassword;
export const handleResetPassword = resetPassword;
