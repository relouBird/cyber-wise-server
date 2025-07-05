import { Fetch } from "../database/fetch";
import { Create } from "../database/create";
import { Update } from "../database/update";
import { Delete } from "../database/delete";
import { Storage } from "../database/storage";
import { ErrorHandler, StorageErrorHandler } from "../types/database.type";
import {
  CampaignDataGetInterface,
  CampaignDataReturnInterface,
  CreateCampaignInterface,
} from "../types/campaigns.type";
import {
  reverseTransformCampaignData,
  transformCampaignData,
} from "../helpers/campaigns.helper";

export class CampaignClass {
  protected name: string = "campaigns";
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

  async getAll(
    errorHandler?: ErrorHandler
  ): Promise<CampaignDataReturnInterface[] | null> {
    let isError = false;
    const data = (await this.fetch.GetAll((error) => {
      errorHandler && errorHandler(error);
      isError = true;
    })) as CampaignDataGetInterface[];

    if (!isError) {
      let tabData: CampaignDataReturnInterface[] = [];
      for (let i = 0; i < data.length; i++) {
        tabData.push(transformCampaignData(data[i]));
      }

      return tabData;
    }

    return null;
  }

  async getByOrg(
    id: string,
    errorHandler?: ErrorHandler
  ): Promise<CampaignDataReturnInterface[] | null> {
    let isError = false;
    const data = (await this.fetch.GetAllByParameter("org_id", id, (error) => {
      errorHandler && errorHandler(error);
      isError = true;
    })) as CampaignDataGetInterface[];

    if (!isError) {
      let tabData: CampaignDataReturnInterface[] = [];
      for (let i = 0; i < data.length; i++) {
        tabData.push(transformCampaignData(data[i]));
      }

      return tabData;
    }

    return null;
  }

  async create(
    req: CreateCampaignInterface,
    errorHandler?: ErrorHandler
  ): Promise<CampaignDataReturnInterface | null> {
    const data = (await this.createClass.insert(req, (error) => {
      console.log("erreur-activité =>", error?.message);
      errorHandler && errorHandler(error);
    })) as CampaignDataGetInterface;
    return data && transformCampaignData(data);
  }

  async update(
    id: string,
    req: CampaignDataReturnInterface,
    errorHandler?: ErrorHandler
  ): Promise<CampaignDataReturnInterface | null> {
    const data = (await this.updateClass.UpdateById(
      id,
      reverseTransformCampaignData(req),
      (error) => {
        console.log("erreur-activité =>", error?.message);
        errorHandler && errorHandler(error);
      }
    )) as CampaignDataGetInterface;
    return transformCampaignData(data);
  }

  async deleteCampaign(
    id: string,
    errorHandler?: ErrorHandler
  ): Promise<CampaignDataReturnInterface | null> {
    let isError = false;
    const data = (await this.deleteClass.DeleteById(id, (error) => {
      errorHandler && errorHandler(error);
      isError = true;
    })) as CampaignDataGetInterface;

    if (!isError) {
      if (data) {
        console.log("delete-" + this.name + "-id-with-" + data);
      } else {
        console.log(`no-campaign-to-delete..`);
      }
      return transformCampaignData(data);
    }

    return null;
  }

  async deleteAll(
    org_id: string,
    errorHandler?: ErrorHandler
  ): Promise<CampaignDataReturnInterface[] | null> {
    let isError = false;
    const data = (await this.deleteClass.DeleteByParameter(
      "org_id",
      org_id,
      (error) => {
        errorHandler && errorHandler(error);
        isError = true;
      }
    )) as CampaignDataGetInterface[];

    if (!isError) {
      console.log("delete-" + this.name + "-id-" + data);
      let tabData: CampaignDataReturnInterface[] = [];
      for (let i = 0; i < data.length; i++) {
        tabData.push(transformCampaignData(data[i]));
      }
      return tabData;
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

    try {
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
    } catch (error) {
      console.log(error);
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
    } catch (error) {
      console.log(error);
    }
    return data?.publicUrl ?? "";
  }
}
