module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ['<rootDir>/tests/**/*.test.ts'],
    coverageThreshold: {
      global: { branches: 100 },
    },
    moduleNameMapper: {
      '^@aid/core/(.*)$': '<rootDir>/../aid-core/src/$1',
    },
}; 