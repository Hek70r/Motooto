/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  setupFiles: ['./jest.polyfills.js'],
  preset: 'ts-jest',
  testEnvironment: 'node',
};