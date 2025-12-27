import jwt from "jsonwebtoken";

type CreateTestTokenInput = {
  userId: string;
  role?: "ADMIN" | "USER";
};

export function createTestToken({
  userId,
  role = "USER",
}: CreateTestTokenInput) {
  return jwt.sign(
    {
      sub: userId,
      role,
    },
    process.env.JWT_SECRET!,
    {
      expiresIn: "1h",
    }
  );
}
