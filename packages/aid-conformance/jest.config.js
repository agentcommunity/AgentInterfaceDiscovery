module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ['<rootDir>/tests/**/*.test.ts'],
    moduleNameMapper: {
      '^@aid/core/(.*)$': '<rootDir>/../aid-core/src/$1',
    },
}; 