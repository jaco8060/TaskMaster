import {
  forgotPassword,
  resetPassword,
} from "../controllers/forgotAuthController";

// Mock external dependencies
jest.mock("crypto", () => ({
  randomBytes: jest.fn().mockReturnValue(Buffer.from("mockedToken")),
}));
jest.mock("bcrypt", () => ({
  hash: jest.fn().mockResolvedValue("hashedPassword123"),
}));
jest.mock("nodemailer", () => ({
  createTransport: jest.fn().mockReturnValue({
    sendMail: jest.fn().mockResolvedValue(true),
  }),
}));
jest.mock("../database", () => ({
  pool: {
    query: jest.fn(),
  },
}));

describe("ForgotAuth Controller", () => {
  let mockRes, mockReq;

  beforeEach(() => {
    mockRes = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    mockReq = {
      body: {},
    };

    // Mock Date.now() to return a consistent timestamp
    jest.spyOn(Date, "now").mockReturnValue(1726536888619);

    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe("forgotPassword", () => {
    it("should send a password reset email if the user exists", async () => {
      mockReq.body.username = "testuser";

      const mockUser = {
        id: 1,
        username: "testuser",
        email: "test@example.com",
      };

      // Mock database query for selecting user
      const pool = require("../database").pool;
      pool.query
        .mockResolvedValueOnce({ rows: [mockUser] })
        .mockResolvedValueOnce({});

      await forgotPassword(mockReq, mockRes);

      // Check database queries
      expect(pool.query).toHaveBeenCalledWith(
        "SELECT * FROM users WHERE username = $1",
        ["testuser"]
      );
      expect(pool.query).toHaveBeenCalledWith(
        "UPDATE users SET reset_password_token = $1, reset_password_expires = $2 WHERE id = $3",
        ["6d6f636b6564546f6b656e", 1726536888619 + 3600000, mockUser.id]
      );

      // Check that the email was sent
      const nodemailer = require("nodemailer");
      expect(nodemailer.createTransport().sendMail).toHaveBeenCalledWith({
        to: mockUser.email,
        from: process.env.GMAIL_USER,
        subject: "Password Reset",
        text: expect.any(String),
      });

      // Check the response
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.send).toHaveBeenCalledWith({
        message:
          "If an account with that username exists, a password reset email has been sent.",
      });
    });

    it("should return a generic message if the user does not exist", async () => {
      mockReq.body.username = "nonexistentUser";

      // Mock no user found in the database
      const pool = require("../database").pool;
      pool.query.mockResolvedValueOnce({ rows: [] });

      await forgotPassword(mockReq, mockRes);

      // Check database query
      expect(pool.query).toHaveBeenCalledWith(
        "SELECT * FROM users WHERE username = $1",
        ["nonexistentUser"]
      );

      // Check the response
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.send).toHaveBeenCalledWith({
        message:
          "If an account with that username exists, a password reset email has been sent.",
      });
    });

    it("should handle errors gracefully and return a generic message", async () => {
      mockReq.body.username = "testuser";

      // Mock database error
      const pool = require("../database").pool;
      pool.query.mockRejectedValueOnce(new Error("Database error"));

      // Mock console.error
      jest.spyOn(console, "error").mockImplementation(() => {});

      await forgotPassword(mockReq, mockRes);

      // Check error handling
      expect(console.error).toHaveBeenCalledWith(
        "Error in forgotPassword:",
        expect.any(Error)
      );

      // Check the response
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.send).toHaveBeenCalledWith({
        message:
          "If an account with that username exists, a password reset email has been sent.",
      });
    });
  });

  describe("resetPassword", () => {
    it("should reset the user's password if the token is valid", async () => {
      mockReq.body = { token: "validToken", password: "newPassword123" };

      const mockUser = { id: 1, username: "testuser" };

      // Mock token lookup query
      const pool = require("../database").pool;
      pool.query.mockResolvedValueOnce({ rows: [mockUser] });

      // Mock password update query
      pool.query.mockResolvedValueOnce({});

      await resetPassword(mockReq, mockRes);

      // Check token validation query
      expect(pool.query).toHaveBeenCalledWith(
        "SELECT * FROM users WHERE reset_password_token = $1 AND reset_password_expires > $2",
        ["validToken", 1726536888619]
      );

      // Check password update query
      expect(pool.query).toHaveBeenCalledWith(
        "UPDATE users SET password = $1, reset_password_token = $2, reset_password_expires = $3 WHERE id = $4",
        ["hashedPassword123", null, null, mockUser.id]
      );

      // Check the response
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.send).toHaveBeenCalledWith({
        message: "Password has been reset. Redirecting to login...",
      });
    });

    it("should return a failure message if the token is invalid", async () => {
      mockReq.body = { token: "invalidToken", password: "newPassword123" };

      // Mock token lookup query returning no user
      const pool = require("../database").pool;
      pool.query.mockResolvedValueOnce({ rows: [] });

      await resetPassword(mockReq, mockRes);

      // Check token validation query
      expect(pool.query).toHaveBeenCalledWith(
        "SELECT * FROM users WHERE reset_password_token = $1 AND reset_password_expires > $2",
        ["invalidToken", 1726536888619]
      );

      // Check the response
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.send).toHaveBeenCalledWith({
        message: "Password reset failed.",
      });
    });

    it("should handle errors gracefully and return a failure message", async () => {
      mockReq.body = { token: "validToken", password: "newPassword123" };

      // Mock database error during token lookup
      const pool = require("../database").pool;
      pool.query.mockRejectedValueOnce(new Error("Database error"));

      // Mock console.error
      jest.spyOn(console, "error").mockImplementation(() => {});

      await resetPassword(mockReq, mockRes);

      // Check error handling
      expect(console.error).toHaveBeenCalledWith(
        "Error in resetPassword:",
        expect.any(Error)
      );

      // Check the response
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.send).toHaveBeenCalledWith({
        message: "Password reset failed.",
      });
    });
  });
});
