module.exports = {
  verbose: true,
  testTimeout: 30000,
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testEnvironment: 'node',
  testRegex: '.test.ts$',
  moduleNameMapper: {
    '@root(.*)$': '<rootDir>$1',
    '@app(.*)$': '<rootDir>/app$1',
    '@service(.*)$': '<rootDir>/services$1',
    '@schema(.*)$': '<rootDir>/schema$1',
    '@util(.*)$':'<rootDir>/app/utils$1'
  },
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest'
  },
  testPathIgnorePatterns: ['/node_modules/', 'src/models/*'],
  coveragePathIgnorePatterns: [
    'node_modules/*',
    '<rootDir>/app/*',
    '<rootDir>/models/*',
    '<rootDir>/__test__/utils/*'
  ],
  coverageDirectory: '../coverage',
  // testResultsProcessor: 'jest-sonar-reporter',
  // reporters: ['default', 'jest-junit']
}
