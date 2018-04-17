import { IAuthenticationState as IJwtAuthState } from 'subrepos/authentication-api-ngx';

export interface IAuthenticationState {
  jwtAuth: IJwtAuthState;
  uiState: {
    termsAccepted: boolean;
    selectedRole: string;
    loginRefused: boolean;
  };
}

export { IJwtAuthState };
