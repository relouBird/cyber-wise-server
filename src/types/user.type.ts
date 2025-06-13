export interface Credentials {
  email: string;
  password: string;
}

export interface UserLoginCredentials extends Credentials {
  password_confirmation: string;
}

type UserIdentity = {
  identity_id: string;
  id: string;
  user_id: string;
  identity_data: {
    email: string;
    email_verified: boolean;
    phone_verified: boolean;
    sub: string;
  };
  provider: string;
  last_sign_in_at: string;
  created_at: string;
  updated_at: string;
  email: string;
};

type AppMetadata = {
  provider: string;
  providers: string[];
};

type User = {
  id: string;
  aud: string;
  role: string;
  email: string;
  email_confirmed_at: string;
  phone: string;
  last_sign_in_at: string;
  app_metadata: AppMetadata;
  user_metadata: Record<string, unknown>;
  identities: UserIdentity[];
  created_at: string;
  updated_at: string;
};

type Session = {
  access_token: string;
  token_type: string;
  expires_in: number;
  expires_at: number;
  refresh_token: string;
  user: User;
};

export type AuthData = {
    user: User;
    session: Session;
  };
