import { supabase } from "../supabase";

export const newChannel = async (userId: string) =>
  await supabase.from("ChatRooms").insert({ user_id: userId, room_name: name });
