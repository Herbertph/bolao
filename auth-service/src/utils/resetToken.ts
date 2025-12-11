import jwt from "jsonwebtoken";

export function generateResetPasswordToken(userId: string) {
  return jwt.sign(
    { sub: userId },
    process.env.JWT_RESET_PASSWORD_SECRET!,
    { expiresIn: "15m" }
  );
}

export function verifyResetPasswordToken(token: string) {
  return jwt.verify(token, process.env.JWT_RESET_PASSWORD_SECRET!);
}
