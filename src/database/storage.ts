import { SupabaseClient } from "@supabase/supabase-js";
import SupabaseConfig from "../config/database.config";
import { ErrorHandler, StorageErrorHandler } from "../types/database.type";

export class Storage {
  protected name: string = "";
  protected supabase: SupabaseClient;

  constructor(table_name: string) {
    this.supabase = SupabaseConfig;
    this.name = table_name;
  }

  async createBucket(errorHandler?: StorageErrorHandler) {
    const { data, error } = await this.supabase.storage.createBucket(
      this.name,
      {
        public: true,
        allowedMimeTypes: ["image/png", "image/jpg", "image/jpeg"],
        fileSizeLimit: 10485760,
      }
    );

    if (error) {
      errorHandler && errorHandler(error);
      return null;
    }

    return data;
  }

  async updateBucket(errorHandler?: StorageErrorHandler) {
    const { data, error } = await this.supabase.storage.updateBucket(
      this.name,
      {
        public: true,
        allowedMimeTypes: ["image/png", "image/jpg", "image/jpeg"],
        fileSizeLimit: 1024,
      }
    );

    if (error) {
      errorHandler && errorHandler(error);
      return null;
    }

    return data;
  }

  async getBucket(errorHandler?: StorageErrorHandler) {
    const { data, error } = await this.supabase.storage.getBucket("avatars");

    if (error) {
      errorHandler && errorHandler(error);
      return null;
    }

    return data;
  }

  async uploadFile(
    name: string,
    dataImage: File,
    type: string,
    errorHandler?: StorageErrorHandler
  ) {
    const { data, error } = await this.supabase.storage
      .from(this.name)
      .upload(`${this.name}/${name}`, dataImage, {
        contentType: type,
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      errorHandler && errorHandler(error);
      return null;
    }

    return data;
  }

  async downloadFile(name: string, errorHandler?: StorageErrorHandler) {
    const { data, error } = await this.supabase.storage
      .from(this.name)
      .download(`${this.name}/${name}`);

    if (error) {
      errorHandler && errorHandler(error);
      return null;
    }

    return data;
  }

  async getUrlFile(name: string, errorHandler?: StorageErrorHandler) {
    const { data } = await this.supabase.storage
      .from(this.name)
      .getPublicUrl(`${this.name}/${name}`);

    return data;
  }
}
