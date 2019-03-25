let globalConf = require('../jest.config');

globalConf.coverageThreshold = {
  global: {
    statements: 67,
    branches: 50,
    functions: 47,
    lines: 65
  }
};

Object.assign(globalConf.moduleNameMapper, {
  '@features/common/(.*)': '<rootDir>/src/features/common/$1',
  '@features/web/(.*)': '<rootDir>/src/features/web/$1'
});

module.exports = globalConf;
