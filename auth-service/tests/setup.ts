import dotenv from "dotenv";

dotenv.config({ path: "tests/.env.test" });

jest.mock("../src/config/redis", () => ({
  redis: {
    set: jest.fn(),
    get: jest.fn(),
    del: jest.fn()
  }
}));
