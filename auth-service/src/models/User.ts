import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName:  { type: String, required: true },
    username:  { type: String, required: true, unique: true, lowercase: true },
    email:     { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },

    roles: { type: [String], default: ["user"] },
    profileImage: String,
    status: { type: String, default: "active" },

    isEmailVerified: { type: Boolean, default: false },
    lastLogin: Date
  },
  { timestamps: true }
);

export const User = mongoose.model("User", UserSchema);
