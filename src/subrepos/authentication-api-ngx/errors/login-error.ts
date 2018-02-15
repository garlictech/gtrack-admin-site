export enum LoginErrorCodes {
  USER_CANCELLED,
  REOPENED
}

export class LoginError extends Error {
  public code;
}
