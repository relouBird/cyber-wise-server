import { Fetch } from "../database/fetch";
import { DatabaseUser } from "../database/user";
import { Create } from "../database/create";
import { AuthErrorHandler, ErrorHandler } from "../types/database.type";
import { AuthData, LoginData, UserLoginCredentials } from "../types/user.type";
import { PostgrestError, AuthError, User } from "@supabase/supabase-js";

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
    const create = new Create("user-role");
    const data = await user.create(credentials, (error) => {
      errorHandler && errorHandler(error);
      isError = true;
    });
    if (!isError) {
      await create.insert(
        [{ uid: data?.user.id ?? "", role: "enterprise", details : "", times : "" }],
        (error) => {
          console.log("erreur-creation-role =>", error?.message);
          const err = error as unknown as AuthError;
          errorHandler && errorHandler(err);
        }
      );
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
  ): Promise<null | LoginData> {
    let isError = false;
    const user = new DatabaseUser("users");
    const fetch = new Fetch("user-role");

    const data = await user.signIn(credentials, (error) => {
      errorHandler && errorHandler(error);
      isError = true;
    });
    if (!isError) {
      const dataType = await fetch.GetByUid(data?.user.id ?? "", (error) => {
        console.log("erreur-recuperation-role =>", error?.message);
        return null;
      });
      console.log("data =>", dataType);
      return { auth: data, type: dataType.role };
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
