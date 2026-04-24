module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testMatch: [
    '**/__tests__/**/*.[jt]s?(x)',
    '**/?(*.)+(spec|test).[jt]s?(x)',
  ],
  testPathIgnorePatterns: [
    '__tests__/utils',
    '__tests__/mocks',
  ],
  moduleNameMapper: {
    '^@/__tests__/(.+)$': '<rootDir>/__tests__/$1',
    '^@/(.+)$': '<rootDir>/src/$1',
  },
  globals: {
    'ts-jest': {
      tsconfig: {
        jsx: 'react-jsx',
        esModuleInterop: true,
      },
    },
  },
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest'],
  },
}
