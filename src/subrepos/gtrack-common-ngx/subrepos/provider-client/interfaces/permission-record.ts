export enum PermissionRecordReason {
  Banned,
  UnderReview,
  InvalidProfile
}

export interface IPermissionRecordData {
  canUseSystem: boolean;
  reason?: PermissionRecordReason;
}

export interface IPermissionRecord {
  user: IPermissionRecordData;
}
