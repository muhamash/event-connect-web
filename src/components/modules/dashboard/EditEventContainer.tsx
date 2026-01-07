"use client";

import { eventCategories } from "@/components/data/mockData";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import
    {
        Popover,
        PopoverContent,
        PopoverTrigger,
    } from "@/components/ui/popover";
import
    {
        Select,
        SelectContent,
        SelectItem,
        SelectTrigger,
        SelectValue,
    } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { updateEventAction } from "@/lib/services/event/event.service";
import { EventFormValues } from "@/lib/services/event/event.type";
import { eventSchema } from "@/lib/services/event/event.validation";
import { cloudinaryUpSingleImage } from "@/lib/services/services.controller";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { motion } from "framer-motion";
import
    {
        ArrowLeft, BotIcon, Calendar1Icon, CalendarIcon, Clock, ImagePlus,
        MapPin,
        Sparkles,
        Users
    } from "lucide-react";
import { useRouter } from "next/navigation";
import { use, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

interface EditEventProps {
    eventPromise: Promise<any>;
    sessionUserId?: string;
};

const EditEvent = ({ eventPromise, sessionUserId }: EditEventProps) => {
    const router = useRouter();
    const eventData = use( eventPromise )?.data;

  const [isPaid, setIsPaid] = useState(eventData.joiningFee > 0);
  const [imagePreview, setImagePreview] = useState<string | null>(eventData.image || null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isPending, startTransition] = useTransition();

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: eventData.title || "",
      category: eventData.category || "",
      description: eventData.description || "",
      date: eventData.date ? new Date(eventData.date) : undefined,
      time: eventData.time || "",
      location: eventData.location || "",
      image: eventData.image || null,
      maxParticipants: eventData.maxParticipants || 2,
      joiningFee: eventData.joiningFee || 0,
    },
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setImageFile(file);

    if (!file) return;

    const base64File = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error("File reading failed"));
      reader.readAsDataURL(file);
    });

    setImagePreview(base64File);
  };

  const onSubmit = (data: EventFormValues) => {
    startTransition(async () => {
      try {
        if (isPaid && data.joiningFee < 1) {
          toast.error("Your event is paid but joining fee remained 0!");
          return;
        }

        let imageUrl = data.image;

        if (imageFile) {
          const MAX_SIZE = 150 * 1024;
          if (imageFile.size > MAX_SIZE) {
            toast.error("Image size must be less than 150KB");
            return;
          }

          const base64File = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = () => reject(new Error("File reading failed"));
            reader.readAsDataURL(imageFile);
          });

          setImagePreview(base64File);

          const res = await cloudinaryUpSingleImage(base64File);
          if (!res.success) {
            toast.error(res.message || "Image upload failed");
            return;
          }

          imageUrl = res.url;
        }

        const payload = {
          title: data.title,
          category: data.category,
          description: data.description,
          image: imageUrl,
          date: new Date(data.date),
          time: data.time,
          location: data.location,
          maxParticipants: data.maxParticipants,
          joiningFee: isPaid ? data.joiningFee : 0,
        };

        const result = await updateEventAction(eventData.id, payload); 

        if (result?.success) {
          toast.success(result.message || "Event updated successfully");
          router.push("/dashboard");
        }
      } catch (error: any) {
        toast.error(error.message || "Something went wrong");
      }
    });
  };

    return (
        <div className="min-h-screen bg-background">
            <div className="pt-24 pb-12">
                <div className="container mx-auto px-4 max-w-3xl">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <Button variant="ghost" onClick={() => router.back()} className="mb-6">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back
                        </Button>

                        <div className="mb-8">
                            <h1 className="text-3xl md:text-4xl font-bold mb-2">
                                Edit{" "}
                                <span className="bg-gradient-primary bg-clip-text text-transparent">
                                    {eventData?.title}
                                </span>
                            </h1>
                            <p className="text-muted-foreground">
                                Update the details of your event below
                            </p>
                        </div>

                        <Form {...form}>
                            <form onSubmit={form.handleSubmit( onSubmit )} className="space-y-6">
                
                                {/* IMAGE */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <ImagePlus className="h-5 w-5 text-primary" />
                                            Event Image
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        {imagePreview ? (
                                            <img src={imagePreview} className="h-64 w-full object-cover rounded-lg mb-4" />
                                        ) : null}
                                        <Input type="file" accept="image/*" onChange={handleImageUpload} />
                                    </CardContent>
                                </Card>

                                {/* BASIC INFO */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Sparkles className="h-5 w-5 text-primary" />
                                            Basic Information
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <FormField name="title" control={form.control} render={( { field } ) => (
                                            <FormItem>
                                                <FormLabel>Event Title</FormLabel>
                                                <FormControl><Input {...field} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )} />

                                        <FormField name="category" control={form.control} render={( { field } ) => (
                                            <FormItem>
                                                <FormLabel>Category</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent className="bg-black">
                                                        {eventCategories.map( c => (
                                                            <SelectItem key={c} value={c}>{c}</SelectItem>
                                                        ) )}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )} />

                                        <FormField name="description" control={form.control} render={( { field } ) => (
                                            <FormItem>
                                                <FormLabel>Description</FormLabel>
                                                <FormControl><Textarea {...field} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )} />
                                    </CardContent>
                                </Card>

                                {/* DATE & TIME */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Calendar1Icon className="h-5 w-5 text-primary" />
                                            Date & Time
                                        </CardTitle>
                                    </CardHeader>

                                    <CardContent className="grid md:grid-cols-2 gap-4">
                                        {/* DATE */}
                                        <FormField control={form.control} name="date" render={( { field } ) => (
                                            <FormItem className="flex flex-col gap-2">
                                                <FormLabel>Date</FormLabel>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <FormControl>
                                                            <Button
                                                                type="button"
                                                                variant="outline"
                                                                className={`
                                  h-10 w-full justify-between
                                  bg-background border-border
                                  px-3 font-normal
                                  ${ !field.value && "text-muted-foreground" }
                                `}
                                                            >
                                                                {field.value ? format( field.value, "PPP" ) : "Select date"}
                                                                <CalendarIcon className="h-4 w-4 opacity-50" />
                                                            </Button>
                                                        </FormControl>
                                                    </PopoverTrigger>

                                                    <PopoverContent align="start" className="w-auto p-3">
                                                        <Calendar
                                                            mode="single"
                                                            selected={field.value}
                                                            onSelect={field.onChange}
                                                            disabled={date => date <= new Date( new Date().setHours( 0, 0, 0, 0 ) )}
                                                            initialFocus
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                                <FormMessage />
                                            </FormItem>
                                        )} />

                                        {/* TIME */}
                                        <FormField control={form.control} name="time" render={( { field } ) => (
                                            <FormItem className="flex flex-col gap-2">
                                                <FormLabel>Time</FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                        <Input type="time" className="h-10 pl-10 bg-background border-border" {...field} />
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )} />
                                    </CardContent>
                                </Card>

                                {/* LOCATION & CAPACITY */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <MapPin className="h-5 w-5 text-primary" />
                                            Location
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <FormField name="location" control={form.control} render={( { field } ) => (
                                            <FormItem>
                                                <FormLabel>Venue</FormLabel>
                                                <FormControl><Input {...field} /></FormControl>
                                            </FormItem>
                                        )} />

                                        <FormField name="maxParticipants" control={form.control} render={( { field } ) => (
                                            <FormItem>
                                                <FormLabel>Maximum Attendees</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        value={field.value ?? ""}
                                                        onChange={e => field.onChange( Number( e.target.value ) )}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )} />
                                    </CardContent>
                                </Card>

                                {/* PRICING */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Users className="h-5 w-5 text-primary" />
                                            Capacity & Pricing
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <span>Paid Event</span>
                                            <Switch
                                                checked={isPaid}
                                                onCheckedChange={v =>
                                                {
                                                    setIsPaid( v );
                                                    if ( !v ) form.setValue( "joiningFee", 0 );
                                                }}
                                            />
                                        </div>

                                        {isPaid && (
                                            <FormField name="joiningFee" control={form.control} render={( { field } ) => (
                                                <FormItem>
                                                    <FormLabel>Ticket Price</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            step="0.01"
                                                            value={field.value ?? ""}
                                                            onChange={e => field.onChange( Number( e.target.value ) )}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )} />
                                        )}
                                    </CardContent>
                                </Card>

                                <Button disabled={isPending} type="submit" className="w-full">
                                    <BotIcon className="h-4 w-4 mr-2" />
                                    {isPending ? "Updating..." : "Update Event"}
                                </Button>
                            </form>
                        </Form>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default EditEvent;
