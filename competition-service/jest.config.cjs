module.exports = {
  preset: "ts-jest/presets/default-esm",
  testEnvironment: "node",
  testMatch: ["**/*.spec.ts"],
  clearMocks: true,

  // Jest + ESM + TS
  extensionsToTreatAsEsm: [".ts"],

  globals: {
    "ts-jest": {
      useESM: true,
      tsconfig: "tsconfig.json",
    },
  },

  // Permite imports com .js (padrão ESM) resolverem para .ts nos testes
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
};
