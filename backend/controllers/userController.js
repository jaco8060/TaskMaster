// backend/controllers/userController.js
import multer from "multer";
import { pool } from "../database.js";
import { meiliClient } from "../meilisearch.js";
import { createNotification } from "../models/notificationModel.js";
import {
  assignRoles,
  getUsersAssignedBy,
  getUsersByOrganization,
  updateUserProfile,
} from "../models/userModel.js";
import sharp from "sharp";
import path from "path";
import fs from "fs";

// Configure multer for profile picture uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/profile_pictures/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
export const uploadProfilePicture = multer({ storage });

export const handleGetUsers = async (req, res) => {
  const assignedBy = req.query.assigned_by;
  try {
    let users;
    if (assignedBy) {
      // Pass the organization id as well:
      users = await getUsersAssignedBy(assignedBy, req.user.organization_id);
    } else {
      // Otherwise, list all users in the same organization.
      users = await getUsersByOrganization(req.user.organization_id);
    }
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const handleAssignRoles = async (req, res) => {
  const { userIds, role } = req.body;
  const assignedBy = req.user.id;
  try {
    await assignRoles(userIds, role, assignedBy);
    res.status(200).send({ message: "Role assigned successfully!" });
  } catch (error) {
    console.error("Error assigning role:", error);
    res.status(500).send({ error: "Failed to assign role." });
  }
};

export const handleRemoveRoleAssignment = async (req, res) => {
  const userId = req.params.userId;
  try {
    const result = await pool.query(
      "UPDATE users SET role = 'submitter', assigned_by = NULL WHERE id = $1 RETURNING *",
      [userId]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ message: "Role assignment removed successfully" });
  } catch (error) {
    console.error("Error removing role assignment:", error);
    res.status(500).json({ error: "Failed to remove role assignment" });
  }
};

// Improved compressImage function
const compressImage = async (file) => {
  const compressedFilename = `compressed-${Date.now()}-${file.originalname.replace(/\.[^/.]+$/, '.jpg')}`;
  const outputPath = path.join(file.destination, compressedFilename);

  try {
    await sharp(file.path)
      .resize({ width: 800, height: 800, fit: 'inside' }) // More generous dimensions
      .rotate() // Auto-rotate based on EXIF data
      .jpeg({ 
        quality: 75,
        mozjpeg: true // Better compression
      })
      .toFile(outputPath);

    // Replace original only after successful compression
    fs.unlinkSync(file.path); // Remove original
    fs.renameSync(outputPath, file.path); // Replace with compressed version

    return file.filename; // Keep original filename

  } catch (error) {
    console.error("Error compressing image:", error);
    // Clean up failed compression attempts
    if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
    throw error;
  }
};

// Endpoint: Update user profile
export const handleUpdateUserProfile = async (req, res) => {
  const userId = req.user.id;
  const {
    username,
    email,
    password,
    confirmPassword,
    first_name,
    last_name,
    bio,
  } = req.body;
  if (password && password !== confirmPassword) {
    return res.status(400).json({ error: "Passwords do not match" });
  }
  try {
    let profilePictureFilename = null;
    if (req.file) {
      try {
        await compressImage(req.file);
        profilePictureFilename = req.file.filename;
      } catch (error) {
        return res.status(500).json({ 
          error: "Failed to process image. Please try another file." 
        });
      }
    }
    const updatedUser = await updateUserProfile(userId, {
      username,
      email,
      password: password ? password : null,
      profile_picture: profilePictureFilename,
      first_name,
      last_name,
      bio,
    });
    await meiliClient.index("users").addDocuments([
      {
        id: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email,
        organization_id: updatedUser.organization_id,
      },
    ]);
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ error: "Failed to update profile" });
  }
};

export const indexUser = async (user) => {
  await meiliClient.index("users").addDocuments([
    {
      id: user.id,
      username: user.username,
      email: user.email,
      organization_id: user.organization_id,
    },
  ]);
};

// Endpoint: Request role change
export const handleRequestRoleChange = async (req, res) => {
  const userId = req.user.id;
  const { message } = req.body;
  try {
    // Get all admin users (for simplicity, all admins receive the request)
    const result = await pool.query(
      "SELECT id FROM users WHERE role = 'admin'"
    );
    const adminIds = result.rows.map((row) => row.id);
    for (const adminId of adminIds) {
      await createNotification(
        adminId,
        `User ${req.user.username} has requested a role change. Message: ${message}`
      );
    }
    res.status(200).json({ message: "Role change request sent" });
  } catch (error) {
    console.error("Error requesting role change:", error);
    res.status(500).json({ error: "Failed to send role change request" });
  }
};

export const handleGetUserById = async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await pool.query(
      "SELECT id, username, email, role, first_name, last_name, bio, organization_id, profile_picture FROM users WHERE id = $1",
      [userId]
    );

    if (user.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user.rows[0]);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Server error" });
  }
};
