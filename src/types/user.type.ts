import { User, Session, Subscription } from "@supabase/supabase-js";

export interface Credentials {
  email: string;
  password: string;
}

export type RoleType = "Admin" | "Manager" | "Employé" | "Invité";

export interface DetailSimpleInterface {
  id?: number;
  org_id: string;
  firstName: string;
  lastName: string;
  role: "enterprise" | RoleType;
  phone: string;
  status: "Actif" | "Inactif";
  lastLogin?: string;
  avatar?: string;
}

export interface UserSimpleCredentials {
  id?: string;
  org_id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "enterprise" | RoleType;
  password?: string;
  phone: string;
  status: "Actif" | "Inactif";
  lastLogin?: string;
  avatar?: string;
}

export interface UpdateUserSimpleCredentials {
  lastLogin: string;
  status: "Actif" | "Inactif";
}

export interface UserLoginCredentials extends Credentials {
  password_confirmation: string;
}

export interface UserChangeCredentials extends Credentials {
  last_password: string;
}

export type AuthData = {
  user: User;
  session: Session;
};

export type SubscriptionObject = {
  subscription: Subscription;
};

export type LoginData = {
  auth: AuthData | null;
  type: string;
};
