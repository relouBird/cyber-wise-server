import { User } from "@supabase/supabase-js";
import { Fetch } from "../database/fetch";
import { DatabaseUser } from "../database/user";
import { AuthErrorHandler, ErrorHandler } from "../types/database.type";
import { AuthData, UserLoginCredentials } from "../types/user.type";

export class UserModel {
  protected name: string = "user";
  protected fetch: Fetch;

  constructor() {
    this.fetch = new Fetch(this.name);
  }

  async getAll(errorHandler?: ErrorHandler): Promise<null | any[]> {
    let isError: boolean = false;
    const data = await this.fetch.GetAll((error) => {
      errorHandler && errorHandler(error);
      isError = true;
      console.log(`${this.name}-error => ${error}`);
    });

    if (isError) {
      return null;
    }
    return data;
  }

  /*
  Lire la documentation sur la classe de la base données User
  */
  async create(
    credentials: UserLoginCredentials,
    errorHandler?: AuthErrorHandler
  ): Promise<null | AuthData> {
    let isError = false;
    const user = new DatabaseUser("users");
    const data = user.create(credentials, (error) => {
      errorHandler && errorHandler(error);
      isError = true;
    });
    if (!isError) {
      return data;
    }
    return null;
  }

  /*
  Lire la documentation sur la classe de la base données User
  */
  async signIn(
    credentials: UserLoginCredentials,
    errorHandler?: AuthErrorHandler
  ): Promise<null | AuthData> {
    let isError = false;
    const user = new DatabaseUser("users");
    const data = await user.signIn(credentials, (error) => {
      errorHandler && errorHandler(error);
      isError = true;
    });
    if (!isError) {
      return data;
    }
    return null;
  }

  /*
  Lire la documentation sur la classe de la bd User
  */
  async get(
    access_token: string,
    errorHandler?: AuthErrorHandler
  ): Promise<null | User> {
    let isError = false;
    const user = new DatabaseUser("users");
    const data = await user.get(access_token, (error) => {
      errorHandler && errorHandler(error);
      isError = true;
    });
    if (!isError) {
      return data;
    }
    return null;
  }
}
