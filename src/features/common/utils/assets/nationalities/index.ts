// tslint:disable-next-line:no-var-requires no-require-imports
const _nationalities = require('./countries.json');

export const nationalities = _nationalities.map(val => ({ label: val.nationality, value: val.alpha_2_code }));
