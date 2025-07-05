import { Fetch } from "../database/fetch";
import { Create } from "../database/create";
import { Update } from "../database/update";
import { Delete } from "../database/delete";
import { Storage } from "../database/storage";
import { ErrorHandler, StorageErrorHandler } from "../types/database.type";
import { CourseType } from "../types/training.type";

export class CoursesClass {
  protected name: string = "courses";
  protected fetchClass: Fetch;
  protected createClass: Create;
  protected updateClass: Update;
  protected deleteClass: Delete;
  protected storage: Storage;

  constructor() {
    this.fetchClass = new Fetch(this.name);
    this.updateClass = new Update(this.name);
    this.createClass = new Create(this.name);
    this.deleteClass = new Delete(this.name);
    this.storage = new Storage(this.name);
  }

  async getAll(errorHandler?: ErrorHandler): Promise<null | CourseType[]> {
    let isError = false;
    const data = (await this.fetchClass.GetAll((error) => {
      isError = true;
      errorHandler && errorHandler(error);
    })) as CourseType[];

    if (!isError) {
      return data;
    }
    return null;
  }

  async getAllByFormationId(id: string, errorHandler?: ErrorHandler) {
    let isError = false;
    const data = (await this.fetchClass.GetAllByParameter(
      "formation_id",
      id,
      (error) => {
        isError = true;
        console.log("erreur-courses =>", error?.message);
        errorHandler && errorHandler(error);
      }
    )) as CourseType[];

    if (!isError) {
      return data;
    }
    return null;
  }

  async get(
    id: string,
    errorHandler?: ErrorHandler
  ): Promise<null | CourseType> {
    let isError = false;
    const data = (await this.fetchClass.GetById(id, (error) => {
      isError = true;
      errorHandler && errorHandler(error);
    })) as CourseType;

    if (!isError) {
      return data;
    }
    return null;
  }

  async create(
    req: CourseType,
    errorHandler?: ErrorHandler
  ): Promise<CourseType | null> {
    const data = (await this.createClass.insert(req, (error) => {
      console.log("erreur-courses =>", error?.message);
      errorHandler && errorHandler(error);
    })) as CourseType;
    return data;
  }

  async update(
    id: string,
    req: CourseType,
    errorHandler?: ErrorHandler
  ): Promise<CourseType | null> {
    const data = (await this.updateClass.UpdateById(id, req, (error) => {
      console.log("erreur-courses =>", error?.message);
      errorHandler && errorHandler(error);
    })) as CourseType;
    return data;
  }

  async delete(
    id: string,
    errorHandler?: ErrorHandler
  ): Promise<CourseType | null> {
    let isError = false;
    const data = (await this.deleteClass.DeleteById(id, (error) => {
      console.log("erreur-courses =>", error?.message);
      errorHandler && errorHandler(error);
      isError = true;
    })) as CourseType;

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

  async deleteAllByTraining(
    formation_id: string | number,
    errorHandler?: ErrorHandler
  ) {
    let isError = false;
    const data = (await this.deleteClass.DeleteByParameter(
      "formation_id",
      String(formation_id),
      (error) => {
        errorHandler && errorHandler(error);
        isError = true;
      }
    )) as CourseType[];

    if (!isError) {
      console.log("delete-" + this.name + "-id-" + data);
      return data;
    }

    return null;
  }

  async uploadImage(
    name: string,
    dataImage: File,
    type: string,
    errorHandler?: StorageErrorHandler
  ) {
    let isError: boolean = false;
    let data: {
      id: string;
      path: string;
      fullPath: string;
    } | null = null;
    const buck = await this.storage.getBucket();

    if (buck) {
      data = await this.storage.uploadFile(name, dataImage, type, (error) => {
        isError = true;
        errorHandler && errorHandler(error);
      });
    } else {
      await this.storage.createBucket();
      data = await this.storage.uploadFile(name, dataImage, type, (error) => {
        isError = true;
        errorHandler && errorHandler(error);
      });
    }

    if (isError) {
      return null;
    }
    return data;
  }

  async getUrl(name: string): Promise<string> {
    let data: {
      publicUrl: string;
    } | null = null;
    try {
      const buck = await this.storage.getBucket();
      if (buck) {
        data = await this.storage.getUrlFile(name);
      } else {
        await this.storage.createBucket();
        data = await this.storage.getUrlFile(name);
      }
    } catch (error) {}
    return data?.publicUrl ?? "";
  }
}
