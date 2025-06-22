import { SupabaseClient } from "@supabase/supabase-js";
import SupabaseConfig from "../config/database.config";
import { ErrorHandler } from "../types/database.type";

export class Create {
  protected name: string = "";
  protected supabase: SupabaseClient;

  constructor(table_name: string) {
    this.supabase = SupabaseConfig;
    this.name = table_name;
  }

  async insert(payload: Array<Object>, errorHandler ?: ErrorHandler) {
    const { data, error } = await this.supabase
      .from(this.name)
      .insert(payload);

    if (error) {
      errorHandler && errorHandler(error);
      return null;
    }

    return data;
  }
}
