import { clsx, type ClassValue } from "clsx";
import type { LucideIcon } from "lucide-react";
import * as Icons from "lucide-react";
import { twMerge } from "tailwind-merge";
import { ZodObject } from "zod";
import { DateFormatOptions, IInputErrorState } from "../types/utils.type";

export const zodValidator = <T>(payload: T, schema: ZodObject) => {
    const validatedPayload = schema.safeParse(payload)

    if (!validatedPayload.success) {
        return {
            success: false,
            errors: validatedPayload.error.issues.map(issue => {
                return {
                    field: issue.path[0],
                    message: issue.message,
                }
            })
        }
    }

    return {
        success: true,
        data: validatedPayload.data,
    }
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const getIconComponent = (iconName: string): LucideIcon => {

    const IconComponent = Icons[iconName as keyof typeof Icons]

    if (!IconComponent) {
        return Icons.HelpCircle
    }

    return IconComponent as LucideIcon;
}


export const getInputFieldError = (
  fieldName: string,
  state: IInputErrorState | null
) => {
  if (state && state.errors) {
    const error = state.errors.find((err) => err.field === fieldName);
    return error ? error.message : null;
  } else {
    return null;
  }
};


export function formatDateTime(date: string | Date): string {
    return new Date(date).toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

export function queryStringFormatter(searchParamsObj: { [key: string]: string | string[] | undefined }): string {
    let queryString = "";
    // {searchTerm: "John", speciality: "Cardiology"}
    // after entries: [ ["searchTerm", "John"], ["speciality", "Cardiology"] ]
    const queryArray = Object.entries(searchParamsObj).map(([key, value]) => {
        if (Array.isArray(value)) {
            // { speciality: ["Cardiology", "Neurology"] } 
            // ["Cardiology", "Neurology"]
            // ?speciality=Cardiology&speciality=Neurology
            return value.map((v) => `${key}=${encodeURIComponent(v)}`).join("&");
        }
        else if (value !== undefined) {
            return `${key}=${encodeURIComponent(value)}`;
        }
        return "";
    });
    queryString = queryArray.filter((q) => q !== "").join("&"); // searchTerm=John&speciality=Cardiology&speciality=Neurology
    return queryString;
}

export function getPrismaErrorMessage(error: any) {
  if (error.code === "P2002") {
    return "A record with this value already exists.";
  }

  if (error.code === "P2025") {
    return "Record not found.";
  }

  return "Database error occurred.";
}

// utils/auth-error.ts
export const extractNextAuthError = ( response: any ) =>
{
    if ( !response ) return "Unknown authentication error";

    // Case 1: Standard NextAuth credential error
    if ( response.error === "CredentialsSignin" )
    {
        return "Invalid email or password";
    }

    // Case 2: NextAuth returns custom backend message (if any)
    if ( response.error && typeof response.error === "string" )
    {
        try
        {
            // Some setups return JSON strings inside error
            const parsed = JSON.parse( response.error );
            return parsed.message || parsed.error || "Authentication failed";
        } catch
        {
            return response.error; // simple string error
        }
    }

    // Case 3: Generic fallback
    return "Authentication failed";
};

export const formatDate = (
    isoDate: string | Date,
    options: DateFormatOptions = {}
): string =>
{
    const {
        locale = "en-US",
        withTime = true,
        withSeconds = false,
    } = options;

    const date = typeof isoDate === "string" ? new Date( isoDate ) : isoDate;

    if ( isNaN( date.getTime() ) ) return "Invalid date";

    const dateOptions: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "short",
        day: "2-digit",
    };

    const timeOptions: Intl.DateTimeFormatOptions = {
        hour: "2-digit",
        minute: "2-digit",
        ...( withSeconds && { second: "2-digit" } ),
    };

    return new Intl.DateTimeFormat( locale, {
        ...dateOptions,
        ...( withTime ? timeOptions : {} ),
    } ).format( date );
};