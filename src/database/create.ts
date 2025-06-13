import { SupabaseClient } from "@supabase/supabase-js";
import SupabaseConfig from "../config/database.config";

export class Create {
  protected name: string = "";
  protected supabase: SupabaseClient;

  constructor(table_name: string) {
    this.supabase = SupabaseConfig;
    this.name = table_name;
  };

  
}
