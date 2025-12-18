import { RequestHandler } from "express";
import { AuthResponse, User } from "@shared/api";

export const handleLogin: RequestHandler = (req, res) => {
  const { email, password } = req.body;

  // Mock authentication
  if (email && password) {
    const user: User = {
      id: "u1",
      email: email,
      name:
        email.split("@")[0].charAt(0).toUpperCase() +
        email.split("@")[0].slice(1),
      role: email.includes("gov") ? "GOV" : "PUBLIC",
    };

    const response: AuthResponse = {
      user,
      token: "mock-jwt-token-" + Date.now(),
    };

    return res.json(response);
  }

  res.status(401).json({ message: "Invalid credentials" });
};

export const handleSignup: RequestHandler = (req, res) => {
  const { name, email, password, role } = req.body;

  if (name && email && password) {
    const user: User = {
      id: "u" + Date.now(),
      email,
      name,
      role: role as any,
    };

    const response: AuthResponse = {
      user,
      token: "mock-jwt-token-" + Date.now(),
    };

    return res.json(response);
  }

  res.status(400).json({ message: "Missing required fields" });
};
