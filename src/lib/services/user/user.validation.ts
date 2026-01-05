import { z } from "zod";

export const editProfileSchema = z.object({
  fullname: z.string().min(2, "Name must be at least 2 characters"),
  location: z.string().min(2, "Location is required"),
  bio: z.string().min(10, "Bio must be at least 10 characters"),
  interests: z.array(z.string()).min(1, "Select at least one interest"),
});
