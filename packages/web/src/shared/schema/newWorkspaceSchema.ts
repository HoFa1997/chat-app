import { object, string, InferType } from "yup";

export const NewWorkspacesSchema = object().shape({
  name: string()
    .required("Please provide a name.")
    .max(100, "Name must be less than or equal to 100 characters."),
  slug: string().required("Please provide a slug."),
  description: string().max(1000, "Description must be less than or equal to 1000 characters."),
});

export type WorkspacesSchemaTypes = InferType<typeof NewWorkspacesSchema>;
