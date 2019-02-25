import { AuthenticationState as IJwtAuthState } from '@bit/garlictech.angular-features.common.authentication-api';

export interface AuthenticationState {
  jwtAuth: IJwtAuthState;
  uiState: {
    termsAccepted: boolean;
    selectedRole: string;
    loginRefused: boolean;
  };
}

export { IJwtAuthState };
