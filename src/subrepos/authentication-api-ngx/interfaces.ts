export interface User {
  id: string;
  createdAt: Date;
  email: string;
  facebookId: string;
  lastLogin: Date;
  modifiedAt: Date;
  roles: [string];
  verified: boolean;
}
