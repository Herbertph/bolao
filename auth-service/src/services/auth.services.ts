import { User } from "../models/User.js";
import { hashPassword, comparePassword } from "../utils/password.js";
import { generateAccessToken, generateRefreshToken } from "../utils/token.js";

export class AuthService {
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

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    return { user, accessToken, refreshToken };
  }

  async login(emailOrUsername: string, password: string) {
    const user = await User.findOne({
      $or: [{ email: emailOrUsername }, { username: emailOrUsername }]
    });

    if (!user) throw new Error("Invalid credentials");

    const isValid = await comparePassword(password, user.passwordHash);
    if (!isValid) throw new Error("Invalid credentials");

    user.lastLogin = new Date();
    await user.save();

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    return { user, accessToken, refreshToken };
  }
}

