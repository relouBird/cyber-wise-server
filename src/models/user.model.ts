import { Fetch } from "../database/fetch";
import { DatabaseUser } from "../database/user";
import { Create } from "../database/create";
import { Update } from "../database/update";
import { AuthErrorHandler, ErrorHandler } from "../types/database.type";
import {
  AuthData,
  Credentials,
  DetailSimpleInterface,
  LoginData,
  UserLoginCredentials,
  UserSimpleCredentials,
} from "../types/user.type";
import { PostgrestError, AuthError, User } from "@supabase/supabase-js";
import { convertData } from "../helpers/auth.helper";

export class UserModel {
  protected name: string = "user-role";
  protected fetch: Fetch;
  protected createUserRole: Create;
  protected update: Update;
  protected databaseUser: DatabaseUser;

  constructor() {
    this.fetch = new Fetch(this.name);
    this.update = new Update(this.name);
    this.databaseUser = new DatabaseUser("users");
    this.createUserRole = new Create(this.name);
  }

  async getAll(
    errorHandler?: AuthErrorHandler
  ): Promise<null | UserSimpleCredentials[]> {
    let isError: boolean = false;
    let datasToReturn: UserSimpleCredentials[] = [];
    const datas = await this.databaseUser.getAllAsAdmin((error) => {
      errorHandler && errorHandler(error);
      isError = true;
      console.log(`${this.name}-error => ${error}`);
    });

    if (isError) {
      return null;
    }
    for (let i = 0; i < datas.length; i++) {
      datasToReturn.push(convertData(datas[i]));
    }
    return datasToReturn.filter((u) => u.role != undefined);
    // return datasToReturn;
  }

  async getAllByOrgId(
    id: string,
    errorHandler?: AuthErrorHandler
  ): Promise<null | UserSimpleCredentials[]> {
    let isError: boolean = false;
    let datasToReturn: UserSimpleCredentials[] = [];
    const datas = await this.databaseUser.getAllAsAdmin((error) => {
      errorHandler && errorHandler(error);
      isError = true;
      console.log(`${this.name}-error => ${error}`);
    });

    if (isError) {
      return null;
    }
    for (let i = 0; i < datas.length; i++) {
      datasToReturn.push(convertData(datas[i]));
    }
    return datasToReturn.filter((u) => u.role != undefined && u.org_id == id);
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

  /*
  Lire la documentation sur la classe de la base données User
  Ceci concerne la creation de l'organisation
  */
  async create(
    credentials: UserLoginCredentials,
    errorHandler?: AuthErrorHandler
  ): Promise<null | AuthData> {
    let isError = false;
    const data = await this.databaseUser.create(credentials, (error) => {
      errorHandler && errorHandler(error);
      isError = true;
    });
    if (!isError) {
      await this.createUserRole.insert(
        {
          uid: data?.user.id ?? "",
          firstName: "Admin",
          lastName: "",
          email: credentials.email,
          status: "Actif",
          phone: null,
          password: credentials.password,
          role: "enterprise",
        },
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
  Lire la documentation sur la classe de la base de données User
  */
  async createAsAdmin(
    credentials: UserSimpleCredentials,
    errorHandler?: AuthErrorHandler
  ): Promise<UserSimpleCredentials | null> {
    let isError = false;
    const data = await this.databaseUser.createAsAdmin(credentials, (error) => {
      errorHandler && errorHandler(error);
      isError = true;
    });
    if (!isError && data) {
      return convertData(data);
    }
    return null;
  }

  /*
  Lire la documentation...
  Ceci permet de mettre à jour un utilisateur qui n'est pas le possesseur de l'entreprise
  */
  async updateAsAdmin(
    dataToUpdate: UserSimpleCredentials,
    errorHandler: AuthErrorHandler
  ): Promise<UserSimpleCredentials | null> {
    let isError = false;

    const data = await this.databaseUser.updateAsAdmin(
      dataToUpdate,
      (error) => {
        errorHandler && errorHandler(error);
        isError = true;
      }
    );

    if (!isError) {
      return convertData(data);
    }

    return null;
  }

  /**
   * Ceci permet de recuperer la liste des utilisateurs
   */

  /*
  Lire la documentation...
  Ceci permet de mettre à jour un utilisateur sa date de connexion qui n'est pas le possesseur de l'entreprise
  */
  async updateLoginAsAdmin(
    id: string,
    dataToUpdate: UserSimpleCredentials,
    errorHandler: AuthErrorHandler
  ): Promise<UserSimpleCredentials | null> {
    let isError = false;

    const data = await this.databaseUser.updateConnexionAsAdmin(
      id,
      {
        lastLogin: dataToUpdate.lastLogin ?? "",
        status: dataToUpdate.status,
      },
      (error) => {
        errorHandler && errorHandler(error);
        isError = true;
      }
    );

    if (!isError) {
      return convertData(data);
    }

    return null;
  }

  /*
  Lire la documentation...
  Ceci permet de mettre à jour un utilisateur qui n'est pas le possesseur de l'entreprise
  */
  async deleteAsAdmin(
    id: string,
    errorHandler: AuthErrorHandler
  ): Promise<boolean> {
    let isError = false;
    const user = await this.databaseUser.deleteAsAdmin(id, (error) => {
      errorHandler && errorHandler(error);
      isError = true;
    });
    if (!isError) {
      console.log("data =>", user);
      return true;
    } else {
      return false;
    }
  }

  /*
  Lire la documentation sur la classe de la base données User
  */
  async signIn(
    credentials: UserLoginCredentials,
    errorHandler?: AuthErrorHandler
  ): Promise<null | LoginData> {
    let isError = false;

    const data = await this.databaseUser.signIn(credentials, (error) => {
      errorHandler && errorHandler(error);
      isError = true;
    });
    if (!isError) {
      const dataType = await this.databaseUser.getAsAdmin(
        data?.user.id ?? "",
        (error) => {
          const err: AuthError = error as unknown as AuthError;
          errorHandler && errorHandler(err);
          console.log("erreur-recuperation-role =>", error?.message);
          return null;
        }
      );
      const user = convertData(dataType);
      console.log("data =>", dataType);
      if (user.role) {
        return { auth: data, type: user.role };
      } else {
        return { auth: data, type: "enterprise" };
      }
    }
    return null;
  }

  async changeSimplePassword(
    credentials: Credentials,
    sessionInfos: {
      access_token: string;
      refresh_token: string;
    }
  ) {
    this.databaseUser.resetPassword(credentials.email);

    console.log("password-reset...");
    await this.databaseUser.setSession(sessionInfos);

    const data = await this.databaseUser.waitChangeState(async () => {
      await this.databaseUser.changePassword(credentials.password);
      data.subscription.unsubscribe();
    });
  }
}
