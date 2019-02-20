export enum PermissionRecordReason {
  Banned,
  UnderReview,
  InvalidProfile
}

export interface PermissionRecordData {
  canUseSystem: boolean;
  reason?: PermissionRecordReason;
}

export interface PermissionRecord {
  user: PermissionRecordData;
}
