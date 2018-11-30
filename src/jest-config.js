let globalConf = require('../jest-config')

globalConf.coverageThreshold = {
    "global": {
        "statements": 67,
        "branches": 50,
        "functions": 47,
        "lines": 65
    }
}

Object.assign(globalConf.moduleNameMapper, {
    "@common.features/(.*)": "<rootDir>/src/subrepos/gtrack-common-ngx/app/features/$1",
    "@web.features/(.*)": "<rootDir>/src/subrepos/gtrack-common-web/features/$1"
})

module.exports = globalConf