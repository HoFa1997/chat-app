import { object, string, InferType, boolean, number } from "yup";
import { ChannelTypeEnum } from "../enum";

export const NewChannelsSchema = object().shape({
  name: string()
    .required("Please provide a name.")
    .max(100, "Name must be less than or equal to 100 characters."),
  slug: string().required("Please provide a slug."),
  description: string().max(1000, "Description must be less than or equal to 1000 characters."),
  member_limit: number(),
  type: string().oneOf(Object.values(ChannelTypeEnum)).default(ChannelTypeEnum.PUBLIC),
  is_avatar_set: boolean().default(false),
  allow_emoji_reactions: boolean().default(true),
  mute_in_app_notifications: boolean().default(false),
});

export type ChannelsSchemaType = InferType<typeof NewChannelsSchema>;
