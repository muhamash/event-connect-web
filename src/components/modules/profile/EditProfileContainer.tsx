"use client";

import { interestOptions } from "@/components/data/mockData";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import
  {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
import
  {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { EditProfileFormValues } from "@/lib/services/user/user.type";
import { editProfileSchema } from "@/lib/services/user/user.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { ArrowLeft, Camera, Save, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { use } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

export interface EditProfileProps
{
  userPromise: Promise<any>;
}


const EditProfile = ( {userPromise}: EditProfileProps ) =>
{
  const user = (use( userPromise ))?.data
  // console.log( userData )
  
  const router = useRouter();
  // const user = mockUsers[0];

  const form = useForm<EditProfileFormValues>( {
    resolver: zodResolver( editProfileSchema ),
    defaultValues: {
      fullname: user?.fullname ?? "",
      bio: user?.bio ?? "",
      location: user?.location ?? "",
      interests: user?.interests ?? [],
    },
  } );;

  const toggleInterest = (interest: string) => {
    const current = form.getValues("interests");

    form.setValue(
      "interests",
      current.includes(interest)
        ? current.filter((i) => i !== interest)
        : [...current, interest],
      { shouldValidate: true }
    );
  };

  const onSubmit = (data: EditProfileFormValues) => {
    console.log("FORM DATA 👉", data);
    toast.success("Profile updated successfully!");
    // router.push(`/profile/${user.id}`);
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Button variant="ghost" onClick={() => router.back()} className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Edit Profile</CardTitle>
            </CardHeader>

            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  {/* Avatar */}
                  <div className="flex justify-center">
                    <div className="relative">
                      <Avatar className="h-32 w-32 border-4 border-primary/20">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback className="text-3xl bg-primary text-primary-foreground">
                          {user.fullname.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <Button
                        type="button"
                        size="icon"
                        className="absolute bottom-0 right-0 rounded-full"
                      >
                        <Camera className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Name */}
                  <FormField
                    control={form.control}
                    name="fullname"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Location */}
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input placeholder="City, State" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Bio */}
                  <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bio</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            className="min-h-[120px]"
                            placeholder="Tell us about yourself..."
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Interests */}
                  <FormField
                    control={form.control}
                    name="interests"
                    render={() => (
                      <FormItem>
                        <FormLabel>Interests</FormLabel>
                        <div className="flex flex-wrap gap-2 pt-2">
                          {interestOptions.map((interest) => {
                            const active =
                              form.watch("interests").includes(interest);

                            return (
                              <Badge
                                key={interest}
                                variant={active ? "default" : "outline"}
                                onClick={() => toggleInterest(interest)}
                                className="cursor-pointer"
                              >
                                {interest}
                                {active && <X className="h-3 w-3 ml-1" />}
                              </Badge>
                            );
                          })}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Actions */}
                  <div className="flex gap-4 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1"
                      onClick={() => router.back()}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" className="flex-1">
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default EditProfile;