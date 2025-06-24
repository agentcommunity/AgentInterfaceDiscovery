module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ['<rootDir>/tests/**/*.test.ts'],
    moduleNameMapper: {
      '^@aid/core/(.*)$': '<rootDir>/../core/src/$1',
    },
}; 