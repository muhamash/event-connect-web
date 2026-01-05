import { UserRole } from "@/lib/constants/enum.constant";
import z from "zod";



export const LoginSchema = z.object({
  email: z.string().email({ message: "Enter a valid email" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
} );


export const RegisterSchema = z
  .object( {
    fullname: z
      .string()
      .min( 3, { message: "Full name must be at least 3 characters" } ),

    email: z.string().email( { message: "Enter a valid email" } ),

    role: z.nativeEnum(UserRole, {
      message: "Please select a role",
    }),
    password: z
      .string()
      .min( 6, { message: "Password must be at least 6 characters" } ),

    confirmPassword: z.string(),
  } )
  .refine( ( data ) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: [ "confirmPassword" ],
  } );