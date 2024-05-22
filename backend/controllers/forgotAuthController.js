import bcrypt from "bcrypt";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { pool } from "../database.js";

const generateResetToken = () => {
  return crypto.randomBytes(20).toString("hex");
};

export const forgotPassword = async (req, res) => {
  const { username } = req.body;
  const message =
    "If an account with that username exists, a password reset email has been sent.";

  try {
    const { rows } = await pool.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );
    const user = rows[0];

    if (!user) {
      return res.status(200).send({ message });
    }

    const resetToken = generateResetToken();
    const resetPasswordExpires = Date.now() + 3600000; // 1 hour

    await pool.query(
      "UPDATE users SET reset_password_token = $1, reset_password_expires = $2 WHERE id = $3",
      [resetToken, resetPasswordExpires, user.id]
    );

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    const mailOptions = {
      to: user.email,
      from: process.env.GMAIL_USER,
      subject: "Password Reset",
      text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
             Please click on the following link, or paste this into your browser to complete the process:\n\n
             ${resetUrl}\n\n
             If you did not request this, please ignore this email and your password will remain unchanged.\n`,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).send({ message });
  } catch (error) {
    console.error("Error in forgotPassword:", error);
    res.status(200).send({ message });
  }
};

export const resetPassword = async (req, res) => {
  const { token, password } = req.body;
  let message = "Password has been reset. Redirecting to login...";
  try {
    const { rows } = await pool.query(
      "SELECT * FROM users WHERE reset_password_token = $1 AND reset_password_expires > $2",
      [token, Date.now()]
    );
    const user = rows[0];

    if (!user) {
      message = "Password reset failed.";
      return res.status(200).send({ message });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      "UPDATE users SET password = $1, reset_password_token = $2, reset_password_expires = $3 WHERE id = $4",
      [hashedPassword, null, null, user.id]
    );

    res.status(200).send({ message });
  } catch (error) {
    message = "Password reset failed.";
    console.error("Error in resetPassword:", error);
    res.status(200).send({ message });
  }
};
