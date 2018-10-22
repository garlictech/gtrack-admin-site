let globalConf = require('../jest-config')

globalConf.coverageThreshold = {
    "global": {
        "statements": 69.08,
        "branches": 52.04,
        "functions": 45.38,
        "lines": 67.29
    }
}

Object.assign(globalConf.moduleNameMapper, {
    "@common.features/(.*)": "<rootDir>/src/subrepos/gtrack-common-ngx/app/features/$1",
    "@web.features/(.*)": "<rootDir>/src/subrepos/gtrack-common-web/features/$1"
})

module.exports = globalConf