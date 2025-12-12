import { clsx, type ClassValue } from "clsx";
import type { LucideIcon } from "lucide-react";
import * as Icons from "lucide-react";
import { twMerge } from "tailwind-merge";
import { ZodObject } from "zod";
import { IInputErrorState } from "./utils.type";

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
