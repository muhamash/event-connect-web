import z from "zod";
import { checkoutSchema } from "./checkout.validation";


export type CheckoutFormValues = z.infer<typeof checkoutSchema>;