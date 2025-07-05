import { Fetch } from "../database/fetch";
import { Create } from "../database/create";
import { Update } from "../database/update";
import { Delete } from "../database/delete";
import { Storage } from "../database/storage";
import { ErrorHandler } from "../types/database.type";
import { ActivityType } from "../types/activity.type";

export class ActivityClass {
  protected name: string = "activities";
  protected fetch: Fetch;
  protected createClass: Create;
  protected updateClass: Update;
  protected deleteClass: Delete;
  protected storage: Storage;

  constructor() {
    this.fetch = new Fetch(this.name);
    this.updateClass = new Update(this.name);
    this.createClass = new Create(this.name);
    this.deleteClass = new Delete(this.name);
    this.storage = new Storage(this.name);
  }

  async getAll(errorHandler?: ErrorHandler): Promise<ActivityType[] | null> {
    let isError = false;
    const data = (await this.fetch.GetAll((error) => {
      errorHandler && errorHandler(error);
      isError = true;
    })) as ActivityType[];

    if (!isError) {
      return data;
    }

    return null;
  }

  async getByOrg(
    id: string,
    errorHandler?: ErrorHandler
  ): Promise<ActivityType[] | null> {
    let isError = false;
    const data = (await this.fetch.GetAllByParameter("org_id", id, (error) => {
      errorHandler && errorHandler(error);
      isError = true;
    })) as ActivityType[];

    if (!isError) {
      return data;
    }

    return null;
  }

  async create(
    req: ActivityType,
    errorHandler?: ErrorHandler
  ): Promise<ActivityType | null> {
    const data = (await this.createClass.insert(req, (error) => {
      console.log("erreur-activité =>", error?.message);
      errorHandler && errorHandler(error);
    })) as ActivityType;
    return data;
  }

  async update(
    id: string,
    req: ActivityType,
    errorHandler?: ErrorHandler
  ): Promise<ActivityType | null> {
    const data = (await this.updateClass.UpdateById(id, req, (error) => {
      console.log("erreur-activité =>", error?.message);
      errorHandler && errorHandler(error);
    })) as ActivityType;
    return data;
  }

  async deleteActivity(
    id: string,
    errorHandler?: ErrorHandler
  ): Promise<ActivityType | null> {
    let isError = false;
    const data = (await this.deleteClass.DeleteById(id, (error) => {
      errorHandler && errorHandler(error);
      isError = true;
    })) as ActivityType;

    if (!isError) {
      if (data) {
        console.log("delete-" + this.name + "-id-with-" + data);
      } else {
        console.log(`no-formation-to-delete..`);
      }
      return data;
    }

    return null;
  }

  async deleteAll(org_id: string, errorHandler?: ErrorHandler) {
    let isError = false;
    const data = (await this.deleteClass.DeleteByParameter(
      "org_id",
      org_id,
      (error) => {
        errorHandler && errorHandler(error);
        isError = true;
      }
    )) as ActivityType[];

    if (!isError) {
      console.log("delete-" + this.name + "-id-" + data);
      return data;
    }

    return null;
  }
}
