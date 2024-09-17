import {
  handleGetUser,
  handleLogout,
  handleRegister,
} from "../controllers/authController.js";
import { createUser } from "../models/authModel.js";

// Mock dependencies
jest.mock("../models/authModel.js");

describe("Auth Controller", () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  // Test handleRegister
  describe("handleRegister", () => {
    it("should register a new user and return the user object", async () => {
      const req = {
        body: {
          username: "testuser",
          email: "test@example.com",
          password: "password123",
          role: "user",
        },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
      const createdUser = {
        id: 1,
        username: "testuser",
        email: "test@example.com",
        role: "user",
      };

      createUser.mockResolvedValue(createdUser);

      await handleRegister(req, res);

      expect(createUser).toHaveBeenCalledWith(
        "testuser",
        "test@example.com",
        expect.any(String), // Password hash is not being tested here
        "user"
      );
      expect(res.json).toHaveBeenCalledWith(createdUser);
    });

    it("should handle errors during user creation", async () => {
      const req = {
        body: {
          username: "testuser",
          email: "test@example.com",
          password: "password123",
          role: "user",
        },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      createUser.mockRejectedValue(new Error("Database error"));

      await handleRegister(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Server error" });
    });
  });

  // Test handleLogout
  describe("handleLogout", () => {
    it("should log out a user and destroy session", (done) => {
      const req = {
        logout: jest.fn((callback) => callback(null)),
        session: {
          destroy: jest.fn((callback) => callback(null)),
        },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
        clearCookie: jest.fn(),
      };
      const next = jest.fn();

      handleLogout(req, res, next);

      setImmediate(() => {
        try {
          expect(req.logout).toHaveBeenCalled();
          expect(req.session.destroy).toHaveBeenCalled();
          expect(res.clearCookie).toHaveBeenCalledWith("my_session_cookie");
          expect(res.json).toHaveBeenCalledWith({ message: "Logged out" });
          done();
        } catch (error) {
          done(error);
        }
      });
    });

    it("should return 500 if session destruction fails", (done) => {
      const req = {
        logout: jest.fn((callback) => callback(null)),
        session: {
          destroy: jest.fn((callback) =>
            callback(new Error("Failed to destroy session"))
          ),
        },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
      const next = jest.fn();

      handleLogout(req, res, next);

      setImmediate(() => {
        try {
          expect(res.status).toHaveBeenCalledWith(500);
          expect(res.json).toHaveBeenCalledWith({
            error: "Failed to destroy session",
          });
          done();
        } catch (error) {
          done(error);
        }
      });
    });
  });

  // Test handleGetUser
  describe("handleGetUser", () => {
    it("should return the user object if authenticated", () => {
      const req = {
        isAuthenticated: jest.fn().mockReturnValue(true),
        user: { id: 1, username: "testuser" },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      handleGetUser(req, res);

      expect(res.json).toHaveBeenCalledWith({ id: 1, username: "testuser" });
    });

    it("should return 401 if the user is not authenticated", () => {
      const req = {
        isAuthenticated: jest.fn().mockReturnValue(false),
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      handleGetUser(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: "Unauthorized" });
    });
  });
});
