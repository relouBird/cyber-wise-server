import { SupabaseClient, User } from "@supabase/supabase-js";
import SupabaseConfig from "../config/database.config";
import { ErrorHandler, AuthErrorHandler } from "../types/database.type";
import { AuthData, UserLoginCredentials } from "../types/user.type";

export class DatabaseUser {
  protected name: string = "";
  protected supabase: SupabaseClient;
  protected credentials: UserLoginCredentials | null = null;

  /**
   * @param {string} table_name - ceci est le nom de la table...
   */
  constructor(table_name: string) {
    this.supabase = SupabaseConfig;
    this.name = table_name;
  }

  /**
   *
   * @param {UserLoginCredentials} credentials - ce sont les données de l'utilisateurs
   * @param {AuthErrorHandler} errorHandler  - ceci est la fonction qui prend en parametre l'erreur et qui permet de la gerer
   * @returns {Promise<null | AuthData>}
   */
  async create(
    credentials: UserLoginCredentials,
    errorHandler?: AuthErrorHandler
  ): Promise<null | AuthData> {
    this.credentials = credentials;
    const { data, error } = await this.supabase.auth.signUp({
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
    this.credentials = credentials;
    const { data, error } = await this.supabase.auth.signInWithPassword({
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
    } = await this.supabase.auth.getUser(access_token);

    if (error) {
      errorHandler && errorHandler(error);
      return null;
    }

    return user;
  }
}
