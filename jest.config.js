let globalConf = require('../jest.config');

globalConf.coverageThreshold = {
  global: {
    statements: 70,
    branches: 60,
    functions: 44,
    lines: 69
  }
};

Object.assign(globalConf.moduleNameMapper, {
  '@features/common/(.*)': '<rootDir>/src/features/common/$1',
  '@features/web/(.*)': '<rootDir>/src/features/web/$1'
});

module.exports = globalConf;
