let globalConf = require('../jest-config')

globalConf.coverageThreshold = {
    "global": {
        "statements": 67.31,
        "branches": 50.46,
        "functions": 51.31,
        "lines": 65.92
    }
}

Object.assign(globalConf.moduleNameMapper, {
    "@common.features/(.*)": "<rootDir>/src/subrepos/gtrack-common-ngx/app/features/$1",
    "@web.features/(.*)": "<rootDir>/src/subrepos/gtrack-common-web/features/$1"
})

module.exports = globalConf