import { Fetch } from "../database/fetch";
import { Create } from "../database/create";
import { Update } from "../database/update";
import { Delete } from "../database/delete";
import { Storage } from "../database/storage";
import { DatabaseUser } from "../database/user";
import { ErrorHandler, StorageErrorHandler } from "../types/database.type";

import {
  CampaignUser,
  SubscriptionTrainingGet,
} from "../types/sub-training.type";
import { convertData } from "../helpers/auth.helper";
import { createCampaignUserFromSimple } from "../helpers/sub-training.helper";
import { PostgrestError } from "@supabase/supabase-js";

export class SubscriptionTrainingClass {
  protected name: string = "formation-subscription";
  protected fetch: Fetch;
  protected createClass: Create;
  protected updateClass: Update;
  protected deleteClass: Delete;
  protected storage: Storage;
  protected databaseUser: DatabaseUser;

  constructor() {
    this.fetch = new Fetch(this.name);
    this.updateClass = new Update(this.name);
    this.createClass = new Create(this.name);
    this.deleteClass = new Delete(this.name);
    this.storage = new Storage(this.name);
    this.databaseUser = new DatabaseUser("users");
  }

  async getAll(
    errorHandler?: ErrorHandler
  ): Promise<SubscriptionTrainingGet[] | null> {
    let isError = false;
    const data = (await this.fetch.GetAll((error) => {
      errorHandler && errorHandler(error);
      isError = true;
    })) as SubscriptionTrainingGet[];

    if (!isError) {
      return data;
    }

    return null;
  }

  //   async getAllByCampaignId(
  //     id: string,
  //     errorHandler?: ErrorHandler
  //   ): Promise<CampaignUser[] | null> {
  //     let isError = false;
  //     const data = (await this.fetch.GetAllByParameter("cid", id, (error) => {
  //       errorHandler && errorHandler(error);
  //       console.log("erreur-recuperation-sub-=>", error?.message);
  //       isError = true;
  //     })) as SubscriptionTrainingGet[];

  //     if (!isError && data && data.length) {
  //       let tabData: CampaignUser[] = [];
  //       for (let i = 0; i < data.length; i++) {
  //         let dataInstance = data[i];
  //         const usersimple: UserSimpleCredentials = convertData(
  //           await this.databaseUser.get(dataInstance.uid, (error) => {
  //             errorHandler && errorHandler(error as unknown as PostgrestError);
  //             console.log("erreur-recuperation-user-=>", error?.message);
  //             isError = true;
  //           })
  //         );

  //         if (!isError) {
  //           tabData.push(createCampaignUserFromSimple(dataInstance, usersimple));
  //         }
  //       }
  //       return tabData;
  //     }

  //     return null;
  //   }

  async getAllByCampaignId(
    id: string,
    errorHandler?: ErrorHandler
  ): Promise<CampaignUser[] | null> {
    let isError = false;

    const data = (await this.fetch.GetAllByParameter("cid", id, (error) => {
      errorHandler && errorHandler(error);
      console.log("erreur-recuperation-sub-" + id + "=>", error?.message);
      isError = true;
    })) as SubscriptionTrainingGet[];

    if (!isError && data && data.length) {
      const groupedByUser: Record<string, SubscriptionTrainingGet[]> = {};

      // ✅ 1. Grouper par uid
      for (const item of data) {
        if (!groupedByUser[item.uid]) groupedByUser[item.uid] = [];
        groupedByUser[item.uid].push(item);
      }

      const result: CampaignUser[] = [];

      // ✅ 2. Traiter chaque groupe
      for (const uid in groupedByUser) {
        const group = groupedByUser[uid];

        const userRaw = await this.databaseUser.getUserAsAdmin(uid, (error) => {
          errorHandler && errorHandler(error as unknown as PostgrestError);
          console.log("erreur-recuperation-user-" + uid + "=>", error?.message);
          isError = true;
        });

        if (isError || !userRaw) continue;

        const user = convertData(userRaw);

        // ✅ 3. Prendre une entrée de référence pour créer le CampaignUser
        const sample = group[0];

        // ✅ 4. Calcul de la progression : ratio des formations complétées
        const total = group.length;
        const completed = group.filter(
          (item) => item.status === "completed"
        ).length;
        const progress = Math.round((completed / total) * 100);

        const campaignUser: CampaignUser = {
          ...createCampaignUserFromSimple(sample, user),
          progress,
          completedFormations: group
            .filter((item) => item.status === "completed")
            .map((item) => item.fid),
        };

        result.push(campaignUser);
      }

      return result;
    }

    return null;
  }

  async create(
    req: SubscriptionTrainingGet,
    errorHandler?: ErrorHandler
  ): Promise<SubscriptionTrainingGet | null> {
    let isError = false;
    const data = (await this.createClass.insert(req, (error) => {
      console.log("erreur-campagne =>", error?.message);
      errorHandler && errorHandler(error);
    })) as SubscriptionTrainingGet;

    if (!isError) {
      return data;
    }

    return null;
  }

  async createMany(
    req: SubscriptionTrainingGet[],
    errorHandler?: ErrorHandler
  ): Promise<SubscriptionTrainingGet[] | null> {
    let isError = false;
    const data = (await this.createClass.insertMany(req, (error) => {
      console.log("erreur-campagne =>", error?.message);
      errorHandler && errorHandler(error);
    })) as SubscriptionTrainingGet[];

    if (!isError) {
      return data;
    }

    return null;
  }
}
