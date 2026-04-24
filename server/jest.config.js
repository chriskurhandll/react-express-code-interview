module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testEnvironmentOptions: {
    env: { NODE_ENV: 'test' },
  },
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.test.ts'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/app.ts',
    '!src/data/**',
    '!src/config/express.ts',
  ],
  coverageThreshold: {
    global: {
      lines: 85,
      functions: 85,
    },
  },
};
