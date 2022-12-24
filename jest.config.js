module.exports = {
  moduleNameMapper: {
    '^@libs/(.*)': ['<rootDir>/libs/$1'],
    '^@tests/(.*)': ['<rootDir>/tests/$1'],
    // '^@/(.*)$': '<rootDir>/$1',
    // 'libs/(.*)': '/libs/$1',
    // 'tests/(.*)': '/__tests__/$1',
  },
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]sx?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  // coverageDirectory: '../../../coverage/libs/lending/domain',
};
