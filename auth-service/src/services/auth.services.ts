import { User } from "../models/User";
import { hashPassword, comparePassword } from "../utils/password";
import { generateAccessToken, generateRefreshToken } from "../utils/token";
import jwt from "jsonwebtoken";
import { generateResetPasswordToken, verifyResetPasswordToken } from "../utils/resetToken";
import { redis } from "../config/redis";
import { audit } from "../utils/audit";

export class AuthService {

  // ==========================================
  // REGISTER
  // ==========================================
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

    // AUDIT (não pode quebrar o fluxo)
    try {
      await audit({
        service: "auth-service",
        action: "USER_REGISTER",
        userId: user.id,
        metadata: { email: user.email }
      });
    } catch (err) {
      console.error("Audit error (register):", (err as any).message);
    }

    const refreshToken = await this.issueRefreshToken(user);
    const accessToken = generateAccessToken(user.id);

    return { user, accessToken, refreshToken };
  }

  // ==========================================
  // LOGIN
  // ==========================================
  async login(emailOrUsername: string, password: string) {
    const user = await User.findOne({
      $or: [{ email: emailOrUsername }, { username: emailOrUsername }]
    });

    if (!user) throw new Error("Invalid credentials");

    const isValid = await comparePassword(password, user.passwordHash);
    if (!isValid) throw new Error("Invalid credentials");

    user.lastLogin = new Date();
    await user.save();

    // AUDIT
    try {
      await audit({
        service: "auth-service",
        action: "USER_LOGIN",
        userId: user.id,
        metadata: { username: user.username }
      });
    } catch {}

    const refreshToken = await this.issueRefreshToken(user);
    const accessToken = generateAccessToken(user.id);

    return { user, accessToken, refreshToken };
  }

  // ==========================================
  // ISSUE REFRESH TOKEN
  // ==========================================
  private async issueRefreshToken(user: any) {
    const refreshToken = generateRefreshToken(user.id);
    const refreshTokenHash = await hashPassword(refreshToken);

    user.refreshTokenHash = refreshTokenHash;
    await user.save();

    return refreshToken;
  }

  // ==========================================
  // REFRESH TOKEN
  // ==========================================
  async refresh(oldRefreshToken: string) {
    const decoded = jwt.verify(oldRefreshToken, process.env.JWT_REFRESH_SECRET!);

    const user = await User.findById((decoded as any).sub);
    if (!user || !user.refreshTokenHash) throw new Error("Invalid refresh token");

    const isValid = await comparePassword(oldRefreshToken, user.refreshTokenHash);
    if (!isValid) throw new Error("Invalid refresh token");

    const isBlacklisted = await redis.get(`blacklist:${oldRefreshToken}`);
    if (isBlacklisted) throw new Error("Refresh token invalidated");

    const newRefreshToken = await this.issueRefreshToken(user);
    const newAccessToken = generateAccessToken(user.id);

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }

  // ==========================================
  // LOGOUT
  // ==========================================
  async logout(userId: string, refreshToken: string) {
    await redis.set(
      `blacklist:${refreshToken}`,
      "1",
      "EX",
      60 * 60 * 24 * 7
    );

    return { message: "User logged out" };
  }

  // ==========================================
  // ME
  // ==========================================
  async me(userId: string) {
    const user = await User.findById(userId)
      .select("-passwordHash -refreshTokenHash");

    if (!user) throw new Error("User not found");

    return user;
  }

  // ==========================================
  // SEND RESET PASSWORD EMAIL
  // ==========================================
  async sendResetPasswordEmail(email: string, token: string) {
    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;
    console.log("Send email to:", email);
    console.log("Link:", resetLink);
  }

  // ==========================================
  // FORGOT PASSWORD
  // ==========================================
  async forgotPassword(email: string) {
    const user = await User.findOne({ email });
    if (!user) throw new Error("Email not found");

    const token = generateResetPasswordToken(user.id);

    try {
      await audit({
        service: "auth-service",
        action: "FORGOT_PASSWORD",
        userId: user.id,
        metadata: {}
      });
    } catch {}

    await this.sendResetPasswordEmail(email, token);

    return { message: "Reset link sent" };
  }

  // ==========================================
  // RESET PASSWORD
  // ==========================================
  async resetPassword(token: string, newPassword: string) {
    let decoded: any;
    try {
      decoded = verifyResetPasswordToken(token);
    } catch {
      throw new Error("Invalid or expired reset token");
    }

    const user = await User.findById(decoded.sub);
    if (!user) throw new Error("User not found");

    user.passwordHash = await hashPassword(newPassword);
    user.refreshTokenHash = null;
    await user.save();

    try {
      await audit({
        service: "auth-service",
        action: "PASSWORD_RESET",
        userId: user.id,
        metadata: {}
      });
    } catch {}

    return { message: "Password reset successfully" };
  }
}
