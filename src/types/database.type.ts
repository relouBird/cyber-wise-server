import { AuthError, PostgrestError } from "@supabase/supabase-js";

export type ErrorHandler = (error: PostgrestError | null) => void;
export type AuthErrorHandler = (error: AuthError | null) => void;
export type StorageErrorHandler = (error: RangeError | null) => void;
 