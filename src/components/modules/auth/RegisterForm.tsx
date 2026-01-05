"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
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
        Select,
        SelectContent,
        SelectItem,
        SelectTrigger,
        SelectValue,
    } from "@/components/ui/select";

import { UserRole } from "@/lib/constants/enum.constant";
import { createUser } from "@/lib/services/auth/auth.service";
import { RegisterSchemaType } from "@/lib/services/auth/auth.type";
import { RegisterSchema } from "@/lib/services/auth/auth.validation";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { startTransition, useTransition } from "react";
import toast from "react-hot-toast";


export default function RegisterForm ()
{
    const searchParams = useSearchParams();
    const hostLogin = searchParams.get( "tab" );

    const form = useForm<RegisterSchemaType>( {
        resolver: zodResolver( RegisterSchema ),
        defaultValues: {
            fullname: "",
            email: "",
            password: "",
            confirmPassword: "",
            role:  hostLogin ? UserRole.HOST : UserRole.USER,
        },
    } );

    const [ isPending, StartTransition ] = useTransition();
    const router = useRouter();
    

    const onSubmit = ( data: RegisterSchemaType ) =>
    {
        startTransition( async () =>
        {
            const response = await createUser( data );
            console.log( "Server Response:", response, data );

            if ( response?.success )
            {
                form.reset();
                toast.success( response?.message );
                router.push( "/login" );
            }
            else
            {
                toast.error( response?.message || "Something went wrong!" );
            }
        } );
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit( onSubmit )} className="space-y-5">

                {/* Full Name */}
                <FormField
                    control={form.control}
                    name="fullname"
                    render={( { field } ) => (
                        <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="John Doe"
                                    className="bg-background border-border"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Email */}
                <FormField
                    control={form.control}
                    name="email"
                    render={( { field } ) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input
                                    type="email"
                                    placeholder="you@example.com"
                                    className="bg-background border-border"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Password */}
                <FormField
                    control={form.control}
                    name="password"
                    render={( { field } ) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input
                                    type="password"
                                    placeholder="••••••••"
                                    className="bg-background border-border"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Confirm Password */}
                <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={( { field } ) => (
                        <FormItem>
                            <FormLabel>Confirm Password</FormLabel>
                            <FormControl>
                                <Input
                                    type="password"
                                    placeholder="••••••••"
                                    className="bg-background border-border"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* ROLE SELECTION */}
                {
                    !hostLogin && (
                        <FormField
                            control={form.control}
                            name="role"
                            render={( { field } ) => (
                                <FormItem>
                                    <FormLabel>Register As</FormLabel>
                                    <FormControl>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <SelectTrigger className="bg-background border-border">
                                                <SelectValue placeholder="Select role" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-black/60 backdrop-blur-md text-white font-bold">
                                                <SelectItem value="USER">User</SelectItem>
                                                <SelectItem value="ADMIN">Admin</SelectItem>
                                                <SelectItem value="HOST">Host</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    )
                }

                {/* Submit */}
                <Button
                    disabled={isPending}
                    type="submit"
                    className="w-full bg-orange-700 text-white hover:bg-black"
                >
                    {isPending ? "Creating Account..." : "Create Account"}
                </Button>

                {/* Already have an account */}
                <p className="text-center text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <Link
                        href="/login"
                        className="text-orange-700 hover:underline font-semibold"
                    >
                        Sign in
                    </Link>
                </p>
            </form>
        </Form>
    );
}
