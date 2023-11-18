import { supabase } from "../supabase";
import { Database } from "@/types/supabase";

export type TChannel = Database["public"]["Tables"]["channels"]["Row"];

export const getAllChannels = async () => await supabase.from("channels").select("*").throwOnError();
