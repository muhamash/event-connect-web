import { z } from "zod";

export const checkoutSchema = z.object({
  number: z
    .string()
    .min(19, "Card number is incomplete")
    .regex(/^\d{4} \d{4} \d{4} \d{4}$/, "Invalid card number"),
  name: z.string().min(3, "Name is required"),
  expiry: z
    .string()
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Invalid expiry format (MM/YY)"),
  cvc: z
    .string()
    .min(3, "Invalid CVC")
    .max(4, "Invalid CVC"),
});