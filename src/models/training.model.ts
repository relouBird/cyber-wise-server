import { Fetch } from "../database/fetch";
import { Create } from "../database/create";
import { Update } from "../database/update";
import { Delete } from "../database/delete";
import { Storage } from "../database/storage";
import { ErrorHandler, StorageErrorHandler } from "../types/database.type";
import { FormationType } from "../types/training.type";
import { error } from "console";

export class TrainingClass {
  protected name: string = "formations";
  protected fetch: Fetch;
  protected createTraining: Create;
  protected update: Update;
  protected deleteClass: Delete;
  protected storage: Storage;

  constructor() {
    this.fetch = new Fetch(this.name);
    this.update = new Update(this.name);
    this.createTraining = new Create(this.name);
    this.deleteClass = new Delete(this.name);
    this.storage = new Storage(this.name);
  }

  async getAll(errorHandler?: ErrorHandler): Promise<FormationType[] | null> {
    let isError = false;
    const data = (await this.fetch.GetAll((error) => {
      errorHandler && errorHandler(error);
      isError = true;
    })) as FormationType[];

    if (!isError) {
      return data;
    }

    return null;
  }

  async create(
    req: FormationType,
    errorHandler?: ErrorHandler
  ): Promise<FormationType | null> {
    const data = (await this.createTraining.insert(req, (error) => {
      console.log("erreur-formation =>", error?.message);
      errorHandler && errorHandler(error);
    })) as FormationType;
    return data;
  }

  async deleteTraining(
    id: string,
    errorHandler?: ErrorHandler
  ): Promise<FormationType | null> {
    let isError = false;
    const data = (await this.deleteClass.DeleteById(id, (error) => {
      errorHandler && errorHandler(error);
      isError = true;
    })) as FormationType;

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

  async deleteAllTrainingDomain(
    domain_id: string | number,
    errorHandler?: ErrorHandler
  ) {
    let isError = false;
    const data = (await this.deleteClass.DeleteByParameter(
      "domainId",
      String(domain_id),
      (error) => {
        errorHandler && errorHandler(error);
        isError = true;
      }
    )) as FormationType[];

    if (!isError) {
      console.log("delete-" + this.name + "-id-" + data);
      return data;
    }

    return null;
  }

  async uploadImage(
    name: string,
    dataImage: File,
    errorHandler?: StorageErrorHandler
  ) {
    let isError: boolean = false;
    let data: {
      id: string;
      path: string;
      fullPath: string;
    } | null = null;

    if (await this.storage.getBucket()) {
      data = await this.storage.uploadFile(name, dataImage, (error) => {
        isError = true;
        errorHandler && errorHandler(error);
      });
    } else {
      await this.storage.createBucket();
      data = await this.storage.uploadFile(name, dataImage, (error) => {
        isError = true;
        errorHandler && errorHandler(error);
      });
    }

    if (isError) {
      return null;
    }
    return data;
  }

  async getUrl(
    name: string,
    errorHandler?: StorageErrorHandler
  ): Promise<string | null> {
    let isError: boolean = false;
    let data: {
      signedUrl: string;
    } | null = null;
    if (await this.storage.getBucket()) {
      data = await this.storage.getUrlFile(name, (error) => {
        isError = true;
        errorHandler && errorHandler(error);
      });
    } else {
      await this.storage.createBucket();
      data = await this.storage.getUrlFile(name, (error) => {
        isError = true;
        errorHandler && errorHandler(error);
      });
    }

    if (isError) {
      return null;
    }
    return data?.signedUrl ?? "";
  }
}
