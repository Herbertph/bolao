import { User } from "../models/User.js";
import { hashPassword, comparePassword } from "../utils/password.js";
import { generateAccessToken, generateRefreshToken } from "../utils/token.js";
import jwt from "jsonwebtoken";

export class AuthService {

  // -----------------------------------------
  // REGISTER
  // -----------------------------------------
  async register(data: any) {
    const emailExists = await User.findOne({ email: data.email });
    if (emailExists) throw new Error("Email already in use");

    const userExists = await User.findOne({ username: data.username });
    if (userExists) throw new Error("Username already in use");

    const passwordHash = await hashPassword(data.password);

    const user = await User.create({
      firstName: data.firstName,
      lastName: data.lastName,
      username: data.username,
      email: data.email,
      passwordHash
    });

    // ROTATE REFRESH TOKEN
    const refreshToken = await this.issueRefreshToken(user);

    const accessToken = generateAccessToken(user.id);

    return { user, accessToken, refreshToken };
  }

  // -----------------------------------------
  // LOGIN
  // -----------------------------------------
  async login(emailOrUsername: string, password: string) {
    const user = await User.findOne({
      $or: [{ email: emailOrUsername }, { username: emailOrUsername }]
    });

    if (!user) throw new Error("Invalid credentials");

    const isValid = await comparePassword(password, user.passwordHash);
    if (!isValid) throw new Error("Invalid credentials");

    user.lastLogin = new Date();
    await user.save();

    // ROTATE REFRESH TOKEN
    const refreshToken = await this.issueRefreshToken(user);

    const accessToken = generateAccessToken(user.id);

    return { user, accessToken, refreshToken };
  }

  // -----------------------------------------
  // ISSUE REFRESH TOKEN (rotating)
  // -----------------------------------------
  private async issueRefreshToken(user: any) {
    const refreshToken = generateRefreshToken(user.id);
    const refreshTokenHash = await hashPassword(refreshToken);

    user.refreshTokenHash = refreshTokenHash;
    await user.save();

    return refreshToken;
  }

  // -----------------------------------------
  // REFRESH TOKEN ENDPOINT LOGIC
  // -----------------------------------------
  async refresh(oldRefreshToken: string) {
    const decoded = jwt.verify(oldRefreshToken, process.env.JWT_REFRESH_SECRET!);

    const user = await User.findById((decoded as any).sub);
    if (!user || !user.refreshTokenHash) throw new Error("Invalid refresh token");

    const isValid = await comparePassword(oldRefreshToken, user.refreshTokenHash);
    if (!isValid) throw new Error("Invalid refresh token");

    // ROTATE TOKEN
    const newRefreshToken = await this.issueRefreshToken(user);
    const newAccessToken = generateAccessToken(user.id);

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }

  // -----------------------------------------
  // LOGOUT
  // -----------------------------------------
  async logout(userId: string) {
    const user = await User.findById(userId);
    if (!user) return;

    user.refreshTokenHash = null;
    await user.save();
  }

  async me(userId: string) {
    const user = await User.findById(userId).select("-passwordHash -refreshTokenHash");
    if (!user) throw new Error("User not found");
    return user;
  }
}
