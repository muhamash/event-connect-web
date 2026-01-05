import z from "zod";
import { LoginSchema, RegisterSchema } from "./auth.validation";


export type LoginSchemaType = z.infer<typeof LoginSchema>;
export type RegisterSchemaType = z.infer<typeof RegisterSchema>;