import { GoTrueAdminApi, SupabaseClient, User } from "@supabase/supabase-js";
import SupabaseConfig from "../config/database.config";
import { ErrorHandler, AuthErrorHandler } from "../types/database.type";
import {
  AuthData,
  Credentials,
  SubscriptionObject,
  UpdateUserSimpleCredentials,
  UserLoginCredentials,
  UserSimpleCredentials,
} from "../types/user.type";
import { SupabaseAuthClient } from "@supabase/supabase-js/dist/module/lib/SupabaseAuthClient";

export class DatabaseUser {
  protected name: string = "";
  protected auth: SupabaseAuthClient;
  protected auth_admin: GoTrueAdminApi;

  /**
   * @param {string} table_name - ceci est le nom de la table...
   */
  constructor(table_name: string) {
    this.auth = SupabaseConfig.auth;
    this.auth_admin = SupabaseConfig.auth.admin;
    this.name = table_name;
  }

  /**
   * Cette fonction permet d'attendre selon un contexte et effectuer une fonction
   */
  async waitChangeState(
    callback: () => Promise<void>
  ): Promise<SubscriptionObject> {
    const { data } = this.auth.onAuthStateChange(async (event, session) => {
      if (event == "PASSWORD_RECOVERY") {
        await callback();
      }
    });
    return data;
  }

  /**
   * Cette fonction permet de recuperer un utilisateur en fonction de access token
   * @param {string} access_token
   * @param {AuthErrorHandler | undefined} errorHandler
   * @returns {Promise<null | User>}
   */
  async get(
    access_token: string,
    errorHandler?: AuthErrorHandler
  ): Promise<null | User> {
    const {
      data: { user },
      error,
    } = await this.auth.getUser(access_token);

    if (error) {
      errorHandler && errorHandler(error);
      return null;
    }

    return user;
  }

  /**
   * Cette fonction permet de creer un Utilisateur
   * @param {UserLoginCredentials} credentials - ce sont les données de l'utilisateurs
   * @param {AuthErrorHandler} errorHandler  - ceci est la fonction qui prend en parametre l'erreur et qui permet de la gerer
   * @returns {Promise<null | AuthData>}
   */
  async create(
    credentials: UserLoginCredentials,
    errorHandler?: AuthErrorHandler
  ): Promise<null | AuthData> {
    const { data, error } = await this.auth.signUp({
      email: credentials.email ?? "default@gmail.com",
      password: credentials.password,
    });

    if (error) {
      errorHandler && errorHandler(error);
      return null;
    }

    return data as AuthData;
  }

  /**
   * Cette Fonction permet de se connecter à un utilisateur
   * @param {UserLoginCredentials} credentials - ce sont les données de l'utilisateurs
   * @param {AuthErrorHandler} errorHandler  - ceci est la fonction qui prend en parametre l'erreur et qui permet de la gerer
   * @returns {Promise<null | AuthData>}
   */
  async signIn(
    credentials: UserLoginCredentials,
    errorHandler?: AuthErrorHandler
  ): Promise<null | AuthData> {
    const { data, error } = await this.auth.signInWithPassword({
      email: credentials.email ?? "default@gmail.com",
      password: credentials.password,
    });

    if (error) {
      errorHandler && errorHandler(error);
      return null;
    }

    return data as AuthData;
  }

  /**
   * Cette Fonction permet de reset le password d'un utilisateur
   * @param {string} email - c'est l'email de l'utilisateur qu'on souhaite modifier...
   */
  async resetPassword(email: string) {
    await this.auth.resetPasswordForEmail(email);
  }

  /**
   * Cette Fonction permet de set la session en cours..
   * @param {Object} sessionInfos - ce sont les informations liées au token...
   */
  async setSession(sessionInfos: {
    access_token: string;
    refresh_token: string;
  }) {
    await this.auth.setSession(sessionInfos);
  }

  /**
   * Cette Fonction permet de changer le password d'un utilisateur
   * @param {string} newPassword - Le nouveau mot de passe de l'utilisateur....
   */
  async changePassword(newPassword: string) {
    console.log("password-to-change...");
    const { data, error } = await this.auth.updateUser({
      password: newPassword,
    });
    console.log("password-to-change...");
    if (data.user) console.log("Password updated successfully =>", data);
    if (error)
      console.log(
        "There was an error updating your password =>",
        error.message
      );
  }

  /// --------------------------------------------------------------------------------------------
  /// ------------------Cette partie concerne les actions en tant que admin-----------------------
  /// --------------------------------------------------------------------------------------------

  /**
   * Cette fonction permet de recuperer les Utilisateurs comme Admin
   * @param {UserLoginCredentials} credentials - ce sont les données de l'utilisateurs
   * @param {AuthErrorHandler} errorHandler  - ceci est la fonction qui prend en parametre l'erreur et qui permet de la gerer
   * @returns {Promise<[] | User[]>}
   */
  async getAllAsAdmin(errorHandler?: AuthErrorHandler): Promise<[] | User[]> {
    const {
      data: { users },
      error,
    } = await this.auth_admin.listUsers();

    if (error) {
      errorHandler && errorHandler(error);
      return [];
    }

    return users;
  }

  /**
   * Cette fonction permet de recuperer un Utilisateur comme Admin
   * @param {string} id - c'est l'identifiant de l'utilisateurs
   * @param {AuthErrorHandler} errorHandler  - ceci est la fonction qui prend en parametre l'erreur et qui permet de la gerer
   * @returns {Promise<null | User>}
   */
  async getUserAsAdmin(
    id: string,
    errorHandler?: AuthErrorHandler
  ): Promise<null | User> {
    const { data, error } = await this.auth_admin.getUserById(id);

    if (error) {
      errorHandler && errorHandler(error);
      return null;
    }

    return data.user;
  }

  /**
   * Cette fonction permet de creer un Utilisateur comme Admin
   * @param {UserLoginCredentials} credentials - ce sont les données de l'utilisateurs
   * @param {AuthErrorHandler} errorHandler  - ceci est la fonction qui prend en parametre l'erreur et qui permet de la gerer
   * @returns {Promise<null | AuthData>}
   */
  async createAsAdmin(
    credentials: UserSimpleCredentials,
    errorHandler?: AuthErrorHandler
  ): Promise<null | User> {
    const { data, error } = await this.auth_admin.createUser({
      email: credentials.email ?? "default@gmail.com",
      password: credentials.firstName + credentials.lastName + "@123",
      email_confirm: true,
      user_metadata: {
        org_id: credentials.org_id,
        firstName: credentials.firstName,
        lastName: credentials.lastName,
        lastLogin: "",
        phone: credentials.phone,
        role: credentials.role,
        status: credentials.status,
      },
    });

    if (error) {
      errorHandler && errorHandler(error);
      return null;
    }

    return data.user;
  }

  async getAsAdmin(
    id: string,
    errorHandler: AuthErrorHandler
  ): Promise<null | User> {
    const { data, error } = await this.auth_admin.getUserById(id);
    if (error) {
      errorHandler && errorHandler(error);
      return null;
    }

    return data.user;
  }

  /**
   * Cette fonction permet de mettre à jour un Utilisateur comme Admin
   * @param {UserSimpleCredentials} credentials - ce sont les données de l'utilisateurs
   * @param {AuthErrorHandler} errorHandler  - ceci est la fonction qui prend en parametre l'erreur et qui permet de la gerer
   * @returns {Promise<null | AuthData>}
   */
  async updateAsAdmin(
    credentials: UserSimpleCredentials,
    errorHandler?: AuthErrorHandler
  ): Promise<null | User> {
    const { data, error } = await this.auth_admin.updateUserById(
      credentials.id ?? "",
      {
        password: credentials.firstName + credentials.lastName + "@123",
        user_metadata: {
          firstName: credentials.firstName,
          lastName: credentials.lastName,
          phone: credentials.phone,
          role: credentials.role,
          status: credentials.status,
        },
      }
    );

    if (error) {
      errorHandler && errorHandler(error);
      return null;
    }
    return data.user;
  }

  /**
   * Cette fonction permet de mettre à jour un Utilisateur comme Admin
   * @param {UserSimpleCredentials} credentials - ce sont les données de l'utilisateurs
   * @param {AuthErrorHandler} errorHandler  - ceci est la fonction qui prend en parametre l'erreur et qui permet de la gerer
   * @returns {Promise<null | AuthData>}
   */
  async updateConnexionAsAdmin(
    id: string,
    credentials: UpdateUserSimpleCredentials,
    errorHandler?: AuthErrorHandler
  ): Promise<null | User> {
    const { data, error } = await this.auth_admin.updateUserById(id, {
      user_metadata: {
        lastLogin: credentials.lastLogin,
        status: credentials.status,
      },
    });

    if (error) {
      errorHandler && errorHandler(error);
      return null;
    }
    return data.user;
  }

  /**
   * Cette fonction permet de supprimer un Utilisateur comme Admin
   * @param {string} uid - ce sont les données de l'utilisateurs
   * @param {AuthErrorHandler} errorHandler  - ceci est la fonction qui prend en parametre l'erreur et qui permet de la gerer
   * @returns {Promise<null | User>}
   */
  async deleteAsAdmin(
    uid: string,
    errorHandler?: AuthErrorHandler
  ): Promise<null | User> {
    const { data, error } = await this.auth_admin.deleteUser(uid);

    if (error) {
      errorHandler && errorHandler(error);
      return null;
    }
    return data.user;
  }
}
