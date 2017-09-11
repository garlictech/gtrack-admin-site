# gtrack admin site

[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![Build Status](get travis link here)

## Development

We use the [Docker based GarlicTech workflow manager](https://github.com/garlictech/workflows) to control development, build, deployment. 
See the appropriate sections there, It is *important*. For the description of `npm run`, `make`, etc. commands, consult the page.

```
npm run build:dev
npm install
npm start
...
git add .
npm run commit
```

Mind, that the local `npm install` is only for the code editor to be able to resolve the references! The `npm run build:dev` command installs the dependencies to teh container as well, and that is what your site/webpack ultimately see.
