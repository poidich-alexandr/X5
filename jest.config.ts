import type { Config } from "jest";

const config: Config = {
  testEnvironment: "node",
  transform: {
    "^.+\\.(t|j)sx?$": [
      "ts-jest",
      { useESM: true, tsconfig: "tsconfig.jest.json" },
    ],
  },
};

export default config;
