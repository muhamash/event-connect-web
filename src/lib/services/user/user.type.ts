import z from "zod";
import { editProfileSchema } from "./user.validation";



export type EditProfileFormValues = z.infer<typeof editProfileSchema>;