module.exports = {
  preset: "ts-jest/presets/default-esm",
  testEnvironment: "node",
  testMatch: ["**/*.spec.ts"],
  clearMocks: true,

  extensionsToTreatAsEsm: [".ts"],

  setupFiles: ["<rootDir>/src/utils/setup.ts"],

  globals: {
    "ts-jest": {
      useESM: true,
      tsconfig: "tsconfig.json",
    },
  },

  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
};
