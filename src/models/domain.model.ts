import { Fetch } from "../database/fetch";
import { Create } from "../database/create";
import { Update } from "../database/update";
import { ErrorHandler } from "../types/database.type";
import { DomainType } from "../types/training.type";
import { Delete } from "../database/delete";

export class DomainClass {
  protected name: string = "domains";
  protected fetch: Fetch;
  protected createDomain: Create;
  protected update: Update;
  protected deleteClass: Delete;

  constructor() {
    this.fetch = new Fetch(this.name);
    this.update = new Update(this.name);
    this.createDomain = new Create(this.name);
    this.deleteClass = new Delete(this.name);
  }

  async getAll(errorHandler?: ErrorHandler): Promise<DomainType[] | null> {
    let isError = false;
    const data = (await this.fetch.GetAll((error) => {
      errorHandler && errorHandler(error);
      isError = true;
    })) as DomainType[];

    if (!isError) {
      return data;
    }

    return null;
  }

  async get(
    id: string,
    errorHandler?: ErrorHandler
  ): Promise<DomainType | null> {
    let isError = false;
    const data = (await this.fetch.GetById(id, (error) => {
      errorHandler && errorHandler(error);
      isError = true;
    })) as DomainType;

    if (!isError) {
      return data;
    }

    return null;
  }

  async delete(
    id: string,
    errorHandler?: ErrorHandler
  ): Promise<DomainType | null> {
    let isError = false;
    const data = (await this.deleteClass.DeleteById(id, (error) => {
      errorHandler && errorHandler(error);
      isError = true;
    })) as DomainType;

    if (!isError) {
      console.log("delete-" + this.name + "-id-" + data.id);
      return data;
    }

    return null;
  }

  async create(
    req: DomainType,
    errorHandler?: ErrorHandler
  ): Promise<DomainType | null> {
    const data = (await this.createDomain.insert(req, (error) => {
      console.log("erreur-formation =>", error?.message);
      errorHandler && errorHandler(error);
    })) as DomainType;
    return data;
  }
}
